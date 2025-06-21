import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.module.js';

     const scene = new THREE.Scene();
     const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
     const renderer = new THREE.WebGLRenderer();
     renderer.setSize(window.innerWidth, window.innerHeight);
     document.body.appendChild(renderer.domElement);

     camera.position.z = 10; // Original distance for better view

     const orbGeometry = new THREE.SphereGeometry(0.5, 32, 32); // Ensure radius is 0.5
     const orbMaterial = new THREE.MeshStandardMaterial({
       color: 0xffffff,
       emissive: 0x00ffcc,
       emissiveIntensity: 2,
     });
     const orb = new THREE.Mesh(orbGeometry, orbMaterial);
     scene.add(orb);

     const pointLight = new THREE.PointLight(0x00ffcc, 1, 5);
     pointLight.position.set(0, 0, 0);
     orb.add(pointLight);

     const ambientLight = new THREE.AmbientLight(0x000000, 0);
     scene.add(ambientLight);

     const roomGeometry = new THREE.BoxGeometry(20, 20, 20);
     const roomMaterial = new THREE.MeshStandardMaterial({ color: 0x111111, side: THREE.BackSide });
     const room = new THREE.Mesh(roomGeometry, roomMaterial);
     scene.add(room);

     const pictureGeometry = new THREE.PlaneGeometry(5, 5);
     const pictureTexture = new THREE.TextureLoader().load('assets/picture.jpg');
     const pictureMaterial = new THREE.MeshStandardMaterial({ map: pictureTexture });
     const picture = new THREE.Mesh(pictureGeometry, pictureMaterial);
     picture.position.set(0, 0, -9.9);
     picture.visible = false;
     scene.add(picture);

     const switchButton = document.getElementById('switch');
     switchButton.addEventListener('click', () => {
       roomLit = true;
       picture.visible = true;
       createParticles();
     });

     let roomLit = false;
     let particles = [];

     function createParticles() {
       const particleGeometry = new THREE.BufferGeometry();
       const particleCount = 100;
       const positions = new Float32Array(particleCount * 3);
       const velocities = new Float32Array(particleCount * 3);

       for (let i = 0; i < particleCount; i++) {
         positions[i * 3] = (Math.random() - 0.5) * 10;
         positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
         positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
         velocities[i * 3] = (Math.random() - 0.5) * 0.02;
         velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
         velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
       }

       particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
       const particleMaterial = new THREE.PointsMaterial({ color: 0xffff99, size: 0.1 });
       const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
       scene.add(particleSystem);
       particles.push({ system: particleSystem, velocities });
     }

     const mouse = new THREE.Vector2();
     window.addEventListener('mousemove', (event) => {
       mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
       mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
     });

     // Fallback with manual movement
     const keys = {};
     window.addEventListener('keydown', (event) => { keys[event.key] = true; });
     window.addEventListener('keyup', (event) => { keys[event.key] = false; });

     const animate = () => {
       requestAnimationFrame(animate);

       // Manual movement with arrow keys
       const speed = 0.1;
       if (keys['ArrowUp']) orb.position.z -= speed;
       if (keys['ArrowDown']) orb.position.z += speed;
       if (keys['ArrowLeft']) orb.position.x -= speed;
       if (keys['ArrowRight']) orb.position.x += speed;

       const switchPos = new THREE.Vector3(0, 0, -5);
       const distance = orb.position.distanceTo(switchPos);
       switchButton.style.display = distance < 2 ? 'block' : 'none';

       if (roomLit) {
         ambientLight.intensity = Math.min(ambientLight.intensity + 0.01, 0.5);
       }

       particles.forEach((p) => {
         const positions = p.system.geometry.attributes.position.array;
         for (let i = 0; i < positions.length; i += 3) {
           positions[i] += p.velocities[i];
           positions[i + 1] += p.velocities[i + 1];
           positions[i + 2] += p.velocities[i + 2];

           const dx = mouse.x * 5 - positions[i];
           const dy = mouse.y * 5 - positions[i + 1];
           const dist = Math.sqrt(dx * dx + dy * dy);
           if (dist < 1) {
             p.velocities[i] += dx * 0.01;
             p.velocities[i + 1] += dy * 0.01;
           }

           if (Math.abs(positions[i]) > 10) p.velocities[i] *= -0.9;
           if (Math.abs(positions[i + 1]) > 10) p.velocities[i + 1] *= -0.9;
           if (Math.abs(positions[i + 2]) > 10) p.velocities[i + 2] *= -0.9;
         }
         p.system.geometry.attributes.position.needsUpdate = true;
       });

       renderer.render(scene, camera);
     };
     animate();
