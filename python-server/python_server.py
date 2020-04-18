"""
Python server for the Virtual Assistant app

Attributes:
    CHUNK_SIZE (int): Size of byte chunk in bytes. Affects transfer speed
    DEFAULT_THUMB (str): Path to default thumbnail for an instruction
    INSTRUCTIONS_FOLDER (str): Path to folder with instructions
"""
import grpc
from concurrent import futures
import time
import os
import json
import shutil
from zipfile import ZipFile

# Imports for POST listenner server
from http.server import HTTPServer, BaseHTTPRequestHandler

# Import the generated gRPC classes
import server_pb2
import server_pb2_grpc

INSTRUCTIONS_FOLDER = "./instructions"
DEFAULT_THUMB = "./aux_data/default_thumb.jpg"

CHUNK_SIZE = 1024 * 1024  # 1MB


def get_size(start_path='.'):
    total_size = 0
    for dirpath, dirnames, filenames in os.walk(start_path):
        for f in filenames:
            fp = os.path.join(dirpath, f)
            # skip if it is symbolic link
            if not os.path.islink(fp):
                total_size += os.path.getsize(fp)

    return total_size


def get_file_chunks(filename):
    """
    Slices file into byte chunks for gRPC transfer

    Args:
        filename (str): Path to file to slice

    Yields:
        server_pb2.Chunk: byte chunk for gRPC stream
    """
    with open(filename, 'rb') as f:
        while True:
            piece = f.read(CHUNK_SIZE)
            if len(piece) == 0:
                return
            yield server_pb2.Chunk(buffer=piece)


def save_chunks_to_file(chunks, filename):
    """
    Concatenates received chunks to file

    Args:
        chunks (server_pb2.Chunk): byte chunk from gRPC stream
        filename (string): File to write to
    """
    with open(filename, 'wb') as f:
        for chunk in chunks:
            f.write(chunk.buffer)


