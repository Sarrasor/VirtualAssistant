/**
 * @fileoverview gRPC-Web generated client stub for instruction
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!



const grpc = {};
grpc.web = require('grpc-web');

const proto = {};
proto.instruction = require('./instruction_pb.js');

/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.instruction.InstructionClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

};


/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.instruction.InstructionPromiseClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.instruction.AllInstructioinsRequest,
 *   !proto.instruction.AllInstructioinsResponse>}
 */
const methodDescriptor_Instruction_GetAllInstructions = new grpc.web.MethodDescriptor(
  '/instruction.Instruction/GetAllInstructions',
  grpc.web.MethodType.UNARY,
  proto.instruction.AllInstructioinsRequest,
  proto.instruction.AllInstructioinsResponse,
  /**
   * @param {!proto.instruction.AllInstructioinsRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.instruction.AllInstructioinsResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.instruction.AllInstructioinsRequest,
 *   !proto.instruction.AllInstructioinsResponse>}
 */
const methodInfo_Instruction_GetAllInstructions = new grpc.web.AbstractClientBase.MethodInfo(
  proto.instruction.AllInstructioinsResponse,
  /**
   * @param {!proto.instruction.AllInstructioinsRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.instruction.AllInstructioinsResponse.deserializeBinary
);


/**
 * @param {!proto.instruction.AllInstructioinsRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.instruction.AllInstructioinsResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.instruction.AllInstructioinsResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.instruction.InstructionClient.prototype.getAllInstructions =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/instruction.Instruction/GetAllInstructions',
      request,
      metadata || {},
      methodDescriptor_Instruction_GetAllInstructions,
      callback);
};


/**
 * @param {!proto.instruction.AllInstructioinsRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.instruction.AllInstructioinsResponse>}
 *     A native promise that resolves to the response
 */
proto.instruction.InstructionPromiseClient.prototype.getAllInstructions =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/instruction.Instruction/GetAllInstructions',
      request,
      metadata || {},
      methodDescriptor_Instruction_GetAllInstructions);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.instruction.InstructionRequest,
 *   !proto.instruction.InstructionResponse>}
 */
const methodDescriptor_Instruction_GetInstruction = new grpc.web.MethodDescriptor(
  '/instruction.Instruction/GetInstruction',
  grpc.web.MethodType.UNARY,
  proto.instruction.InstructionRequest,
  proto.instruction.InstructionResponse,
  /**
   * @param {!proto.instruction.InstructionRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.instruction.InstructionResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.instruction.InstructionRequest,
 *   !proto.instruction.InstructionResponse>}
 */
const methodInfo_Instruction_GetInstruction = new grpc.web.AbstractClientBase.MethodInfo(
  proto.instruction.InstructionResponse,
  /**
   * @param {!proto.instruction.InstructionRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.instruction.InstructionResponse.deserializeBinary
);


/**
 * @param {!proto.instruction.InstructionRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.instruction.InstructionResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.instruction.InstructionResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.instruction.InstructionClient.prototype.getInstruction =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/instruction.Instruction/GetInstruction',
      request,
      metadata || {},
      methodDescriptor_Instruction_GetInstruction,
      callback);
};


/**
 * @param {!proto.instruction.InstructionRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.instruction.InstructionResponse>}
 *     A native promise that resolves to the response
 */
proto.instruction.InstructionPromiseClient.prototype.getInstruction =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/instruction.Instruction/GetInstruction',
      request,
      metadata || {},
      methodDescriptor_Instruction_GetInstruction);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.instruction.MediaRequest,
 *   !proto.instruction.Chunk>}
 */
const methodDescriptor_Instruction_DownloadMedia = new grpc.web.MethodDescriptor(
  '/instruction.Instruction/DownloadMedia',
  grpc.web.MethodType.SERVER_STREAMING,
  proto.instruction.MediaRequest,
  proto.instruction.Chunk,
  /**
   * @param {!proto.instruction.MediaRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.instruction.Chunk.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.instruction.MediaRequest,
 *   !proto.instruction.Chunk>}
 */
const methodInfo_Instruction_DownloadMedia = new grpc.web.AbstractClientBase.MethodInfo(
  proto.instruction.Chunk,
  /**
   * @param {!proto.instruction.MediaRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.instruction.Chunk.deserializeBinary
);


/**
 * @param {!proto.instruction.MediaRequest} request The request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.instruction.Chunk>}
 *     The XHR Node Readable Stream
 */
proto.instruction.InstructionClient.prototype.downloadMedia =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/instruction.Instruction/DownloadMedia',
      request,
      metadata || {},
      methodDescriptor_Instruction_DownloadMedia);
};


/**
 * @param {!proto.instruction.MediaRequest} request The request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.instruction.Chunk>}
 *     The XHR Node Readable Stream
 */
proto.instruction.InstructionPromiseClient.prototype.downloadMedia =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/instruction.Instruction/DownloadMedia',
      request,
      metadata || {},
      methodDescriptor_Instruction_DownloadMedia);
};


module.exports = proto.instruction;

