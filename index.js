var camera, scene, renderer, material, d_id;
var type_material = 3;
var geometry = new THREE.Mesh();

// Geometry
var BoxGeometry = new THREE.BoxGeometry(30, 30, 30, 40, 40, 40);
var SphereGeometry = new THREE.SphereGeometry(20, 20, 20);
var ConeGeometry = new THREE.ConeGeometry(18, 30, 32, 20);
var CylinderGeometry = new THREE.CylinderGeometry(20, 20, 40, 30, 5);
var TorusGeometry = new THREE.TorusGeometry(20, 5, 20, 100);
var TeapotGeometry = new THREE.TeapotBufferGeometry(20, 8);

var init = function ()
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
    renderer = new THREE.WebGLRenderer({ antialias: true})
    renderer.setSize( window.innerWidth, window.innerHeight )
    document.getElementById("rendering").appendChild(renderer.domElement);
    window.addEventListener( 'resize', () => {
        var width = window.innerWidth
        var height = window.innerHeight
        renderer.setSize( width, height )
        camera.aspect = width / height
        camera.updateProjectionMatrix()
    })
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    Graphics_3Dmodel();
}

var SetMaterial = function (mat)
{
    type_material = mat;
    switch (type_material)
    {
        case 1: material = new THREE.PointsMaterial({ color: 0xffffff, size: 0.25 }); break; //points
        case 2: material = new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: 2 } );  break; //line
        case 3: material = new THREE.MeshBasicMaterial({ color: 0xffffff });  break; //solid
    }
    RenderGeo(d_id);
}

var RenderGeo = function (id) {
    controls.update();
    if (id > 0 && id < 7) {
        d_id = id;
        scene.remove(geometry);
    }
    switch (id) {
        case 1:
            if (type_material == 1)
                geometry = new THREE.Points(BoxGeometry, material);
            if (type_material == 2)
            {
                geo = new THREE.EdgesGeometry(BoxGeometry)
                geometry = new THREE.LineSegments( geo, material );
            }
            if (type_material == 3)
                geometry = new THREE.Mesh(BoxGeometry, material);
            break;
        case 2:
            if (type_material == 1)
                geometry = new THREE.Points(SphereGeometry, material);
            if (type_material == 2)
            {
                geo = new THREE.EdgesGeometry(SphereGeometry)
                geometry = new THREE.LineSegments( geo, material );
            }
            if (type_material == 3)
                geometry = new THREE.Mesh(SphereGeometry, material);
            break;
        case 3:
            if (type_material == 1)
                geometry = new THREE.Points(ConeGeometry, material);
            if (type_material == 2)
            {
                geo = new THREE.EdgesGeometry(ConeGeometry)
                geometry = new THREE.LineSegments( geo, material );
            }
            if (type_material == 3)
                geometry = new THREE.Mesh(ConeGeometry, material);
            break;
        case 4:
            if (type_material == 1)
                geometry = new THREE.Points(CylinderGeometry, material);
            if (type_material == 2)
            {
                geo = new THREE.EdgesGeometry(CylinderGeometry)
                geometry = new THREE.LineSegments( geo, material );
            }
            if (type_material == 3)
                geometry = new THREE.Mesh(CylinderGeometry, material);
            break;
        case 5:
            if (type_material == 1)
                geometry = new THREE.Points(TorusGeometry, material);
            if (type_material == 2)
            {
                geo = new THREE.EdgesGeometry(TorusGeometry)
                geometry = new THREE.LineSegments( geo, material );
            }
            if (type_material == 3)
                geometry = new THREE.Mesh(TorusGeometry, material);
            break;
        case 6:
            if (type_material == 1)
                geometry = new THREE.Points(TeapotGeometry, material);
            if (type_material == 2)
            {
                geo = new THREE.EdgesGeometry(TeapotGeometry)
                geometry = new THREE.LineSegments( geo, material );
            }
            if (type_material == 3)
                geometry = new THREE.Mesh(TeapotGeometry, material);
            break;
    }
    var box = new THREE.Box3().setFromObject(geometry);
	geometry.position.y-=box.min['y'];
    scene.add(geometry);
    renderer.render(scene, camera);
    requestAnimationFrame(RenderGeo);
}

var Graphics_3Dmodel = function () {
	controls.update();
	renderer.render(scene, camera);
	requestAnimationFrame(Graphics_3Dmodel);
};

init();
