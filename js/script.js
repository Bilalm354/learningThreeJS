var scene, camera, renderer, mesh;
var crate, createTexture, crateNormalMap, crateBumpMap;
var USE_WIREFRAME = false;

var keyboard = {};
var player = {
    height: 1.8,
    speed: 0.2,
    turnSpeed: Math.PI * 0.01
};

const init = () => {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
        90,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    mesh = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshStandardMaterial({
            color: 0xff4444,
            wireframe: USE_WIREFRAME
        })
    );
    mesh.position.y += 1;
    mesh.recieveShadow = true;
    mesh.castShadow = true;
    scene.add(mesh);

    meshFloor = new THREE.Mesh(
        new THREE.PlaneGeometry(10, 10, 10, 10),
        new THREE.MeshStandardMaterial({
            color: 0xffffff,
            wireframe: USE_WIREFRAME
        })
    );
    meshFloor.rotation.x -= Math.PI / 2;
    meshFloor.recieveShadow = true;
    scene.add(meshFloor);

    ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    light = new THREE.PointLight(0xffffff, 0.8, 18);
    light.position.set(-3, 6, -3);
    light.castShadow = true;
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 25;
    scene.add(light);

    // TODO: Fix Shadows as they don't work.
    // var helper = new THREE.CameraHelper(light.shadow.camera);
    // scene.add(helper);

    // Texture Loading
    var textureLoader = new THREE.TextureLoader();
    crateTexture = textureLoader.load("../crate0/crate0_diffuse.png");
    crateBumpMap = textureLoader.load("../crate0/crate0_bump.png");
    crateNormalMap = textureLoader.load("../crate0/crate0_normal.png");

    crate = new THREE.Mesh(
        new THREE.BoxGeometry(3, 3, 3),
        new THREE.MeshPhongMaterial({
            color: 0xffffff,
            map: crateTexture,
            bumpMap: crateBumpMap,
            normalMap: crateNormalMap
        })
    );
    crate.position.set(2.5, 3 / 2, 2.5);
    crate.recieveShadow = true;
    crate.castShadow = true;
    scene.add(crate);

    camera.position.set(0, player.height, -5);
    camera.lookAt(new THREE.Vector3(0, player.height, 0));

    renderer = new THREE.WebGLRenderer();
    renderer.antialias = true;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);

    animate();
};

function animate() {
    requestAnimationFrame(animate);
    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.02;
    crate.rotation.y += 0.01;

    // keyboard controls
    if (keyboard[87]) {
        // W key
        camera.position.x -= Math.sin(camera.rotation.y) * player.speed;
        camera.position.z -= -Math.cos(camera.rotation.y) * player.speed;
    }
    if (keyboard[83]) {
        // S key
        camera.position.x += Math.sin(camera.rotation.y) * player.speed;
        camera.position.z += -Math.cos(camera.rotation.y) * player.speed;
    }
    if (keyboard[65]) {
        // A key
        camera.position.x +=
            Math.sin(camera.rotation.y + Math.PI / 2) * player.speed;
        camera.position.z +=
            -Math.cos(camera.rotation.y + Math.PI / 2) * player.speed;
    }
    if (keyboard[68]) {
        // D key
        camera.position.x +=
            Math.sin(camera.rotation.y - Math.PI / 2) * player.speed;
        camera.position.z +=
            -Math.cos(camera.rotation.y - Math.PI / 2) * player.speed;
    }

    if (keyboard[37]) {
        // left arrow key
        camera.rotation.y -= Math.PI * player.turnSpeed;
    }
    if (keyboard[39]) {
        //right arrow key
        camera.rotation.y += Math.PI * player.turnSpeed;
    }

    renderer.render(scene, camera);
}

function keyDown(event) {
    keyboard[event.keyCode] = true;
}

function keyUp(event) {
    keyboard[event.keyCode] = false;
}

window.addEventListener("keydown", keyDown);
window.addEventListener("keyup", keyUp);

window.onload = init;