class VirtualAssistantServicer(server_pb2_grpc.VirtualAssistantServicer):

    """
    Class that implements VirtualAssistant rpcs from server.proto
    """

    def GetAllInstructions(self, request, context):
        """
        Defines the body of GetAllInstructions rpc.
        Parses index.json of all instructions and returns an array of
        Thumbnails

        Args:
            request (server_pb2.InstructionRequest): Request msg
            context (gRPC context): gRPC context

        Returns:
            server_pb2.InstructionResponse: Description
        """
        print("All instructions request")

        response = server_pb2.AllInstructioinsResponse()
        instructions = os.listdir(INSTRUCTIONS_FOLDER)

        # Go through each instruction one-by-one and create a thumb out of it
        for instruction in instructions:
            path = "{}/{}".format(INSTRUCTIONS_FOLDER, instruction)
            thumbnail = server_pb2.InstructionThumbnail()

            # Parse index.json
            try:
                with open('{}/index.json'.format(path), 'r') as descr:
                    data = json.load(descr)
                    thumbnail.id = data['id']
                    thumbnail.name = data['name']
                    thumbnail.size = data['size']
                    thumbnail.description = data['description']
                    img_path = data['preview_url']
                    thumbnail.last_modified.timestamp.FromSeconds(
                        data['last_modified'])
                    thumbnail.step_count = data['step_count']
            except Exception as e:
                print("Something is wrong with {}".format(path))
                print(str(e))
                continue

            # Get thumbnail image
            try:
                with open("{}/media/{}".format(path, img_path), "rb") as thumb:
                    f = thumb.read()
                    thumbnail.image = bytes(f)
            except Exception:
                with open("{}".format(DEFAULT_THUMB), "rb") as thumb:
                    f = thumb.read()
                    thumbnail.image = bytes(f)

            # Append thumbnail to response
            response.thumbnails.extend([thumbnail])

        return response

    def GetInstruction(self, request, context):
        """
        Defines the body of GetInstruction rpc.
        Parses and returns steps.json for a particular instruction

        Args:
            request (server_pb2.InstructionRequest): Request msg
            context (gRPC context): gRPC context

        Returns:
            server_pb2.InstructionResponse: Instruction Response message
        """

        print("Instruction {} request".format(request.id))
        # Path to the instruction
        path = "{}/{}".format(INSTRUCTIONS_FOLDER, request.id)

        response = server_pb2.InstructionResponse()
        try:
            response.status = 1
            # Parse steps.json and put it in the response message
            with open('{}/steps.json'.format(path), 'r') as file:
                steps = json.load(file)
                for step in steps:
                    step_msg = server_pb2.Step()

                    step_msg.name = step['name']
                    step_msg.description = step['description']
                    step_msg.preview_url = step['preview_url']

                    for asset in step['assets']:
                        asset_msg = server_pb2.Asset()

                        asset_msg.name = asset['name']
                        asset_msg.media.type = asset['media']['type']
                        asset_msg.media.url = asset['media']['url']
                        asset_msg.media.description = asset['media']['description']

                        asset_msg.transform.position.x = asset['transform']['position']['x']
                        asset_msg.transform.position.y = asset['transform']['position']['y']
                        asset_msg.transform.position.z = asset['transform']['position']['z']
                        asset_msg.transform.orientation.x = asset['transform']['orientation']['x']
                        asset_msg.transform.orientation.y = asset['transform']['orientation']['y']
                        asset_msg.transform.orientation.z = asset['transform']['orientation']['z']
                        asset_msg.transform.scale = asset['transform']['scale']

                        asset_msg.billboard = asset['billboard']
                        asset_msg.hidden = asset['hidden']

                        step_msg.assets.extend([asset_msg])

                    response.steps.extend([step_msg])
        except Exception as e:
            print("Error on {} request: ".format(request.id), e)
            response.status = 0

        return response

    def DownloadMedia(self, request, context):
        """
        Defines the body of DownloadMedia rpc.
        The procedure returns chunked media.zip

        Args:
            request (server_pb2.MediaRequest): Request msg
            context (gRPC context): gRPC context

        Returns:
            server_pb2.Chunk: gRPC Chunk stream
        """

        # Define path to media folder
        media_path = "{}/{}/media".format(INSTRUCTIONS_FOLDER, request.id)
        # Define path to media.zip
        zip_path = "{}/{}/media".format(INSTRUCTIONS_FOLDER, request.id)

        # Create zip archive from media folder
        shutil.make_archive(zip_path, "zip", media_path)

        # Split and send media.zip archive
        return get_file_chunks(zip_path + ".zip")

    def LastModified(self, request, context):
        path = "{}/{}".format(INSTRUCTIONS_FOLDER, request.id)
        with open('{}/index.json'.format(path), 'r') as descr:
            data = json.load(descr)
            response = server_pb2.Timestamp()
            response.timestamp.FromSeconds(data['last_modified'])
            return response


