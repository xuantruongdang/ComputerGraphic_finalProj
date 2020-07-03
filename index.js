import * as THREE from './js/three.module.js';
import {OrbitControls} from './js/OrbitControls.js';
import {TransformControls} from './js/TransformControls.js';
import {TeapotBufferGeometry} from './js/TeapotBufferGeometry.js';

var camera, scene, renderer, control, orbit;
var mesh, meshplan, texture;
var ray, light, lighthelper;
var type_material;
var material = new THREE.MeshBasicMaterial({color: 0xffffff});
material.needsUpdate = true;
var mouse = new THREE.Vector2();

// Geometry
var BoxGeometry = new THREE.BoxGeometry(30, 30, 30, 40, 40, 40);
var SphereGeometry = new THREE.SphereGeometry(20, 20, 20);
var ConeGeometry = new THREE.ConeGeometry(18, 30, 32, 20);
var CylinderGeometry = new THREE.CylinderGeometry(20, 20, 40, 30, 5);
var TorusGeometry = new THREE.TorusGeometry(20, 5, 20, 100);
var TeapotGeometry = new TeapotBufferGeometry(20, 8);

init();
render();

function init()
{
    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x343a40);

    // Camera
    var camera_x = 1;
    var camera_y = 50;
    var camera_z = 100;
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
	camera.position.set(camera_x, camera_y, camera_z);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // Grid
    var size = 300;
    var divisions = 50;
    var gridHelper = new THREE.GridHelper(size, divisions);
    scene.add(gridHelper);

    // Add the coordinate
    var size_lines = 70;
    var axesHelper = new THREE.AxesHelper(size_lines);
    scene.add(axesHelper);

    // Renderer
    ray = new THREE.Raycaster();
    renderer = new THREE.WebGLRenderer({ antialias: true})
    renderer.setSize( window.innerWidth, window.innerHeight )
    renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.getElementById("rendering").appendChild(renderer.domElement);
    document.getElementById("rendering").addEventListener('mousedown', onMouseDown, false);
    window.addEventListener( 'resize', () => {
        var width = window.innerWidth
        var height = window.innerHeight
        renderer.setSize( width, height )
        camera.aspect = width / height
        camera.updateProjectionMatrix()
        render()
    })
    orbit = new OrbitControls(camera, renderer.domElement);
    orbit.update();
    orbit.addEventListener('change', render);
    control = new TransformControls(camera, renderer.domElement);
    console.log(control)
    control.addEventListener('change', render);
	control.addEventListener('dragging-changed', function (event) {
		orbit.enabled = !event.value;
	} );
}

function render(){
	renderer.render(scene, camera);
}

function CMesh(dummy_mesh) {
	mesh.name = dummy_mesh.name;
	mesh.position.set(dummy_mesh.position.x, dummy_mesh.position.y, dummy_mesh.position.z);
	mesh.rotation.set(dummy_mesh.rotation._x, dummy_mesh.rotation._y, dummy_mesh.rotation._z);
    mesh.scale.set(dummy_mesh.scale.x, dummy_mesh.scale.y, dummy_mesh.scale.z);
    mesh.castShadow = true;
	mesh.receiveShadow = true;
	scene.add(mesh);
	control_transform(mesh);
}
// 1. Basic 3D model with points, line and solid
function SetMaterial(mat)
{
    mesh = scene.getObjectByName("mesh");
    light = scene.getObjectByName("pointlight");
    type_material = mat;

    if (mesh)
    {
        const dummy_mesh = mesh.clone();
        scene.remove(mesh);
        switch (type_material)
        {
            case 1: material = new THREE.PointsMaterial({ color: 0xffffff, size: 0.25 });
                    mesh = new THREE.Points(dummy_mesh.geometry, material);
                    CMesh(dummy_mesh); break;
            case 2: material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
                    mesh = new THREE.Mesh(dummy_mesh.geometry, material);
                    CMesh(dummy_mesh); break;
            case 3:
                if (!light) 
                    material = new THREE.MeshBasicMaterial({ color: 0xffffff });
				else
					material = new THREE.MeshPhongMaterial({ color: 0xffffff });
				mesh = new THREE.Mesh(dummy_mesh.geometry, material);
                CMesh(dummy_mesh);break;
            case 4:
                if (!light) 
                    material = new THREE.MeshBasicMaterial({map: texture,transparent: true});
				else
					material = new THREE.MeshLambertMaterial({map: texture,transparent: true});
				mesh = new THREE.Mesh(dummy_mesh.geometry, material);
				CMesh(dummy_mesh);break;
        }
        render();
    }
}
window.SetMaterial = SetMaterial

