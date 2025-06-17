import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ARViewer() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Tạo scene, camera, renderer
    const scene = new THREE.Scene();
    const camera = new THREE.Camera();
    scene.add(camera);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Khởi tạo AR.js Source
    const arSource = new (window as any).THREEx.ArToolkitSource({
      sourceType: "webcam",
    });

    arSource.init(() => {
      setTimeout(() => {
        arSource.onResize();
        arSource.copySizeTo(renderer.domElement);
      }, 2000);
    });

    // Khởi tạo AR.js Context
    const arContext = new (window as any).THREEx.ArToolkitContext({
      cameraParametersUrl:
        "https://cdn.rawgit.com/AR-js-org/AR.js/master/data/camera_para.dat",
      detectionMode: "mono",
    });

    arContext.init(() => {
      camera.projectionMatrix.copy(arContext.getProjectionMatrix());
    });

    new (window as any).THREEx.ArMarkerControls(arContext, camera, {
      type: "pattern",
      patternUrl:
        "https://rawcdn.githack.com/AR-js-org/AR.js/master/three.js/data/patt.hiro",
      changeMatrixMode: "cameraTransformMatrix",
    });

    // Thêm cube để test
    const cube = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshNormalMaterial()
    );
    scene.add(cube);

    // Render loop
    const render = () => {
      if (arSource.ready) arContext.update(arSource.domElement);
      renderer.render(scene, camera);
      requestAnimationFrame(render);
    };
    render();

    // Cleanup
    return () => {
      renderer.dispose();
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, []);

  return <div ref={containerRef} style={{ width: "100vw", height: "100vh" }} />;
}
