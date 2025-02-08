include("cbase.js");
/**
  * Class cFloor
  */
// Instance class constructor:
function cFloor(aScene, aMap, aWidthXMM, widthZMM, aTileWidthMM) {
  cBase.call(this);
  // Public instances (override public static defaults)

  var floorThicknessMM = 300;
  var tileWidthMM =  aTileWidthMM || 500;

  var group = new THREE.Object3D();
  var map = aMap;
  var material;
  if (map) {
    map.wrapS = THREE.RepeatWrapping;
    map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(aWidthXMM / tileWidthMM, widthZMM / tileWidthMM);
    material = new THREE.MeshPhongMaterial({map: map, shininess	: 10});
  } else {
    material = new THREE.MeshPhongMaterial({color: 0x666666, shininess	: 10});
  }
  var floor = new THREE.Mesh(new THREE.CubeGeometry(aWidthXMM, widthZMM, floorThicknessMM), material);
  floor.receiveShadow = true;
  floor.flipSided = false;
  floor.position.set(0, -(floorThicknessMM / 2), 0);
  floor.rotation.x = -Math.PI / 2;
  group.add(floor);

  this.mesh = group;

  if (aScene) {
    aScene.add(this.mesh);
  }
}
// Class inheritance setup:
cFloor.deriveFrom(cBase);
// Static class constructor:
(function() {
  // Public static defaults:
  cFloor.prototype.mesh = null;
})();
