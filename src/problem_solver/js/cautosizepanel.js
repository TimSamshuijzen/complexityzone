// Copyright 2012 Tim Samshuijzen.

include("cbase.js");
include("cpanel.js");

/*
  * Class cAutoSizePanel
  */
// Instance class constructor:
function cAutoSizePanel(aProperties) {
  // Call the base constructor:
  cPanel.call(this, aProperties);
}
// Class inheritance setup:
cAutoSizePanel.deriveFrom(cPanel);
// Static class constructor:
(function() {
  // Public static virtual members (properties):
  
  cAutoSizePanel.prototype.render = function(aParentPanel, aParentElement, aClientRect) {
    cPanel.prototype.render.call(this, aParentPanel, aParentElement, aClientRect);
    if (this.element != null) {
      var lAutoSizeWidth = false;
      var lAutoSizeHeight = false;
      if (this.align == eAlign.eNone) {
        // Autosize width and height
        lAutoSizeWidth = true;
        lAutoSizeHeight = true;
      } else if (this.align == eAlign.eClient) {
        // Autosize none
      } else if (this.align == eAlign.eTop) {
        // Autosize height
        lAutoSizeHeight = true;
      } else if (this.align == eAlign.eBottom) {
        // Autosize height
        lAutoSizeHeight = true;
      } else if (this.align == eAlign.eLeft) {
        // Autosize width
        lAutoSizeWidth = true;
      } else if (this.align == eAlign.eRight) {
        // Autosize width
        lAutoSizeWidth = true;
      } else if (this.align == eAlign.eCenter) {
        // Autosize width and height
        lAutoSizeWidth = true;
        lAutoSizeHeight = true;
      } else if (this.align == eAlign.eWidth) {
        // Autosize height
        lAutoSizeHeight = true;
      } else if (this.align == eAlign.eHeight) {
        // Autosize width
        lAutoSizeWidth = true;
      }
      var lNewWidth = this.width;
      var lNewHeight = this.height;
      if (lAutoSizeWidth) {
        // find subpanel's most right side
        var lMostRight = 0;
        for (var lpi = 0; lpi < this.panels.length; lpi++) {
          var lRight = this.panels[lpi].left + this.panels[lpi].width;
          if (lRight > lMostRight) {
            lMostRight = lRight;
          }
        }
        lNewWidth = lMostRight +
                    (this.marginLeft + this.borderLeft + this.paddingLeft + 
                     this.paddingRight + this.borderRight + this.marginRight);
      }
      if (lAutoSizeHeight) {
        // find subpanel's most bottom side
        var lMostBottom = 0;
        for (var lpi = 0; lpi < this.panels.length; lpi++) {
          var lBottom = this.panels[lpi].top + this.panels[lpi].height;
          if (lBottom > lMostBottom) {
            lMostBottom = lBottom;
          }
        }
        lNewHeight = lMostBottom +
                     (this.marginTop + this.borderTop + this.paddingTop + 
                      this.paddingBottom + this.borderBottom + this.marginBottom);
      }
      if ((lNewWidth != this.width) || (lNewHeight != this.height)) {
        this.width = lNewWidth;
        this.height = lNewHeight;
        // when changing size, we need to call the screen's panel's rerender() method.
        var lTopPanel = aParentPanel;
        if (lTopPanel != null) {
          while (lTopPanel.parentPanel != null) {
            lTopPanel = lTopPanel.parentPanel;
          }
          lTopPanel.rerender();
        }
      }
    }
  };
})();
