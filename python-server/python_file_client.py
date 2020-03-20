import grpc

# import the generated classes
import instruction_pb2
import instruction_pb2_grpc


def save_chunks_to_file(chunks, filename):
    with open(filename, 'wb') as f:
        for chunk in chunks:
            f.write(chunk.buffer)


channel = grpc.insecure_channel('localhost:50051')
stub = instruction_pb2_grpc.InstructionStub(channel)

# make the call
response = stub.DownloadMedia(instruction_pb2.MediaRequest(id="3rf323g4234g3"))
save_chunks_to_file(response, "result.zip")
