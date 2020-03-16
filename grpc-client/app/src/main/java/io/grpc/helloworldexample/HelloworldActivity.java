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

package io.grpc.helloworldexample;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.text.TextUtils;
import android.text.method.ScrollingMovementMethod;
import android.view.View;
import android.view.inputmethod.InputMethodManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;

import com.google.protobuf.ByteString;

import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import io.grpc.examples.helloworld.GreeterGrpc;
import io.grpc.examples.helloworld.HelloReply;
import io.grpc.examples.helloworld.HelloRequest;
import io.grpc.examples.helloworld.ImageReply;
import io.grpc.examples.helloworld.ImageRequest;


import java.io.PrintWriter;
import java.io.StringWriter;

public class HelloworldActivity extends AppCompatActivity
{

  private Button sendButton;
  private EditText hostEdit;
  private EditText portEdit;
  private EditText messageEdit;
  private TextView resultText;
  private  ImageView resultImage;

  @Override
  protected void onCreate(Bundle savedInstanceState)
  {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_helloworld);
    sendButton = findViewById(R.id.send_button);
    hostEdit = findViewById(R.id.host_edit_text);
    portEdit = findViewById(R.id.port_edit_text);
    messageEdit = findViewById(R.id.message_edit_text);
    resultText = findViewById(R.id.grpc_response_text);
    resultText.setMovementMethod(new ScrollingMovementMethod());
    resultImage = findViewById(R.id.grpc_image);
  }

  public void sendMessage(View view)
  {
    ((InputMethodManager) getSystemService(Context.INPUT_METHOD_SERVICE))
        .hideSoftInputFromWindow(hostEdit.getWindowToken(), 0);

    sendButton.setEnabled(false);

    String message =  messageEdit.getText().toString();
    String host = hostEdit.getText().toString();
    String portStr = portEdit.getText().toString();
    int port = TextUtils.isEmpty(portStr) ? 0 : Integer.valueOf(portStr);

    try
    {
      ManagedChannel channel = ManagedChannelBuilder.forAddress(host, port).usePlaintext().build();
      GreeterGrpc.GreeterBlockingStub stub = GreeterGrpc.newBlockingStub(channel);

      ImageRequest imRequest = ImageRequest.newBuilder().setName(message).build();
      ImageReply imReply = stub.requestImage(imRequest);

//      HelloRequest request = HelloRequest.newBuilder().setName(message).build();
//      HelloReply reply = stub.sayHello(request);
      String result = "Image request status: " + imReply.getStatus();
      
      if (imReply.getStatus() == 1)
      {
        byte[] data = imReply.getData().toByteArray();
        int offset = (int) imReply.getOffset();
        Bitmap bMap = BitmapFactory.decodeByteArray(data, 0, data.length);
        resultImage.setImageBitmap(bMap);
      }
      
      resultText.setText(result);
    }
    catch (Exception e)
    {
      StringWriter sw = new StringWriter();
      PrintWriter pw = new PrintWriter(sw);
      e.printStackTrace(pw);
      pw.flush();
      resultText.setText(String.format("Failed... : %n%s", sw));
    }

    sendButton.setEnabled(true);

  }
}
