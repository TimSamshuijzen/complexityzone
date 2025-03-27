include("cbase.js");
include("cpanel.js");

/*
  * Class cAutoSpanPanel
  */
// Instance class constructor:
function cAutoSpanPanel(aProperties) {
  // Call the base constructor:
  cPanel.call(this, aProperties);
 
  this.spanMethod = aProperties ? (aProperties.spanMethod ? aProperties.spanMethod : cAutoSpanPanel.spanMethod_auto) : cAutoSpanPanel.spanMethod_auto;
  this.separationMargin = aProperties ? (typeof aProperties.separationMargin != 'undefined' ? aProperties.separationMargin : 16) : 16;
}
// Class inheritance setup:
cAutoSpanPanel.deriveFrom(cPanel);
// Static class constructor:
(function() {
  // Public static virtual members (properties):
  cAutoSpanPanel.spanMethod_auto = 0;
  cAutoSpanPanel.spanMethod_horizontal = 1;
  cAutoSpanPanel.spanMethod_vertical = 2;
  
  cAutoSpanPanel.prototype.spanMethod = cAutoSpanPanel.spanMethod_auto;
  cAutoSpanPanel.prototype.separationMargin = 16;
  
  cAutoSpanPanel.prototype.render = function(aParentPanel, aParentElement, aClientRect) {
    cPanel.prototype.render.call(this, aParentPanel, aParentElement, aClientRect);
    if (this.element != null) {
      if (this.panels.length > 0) {
        var lRerender = false;
        if ( ((this.getInnerHeight() > this.getInnerWidth()) || (this.spanMethod == cAutoSpanPanel.spanMethod_vertical)) &&
             (this.spanMethod != cAutoSpanPanel.spanMethod_horizontal)) {
          // align all children vertically, equally spaced
          var lPanelHeight = ((this.getInnerHeight() + this.separationMargin) / this.panels.length) | 0;
          for (var lpi = 0; lpi < this.panels.length; lpi++) {
            lPanel = this.panels[lpi];
            if (lPanel.align != eAlign.eTop) {
              lPanel.align = eAlign.eTop;
              lRerender = true;
            }
            if (lPanel.marginLeft != 0) {
              lPanel.marginLeft = 0;
              lRerender = true;
            }
            if (lPanel.marginTop != 0) {
              lPanel.marginTop = 0;
              lRerender = true;
            }
            if (lPanel.marginRight != 0) {
              lPanel.marginRight = 0;
              lRerender = true;
            }
            if (lpi == (this.panels.length - 1)) {
              if (lPanel.height != (lPanelHeight - this.separationMargin)) {
                lPanel.height = (lPanelHeight - this.separationMargin);
                lRerender = true;
              }
              if (lPanel.marginBottom != 0) {
                lPanel.marginBottom = 0;
                lRerender = true;
              }
            } else {
              if (lPanel.height != lPanelHeight) {
                lPanel.height = lPanelHeight;
                lRerender = true;
              }
              if (lPanel.marginBottom != this.separationMargin) {
                lPanel.marginBottom = this.separationMargin;
                lRerender = true;
              }
            }
          }
        } else {
          // align all children horizontally, equally spaced
          var lPanelWidth = ((this.getInnerWidth() + this.separationMargin) / this.panels.length) | 0;
          for (var lpi = 0; lpi < this.panels.length; lpi++) {
            lPanel = this.panels[lpi];
            if (lPanel.align != eAlign.eLeft) {
              lPanel.align = eAlign.eLeft;
              lRerender = true;
            }
            if (lPanel.marginLeft != 0) {
              lPanel.marginLeft = 0;
              lRerender = true;
            }
            if (lPanel.marginTop != 0) {
              lPanel.marginTop = 0;
              lRerender = true;
            }
            if (lPanel.marginBottom != 0) {
              lPanel.marginBottom = 0;
              lRerender = true;
            }
            if (lpi == (this.panels.length - 1)) {
              if (lPanel.width != (lPanelWidth - this.separationMargin)) {
                lPanel.width = (lPanelWidth - this.separationMargin);
                lRerender = true;
              }
              if (lPanel.marginRight != 0) {
                lPanel.marginRight = 0;
                lRerender = true;
              }
            } else {
              if (lPanel.width != lPanelWidth) {
                lPanel.width = lPanelWidth;
                lRerender = true;
              }
              if (lPanel.marginRight != this.separationMargin) {
                lPanel.marginRight = this.separationMargin;
                lRerender = true;
              }
            }
          }
        }
        if (lRerender) {
          this.rerender();
        }
      }
    }
  };
})();
