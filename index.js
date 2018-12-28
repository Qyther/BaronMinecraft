var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75,innerWidth/innerHeight,.001,100);
var gamemode = 1;
var cubegeom = new THREE.BoxGeometry(1,1,1);
var flying = false;
var allowjump = false;
var grassTextures = [
		new THREE.MeshPhongMaterial({map: new THREE.TextureLoader().load("textures/Grass/2.png")}),
		new THREE.MeshPhongMaterial({map: new THREE.TextureLoader().load("textures/Grass/3.png")}),
		new THREE.MeshPhongMaterial({map: new THREE.TextureLoader().load("textures/Grass/1.png")}),
		new THREE.MeshPhongMaterial({map: new THREE.TextureLoader().load("textures/Grass/6.png")}),
		new THREE.MeshPhongMaterial({map: new THREE.TextureLoader().load("textures/Grass/4.png")}),
		new THREE.MeshPhongMaterial({map: new THREE.TextureLoader().load("textures/Grass/5.png")})
];
var dirtTextures = [
		new THREE.MeshPhongMaterial({map: new THREE.TextureLoader().load("textures/Dirt/2.png")}),
		new THREE.MeshPhongMaterial({map: new THREE.TextureLoader().load("textures/Dirt/3.png")}),
		new THREE.MeshPhongMaterial({map: new THREE.TextureLoader().load("textures/Dirt/1.png")}),
		new THREE.MeshPhongMaterial({map: new THREE.TextureLoader().load("textures/Dirt/6.png")}),
		new THREE.MeshPhongMaterial({map: new THREE.TextureLoader().load("textures/Dirt/4.png")}),
		new THREE.MeshPhongMaterial({map: new THREE.TextureLoader().load("textures/Dirt/5.png")})
];
var block = 0;
function createBlock(a,b) {
	var cube = new THREE.Mesh(cubegeom, window[b.toLowerCase()+"Textures"]);
	cube.position.set(a[0],a[1],a[2]);
	cube.receiveShadow = true;
	cube.castShadow = true;
	cube.name = b+block;
	scene.add(cube);
	block++;
}
var bounds = [11,4,11];

for(var x=0;x<bounds[0];x++) {
	for(var z=0;z<bounds[2];z++) {
		for(var y=0;y<bounds[1];y++) {
			if(y===bounds[1]-1)
				createBlock([x-bounds[0]/2+.5,y-.5,z-bounds[2]/2+.5],"Grass");
			else
				createBlock([x-bounds[0]/2+.5,y-.5,z-bounds[2]/2+.5],"Dirt");
		}
	}
}

var geometry = new THREE.BoxGeometry(bounds[0],.1,bounds[2]);
var cube = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color:0xffffff }));
cube.position.set(0,-1,0);
cube.receiveShadow = true;
cube.name = "UNHITTABLE";
scene.add(cube);

var geometry = new THREE.BoxGeometry(.1,.1,.1);
var cube = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color:0xffffff }));
scene.add(cube);

ambientLight = new THREE.AmbientLight(0xffffff,.2);
scene.add(ambientLight);
light = new THREE.HemisphereLight(0xffffff, 0x080820, .8);
light.position.set(2,256,0);

scene.add(light);

var text2 = document.createElement("div");
text2.style.position = 'absolute';
text2.style.zIndex = 1;
text2.style.width = 100;
text2.style.height = 100;
text2.style.color = "white";
text2.innerHTML = "+";
text2.style.top = innerHeight/2-7 + 'px';
text2.style.left = innerWidth/2-7 + 'px';
document.body.appendChild(text2);
var text2 = document.createElement("div");
text2.style.position = 'absolute';
text2.style.zIndex = 1;
text2.style.width = 100;
text2.style.height = 100;
text2.style.color = "white";
text2.innerHTML = "0 FPS";
text2.style.top = 0 + 'px';
text2.style.left = 0 + 'px';
document.body.appendChild(text2);

var renderer = new THREE.WebGLRenderer(0xffffff, .2);
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.BasicShadowMap;
document.body.appendChild(renderer.domElement);

var player={
	position:[0,100,0],
	height:1.99,
	speed:.007,
	rotation:[Math.PI/2,-Math.PI/2,0],
	cpos:[0,0,0],
	sensitivity:.8,
	velocity:[0,0,0],
	hitboxradius:.3
};
var world={
	gravity:.003,
	jumpheight:.008,
	maxJumpHeight:.055,
	maxGravityHeight:.4
};
function lerp(a,b,c) {
  return a-((a-b)*c);
}
function distanceVector(v1, v2) {
    var dx = v1.x - v2.x;
    var dy = v1.y - v2.y;
    var dz = v1.z - v2.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}
