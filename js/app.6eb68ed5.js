(function(t){function e(e){for(var i,o,r=e[0],c=e[1],l=e[2],p=0,d=[];p<r.length;p++)o=r[p],Object.prototype.hasOwnProperty.call(n,o)&&n[o]&&d.push(n[o][0]),n[o]=0;for(i in c)Object.prototype.hasOwnProperty.call(c,i)&&(t[i]=c[i]);u&&u(e);while(d.length)d.shift()();return a.push.apply(a,l||[]),s()}function s(){for(var t,e=0;e<a.length;e++){for(var s=a[e],i=!0,r=1;r<s.length;r++){var c=s[r];0!==n[c]&&(i=!1)}i&&(a.splice(e--,1),t=o(o.s=s[0]))}return t}var i={},n={app:0},a=[];function o(e){if(i[e])return i[e].exports;var s=i[e]={i:e,l:!1,exports:{}};return t[e].call(s.exports,s,s.exports,o),s.l=!0,s.exports}o.m=t,o.c=i,o.d=function(t,e,s){o.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:s})},o.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},o.t=function(t,e){if(1&e&&(t=o(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var s=Object.create(null);if(o.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var i in t)o.d(s,i,function(e){return t[e]}.bind(null,i));return s},o.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return o.d(e,"a",e),e},o.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},o.p="/INNO-S20-SP/";var r=window["webpackJsonp"]=window["webpackJsonp"]||[],c=r.push.bind(r);r.push=e,r=r.slice();for(var l=0;l<r.length;l++)e(r[l]);var u=c;a.push([0,"chunk-vendors"]),s()})({0:function(t,e,s){t.exports=s("56d7")},"0965":function(t,e,s){"use strict";var i=s("c601"),n=s.n(i);n.a},4712:function(t,e,s){},"4d71":function(t,e,s){},"547e":function(t,e,s){"use strict";var i=s("90ac"),n=s.n(i);n.a},"56d7":function(t,e,s){"use strict";s.r(e);s("e260"),s("e6cf"),s("cca6"),s("a79d");var i=s("2b0e"),n=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{attrs:{id:"app"}},[s("Instruction",{attrs:{instructions:t.instructions},on:{select:t.selectInstruction}}),s("Step",{attrs:{steps:t.steps},on:{select:t.selectStep}}),s("Asset",{attrs:{assets:t.assets}}),s("Render",{attrs:{assets:t.assets}})],1)},a=[],o=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",[s("div",{staticClass:"card"},[s("p",{staticClass:"label bold"},[t._v("instructions")]),t.instructions?[s("div",{staticClass:"toolbar"},[t.instructions?s("button",{attrs:{tooltip:"create new"},on:{click:t.createInstruction}},[s("i",{staticClass:"material-icons-outlined"},[t._v("add")])]):t._e(),t.instruction?s("button",{attrs:{tooltip:"duplicate"},on:{click:t.duplicateInstruction}},[s("i",{staticClass:"material-icons-outlined"},[t._v("library_add")])]):t._e(),t.instruction?s("button",{attrs:{tooltip:"upload to server"},on:{click:t.uploadInstruction}},[s("i",{staticClass:"material-icons-outlined"},[t._v("publish")])]):t._e(),t.instruction?s("button",{attrs:{tooltip:"delete"},on:{click:t.deleteInstruction}},[s("i",{staticClass:"material-icons-outlined"},[t._v("delete")])]):t._e()]),t.instructions.length>0?s("div",{staticClass:"list",staticStyle:{height:"125px"}},t._l(t.instructions,(function(e,i){return s("button",{key:i,class:{selected:i===t.selected},on:{click:function(e){t.selected=i}}},[t._v(t._s(e.name))])})),0):t._e()]:t._e(),t.instruction?[s("p",{staticClass:"label"},[t._v("name")]),s("input",{directives:[{name:"model",rawName:"v-model",value:t.instruction.name,expression:"instruction.name"}],attrs:{type:"text"},domProps:{value:t.instruction.name},on:{input:function(e){e.target.composing||t.$set(t.instruction,"name",e.target.value)}}}),s("p",{staticClass:"label"},[t._v("description")]),s("textarea",{directives:[{name:"model",rawName:"v-model",value:t.instruction.description,expression:"instruction.description"}],domProps:{value:t.instruction.description},on:{input:function(e){e.target.composing||t.$set(t.instruction,"description",e.target.value)}}}),t._v(" "),s("p",{staticClass:"label"},[t._v("preview")]),s("FileDrop",{attrs:{label:"preview"}})]:t._e()],2),s("div",{staticClass:"card",staticStyle:{"margin-top":"20px",width:"430px"}},[s("p",{staticClass:"label bold"},[t._v("files")]),t.instruction?s("div",{attrs:{id:"files"}},[s("div",{staticClass:"list",staticStyle:{height:"125px"}},t._l(t.files,(function(e,i){return s("button",{key:i,on:{click:function(e){t.selectedFile=i}}},[t._v(t._s(e.name))])})),0),s("FileUpload",{model:{value:t.files,callback:function(e){t.files=e},expression:"files"}})],1):t._e()])])},r=[],c=(s("a434"),s("b0c0"),s("15fd")),l=s("ec26"),u=function(){var t=this,e=t.$createElement;t._self._c;return t._m(0)},p=[function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{attrs:{id:"root"}},[s("p",{attrs:{id:"empty"}},[t._v("drag an asset here")])])}],d={name:"FileDrop"},f=d,v=(s("5843"),s("2877")),m=Object(v["a"])(f,u,p,!1,null,"6550ae02",null),h=m.exports,_=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{attrs:{id:"root"},on:{click:function(e){return t.$refs.input.click()},drop:t.drop,dragover:function(t){return t.preventDefault()}}},[s("p",{attrs:{id:"empty"}},[t._v("click or drag your local files here to upload")]),s("input",{attrs:{hidden:"",multiple:"",type:"file",accept:t.extensions.join(" ")},on:{change:function(e){t.upload(Array.from(e.target.files))}}})])},b=[],g=(s("99af"),s("4de4"),s("0481"),s("a630"),s("caad"),s("d81d"),s("4069"),s("d3b7"),s("ac1f"),s("2532"),s("3ca3"),s("1276"),s("ddb0"),s("3835")),y=(s("96cf"),s("1da1")),x={name:"FileUpload",props:["files"],data:function(){return{images:[".bmp",".jpeg",".jpg",".png"],audios:[".mp3"],videos:[".mp4"],models:[".glb"]}},computed:{types:function(){return[this.images,this.audios,this.videos,this.models]},extensions:function(){return this.types.flat()}},methods:{upload:function(t){var e=this;return Object(y["a"])(regeneratorRuntime.mark((function s(){return regeneratorRuntime.wrap((function(s){while(1)switch(s.prev=s.next){case 0:return s.t0=e,s.t1=e.files,s.next=4,Promise.all(t.map(e.readFile));case 4:s.t2=s.sent,s.t3=s.t1.concat.call(s.t1,s.t2),s.t0.$emit.call(s.t0,"upload",s.t3);case 7:case"end":return s.stop()}}),s)})))()},readFile:function(t){var e=this.getType;return new Promise((function(s,i){var n=new FileReader;n.onload=function(){return s({name:t.name,type:e(t.name),content:n.result})},n.onerror=i,n.readAsBinaryString(t)}))},getExt:function(t){return"."+t.split(".").pop()},getType:function(t){var e=this.getExt(t);for(var s in this.types.entries()){var i=Object(g["a"])(s,2),n=i[0],a=i[1];if(a.includes(e))return n+1}return 0},drop:function(t){var e=this;return Object(y["a"])(regeneratorRuntime.mark((function s(){return regeneratorRuntime.wrap((function(s){while(1)switch(s.prev=s.next){case 0:return t.preventDefault(),s.next=3,e.upload(Array.from(t.dataTransfer.files).filter((function(t){return e.extensions.includes(e.getExt(t.name))})));case 3:case"end":return s.stop()}}),s)})))()},dragOver:function(t){t.preventDefault()}},model:{prop:"files",event:"upload"}},w=x,C=(s("547e"),Object(v["a"])(w,_,b,!1,null,"13bbd730",null)),O=C.exports,k={name:"Instruction",props:["instructions"],components:{FileDrop:h,FileUpload:O},data:function(){return{selected:void 0,files:[]}},watch:{instructions:function(t){t&&this.selectLast()}},computed:{instruction:function(){var t;return this.$emit("select",this.selected),(null===(t=this.instructions)||void 0===t?void 0:t.length)>0?this.instructions[this.selected]:null}},methods:{createInstruction:function(){this.instructions.push({id:Object(l["a"])(),size:0,name:"Instruction "+(this.instructions.length+1),description:"Lorem impsum dolor sit amet",preview_url:"",steps:[],step_count:0,last_modified:""}),this.selectLast()},duplicateInstruction:function(){var t=JSON.parse(JSON.stringify(this.instruction));t.name+=" (copy)",this.instructions.push(t),this.selectLast()},deleteInstruction:function(){this.instructions.splice(this.selected,1),this.selected>=this.instructions.length&&this.selectLast()},uploadInstruction:function(){this.instruction.step_count=this.instruction.steps.length,this.instruction.last_modified=Date.now();var t=this.instruction,e=t.steps,s=Object(c["a"])(t,["steps"]),i=JSON.stringify(s),n=JSON.stringify(e);console.log(i),console.log(n)},selectLast:function(){this.selected=this.instructions.length-1}}},S=k,j=(s("e410"),Object(v["a"])(S,o,r,!1,null,"098984e0",null)),$=j.exports,F=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",[s("div",{staticClass:"card"},[s("p",{staticClass:"label bold"},[t._v("steps")]),t.steps?[s("div",{staticClass:"toolbar"},[s("button",{attrs:{tooltip:"create new"},on:{click:t.createStep}},[s("i",{staticClass:"material-icons-outlined"},[t._v("add")])]),t.step?s("button",{attrs:{tooltip:"duplicate"},on:{click:t.duplicateStep}},[s("i",{staticClass:"material-icons-outlined"},[t._v("library_add")])]):t._e(),t.step?s("button",{attrs:{tooltip:"delete"},on:{click:t.deleteStep}},[s("i",{staticClass:"material-icons-outlined"},[t._v("delete")])]):t._e()]),t.steps.length>0?s("div",{staticClass:"list",staticStyle:{height:"125px"}},t._l(t.steps,(function(e,i){return s("button",{key:i,class:{selected:i===t.selected},on:{click:function(e){t.selected=i}}},[t._v(t._s(e.name))])})),0):t._e()]:t._e(),t.step?[s("p",{staticClass:"label"},[t._v("name")]),s("input",{directives:[{name:"model",rawName:"v-model",value:t.step.name,expression:"step.name"}],attrs:{type:"text"},domProps:{value:t.step.name},on:{input:function(e){e.target.composing||t.$set(t.step,"name",e.target.value)}}}),s("p",{staticClass:"label"},[t._v("description")]),s("textarea",{directives:[{name:"model",rawName:"v-model",value:t.step.description,expression:"step.description"}],domProps:{value:t.step.description},on:{input:function(e){e.target.composing||t.$set(t.step,"description",e.target.value)}}}),t._v(" "),s("p",{staticClass:"label"},[t._v("preview")]),s("FileDrop")]:t._e()],2)])},L=[],N={name:"Step",props:["steps"],components:{FileDrop:h},data:function(){return{selected:void 0}},computed:{step:function(){var t;return this.$emit("select",this.selected),(null===(t=this.steps)||void 0===t?void 0:t.length)>0?this.steps[this.selected]:null}},watch:{steps:function(t){t&&this.selectLast()}},methods:{createStep:function(){this.steps.push({name:"Step "+(this.steps.length+1),description:"Lorem impsum dolor sit amet",preview_url:void 0,assets:[]}),this.selectLast()},duplicateStep:function(){var t=JSON.parse(JSON.stringify(this.step));t.name+=" (copy)",this.steps.push(t),this.selectLast()},deleteStep:function(){this.steps.splice(this.selected,1),this.selected>=this.steps.length&&this.selectLast()},selectLast:function(){this.selected=this.steps.length-1}}},P=N,I=Object(v["a"])(P,F,L,!1,null,null,null),A=I.exports,E=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",[s("div",{staticClass:"card"},[s("p",{staticClass:"label bold"},[t._v("assets")]),t.assets?[s("div",{staticClass:"toolbar"},[s("button",{attrs:{tooltip:"create new"},on:{click:t.createAsset}},[s("i",{staticClass:"material-icons-outlined"},[t._v("add")])]),t.asset?s("button",{attrs:{tooltip:"duplicate"},on:{click:t.duplicateAsset}},[s("i",{staticClass:"material-icons-outlined"},[t._v("library_add")])]):t._e(),t.asset?s("button",{attrs:{tooltip:"visibility"},on:{click:function(e){t.asset.hidden=!t.asset.hidden}}},[t.asset.hidden?s("i",{staticClass:"material-icons-outlined"},[t._v("visibility_off")]):s("i",{staticClass:"material-icons-outlined"},[t._v("visibility")])]):t._e(),t.asset?s("button",{attrs:{tooltip:"delete"},on:{click:t.deleteAsset}},[s("i",{staticClass:"material-icons-outlined"},[t._v("delete")])]):t._e()]),t.assets.length>0?s("div",{staticClass:"list",staticStyle:{height:"125px"}},t._l(t.assets,(function(e,i){return s("button",{key:i,class:{selected:i===t.selected},on:{click:function(e){t.selected=i}}},[t._v(t._s(e.name))])})),0):t._e()]:t._e(),t.asset?[s("p",{staticClass:"label"},[t._v("name")]),s("input",{directives:[{name:"model",rawName:"v-model",value:t.asset.name,expression:"asset.name"}],attrs:{type:"text"},domProps:{value:t.asset.name},on:{input:function(e){e.target.composing||t.$set(t.asset,"name",e.target.value)}}}),s("p",{staticClass:"label"},[t._v("description")]),s("textarea",{directives:[{name:"model",rawName:"v-model",value:t.asset.media.description,expression:"asset.media.description"}],domProps:{value:t.asset.media.description},on:{input:function(e){e.target.composing||t.$set(t.asset.media,"description",e.target.value)}}}),t._v(" "),s("p",{staticClass:"label"},[t._v("media")]),s("FileDrop"),s("p",{staticClass:"label"},[t._v("position")]),s("Vector",{attrs:{vector:t.asset.transform.position}}),s("p",{staticClass:"label"},[t._v("rotation")]),s("Vector",{attrs:{vector:t.asset.transform.rotation}}),s("p",{staticClass:"label"},[t._v("scale")]),s("input",{attrs:{type:"number",step:"0.1"},domProps:{value:t.asset.transform.scale},on:{input:function(e){t.asset.transform.scale=t.$toFloat(e.target.value)}}})]:t._e()],2)])},D=[],J=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{attrs:{id:"root"}},t._l(t.keys,(function(e,i){return s("input",{key:i,style:{width:t.width},attrs:{type:"number",step:"0.1"},domProps:{value:t.vector[e]},on:{input:function(s){t.vector[e]=t.$toFloat(s.target.value)}}})})),0)},R=[],T=(s("b64b"),{name:"Vector",props:["vector"],computed:{keys:function(){return Object.keys(this.vector)},width:function(){return 100/this.keys.length+"%"}}}),M=T,V=(s("ac23"),Object(v["a"])(M,J,R,!1,null,"46ffa12d",null)),z=V.exports,U={name:"Asset",props:["assets"],components:{FileDrop:h,Vector:z},data:function(){return{selected:void 0}},computed:{asset:function(){var t;return this.$emit("select",this.selected),(null===(t=this.assets)||void 0===t?void 0:t.length)>0?this.assets[this.selected]:null}},watch:{assets:function(t){t&&this.selectLast()}},methods:{createAsset:function(){this.assets.push({name:"Asset "+(this.assets.length+1),media:{type:0,url:void 0,description:"Lorem impsum dolor sit amet"},transform:{position:{x:0,y:0,z:0},rotation:{x:0,y:0,z:0},scale:1},hidden:!1}),this.selectLast()},duplicateAsset:function(){var t=JSON.parse(JSON.stringify(this.asset));t.name+=" (copy)",this.assets.push(t),this.selectLast()},deleteAsset:function(){this.assets.splice(this.selected,1),this.selected>=this.assets.length&&this.selectLast()},selectLast:function(){this.selected=this.assets.length-1}}},B=U,q=Object(v["a"])(B,E,D,!1,null,"6d9b55ff",null),G=q.exports,H=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"card"})},K=[],Q={name:"Render",props:["assets","files"]},W=Q,X=(s("0965"),Object(v["a"])(W,H,K,!1,null,"3f0d6572",null)),Y=X.exports;i["a"].prototype.$toFloat=function(t){return t=parseFloat(t),isNaN(t)?0:t};var Z={name:"App",components:{Instruction:$,Step:A,Asset:G,Render:Y},data:function(){return{instructions:[],steps:[],assets:[]}},methods:{selectInstruction:function(t){var e;this.steps=(null===(e=this.instructions)||void 0===e?void 0:e.length)>0?this.instructions[t].steps:null},selectStep:function(t){var e;this.assets=(null===(e=this.steps)||void 0===e?void 0:e.length)>0?this.steps[t].assets:null}}},tt=Z,et=(s("66ff"),Object(v["a"])(tt,n,a,!1,null,"5e1ce6ec",null)),st=et.exports;i["a"].config.productionTip=!1,new i["a"]({render:function(t){return t(st)}}).$mount("#app")},5843:function(t,e,s){"use strict";var i=s("b143"),n=s.n(i);n.a},"66ff":function(t,e,s){"use strict";var i=s("8682"),n=s.n(i);n.a},8682:function(t,e,s){},"90ac":function(t,e,s){},ac23:function(t,e,s){"use strict";var i=s("4d71"),n=s.n(i);n.a},b143:function(t,e,s){},c601:function(t,e,s){},e410:function(t,e,s){"use strict";var i=s("4712"),n=s.n(i);n.a}});
//# sourceMappingURL=app.6eb68ed5.js.map