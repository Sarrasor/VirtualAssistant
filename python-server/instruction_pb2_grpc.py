# Generated by the gRPC Python protocol compiler plugin. DO NOT EDIT!
import grpc

import instruction_pb2 as instruction__pb2


class InstructionStub(object):
  # missing associated documentation comment in .proto file
  pass

  def __init__(self, channel):
    """Constructor.

    Args:
      channel: A grpc.Channel.
    """
    self.GetAllInstructions = channel.unary_unary(
        '/instruction.Instruction/GetAllInstructions',
        request_serializer=instruction__pb2.AllInstructioinsRequest.SerializeToString,
        response_deserializer=instruction__pb2.AllInstructioinsResponse.FromString,
        )
    self.GetInstruction = channel.unary_unary(
        '/instruction.Instruction/GetInstruction',
        request_serializer=instruction__pb2.InstructionRequest.SerializeToString,
        response_deserializer=instruction__pb2.InstructionResponse.FromString,
        )
    self.DownloadMedia = channel.unary_stream(
        '/instruction.Instruction/DownloadMedia',
        request_serializer=instruction__pb2.MediaRequest.SerializeToString,
        response_deserializer=instruction__pb2.Chunk.FromString,
        )


class InstructionServicer(object):
  # missing associated documentation comment in .proto file
  pass

  def GetAllInstructions(self, request, context):
    # missing associated documentation comment in .proto file
    pass
    context.set_code(grpc.StatusCode.UNIMPLEMENTED)
    context.set_details('Method not implemented!')
    raise NotImplementedError('Method not implemented!')

  def GetInstruction(self, request, context):
    # missing associated documentation comment in .proto file
    pass
    context.set_code(grpc.StatusCode.UNIMPLEMENTED)
    context.set_details('Method not implemented!')
    raise NotImplementedError('Method not implemented!')

  def DownloadMedia(self, request, context):
    # missing associated documentation comment in .proto file
    pass
    context.set_code(grpc.StatusCode.UNIMPLEMENTED)
    context.set_details('Method not implemented!')
    raise NotImplementedError('Method not implemented!')


def add_InstructionServicer_to_server(servicer, server):
  rpc_method_handlers = {
      'GetAllInstructions': grpc.unary_unary_rpc_method_handler(
          servicer.GetAllInstructions,
          request_deserializer=instruction__pb2.AllInstructioinsRequest.FromString,
          response_serializer=instruction__pb2.AllInstructioinsResponse.SerializeToString,
      ),
      'GetInstruction': grpc.unary_unary_rpc_method_handler(
          servicer.GetInstruction,
          request_deserializer=instruction__pb2.InstructionRequest.FromString,
          response_serializer=instruction__pb2.InstructionResponse.SerializeToString,
      ),
      'DownloadMedia': grpc.unary_stream_rpc_method_handler(
          servicer.DownloadMedia,
          request_deserializer=instruction__pb2.MediaRequest.FromString,
          response_serializer=instruction__pb2.Chunk.SerializeToString,
      ),
  }
  generic_handler = grpc.method_handlers_generic_handler(
      'instruction.Instruction', rpc_method_handlers)
  server.add_generic_rpc_handlers((generic_handler,))
