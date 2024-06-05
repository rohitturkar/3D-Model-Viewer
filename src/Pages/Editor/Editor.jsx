import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import WebGL from "three/addons/capabilities/WebGL.js";

const Editor = ({modelLink}) => {
  const mountRef = useRef(null);

  console.log(modelLink)

  useEffect(() => {
    if (WebGL.isWebGLAvailable()) {
      // Initialize the Scene, camera, and renderer, to actually display anything using three.js
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        75, // FOV, field of view
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );

      const renderer = new THREE.WebGLRenderer();
      renderer.setClearColor(0x44444, 1);
      renderer.setSize(window.innerWidth, window.innerHeight);
      mountRef.current.appendChild(renderer.domElement);

      // Add basic lighting to the scene
      const ambientLight = new THREE.AmbientLight(0xffffff); // Soft white light
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(5, 5, 5).normalize();
      scene.add(directionalLight);

      // Load the GLTF model
      const loader = new GLTFLoader();
      let model;

      // Load the model using a promise
      const loadModel = async () => {
        try {
          const gltf = await new Promise((resolve, reject) => {
            loader.load(
              modelLink,
              resolve,
              undefined,
              reject
            );
          });
          model = gltf.scene;
          model.scale.set(5, 5, 5); // Make the model larger
          scene.add(model);
        } catch (error) {
          console.error("An error occurred while loading the model", error);
        }
      };

      loadModel();

      camera.position.z = 5;

      // Initialize OrbitControls
      const controls = new OrbitControls(camera, renderer.domElement);

      // Animation loop
      const animate = () => {
        
        if (model) {
            model.rotation.y += 0.05; // Rotate the model around the Y-axis
          }
  
        controls.update();
        renderer.render(scene, camera);
      };
      renderer.setAnimationLoop(animate);

      // Cleanup function
      return () => {
        renderer.setAnimationLoop(null);
        mountRef?.current?.removeChild(renderer?.domElement);
      };
    } else {
      const warning = WebGL.getWebGLErrorMessage();
      mountRef.current.appendChild(warning);
    }
  }, []);

  return <div ref={mountRef} className='max-w-full'></div>;
};

export default Editor;
