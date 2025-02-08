/**
  * Class clsComboBox
  */

include("cbase.js");
include("cpanel.js");

/*
  * Class clsComboBox
  */
// Instance class constructor:
function clsComboBox(aProperties) {
  // Call the base constructor:
  cPanel.call(this, aProperties);

  this.items = aProperties ? (aProperties.items ? aProperties.items : []) : [];
  var lDefaultIndex = this.items.length > 0 ? 0 : -1;
  this.selectedIndex = aProperties ? (aProperties.selectedIndex ? aProperties.selectedIndex : lDefaultIndex) : lDefaultIndex;
  
}
// Class inheritance setup:
clsComboBox.deriveFrom(cPanel);
// Static class constructor:
(function() {
  
  clsComboBox.prototype.items = [];
  clsComboBox.prototype.selectedIndex = -1;
  
})();
