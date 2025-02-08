include("cbase.js");
/**
  * Class cCube
  */
// Instance class constructor:
function cCube(aScene, aWidthXMM, aHeightYMM, aDepthZMM, aX, aY, aZ, aRotateX, aRotateY, aRotateZ, aColor, aTransparent) {
  cBase.call(this);
  // Public instances (override public static defaults)

  var group = new THREE.Object3D();
  var material;
  if (aTransparent) {
    material = new THREE.MeshPhongMaterial({color: aColor, shininess	: 10, transparent: true, opacity: 1.0});
  } else {
    material = new THREE.MeshPhongMaterial({color: aColor, shininess	: 10});
  }
  var cube = new THREE.Mesh(new THREE.CubeGeometry(aWidthXMM, aHeightYMM, aDepthZMM), material);
  cube.castShadow = true;
  cube.receiveShadow = false;
  //cube.position.set((aWidthXMM / 2), (aHeightYMM / 2), (aDepthZMM / 2));
  group.add(cube);
  group.position.set(aX, aY, aZ);
  group.rotation.x = aRotateX;
  group.rotation.y = aRotateY;
  group.rotation.z = aRotateZ;
  this.mesh = group;

  if (aScene) {
    aScene.add(this.mesh);
  }
}
// Class inheritance setup:
cCube.deriveFrom(cBase);
// Static class constructor:
(function() {
  // Public static defaults:
  cCube.prototype.mesh = null;
})();
