import * as three from "three";
import "./style.css";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";

// creating our scene
const scene = new three.Scene();

// creating our sphere
const geometry = new three.SphereGeometry(3, 64, 64);
const material = new three.MeshStandardMaterial({
  color: "#00ff83",
  // roughness: 0.9,
});

const mesh = new three.Mesh(geometry, material);

// adding our object into our scene
scene.add(mesh);

// sizes - setting the size of our scene
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// creating our light source
const light = new three.PointLight(0xffffff, 1, 100);
light.intensity = 1.25;
light.position.set(0, 10, 10);
scene.add(light);

// creating our camera for our scene
const camera = new three.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 20;

// adding our camera into the scene
scene.add(camera);

// render everything we've made into the scene - our canvas HTML element
const canvas = document.querySelector(".webgl");
const renderer = new three.WebGLRenderer({ canvas });

// setting the size of our scene
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(2);
renderer.render(scene, camera);

// controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 5;

// Update the size of the element on resizing the browser window
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
});

const loop = () => {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
};
loop();

// adding gsap animation to the elements
const tl = gsap.timeline({ defaults: { duration: 1 } });
tl.fromTo(mesh.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 });
tl.fromTo("h3", { y: "-100%" }, { y: "0%" });

// changing sphere color
let mouseDown = false;
let rgb = [];
window.addEventListener("mousedown", () => {
  mouseDown = true;
});
window.addEventListener("mouseup", () => {
  mouseDown = false;
});

window.addEventListener("mousemove", (e) => {
  if (mouseDown) {
    rgb = [
      Math.round((e.pageX / sizes.width) * 255),
      Math.round((e.pageY / sizes.height) * 255),
      150,
    ];

    let newColor = new three.Color(`rgb(${rgb.join(",")})`);
    gsap.to(mesh.material.color, {
      r: newColor.r,
      g: newColor.g,
      b: newColor.b,
    });
  }
});
