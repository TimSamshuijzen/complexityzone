
function buildAxis(src, dst, colorHex, dashed) {
  var geom = new THREE.Geometry(),
      mat; 
  if (dashed) {
    mat = new THREE.LineDashedMaterial({linewidth: 10, color: colorHex, dashSize: 100, gapSize: 100});
  } else {
    mat = new THREE.LineBasicMaterial({linewidth: 10, color: colorHex});
  }
  geom.vertices.push(src.clone());
  geom.vertices.push(dst.clone());
  geom.computeLineDistances();

  var axis = new THREE.Line(geom, mat, THREE.LinePieces );
  return axis;
}

function createAxes() {
  var length = 1000;
  var axes = new THREE.Object3D();
  //axes.add(buildAxis(new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( length, 0, 0 ), 0xff0000, false )); // +X
  axes.add(buildAxis(new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( length, 0, 0 ), 0x00ff00, false )); // +X
  //axes.add(buildAxis(new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, 0 ), 0xff0000, true)); // -X
  axes.add(buildAxis(new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, length, 0 ), 0x6666ff, false )); // +Y
  //axes.add(buildAxis(new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, 0 ), 0x00ff00, true )); // -Y
  axes.add(buildAxis(new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, length ), 0xff0000, false )); // +Z
  //axes.add(buildAxis(new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, 0 ), 0x0000ff, true )); // -Z
  axes.position.y = 1; // 1 mm above floor
  return axes;
}
