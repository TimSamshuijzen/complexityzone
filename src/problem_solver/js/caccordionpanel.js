// Copyright 2012 Tim Samshuijzen.

include("cbase.js");
include("cpanel.js");

/*
  * Class cAccordionPanel
  */
// Instance class constructor:
function cAccordionPanel(aProperties) {
  // Call the base constructor:
  cPanel.call(this, aProperties);

  this.collapsed = aProperties ? (typeof aProperties.collapsed != 'undefined' ? aProperties.collapsed : false) : false;
  this.animating = false;
  this.animationHeight = 0;
  this.originalAlign = this.align;
  var lThis = this;
  this.headerPanel = new cPanel({
    align: eAlign.eTop,
    height: (aProperties ? (aProperties.headerHeight ? aProperties.headerHeight : 40) : 40),
    padding: 10,
    backgroundColor: (aProperties ? (aProperties.headerBackgroundColor ? aProperties.headerBackgroundColor : '#ffffff') : '#ffffff'),
    borderBottom: aProperties ? (typeof aProperties.headerBorder != 'undefined' ? aProperties.headerBorder : 1) : 1,
    borderColor: this.borderColor,
    innerHTML: aProperties ? (aProperties.headerInnerHTML ? aProperties.headerInnerHTML : '') : '',
    onMouseUp: function(aInnerX, aInnerY, aApp, aScreen) {
      if (!lThis.animating) {
        lThis.collapsed = !lThis.collapsed;
        lThis.animating = true;
        var lDestinationHeight = 0;
        if (lThis.collapsed) {
          lDestinationHeight = lThis.headerPanel.height;
          lThis.originalAlign = lThis.align;
          if (lThis.align == eAlign.eClient) {
            lThis.align = eAlign.eTop;
          }
        } else {
          lDestinationHeight = lThis.originalHeight;
        }
        cLib.animate(lThis.height, lDestinationHeight, 200, 
                     function(aValue) {
                       lThis.animationHeight = aValue;
                       lThis.parentPanel.rerender();
                     },
                     function() {
                       lThis.animating = false;
                       if (!lThis.collapsed) {
                         lThis.align = lThis.originalAlign;
                       }
                       lThis.parentPanel.rerender();
                       lThis.onCollapseChange();
                     }, 
                     lThis);
      }
    }
  });
  this.panels.push(this.headerPanel);

  this.originalHeight = this.height - this.headerPanel.height;

  this.clientPanel = new cPanel({
    align: eAlign.eClient,
    backgroundColor: this.backgroundColor
  });
  this.panels.push(this.clientPanel);
}
// Class inheritance setup:
cAccordionPanel.deriveFrom(cPanel);
// Static class constructor:
(function() {
  // Public static virtual members (properties):
  cAccordionPanel.prototype.collapsed = false;
  cAccordionPanel.prototype.animating = false;
  cAccordionPanel.prototype.animationHeight = 0;
  cAccordionPanel.prototype.originalHeight = 100;
  cAccordionPanel.prototype.originalAlign = eAlign.eNone;
  cAccordionPanel.prototype.headerPanel = null;
  cAccordionPanel.prototype.clientPanel = null;

  cAccordionPanel.prototype.onCollapseChange = function() {
    // Override this to react to change in collapse. For example, to collapse other accordions when this uncollapses.
  };

  cAccordionPanel.prototype.render = function(aParentPanel, aParentElement, aClientRect) {
    if (this.element != null) {
      if (this.animating) {
        this.height = this.animationHeight;
      } else {
        if (this.collapsed) {
          this.height = this.headerPanel.height;
        } else {
          this.height = this.originalHeight;
        }
      }
    }
    cPanel.prototype.render.call(this, aParentPanel, aParentElement, aClientRect);
  };
  
  
})();
