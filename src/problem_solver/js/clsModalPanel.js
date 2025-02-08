/**
  * Class clsModalPanel
  */

include("cbase.js");
include("cpanel.js");

/*
  * Class clsModalPanel
  */
// Instance class constructor:
function clsModalPanel(aProperties) {
  var lProps = aProperties || {};
  lProps.align = lProps.align ? lProps.align : eAlign.eClient;
  lProps.backgroundColor = 'transparent';
  
  // Call the base constructor:
  cPanel.call(this, lProps);
  
  this.semiTransparantPanel = new cPanel({
    align: eAlign.eClient,
    backgroundColor: '#000000',
    transparencyPercentage: 20
  });
  this.panels.push(this.semiTransparantPanel);

  this.contentPanel = new cPanel({
    align: eAlign.eClient,
    backgroundColor: 'transparent'
  });
  this.panels.push(this.contentPanel);
}
// Class inheritance setup:
clsModalPanel.deriveFrom(cPanel);
// Static class constructor:
(function() {
  
  clsModalPanel.prototype.semiTransparantPanel = null;
  clsModalPanel.prototype.contentPanel = null;
  
})();
