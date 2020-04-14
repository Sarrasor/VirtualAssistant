var PROTO_PATH = __dirname + '/protos/web_editor.proto';
var grpc = require('grpc');
var protoLoader = require('@grpc/proto-loader');
var fs = require('fs');

// Load web_editor.proto
var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });

var protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
var web_editor = protoDescriptor.virtual_assistant;

// Create client
var client = new web_editor.WebEditor('localhost:50051',
                                       grpc.credentials.createInsecure());

// Read file and call sendFile()
var filename = 'instructions.zip'
fs.readFile( __dirname + '/' + filename, function (err, data) {
  if (err) 
  {
    throw err; 
  }
  const file = data;
  sendFile(file);
});

function assert (cond, err)
{
	if (!cond) 
	{
		throw new Error(err);
	}
}

function create_chunks(buffer, chunkSize) 
{
	assert(Buffer.isBuffer(buffer), 'Buffer is required');
	assert(!isNaN(chunkSize) && chunkSize > 0, 'Chunk size should be positive number');

	var result = [];
	var len = buffer.length;
	var i = 0;

	while (i < len) {
		result.push(buffer.slice(i, i += chunkSize));
	}

	return result;
}

// Send file
function sendFile(file)
{	
	// Slice file in chunks
	var chunk_size = 1024 * 1024;
	var chunks = create_chunks(file, chunk_size);

	// Open connection
	var call = client.UploadInstructions(
	function(error, response){console.log(response)});

	// Stream each chunk
	for (var i = 0; i < chunks.length; i++) 
	{
		call.write({buffer: chunks[i]});
	}

	// Close connection
	call.end();  
}