class WebEditorServicer(server_pb2_grpc.WebEditorServicer):
    """
    Class that implements WebEditor rpcs from server.proto
    """

    def DownloadInstruction(self, request, context):
        """
        Defines the body of DownloadInstruction rpc.
        The procedure returns chunked instruction_id.zip

        Args:
            request (server_pb2.MediaRequest): Request msg
            context (gRPC context): gRPC context

        Returns:
            server_pb2.Chunk: gRPC Chunk stream
        """

        print("Web-editor request for instruction: {}".format(request.id))
        try:
            # Define path to media folder
            media_path = "{}/{}".format(INSTRUCTIONS_FOLDER, request.id)
            # Define path to instruction_id.zip
            zip_path = "{}/{}".format(INSTRUCTIONS_FOLDER, request.id)

            # Create zip archive from media folder
            shutil.make_archive(zip_path, "zip", media_path)

            # Split and send media.zip archive
            return get_file_chunks(zip_path + ".zip")

        except Exception as e:
            print("Download failed:\n", e)

    def UploadInstructions(self, request_iterator, context):
        """
        Defines the body of UploadInstructions rpc.
        The procedure returns upload status 1 - sucess, 0 - failure

        It will concatenate incoming chunks into zip file and unpack it
        Received zip file will be deleted after

        Args:
            request_iterator (server_pb2.Chunk): List of chunks
            context (gRPC context): gRPC context

        Returns:
            server_pb2.Status: Upload status code
        """
        print("Upload attempt")
        try:
            zip_temp_name = "/upload.zip"
            save_chunks_to_file(
                request_iterator, INSTRUCTIONS_FOLDER + zip_temp_name)

            folder_name = ""
            with ZipFile(INSTRUCTIONS_FOLDER + zip_temp_name, 'r') as zipObj:
                folder_name = zipObj.namelist()[0]

            shutil.unpack_archive(INSTRUCTIONS_FOLDER +
                                  zip_temp_name, INSTRUCTIONS_FOLDER, 'zip')

            os.remove(INSTRUCTIONS_FOLDER + zip_temp_name)

            index = ""
            with open(INSTRUCTIONS_FOLDER + "/{}index.json".format(folder_name), "r") as descr:
                index = json.load(descr)

            index["size"] = get_size(folder_name)

            with open(INSTRUCTIONS_FOLDER + "/{}index.json".format(folder_name), "w") as descr:
                json.dump(index, descr)

            print("Upload successful")
            return server_pb2.Status(status=1)
        except Exception as e:
            print("Upload failed:\n", e)
            return server_pb2.Status(status=0)


class PostServer(BaseHTTPRequestHandler):
    def _set_headers(self):
        self.send_response(200)
        self.send_header("Content-type", "text/html")
        self.end_headers()

    def _html(self, message):
        content = "<html><body><h1>{}</h1></body></html>".format(message)
        return content.encode("utf8")

    def do_GET(self):
        self._set_headers()
        self.wfile.write(self._html(
            "Hi. I'm waiting for POSTs with instructions."))

    def do_HEAD(self):
        self._set_headers()

    def do_POST(self):
        print("Upload attempt")
        try:
            content_length = int(self.headers['Content-Length'])
            body = self.rfile.read(content_length)

            zip_temp_name = "/upload.zip"

            with open(INSTRUCTIONS_FOLDER + zip_temp_name, 'wb') as f:
                f.write(body)

            folder_name = ""
            with ZipFile(INSTRUCTIONS_FOLDER + zip_temp_name, 'r') as zipObj:
                folder_name = zipObj.namelist()[0]

            shutil.unpack_archive(INSTRUCTIONS_FOLDER +
                                  zip_temp_name, INSTRUCTIONS_FOLDER, 'zip')

            os.remove(INSTRUCTIONS_FOLDER + zip_temp_name)

            index = ""
            with open(INSTRUCTIONS_FOLDER + "/{}index.json".format(folder_name), "r") as descr:
                index = json.load(descr)

            index["size"] = get_size(folder_name)

            with open(INSTRUCTIONS_FOLDER + "/{}index.json".format(folder_name), "w") as descr:
                json.dump(index, descr)

            print("Upload successful")
            self.send_response(200)
        except Exception as e:
            print("Upload failed:\n", e)
            self.send_response(500)
        self.end_headers()


def main():
    """
    Create gRPC server as a thread and wait for requests
    """
    print("Creating gRPC Server")
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    server_pb2_grpc.add_VirtualAssistantServicer_to_server(
        VirtualAssistantServicer(), server)
    server_pb2_grpc.add_WebEditorServicer_to_server(
        WebEditorServicer(), server)

    print('Listening on port 50051')
    server.add_insecure_port('[::]:50051')
    server.start()

    print("Creating POST Server")
    addr = "0.0.0.0"
    port = 50052
    server_address = (addr, port)
    httpd = HTTPServer(server_address, PostServer)

    print("Starting httpd server on {}:{}".format(addr, port))
    httpd.serve_forever()

    # Wait, since threads are non-blocking
    try:
        while True:
            time.sleep(60 * 60 * 24)
    except KeyboardInterrupt:
        server.stop(0)


if __name__ == '__main__':
    main()
