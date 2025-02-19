const scene = new THREE.Scene();
scene.background = new THREE.Color(0xD2DFEA);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const glowingMaterial = new THREE.ShaderMaterial({
  uniforms: {
    time: { value: 1.0 },
    color1: { value: new THREE.Color(0x00FFFF) },
    color2: { value: new THREE.Color(0xFF00FF) },
  },
  vertexShader: document.getElementById("vertexShader").textContent,
  fragmentShader: document.getElementById("fragmentShader").textContent,
  side: THREE.DoubleSide,
  blending: THREE.AdditiveBlending,
  transparent: true,
});


// Create irregularly-shaped objects with random initial velocities
// const objects = [];
// const numObjects = 20;

// for (let i = 0; i < numObjects; i++) {
//   const geometry = new THREE.TorusGeometry(
//     Math.random() * 0.3 + 1,
//     1.4,
//     13,
//     1000
//   );

  const objects = [];
const numObjects = 4;

for (let i = 0; i < numObjects; i++) {
  const geometry = new THREE.TorusGeometry(
    Math.random() * 0.3 + 1.1,     // Randomly generate the radius of the tube
    Math.random() * 3 + 1,      // Randomly generate the radius of the torus
    Math.floor(Math.random() * 10) + 5,  // Randomly generate the number of segments around the tube
    Math.floor(Math.random() * 100) + 50 // Randomly generate the number of segments around the torus
  );

  const color = new THREE.Color(
    Math.random(),
    Math.random(),
    Math.random()
  );
  const glowingMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 1.0 },
      randomColor: { value: color },
    },
    vertexShader: document.getElementById("vertexShader").textContent,
    fragmentShader: document.getElementById("fragmentShader").textContent,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    transparent: true,
  });

  const object = new THREE.Mesh(geometry, glowingMaterial);

  object.rotation.x = Math.random() * Math.PI * 2;
  object.rotation.y = Math.random() * Math.PI * 2;
  object.rotation.z = Math.random() * Math.PI * 2;

  object.position.x = Math.random() * 20 - 10;
  object.position.y = Math.random() * 20 - 10;
  object.position.z = Math.random() * 20 - 10;
  object.velocity = new THREE.Vector3(
    Math.random() * 0.005 - 0.025,
    Math.random() * 0.005 - 0.025,
    Math.random() * 0.005 - 0.025
  );
  scene.add(object);
  objects.push(object);
}

// Set up the click event listener
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
function onClick(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(objects);
  if (intersects.length > 0) {
    const object = intersects[0].object;
    scene.remove(object);
  }
}
window.addEventListener("click", onClick);



// Set up the click/touch event listener
// function onClick(event) {
//   event.preventDefault();
//   let x, y;

//   // Check if the event is a touch event
//   if (event.changedTouches) {
//     x = (event.changedTouches[0].pageX / window.innerWidth) * 2 - 1;
//     y = -(event.changedTouches[0].pageY / window.innerHeight) * 2 + 1;
//   } else {
//     x = (event.clientX / window.innerWidth) * 2 - 1;
//     y = -(event.clientY / window.innerHeight) * 2 + 1;
//   }

//   raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
//   const intersects = raycaster.intersectObjects(objects);
//   if (intersects.length > 0) {
//     const object = intersects[0].object;
//     scene.remove(object);
//   }
// }
// window.addEventListener("mousedown", onClick);
// window.addEventListener("touchstart", onClick, { passive: false });


// Set up the render loop
function animate() {
  requestAnimationFrame(animate);
  for (let i = 0; i < objects.length; i++) {
    const object = objects[i];
    glowingMaterial.uniforms.time.value += 0.1;

    // object.material = glowingMaterial;
    object.rotation.x += 0.008;
    object.rotation.y += 0.008;

    // Update object position based on velocity
    object.position.add(object.velocity);

    // Bounce object off walls
    if (object.position.x > 20 || object.position.x < -20) {

      object.velocity.x *= -001;
    }
    if (object.position.y > 20 || object.position.y < -20) {
      object.velocity.y *= -001;
    }
    if (object.position.z > 20 || object.position.z < -20) {
      object.velocity.z *= -001;
    }
  }

  renderer.render(scene, camera);
}
animate();

// get the canvas element
const canvas = document.getElementById('myCanvas');

// add an event listener for the 'resize' event
window.addEventListener('resize', () => {
  // get the new dimensions of the screen
  const width = window.innerWidth;
  const height = window.innerHeight;

  // set the dimensions of the canvas to match the new screen dimensions
  canvas.width = width;
  canvas.height = height;

  // reload the canvas
  location.reload();
});