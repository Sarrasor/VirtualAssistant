var PROTO_PATH = __dirname + '/protos/web_editor.proto';
var grpc = require('grpc');
var protoLoader = require('@grpc/proto-loader');
var fs = require('fs');

// Main variables
var FILENAME = 'instructions.zip';
var SERVER_ADDRESS = 'localhost:50051';
var CHUNK_SIZE = 1024 * 1024; // 1 MB

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

// Create client
var client = new protoDescriptor.virtual_assistant.WebEditor(
	SERVER_ADDRESS, grpc.credentials.createInsecure());

// Read file and call sendFile()
fs.readFile( __dirname + '/' + FILENAME, function (err, file) 
{
  if (err) 
  {
    throw err; 
  }
  sendFile(file);
});

// Slices file in chunks and sends it
function sendFile(file)
{	
	// Open connection
	var call = client.UploadInstructions(
	function(error, response){console.log(response)});

	var i = 0;
	// Slice file in chunks and send them
	while (i < file.length) 
	{
		call.write({buffer: file.slice(i, i += CHUNK_SIZE)});
	}

	// Close the connection
	call.end();  
}