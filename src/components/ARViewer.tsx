import { useEffect, useRef } from "react";
import * as THREE from "three";
import { ARButton } from "three/examples/jsm/Addons.js";

export default function ARViewer() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let renderer: THREE.WebGLRenderer;
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;

    const init = () => {
      if (!containerRef.current) return;

      // Renderer
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.xr.enabled = true;
      renderer.xr.setReferenceSpaceType("local");
      containerRef.current.appendChild(renderer.domElement);

      // Scene
      scene = new THREE.Scene();

      // Camera
      camera = new THREE.PerspectiveCamera();

      // Light
      const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
      light.position.set(0.5, 1, 0.25);
      scene.add(light);

      // Cube
      const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
      const material = new THREE.MeshNormalMaterial();
      const cube = new THREE.Mesh(geometry, material);
      cube.position.set(0, 0, -0.5); // 50cm trước camera
      scene.add(cube);

      // AR Button
      const arButton = ARButton.createButton(renderer, {
        requiredFeatures: ["hit-test"],
      });
      document.body.appendChild(arButton);

      // Animation loop
      renderer.setAnimationLoop(() => {
        cube.rotation.y += 0.01;
        renderer.render(scene, camera);
      });

      // Resize
      window.addEventListener("resize", onWindowResize);
    };

    const onWindowResize = () => {
      if (renderer && camera) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }
    };

    init();

    return () => {
      if (renderer) {
        renderer.setAnimationLoop(null);
        if (renderer.domElement && containerRef.current) {
          containerRef.current.removeChild(renderer.domElement);
        }
      }
      const arButton = document.getElementById("ARButton");
      if (arButton) document.body.removeChild(arButton);

      window.removeEventListener("resize", onWindowResize);
    };
  }, []);

  return <div ref={containerRef} style={{ width: "100vw", height: "100vh" }} />;
}
