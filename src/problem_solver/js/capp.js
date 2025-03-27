include("ccommon.js");
include("cbase.js");
include("cscreen.js");

/**
  * Class cApp
  */
// Instance class constructor:
function cApp(aContainer) {
  // Call the base constructor:
  cBase.call(this);
}
// Class inheritance setup:
cApp.deriveFrom(cBase);
// Static class constructor:
(function() {
  // Public static virtual members (properties):
  cApp.prototype.screen = null;
  cApp.prototype.onPreResize = null;
  cApp.prototype.onResize = null;
  cApp.prototype.onPostResize = null;
  cApp.prototype.onMouseDown = null;
  cApp.prototype.onMouseMove = null;
  cApp.prototype.onMouseUp = null;
})();
