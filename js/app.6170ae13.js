(function(t){function e(e){for(var i,r,o=e[0],l=e[1],c=e[2],p=0,d=[];p<o.length;p++)r=o[p],Object.prototype.hasOwnProperty.call(n,r)&&n[r]&&d.push(n[r][0]),n[r]=0;for(i in l)Object.prototype.hasOwnProperty.call(l,i)&&(t[i]=l[i]);u&&u(e);while(d.length)d.shift()();return a.push.apply(a,c||[]),s()}function s(){for(var t,e=0;e<a.length;e++){for(var s=a[e],i=!0,o=1;o<s.length;o++){var l=s[o];0!==n[l]&&(i=!1)}i&&(a.splice(e--,1),t=r(r.s=s[0]))}return t}var i={},n={app:0},a=[];function r(e){if(i[e])return i[e].exports;var s=i[e]={i:e,l:!1,exports:{}};return t[e].call(s.exports,s,s.exports,r),s.l=!0,s.exports}r.m=t,r.c=i,r.d=function(t,e,s){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:s})},r.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var s=Object.create(null);if(r.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var i in t)r.d(s,i,function(e){return t[e]}.bind(null,i));return s},r.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="/INNO-S20-SP/";var o=window["webpackJsonp"]=window["webpackJsonp"]||[],l=o.push.bind(o);o.push=e,o=o.slice();for(var c=0;c<o.length;c++)e(o[c]);var u=l;a.push([0,"chunk-vendors"]),s()})({0:function(t,e,s){t.exports=s("56d7")},"0965":function(t,e,s){"use strict";var i=s("c601"),n=s.n(i);n.a},2132:function(t,e,s){},2411:function(t,e,s){"use strict";var i=s("2132"),n=s.n(i);n.a},"353e":function(t,e,s){},3633:function(t,e,s){"use strict";var i=s("abc7"),n=s.n(i);n.a},"4d71":function(t,e,s){},"56d7":function(t,e,s){"use strict";s.r(e);s("e260"),s("e6cf"),s("cca6"),s("a79d");var i=s("2b0e"),n=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{attrs:{id:"app"}},[s("Instruction",{attrs:{instructions:t.instructions},on:{select:t.selectInstruction}}),s("Step",{attrs:{steps:t.steps},on:{select:t.selectStep}}),s("Asset",{attrs:{assets:t.assets}}),s("Render",{attrs:{assets:t.assets,files:t.files}})],1)},a=[],r=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",[s("div",{staticClass:"card"},[s("p",{staticClass:"label bold"},[t._v("instructions")]),t.instructions?[s("div",{staticClass:"toolbar"},[t.instructions?s("button",{attrs:{tooltip:"create new"},on:{click:t.createInstruction}},[s("i",{staticClass:"material-icons-outlined"},[t._v("add")])]):t._e(),t.instruction?s("button",{attrs:{tooltip:"duplicate"},on:{click:t.duplicateInstruction}},[s("i",{staticClass:"material-icons-outlined"},[t._v("library_add")])]):t._e(),t.instruction?s("button",{attrs:{tooltip:"upload to server"},on:{click:t.uploadInstruction}},[s("i",{staticClass:"material-icons-outlined"},[t._v("publish")])]):t._e(),t.instruction?s("button",{attrs:{tooltip:"delete"},on:{click:t.deleteInstruction}},[s("i",{staticClass:"material-icons-outlined"},[t._v("delete")])]):t._e()]),t.instructions.length>0?s("div",{staticClass:"list",staticStyle:{height:"125px"}},t._l(t.instructions,(function(e,i){return s("button",{key:i,class:{selected:i===t.selected},on:{click:function(e){t.selected=i}}},[t._v(t._s(e.name))])})),0):t._e()]:t._e(),t.instruction?[s("p",{staticClass:"label"},[t._v("name")]),s("input",{directives:[{name:"model",rawName:"v-model",value:t.instruction.name,expression:"instruction.name"}],attrs:{type:"text"},domProps:{value:t.instruction.name},on:{input:function(e){e.target.composing||t.$set(t.instruction,"name",e.target.value)}}}),s("p",{staticClass:"label"},[t._v("description")]),s("textarea",{directives:[{name:"model",rawName:"v-model",value:t.instruction.description,expression:"instruction.description"}],domProps:{value:t.instruction.description},on:{input:function(e){e.target.composing||t.$set(t.instruction,"description",e.target.value)}}}),t._v(" "),s("p",{staticClass:"label"},[t._v("preview")]),s("FileDrop",{attrs:{types:[1]},model:{value:t.instruction.preview_url,callback:function(e){t.$set(t.instruction,"preview_url",e)},expression:"instruction.preview_url"}})]:t._e()],2),s("div",{staticClass:"card",staticStyle:{"margin-top":"20px",width:"430px"}},[s("p",{staticClass:"label bold"},[t._v("files")]),t.instruction?s("div",{attrs:{id:"files"}},[s("div",{staticClass:"list",staticStyle:{height:"125px"}},t._l(t.instruction.files,(function(e,i){return s("button",{key:i,attrs:{draggable:""},on:{dragstart:function(e){return t.dragFile(e,i)},click:function(e){t.selectedFile=i}}},[t._v(t._s(e.name))])})),0),s("FileUpload",{on:{upload:t.validateMediaLinks},model:{value:t.instruction.files,callback:function(e){t.$set(t.instruction,"files",e)},expression:"instruction.files"}})],1):t._e()])])},o=[],l=(s("4de4"),s("7db0"),s("4160"),s("a434"),s("b0c0"),s("159b"),s("15fd")),c=s("b85c"),u=s("ec26"),p=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{class:{delete:t.file},attrs:{id:"root"},on:{drop:t.drop,dragover:function(t){return t.preventDefault()},click:function(e){return t.$emit("drop",null)}}},[t.file?s("p",[t._v(t._s(t.file))]):s("p",{attrs:{id:"empty"}},[t._v("[drag an uploaded file here]")])])},d=[],f=(s("caad"),s("2532"),{name:"FileDrop",props:["file","types"],model:{prop:"file",event:"drop"},methods:{drop:function(t){var e=JSON.parse(t.dataTransfer.getData("text"));this.types&&!this.types.includes(e.type)||this.$emit("drop",e.name)}}}),v=f,m=(s("3633"),s("2877")),h=Object(m["a"])(v,p,d,!1,null,"595995c3",null),b=h.exports,_=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{attrs:{id:"root"},on:{click:function(e){return t.$refs.input.click()},drop:t.drop,dragover:function(t){return t.preventDefault()}}},[s("p",{attrs:{id:"empty"}},[t._v("click or drag your local files here to upload them")]),s("br"),s("p",{attrs:{id:"empty"}},[t._v("or drag an uploaded file to delete it")]),s("input",{ref:"input",attrs:{hidden:"",multiple:"",type:"file",accept:t.extensions.join()},on:{change:function(e){t.upload(Array.from(e.target.files))}}})])},g=[],y=(s("99af"),s("0481"),s("a630"),s("d81d"),s("4069"),s("d3b7"),s("ac1f"),s("3ca3"),s("1276"),s("ddb0"),s("3835")),x=(s("96cf"),s("1da1")),w={name:"FileUpload",props:["files"],data:function(){return{images:[".bmp",".jpeg",".jpg",".png"],audios:[".mp3"],videos:[".mp4"],models:[".glb"]}},computed:{types:function(){return[this.images,this.audios,this.videos,this.models]},extensions:function(){return this.types.flat()},names:function(){return this.files.map((function(t){return t.name}))}},methods:{upload:function(t){var e=this;return Object(x["a"])(regeneratorRuntime.mark((function s(){return regeneratorRuntime.wrap((function(s){while(1)switch(s.prev=s.next){case 0:return s.t0=e,s.t1=e.files,s.next=4,Promise.all(t.filter((function(t){return!e.names.includes(t.name)})).map(e.readFile));case 4:s.t2=s.sent,s.t3=s.t1.concat.call(s.t1,s.t2),s.t0.$emit.call(s.t0,"upload",s.t3);case 7:case"end":return s.stop()}}),s)})))()},readFile:function(t){var e=this.getType;return new Promise((function(s,i){var n=new FileReader;n.onload=function(){return s({name:t.name,type:e(t.name),content:n.result})},n.onerror=i,n.readAsBinaryString(t)}))},getExt:function(t){return"."+t.split(".").pop()},getType:function(t){var e,s=this.getExt(t),i=Object(c["a"])(this.types.entries());try{for(i.s();!(e=i.n()).done;){var n=Object(y["a"])(e.value,2),a=n[0],r=n[1];if(r.includes(s))return a+1}}catch(o){i.e(o)}finally{i.f()}return 0},drop:function(t){var e=this;return Object(x["a"])(regeneratorRuntime.mark((function s(){var i,n;return regeneratorRuntime.wrap((function(s){while(1)switch(s.prev=s.next){case 0:if(t.preventDefault(),!((null===(i=t.dataTransfer.files)||void 0===i?void 0:i.length)>0)){s.next=6;break}return s.next=4,e.upload(Array.from(t.dataTransfer.files).filter((function(t){return e.extensions.includes(e.getExt(t.name))})));case 4:s.next=8;break;case 6:n=JSON.parse(t.dataTransfer.getData("text")),e.$emit("upload",e.files.filter((function(t){return t.name!==n.name})));case 8:case"end":return s.stop()}}),s)})))()},dragOver:function(t){t.preventDefault()}},model:{prop:"files",event:"upload"}},k=w,C=(s("e19c"),Object(m["a"])(k,_,g,!1,null,"6be4cb40",null)),O=C.exports,S={name:"Instruction",props:["instructions"],components:{FileDrop:b,FileUpload:O},data:function(){return{selected:void 0}},watch:{instructions:function(t){t&&this.selectLast()}},computed:{instruction:function(){var t;return this.$emit("select",this.selected),(null===(t=this.instructions)||void 0===t?void 0:t.length)>0?this.instructions[this.selected]:null}},methods:{dragFile:function(t,e){t.dataTransfer.setData("text/plain",JSON.stringify(this.instruction.files[e]))},validateMediaLinks:function(){var t=this.instruction.files,e=function(e){return!t.find((function(t){return t.name===e}))};e(this.instruction.preview_url)&&(this.instruction.preview_url="");var s,i=Object(c["a"])(this.instruction.steps);try{for(i.s();!(s=i.n()).done;){var n=s.value;e(n.preview_url)&&(n.preview_url="");var a,r=Object(c["a"])(n.assets);try{for(r.s();!(a=r.n()).done;){var o=a.value;e(o.media.url)&&(o.media.url="",o.media.type=0)}}catch(l){r.e(l)}finally{r.f()}}}catch(l){i.e(l)}finally{i.f()}},createInstruction:function(){this.instructions.push({id:Object(u["a"])(),size:0,name:"Instruction "+(this.instructions.length+1),description:"",preview_url:"",steps:[],files:[],step_count:0,last_modified:""}),this.selectLast()},duplicateInstruction:function(){var t=JSON.parse(JSON.stringify(this.instruction));t.name+=" (copy)",this.instructions.push(t),this.selectLast()},deleteInstruction:function(){this.instructions.splice(this.selected,1),this.selected>=this.instructions.length&&this.selectLast()},uploadInstruction:function(){this.instruction.step_count=this.instruction.steps.length,this.instruction.last_modified=Date.now();var t=this.instruction,e=t.steps,s=t.files,i=Object(l["a"])(t,["steps","files"]);e.forEach((function(t){return t.assets.filter((function(t){return t.media.url})).forEach((function(t){return t.media.type=s.find((function(e){return e.name===t.media.url})).type}))}));var n=JSON.stringify(i),a=JSON.stringify(e),r=JSON.stringify(s);console.log(n),console.log(a),console.log(r)},selectLast:function(){this.selected=this.instructions.length-1}}},$=S,j=(s("2411"),Object(m["a"])($,r,o,!1,null,"89cd8dd2",null)),N=j.exports,F=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",[s("div",{staticClass:"card"},[s("p",{staticClass:"label bold"},[t._v("steps")]),t.steps?[s("div",{staticClass:"toolbar"},[s("button",{attrs:{tooltip:"create new"},on:{click:t.createStep}},[s("i",{staticClass:"material-icons-outlined"},[t._v("add")])]),t.step?s("button",{attrs:{tooltip:"duplicate"},on:{click:t.duplicateStep}},[s("i",{staticClass:"material-icons-outlined"},[t._v("library_add")])]):t._e(),t.step?s("button",{attrs:{tooltip:"delete"},on:{click:t.deleteStep}},[s("i",{staticClass:"material-icons-outlined"},[t._v("delete")])]):t._e()]),t.steps.length>0?s("div",{staticClass:"list",staticStyle:{height:"125px"}},t._l(t.steps,(function(e,i){return s("button",{key:i,class:{selected:i===t.selected},on:{click:function(e){t.selected=i}}},[t._v(t._s(e.name))])})),0):t._e()]:t._e(),t.step?[s("p",{staticClass:"label"},[t._v("name")]),s("input",{directives:[{name:"model",rawName:"v-model",value:t.step.name,expression:"step.name"}],attrs:{type:"text"},domProps:{value:t.step.name},on:{input:function(e){e.target.composing||t.$set(t.step,"name",e.target.value)}}}),s("p",{staticClass:"label"},[t._v("description")]),s("textarea",{directives:[{name:"model",rawName:"v-model",value:t.step.description,expression:"step.description"}],domProps:{value:t.step.description},on:{input:function(e){e.target.composing||t.$set(t.step,"description",e.target.value)}}}),t._v(" "),s("p",{staticClass:"label"},[t._v("preview")]),s("FileDrop",{attrs:{types:[1]},model:{value:t.step.preview_url,callback:function(e){t.$set(t.step,"preview_url",e)},expression:"step.preview_url"}})]:t._e()],2)])},P=[],L={name:"Step",props:["steps"],components:{FileDrop:b},data:function(){return{selected:void 0}},computed:{step:function(){var t;return this.$emit("select",this.selected),(null===(t=this.steps)||void 0===t?void 0:t.length)>0?this.steps[this.selected]:null}},watch:{steps:function(t){t&&this.selectLast()}},methods:{createStep:function(){this.steps.push({name:"Step "+(this.steps.length+1),description:"",preview_url:"",assets:[]}),this.selectLast()},duplicateStep:function(){var t=JSON.parse(JSON.stringify(this.step));t.name+=" (copy)",this.steps.push(t),this.selectLast()},deleteStep:function(){this.steps.splice(this.selected,1),this.selected>=this.steps.length&&this.selectLast()},selectLast:function(){this.selected=this.steps.length-1}}},D=L,I=Object(m["a"])(D,F,P,!1,null,null,null),A=I.exports,J=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",[s("div",{staticClass:"card"},[s("p",{staticClass:"label bold"},[t._v("assets")]),t.assets?[s("div",{staticClass:"toolbar"},[s("button",{attrs:{tooltip:"create new"},on:{click:t.createAsset}},[s("i",{staticClass:"material-icons-outlined"},[t._v("add")])]),t.asset?s("button",{attrs:{tooltip:"duplicate"},on:{click:t.duplicateAsset}},[s("i",{staticClass:"material-icons-outlined"},[t._v("library_add")])]):t._e(),t.asset?s("button",{attrs:{tooltip:"awlays face camera"},on:{click:function(e){t.asset.billboard=!t.asset.billboard}}},[t.asset.billboard?s("i",{staticClass:"material-icons-outlined"},[t._v("screen_rotation")]):s("i",{staticClass:"material-icons-outlined"},[t._v("screen_lock_rotation")])]):t._e(),t.asset?s("button",{attrs:{tooltip:"toggle visibility"},on:{click:function(e){t.asset.hidden=!t.asset.hidden}}},[t.asset.hidden?s("i",{staticClass:"material-icons-outlined"},[t._v("visibility_off")]):s("i",{staticClass:"material-icons-outlined"},[t._v("visibility")])]):t._e(),t.asset?s("button",{attrs:{tooltip:"delete"},on:{click:t.deleteAsset}},[s("i",{staticClass:"material-icons-outlined"},[t._v("delete")])]):t._e()]),t.assets.length>0?s("div",{staticClass:"list",staticStyle:{height:"125px"}},t._l(t.assets,(function(e,i){return s("button",{key:i,class:{selected:i===t.selected},on:{click:function(e){t.selected=i}}},[t._v(t._s(e.name))])})),0):t._e()]:t._e(),t.asset?[s("p",{staticClass:"label"},[t._v("name")]),s("input",{directives:[{name:"model",rawName:"v-model",value:t.asset.name,expression:"asset.name"}],attrs:{type:"text"},domProps:{value:t.asset.name},on:{input:function(e){e.target.composing||t.$set(t.asset,"name",e.target.value)}}}),s("p",{staticClass:"label"},[t._v("description")]),s("textarea",{directives:[{name:"model",rawName:"v-model",value:t.asset.media.description,expression:"asset.media.description"}],domProps:{value:t.asset.media.description},on:{input:function(e){e.target.composing||t.$set(t.asset.media,"description",e.target.value)}}}),t._v(" "),s("p",{staticClass:"label"},[t._v("media")]),s("FileDrop",{model:{value:t.asset.media.url,callback:function(e){t.$set(t.asset.media,"url",e)},expression:"asset.media.url"}}),s("p",{staticClass:"label"},[t._v("position")]),s("Vector",{attrs:{vector:t.asset.transform.position}}),s("p",{staticClass:"label"},[t._v("rotation")]),s("Vector",{attrs:{vector:t.asset.transform.rotation}}),s("p",{staticClass:"label"},[t._v("scale")]),s("input",{attrs:{type:"number",step:"0.1"},domProps:{value:t.asset.transform.scale},on:{input:function(e){t.asset.transform.scale=Math.max(.1,t.$toFloat(e.target.value))}}})]:t._e()],2)])},E=[],T=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{attrs:{id:"root"}},t._l(t.keys,(function(e,i){return s("input",{key:i,style:{width:t.width},attrs:{type:"number",step:"0.1"},domProps:{value:t.vector[e]},on:{input:function(s){t.vector[e]=t.$toFloat(s.target.value)}}})})),0)},R=[],M=(s("b64b"),{name:"Vector",props:["vector"],computed:{keys:function(){return Object.keys(this.vector)},width:function(){return 100/this.keys.length+"%"}}}),V=M,z=(s("ac23"),Object(m["a"])(V,T,R,!1,null,"46ffa12d",null)),U=z.exports,B={name:"Asset",props:["assets"],components:{FileDrop:b,Vector:U},data:function(){return{selected:void 0}},computed:{asset:function(){var t;return this.$emit("select",this.selected),(null===(t=this.assets)||void 0===t?void 0:t.length)>0?this.assets[this.selected]:null}},watch:{assets:function(t){t&&this.selectLast()}},methods:{createAsset:function(){this.assets.push({name:"Asset "+(this.assets.length+1),media:{type:0,url:"",description:""},transform:{position:{x:0,y:0,z:0},rotation:{x:0,y:0,z:0},scale:1},hidden:!1,billboard:!1}),this.selectLast()},duplicateAsset:function(){var t=JSON.parse(JSON.stringify(this.asset));t.name+=" (copy)",this.assets.push(t),this.selectLast()},deleteAsset:function(){this.assets.splice(this.selected,1),this.selected>=this.assets.length&&this.selectLast()},selectLast:function(){this.selected=this.assets.length-1}}},q=B,G=Object(m["a"])(q,J,E,!1,null,"c290713c",null),H=G.exports,K=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"card"})},Q=[],W={name:"Render",props:["assets","files"]},X=W,Y=(s("0965"),Object(m["a"])(X,K,Q,!1,null,"3f0d6572",null)),Z=Y.exports;i["a"].prototype.$toFloat=function(t){return t=parseFloat(t),isNaN(t)?0:t};var tt={name:"App",components:{Instruction:N,Step:A,Asset:H,Render:Z},data:function(){return{instructions:[],files:[],steps:[],assets:[]}},methods:{selectInstruction:function(t){var e,s=(null===(e=this.instructions)||void 0===e?void 0:e.length)>0?this.instructions[t]:null;this.steps=null===s||void 0===s?void 0:s.steps,this.files=null===s||void 0===s?void 0:s.files},selectStep:function(t){var e;this.assets=(null===(e=this.steps)||void 0===e?void 0:e.length)>0?this.steps[t].assets:null}}},et=tt,st=(s("5b67"),Object(m["a"])(et,n,a,!1,null,"79f5ee13",null)),it=st.exports;i["a"].config.productionTip=!1,new i["a"]({render:function(t){return t(it)}}).$mount("#app")},"5b67":function(t,e,s){"use strict";var i=s("353e"),n=s.n(i);n.a},9536:function(t,e,s){},abc7:function(t,e,s){},ac23:function(t,e,s){"use strict";var i=s("4d71"),n=s.n(i);n.a},c601:function(t,e,s){},e19c:function(t,e,s){"use strict";var i=s("9536"),n=s.n(i);n.a}});
//# sourceMappingURL=app.6170ae13.js.map