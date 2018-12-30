//FIREBASE
  var config = {
    apiKey: "AIzaSyDlUl-YN8OY816ISLKRSiHkXSMSWhsXLwY",
    authDomain: "baronminecraft-7642b.firebaseapp.com",
    databaseURL: "https://baronminecraft-7642b.firebaseio.com",
    projectId: "baronminecraft-7642b",
    storageBucket: "baronminecraft-7642b.appspot.com",
    messagingSenderId: "334246200593"
  };
  firebase.initializeApp(config);
  var database = firebase.database();
  var players = database.ref("Players");

var cubess = [];

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
var bedrockTextures = [
		new THREE.MeshPhongMaterial({map: new THREE.TextureLoader().load("textures/Bedrock/2.png")}),
		new THREE.MeshPhongMaterial({map: new THREE.TextureLoader().load("textures/Bedrock/3.png")}),
		new THREE.MeshPhongMaterial({map: new THREE.TextureLoader().load("textures/Bedrock/1.png")}),
		new THREE.MeshPhongMaterial({map: new THREE.TextureLoader().load("textures/Bedrock/6.png")}),
		new THREE.MeshPhongMaterial({map: new THREE.TextureLoader().load("textures/Bedrock/4.png")}),
		new THREE.MeshPhongMaterial({map: new THREE.TextureLoader().load("textures/Bedrock/5.png")})];
var block = 0;
function createBlock(a,b) {
	var cube = new THREE.Mesh(cubegeom, window[b.toLowerCase()+"Textures"]);
	cube.position.set(a[0],a[1],a[2]);
	cube.receiveShadow = true;
	cube.castShadow = true;
	cube.name = b+block;
	cubess.push([a[0],a[1],a[2],b+block]);
	scene.add(cube);
	block++;
}
var bounds = [11,5,11];

for(var x=0;x<bounds[0];x++) {
	for(var z=0;z<bounds[2];z++) {
		for(var y=0;y<bounds[1];y++) {
			if(y===bounds[1]-1)
				createBlock([x-bounds[0]/2+.5,y,z-bounds[2]/2+.5],"Grass");
			else if(y===0)
				createBlock([x-bounds[0]/2+.5,y,z-bounds[2]/2+.5],"Bedrock");
			else
				createBlock([x-bounds[0]/2+.5,y,z-bounds[2]/2+.5],"Dirt");
		}
	}
}

var geometry = new THREE.BoxGeometry(bounds[0],.1,bounds[2]);
var cube = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color:0xffffff }));
cube.position.set(0,bounds[0]+bounds[1]+4.6,0);
cube.receiveShadow = true;
cube.name = "UNHITTABLE";
scene.add(cube);

var geometry = new THREE.BoxGeometry(bounds[0],.1,bounds[2]);
var cube = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color:0xffffff }));
cube.position.set(0,.1,0);
cube.receiveShadow = true;
cube.name = "UNHITTABLE";
scene.add(cube);

var geometry = new THREE.BoxGeometry(.1,bounds[0]*2,bounds[2]);
var cube = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0xffffff }));
cube.position.set(-bounds[0]/2,bounds[0]/2+bounds[1]-.5,0);
cube.name = "UNHITTABLE";
scene.add(cube);

var geometry = new THREE.BoxGeometry(.1,bounds[0]*2,bounds[2]);
var cube = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0xffffff }));
cube.position.set(bounds[0]/2,bounds[0]/2+bounds[1]-.5,0);
cube.name = "UNHITTABLE";
scene.add(cube);

var geometry = new THREE.BoxGeometry(bounds[2],bounds[0]*2,.1);
var cube = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0xffffff }));
cube.position.set(0,bounds[0]/2+bounds[1]-.5,-bounds[0]/2);
cube.name = "UNHITTABLE";
scene.add(cube);

var geometry = new THREE.BoxGeometry(bounds[2],bounds[0]*2,.1);
var cube = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0xffffff }));
cube.position.set(0,bounds[0]/2+bounds[1]-.5,bounds[0]/2);
cube.name = "UNHITTABLE";
scene.add(cube);




var geometry = new THREE.BoxGeometry(.1,.1,.1);
var cube = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color:0xffffff }));
scene.add(cube);

