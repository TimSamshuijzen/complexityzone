// Copyright 2012 Tim Samshuijzen.

include("cbase.js");
include("cdom.js");
include("cpanel.js");
include("clsModalPanel.js");

// Global reference to application object.
var gScreen = null;

/**
  * Class cScreen
  */
// Instance class constructor:
function cScreen(aApp, aContainer) {
  cBase.call(this);
  
  gScreen = this;
  
  // Public instances (override public static defaults)
  this.initialized = false;
  cScreen.prototype.lastId++;
  this.id = cScreen.prototype.lastId;
  this.app = aApp;
  this.container = aContainer;
  if (this.container === document.body) {
    this.fullscreenMode = true;
  } else {
    this.fullscreenMode = false;
  }
  this.panel = new cPanel({align: eAlign.eClient, instanceId: this.id});
  this.modalPanels = [];
  this.images = [];
  this.mouseX = 0;
  this.mouseY = 0;
  this.mouseDown = false;
  this.mouseDownX = 0;
  this.mouseDownY = 0;
  this.mouseDownTimeMs = 0;
  this.mousePanelHovers = [];
  this.mousePanelDowns = [];
  this.lastTouchUpTimeMs = 0;
  this.dragObject = null;
  this.container.style.margin = '0';
  this.container.style.border = '0';
  this.container.style.padding = '0';
  this.container.style.webkitTouchCallout = 'none';
  this.container.style.webkitUserSelect = 'none';
  this.container.style.MozUserSelect = 'none';
  this.container.style['-ms-user-select'] = 'none';
  this.container.style.userSelect = 'none';
  this.container.style.cursor = 'default';
  this.screenContainer = null;
  if (this.setup()) {
//    cDOM.registerEvent(document.body, 'mouseup', this.onMouseUp, this);
//    cDOM.registerEvent(document.body, 'touchend', this.onTouchUp, this);
//    cDOM.registerEvent(document.body, 'touchcancel', this.onTouchUp, this);
    cDOM.registerEvent(document.body, 'mouseout', this.onMouseOutDocument, this);
    cDOM.registerEvent(window, 'resize', this.onResize, this);
    this.initialized = true;
  }
}
// Class inheritance setup:
cScreen.deriveFrom(cBase);
// Static class constructor:
(function() {
  // Public static defaults:
  cScreen.prototype.initialized = false;
  cScreen.prototype.lastId = 0;
  cScreen.prototype.id = 0;
  cScreen.prototype.app = null;
  cScreen.prototype.container = null;
  cScreen.prototype.screenContainer = null;
  cScreen.prototype.fullscreenMode = false;
  cScreen.prototype.width = 800;
  cScreen.prototype.height = 600;
  cScreen.prototype.panel = null;
  cScreen.prototype.modalPanels = [];
  cScreen.prototype.images = [];
  cScreen.prototype.mouseX = 0;
  cScreen.prototype.mouseY = 0;
  cScreen.prototype.mouseDown = false;
  cScreen.prototype.mouseDownX = 0;
  cScreen.prototype.mouseDownY = 0;
  cScreen.prototype.mouseDownTimeMs = 0;
  cScreen.prototype.mousePanel = [];
  cScreen.prototype.mousePanelHovers = [];
  cScreen.prototype.mousePanelDowns = [];
  cScreen.prototype.lastTouchUpTimeMs = 0;
  cScreen.prototype.dragObject = null;

  cScreen.prototype.setup = function() {
    if (this.fullscreenMode) { //full screen mode
      this.width = cDOM.getClientWidth() - 1;
      this.height = cDOM.getClientHeight() - 1;
    } else {
      //this.width = parseInt(this.container.style.width, 0);
      //this.height = parseInt(this.container.style.height, 0);
      //if ((this.width === NaN) || (this.width <= 0)) {
      //  this.width = this.container.offsetWidth || 800;
      //}
      //if ((this.height === NaN) || (this.height <= 0)) {
      //  this.height = this.container.offsetHeight || 600;
      //}
      this.width = this.container.offsetWidth || 800;
      this.height = this.container.offsetHeight || 600;
    }
    if (this.screenContainer == null) {
      this.screenContainer = document.createElement('DIV');
      this.screenContainer.id = 'screen' + this.id;
      this.screenContainer.className = 'scrn';
      this.container.innerHTML = '';
      this.container.appendChild(this.screenContainer);

      cDOM.registerEvent(this.screenContainer, 'mousedown', this.onMouseDownEvent, this);
      cDOM.registerEvent(this.screenContainer, 'mousemove', this.onMouseMoveEvent, this);
      cDOM.registerEvent(this.screenContainer, 'mouseup', this.onMouseUpEvent, this);
      //cDOM.registerEvent(this.screenContainer, 'mouseout', this.onMouseOut, this);

      cDOM.registerEvent(this.screenContainer, 'touchstart', this.onTouchDownEvent, this);
      cDOM.registerEvent(this.screenContainer, 'touchmove', this.onTouchMoveEvent, this);
      cDOM.registerEvent(this.screenContainer, 'touchend', this.onTouchUpEvent, this);
      cDOM.registerEvent(this.screenContainer, 'touchcancel', this.onTouchCancelEvent, this);
      var lMousewheelEvent = (navigator.userAgent.indexOf('Firefox') >= 0) ? "DOMMouseScroll" : "mousewheel";
      cDOM.registerEvent(document, lMousewheelEvent, this.onScroll, this);
    }
    this.screenContainer.style.width = this.width + 'px';
    this.screenContainer.style.height = this.height + 'px';
    this.panel.render(null, this.screenContainer, {left: 0, top: 0, width: this.width, height: this.height});
    for (var lpi = 0; lpi < this.modalPanels.length; lpi++) {
      this.modalPanels[lpi].render(null, this.screenContainer, {left: 0, top: 0, width: this.width, height: this.height});
    }

    return true;
  };
  
  cScreen.prototype.loadImages = function(aImages) {
    for (var i = 0; i < aImages.length; i++) {
      var lImage = aImages[i];
      var lIdFound = false;
      for (var isc = 0; isc < this.images.length; isc++) {
        if (this.images[isc].id == lImage.id) {
          lIdFound = true;
          break;
        }
      }
      if (!lIdFound) {
        //lImage.img = document.createElement('img');
        lImage.img = new Image();
        lImage.loaded = false;
        lImage.error = false;
        (function(aImg) { // loop-function-closure-workaround
          aImg.img.onload = function() {
            if ((aImg.img.width > 0) && (aImg.img.height > 0)) {
              aImg.loaded = true;
            } else {
              aImg.error = true;
            }
          };
          aImg.img.onerror = function() {
            aImg.error = true;
          };
          aImg.img.onabort = function() {
            aImg.error = true;
          };
        })(lImage);
        lImage.img.id = 'i' + this.id + '_' + (i + 1);
        lImage.img.src = lImage.src;
        // force trying to load image:
        if ((lImage.img.width > 0) && (lImage.img.height > 0)) {
          lImage.loaded = true;
        }
        this.images.push(lImage);
      }
    }
  };
  cScreen.prototype.getImage = function(aImageId) {
    for (var i = 0; i < this.images.length; i++) {
      var lImage = this.images[i];
      if (lImage.id == aImageId) {
        return lImage;
      }
    }
    return null;
  };
  cScreen.prototype.getImageClone = function(aImageId) {
    for (var i = 0; i < this.images.length; i++) {
      var lImage = this.images[i];
      if (lImage.id == aImageId) {
        if (lImage.img.cloneNode) {
          return lImage.img.cloneNode();
        } else {
          var lClone = new Image();
          lClone.src = lImage.img.src;
          return lClone;
        }
      }
    }
    return null;
  };
  cScreen.prototype.waitForResources = function(aScope, aOnComplete, aTryCount) {
    var lComplete = true;
    for (var i = 0; i < this.images.length; i++) {
      var lImage = this.images[i];
      if ((lImage.img.complete) || ((lImage.img.width > 0) && (lImage.img.height > 0))) {
        lImage.loaded = true;
      } else {
        if ((!(lImage.loaded)) && (!(lImage.error))) {
          lComplete = false;
          break;
        }
      }
    }
    var lTryCount = aTryCount || 0;
    lTryCount++;
    if ((lComplete) || (lTryCount >= 50)) { // timeout of 5 seconds
      aOnComplete.call(aScope);
    } else {
      var lScreen = this;
      setTimeout(function() {lScreen.waitForResources(aScope, aOnComplete, lTryCount);}, 100);
    }
  };
  cScreen.prototype.onResize = function() {
    if (this.app.onPreResize) {
      this.app.onPreResize();
    }
    this.setup();
    if (this.app.onResize) {
      this.app.onResize();
      this.setup();
    }
    if (this.app.onPostResize) {
      this.app.onPostResize();
    }
  };

cScreen.prototype.pushModalPanel = function() {
    var lModalPanel = new clsModalPanel({instanceId: (this.id + ((this.modalPanels.length + 1) * 10000))});
    this.modalPanels.push(lModalPanel);
    this.setup();
    this.clearHovers();
    return lModalPanel.contentPanel;
  };
  
  cScreen.prototype.popModalPanel = function() {
    if (this.modalPanels.length > 0) {
      var lModalPanel = this.modalPanels[this.modalPanels.length - 1];
      if (this.screenContainer && lModalPanel.element) {
        this.screenContainer.removeChild(lModalPanel.element);
      }
      this.modalPanels.splice(this.modalPanels.length - 1, 1);
    }
    this.setup();
    this.clearHovers();
  };
  
  cScreen.prototype.updateHovers = function() {
    var lNewMousePanelHovers = [];
    // ordered from background to foreground

    if (this.modalPanels.length > 0) {
      this.modalPanels[this.modalPanels.length - 1].recursiveHitTest(this.mouseX, this.mouseY, lNewMousePanelHovers);
    } else {
      this.panel.recursiveHitTest(this.mouseX, this.mouseY, lNewMousePanelHovers);
    }
    
    /*
    This does not function as wanted when panels with the same parent overlap each other.
    Only the top one remains, and all parents are removed.
    
    // only do topmost and its parents
    if (lNewMousePanelHovers.length > 1) {
      for (var lpi = (lNewMousePanelHovers.length - 2); lpi >= 0; lpi--) {
        if (lNewMousePanelHovers[lpi].panel.parentPanel !== lNewMousePanelHovers[lpi + 1].panel) {
          lNewMousePanelHovers.splice(0, lpi + 1);
          break;
        }
      }
    }
    */
    
    var lHover;
    // fire exits
    for (var lpi = 0; lpi < this.mousePanelHovers.length; lpi++) {
      lHover = this.mousePanelHovers[lpi];
      for (var lpi2 = 0; lpi2 < lNewMousePanelHovers.length; lpi2++) {
        if (lNewMousePanelHovers[lpi2].panel === lHover.panel) {
          lHover = null;
          break;
        }
      }
      if (lHover != null) {
        lHover.panel.mouseWithin = false;
        if (lHover.panel.onMouseExit) {
          lHover.panel.onMouseExit();
        }
      }
    }
    // fire enters
    for (var lpi = 0; lpi < lNewMousePanelHovers.length; lpi++) {
      lHover = lNewMousePanelHovers[lpi];
      for (var lpi2 = 0; lpi2 < this.mousePanelHovers.length; lpi2++) {
        if (this.mousePanelHovers[lpi2].panel === lHover.panel) {
          lHover = null;
          break;
        }
      }
      if (lHover != null) {
        lHover.panel.mouseWithin = true;
        if (lHover.panel.onMouseEnter) {
          lHover.panel.onMouseEnter();
        }
      }
    }
    this.mousePanelHovers = lNewMousePanelHovers;
  };

  cScreen.prototype.clearHovers = function() {
    var lHover;
    for (var lpi = 0; lpi < this.mousePanelHovers.length; lpi++) {
      lHover = this.mousePanelHovers[lpi];
      lHover.panel.mouseWithin = false;
      if (lHover.panel.onMouseExit) {
        lHover.panel.onMouseExit();
      }
    }
    this.mousePanelHovers = [];
    this.mousePanelDowns = [];
  };
  
  cScreen.prototype.onMouseDown = function(aEvent) {
    if (!this.mouseDown) {
      var lpos = cDOM.getMouseElementCoordinates(aEvent, this.panel.element);
      this.mouseX = lpos.x;
      this.mouseY = lpos.y;
      this.mouseDown = true;
      this.mouseDownX = this.mouseX;
      this.mouseDownY = this.mouseY;
      this.mouseDownTimeMs = new Date().getTime();
      this.updateHovers();

      this.dragObject = null;

      if (this.app.postEdits) {
        this.app.postEdits.apply(this.app, []);
      }
      // do bubble
      for (var lpi = (this.mousePanelHovers.length - 1); lpi >= 0; lpi--) {
        if (this.mousePanelHovers[lpi].panel.onMouseDown) {
          this.mousePanelHovers[lpi].panel.stopBubble = false;
          this.mousePanelHovers[lpi].panel.onMouseDown(this.mousePanelHovers[lpi].innerX, this.mousePanelHovers[lpi].innerY, this.app, this);
          if (this.mousePanelHovers[lpi].panel.stopBubble) {
            break;
          }
        }
      }
      if (this.app.onMouseDown) {
        this.app.onMouseDown.apply(this.app, []);
      }
      if (this.dragObject != null) {
        this.dragObject.startMouseX = this.mouseX;
        this.dragObject.startMouseY = this.mouseY;
        this.dragObject.startPanelX = 0;
        this.dragObject.startPanelY = 0;
        if (this.dragObject.panel) {
          this.dragObject.startPanelX = this.dragObject.panel.left;
          this.dragObject.startPanelY = this.dragObject.panel.top;
          if (this.dragObject.panel.onDragStart) {
            this.dragObject.panel.onDragStart(this.app, this);
          }
        }
      }
      this.mousePanelDowns = [];
      for (var lpi = 0; lpi < this.mousePanelHovers.length; lpi++) {
        this.mousePanelDowns.push(this.mousePanelHovers[lpi]);
      }
    }
  };
  
  cScreen.prototype.onMouseMove = function(aEvent) {
    var lpos = cDOM.getMouseElementCoordinates(aEvent, this.screenContainer);
    if ((lpos.x != 0) || (lpos.y != 0)) { // somehow these get fired at startup even when mouse is outside window
      this.mouseX = lpos.x;
      this.mouseY = lpos.y;
      this.updateHovers();

      if (this.dragObject != null) {
        if (this.dragObject.panel) {
          this.dragObject.panel.setLeft(this.dragObject.startPanelX + (this.mouseX - this.dragObject.startMouseX));
          this.dragObject.panel.setTop(this.dragObject.startPanelY + (this.mouseY - this.dragObject.startMouseY));
          if (this.dragObject.panel.onDrag) {
            this.dragObject.panel.onDrag(this.app, this);
          }
        }
      }

      // Fire onMouseUp events when exiting panels which are listed in this.mousePanelDowns but not in mousePanelHovers, and remove from mousePanelDowns.
      for (var lpi = 0; lpi < this.mousePanelDowns.length; lpi++) {
        var lfound = false;
        for (var lhi = 0; lhi < this.mousePanelHovers.length; lhi++) {
          if (this.mousePanelHovers[lhi].panel === this.mousePanelDowns[lpi].panel) {
            lfound = true;
            break;
          }
        }
        if (!lfound) {
          if (this.mousePanelDowns[lpi].panel.onMouseUp) {
            this.mousePanelDowns[lpi].panel.onMouseUp(this.mousePanelDowns[lpi].innerX, this.mousePanelDowns[lpi].innerY, this.app, this);
          }
          this.mousePanelDowns.splice(lpi, 1);
          lpi--;
        }
      }

      // do bubble
      for (var lpi = (this.mousePanelHovers.length - 1); lpi >= 0; lpi--) {
        if (this.mousePanelHovers[lpi].panel.onMouseMove) {
          this.mousePanelHovers[lpi].panel.stopBubble = false;
          this.mousePanelHovers[lpi].panel.onMouseMove(this.mousePanelHovers[lpi].innerX, this.mousePanelHovers[lpi].innerY, this.app, this);
          if (this.mousePanelHovers[lpi].panel.stopBubble) {
            break;
          }
        }
      }
      if (this.app.onMouseMove) {
        this.app.onMouseMove.apply(this.app, []);
      }
    }
  };
  cScreen.prototype.onMouseUp = function() {
    if (this.mouseDown) {
      this.mouseDown = false;
      var lMouseUpTimeMs = new Date().getTime();
      var lTap = (((lMouseUpTimeMs - this.mouseDownTimeMs) < 200) &&
                  (Math.abs(this.mouseDownX - this.mouseX) <= 10) &&
                  (Math.abs(this.mouseDownY - this.mouseY) <= 10));
      this.updateHovers();
      if (this.dragObject != null) {
        for (var lpi = (this.mousePanelHovers.length - 1); lpi >= 0; lpi--) {
          if (this.mousePanelHovers[lpi].panel.onDragReceive) {
            this.mousePanelHovers[lpi].panel.onDragReceive(this.mousePanelHovers[lpi].innerX, this.mousePanelHovers[lpi].innerY, this.app, this);
          }
        }
        if((this.dragObject.panel) && (this.dragObject.panel.onDragEnd)) {
          this.dragObject.panel.onDragEnd(this.app, this); // so that we can compile view
        }
      } else {
        // do bubble click
        for (var lpi = (this.mousePanelHovers.length - 1); lpi >= 0; lpi--) {
          if (this.mousePanelHovers[lpi].panel.onClick) {
            // only if mouse down happened on this panel
            var lMouseWasDown = false;
            for (var lpid = 0; (lpid < this.mousePanelDowns.length) && (!lMouseWasDown); lpid++) {
              if (this.mousePanelDowns[lpid].panel === this.mousePanelHovers[lpi].panel) {
                lMouseWasDown = true;
              }
            }
            if (lMouseWasDown) {
              this.mousePanelHovers[lpi].panel.stopBubble = false;
              this.mousePanelHovers[lpi].panel.onClick(this.mousePanelHovers[lpi].innerX, this.mousePanelHovers[lpi].innerY, this.app, this);
              if (this.mousePanelHovers[lpi].panel.stopBubble) {
                break;
              }
            }
          }
        }
        // do bubble mouseUp
        for (var lpi = (this.mousePanelHovers.length - 1); lpi >= 0; lpi--) {
          if (this.mousePanelHovers[lpi].panel.onMouseUp) {
            this.mousePanelHovers[lpi].panel.stopBubble = false;
            this.mousePanelHovers[lpi].panel.onMouseUp(this.mousePanelHovers[lpi].innerX, this.mousePanelHovers[lpi].innerY, this.app, this);
            if (this.mousePanelHovers[lpi].panel.stopBubble) {
              break;
            }
          }
        }
        if (this.app.onMouseUp) {
          this.app.onMouseUp.apply(this.app, []);
        }
      }
      this.dragObject = null;
      if (lTap) {
        for (var lpi = (this.mousePanelHovers.length - 1); lpi >= 0; lpi--) {
          if (this.mousePanelHovers[lpi].panel.onTap) {
            this.mousePanelHovers[lpi].panel.stopBubble = false;
            this.mousePanelHovers[lpi].panel.onTap(this.mousePanelHovers[lpi].innerX, this.mousePanelHovers[lpi].innerY, this.app, this);
            if (this.mousePanelHovers[lpi].panel.stopBubble) {
              break;
            }
          }
        }
        if (this.app.onTap) {
          this.app.onTap.apply(this.app, []);
        }
      }
      this.updateHovers(); // update again
    }
    this.mousePanelDowns = [];
  };


  cScreen.prototype.onMouseDownEvent = function(aEvent) {
    var lTimeMs = new Date().getTime();
    if ((lTimeMs - this.lastTouchUpTimeMs) > 300) {
      this.onMouseDown(aEvent);
    }
  };

  cScreen.prototype.onMouseMoveEvent = function(aEvent) {
    this.onMouseMove(aEvent);
  };

  cScreen.prototype.onMouseUpEvent = function(aEvent) {
    this.onMouseUp(aEvent);
  };

  cScreen.prototype.onTouchDownEvent = function(aEvent) {
    if (aEvent.changedTouches) {
      this.onMouseDown(aEvent.changedTouches[0]);
    } else {
      this.onMouseDown(aEvent.touches[0]);
    }
    if (aEvent.touches) {
      if (aEvent.touches[0].target.tagName.toLowerCase() == "textarea") {
        if (aEvent.stopPropagation) {
          aEvent.stopPropagation();
        }
      } else {
        // We need to do this, otherwise we do not get enough move events!! Bug in Chrome.
        // The down side is that we cannot get a keyboard to show up when touched.
        if (aEvent.preventDefault) {
          aEvent.preventDefault();
        }
      }
    } else {
      if (aEvent.preventDefault) {
        aEvent.preventDefault();
      }
    }
  };
  cScreen.prototype.onTouchMoveEvent = function(aEvent) {
    if (aEvent.changedTouches) {
      this.onMouseMove(aEvent.changedTouches[0]);
    } else {
      this.onMouseMove(aEvent.touches[0]);
    }
  };
  cScreen.prototype.onTouchUpEvent = function(aEvent) {
    this.lastTouchUpTimeMs = new Date().getTime();
    this.onMouseUp();
    this.clearHovers();
  };

  cScreen.prototype.onTouchCancelEvent = function(aEvent) {
    this.lastTouchUpTimeMs = new Date().getTime();
  };

  cScreen.prototype.onScroll = function(aEvent) {
    // do not prevent default
    //if (aEvent.preventDefault) {
    //  aEvent.preventDefault();
    //}
    //aEvent.returnValue = false;     
    var lDelta = 0;
    if (!aEvent) { /* For IE. */
      aEvent = window.event;
    }
    if (aEvent.wheelDelta) { /* IE/Opera. */
      lDelta = aEvent.wheelDelta / 120;
    } else if (aEvent.detail) { // Mozilla
      lDelta = -aEvent.detail / 3;
    }
    this.updateHovers();
    if (lDelta) {
      for (var lpi = (this.mousePanelHovers.length - 1); lpi >= 0; lpi--) {
        if (this.mousePanelHovers[lpi].panel.onScroll) {
          this.mousePanelHovers[lpi].panel.onScroll(lDelta, this.app, this);
        }
      }
      if (this.app.onScroll) {
        this.app.onScroll.apply(this.app, [lDelta]);
      }
    }
    /** Prevent default actions caused by mouse wheel.
     * That might be ugly, but we handle scrolls somehow
     * anyway, so don't bother here..
     */
  };

  cScreen.prototype.onMouseOutDocument = function(aEvent) {
    var lpos = cDOM.getMouseElementCoordinates(aEvent, this.screenContainer);
    if ((lpos.x != 0) || (lpos.y != 0)) {
      if ((lpos.x < 0) || (lpos.y < 0) || (lpos.x > this.screenContainer.width) || (lpos.y > this.screenContainer.height)) {
        this.mouseX = lpos.x;
        this.mouseY = lpos.y;
        this.clearHovers();
      }
    }
  };
  
})();

