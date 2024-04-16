import*as THREE from"https://cdn.jsdelivr.net/npm/three@0.121.1/build/three.module.js";import{OrbitControls}from"https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js";function Planet(){this.scene=null,this.camera=null,this.renderer=null,this.controls=null,this.canvas=document.getElementById("three-planet"),this.size={width:window.innerWidth,height:window.innerHeight},this.instancedMesh=null,this.sphereRadius=20,this.latCount=100,this.dotDensity=.8,this.coords=[],this.dot=new THREE.Object3D,this.imgData=null,this.imgWidth=null,this.imgHeight=null,this.roughness=.8,this.lightPosition=new THREE.Vector3(-50,50,130)}Planet.prototype.createScene=function(){this.scene=new THREE.Scene},Planet.prototype.createCamera=function(){this.camera=new THREE.PerspectiveCamera(25,this.size.width/this.size.height),this.camera.position.z=120,this.scene.add(this.camera)},Planet.prototype.createSphere=function(){const t=new THREE.SphereGeometry(this.sphereRadius-.01,100,50),e=new THREE.MeshStandardMaterial({color:4618957});e.roughness=this.roughness;const i=new THREE.Mesh(t,e);this.scene.add(i)},Planet.prototype.createLight=function(){const t=new THREE.PointLight(4042935,2.1,0);t.position.set(this.lightPosition.x,this.lightPosition.y,this.lightPosition.z),this.camera.add(t)},Planet.prototype.createAtmosphere=function(){const t=new THREE.SphereGeometry(this.sphereRadius,100,50),e=new THREE.ShaderMaterial({uniforms:{uLightPosition:{value:this.lightPosition}},fragmentShader:this.fragment(),vertexShader:this.vertex(),blending:THREE.AdditiveBlending,side:THREE.BackSide}),i=new THREE.Mesh(t,e);i.scale.set(1.03,1.03,1.03),this.scene.add(i)},Planet.prototype.vertex=function(){return"\n        varying vec3 vNormal;\n        \n        void main() {\n            vNormal = normal;\n            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n        }\n        "},Planet.prototype.fragment=function(){return"\n        uniform vec3 uLightPosition;\n\n        varying vec3 vNormal;\n\n        void main() {\n\n            vec3 normal = normalize(vNormal);\n            vec3 normalizedLight = normalize(uLightPosition);\n            float intensity = pow((-1. * 0.1) -  dot(vNormal, normalizedLight), 2.);\n            // vec3 color = vec3(0.196,1.,1.);\n            vec3 color = vec3(0.024,0.714,0.831);\n\n            gl_FragColor = vec4(color, 1.) * intensity;\n\n\n            \n\n            // float intensity = 1.05 - dot(vNormal, normalizedLight);\n            // vec3 atmosphere = vec3(0.3,0.6,1.) * pow(intensity,3.);\n            // gl_FragColor = vec4(atmosphere, 1.);\n        }\n    "},Planet.prototype.createDots=function(){let t=!1;for(let e=0;e<this.latCount;e+=1){const i=Math.cos((180/this.latCount*e-90)*(Math.PI/180))*this.sphereRadius*Math.PI*2*2,n=Math.ceil(i*this.dotDensity);for(let i=0;i<n;i+=1){const s=Math.PI/this.latCount*e,o=2*Math.PI/n*i,r=(new THREE.Vector3).setFromSphericalCoords(this.sphereRadius,s,o),h=this.spherePointToUV(r,new THREE.Vector3),a=this.sampleImage(this.imgWidth,this.imgHeight,this.imgData.data,h);0===a[3]&&t?(t=!1,this.coords.push({size:"lg",coord:r})):255!==a[3]||t?a[3]&&this.coords.push({size:"sm",coord:r}):(t=!0,this.coords.push({size:"lg",coord:r}))}}const e=new THREE.CircleGeometry(.2,15),i=new THREE.MeshStandardMaterial({color:5303219,side:THREE.DoubleSide});i.roughness=this.roughness,this.instancedMesh=new THREE.InstancedMesh(e,i,this.coords.length);for(let t=0;t<this.instancedMesh.count;t++){if(this.dot.position.x=this.coords[t].coord.x,this.dot.position.y=this.coords[t].coord.y,this.dot.position.z=this.coords[t].coord.z,this.dot.lookAt(this.camera.getWorldDirection(new THREE.Vector3)),"lg"===this.coords[t].size){const t=.9-Math.round(2*Math.random())/10;this.dot.scale.x=t,this.dot.scale.y=t,this.dot.scale.z=t}else{const t=.4+Math.round(2*Math.random())/10;this.dot.scale.x=t,this.dot.scale.y=t,this.dot.scale.z=t}this.dot.updateMatrix(),this.instancedMesh.setMatrixAt(t,this.dot.matrix)}console.log("Elements: ",this.instancedMesh.count),this.scene.add(this.instancedMesh)},Planet.prototype.createRenderer=function(){this.renderer=new THREE.WebGLRenderer({canvas:this.canvas,alpha:!0}),this.renderer.setSize(this.size.width,this.size.height),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.render(this.scene,this.camera)},Planet.prototype.resize=function(){let t=window.innerWidth;window.addEventListener("resize",()=>{t!==window.innerWidth&&(t=window.innerWidth,this.size.width=window.innerWidth,this.size.height=window.innerHeight,this.renderer.setSize(this.size.width,this.size.height),this.camera.aspect=this.size.width/this.size.height,this.camera.updateProjectionMatrix(),this.renderer.render(this.scene,this.camera))})},Planet.prototype.createOrbitControls=function(){this.controls=new OrbitControls(this.camera,this.canvas)},Planet.prototype.animate=function(){gsap.ticker.add(t=>{this.controls.update(),this.renderer.render(this.scene,this.camera),this.instancedMesh.rotation.x=.05*t,this.instancedMesh.rotation.y=.05*-t})},Planet.prototype.showMap=function(){(new THREE.ImageLoader).load("./img/map.png",t=>{const e=document.createElement("canvas"),i=e.getContext("2d");e.width=t.width,e.height=t.height,i.drawImage(t,0,0);const n=i.getImageData(0,0,t.width,t.height);this.imgData=n,this.imgWidth=t.width,this.imgHeight=t.height,this.create3D()})},Planet.prototype.spherePointToUV=function(t,e){const i=new THREE.Vector3;i.subVectors(e,t).normalize();const n=1-(.5+Math.atan2(i.z,i.x)/(2*Math.PI)),s=.5+Math.asin(i.y)/Math.PI;return new THREE.Vector2(n,s)},Planet.prototype.sampleImage=function(t,e,i,n){const s=4*Math.floor(n.x*t)+Math.floor(n.y*e)*(4*t);return i.slice(s,s+4)},Planet.prototype.create3D=function(){this.createScene(),this.createCamera(),this.createSphere(),this.createDots(),this.createLight(),this.createRenderer(),this.createOrbitControls(),this.resize(),this.animate()};const planet=new Planet;planet.showMap();