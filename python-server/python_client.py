"""
Sample python client to dowload instruction thumbnails
"""
import grpc

# Import the generated gRPC classes
import virtual_assistant_pb2
import virtual_assistant_pb2_grpc


def main():
    """
    Create gRPC stub and call GetAllInstructions procedure.
    Display the results afterwards.
    """

    # Stub creation
    channel = grpc.insecure_channel('localhost:50051')
    stub = virtual_assistant_pb2_grpc.VirtualAssistantStub(channel)

    # Make the call
    instructions_request = virtual_assistant_pb2.AllInstructioinsRequest()
    response = stub.GetAllInstructions(instructions_request)

    # Print results
    for th in response.thumbnails:
        print("Name: {} Size: {} bytes".format(th.name, th.size))
        # Save images
        with open("{}.jpg".format(th.name), 'wb') as f:
            f.write(th.image)


if __name__ == '__main__':
    main()
