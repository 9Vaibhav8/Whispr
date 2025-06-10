import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import AuthForm from '../components/AuthForm';

const AuthPage = () => {
  const [isLoginPage, setIsLoginPage] = useState(true);
  const mountRef = useRef(null);
  const sceneRef = useRef(null);

  const toggleAuthMode = () => {
    setIsLoginPage(prev => !prev);
  };

  useEffect(() => {
    // Initialize Three.js scene
    if (!mountRef.current) return;
    
    // Set up scene, camera, and renderer
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);
    
    // Create materials - using vintage/sepia tones for memory theme
    const pageMaterial = new THREE.MeshStandardMaterial({
      color: 0xf8f0e3, // Vintage paper color
      roughness: 0.4,
      metalness: 0.1,
    });
    
    const penMaterial = new THREE.MeshStandardMaterial({
      color: 0x8b4513, // Wooden pen color
      roughness: 0.6,
      metalness: 0.2,
    });

    const inkMaterial = new THREE.MeshStandardMaterial({
      color: 0x352315, // Dark sepia ink
      roughness: 0.1,
      metalness: 0.3,
      transparent: true,
      opacity: 0.7,
    });

    const bookmarkMaterial = new THREE.MeshStandardMaterial({
      color: 0xd4a76a, // Vintage bookmark color
      roughness: 0.4,
      metalness: 0.1,
    });
    
    // Add floating diary pages
    const addDiaryPage = (x, y, z, rotX, rotY) => {
      const pageGeometry = new THREE.PlaneGeometry(1.5, 2);
      const page = new THREE.Mesh(pageGeometry, pageMaterial);
      page.position.set(x, y, z);
      page.rotation.x = rotX;
      page.rotation.y = rotY;
      scene.add(page);
      
      // Add lines to the page
      const lineMaterial = new THREE.LineBasicMaterial({ color: 0xb8a88a }); // Faded lines
      for (let i = -0.8; i < 0.8; i += 0.2) {
        const lineGeometry = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(-0.7, i, 0.01),
          new THREE.Vector3(0.7, i, 0.01)
        ]);
        const line = new THREE.Line(lineGeometry, lineMaterial);
        page.add(line);
      }
      
      return page;
    };
    
    // Add pen
    const addPen = () => {
      const penGroup = new THREE.Group();
      
      // Pen body
      const bodyGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1.2, 16);
      const body = new THREE.Mesh(bodyGeometry, penMaterial);
      penGroup.add(body);
      
      // Pen tip
      const tipGeometry = new THREE.ConeGeometry(0.05, 0.2, 16);
      const tipMaterial = new THREE.MeshStandardMaterial({ color: 0xc0c0c0 });
      const tip = new THREE.Mesh(tipGeometry, tipMaterial);
      tip.position.y = -0.7;
      tip.rotation.x = Math.PI;
      penGroup.add(tip);
      
      penGroup.position.set(-1.5, -0.5, 2);
      penGroup.rotation.z = Math.PI / 4;
      scene.add(penGroup);
      
      return penGroup;
    };

    // Add ink drops
    const addInkDrops = () => {
      const dropsGroup = new THREE.Group();
      
      for (let i = 0; i < 5; i++) {
        const size = 0.05 + Math.random() * 0.1;
        const dropGeometry = new THREE.SphereGeometry(size, 8, 8);
        const drop = new THREE.Mesh(dropGeometry, inkMaterial);
        
        // Random positions around center
        drop.position.set(
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 1
        );
        
        dropsGroup.add(drop);
      }
      
      scene.add(dropsGroup);
      return dropsGroup;
    };

    // Add bookmark
    const addBookmark = () => {
      const bookmarkGroup = new THREE.Group();
      
      // Create bookmark shape
      const shape = new THREE.Shape();
      shape.moveTo(0, 0);
      shape.lineTo(0.4, 0);
      shape.lineTo(0.4, 0.8);
      shape.lineTo(0.2, 0.6);
      shape.lineTo(0, 0.8);
      shape.lineTo(0, 0);
      
      const extrudeSettings = {
        depth: 0.03,
        bevelEnabled: true,
        bevelThickness: 0.01,
        bevelSize: 0.01,
        bevelSegments: 1
      };
      
      const bookmarkGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
      const bookmark = new THREE.Mesh(bookmarkGeometry, bookmarkMaterial);
      bookmarkGroup.add(bookmark);
      
      bookmarkGroup.position.set(1.8, 0.8, 1);
      bookmarkGroup.rotation.y = -0.3;
      scene.add(bookmarkGroup);
      
      return bookmarkGroup;
    };

    // Add polaroid photo frame
    const addPolaroid = () => {
      const polaroidGroup = new THREE.Group();
      
      // Frame
      const frameGeometry = new THREE.BoxGeometry(1.2, 1.4, 0.05);
      const frameMaterial = new THREE.MeshStandardMaterial({ color: 0xfefefe });
      const frame = new THREE.Mesh(frameGeometry, frameMaterial);
      polaroidGroup.add(frame);
      
      // Photo area
      const photoGeometry = new THREE.PlaneGeometry(1, 1);
      const photoMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xe0cbaa, // Sepia photo
        roughness: 0.3
      });
      const photo = new THREE.Mesh(photoGeometry, photoMaterial);
      photo.position.z = 0.026;
      photo.position.y = 0.1;
      polaroidGroup.add(photo);
      
      polaroidGroup.position.set(1, -1.2, 0.5);
      polaroidGroup.rotation.x = 0.1;
      polaroidGroup.rotation.y = -0.2;
      scene.add(polaroidGroup);
      
      return polaroidGroup;
    };
    
    // Create objects
    const page1 = addDiaryPage(-2, 0.5, -1, 0.2, 0.5);
    const page2 = addDiaryPage(2, -0.8, -2, -0.3, -0.5);
    const page3 = addDiaryPage(0.5, 1.2, -1.5, 0.1, -0.2);
    const pen = addPen();
    const inkDrops = addInkDrops();
    const bookmark = addBookmark();
    const polaroid = addPolaroid();
    
    // Create more elements to fill the screen
    const extraPages = [];
    const extraInkDrops = [];
    
    // Add more pages scattered throughout the scene
    for (let i = 0; i < 5; i++) {
      const x = (Math.random() - 0.5) * 10;
      const y = (Math.random() - 0.5) * 8;
      const z = (Math.random() - 0.5) * 5 - 2;
      const rotX = Math.random() * Math.PI * 0.4 - Math.PI * 0.2;
      const rotY = Math.random() * Math.PI * 0.4 - Math.PI * 0.2;
      
      const page = addDiaryPage(x, y, z, rotX, rotY);
      extraPages.push(page);
    }
    
    // Add more ink drops scattered throughout
    for (let i = 0; i < 3; i++) {
      const dropsGroup = new THREE.Group();
      
      for (let j = 0; j < 3; j++) {
        const size = 0.05 + Math.random() * 0.1;
        const dropGeometry = new THREE.SphereGeometry(size, 8, 8);
        const drop = new THREE.Mesh(dropGeometry, inkMaterial);
        
        drop.position.set(
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 4
        );
        
        dropsGroup.add(drop);
      }
      
      scene.add(dropsGroup);
      extraInkDrops.push(dropsGroup);
    }
    
    // Enhanced 3D path motion system for more dynamic movement
    const createComplexMotionPath = (centerX, centerY, centerZ, radiusX, radiusY, radiusZ, speedX, speedY, speedZ, startAngle = 0) => {
      return (time) => {
        const angleX = startAngle + time * speedX;
        const angleY = startAngle * 0.5 + time * speedY;
        const angleZ = startAngle * 0.7 + time * speedZ;
        
        // Create complex Lissajous-like patterns
        const x = centerX + Math.cos(angleX) * radiusX + Math.sin(angleY * 0.7) * radiusX * 0.3;
        const y = centerY + Math.sin(angleY) * radiusY + Math.cos(angleZ * 0.8) * radiusY * 0.2;
        const z = centerZ + Math.cos(angleZ) * radiusZ + Math.sin(angleX * 0.6) * radiusZ * 0.4;
        
        return { x, y, z };
      };
    };
    
    // Motion paths for each object with wider range across the screen
    const motionPaths = {
      page1: createComplexMotionPath(-3, 2, -1, 2.5, 1.8, 1.2, 0.2, 0.3, 0.18, 0),
      page2: createComplexMotionPath(3, -2, -2, 2.2, 1.5, 0.8, 0.15, 0.25, 0.22, Math.PI),
      page3: createComplexMotionPath(0, 3, -1.5, 2.0, 2.2, 1.5, 0.18, 0.32, 0.28, Math.PI / 2),
      pen: createComplexMotionPath(-2.5, -1.5, 1, 1.8, 2.0, 1.2, 0.12, 0.18, 0.14, Math.PI / 4),
      bookmark: createComplexMotionPath(2.5, 2, 0.5, 1.5, 1.7, 1.0, 0.22, 0.15, 0.3, Math.PI / 3),
      polaroid: createComplexMotionPath(1.5, -3, 0.5, 2.0, 1.5, 0.8, 0.1, 0.28, 0.2, Math.PI / 6)
    };
    
    // Add motion paths for extra elements
    extraPages.forEach((page, i) => {
      const centerX = (Math.random() - 0.5) * 8;
      const centerY = (Math.random() - 0.5) * 6;
      const centerZ = (Math.random() - 0.5) * 4 - 1;
      
      const radiusX = 1.5 + Math.random() * 1.5;
      const radiusY = 1.5 + Math.random() * 1.5;
      const radiusZ = 0.8 + Math.random() * 0.8;
      
      const speedX = 0.1 + Math.random() * 0.2;
      const speedY = 0.1 + Math.random() * 0.2;
      const speedZ = 0.1 + Math.random() * 0.15;
      
      const startAngle = Math.random() * Math.PI * 2;
      
      motionPaths[`extraPage${i}`] = createComplexMotionPath(
        centerX, centerY, centerZ, 
        radiusX, radiusY, radiusZ, 
        speedX, speedY, speedZ, 
        startAngle
      );
    });
    
    extraInkDrops.forEach((dropGroup, i) => {
      const centerX = (Math.random() - 0.5) * 10;
      const centerY = (Math.random() - 0.5) * 8;
      const centerZ = (Math.random() - 0.5) * 3;
      
      motionPaths[`extraInkGroup${i}`] = createComplexMotionPath(
        centerX, centerY, centerZ,
        3, 3, 2,
        0.3 + Math.random() * 0.2,
        0.3 + Math.random() * 0.2,
        0.2 + Math.random() * 0.2,
        Math.random() * Math.PI * 2
      );
    });
    
    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Animation loop with enhanced movement
    const animate = () => {
      const animationId = requestAnimationFrame(animate);
      const time = Date.now() * 0.001; // Current time in seconds
      
      // Apply motion paths to original objects
      const page1Pos = motionPaths.page1(time);
      page1.position.set(page1Pos.x, page1Pos.y, page1Pos.z);
      page1.rotation.x = Math.sin(time * 0.5) * 0.4 + 0.2;
      page1.rotation.y = Math.cos(time * 0.3) * 0.6 + 0.5;
      page1.rotation.z = Math.sin(time * 0.2) * 0.2;
      
      const page2Pos = motionPaths.page2(time);
      page2.position.set(page2Pos.x, page2Pos.y, page2Pos.z);
      page2.rotation.x = Math.sin(time * 0.4) * 0.5 - 0.3;
      page2.rotation.y = Math.cos(time * 0.2) * 0.7 - 0.5;
      page2.rotation.z = Math.cos(time * 0.3) * 0.3;
      
      const page3Pos = motionPaths.page3(time);
      page3.position.set(page3Pos.x, page3Pos.y, page3Pos.z);
      page3.rotation.x = Math.sin(time * 0.3) * 0.4 + 0.1;
      page3.rotation.y = Math.cos(time * 0.5) * 0.5 - 0.2;
      page3.rotation.z = Math.sin(time * 0.4) * 0.25;
      
      const penPos = motionPaths.pen(time);
      pen.position.set(penPos.x, penPos.y, penPos.z);
      pen.rotation.z = Math.PI / 4 + Math.sin(time * 0.6) * 0.4;
      pen.rotation.x = Math.sin(time * 0.4) * 0.5;
      pen.rotation.y = Math.cos(time * 0.5) * 0.3;
      
      const bookmarkPos = motionPaths.bookmark(time);
      bookmark.position.set(bookmarkPos.x, bookmarkPos.y, bookmarkPos.z);
      bookmark.rotation.y = -0.3 + Math.sin(time * 0.3) * 0.4;
      bookmark.rotation.z = Math.cos(time * 0.4) * 0.3;
      bookmark.rotation.x = Math.sin(time * 0.5) * 0.2;
      
      const polaroidPos = motionPaths.polaroid(time);
      polaroid.position.set(polaroidPos.x, polaroidPos.y, polaroidPos.z);
      polaroid.rotation.x = 0.1 + Math.sin(time * 0.2) * 0.3;
      polaroid.rotation.y = -0.2 + Math.cos(time * 0.3) * 0.4;
      polaroid.rotation.z = Math.sin(time * 0.25) * 0.15;
      
      // Animate extra pages
      extraPages.forEach((page, i) => {
        const pos = motionPaths[`extraPage${i}`](time);
        page.position.set(pos.x, pos.y, pos.z);
        
        // Random rotation effect with phase
        const phaseX = i * 0.5;
        const phaseY = i * 0.7;
        const phaseZ = i * 0.3;
        
        page.rotation.x = Math.sin(time * 0.3 + phaseX) * 0.5;
        page.rotation.y = Math.cos(time * 0.4 + phaseY) * 0.7;
        page.rotation.z = Math.sin(time * 0.2 + phaseZ) * 0.3;
      });
      
      // Animate extra ink drops
      extraInkDrops.forEach((dropGroup, i) => {
        const groupPos = motionPaths[`extraInkGroup${i}`](time);
        
        // Move the entire group
        dropGroup.position.set(groupPos.x, groupPos.y, groupPos.z);
        
        // Animate individual drops within the group
        dropGroup.children.forEach((drop, j) => {
          const localTime = time + j * 0.5;
          
          // Local motion relative to group center
          const localX = Math.cos(localTime * (0.5 + j * 0.1)) * (0.3 + j * 0.1);
          const localY = Math.sin(localTime * (0.6 + j * 0.1)) * (0.3 + j * 0.1);
          const localZ = Math.sin(localTime * (0.4 + j * 0.1)) * (0.2 + j * 0.05);
          
          drop.position.set(localX, localY, localZ);
          
          // Pulsating effect
          const pulseScale = 0.7 + Math.sin(localTime * 2) * 0.3;
          drop.scale.set(pulseScale, pulseScale, pulseScale);
        });
      });
      
      // Animate ink drops to swirl around more wildly
      inkDrops.children.forEach((drop, i) => {
        const radius = 1 + i * 0.2;
        const speed = 0.8 + i * 0.15;
        const height = 0.5 + i * 0.1;
        
        drop.position.x = Math.cos(time * speed + i) * radius;
        drop.position.y = Math.sin(time * speed + i * 1.5) * radius;
        drop.position.z = Math.sin(time * 0.7 + i) * height;
        
        // Enhanced pulsing
        const scale = 0.7 + Math.sin(time * 3 + i * 0.5) * 0.3;
        drop.scale.set(scale, scale, scale);
      });
      
      // Dynamic camera movement to enhance the floating effect
      camera.position.x = Math.sin(time * 0.2) * 1.5;
      camera.position.y = Math.cos(time * 0.15) * 1;
      camera.position.z = 5 + Math.sin(time * 0.1) * 0.5;
      camera.lookAt(0, 0, 0);
      
      renderer.render(scene, camera);
      
      return animationId;
    };
    
    const animationId = animate();
    
    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      // Dispose geometries and materials
      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
    };
  }, []);
  
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Three.js container */}
      <div 
        ref={mountRef}
        className="absolute inset-0 z-0"
      />
      
      {/* Gradient overlay - Memory-themed colors */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-600/70 to-teal-700/70 z-10"></div>
      
      {/* Auth content with subtle animation */}
      <div 
        className="w-full max-w-md p-8 bg-white/90 backdrop-blur-sm rounded-lg shadow-2xl z-20 border border-white/20"
        style={{
          animation: 'fadeIn 1s ease-out',
          transition: 'transform 0.3s ease'
        }}
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          {isLoginPage ? 'Welcome Back' : 'Join Today'}
        </h2>
        <p className="text-center text-gray-600 mb-8">
          {isLoginPage 
            ? 'Access your personal diary and continue your journey' 
            : 'Create an account to start your digital diary journey'}
        </p>
        <AuthForm isLoginPage={isLoginPage} toggleAuthMode={toggleAuthMode} />
      </div>
      
      {/* Decorative elements */}
      <div className="absolute bottom-4 right-4 text-white/70 text-sm z-20">
        My Digital Diary • Preserve your memories
      </div>
    </div>
  );
};

// Add CSS for animations
const styleSheet = document.createElement('style');
styleSheet.textContent = `
@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
`;
document.head.appendChild(styleSheet);

export default AuthPage;