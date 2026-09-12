import * as THREE from 'three';

// The boat and grid share one wave function so their movement stays connected.
export function createOceanScene(stage) {
const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(35,1,.1,80);
camera.position.set(8,6.2,9); camera.lookAt(0,.3,0);
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:"low-power"});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.setClearColor(0x030609,0); renderer.outputColorSpace=THREE.SRGBColorSpace;
stage.appendChild(renderer.domElement);
scene.add(new THREE.HemisphereLight(0xb6e6ff,0x15203f,2.4));
const key=new THREE.DirectionalLight(0xc0ebff,3.2); key.position.set(3,7,4); scene.add(key);
const rim=new THREE.DirectionalLight(0xa998ff,3); rim.position.set(-4,3,-3); scene.add(rim);
const world=new THREE.Group(); scene.add(world);
const n=72, extent=2.9;
const geo=new THREE.PlaneGeometry(5.8,5.8,n,n); geo.rotateX(-Math.PI/2);
const water=new THREE.Mesh(geo,new THREE.MeshBasicMaterial({color:0x040a11,side:THREE.DoubleSide,polygonOffset:true,polygonOffsetFactor:1,polygonOffsetUnits:1})); world.add(water);
const gridN=36, samples=108, count=(gridN+1)*samples*2*2;
const pos=new Float32Array(count*3), colors=new Float32Array(count*3);
const gridGeo=new THREE.BufferGeometry(); gridGeo.setAttribute('position',new THREE.BufferAttribute(pos,3).setUsage(THREE.DynamicDrawUsage));
const c1=new THREE.Color('#70cad3'), c2=new THREE.Color('#8c78d0');
let v=0;
for(let axis=0;axis<2;axis++)for(let line=0;line<=gridN;line++)for(let s=0;s<samples;s++)for(let end=0;end<2;end++){
 const along=-extent+5.8*(s+end)/samples, fixed=-extent+5.8*line/gridN;
 const x=axis===0?fixed:along,z=axis===0?along:fixed;
 pos[v*3]=x;pos[v*3+2]=z;
 const col=c1.clone().lerp(c2,(x+extent)/5.8); colors[v*3]=col.r;colors[v*3+1]=col.g;colors[v*3+2]=col.b;v++;
}
gridGeo.setAttribute('color',new THREE.BufferAttribute(colors,3));
const grid=new THREE.LineSegments(gridGeo,new THREE.LineBasicMaterial({vertexColors:true,transparent:true,opacity:.64})); world.add(grid);
function wave(x,z,t){return .14*Math.sin(1.6*x+.65*z-t*.85)+.095*Math.sin(1.9*z-.6*x-t*.66)+.035*Math.cos(3.2*x+2.4*z-t*1.15);}
const boat=new THREE.Group();world.add(boat);
const navy=new THREE.MeshStandardMaterial({color:0x203b62,roughness:.6,metalness:.2});
const cream=new THREE.MeshStandardMaterial({color:0xced8d9,roughness:.7});
const trim=new THREE.MeshStandardMaterial({color:0x4c7190,roughness:.5,metalness:.3});
const deckMat=new THREE.MeshStandardMaterial({color:0x758185,roughness:.9});
const glass=new THREE.MeshStandardMaterial({color:0x153f57,emissive:0x3d8da2,emissiveIntensity:.35,roughness:.2,metalness:.5});
function box(w,h,d,x,y,z,mat){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);boat.add(m);return m;}
// Tapered hull, with the bow pointing toward positive X.
const upper=[[-1,.42],[-1,-.42],[.63,-.42],[1.13,0],[.63,.42]];
const lower=[[-.85,.24],[-.85,-.24],[.5,-.24],[.92,0],[.5,.24]];
const hullP=[], hullI=[];
for(const [x,z] of upper)hullP.push(x,.36,z);
for(const [x,z] of lower)hullP.push(x,-.2,z);
for(let i=0;i<5;i++){let j=(i+1)%5;hullI.push(i,j,5+i,j,5+j,5+i);}
for(let i=1;i<4;i++)hullI.push(0,i,i+1,5,5+i+1,5+i);
const hullGeo=new THREE.BufferGeometry();hullGeo.setAttribute('position',new THREE.Float32BufferAttribute(hullP,3));hullGeo.setIndex(hullI);hullGeo.computeVertexNormals();
const hull=new THREE.Mesh(hullGeo,navy); hull.material.side=THREE.DoubleSide;boat.add(hull);
box(1.52,.055,.64,-.12,.385,0,deckMat);
box(.68,.51,.57,-.26,.66,0,cream);
box(.84,.07,.73,-.26,.94,0,trim);
for(const z of [-.291,.291])for(const x of [-.46,-.14])box(.23,.24,.016,x,.73,z,glass);
box(.015,.24,.43,.086,.73,0,glass);
box(.21,.28,.21,-.52,1.1,0,navy);
function rod(a,b,r,mat){const av=new THREE.Vector3(...a),bv=new THREE.Vector3(...b),d=bv.clone().sub(av);const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,d.length(),8),mat);m.position.copy(av).add(bv).multiplyScalar(.5);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize());boat.add(m);}
rod([.33,.4,0],[.33,1.55,0],.019,trim);rod([.33,1.3,-.22],[.33,1.3,.22],.012,trim);
const flagCanvas=document.createElement('canvas');flagCanvas.width=384;flagCanvas.height=256;
const flagCtx=flagCanvas.getContext('2d');
flagCtx.fillStyle='#aecfd8';flagCtx.fillRect(0,0,384,256);
const favicon=new Image();

