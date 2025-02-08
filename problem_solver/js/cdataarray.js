// Copyright 2012 Tim Samshuijzen.

include("ccommon.js");
include("cbase.js");
include("cdataitem.js");

/**
  * Class cDataArray
  */
// Instance class constructor:
function cDataArray(aProperties) {
  // Call the base constructor:
  cBase.call(this);
  
  this.items = [];
}
// Class inheritance setup:
cDataArray.deriveFrom(cBase);
// Static class constructor:
(function() {
  // Public static virtual members (properties):
  cDataArray.prototype.items = [];
})();
