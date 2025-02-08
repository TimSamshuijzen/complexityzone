// Copyright 2012 Tim Samshuijzen.

include("cbase.js");
include("cpanel.js");
include("ctexteditpanel.js");

/*
  * Class cEvaluationEditPanel
  */
// Instance class constructor:
function cEvaluationEditPanel(aProperties) {
  // Call the base constructor:
  cPanel.call(this, aProperties);

  //this.xxx = null;
}
// Class inheritance setup:
cEvaluationEditPanel.deriveFrom(cPanel);
// Static class constructor:
(function() {
  // Public static virtual members (properties):
  //cEvaluationEditPanel.prototype.xxx = null;
  
  cEvaluationEditPanel.prototype.render = function(aParentPanel, aParentElement, aClientRect) {
    cPanel.prototype.render.call(this, aParentPanel, aParentElement, aClientRect);
    if (this.element != null) {
    }
  };
  
  
})();
