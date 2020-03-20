import grpc
from concurrent import futures
import time
import os
import json
import shutil


# import the generated classes
import instruction_pb2
import instruction_pb2_grpc


INSTRUCTIONS_FOLDER = "./instructions"
DEFAULT_THUMB = "./aux_data/default_thumb.jpg"

CHUNK_SIZE = 1024 * 1024  # 1MB


def get_file_chunks(filename):
    with open(filename, 'rb') as f:
        while True:
            piece = f.read(CHUNK_SIZE)
            if len(piece) == 0:
                return
            yield instruction_pb2.Chunk(buffer=piece)


def zipdir(path, ziph):
    # ziph is zipfile handle
    for root, dirs, files in os.walk(path):
        for file in files:
            ziph.write(os.path.join(root, file))


class InstructionServicer(instruction_pb2_grpc.InstructionServicer):

    def GetAllInstructions(self, request, context):
        response = instruction_pb2.AllInstructioinsResponse()
        instructions = os.listdir(INSTRUCTIONS_FOLDER)

        for instruction in instructions:
            path = "{}/{}".format(INSTRUCTIONS_FOLDER, instruction)
            thumbnail = instruction_pb2.InstructionThumbnail()

            # Get instruction name, id, desctiption
            name = None
            iid = None
            description = None
            th_path = None
            step_count = None
            size = None

            try:
                with open('{}/index.json'.format(path), 'r') as descr:
                    data = json.load(descr)
                    iid = data['id']
                    name = data['name']
                    description = data['description']
                    th_path = data['image']
                    step_count = data['step_count']
                    size = data['size']
            except Exception:
                continue

            # Get thumbnail image
            image = None
            try:
                with open("{}/media/{}".format(path, th_path), "rb") as thumb:
                    f = thumb.read()
                    image = bytes(f)
            except Exception:
                with open("{}".format(DEFAULT_THUMB), "rb") as thumb:
                    f = thumb.read()
                    image = bytes(f)

            thumbnail.id = iid
            thumbnail.name = name
            thumbnail.description = description
            thumbnail.image = image
            thumbnail.step_count = step_count
            thumbnail.size = size

            response.thumbnails.extend([thumbnail])

        return response

    def GetInstruction(self, request, context):
        print("Instruction {} request".format(request.id))
        path = "{}/{}".format(INSTRUCTIONS_FOLDER, request.id)

        response = instruction_pb2.InstructionResponse()
        try:
            response.status = 1
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
        # Define path to media folder
        media_path = "{}/{}/media".format(INSTRUCTIONS_FOLDER, request.id)
        # Define path to media.zip
        zip_path = "{}/{}/media".format(INSTRUCTIONS_FOLDER, request.id)

        # Create zip archive from media folder
        shutil.make_archive(zip_path, "zip", media_path)

        # Split and send media.zip archive
        return get_file_chunks(zip_path + ".zip")


def server():
    print("Creating Server")
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    instruction_pb2_grpc.add_InstructionServicer_to_server(
        InstructionServicer(), server)

    print('Listening on port 50051')
    server.add_insecure_port('[::]:50051')
    server.start()

    try:
        while True:
            time.sleep(60 * 60 * 24)
    except KeyboardInterrupt:
        server.stop(0)


if __name__ == '__main__':
    server()
