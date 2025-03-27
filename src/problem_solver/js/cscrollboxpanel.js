include("cbase.js");
include("cpanel.js");
include("cautosizepanel.js");

/*
  * Class cScrollboxPanel
  */
// Instance class constructor:
function cScrollboxPanel(aProperties) {
  // Call the base constructor:
  cPanel.call(this, aProperties);

  var lThis = this;
  this.boxBackgroundColor = aProperties ? (aProperties.boxBackgroundColor ? aProperties.boxBackgroundColor : '#ffffff') : '#ffffff';
  this.scrollBarHandleColor = aProperties ? (aProperties.scrollBarHandleColor ? aProperties.scrollBarHandleColor : '#cccccc') : '#cccccc';
  this.autoHideScrollbar = aProperties ? (aProperties.autoHideScrollbar ? aProperties.autoHideScrollbar : false) : false;
  this.panelBoxRoundedBorder = aProperties ? (aProperties.panelBoxRoundedBorder === false ? aProperties.panelBoxRoundedBorder : true) : true;

  this.onScroll = function(aDelta) {
    lThis.panelScrollBarHandle.setTop(lThis.panelScrollBarHandle.top - (aDelta * 25));
    lThis.panelBox.setTop((-((lThis.panelScrollBarHandle.top * (lThis.panelBox.height - lThis.panelViewport.getInnerHeight())) / (lThis.panelScrollBar.getInnerHeight() - lThis.panelScrollBarHandle.height))) | 0);
    lThis.rerender();
  };
  
  this.panelScrollBar = new cPanel({
    shape: cPanel.cShapeRoundRect,
    borderRadius: 16,
    align: eAlign.eRight,
    width: 70,
    marginLeft: 10,
    backgroundColor: this.boxBackgroundColor
    //border: 1,
    //borderColor: '#000000'
  });
  this.panels.push(this.panelScrollBar);

  this.panelViewport = new cPanel({
    shape: (this.panelBoxRoundedBorder ? cPanel.cShapeRoundRect : cPanel.cShapeRectangle),
    borderRadius: 16,
    align: eAlign.eClient,
    backgroundColor: this.boxBackgroundColor
    //border: 1,
    //borderColor: '#000000'
  });
  this.panels.push(this.panelViewport);
  
  this.panelBox = new cAutoSizePanel({
    align: eAlign.eWidth,
    height: 100,
    top: 0,
    marginBottom: 50,
    backgroundColor: this.boxBackgroundColor
  });
  this.panelViewport.panels.push(this.panelBox);

  var lPanelScrollBar = this.panelScrollBar;
  var lPanelViewport = this.panelViewport;
  var lPanelBox = this.panelBox;
  this.panelScrollBarHandle = new cPanel({
    shape: cPanel.cShapeRoundRect,
    borderRadius: 16,
    align: eAlign.eWidth,
    left: 0,
    top: 0,
    height: 100,
    backgroundColor: this.scrollBarHandleColor,
    //border: 1,
    //borderColor: '#000000',
    onMouseDown: function(aInnerX, aInnerY, aApp, aScreen) {
      aScreen.dragObject = {
        panel: this
      };
    },
    onDrag: function(aApp, aScreen) {
      if (this.top < 0) {
        this.setTop(0);
      }
      if ((this.top + this.height) > lPanelScrollBar.getInnerHeight()) {
        this.setTop(lPanelScrollBar.getInnerHeight() - this.height);
      }
      lPanelBox.setTop((-((this.top * (lPanelBox.height - lPanelViewport.getInnerHeight())) / (lPanelScrollBar.getInnerHeight() - this.height))) | 0);
    }
  });
  this.panelScrollBar.panels.push(this.panelScrollBarHandle);
  
}
// Class inheritance setup:
cScrollboxPanel.deriveFrom(cPanel);
// Static class constructor:
(function() {
  // Public static virtual members (properties):
  cScrollboxPanel.prototype.panelViewport = null;
  cScrollboxPanel.prototype.panelBox = null;
  cScrollboxPanel.prototype.panelScrollBar = null;
  cScrollboxPanel.prototype.panelScrollBarHandle = null;
  cScrollboxPanel.prototype.boxBackgroundColor = '#ffffff';
  cScrollboxPanel.prototype.scrollBarHandleColor = '#cccccc';
  cScrollboxPanel.prototype.autoHideScrollbar = false;
  cScrollboxPanel.prototype.panelBoxRoundedBorder = true;
  
  cScrollboxPanel.prototype.render = function(aParentPanel, aParentElement, aClientRect) {
    cPanel.prototype.render.call(this, aParentPanel, aParentElement, aClientRect);
    if (this.element != null) {
      var lRerender = false;
      // re-determine scroll bar handle dimensions
      var lNewPanelScrollBarHandleHeight;
      if (this.panelBox.getInnerHeight() == 0) {
        lNewPanelScrollBarHandleHeight = this.panelScrollBar.getInnerHeight();
      } else {
        lNewPanelScrollBarHandleHeight = ((this.panelScrollBar.getInnerHeight() * this.panelViewport.getInnerHeight()) / this.panelBox.getInnerHeight()) | 0;
      }
      if (lNewPanelScrollBarHandleHeight >= this.panelScrollBar.getInnerHeight()) {
        lNewPanelScrollBarHandleHeight = this.panelScrollBar.getInnerHeight();
        if (this.autoHideScrollbar) {
          if (this.panelScrollBar.visible) {
            this.panelScrollBar.visible = false;
            lRerender = true;
          }
        }
      } else {
        if (!this.panelScrollBar.visible) {
          this.panelScrollBar.visible = true;
          lRerender = true;
        }
      }
      if (this.panelScrollBarHandle.height != lNewPanelScrollBarHandleHeight) {
        this.panelScrollBarHandle.height = lNewPanelScrollBarHandleHeight;
        lRerender = true;
      }
      // re-adjust inner box position
      if (this.panelScrollBarHandle.top < 0) {
        this.panelScrollBarHandle.top = 0;
        lRerender = true;
      }
      if ((this.panelScrollBarHandle.top + this.panelScrollBarHandle.height) > this.panelScrollBar.getInnerHeight()) {
        this.panelScrollBarHandle.top = (this.panelScrollBar.getInnerHeight() - this.panelScrollBarHandle.height);
        lRerender = true;
      }
      var lNewTop = (-((this.panelScrollBarHandle.top * (this.panelBox.height - this.panelViewport.getInnerHeight())) / (this.panelScrollBar.getInnerHeight() - this.panelScrollBarHandle.height))) | 0;
      if (this.panelBox.top != lNewTop) {
        this.panelBox.top = lNewTop;
        lRerender = true;
      }
      if (lRerender) {
        this.rerender();
      }
    }
  };
  
  cScrollboxPanel.prototype.scrollToTop = function() {
    this.panelScrollBarHandle.setTop(0);
    this.panelBox.setTop((-((this.panelScrollBarHandle.top * (this.panelBox.height - this.panelViewport.getInnerHeight())) / (this.panelScrollBar.getInnerHeight() - this.panelScrollBarHandle.height))) | 0);
  };

  cScrollboxPanel.prototype.scrollToBottom = function() {
    this.panelScrollBarHandle.setTop(this.panelScrollBar.getInnerHeight() - this.panelScrollBarHandle.height);
    this.panelBox.setTop((-((this.panelScrollBarHandle.top * (this.panelBox.height - this.panelViewport.getInnerHeight())) / (this.panelScrollBar.getInnerHeight() - this.panelScrollBarHandle.height))) | 0);
  };

  cScrollboxPanel.prototype.scrollToPercentage = function(aPercentage) {
    this.panelScrollBarHandle.setTop((((this.panelScrollBar.getInnerHeight() - this.panelScrollBarHandle.height) * aPercentage) / 100) | 0);
    this.panelBox.setTop((-((this.panelScrollBarHandle.top * (this.panelBox.height - this.panelViewport.getInnerHeight())) / (this.panelScrollBar.getInnerHeight() - this.panelScrollBarHandle.height))) | 0);
  };
  
})();
