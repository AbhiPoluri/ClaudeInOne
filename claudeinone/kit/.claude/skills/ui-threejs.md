# Three.js

## Overview
Three.js renders 3D scenes in the browser using WebGL — for product visualizations, games, and immersive UIs.

## Setup

```bash
npm install three @types/three
```

## Basic Scene Setup

```typescript
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf0f0f0);

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 5);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Geometry + Material + Mesh
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: 0x00aaff });
const cube = new THREE.Mesh(geometry, material);
cube.castShadow = true;
scene.add(cube);

// Lighting
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 5);
light.castShadow = true;
scene.add(light);
scene.add(new THREE.AmbientLight(0xffffff, 0.4));

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  cube.rotation.y += 0.01;
  controls.update();
  renderer.render(scene, camera);
}
animate();

// Resize handler
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
```

## React with React Three Fiber

```bash
npm install @react-three/fiber @react-three/drei
```

```tsx
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box, Environment } from '@react-three/drei';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

function RotatingBox() {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame(() => { if (meshRef.current) meshRef.current.rotation.y += 0.01; });
  return (
    <Box ref={meshRef} args={[1, 1, 1]}>
      <meshStandardMaterial color="#00aaff" />
    </Box>
  );
}

export function ThreeScene() {
  return (
    <Canvas camera={{ position: [0, 2, 5] }} shadows>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 10, 5]} castShadow />
      <RotatingBox />
      <OrbitControls enableDamping />
      <Environment preset="city" />
    </Canvas>
  );
}
```

## Best Practices
- Always dispose of geometries, materials, and textures on cleanup: `geometry.dispose()`
- Use `GLTFLoader` for 3D models: `new GLTFLoader().load('/model.glb', ...)`
- Keep polygon count low for web performance
- Use React Three Fiber for React projects — much cleaner than imperative Three.js

## Resources
- [Three.js docs](https://threejs.org/docs/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
