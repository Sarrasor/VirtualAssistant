"""
Sample python client to download/upload media folder in zip
"""
import grpc

# Import the generated gRPC classes
import server_pb2
import server_pb2_grpc

CHUNK_SIZE = 1024 * 1024  # 1MB


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


def upload(stub, in_file_name):
    chunks_generator = get_file_chunks(in_file_name)
    response = stub.UploadInstructions(chunks_generator)

    print("Response: ", response.status)


def main():
    """
    Create gRPC stub, download media.zip, and save it
    """

    # Create gRPC stub
    channel = grpc.insecure_channel('localhost:50051')
    stub = server_pb2_grpc.WebEditorStub(channel)

    upload(stub, "media.zip")

    # # Make the call
    # response = stub.DownloadMedia(
    #     server_pb2.MediaRequest(id="3rf323g4234g3"))

    # # Save the result
    # save_chunks_to_file(response, "result.zip")


if __name__ == '__main__':
    main()
