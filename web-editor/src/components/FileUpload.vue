<template>

<form @submit.prevent="sendFile" enctype="multipart/form-data">

<div class="dropzone">
    <input
     multiple
     type="file"
     class = "input-file"
     ref = "files"
     @change = "sendFile"
    />
<p v-if="!uploading" class="call-to-action">
  Drag your files here
</p>
<p v-if="uploading" class="progress-bar">

</p>

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
      error: false,
      uploading:false,
      uploadedFiles:[],
      progress: 0
    }
  },

  methods: {
    //we don't need selectFile() because we directly upload as we drag it to the zone
   async sendFile(){
    const files = this.$refs.files.files;
    this.files = [...this.files, ...files];


      try{ 
        this.uploading = true;
        //TODO : upload to server (stored in 'file')
        //print the names of the files to the console
        for(var i = 0; i<this.files.length;i++)
            console.log(this.files[i].name);
        this.uploading = false;
      }
      catch(err){
        //TODO : handle server errors
        this.error = true;
         console.log("Error");
         this.uploading = false;

     }
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
.dropzone {
  min-height: 200px;
  padding: 10 px 10 px;
  position: relative;
  cursor: pointer;
  outline: 2px dashed grey;
  outline-offset: -10px;
  background: lightcyan;
  color: dimgray;
}
.input-file {
  opacity: 0;
  width :100%;
  height: 200px;
  position: absolute;
  cursor: pointer;
}
.dropzone:hover {
  background: lightblue;
}
.dropzone .call-to-action{
  font-size: 1.2rem;
  text-align: center;
  padding: 85px 0;
}
</style>
