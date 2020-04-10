<template>
  <div class="card" ref="root"></div>
</template>

<script>
import * as THREE from "three";

export default {
  name: "Render",
  mounted() {
    let root = this.$refs["root"];
    let size = { x: root.offsetWidth, y: root.offsetHeight };

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, size.x / size.y, 0.1, 1000);
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(size.x, size.y);
    root.appendChild(renderer.domElement);

    var geometry = new THREE.BoxGeometry();
    var material = new THREE.MeshBasicMaterial({ color: 0x2e3440 });
    var cube = new THREE.Mesh(geometry, material);
    cube.scale.x = cube.scale.y = cube.scale.z = 5;
    scene.add(cube);
    scene.background = new THREE.Color(0xffffff);

    camera.position.z = 10;

    function animate() {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    }
    animate();
  }
};
</script>

<style scoped>
.card {
  padding: 0;
}
</style>
