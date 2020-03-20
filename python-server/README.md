#Cool gRPC python tutorial

https://www.semantics3.com/blog/a-simplified-guide-to-grpc-in-python-6c4e25f0c506/

#How to send big images

https://github.com/gooooloo/grpc-file-transfer/blob/master/src/lib.py
https://ops.tips/blog/sending-files-via-grpc/

#To generate python from .proto

`python3 -m grpc_tools.protoc -I. --python_out=. --grpc_python_out=. instruction.proto`

#Common problems

##Problem:
`Error while finding module specification for 'grpc_tools.protoc' (ModuleNotFoundError: No module named 'grpc_tools')`

##Solution:
`python3 -m pip install --user grpcio-tools`