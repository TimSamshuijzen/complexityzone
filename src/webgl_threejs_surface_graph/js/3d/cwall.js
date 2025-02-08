include("cbase.js");
/**
  * Class cWall
  */
// Instance class constructor:
function cWall(aScene, aMap, aWidthXMM, aHeightYMM, aThicknessMM, aX, aZ, aRotateY, aTileWidthMM) {
  cBase.call(this);
  // Public instances (override public static defaults)

  var wallThicknessMM = aThicknessMM || 200;
  var tileWidthMM = aTileWidthMM || 500;

  var group = new THREE.Object3D();
  var map = aMap;
  var material;
  if (map) {
    map.wrapS = THREE.RepeatWrapping;
    map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(aWidthXMM / tileWidthMM, aHeightYMM / tileWidthMM);
    material = new THREE.MeshPhongMaterial({map: map, shininess	: 10});
  } else {
    material = new THREE.MeshPhongMaterial({color: 0x666666, shininess	: 10});
  }
  var floor = new THREE.Mesh(new THREE.CubeGeometry(aWidthXMM, aHeightYMM, wallThicknessMM), material);
  floor.receiveShadow = true;
  floor.flipSided = false;
  floor.position.set(0, (aHeightYMM / 2), -wallThicknessMM / 2);
  group.add(floor);
  group.position.set(aX, 0, aZ);
  group.rotation.y = aRotateY;
  this.mesh = group;

  if (aScene) {
    aScene.add(this.mesh);
  }
}
// Class inheritance setup:
cWall.deriveFrom(cBase);
// Static class constructor:
(function() {
  // Public static defaults:
  cWall.prototype.mesh = null;
})();
