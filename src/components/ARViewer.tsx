import * as THREE from "three";
import "@react-three/fiber";
import { ARCanvas, ARMarker } from "@artcom/react-three-arjs";

export default function ARViewer() {
  return (
    <ARCanvas
      camera={{ position: [0, 0, 0] }}
      onCreated={({ gl }: { gl: THREE.WebGLRenderer }) => {
        gl.setSize(window.innerWidth, window.innerHeight);
      }}
    >
      <ambientLight />
      <pointLight position={[10, 10, 10]} />

      <ARMarker
        type="pattern"
        patternUrl="https://rawcdn.githack.com/AR-js-org/AR.js/master/three.js/data/patt.hiro"
      >
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshNormalMaterial />
        </mesh>
      </ARMarker>
    </ARCanvas>
  );
}
