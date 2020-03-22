"""
Sample python client to dowload instruction thumbnails
"""
import grpc

# Import the generated gRPC classes
import instruction_pb2
import instruction_pb2_grpc


def main():
    """
    Create gRPC stub and call GetAllInstructions procedure.
    Display the results afterwards.
    """

    # Stub creation
    channel = grpc.insecure_channel('localhost:50051')
    stub = instruction_pb2_grpc.InstructionStub(channel)

    # Make the call
    instructions = instruction_pb2.AllInstructioinsResponse()
    response = stub.GetAllInstructions(instructions)

    # Print results
    for th in response.thumbnails:
        print("Name: {} Size: {} bytes".format(th.name, th.size))
        # Save images
        with open("{}.jpg".format(th.name), 'wb') as f:
            f.write(th.image)


if __name__ == '__main__':
    main()