var down = false;
var up = false;
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var move = [0,0,0];
var last = -1;
var blockspace= false;
function frame() {
	var now = Date.now();
	if(last<0) last = now;
	var averager = 120;
	var delta = (now-last)/(1000/averager);
	if(move[0]===1) {
	var sinn = Math.sin(player.rotation[1]);
	var coss = Math.cos(player.rotation[1]);
	var block = false;
	for(var i=0;i<=player.height;i+=.5) {
		var raycaster = new THREE.Raycaster();
		raycaster.far=player.hitboxradius;
		raycaster.set(new THREE.Vector3(camera.position.x,camera.position.y-i,camera.position.z), new THREE.Vector3(coss,0,sinn));
		var intersects = raycaster.intersectObjects(scene.children);
		if(intersects[0]) block=true;
	}
	if(!block) {
		if(player.velocity[2]+player.velocity[0]<.3) {
			player.velocity[2]+=sinn*player.speed*delta;
			player.velocity[0]+=coss*player.speed*delta;
		}
	} else {
		player.velocity[0]=0;
		player.velocity[2]=0;
	}
	} else if(move[0]===-1) {
	var sinn = -Math.sin(player.rotation[1]);
	var coss = -Math.cos(player.rotation[1]);
	var block = false;
	for(var i=0;i<=player.height;i+=.5) {
		var raycaster = new THREE.Raycaster();
		raycaster.far=player.hitboxradius;
		raycaster.set(new THREE.Vector3(camera.position.x,camera.position.y-i,camera.position.z), new THREE.Vector3(coss,0,sinn));
		var intersects = raycaster.intersectObjects(scene.children);
		if(intersects[0]) block=true;
	}
	if(!block) {
		if(player.velocity[2]+player.velocity[0]>-.3) {
			player.velocity[2]+=sinn*player.speed*delta;
			player.velocity[0]+=coss*player.speed*delta;
		}
	} else {
		player.velocity[0]=0;
		player.velocity[2]=0;
	}
	}
	if(move[1]===1) {
	var sinn = -Math.sin(player.rotation[1]+Math.PI/2);
	var coss = -Math.cos(player.rotation[1]+Math.PI/2);
	var block = false;
	for(var i=0;i<=player.height;i+=.5) {
		var raycaster = new THREE.Raycaster();
		raycaster.far=player.hitboxradius;
		raycaster.set(new THREE.Vector3(camera.position.x,camera.position.y-i,camera.position.z), new THREE.Vector3(coss,0,sinn));
		var intersects = raycaster.intersectObjects(scene.children);
		if(intersects[0]) block=true;
	}
	if(!block) {
		player.position[2]+=sinn*player.speed*delta*10;
		player.position[0]+=coss*player.speed*delta*10;
	}
	} else if(move[1]===-1) {
	var sinn = Math.sin(player.rotation[1]+Math.PI/2);
	var coss = Math.cos(player.rotation[1]+Math.PI/2);
	var block = false;
	for(var i=0;i<=player.height;i+=.5) {
		var raycaster = new THREE.Raycaster();
		raycaster.far=player.hitboxradius;
		raycaster.set(new THREE.Vector3(camera.position.x,camera.position.y-i,camera.position.z), new THREE.Vector3(coss,0,sinn));
		var intersects = raycaster.intersectObjects(scene.children);
		if(intersects[0]) block=true;
	}
	if(!block) {
		player.position[2]+=sinn*player.speed*delta*10;
		player.position[0]+=coss*player.speed*delta*10;
	}
	} else {
		player.velocity[0]=lerp(player.velocity[0],0,.2);
		player.velocity[2]=lerp(player.velocity[2],0,.2);
	}

	player.position[0]+=player.velocity[0]*delta;
	player.position[2]+=player.velocity[2]*delta;

	player.cpos[0]=Math.cos(player.rotation[1])*5;
	player.cpos[2]=Math.sin(player.rotation[1])*5;
	player.cpos[1]=Math.cos(player.rotation[0])*15;

	if(move[2]===1) {
		if(player.velocity[1]<world.maxJumpHeight)
			player.velocity[1]+=world.jumpheight*delta;
		else if(!flying) {
			move[2]=0;
			blockspace = true;
		}
	} else if(move[2]===-1&&flying) {
		if(player.velocity[1]>-world.maxJumpHeight)
			player.velocity[1]-=world.jumpheight*delta;
	} else {
	
	var raycaster = new THREE.Raycaster();
	raycaster.far = player.height;
	raycaster.set(camera.position, new THREE.Vector3(0, -1, 0));
	var intersects = raycaster.intersectObjects(scene.children);
	if(!intersects[0]&&!flying) {
		if(player.velocity[1]>-world.maxGravityHeight)
		player.velocity[1]-=world.gravity*delta;
	} else {
		if(intersects[0]) {
			if(intersects[0].distance<player.height-.2) player.position[1]++;
		}
		player.velocity[1]=0;
		allowjump = true;
	}
	}
	player.position[1]+=player.velocity[1]*delta;

	var raycaster = new THREE.Raycaster();
	raycaster.far=.5;
	raycaster.set(camera.position, new THREE.Vector3(0,1,0));
	var intersects = raycaster.intersectObjects(scene.children);
	if(intersects[0]) {
		move[2]=0;
		blockspace=true;
	}

	

	if(player.rotation[0]>=Math.PI*1.25) down = true;
	else down = false;
	if(player.rotation[0]<=-Math.PI*.25) up = true;
	else up = false;
	camera.lookAt(player.cpos[0]+player.position[0],player.cpos[1]*3+player.position[1],player.cpos[2]+player.position[2]);
	camera.position.set(player.position[0],player.position[1]+player.height,player.position[2]);

	mouse.x = (innerWidth/2/innerWidth) * 2 - 1;
	mouse.y = - (innerHeight/2/innerHeight) * 2 + 1;
	
	var raycaster = new THREE.Raycaster();
	raycaster.setFromCamera(mouse, camera);

	var intersects = raycaster.intersectObjects(scene.children);
	currentselected="";
	if(intersects.length>0) {
		if(intersects[0].object.name!=="UNHITTABLE")
		currentselected = intersects[0].object.name;
	}
	renderer.render(scene, camera);
	last = now;
	document.getElementsByTagName("div")[1].innerHTML = (averager/delta).toFixed(1)+" FPS";
	requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
var currentselected = "";
var msd = false;
if ("onpointerlockchange" in document)
  document.addEventListener("pointerlockchange", cursorChange);
else if ("onmozpointerlockchange" in document)
  document.addEventListener("mozpointerlockchange", cursorChange);
function cursorChange() {
	if(document.pointerLockElement===document.body||document.mozPointerLockElement===document.body)
		msd=true;
  else
  	msd=false;
}
document.addEventListener("mousedown",e=>{
	if(e.button===0) {
	if(!msd) {
	document.body.requestPointerLock = document.body.requestPointerLock || document.body.mozRequestPointerLock;
	document.body.requestPointerLock();
} else {
	if(currentselected!=="") {
	var selectedObject = scene.getObjectByName(currentselected);
	if(distanceVector(camera.position,selectedObject.position)<6)
    scene.remove(selectedObject);
	}
}
} else if(e.button===2) {
	var raycaster = new THREE.Raycaster();
	raycaster.setFromCamera(mouse, camera);

	var intersects = raycaster.intersectObjects(scene.children);
	if(intersects[0]) {
		var normal = intersects[0].face.normal;
		createBlock([intersects[0].object.position.x+normal.x,intersects[0].object.position.y+normal.y,intersects[0].object.position.z+normal.z],"Grass");
	}
}
});
var allowmovement = false;
setTimeout(()=>{
allowmovement=true;
},5000);
document.addEventListener("mousemove",e=>{
	var upp = 990;
	var left = 200;
	if(msd&&allowmovement) {
	player.rotation[1]+=e.movementX/(left/player.sensitivity);
	if(!down&&!up)
	player.rotation[0]+=e.movementY/(upp/player.sensitivity);
	else if(e.movementY/(upp/player.sensitivity)>0&&up)
		player.rotation[0]+=e.movementY/(upp/player.sensitivity);
	else if(e.movementY/(upp/player.sensitivity)<0&&down)
		player.rotation[0]+=e.movementY/(upp/player.sensitivity);
	}
});
document.addEventListener("keydown",e=>{
	if(!allowmovement) return;
	if(e.key==="e"&&!flying) flying = true;
	else if(e.key==="e"&&flying) flying = false;
	if(e.key==="q"&&flying) move[2]=-1;
	if(e.key==="w") move[0]=1;
	if(e.key==="s") move[0]=-1;
	if(e.key==="a") move[1]=1;
	if(e.key==="d") move[1]=-1;
	if(e.keyCode===32&&!blockspace&&allowjump) {
		move[2]=1;
		allowjump = false;
	}
});
document.addEventListener("keyup",e=>{
	if(e.key==="w") move[0]=0;
	if(e.key==="s") move[0]=0;
	if(e.key==="a") move[1]=0;
	if(e.key==="d") move[1]=0;
	if(e.key==="q") move[2]=0;
	if(e.keyCode===32) move[2]=0;
	blockspace = false;
})