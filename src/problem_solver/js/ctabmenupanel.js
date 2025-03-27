include("cbase.js");
include("cpanel.js");

var eTabMenuAlign = {
  eAutoShortest: 0,
  eTop: 1,
  eLeft: 2
};

/*
  * Class cTabMenuPanel
  */
// Instance class constructor:
function cTabMenuPanel(aProperties) {
  // Call the base constructor:
  cPanel.call(this, aProperties);

  this.tabMenuAlign = aProperties ? (typeof aProperties.tabMenuAlign != 'undefined' ? aProperties.tabMenuAlign : eTabMenuAlign.eAutoShortest) : eTabMenuAlign.eAutoShortest;
  this.tabMenuAlignSet = eTabMenuAlign.eTop;
  this.tabWidth = 160; // will be set during render().
  this.maxTabWidth = aProperties ? (aProperties.maxTabWidth ? aProperties.maxTabWidth : 160) : 160;
  this.marginWidth = 10; // will be set during render().
  this.minMarginWidth = 2;
  var lContainerAlign = eAlign.eTop;
  var lTabAlign = eAlign.eLeft;
  if (this.tabMenuAlign == eTabMenuAlign.eTop) {
    lContainerAlign = eAlign.eTop;
    this.tabMenuAlignSet = eTabMenuAlign.eTop;
    lTabAlign = eAlign.eLeft;
  } else if (this.tabMenuAlign == eTabMenuAlign.eLeft) {
    lContainerAlign = eAlign.eLeft;
    this.tabMenuAlignSet = eTabMenuAlign.eLeft;
    lTabAlign = eAlign.eTop;
  }
  
  this.menuContainer = new cPanel({
    align: lContainerAlign, // possibly changes during render() when this.tabMenuAlign == eTabMenuAlign.eAutoShortest.
    width: 100, // will be set during render().
    height: 100, // will be set during render().
    backgroundColor: this.backgroundColor
  });
  this.panels.push(this.menuContainer);
  
  this.rootClientPanel = new cPanel({
    align: eAlign.eClient,
    margin: 10, // will be set during render().
    marginRight: 11, // will be set during render().
    marginBottom: 11, // will be set during render().
    border: 0,
    padding: 10, // will be set during render().
    backgroundColor: this.backgroundColor,
    color: aProperties ? (aProperties.color ? aProperties.color : '') : '',
    innerHTML: aProperties ? (aProperties.panelHTML ? aProperties.panelHTML : '') : ''
  });
  this.panels.push(this.rootClientPanel);
  
  var lThis = this;
  this.menuTabs = [];
  this.tabPanels = [];
  if (aProperties && aProperties.tabs && aProperties.tabs.length > 0) {
    for (var li = 0; li < aProperties.tabs.length; li++) {
      var lTabDef = aProperties.tabs[li];
      var lPanel = new cPanel({
        align: eAlign.eClient,
        margin: 10, // will be set during render().
        marginRight: 11, // will be set during render().
        marginBottom: 11, // will be set during render().
        border: 0,
        padding: 16, // will be set during render().
        color: lTabDef.color ? lTabDef.color : '#000000',
        backgroundColor: lTabDef.backgroundColor ? lTabDef.backgroundColor : '#cccccc',
        borderRadius: 10, // will be set during render().
        shape: cPanel.cShapeRoundRect,
        visible: false
      });
      this.panels.push(lPanel);
      this.tabPanels.push(lPanel);

      var lTab = new cPanel({
        id: lTabDef.id,
        align: lTabAlign, // possibly changes during render() when this.tabMenuAlign == eTabMenuAlign.eAutoShortest.
        width: 100, // will be set during render().
        height: 100, // will be set during render().
        margin: 10, // will be set during render().
        border: 0,
        padding: 10, // will be set during render().
        color: lTabDef.color ? lTabDef.color : '#000000',
        backgroundColor: lTabDef.backgroundColor ? lTabDef.backgroundColor : '#cccccc',
        image: lTabDef.image ? lTabDef.image : null,
        imageSrc: lTabDef.imageSrc ? lTabDef.imageSrc : '',
        imageStretch: true,
        noWrap: true,
        innerHTML: lTabDef.caption ? lTabDef.caption : '',
        borderRadius: 10, // will be set during render().
        shape: cPanel.cShapeRoundRect,
        onClick: function() {
          if (this.tabPanel.visible) {
            lThis.rootClientPanel.show();
            lThis.selectedTabIndex = -1;
            lThis.selectOverlayPanel.hide();
            lThis.selectOverlayPanelCorner.hide();
            lThis.updateCloseButton();
            cLib.animate(0, 70, 120, function(aTransparencyPercentage) {
              this.tabPanel.setTransparencyPercentage(aTransparencyPercentage | 0);
            }, function() {
              this.tabPanel.hide();
              this.tabPanel.setTransparencyPercentage(0);
              lThis.updateVisibility(this.tabPanel, false);
            }, this);
          } else {
            if (lThis.selectedTabIndex >= 0) {
              lThis.selectOverlayPanel.hide();
              lThis.selectOverlayPanelCorner.hide();
            }
            this.tabPanel.setTransparencyPercentage(100);
            this.tabPanel.show();
            lThis.updateVisibility(this.tabPanel, true);
            cLib.animate(100, 30, 120, function(aTransparencyPercentage) {
              this.tabPanel.setTransparencyPercentage(aTransparencyPercentage | 0);
              if (lThis.selectedTabIndex >= 0) {
                lThis.tabPanels[lThis.selectedTabIndex].setTransparencyPercentage(100 - (aTransparencyPercentage | 0));
              }
            }, function() {
              if (lThis.selectedTabIndex >= 0) {
                lThis.tabPanels[lThis.selectedTabIndex].hide();
                lThis.tabPanels[lThis.selectedTabIndex].setTransparencyPercentage(0);
                lThis.updateVisibility(lThis.tabPanels[lThis.selectedTabIndex], false);
              }
              this.tabPanel.setTransparencyPercentage(0);
              lThis.selectedTabIndex = this.tabIndex;
              
              lThis.selectOverlayPanel.setBackgroundColor(this.backgroundColor); //'#000000'
              lThis.selectOverlayPanelCorner.setBackgroundColor(this.backgroundColor); //'#000000'
              lThis.updateOverlayPanel();
              lThis.updateCloseButton();
              lThis.selectOverlayPanel.setTransparencyPercentage(100);
              lThis.selectOverlayPanelCorner.setTransparencyPercentage(100);
              lThis.selectOverlayPanel.show();
              lThis.selectOverlayPanelCorner.show();
              lThis.rootClientPanel.hide();
              cLib.animate(100, 30, 80, function(aTransparencyPercentage) {
                lThis.selectOverlayPanel.setTransparencyPercentage(aTransparencyPercentage | 0);
                lThis.selectOverlayPanelCorner.setTransparencyPercentage(aTransparencyPercentage | 0);
              }, function() {
                lThis.selectOverlayPanel.setTransparencyPercentage(0);
                lThis.selectOverlayPanelCorner.setTransparencyPercentage(0);
              }, this);
            }, this);
          }
        }
      });
      lTab.tabPanel = lPanel;
      lTab.tabIndex = li;
      this.menuContainer.panels.push(lTab);
      this.menuTabs.push(lTab);
    }
  }
  this.selectedTabIndex = -1;
  this.selectOverlayPanel = new cPanel({ // panel for showing connection between tab and panel when selected
    align: eAlign.eNone,
    margin: 0,
    border: 0,
    padding: 0,
    visible: false
  });
  this.panels.push(this.selectOverlayPanel);
  this.selectOverlayPanelCorner = new cPanel({ // panel for showing connection between tab and panel when selected
    align: eAlign.eNone,
    margin: 0,
    border: 0,
    padding: 0,
    visible: false
  });
  this.panels.push(this.selectOverlayPanelCorner);
  
  this.closePanel = new cPanel({ // panel for closing a tab
    align: eAlign.eNone,
    left: 20, // will be set during updateCloseButton().
    top: 20, // will be set during updateCloseButton().
    width: 60,
    height: 60,
    margin: 0,
    border: 0,
    padding: 0,
    backgroundColor: 'transparent',
    visible: false,
    image: aProperties ? (aProperties.closeImage ? aProperties.closeImage : null) : null,
    imageStretch: true,
    onClick: function() {
      if (lThis.selectedTabIndex >= 0) {
        var lTab = lThis.menuTabs[lThis.selectedTabIndex];
        var lTabPanel = lThis.tabPanels[lThis.selectedTabIndex];
        lThis.rootClientPanel.show();
        lThis.selectedTabIndex = -1;
        lThis.selectOverlayPanel.hide();
        lThis.selectOverlayPanelCorner.hide();
        lThis.updateCloseButton();
        cLib.animate(0, 70, 120, function(aTransparencyPercentage) {
          lTabPanel.setTransparencyPercentage(aTransparencyPercentage | 0);
        }, function() {
          lTabPanel.hide();
          lTabPanel.setTransparencyPercentage(0);
          lThis.updateVisibility(lTabPanel, false);
        }, lTab);
      }
    }
  });
  this.panels.push(this.closePanel);
  
}
// Class inheritance setup:
cTabMenuPanel.deriveFrom(cPanel);
// Static class constructor:
(function() {
  // Public static virtual members (properties):
  cTabMenuPanel.prototype.tabMenuAlign = eTabMenuAlign.eAutoShortest;
  cTabMenuPanel.prototype.tabMenuAlignSet = eTabMenuAlign.eTop;
  cTabMenuPanel.prototype.tabWidth = 160;
  cTabMenuPanel.prototype.maxTabWidth = 160;
  cTabMenuPanel.prototype.marginWidth = 10;
  cTabMenuPanel.prototype.minMarginWidth = 2;
  cTabMenuPanel.prototype.menuContainer = null;
  cTabMenuPanel.prototype.rootClientPanel = null;
  cTabMenuPanel.prototype.menuTabs = [];
  cTabMenuPanel.prototype.tabPanels = [];
  cTabMenuPanel.prototype.selectedTabIndex = -1;
  cTabMenuPanel.prototype.selectOverlayPanel = null;
  cTabMenuPanel.prototype.selectOverlayPanelCorner = null;
  cTabMenuPanel.prototype.closePanel = null;
  
  cTabMenuPanel.prototype.render = function(aParentPanel, aParentElement, aClientRect) {
    cPanel.prototype.render.call(this, aParentPanel, aParentElement, aClientRect);
    if (this.element != null) {
      var lRerender = false;
      if (this.tabMenuAlign == eTabMenuAlign.eAutoShortest) {
        if (this.width > this.height) {
          this.tabMenuAlignSet = eTabMenuAlign.eLeft;
          if (this.menuContainer.align != eAlign.eLeft) {
            this.menuContainer.align = eAlign.eLeft;
            lRerender = true;
          }
        } else {
          this.tabMenuAlignSet = eTabMenuAlign.eTop;
          if (this.menuContainer.align != eAlign.eTop) {
            this.menuContainer.align = eAlign.eTop;
            lRerender = true;
          }
        }
      }
      // determine size of tabs
      if (this.menuTabs.length > 0) {
        this.tabWidth = 160;
        this.marginWidth = (this.tabWidth / 14) | 0;
        var lNumberOfTabsForCalculatingTabWidth = this.menuTabs.length;
        if (lNumberOfTabsForCalculatingTabWidth <= 4) { // prevent menu's with small number of tabs taking up too much space
          lNumberOfTabsForCalculatingTabWidth = 5;
        }
        if (this.tabMenuAlignSet == eTabMenuAlign.eLeft) {
          this.tabWidth = (this.menuContainer.getInnerHeight() / (lNumberOfTabsForCalculatingTabWidth + 0.2)) | 0;
          if (this.tabWidth > this.maxTabWidth) {
            this.tabWidth = this.maxTabWidth;
          }
          if (this.menuContainer.width != this.tabWidth) {
            this.menuContainer.width = this.tabWidth;
            lRerender = true;
          }
          this.marginWidth = (this.tabWidth / 14) | 0;
          if (this.marginWidth < this.minMarginWidth) {
            this.marginWidth = this.minMarginWidth;
          }
          if (this.selectedTabIndex >= 0) {
            this.updateOverlayPanel();
          }
        } else if (this.tabMenuAlignSet == eTabMenuAlign.eTop) {
          this.tabWidth = (this.menuContainer.getInnerWidth() / (lNumberOfTabsForCalculatingTabWidth + 0.2)) | 0;
          if (this.tabWidth > this.maxTabWidth) {
            this.tabWidth = this.maxTabWidth;
          }
          if (this.menuContainer.height != this.tabWidth) {
            this.menuContainer.height = this.tabWidth;
            lRerender = true;
          }
          this.marginWidth = (this.tabWidth / 14) | 0;
          if (this.marginWidth < this.minMarginWidth) {
            this.marginWidth = this.minMarginWidth;
          }
          this.marginWidth = (this.tabWidth / 14) | 0;
          if (this.marginWidth < this.minMarginWidth) {
            this.marginWidth = this.minMarginWidth;
          }
          if (this.selectedTabIndex >= 0) {
            this.updateOverlayPanel();
          }
        }
        for (var li = 0; li < this.menuTabs.length; li++) {
          var lTab = this.menuTabs[li];
          if (this.tabMenuAlignSet == eTabMenuAlign.eLeft) {
            if (lTab.align != eAlign.eTop) {
              lTab.align = eAlign.eTop;
              lRerender = true;
            }
            if (lTab.height != this.tabWidth) {
              lTab.height = this.tabWidth;
              lRerender = true;
            }
          } else if (this.tabMenuAlignSet == eTabMenuAlign.eTop) {
            if (lTab.align != eAlign.eLeft) {
              lTab.align = eAlign.eLeft;
              lRerender = true;
            }
            if (lTab.width != this.tabWidth) {
              lTab.width = this.tabWidth;
              lRerender = true;
            }
          }
          if (lTab.marginLeft != this.marginWidth) {
            lTab.marginLeft = this.marginWidth;
            lTab.marginTop = this.marginWidth;
            lTab.marginRight = this.marginWidth;
            lTab.marginBottom = this.marginWidth;
            lTab.paddingLeft = this.marginWidth;
            lTab.paddingTop = this.marginWidth;
            lTab.paddingRight = this.marginWidth;
            lTab.paddingBottom = this.marginWidth;
            lTab.borderRadius = this.marginWidth;
            lTab.tabPanel.borderRadius = this.marginWidth;
            lRerender = true;
          }
        }
        for (var li = 0; li < this.tabPanels.length; li++) {
          var lPanel = this.tabPanels[li];
          if (lPanel.marginLeft != this.marginWidth) {
            lPanel.marginLeft = this.marginWidth;
            lPanel.marginTop = this.marginWidth;
            lPanel.marginRight = this.marginWidth + 1;
            lPanel.marginBottom = this.marginWidth + 1;
            lPanel.paddingLeft = (this.marginWidth * 1.6) | 0;
            lPanel.paddingTop = (this.marginWidth * 1.6) | 0;
            lPanel.paddingRight = (this.marginWidth * 1.6) | 0;
            lPanel.paddingBottom = (this.marginWidth * 1.6) | 0;
            lPanel.borderRadius = this.marginWidth;
            lRerender = true;
          }
        }
        if (this.rootClientPanel.marginLeft != this.marginWidth) {
          this.rootClientPanel.marginLeft = this.marginWidth;
          this.rootClientPanel.marginTop = this.marginWidth;
          this.rootClientPanel.marginRight = this.marginWidth + 1;
          this.rootClientPanel.marginBottom = this.marginWidth + 1;
          this.rootClientPanel.padding = this.marginWidth;
          lRerender = true;
        }        
        this.updateCloseButton();
      }
      if (lRerender) {
        // we must call render again
        cPanel.prototype.render.call(this, aParentPanel, aParentElement, aClientRect);
      }
    }
  };
  
  cTabMenuPanel.prototype.updateOverlayPanel = function() {
    if (this.selectedTabIndex >= 0) {
      if (this.tabMenuAlignSet == eTabMenuAlign.eLeft) {
        this.selectOverlayPanel.setLeft((this.tabWidth - this.marginWidth) - this.marginWidth);
        this.selectOverlayPanel.setTop(((this.selectedTabIndex * this.tabWidth) + this.marginWidth) + this.marginWidth);
        this.selectOverlayPanel.setWidth(this.marginWidth * 3);
        this.selectOverlayPanel.setHeight((this.tabWidth - (this.marginWidth * 2)) - this.marginWidth);
        this.selectOverlayPanelCorner.setLeft((this.tabWidth - this.marginWidth) - this.marginWidth);
        this.selectOverlayPanelCorner.setTop((this.selectedTabIndex * this.tabWidth) + this.marginWidth);
        if (this.selectedTabIndex == 0) {
          this.selectOverlayPanelCorner.setWidth(this.marginWidth * 4);
        } else {
          this.selectOverlayPanelCorner.setWidth(this.marginWidth * 3);
        }
        this.selectOverlayPanelCorner.setHeight(this.marginWidth);
      } else {
        this.selectOverlayPanel.setLeft(((this.selectedTabIndex * this.tabWidth) + this.marginWidth) + this.marginWidth);
        this.selectOverlayPanel.setTop((this.tabWidth - this.marginWidth) - this.marginWidth);
        this.selectOverlayPanel.setWidth((this.tabWidth - (this.marginWidth * 2)) - this.marginWidth);
        this.selectOverlayPanel.setHeight(this.marginWidth * 3);
        this.selectOverlayPanelCorner.setLeft((this.selectedTabIndex * this.tabWidth) + this.marginWidth);
        this.selectOverlayPanelCorner.setTop((this.tabWidth - this.marginWidth) - this.marginWidth);
        this.selectOverlayPanelCorner.setWidth(this.marginWidth);
        if (this.selectedTabIndex == 0) {
          this.selectOverlayPanelCorner.setHeight(this.marginWidth * 4);
        } else {
          this.selectOverlayPanelCorner.setHeight(this.marginWidth * 3);
        }
      }
    }
  };
  
  cTabMenuPanel.prototype.updateCloseButton = function() {
    if (this.selectedTabIndex >= 0) {
      if (this.tabMenuAlignSet == eTabMenuAlign.eLeft) {
        this.closePanel.setLeft(this.tabWidth - (this.marginWidth * 2));
        this.closePanel.setTop((this.marginWidth * 2) + (this.selectedTabIndex * (this.tabWidth + 0)));
      } else {
        this.closePanel.setLeft((this.marginWidth * 2) + (this.selectedTabIndex * (this.tabWidth + 0)));
        this.closePanel.setTop(this.tabWidth - (this.marginWidth * 2));
      }
      this.closePanel.setWidth((this.tabWidth / 4) | 0);
      this.closePanel.setHeight((this.tabWidth / 4) | 0);
      if (!this.closePanel.visible) {
        this.closePanel.show();
      }
    } else {
      if (this.closePanel.visible) {
        this.closePanel.hide();
      }
    }
  };
  
  cTabMenuPanel.prototype.updateVisibility = function(aPanel, aVisible) {
    if (aVisible) {
      if (aPanel.onVisible) {
        if (aPanel.onVisibleCallee) {
          aPanel.onVisible.apply(aPanel.onVisibleCallee, []);
        } else {
          aPanel.onVisible();
        }
      }
    } else {
      if (aPanel.onInvisible) {
        if (aPanel.onInvisibleCallee) {
          aPanel.onInvisible.apply(aPanel.onInvisibleCallee, []);
        } else {
          aPanel.onInvisible();
        }
      }
    }
  };
  
  cTabMenuPanel.prototype.getPanelById = function(aId) {
    var lResult = null;
    for (var li = 0; li < this.menuTabs.length; li++) {
      var lTab = this.menuTabs[li];
      if (lTab.id == aId) {
        lResult = lTab.tabPanel;
        break;
      }
    }
    return lResult;
  };
  
  cTabMenuPanel.prototype.closeMenus = function() {
    if (this.selectedTabIndex >= 0) {
      var lThis = this;
      var lTab = this.menuTabs[this.selectedTabIndex];
      var lTabPanel = this.tabPanels[this.selectedTabIndex];
      this.rootClientPanel.show();
      this.selectedTabIndex = -1;
      this.selectOverlayPanel.hide();
      this.selectOverlayPanelCorner.hide();
      this.updateCloseButton();
      cLib.animate(0, 70, 120, function(aTransparencyPercentage) {
        lTabPanel.setTransparencyPercentage(aTransparencyPercentage | 0);
      }, function() {
        lTabPanel.hide();
        lTabPanel.setTransparencyPercentage(0);
        lThis.updateVisibility(lTabPanel, false);
      }, lTab);
    }
  };

  cTabMenuPanel.prototype.selectTabIndex = function(aTabIndex) {
    if (this.selectedTabIndex != aTabIndex) {
      var lTab = this.menuTabs[aTabIndex];
      lTab.onClick.call(lTab);
    }
  };

})();
