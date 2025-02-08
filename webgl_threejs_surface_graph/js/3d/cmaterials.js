include("cbase.js");
/**
  * Class cMaterials
  */
// Instance class constructor:
function cMaterials() {
  cBase.call(this);
  // Public instances (override public static defaults)
  this.normalMaterial = new THREE.MeshNormalMaterial({vertexColors: THREE.FaceColors});
  if (cMaterials.normalMaterial == null) {
    cMaterials.normalMaterial = this.normalMaterial;
  }
  this.materials = [];
  
  var lMetalColor = 0xaaaaaa;
  var lMetalShininess = 100;
  var lMetalReflectivity = 100;
  var materialMetal = new THREE.MeshPhongMaterial({
    color: lMetalColor, 
    ambient: lMetalColor, // should generally match color
    specular: 0x333333,
    shininess: lMetalShininess,
    reflectivity: lMetalReflectivity,
    vertexColors: THREE.FaceColors
  });
  var materialBlueRubber = new THREE.MeshPhongMaterial({
    ambient		: 0x444444,
    color		: 0x004182, // 0x44AA44
    shininess	: 30, 
    specular	: 0x004182, // 0x33AA33,
    shading		: THREE.SmoothShading,
    vertexColors: THREE.FaceColors
  });
  var materialRollConveyorBelt = new THREE.MeshPhongMaterial({
    color		: 0xffffff,
    vertexColors: THREE.FaceColors
  });
  var materialDarkGreyMetal = new THREE.MeshPhongMaterial({
    color		: 0x333333,
    vertexColors: THREE.FaceColors
  });
  var materialWhitePlastic = new THREE.MeshPhongMaterial({
    color		: 0xffffff,
    vertexColors: THREE.FaceColors
  });
  var materialRedPlastic = new THREE.MeshPhongMaterial({
    color		: 0xff0000,
    vertexColors: THREE.FaceColors
  });
  var materialYellowPlastic = new THREE.MeshPhongMaterial({
    color		: 0xffff00,
    vertexColors: THREE.FaceColors
  });
  var materialBluePlastic = new THREE.MeshPhongMaterial({
    color		: 0x0000ff,
    vertexColors: THREE.FaceColors
  });

  this.materials.push(materialMetal);
  this.materials.push(materialBlueRubber);
  this.materials.push(materialRollConveyorBelt);
  this.materials.push(materialDarkGreyMetal);
  this.materials.push(materialWhitePlastic);
  this.materials.push(materialRedPlastic);
  this.materials.push(materialYellowPlastic);
  this.materials.push(materialBluePlastic);
}
// Class inheritance setup:
cMaterials.deriveFrom(cBase);
// Static class constructor:
(function() {
  // Public static constants:
  cMaterials.cMaterialMetal = 0;
  cMaterials.cMaterialBlueRubber = 1;
  cMaterials.cMaterialRollConveyorBelt = 2;
  cMaterials.cMaterialDarkGreyMetal = 3;
  cMaterials.cMaterialWhitePlastic = 4;
  cMaterials.cMaterialRedPlastic = 5;
  cMaterials.cMaterialYellowPlastic = 6;
  cMaterials.cMaterialBluePlastic = 7;
  // Public static:
  cMaterials.normalMaterial = null;

  // Public static defaults:
  cMaterials.prototype.normalMaterial = null;
  cMaterials.prototype.materials = [];
})();
