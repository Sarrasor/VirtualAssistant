"""
Sample python client to download media folder in zip
"""
import grpc

# Import the generated gRPC classes
import instruction_pb2
import instruction_pb2_grpc


def save_chunks_to_file(chunks, filename):
    """
    Saves received byte chunks to a file

    Args:
        chunks (list): List of byte chunks
        filename (str): Name of the file to save to
    """
    with open(filename, 'wb') as f:
        for chunk in chunks:
            f.write(chunk.buffer)


def main():
    """
    Create gRPC stub, download media.zip, and save it
    """

    # Create gRPC stub
    channel = grpc.insecure_channel('localhost:50051')
    stub = instruction_pb2_grpc.InstructionStub(channel)

    # Make the call
    response = stub.DownloadMedia(
        instruction_pb2.MediaRequest(id="3rf323g4234g3"))

    # Save the result
    save_chunks_to_file(response, "result.zip")


if __name__ == '__main__':
    main()
