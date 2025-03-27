include("ccommon.js");
include("cbase.js");
include("cdataarray.js");
include("cdataitem.js");

/**
  * Class cAgent
  */
// Instance class constructor:
function cAgent(aProperties) {
  // Call the base constructor:
  cBase.call(this);
  
  //this.evaluations = new cDataArray();
  //this.actions = new cDataArray();
}
// Class inheritance setup:
cAgent.deriveFrom(cBase);
// Static class constructor:
(function() {

  //cAgent.prototype.evaluations = null;
  //cAgent.prototype.actions = null;
  cAgent.prototype.evaluations = '';
  cAgent.prototype.actions = '';
  
})();

  