ambientLight = new THREE.AmbientLight(0xffffff,.2);
scene.add(ambientLight);
light = new THREE.HemisphereLight(0xffffff, 0x080820, .8);
light.position.set(0,bounds[0]+bounds[1]-.5,0);

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
	position:[0,0,0],
	height:1.8,
	speed:.045,
	rotation:[Math.PI/2,-Math.PI/2,0],
	cpos:[0,0,0],
	sensitivity:.8,
	velocity:0,
	hitboxradius:.3
};
var world={
	gravity:.003,
	jumpheight:.008,
	maxJumpHeight:.07,
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
			player.position[2]+=sinn*player.speed*delta;
			player.position[0]+=coss*player.speed*delta;
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
			player.position[2]+=sinn*player.speed*delta;
			player.position[0]+=coss*player.speed*delta;
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
		player.position[2]+=sinn*player.speed*delta;
		player.position[0]+=coss*player.speed*delta;
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
		player.position[2]+=sinn*player.speed*delta;
		player.position[0]+=coss*player.speed*delta;
	}
	}

	player.cpos[0]=Math.cos(player.rotation[1])*5;
	player.cpos[2]=Math.sin(player.rotation[1])*5;
	player.cpos[1]=Math.cos(player.rotation[0])*15;

	if(move[2]===1) {
		if(player.velocity<world.maxJumpHeight)
			if(world.jumpheight*delta>world.maxJumpHeight) player.velocity = world.maxJumpHeight;
		else
			player.velocity+=world.jumpheight*delta;
		else if(!flying) {
			move[2]=0;
			blockspace = true;
		}
	} else if(move[2]===-1&&flying) {
		if(player.velocity>-world.maxJumpHeight)
			player.velocity-=world.jumpheight*delta;
	} else {
	
	var raycaster = new THREE.Raycaster();
	raycaster.far = player.height;
	raycaster.set(camera.position, new THREE.Vector3(0, -1, 0));
	var intersects = raycaster.intersectObjects(scene.children);
	if(!intersects[0]&&!flying) {
		if(player.velocity>-world.maxGravityHeight)
		player.velocity-=world.gravity*delta;
	} else {
		if(intersects[0]) {
			if(intersects[0].distance<player.height-.2) player.position[1]+=.01;
		}
		player.velocity=0;
		allowjump = true;
	}
	}
	player.position[1]+=player.velocity*delta;

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
	camera.lookAt(player.cpos[0]+player.position[0],player.cpos[1]*4+player.position[1],player.cpos[2]+player.position[2]);
	camera.position.set(player.position[0],player.position[1]+player.height,player.position[2]);

	mouse.x = (innerWidth/2/innerWidth) * 2 - 1;
	mouse.y = - (innerHeight/2/innerHeight) * 2 + 1;
	
	var raycaster = new THREE.Raycaster();
	raycaster.setFromCamera(mouse, camera);

	var intersects = raycaster.intersectObjects(scene.children);
	currentselected="";
	if(intersects.length>0) {
		if(intersects[0].object.name!=="UNHITTABLE"&&intersects[0].object.name.indexOf("Bedrock")===-1)
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
	var blockplace = true;
	var normal = intersects[0].face.normal;
	var endpos = [intersects[0].object.position.x+normal.x,intersects[0].object.position.y+normal.y,intersects[0].object.position.z+normal.z];
	if(intersects[0]) {
		if(Math.abs(endpos[0]-player.position[0])<1&&Math.abs(endpos[2]-player.position[2])<1) {
			if(Math.abs(endpos[1]-player.position[1])>0&&Math.abs(endpos[1]-player.position[1])<1) blockplace = false;
		}
		if(blockplace)
		createBlock(endpos,"Grass");
	}
}
});
var allowmovement = false;
setTimeout(()=>{
allowmovement=true;
player.position=[0,0,0];
},2000);
document.addEventListener("mousemove",e=>{
	var upp = 1320;
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
	if(e.key==="r") player.position=[0,0,0];
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
});
var configuredusers = {};
var newas = {
	"Position":{

	}
};
newas["Position"]["X"]=player.position[0];
newas["Position"]["Y"]=player.position[1];
newas["Position"]["Z"]=player.position[2];
var currentID = players.push(newas).key;
function renderPlayers() {
	players.once("value",data=>{
	var keys = Object.keys(data.val());
	for(var i=0;i<keys.length;i++) {
		if(keys[i]!==currentID) {
		var position = data.val()[keys[i]]["Position"];
		var xp = position["X"];
		var yp = position["Y"];
		var zp = position["Z"];

		var jns = {
			"Position":{

			}
		};
		jns["Position"]["X"]=xp;
		jns["Position"]["Y"]=yp;
		jns["Position"]["Z"]=zp;

		if(!configuredusers[keys[i]]) {
			var geometryy = new THREE.BoxGeometry(1,player.height,1);
			var mat = new THREE.MeshPhongMaterial({ color: 0xffffff });
			var playern = new THREE.Mesh(geometryy,mat);
			playern.position.set(xp,yp,zp);
			playern.receiveShadow = true;
			playern.castShadow = true;
			playern.name = "UNHITTABLE";
			scene.add(playern);
			configuredusers[keys[i]]=[xp,yp,zp,playern];
		} else {
			configuredusers[keys[i]]=[xp,yp,zp,configuredusers[keys[i]][3]];
			configuredusers[keys[i]][3].position.set(xp,yp+player.height-.7,zp);
		}
	}
}
});
var njs = {
	"Position":{

	}
};
njs["Position"]["X"]=player.position[0];
njs["Position"]["Y"]=player.position[1];
njs["Position"]["Z"]=player.position[2];
database.ref("Players/"+currentID).set(njs);
requestAnimationFrame(renderPlayers);
}
requestAnimationFrame(renderPlayers);


addEventListener("unload",e=>{
	database.ref("Players/"+currentID).remove();
});