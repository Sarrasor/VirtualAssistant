#!/bin/bash

chmod +x /root/INNO-S20-SP/python-server/python_server.py
nohup /root/INNO-S20-SP/python-server/python_server.py > output.log &
./ngrok start -config /root/ngrok_config.yml post-server grpc-server > /dev/null &
