// Copyright 2012 Tim Samshuijzen.

include("ccommon.js");
include("cpanel.js");
include("cmasterdetailpanel.js");

/**
  * Class cViewHelpPanel
  */
// Instance class constructor:
function cViewHelpPanel(aProperties) {
  // Call the base constructor:
  cPanel.call(this, aProperties);
  
  var lThis = this;
  
  this.screen = aProperties.screen;

  this.viewHelp = new cPanel({
    align: eAlign.eClient,
    padding: 20,
    backgroundColor: '#ffeead',
    innerHTML: 
      '<p style="font-size: 24px;">Problem Solver documentation</p>\n' +
      '<p>...</p>\n'
  });
  this.panels.push(this.viewHelp);
  
  
}
// Class inheritance setup:
cViewHelpPanel.deriveFrom(cPanel);
// Static class constructor:
(function() {

  cViewHelpPanel.prototype.screen = null;

  cViewHelpPanel.prototype.viewHelp = null;
  
})();
  
