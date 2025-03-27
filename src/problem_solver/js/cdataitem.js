include("ccommon.js");
include("cbase.js");

/**
  * Class cDataItem
  */
// Instance class constructor:
function cDataItem(aProperties) {
  // Call the base constructor:
  cBase.call(this);
  
  this.id = aProperties ? ((typeof aProperties.id != 'undefined') ? aProperties.id : 0) : 0;
  this.name = aProperties ? ((typeof aProperties.name != 'undefined') ? aProperties.name : '') : '';
  this.content = aProperties ? ((typeof aProperties.content != 'undefined') ? aProperties.content : '') : '';
}
// Class inheritance setup:
cDataItem.deriveFrom(cBase);
// Static class constructor:
(function() {
  // Public static virtual members (properties):
  cDataItem.prototype.id = 0;
  cDataItem.prototype.name = '';
  cDataItem.prototype.content = '';
})();