function RenderGeo(id){
    mesh = scene.getObjectByName("mesh");
    scene.remove(mesh);
    switch (id) {
        case 1:
			mesh = new THREE.Mesh(BoxGeometry, material);
			break;
		case 2:
			mesh = new THREE.Mesh(SphereGeometry, material);
			break;
		case 3:
			mesh = new THREE.Mesh(ConeGeometry, material);
			break;
		case 4:
			mesh = new THREE.Mesh(CylinderGeometry, material);
			break;
		case 5:
			mesh = new THREE.Mesh(TorusGeometry, material);
			break;
		case 6:
			mesh = new THREE.Mesh(TeapotGeometry, material);
			break;
    }
	var box = new THREE.Box3().setFromObject(mesh);
	mesh.position.y-=box.min['y'];
	mesh.name = "mesh";
	mesh.castShadow = true;
	mesh.receiveShadow = true;
    scene.add(mesh);
    control_transform(mesh);
    render();
}
window.RenderGeo = RenderGeo;

// 2. near, far
function setFOV(value)
{
	camera.fov = Number(value);
    camera.updateProjectionMatrix();
    render();
}
window.setFOV = setFOV;

function setFar(value)
{
	camera.far = Number(value);
    camera.updateProjectionMatrix();
    render();
}
window.setFar = setFar;

function setNear(value)
{
	camera.near = Number(value);
    camera.updateProjectionMatrix();
    render();
}
window.setNear = setNear;

// 3. Affine
function Translate()
{
    control.setMode( "translate" );
}
window.Translate = Translate;

function Rotate()
{
    control.setMode( "rotate" );
}
window.Rotate = Rotate;

function Scale()
{
    control.setMode( "scale" );
}
window.Scale = Scale;

function control_transform(mesh) {
	control.attach(mesh);
	scene.add(control);
	console.log(control);
	window.addEventListener('keydown', function (event) {
		switch (event.keyCode) {
            case 84: // T
				Translate();break;
			case 82: // R
				Rotate();break;
			case 83: // S
				Scale();break;
			case 88: // X
				control.showX = ! control.showX;break;
			case 89: // Y
				control.showY = ! control.showY;break;
			case 90: // Z
				control.showZ = ! control.showZ;break;
			case 76: // L
				SetPointLight();break;
			case 32: // spacebar
				RemoveLight();break;
		}
	});
}

// 4.Light
function SetPointLight() {
	light = scene.getObjectByName("pointlight");
	if (!light) {
		{
			const planeSize = 400;
			const loader = new THREE.TextureLoader();
			const planeGeo = new THREE.PlaneBufferGeometry(planeSize, planeSize);
			const planeMat = new THREE.MeshPhongMaterial({side: THREE.DoubleSide,});
			meshplan = new THREE.Mesh(planeGeo, planeMat);
			meshplan.receiveShadow = true;
			meshplan.rotation.x = Math.PI * -.5;
			meshplan.position.y += 0.5;
			scene.add(meshplan);
		}
		const color = '#FFFFFF';
		const intensity = 2;
		light = new THREE.PointLight(color, intensity);
		light.name = "pointlight";
		light.castShadow = true;
		light.position.set(0, 70, 70);
		scene.add(light);
		control_transform(light);
		if (type_material == 3 || type_material == 4) {
			SetMaterial(type_material);
		}
		lighthelper = new THREE.PointLightHelper(light);
		lighthelper.name = "plh";
		scene.add(lighthelper);
		render();
	}
}
window.SetPointLight = SetPointLight;

function RemoveLight() {
	scene.remove(light);
    scene.remove(lighthelper);
    scene.remove(meshplan);
	if (type_material == 3 || type_material == 4) {
		SetMaterial(type_material);
	}
	render();
}
window.RemoveLight = RemoveLight;

function onMouseDown(event) {
	event.preventDefault();
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
	ray.setFromCamera(mouse, camera);
	var intersects = ray.intersectObjects(scene.children);
	let check_obj = 0;
	if (intersects.length > 0) {
		var obj;
		for (obj in intersects) {
			if (intersects[obj].object.type == "mesh") {
				check_obj = 1;
				control_transform(intersects[obj].object);
				break;
			}
			if (intersects[obj].object.type == "lighthelper") {
				check_obj = 1;
				control_transform(light);
				break;
			}
		}
	}
	if (check_obj == 0 && control.dragging == 0) control.detach();
	render();
}

// 5.Texture 
function SetTexture(url) {
    mesh = scene.getObjectByName("mesh");
	if (mesh) {
		texture = new THREE.TextureLoader().load(url, render);
		texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
		SetMaterial(4);
	}
}
window.SetTexture = SetTexture;
