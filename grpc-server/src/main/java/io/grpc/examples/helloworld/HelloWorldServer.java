/*
 * Copyright 2015 The gRPC Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package io.grpc.examples.helloworld;

import io.grpc.Server;
import io.grpc.ServerBuilder;
import io.grpc.stub.StreamObserver;
import java.io.IOException;
import java.util.concurrent.TimeUnit;
import java.util.logging.Logger;

import java.io.File;
import java.io.BufferedInputStream;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import com.google.protobuf.ByteString;
import java.util.Arrays;
import java.util.List;

/**
 * Server that manages startup/shutdown of a {@code Greeter} server.
 */
public class HelloWorldServer 
{
  private static final Logger logger = Logger.getLogger(HelloWorldServer.class.getName());

  private Server server;

  private void start() throws IOException
  {
    /* The port on which the server should run */
    int port = 5050;
    server = ServerBuilder.forPort(port)
        .addService(new GreeterImpl())
        .build()
        .start();
    logger.info("Server started, listening on " + port);
    Runtime.getRuntime().addShutdownHook(new Thread() {
      @Override
      public void run()
       {
        // Use stderr here since the logger may have been reset by its JVM shutdown hook.
        System.err.println("*** shutting down gRPC server since JVM is shutting down");
        try {
          HelloWorldServer.this.stop();
        } catch (InterruptedException e) {
          e.printStackTrace(System.err);
        }
        System.err.println("*** server shut down");
      }
    });
  }

  private void stop() throws InterruptedException
  {
    if (server != null) 
    {
      server.shutdown().awaitTermination(30, TimeUnit.SECONDS);
    }
  }

  /**
   * Await termination on the main thread since the grpc library uses daemon threads.
   */
  private void blockUntilShutdown() throws InterruptedException
  {
    if (server != null)
    {
      server.awaitTermination();
    }
  }

  /**
   * Main launches the server from the command line.
   */
  public static void main(String[] args) throws IOException, InterruptedException
  {
    final HelloWorldServer server = new HelloWorldServer();
    server.start();
    server.blockUntilShutdown();
  }

  static class GreeterImpl extends GreeterGrpc.GreeterImplBase
  {

    @Override
    public void sayHello(HelloRequest req, StreamObserver<HelloReply> responseObserver) 
    {
      HelloReply reply = HelloReply.newBuilder().setValue(1).setMessage("Your msg: " + req.getName()).build();
      responseObserver.onNext(reply);
      responseObserver.onCompleted();
    }

    @Override
    public void requestImage(ImageRequest req, StreamObserver<ImageReply> responseObserver)
    {
      String[] imageNames = new String[]{"aruco", "pony", "earth", "bg"};
      List<String> imageNamesList = Arrays.asList(imageNames);
      String requestName = req.getName();

      if (imageNamesList.contains(requestName))
      {
      	try
      	{
      	  String filepath = "";

      	  if (requestName.equals("aruco"))
      	  {
      	  	filepath = "/home/sarrasor/Documents/Projects/VirtualAssistant/grpc-java/examples/src/main/java/io/grpc/examples/helloworld/aruco.png";
      	  }
      	  else if (requestName.equals("pony"))
      	  {
      	  	filepath = "/home/sarrasor/Documents/Projects/VirtualAssistant/grpc-java/examples/src/main/java/io/grpc/examples/helloworld/pony.jpg";
      	  }
      	  else if (requestName.equals("earth"))
      	  {
      	  	filepath = "/home/sarrasor/Documents/Projects/VirtualAssistant/grpc-java/examples/src/main/java/io/grpc/examples/helloworld/earth.jpg";
      	  }
      	  else if (requestName.equals("bg"))
      	  {
      	  	filepath = "/home/sarrasor/Documents/Projects/VirtualAssistant/grpc-java/examples/src/main/java/io/grpc/examples/helloworld/bg.jpg";
      	  }

      	  File file = new File(filepath);

      	  try 
      	  {
      	    BufferedInputStream bInputStream = new BufferedInputStream(new FileInputStream(file));
            int bufferSize = 4096 * 1024; // 4Mb - max size
            byte[] buffer = new byte[bufferSize];                
            int size = 0;

            while ((size = bInputStream.read(buffer)) > 0)
            {                    
              ByteString byteString = ByteString.copyFrom(buffer, 0, size);
              ImageReply reply = ImageReply.newBuilder().setStatus(1).setData(byteString).setOffset(size).build();
              responseObserver.onNext(reply);
            }

    	  }
    	  catch (FileNotFoundException e)
    	  {
            e.printStackTrace();
          } 
          catch (IOException e)
          {
            e.printStackTrace();
          }
        }
        catch (RuntimeException e) 
        {
            responseObserver.onError(e);
            throw e;
        }
        responseObserver.onCompleted();
      }
      else
      {
      	ImageReply reply = ImageReply.newBuilder().setStatus(0).build();
        responseObserver.onNext(reply);
        responseObserver.onCompleted();
      }
    }
  }
}