let disposed=false;
const flagTexture=new THREE.CanvasTexture(flagCanvas);
favicon.onload=()=>{if(disposed)return;flagCtx.drawImage(favicon,100,36,184,184);flagTexture.needsUpdate=true;render();};
favicon.src='/favicon.ico';flagTexture.colorSpace=THREE.SRGBColorSpace;
const flag=new THREE.Mesh(new THREE.PlaneGeometry(.53,.35,20,10),new THREE.MeshStandardMaterial({map:flagTexture,side:THREE.DoubleSide,roughness:.85}));flag.position.set(.605,1.36,0);boat.add(flag);
for(const z of [-.38,.38]){
 for(const x of [-.87,.3,.65])rod([x,.4,z],[x,.62,z],.009,cream);
 rod([-.89,.62,z],[.65,.62,z],.009,cream);
 const ring=new THREE.Mesh(new THREE.TorusGeometry(.105,.033,8,24),new THREE.MeshStandardMaterial({color:0xdf9768,roughness:.7}));ring.position.set(-.62,.31,z*1.14);boat.add(ring);
}
boat.scale.setScalar(.9);

let t=0, running=false, request=0, last=0, targetRotation=0;
// A half turn over the hero's scroll range; scrolling back restores the view.
function onScroll(){
 const bounds=stage.getBoundingClientRect();
 const end=window.scrollY+bounds.bottom;
 targetRotation=THREE.MathUtils.clamp(window.scrollY/Math.max(end,1),0,1)*Math.PI;
}
window.addEventListener('scroll',onScroll,{passive:true});
onScroll();
const up=new THREE.Vector3(0,1,0),normal=new THREE.Vector3(),slopeQ=new THREE.Quaternion(),headingQ=new THREE.Quaternion();
function update(dt){
world.rotation.y=THREE.MathUtils.lerp(world.rotation.y,targetRotation,1-Math.exp(-dt*5));
const fp=flag.geometry.attributes.position;
for(let i=0;i<fp.count;i++){const u=(fp.getX(i)+.265)/.53;fp.setZ(i,.035*u*Math.sin(u*7-t*2.4+fp.getY(i)*4));}fp.needsUpdate=true;flag.geometry.computeVertexNormals();
const p=geo.attributes.position;
for(let i=0;i<p.count;i++)p.setY(i,wave(p.getX(i),p.getZ(i),t));p.needsUpdate=true;
for(let i=0;i<count;i++)pos[i*3+1]=wave(pos[i*3],pos[i*3+2],t)+.006;gridGeo.attributes.position.needsUpdate=true;
const bx=.09*Math.sin(t*.36),bz=.075*Math.sin(t*.28+.8),e=.3;
normal.set(-(wave(bx+e,bz,t)-wave(bx-e,bz,t))/(2*e),1,-(wave(bx,bz+e,t)-wave(bx,bz-e,t))/(2*e)).normalize();
slopeQ.setFromUnitVectors(up,normal);headingQ.setFromAxisAngle(up,-.23+.035*Math.sin(t*.32));slopeQ.multiply(headingQ);
boat.quaternion.slerp(slopeQ,1-Math.exp(-dt*3));boat.position.set(bx,wave(bx,bz,t)-.025,bz);

}
function render(){if(!disposed)renderer.render(scene,camera);}
function resize(){const w=stage.clientWidth,h=stage.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);camera.aspect=w/h;camera.position.set(8,6.2,9).multiplyScalar(w/h<=1.05?1.15:1);camera.lookAt(0,.3,0);camera.updateProjectionMatrix();onScroll();render();}
const observer=new ResizeObserver(resize);observer.observe(stage);
resize();update(0);render();
function frame(now){if(!running||disposed)return;const dt=Math.min((now-last)/1000,.05);last=now;t+=dt;update(dt);render();request=requestAnimationFrame(frame);}
return {
setRunning(value){if(value===running||disposed)return;running=value;if(running){last=performance.now();request=requestAnimationFrame(frame);}else{cancelAnimationFrame(request);}},
dispose(){disposed=true;running=false;cancelAnimationFrame(request);observer.disconnect();window.removeEventListener('scroll',onScroll);favicon.onload=null;favicon.onerror=null;
const geometries=new Set(),materials=new Set();scene.traverse(object=>{if(object.geometry)geometries.add(object.geometry);if(object.material){for(const material of Array.isArray(object.material)?object.material:[object.material])materials.add(material);}});
geometries.forEach(geometry=>geometry.dispose());materials.forEach(material=>material.dispose());flagTexture.dispose();renderer.dispose();renderer.domElement.remove();}
};
}
