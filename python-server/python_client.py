import grpc
from PIL import Image

# import the generated classes
import instruction_pb2
import instruction_pb2_grpc

channel = grpc.insecure_channel('localhost:50051')
stub = instruction_pb2_grpc.InstructionStub(channel)

instructions = instruction_pb2.AllInstructioinsResponse()

# make the call
response = stub.GetAllInstructions(instructions)


for th in response.thumbnails:
    print("Name: {} Size: {} bytes".format(th.name, th.size))
    # with open("{}.jpg".format(th.name), 'wb') as f:
    #         f.write(th.image)
