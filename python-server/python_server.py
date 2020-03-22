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

# Import the generated gRPC classes
import instruction_pb2
import instruction_pb2_grpc


INSTRUCTIONS_FOLDER = "./instructions"
DEFAULT_THUMB = "./aux_data/default_thumb.jpg"

CHUNK_SIZE = 1024 * 1024  # 1MB


def get_file_chunks(filename):
    """
    Slices file into byte chunks for gRPC transfer

    Args:
        filename (str): Path to file to slice

    Yields:
        instruction_pb2.Chunk: byte chunk for gRPC stream
    """
    with open(filename, 'rb') as f:
        while True:
            piece = f.read(CHUNK_SIZE)
            if len(piece) == 0:
                return
            yield instruction_pb2.Chunk(buffer=piece)


class InstructionServicer(instruction_pb2_grpc.InstructionServicer):

    """
    Class that implements rpcs from instruction.proto
    """

    def GetAllInstructions(self, request, context):
        """
        Defines the body of GetAllInstructions rpc.
        Parses index.json of all instructions and returns an array of
        Thumbnails

        Args:
            request (instruction_pb2.InstructionRequest): Request msg
            context (gRPC context): gRPC context

        Returns:
            instruction_pb2.InstructionResponse: Description
        """

        response = instruction_pb2.AllInstructioinsResponse()
        instructions = os.listdir(INSTRUCTIONS_FOLDER)

        # Go through each instruction one-by-one and create a thumb out of it
        for instruction in instructions:
            path = "{}/{}".format(INSTRUCTIONS_FOLDER, instruction)
            thumbnail = instruction_pb2.InstructionThumbnail()

            # Parse index.json
            try:
                with open('{}/index.json'.format(path), 'r') as descr:
                    data = json.load(descr)
                    thumbnail.id = data['id']
                    thumbnail.name = data['name']
                    thumbnail.description = data['description']
                    th_path = data['image']
                    thumbnail.step_count = data['step_count']
                    thumbnail.size = data['size']
            except Exception:
                continue

            # Get thumbnail image
            try:
                with open("{}/media/{}".format(path, th_path), "rb") as thumb:
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
        Parses and returns slides.json for a particular instruction

        Args:
            request (instruction_pb2.InstructionRequest): Request msg
            context (gRPC context): gRPC context

        Returns:
            instruction_pb2.InstructionResponse: Instruction Response message
        """

        print("Instruction {} request".format(request.id))
        # Path to the instruction
        path = "{}/{}".format(INSTRUCTIONS_FOLDER, request.id)

        response = instruction_pb2.InstructionResponse()
        try:
            response.status = 1
            # Parse slides.json and put it in the response message
            with open('{}/slides.json'.format(path), 'r') as file:
                slides = json.load(file)
                for slide in slides:
                    slide_msg = instruction_pb2.Slide()

                    slide_msg.text = slide['text']
                    slide_msg.transform = str(slide['transform'])
                    slide_msg.media_type = slide['media_type']
                    slide_msg.media_url = slide['media_url']

                    response.slides.extend([slide_msg])
        except Exception:
            response.status = 0

        return response

    def DownloadMedia(self, request, context):
        """
        Defines the body of DownloadMedia rpc.
        The procedure returns chunked media.zip

        Args:
            request (instruction_pb2.MediaRequest): Request msg
            context (gRPC context): gRPC context

        Returns:
            instruction_pb2.Chunk: gRPC Chunk stream
        """

        # Define path to media folder
        media_path = "{}/{}/media".format(INSTRUCTIONS_FOLDER, request.id)
        # Define path to media.zip
        zip_path = "{}/{}/media".format(INSTRUCTIONS_FOLDER, request.id)

        # Create zip archive from media folder
        shutil.make_archive(zip_path, "zip", media_path)

        # Split and send media.zip archive
        return get_file_chunks(zip_path + ".zip")


def server():
    """
    Create gRPC server as a thread and wait for requests
    """
    print("Creating Server")
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    instruction_pb2_grpc.add_InstructionServicer_to_server(
        InstructionServicer(), server)

    print('Listening on port 50051')
    server.add_insecure_port('[::]:50051')
    server.start()

    # Wait, since threads are non-blocking
    try:
        while True:
            time.sleep(60 * 60 * 24)
    except KeyboardInterrupt:
        server.stop(0)


if __name__ == '__main__':
    server()
