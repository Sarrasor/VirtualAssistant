<template>
  <!-- learned from : https://www.youtube.com/watch?v=GXe_JpBQLTQ -->
  <form @submit.prevent="sendFile" enctype = "multipart/form-data">
<div class = "field">
    <div class="file is-boxed is-primary">
      <label class="field-label" id="root">
        <input
         type="file"
         ref="file"
         @change="selectFile"
         class ="file-input"
         id = "empty"
         />
          <span class="file-label">
            Choose a file...
          </span>
          <!-- TODO : handle the size of the box and check 2 cases : file selected or not (for now selected case only has a good size) -->
          <span v-if="file" class="file-name">{{file.name}}</span>
      </label>
      </div>
      </div>
    <!--
      <label for="file" class="label">
    <p id = "empty"> click or drag your local files here to upload </p>
    <input type = "file" ref = "file" @change="selectFile">
    </label>
  </div>
  <div class = "field">
    <button class="button is-info">Send</button>
  </div>
  -->
  </form>
</template>

<script>
import axios from 'axios';

export default {
  name: "FileUpload",
  data(){
    return {
      file: ""
    }
  },

  methods: {
    selectFile(){
      this.file = this.$refs.file.files[0];
    },
    async sendFile(){
      const formData = new FormData();
      formData.append('file',this.file);

    try{
      //TODO: make this function upload to server
      await axios.post('/upload', formData);
    }
    catch(err){
      //TODO: handle errors in another way (printing a message to user for example)
      console.log(err);
    }

    }
  }
};
</script>

<style scoped>
#root {
  flex-wrap: wrap;
  border: 2px dashed var(--select);
  place-content: center;
  cursor: pointer;
  width: 100%;
  height: 100%;
  display: inline-block;     
  position: relative;    
  z-index: 1;     
  padding: 20%;     
  margin: 0em; 
}
#root:hover {
  border-color: var(--text);
}
#root:active {
  box-shadow: inset 0px 0px 20px var(--shadow);
}
#root > * {
  width: 100%;
}
#empty {
  font-size: 12px;
  font-style: italic;
  text-align: center;
  width: 100%;
  user-select: none;
  visibility: hidden;
}
#upload {
  width: 200%;
  height: 200%;
}
</style>
