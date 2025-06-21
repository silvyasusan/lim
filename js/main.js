import('./ammo.js').then((AmmoModule) => {
  AmmoModule.default().then((AmmoLib) => {
    const Ammo = AmmoLib;
    const physicsWorld = new Ammo.btDiscreteDynamicsWorld();
    physicsWorld.setGravity(new Ammo.btVector3(0, -9.8, 0));

    // Rest of your animation code here
    const animate = () => {
      requestAnimationFrame(animate);

      // Update physics (to be implemented)
      physicsWorld.stepSimulation(1 / 60, 10);

      // Placeholder for orb position (add Ammo.js rigid body logic)
      orb.position.set(0, 0, 0); // Replace with actual physics position

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
  }).catch(error => console.error('Ammo.js initialization failed:', error));
}).catch(error => console.error('Ammo.js module load failed:', error));
