// Copyright 2012 Tim Samshuijzen.

include("ccommon.js");
include("cbase.js");
include("cfuture.js");

/**
  * Class cMultiverseColumn
  */
// Instance class constructor:
function cMultiverseColumn(aProperties) {
  // Call the base constructor:
  cBase.call(this);
  
  this.futures = [];
  this.columnNumber = aProperties ? ((typeof aProperties.columnNumber != 'undefined') ? aProperties.columnNumber : 0) : 0;
}
// Class inheritance setup:
cMultiverseColumn.deriveFrom(cBase);
// Static class constructor:
(function() {

  cMultiverseColumn.prototype.futures = [];
  cMultiverseColumn.prototype.columnNumber = 0; // can be negative
  
})();
  
