<template>
  <!-- learned from : https://www.youtube.com/watch?v=GXe_JpBQLTQ -->
  <form @submit.prevent="sendFile" enctype = "multipart/form-data">
<div class = "field">
    <div class="file is-boxed is-primary">
      <label class="field-label" id="root">
        <input
         multiple
         type="file"
         ref="files"
         @change="selectFile"
         class ="file-input"
         id = "empty"
         />
          <span class="file-label">
            Choose a file...
          </span>
          <!-- TODO : handle the size of the box and check 2 cases : file selected or not (for now selected case only has a good size) -->
      </label>
      </div>
      </div>
    <!--
      <label for="file" class="label">
    <p id = "empty"> click or drag your local files here to upload </p>
    <input type = "file" ref = "file" @change="selectFile">
    </label>
  </div>
  -->
  <div class="field">
    <div v-for="(file, index) in files" :key="index" class="level">
      <div class="level-left">
       <div class="level-item">{{file.name}}</div>
      </div>
      <div class="level-right">
        <div class="level-item">
          <a class="delete"></a>
        </div>
      </div>
    </div>
  </div>

  <div class = "field">
    <button class="button is-info">Send</button>
  </div>
  
  </form>
</template>

<script>
export default {
  name: "FileUpload",
  data(){
    return {
      files: [],
      message: "",
      error: false
    }
  },

  methods: {
   selectFile(){
     const files = this.$refs.files.files;
     this.files = [ ...this.files, ...files];
   },
   async sendFile(){
   }
  }
}
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
