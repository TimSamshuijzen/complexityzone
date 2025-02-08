// Copyright 2012 Tim Samshuijzen.

include("ccommon.js");

/**
  * Class cBase
  */
// Instance class constructor:
function cBase() {
  cDebug.log('debug', 'Created instance of cBase.');
}
// Class inheritance setup:
cBase.deriveFrom(Object);
// Static class constructor:
(function() {})();
  
