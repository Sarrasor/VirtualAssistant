# Task
We need to have a server that sends the list of all available instructions to a Virtual Assistant app client and receives instructions from the Web Editor
The server also should send the selected instruction and all media files to the client.

## How to use
`python3 python_server.py`

If you want to run python_server.py on the Innopolis VM server:

You can use [ngrok](https://ngrok.com) to expose your server to the global net

First, create the config file with the name `ngrok_config.yml` and fill it:

```
authtoken:  <your ngrok token>
tunnels:
  post-server:
    addr: 50052
    proto: http    
  grpc-server:
    addr: 50051
    proto: tcp
    bind_tls: true

```

Second, run this commands:

```
chmod +x python_server.py
nohup /path/to/python_server.py > output.log &
./ngrok start -config /path/to/ngrok_config.yml post-server grpc-server > /dev/null &
```

To stop background processes:
```
ps ax | grep python_server.py
kill <pid>
```

## To generate python from .proto

`python3 -m grpc_tools.protoc -I. --python_out=. --grpc_python_out=. server.proto`

## Cool gRPC python tutorial

https://www.semantics3.com/blog/a-simplified-guide-to-grpc-in-python-6c4e25f0c506/

## How to send big images

https://github.com/gooooloo/grpc-file-transfer/blob/master/src/lib.py
https://ops.tips/blog/sending-files-via-grpc/

## Common problems

### Problem:
`Error while finding module specification for 'grpc_tools.protoc' (ModuleNotFoundError: No module named 'grpc_tools')`

### Solution:
`python3 -m pip install --user grpcio-tools`
