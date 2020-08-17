"use strict";

import { OrbitControls } from "../node_modules/three/examples/jsm/controls/OrbitControls.js";
import { FBXLoader } from "../node_modules/three/examples/jsm/loaders/FBXLoader.js";

let camera, controls, scene;
const canvas = document.querySelector("#c");
const pickPosition = {x: 0, y: 0};
const pickHelper = new PickHelper();
const renderer = new THREE.WebGLRenderer({canvas});


// * adding word

const addPlane = () => {
    const loader = new THREE.TextureLoader();
    const texture = loader.load("../assets/img/ground.jpg");
    const planeGeometry = new THREE.PlaneGeometry(300,300,10,1);
	const planeMaterial = new THREE.MeshBasicMaterial({ map: texture });
	const plane = new THREE.Mesh(planeGeometry,planeMaterial);
	plane.rotation.x=-0.5*Math.PI;
	plane.position.x = 0;
	plane.position.y = -75;
	plane.position.z = 0;
	scene.add(plane);
};

const addPlaneBottom = () => {
    const loader = new THREE.TextureLoader();
    const texture = loader.load("../assets/img/ground.jpg");
    const geometry = new THREE.ConeBufferGeometry( 10, 30, 40 );
	const material = new THREE.MeshBasicMaterial({ map: texture });

    for ( var i = 0; i < 500; i ++ ) {
        const sphere = new THREE.Mesh(geometry, material);
        sphere.rotation.x = -1*Math.PI;
        sphere.position.y = -93;
        sphere.position.z = rand(140, -140);
        sphere.position.x = rand(140, -140);
        sphere.updateMatrix();
        sphere.matrixAutoUpdate = false;
        scene.add(sphere);
    }
};

const addTree = () => {
    const loader = new FBXLoader();

    for (let i = 0; i <= 30; i++) {
        loader.load( "../assets/fbx/NatureFreePack1.fbx", function ( object ) {

            object.scale.x = object.scale.x * 2;
            object.scale.y = object.scale.y * 2;
            object.scale.z = object.scale.z * 2;
    
            object.position.y = -75;
            object.position.z = rand(130, -130);
            object.position.x = rand(130, -130);
    
            scene.add(object);
        });
    }
};

const addStars = () => {
    const sphereGeometry = new THREE.SphereGeometry(1,5,5);
	const sphereMaterial = new THREE.MeshBasicMaterial({color: 0xf6ff75});

    for ( var i = 0; i < 500; i ++ ) {
        const sphere = new THREE.Mesh(sphereGeometry,sphereMaterial);
        sphere.position.x = Math.random() * 1600 - 800;
        sphere.position.y = Math.random() * 1600 - 800;
        sphere.position.z = Math.random() * 1600 - 800;
        sphere.updateMatrix();
        sphere.matrixAutoUpdate = false;
        scene.add(sphere);
    }
};

const addHouse = () => {
    const loader = new THREE.TextureLoader();
    const geometry = new THREE.BoxGeometry(25,150,25);
    const texture = loader.load("../assets/img/plane.jpg");
    const material = new THREE.MeshPhongMaterial( { map: texture , flatShading: true } );
    const mesh = new THREE.Mesh( geometry, material );
    mesh.updateMatrix();
    mesh.matrixAutoUpdate = false;
    mesh.renderOrder = 2;
    scene.add( mesh );
};

const setGeometrySize = (width, height, depth) => {
    const boxWidth = width;
    const boxHeight = height;
    const boxDepth = depth;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

    return geometry;
};

const rand = (min, max) => {
    if (max === undefined) {
      max = min;
      min = 0;
    }
    return min + (max - min) * Math.random();
};

const addSatellite = () => {
    const geometry = new THREE.SphereGeometry(10,20,20);
    const loader = new THREE.TextureLoader();
    const texture = loader.load("../assets/img/fbx_textures_REF1.png");
    const material = new THREE.MeshPhongMaterial({
       map: texture,
    });
    const sphere = new THREE.Mesh(geometry, material);
    
    sphere.name = "hover";
    sphere.position.y = 100;
    sphere.position.z = 0;
    sphere.position.x = 0;
    scene.add(sphere);
};

const addWindowsToTheHouse = () => {
    makeWindows(0, 5.2);
    makeWindows(0, -5.2);
    makeWindows(5.2, 0);
    makeWindows(-5.2, 0);
};

const makeWindows = (x, z) => {
    const geometry = setGeometrySize(15, 18, 15);

    for (let i = 60; i >= -60; i = i - 30) {
        makeInstance(geometry, i, x, z);
    }
};

const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
};

const makeInstance = (geometry, y, x, z) => {
    const loader = new THREE.TextureLoader();
    const texture = loader.load("../assets/img/windows.png");
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.y = y;
    cube.position.x = x;
    cube.position.z = z;
    cube.renderOrder = 0;
    scene.add(cube);
    return cube;
};

function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
        renderer.setSize(width, height, false);
    }
    return needResize;
}

const getCanvasRelativePosition = (event) => {
    const rect = canvas.getBoundingClientRect();
    return {
        x: (event.clientX - rect.left) * canvas.width  / rect.width,
        y: (event.clientY - rect.top ) * canvas.height / rect.height,
    };
};

const setPickPosition = (event) => {
    const pos = getCanvasRelativePosition(event);
    pickPosition.x = (pos.x / canvas.width ) *  2 - 1;
    pickPosition.y = (pos.y / canvas.height) * -2 + 1; 
};

const createScene = () => {
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x000000 );
    scene.fog = new THREE.FogExp2( 0xcccccc, 0.001 );
};

const createRenderer = () => {
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    
    return renderer;
};

const createCamera = () => {
    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.set( 400, 200, 0 );

    // if nessesary
    // scene.add( new THREE.AxisHelper(60));

    const cameraPole = new THREE.Object3D();
    scene.add(cameraPole);
    cameraPole.add(camera);

    return cameraPole;
};

const createLights = () => {
    const light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 1, 0, 0 );
    scene.add(light);

    const light1 = new THREE.DirectionalLight( 0x002288 );
    light.position.set( - 1, - 1, - 1 );
    scene.add(light1);

    const light2 = new THREE.AmbientLight( 0x222222 );
    scene.add(light2);
    window.addEventListener( "resize", onWindowResize, false );

    {
        const color = 0xFFFFFF;
        const intensity = 2;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        camera.add(light);
    }
};

const createControls = () => {
    controls = new OrbitControls( camera, renderer.domElement );
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 50;
    controls.maxDistance = 1000;
    controls.maxPolarAngle = Math.PI / 2;
};

const createWorld = () => {
    addPlane();
    addHouse();
    addWindowsToTheHouse();
    addStars();
    addTree();
    addSatellite();
    addPlaneBottom();
};

// * main picker

export function init() {
    createScene();
    createRenderer();

    document.body.appendChild( renderer.domElement );
    const cameraPole = createCamera();
    createLights();
    createControls();
    createWorld();
   
    const render = (time) => {
        time *= 0.001;
    
        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }
    
        cameraPole.rotation.y = time * -0.05;
        pickHelper.pick(pickPosition, scene, camera, time);
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    };
    
    requestAnimationFrame(render);
    
    window.addEventListener("mousemove", setPickPosition);

    window.addEventListener("touchstart", (event) => {
    event.preventDefault();
    setPickPosition(event.touches[0]);
    }, {passive: false});
    
    window.addEventListener("touchmove", (event) => {
        setPickPosition(event.touches[0]);
    });
}