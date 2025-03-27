var cDOM = {
  getElement: function(id) {
    return document.getElementById(id);
  },
  registerEvent: function(aElement, aEventName, aFunction, aScope) {
    var lScopedEventHandler = aScope ? function(aEvent) {
      aEvent = aEvent || window.event;
      aFunction.apply(aScope, [aEvent]); 
    } : aFunction;
    if (aElement.addEventListener) {
      aElement.addEventListener(aEventName, lScopedEventHandler, false);
    } else if (aElement.attachEvent) {
      aElement.attachEvent('on' + aEventName, lScopedEventHandler);
    } else {
      aElement['on' + aEventName] = lScopedEventHandler;
    }
  },
  getMouseScreenCoordinates: function(aEvent) {
    var lCoordinates = {x: 0, y: 0};
    if (aEvent.pageX || aEvent.pageX === 0) { // Firefox
      lCoordinates.x = aEvent.pageX - document.body.scrollLeft;
      lCoordinates.y = aEvent.pageY - document.body.scrollTop;
    } else if (aEvent.clientX || aEvent.clientY)     {
      lCoordinates.x = aEvent.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
      lCoordinates.y = aEvent.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    } else if (aEvent.offsetX || aEvent.offsetX === 0) { // Opera
      lCoordinates.x = aEvent.offsetX;
      lCoordinates.y = aEvent.offsetY;
    }
    return lCoordinates;
  },
  getElementCoordinates: function(aElement) {
    var lCoordinates = {x: 0, y: 0};
    var el = aElement;
    while ((el) && (!isNaN(el.offsetLeft)) && (!isNaN(el.offsetTop))) {
      lCoordinates.x += el.offsetLeft - el.scrollLeft;
      lCoordinates.y += el.offsetTop - el.scrollTop;
      el = el.offsetParent;
    }
    return lCoordinates;  
  },
  getMouseElementCoordinates: function(aEvent, aElement) {
    var lCoordinates = this.getMouseScreenCoordinates(aEvent);
    var lOffset = this.getElementCoordinates(aElement);
    lCoordinates.x -= lOffset.x;
    lCoordinates.y -= lOffset.y;
    return lCoordinates;  
  },
  getClientWidth: function() {
    var lRes = 800;
    if (self.innerWidth) {
      lRes = self.innerWidth;
    } else if (document.documentElement && document.documentElement.clientWidth) {
      lRes = document.documentElement.clientWidth;
    } else if (document.body && document.body.clientWidth) {
      lRes = document.body.clientWidth;
    }
    return lRes;
  },
  getClientHeight: function() {
    var lRes = 600;
    if (self.innerHeight) {
      lRes = self.innerHeight;
    } else if (document.documentElement && document.documentElement.clientHeight) {
      lRes = document.documentElement.clientHeight;
    } else if (document.body && document.body.clientHeight) {
      lRes = document.body.clientHeight;
    }
    return lRes;
  },
  escapeDoubleQuotedInputValue: function(aValue) {
    return aValue.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
  }
};
if (typeof Object.create !== 'function') {
  (function () {
    var F = function () {};
    Object.create = function (o) {
      if (arguments.length > 1) {
        throw 'Second argument not supported';
      }
      if (o === null) {
        F.prototype = Object.prototype;
      } else {
        if (typeof o !== 'object') {
          throw 'Argument must be an object';
        }
        F.prototype = o;
      }
      return new F();
    };
  })();
}
if (typeof Function.deriveFrom !== 'function') {
  Function.prototype.deriveFrom = function (aBaseConstructor) {
    this.prototype = Object.create(aBaseConstructor.prototype);
  };
}
if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function(obj, start) {
    for (var i = (start || 0), j = this.length; i < j; i++) {
      if (this[i] === obj) {
        return i;
      }
    }
    return -1;
  };
}
if (!String.prototype.trim) {
  String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g,'');
  }
}
var cLib = {
  deepCopy: function(aObject) {
    if ((aObject == null) || (typeof(aObject) !== 'object')) {
      return aObject;
    }
    var lClone = Object.create(aObject.constructor.prototype);
    for (var lKey in aObject){
      lClone[lKey] = this.deepCopy(aObject[lKey]);
    }
    return lClone;
  },
  trunc: function(aValue) {
    return aValue | 0; // a neat alternative to truncating a number with parseInt().
  },
  animate: function(aStartValue, aEndValue, aCompleteDurationMs, aAnimateFunc, aCompletionFunc, aScope) {
    if (aCompleteDurationMs) {
      var lStartDate = new Date();
      var lStartTimeMs = lStartDate.getTime();  
      function doAnimate() {
        var lDate = new Date();
        var lTimeMs = lDate.getTime();
        lCompletionFactor = (lTimeMs - lStartTimeMs) / aCompleteDurationMs;
        if (lCompletionFactor < 1.0) {
          var lValue = aStartValue + (lCompletionFactor * (aEndValue - aStartValue));
          aAnimateFunc.apply(aScope, [lValue]);
          setTimeout(doAnimate, 10);
        } else {
          if (aCompletionFunc) {
            aCompletionFunc.apply(aScope, [aEndValue]);
          }
        }
      }
      setTimeout(doAnimate, 10);
    }
  },
  animate2d: function(aStartValueX, aStartValueY,
                      aEndValueX, aEndValueY,  
                      aCompleteDuration, aAnimateFunc, aCompletionFunc, aScope) {
    if (aCompleteDuration) {
      var lStartDate = new Date();
      var lStartTimeMs = lStartDate.getTime();  
      function doAnimate() {
        var lDate = new Date();
        var lTimeMs = lDate.getTime();
        lCompletionFactor = (lTimeMs - lStartTimeMs) / aCompleteDuration;
        if (lCompletionFactor < 1.0) {
          var lValueX = aStartValueX + (lCompletionFactor * (aEndValueX - aStartValueX));
          var lValueY = aStartValueY + (lCompletionFactor * (aEndValueY - aStartValueY));
          aAnimateFunc.apply(aScope, [lValueX, lValueY]);
          setTimeout(doAnimate, 10);
        } else {
          if (aCompletionFunc) {
            aCompletionFunc.apply(aScope, [aEndValueX, aEndValueY]);
          }
        }
      }
      setTimeout(doAnimate, 10);
    }
  },
  textToHTML: function(aText) {
    return new String(aText)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
  },
  textToJSONString: function(aText) {
    return new String(aText)
            .replace(/\\/g, '\\\\')
            .replace(/\n/g, '\\n')
            .replace(/"/g, '\\"');
  }
};
var cConfig = {
  version: '1.0.1',
  options: {}
};
var cDebug = {
  debug: false,
  tag: '',
  log: function(aTag, aMsg) {
    if ((this.debug) && ((this.tag === '') || (this.tag === aTag))) {
      if (typeof console != "undefined") {
        console.log(aMsg);
      }
    }
  }
};
/**
  * Class cBase
  */
function cBase() {
}
cBase.deriveFrom(Object);
(function() {})();
var eAlign = {
  eNone: 0,
  eClient: 1,
  eTop: 2,
  eBottom: 3,
  eLeft: 4,
  eRight: 5,
  eCenter: 6,
  eCenterVertical: 7,
  eCenterHorizontal: 8,
  eWidth: 9,
  eHeight: 10
};
var eTextAlign = {
  eLeft: 0,
  eRight: 1,
  eCenter: 2
};
/*
  * Class cPanel
  */
function cPanel(aProperties) {
  cBase.call(this, aProperties);
  this.id = aProperties ? (aProperties.id ? aProperties.id : 0) : 0;
  cPanel.largestInnerId++;
  this.innerId = cPanel.largestInnerId;
  this.instanceId = aProperties ? (aProperties.instanceId ? aProperties.instanceId : 0) : 0;
  this.className = aProperties ? (aProperties.className ? aProperties.className : '') : '';
  this.element = null;
  this.visible = aProperties ? (typeof aProperties.visible != 'undefined' ? aProperties.visible : true) : true;
  this.shape = aProperties ? (typeof aProperties.shape != 'undefined' ? aProperties.shape : cPanel.cShapeRectangle) : cPanel.cShapeRectangle;
  if ((this.shape != cPanel.cShapeRectangle) &&  
      (this.shape != cPanel.cShapeRoundRect) && (this.shape != cPanel.cShapeCircleRect)) {
    this.shape = cPanel.cShapeRectangle;
  }
  this.align = aProperties ? (aProperties.align ? aProperties.align : eAlign.eNone) : eAlign.eNone;
  this.left = aProperties ? (aProperties.left ? aProperties.left : 0) : 0;
  this.top = aProperties ? (aProperties.top ? aProperties.top : 0) : 0;
  this.width = aProperties ? (aProperties.width ? aProperties.width : 0) : 0;
  this.height = aProperties ? (aProperties.height ? aProperties.height : 0) : 0;
  this.marginLeft = aProperties ? (aProperties.margin ? aProperties.margin : 0) : 0;
  this.marginTop = aProperties ? (aProperties.margin ? aProperties.margin : 0) : 0;
  this.marginRight = aProperties ? (aProperties.margin ? aProperties.margin : 0) : 0;
  this.marginBottom = aProperties ? (aProperties.margin ? aProperties.margin : 0) : 0;
  this.borderLeft = aProperties ? (aProperties.border ? aProperties.border : 0) : 0;
  this.borderTop = aProperties ? (aProperties.border ? aProperties.border : 0) : 0;
  this.borderRight = aProperties ? (aProperties.border ? aProperties.border : 0) : 0;
  this.borderBottom = aProperties ? (aProperties.border ? aProperties.border : 0) : 0;
  this.paddingLeft = aProperties ? (aProperties.padding ? aProperties.padding : 0) : 0;
  this.paddingTop = aProperties ? (aProperties.padding ? aProperties.padding : 0) : 0;
  this.paddingRight = aProperties ? (aProperties.padding ? aProperties.padding : 0) : 0;
  this.paddingBottom = aProperties ? (aProperties.padding ? aProperties.padding : 0) : 0;
  this.marginLeft = aProperties ? (aProperties.marginLeft ? aProperties.marginLeft : this.marginLeft) : this.marginLeft;
  this.marginTop = aProperties ? (aProperties.marginTop ? aProperties.marginTop : this.marginTop) : this.marginTop;
  this.marginRight = aProperties ? (aProperties.marginRight ? aProperties.marginRight : this.marginRight) : this.marginRight;
  this.marginBottom = aProperties ? (aProperties.marginBottom ? aProperties.marginBottom : this.marginBottom) : this.marginBottom;
  this.borderLeft = aProperties ? (aProperties.borderLeft ? aProperties.borderLeft : this.borderLeft) : this.borderLeft;
  this.borderTop = aProperties ? (aProperties.borderTop ? aProperties.borderTop : this.borderTop) : this.borderTop;
  this.borderRight = aProperties ? (aProperties.borderRight ? aProperties.borderRight : this.borderRight) : this.borderRight;
  this.borderBottom = aProperties ? (aProperties.borderBottom ? aProperties.borderBottom : this.borderBottom) : this.borderBottom;
  this.paddingLeft = aProperties ? (aProperties.paddingLeft ? aProperties.paddingLeft : this.paddingLeft) : this.paddingLeft;
  this.paddingTop = aProperties ? (aProperties.paddingTop ? aProperties.paddingTop : this.paddingTop) : this.paddingTop;
  this.paddingRight = aProperties ? (aProperties.paddingRight ? aProperties.paddingRight : this.paddingRight) : this.paddingRight;
  this.paddingBottom = aProperties ? (aProperties.paddingBottom ? aProperties.paddingBottom : this.paddingBottom) : this.paddingBottom;
  this.backgroundColor = aProperties ? (aProperties.backgroundColor ? aProperties.backgroundColor : '#ffffff') : '#ffffff';
  this.borderColor = aProperties ? (aProperties.borderColor ? aProperties.borderColor : '#000000') : '#000000';
  this.borderRadius = aProperties ? (aProperties.borderRadius ? aProperties.borderRadius : 20) : 20;
  this.color = aProperties ? (aProperties.color ? aProperties.color : '') : '';
  this.fontSize = aProperties ? (aProperties.fontSize ? aProperties.fontSize : 0) : 0;
  this.fontBold = aProperties ? (aProperties.fontBold ? aProperties.fontBold : false) : false;
  this.noWrap = aProperties ? (aProperties.noWrap ? aProperties.noWrap : false) : false;
  this.textAlign = aProperties ? (aProperties.textAlign ? aProperties.textAlign : eTextAlign.eLeft) : eTextAlign.eLeft;
  this.textSelectable = aProperties ? (aProperties.textSelectable ? aProperties.textSelectable : false) : false;
  this.innerHTML = aProperties ? (aProperties.innerHTML ? aProperties.innerHTML : '') : '';
  this.image = aProperties ? (typeof aProperties.image != 'undefined' ? aProperties.image : null) : null;
  this.imageSrc = aProperties ? (aProperties.imageSrc ? aProperties.imageSrc : '') : '';
  this.imageRepeat = aProperties ? (typeof aProperties.imageRepeat != 'undefined' ? aProperties.imageRepeat : cPanel.cImageNoRepeat) : cPanel.cImageNoRepeat;
  this.imageCentered = aProperties ? (typeof aProperties.imageCentered != 'undefined' ? aProperties.imageCentered : false) : false;
  this.imageStretch = aProperties ? (typeof aProperties.imageStretch != 'undefined' ? aProperties.imageStretch : false) : false;
  this.imageStretchWidth = aProperties ? (typeof aProperties.imageStretchWidth != 'undefined' ? aProperties.imageStretchWidth : 0) : 0;
  this.imageStretchHeight = aProperties ? (typeof aProperties.imageStretchHeight != 'undefined' ? aProperties.imageStretchHeight : 0) : 0;
  this.imageOffsetLeft = aProperties ? (typeof aProperties.imageOffsetLeft != 'undefined' ? aProperties.imageOffsetLeft : 0) : 0;
  this.imageOffsetTop = aProperties ? (typeof aProperties.imageOffsetTop != 'undefined' ? aProperties.imageOffsetTop : 0) : 0;
  this.transparencyPercentage = aProperties ? (aProperties.transparencyPercentage ? aProperties.transparencyPercentage : 0) : 0;
  this.mouseWithin = false;
  this.invisibleToMouseEvents = aProperties ? (aProperties.invisibleToMouseEvents ? aProperties.invisibleToMouseEvents : false) : false;
  this.stopBubble = false;
  this.onMouseEnter = aProperties ? (aProperties.onMouseEnter ? aProperties.onMouseEnter : this.onMouseEnter) : this.onMouseEnter;
  this.onMouseExit = aProperties ? (aProperties.onMouseExit ? aProperties.onMouseExit : this.onMouseExit) : this.onMouseExit;
  this.onMouseDown = aProperties ? (aProperties.onMouseDown ? aProperties.onMouseDown : this.onMouseDown) : this.onMouseDown;
  this.onMouseMove = aProperties ? (aProperties.onMouseMove ? aProperties.onMouseMove : this.onMouseMove) : this.onMouseMove;
  this.onMouseUp = aProperties ? (aProperties.onMouseUp ? aProperties.onMouseUp : this.onMouseUp) : this.onMouseUp;
  this.cursor = aProperties ? (aProperties.cursor ? aProperties.cursor : this.cursor) : this.cursor;
  this.onClick = aProperties ? (aProperties.onClick ? aProperties.onClick : this.onClick) : this.onClick;
  this.onScroll = aProperties ? (aProperties.onScroll ? aProperties.onScroll : this.onScroll) : this.onScroll;
  this.onDragStart = aProperties ? (aProperties.onDragStart ? aProperties.onDragStart : this.onDragStart) : this.onDragStart;
  this.onDrag = aProperties ? (aProperties.onDrag ? aProperties.onDrag : this.onDrag) : this.onDrag;
  this.onDragEnd = aProperties ? (aProperties.onDragEnd ? aProperties.onDragEnd : this.onDragEnd) : this.onDragEnd;
  this.onDragReceive = aProperties ? (aProperties.onDragReceive ? aProperties.onDragReceive : this.onDragReceive) : this.onDragReceive;
  this.onTap = aProperties ? (aProperties.onTap ? aProperties.onTap : this.onTap) : this.onTap;
  this.onRender = aProperties ? (aProperties.onRender ? aProperties.onRender : this.onRender) : this.onRender;
  this.onRenderThis = aProperties ? (aProperties.onRenderThis ? aProperties.onRenderThis : this.onRenderThis) : this.onRenderThis;
  this.properties = aProperties ? (typeof aProperties.properties != 'undefined' ? aProperties.properties : {}) : {};
  this.parentPanel = null;
  this.panels = [];
}
cPanel.deriveFrom(cBase);
(function() {
  cPanel.cShapeRectangle = 1;
  cPanel.cShapeRoundRect = 2;
  cPanel.cShapeCircleRect = 3;
  cPanel.cImageNoRepeat = 1;
  cPanel.cImageRepeat = 2;
  cPanel.cImageRepeatX = 3;
  cPanel.cImageRepeatY = 4;
  cPanel.largestInnerId = 0;
  cPanel.prototype.id = 0;
  cPanel.prototype.instanceId = 0;
  cPanel.prototype.innerId = 0;
  cPanel.prototype.className = '';
  cPanel.prototype.element = null;
  cPanel.prototype.visible = true;
  cPanel.prototype.shape = cPanel.cShapeRectangle;
  cPanel.prototype.borderRadius = 20;
  cPanel.prototype.align = eAlign.eNone;
  cPanel.prototype.left = 0;
  cPanel.prototype.top = 0;
  cPanel.prototype.width = 0;
  cPanel.prototype.height = 0;
  cPanel.prototype.marginLeft = 0;
  cPanel.prototype.marginTop = 0;
  cPanel.prototype.marginRight = 0;
  cPanel.prototype.marginBottom = 0;
  cPanel.prototype.borderLeft = 0;
  cPanel.prototype.borderTop = 0;
  cPanel.prototype.borderRight = 0;
  cPanel.prototype.borderBottom = 0;
  cPanel.prototype.paddingLeft = 0;
  cPanel.prototype.paddingTop = 0;
  cPanel.prototype.paddingRight = 0;
  cPanel.prototype.paddingBottom = 0;
  cPanel.prototype.backgroundColor = '#ffffff';
  cPanel.prototype.borderColor = '#000000';
  cPanel.prototype.color = '';
  cPanel.prototype.fontSize = 0;
  cPanel.prototype.fontBold = false;
  cPanel.prototype.noWrap = false;
  cPanel.prototype.textAlign = eTextAlign.eLeft;
  cPanel.prototype.textSelectable = false
  cPanel.prototype.innerHTML = '';
  cPanel.prototype.image = null;
  cPanel.prototype.imageSrc = '';
  cPanel.prototype.imageRepeat = cPanel.cImageNoRepeat;
  cPanel.prototype.imageCentered = false;
  cPanel.prototype.imageStretch = false;
  cPanel.prototype.imageStretchWidth = 0;
  cPanel.prototype.imageStretchHeight = 0;
  cPanel.prototype.imageOffsetLeft = 0;
  cPanel.prototype.imageOffsetTop = 0;
  cPanel.prototype.transparencyPercentage = 0;
  cPanel.prototype.mouseWithin = false;
  cPanel.prototype.invisibleToMouseEvents = false;
  cPanel.prototype.stopBubble = false;
  cPanel.prototype.onMouseEnter = null;
  cPanel.prototype.onMouseExit = null;
  cPanel.prototype.onMouseDown = null;
  cPanel.prototype.onMouseMove = null;
  cPanel.prototype.onMouseUp = null;
  cPanel.prototype.cursor = null;
  cPanel.prototype.onClick = null;
  cPanel.prototype.onScroll = null;
  cPanel.prototype.onDragStart = null;
  cPanel.prototype.onDrag = null;
  cPanel.prototype.onDragEnd = null;
  cPanel.prototype.onDragReceive = null;
  cPanel.prototype.onTap = null;
  cPanel.prototype.onRender = null;
  cPanel.prototype.onRenderThis = null;
  cPanel.prototype.properties = {}; // additional properties
  cPanel.prototype.parentPanel = null;
  cPanel.prototype.panels = [];
  cPanel.prototype.getInnerWidth = function() {
    return this.width - 
      (this.marginLeft + this.borderLeft + this.paddingLeft + 
       this.paddingRight + this.borderRight + this.marginRight);
  };
  cPanel.prototype.getInnerHeight = function() {
    return this.height - 
      (this.marginTop + this.borderTop + this.paddingTop + 
       this.paddingBottom + this.borderBottom + this.marginBottom);
  };
  cPanel.prototype.recursiveHitTest = function(aX, aY, aHits) {
    var lResult = false;
    if (this.visible && (!this.invisibleToMouseEvents)) {
      var lInnerX = aX - this.left;
      var lInnerY = aY - this.top;
      if ((lInnerX >= this.marginLeft) && (lInnerX <= (this.width - this.marginRight)) &&
          (lInnerY >= this.marginTop) && (lInnerY <= (this.height - this.marginBottom))) {
        var lWithinBorder = true;
        if (this.shape == cPanel.cShapeRoundRect) {
        } else if (this.shape == cPanel.cShapeCircleRect) {
        }
        if (lWithinBorder) {
          lResult = true;
          aHits.push({
            panel: this,
            innerX: lInnerX,
            innerY: lInnerY
          });
          var lInnerInnerX = lInnerX - (this.marginLeft + this.borderLeft + this.paddingLeft);
          var lInnerInnerY = lInnerY - (this.marginTop + this.borderTop + this.paddingTop);
          for (var lpi = (this.panels.length - 1); lpi >= 0; lpi--) {
            if (this.panels[lpi].recursiveHitTest(lInnerInnerX, lInnerInnerY, aHits)) {
              break;
            }
          }
        }
      }
    }
    return lResult;
  };
  cPanel.prototype.render = function(aParentPanel, aParentElement, aClientRect) {
    this.parentPanel = aParentPanel;
    if (this.element == null) {
      if (aParentElement != null) {
        this.element = document.createElement('DIV');
        this.element.id = 'pnl_' + this.instanceId + '_' + this.innerId;
        if (this.className != '') {
          this.element.className = this.className;
        }
        aParentElement.appendChild(this.element);
      }
    }
    if (this.element != null) {
      this.element.style.display = this.visible ? 'block' : 'none';
      if (this.align == eAlign.eClient) {
        this.left = aClientRect.left;
        this.top = aClientRect.top;
        this.width = aClientRect.width;
        this.height = aClientRect.height;
      } else if (this.align == eAlign.eTop) {
        this.left = aClientRect.left;
        this.top = aClientRect.top;
        this.width = aClientRect.width;
        aClientRect.top = aClientRect.top + this.height;
        aClientRect.height = aClientRect.height - this.height;
        if (aClientRect.height < 0) {
          aClientRect.height = 0;
        }
      } else if (this.align == eAlign.eBottom) {
        this.left = aClientRect.left;
        this.top = (aClientRect.top + aClientRect.height) - this.height;
        this.width = aClientRect.width;
        aClientRect.height = aClientRect.height - this.height;
        if (aClientRect.height < 0) {
          aClientRect.height = 0;
        }
      } else if (this.align == eAlign.eLeft) {
        this.left = aClientRect.left;
        this.top = aClientRect.top;
        this.height = aClientRect.height;
        aClientRect.left = aClientRect.left + this.width;
        aClientRect.width = aClientRect.width - this.width;
        if (aClientRect.width < 0) {
          aClientRect.width = 0;
        }
      } else if (this.align == eAlign.eRight) {
        this.left = (aClientRect.left + aClientRect.width) - this.width;
        this.top = aClientRect.top;
        this.height = aClientRect.height;
        aClientRect.width = aClientRect.width - this.width;
        if (aClientRect.width < 0) {
          aClientRect.width = 0;
        }
      } else if (this.align == eAlign.eCenter) {
        this.left = ((aClientRect.width - this.width) / 2) | 0;
        this.top = ((aClientRect.height - this.height) / 2) | 0;
      } else if (this.align == eAlign.eCenterVertical) {
        this.left = ((aClientRect.width - this.width) / 2) | 0;
        this.top = 0;
        this.height = aClientRect.height;
      } else if (this.align == eAlign.eCenterHorizontal) {
        this.left = 0;
        this.top = ((aClientRect.height - this.height) / 2) | 0;
        this.width = aClientRect.width;
      } else if (this.align == eAlign.eWidth) {
        this.left = aClientRect.left;
        this.width = aClientRect.width;
      } else if (this.align == eAlign.eHeight) {
        this.top = aClientRect.top;
        this.height = aClientRect.height;
      }
      if ((this.parentPanel) && (this.parentPanel.paddingLeft)) {
        this.element.style.left = (this.left + this.parentPanel.paddingLeft) + 'px';
      } else {
        this.element.style.left = this.left + 'px';
      }
      if ((this.parentPanel) && (this.parentPanel.paddingTop)) {
        this.element.style.top = (this.top + this.parentPanel.paddingTop) + 'px';
      } else {
        this.element.style.top = this.top + 'px';
      }
      var lWidth = this.getInnerWidth();
      var lHeight = this.getInnerHeight();
      if (lWidth <= 0) {
        lWidth = 1;
      }
      if (lHeight <= 0) {
        lHeight = 1;
      }
      this.element.style.width = lWidth + 'px';
      this.element.style.height = lHeight + 'px';
      if ((this.marginLeft > 0) || (this.marginTop > 0) || (this.marginRight > 0) || (this.marginBottom > 0)) {
        if ((this.marginLeft == this.marginTop) && (this.marginTop == this.marginRight) && (this.marginRight == this.marginBottom)) {
          this.element.style.margin = this.marginLeft + 'px';
        } else {
          if (this.marginLeft > 0) {
            this.element.style.marginLeft = this.marginLeft + 'px';
          }
          if (this.marginTop > 0) {
            this.element.style.marginTop = this.marginTop + 'px';
          }
          if (this.marginRight > 0) {
            this.element.style.marginRight = this.marginRight + 'px';
          }
          if (this.marginBottom > 0) {
            this.element.style.marginBottom = this.marginBottom + 'px';
          }
        }
      }
      if ((this.borderLeft > 0) || (this.borderTop > 0) || (this.borderRight > 0) || (this.borderBottom > 0)) {
        this.element.style.borderStyle = 'solid';
        if ((this.borderLeft == this.borderTop) && (this.borderTop == this.borderRight) && (this.borderRight == this.borderBottom)) {
          this.element.style.borderWidth = this.borderLeft + 'px';
        } else {
          if (this.borderLeft > 0) {
            this.element.style.borderLeftWidth = this.borderLeft + 'px';
          }
          if (this.borderTop > 0) {
            this.element.style.borderTopWidth = this.borderTop + 'px';
          }
          if (this.borderRight > 0) {
            this.element.style.borderRightWidth = this.borderRight + 'px';
          }
          if (this.borderBottom > 0) {
            this.element.style.borderBottomWidth = this.borderBottom + 'px';
          }
        }
        if (this.borderColor != '') {
          this.element.style.borderColor = this.borderColor;
        }
      }
      if ((this.paddingLeft > 0) || (this.paddingTop > 0) || (this.paddingRight > 0) || (this.paddingBottom > 0)) {
        if ((this.paddingLeft == this.paddingTop) && (this.paddingTop == this.paddingRight) && (this.paddingRight == this.paddingBottom)) {
          this.element.style.padding = this.paddingLeft + 'px';
        } else {
          if (this.paddingLeft > 0) {
            this.element.style.paddingLeft = this.paddingLeft + 'px';
          }
          if (this.paddingTop > 0) {
            this.element.style.paddingTop = this.paddingTop + 'px';
          }
          if (this.paddingRight > 0) {
            this.element.style.paddingRight = this.paddingRight + 'px';
          }
          if (this.paddingBottom > 0) {
            this.element.style.paddingBottom = this.paddingBottom + 'px';
          }
        }
      }
      if (this.backgroundColor != '') {
        this.element.style.backgroundColor = this.backgroundColor;
      }
      if (this.shape == cPanel.cShapeRoundRect) {
        this.element.style.borderRadius = this.borderRadius + 'px';
        this.element.style.MozBorderRadius = this.borderRadius + 'px';
        this.element.style.webkitBorderRadius = this.borderRadius + 'px';
      } else if (this.shape == cPanel.cShapeCircleRect) {
        if (this.width >= this.height) {
          this.element.style.borderRadius = this.height + 'px';
          this.element.style.MozBorderRadius = this.height + 'px';
          this.element.style.webkitBorderRadius = this.height + 'px';
        } else {
          this.element.style.borderRadius = this.width + 'px';
          this.element.style.MozBorderRadius = this.width + 'px';
          this.element.style.webkitBorderRadius = this.width + 'px';
        }
      } else {
      }
      if (this.color != '') {
        this.element.style.color = this.color;
      }
      if (this.fontSize > 0) {
        this.element.style.fontSize = this.fontSize + 'px';
      }
      if (this.fontBold) {
        this.element.style.fontWeight = 'bold';
      }
      if (this.noWrap) {
        this.element.style.whiteSpace = 'nowrap';
      } else {
      }
      if (this.textSelectable) {
        this.element.style.userSelect = "text";
        this.element.style.webkitUserSelect = "text";
        this.element.style.MozUserSelect = "text";
      }
      if (this.textAlign == eTextAlign.eLeft) {
      } else if (this.textAlign == eTextAlign.eRight) {
        this.element.style.textAlign = 'right';
      } else if (this.textAlign == eTextAlign.eCenter) {
        this.element.style.textAlign = 'center';
      }
      if (this.cursor) {
        this.element.style.cursor = this.cursor;
      } else if (this.onClick) {
        this.element.style.cursor = 'pointer';
      } else {
        this.element.style.cursor = 'inherit';
      }
      if ((this.innerHTML != '') && (this.panels.length == 0)) {
        this.element.innerHTML = this.innerHTML;
      }
      if ((this.image != null) || (this.imageSrc != '')) {
        if (this.imageStretch) {
          if (this.elementImage == null) {
            if (this.image != null) {
              this.elementImage = this.image;
            } else {
              this.elementImage = new Image();
            }
            this.elementImage.id = 'pnlimg_' + this.instanceId + '_' + this.innerId;
            this.element.appendChild(this.elementImage);
          }
          if (this.image == null) {
            this.elementImage.src = this.imageSrc;
          }
          this.elementImage.width = lWidth;
          this.elementImage.height = lHeight;
        } else if ((this.imageStretchWidth > 0) || (this.imageStretchHeight > 0)) {
          if (this.elementImage == null) {
            if (this.image != null) {
              this.elementImage = this.image;
            } else {
              this.elementImage = new Image();
            }
            this.elementImage.id = 'pnlimg_' + this.instanceId + '_' + this.innerId;
            this.element.appendChild(this.elementImage);
          }
          if (this.image == null) {
            this.elementImage.src = this.imageSrc;
          }
          if (this.imageStretchWidth > 0) {
            this.elementImage.width = this.imageStretchWidth;
          }
          if (this.imageStretchHeight > 0) {
            this.elementImage.height = this.imageStretchHeight;
          }
          if ((this.imageOffsetLeft != 0) || (this.imageOffsetTop != 0)) {
            this.elementImage.style.position = 'absolute';
            this.elementImage.style.left = this.imageOffsetLeft + 'px';
            this.elementImage.style.top = this.imageOffsetTop + 'px';
          }
        } else {
          if (this.image != null) {
            this.element.style.backgroundImage = 'url("' + this.image.src + '")';
          } else {
            this.element.style.backgroundImage = 'url("' + this.imageSrc + '")';
          }
          if (this.imageRepeat == cPanel.cImageNoRepeat) {
            this.element.style.backgroundRepeat = 'no-repeat';
          } else if (this.imageRepeat == cPanel.cImageRepeat) {
            this.element.style.backgroundRepeat = 'repeat';
          } else if (this.imageRepeat == cPanel.cImageRepeatX) {
            this.element.style.backgroundRepeat = 'repeat-x';
          } else if (this.imageRepeat == cPanel.cImageRepeatY) {
            this.element.style.backgroundRepeat = 'repeat-y';
          } else {
            this.element.style.backgroundRepeat = 'no-repeat';
          }
          if ((this.imageOffsetLeft != 0) || (this.imageOffsetTop != 0)) {
            this.element.style.backgroundPosition = this.imageOffsetLeft + 'px' + ' ' + this.imageOffsetTop + 'px';
          } else if (this.imageCentered) {
            this.element.style.backgroundPosition = 'center';
          }
        }
      }
      if ((this.transparencyPercentage > 0) && (this.transparencyPercentage <= 100)) {
        var lOpacityPercentage = 100 - this.transparencyPercentage;
        var lOpacityNormal = lOpacityPercentage / 100;
        this.element.style.opacity = lOpacityNormal;
        this.element.style.filter = 'alpha(opacity=' + lOpacityPercentage + ')';
      }
      var lInnerRect = {
        left: 0,
        top: 0,
        width: this.getInnerWidth(),
        height: this.getInnerHeight()
      };
      for (var lpi = 0; lpi < this.panels.length; lpi++) {
        this.panels[lpi].instanceId = this.instanceId;
        this.panels[lpi].render(this, this.element, lInnerRect);
      }
    }
    if (this.onRender) {
      if (this.onRenderThis) {
        this.onRender.call(this.onRenderThis);
      } else {
        this.onRender();
      }
    }
    return this.element;
  }
  cPanel.prototype.rerender = function() {
    this.render(
      this.parentPanel,
      null,
      {
        left: this.left,
        top: this.top,
        width: this.width,
        height: this.height
      }
    );
  }
  cPanel.prototype.show = function() {
    this.visible = true;
    if (this.element != null) {
      this.element.style.display = this.visible ? 'block' : 'none';
    }
  };
  cPanel.prototype.hide = function() {
    this.visible = false;
    if (this.element != null) {
      this.element.style.display = this.visible ? 'block' : 'none';
    }
  };
  cPanel.prototype.setAlign = function(aAlign) {
    if (this.align != aAlign) {
      this.align = aAlign;
      if (this.parentPanel != null) {
        this.parentPanel.rerender();
      } else {
        this.rerender();
      }
    }
  };
  cPanel.prototype.setLeft = function(aLeft) {
    if (this.left != aLeft) {
      this.left = aLeft;
      if ((this.align != eAlign.eNone) && (this.parentPanel != null)) {
        this.parentPanel.rerender();
      } else {
        this.rerender();
      }
    }
  };
  cPanel.prototype.setTop = function(aTop) {
    if (this.top != aTop) {
      this.top = aTop;
      if ((this.align != eAlign.eNone) && (this.parentPanel != null)) {
        this.parentPanel.rerender();
      } else {
        this.rerender();
      }
    }
  };
  cPanel.prototype.setWidth = function(aWidth) {
    if (this.width != aWidth) {
      this.width = aWidth;
      if ((this.align != eAlign.eNone) && (this.parentPanel != null)) {
        this.parentPanel.rerender();
      } else {
        this.rerender();
      }
    }
  };
  cPanel.prototype.setHeight = function(aHeight) {
    if (this.height != aHeight) {
      this.height = aHeight;
      if ((this.align != eAlign.eNone) && (this.parentPanel != null)) {
        this.parentPanel.rerender();
      } else {
        this.rerender();
      }
    }
  };
  cPanel.prototype.setShape = function(aShape) {
    if (this.shape != aShape) {
      this.shape = aShape;
      if (this.element != null) {
        if (this.shape == cPanel.cShapeRoundRect) {
          this.element.style.borderRadius = this.borderRadius + 'px';
          this.element.style.MozBorderRadius = this.borderRadius + 'px';
          this.element.style.webkitBorderRadius = this.borderRadius + 'px';
        } else if (this.shape == cPanel.cShapeCircleRect) {
          if (this.width >= this.height) {
            this.element.style.borderRadius = this.height + 'px';
            this.element.style.MozBorderRadius = this.height + 'px';
            this.element.style.webkitBorderRadius = this.height + 'px';
          } else {
            this.element.style.borderRadius = this.width + 'px';
            this.element.style.MozBorderRadius = this.width + 'px';
            this.element.style.webkitBorderRadius = this.width + 'px';
          }
        } else {
          this.element.style.borderRadius = '0px';
          this.element.style.MozBorderRadius = '0px';
          this.element.style.webkitBorderRadius = '0px';
        }
      }
    }
  };
  cPanel.prototype.setBorderRadius = function(aBorderRadius) {
    if (this.borderRadius != aBorderRadius) {
      this.borderRadius = aBorderRadius;
      if (this.element != null) {
        if (this.shape == cPanel.cShapeRoundRect) {
          this.element.style.borderRadius = this.borderRadius + 'px';
          this.element.style.MozBorderRadius = this.borderRadius + 'px';
          this.element.style.webkitBorderRadius = this.borderRadius + 'px';
        }
      }
    }
  };
  cPanel.prototype.setMarginLeft = function(aMarginLeft) {
    if (this.marginLeft != aMarginLeft) {
      this.marginLeft = aMarginLeft;
      this.rerender();
    }
  };
  cPanel.prototype.setMarginTop = function(aMarginTop) {
    if (this.marginTop != aMarginTop) {
      this.marginTop = aMarginTop;
      this.rerender();
    }
  };
  cPanel.prototype.setMarginRight = function(aMarginRight) {
    if (this.marginRight != aMarginRight) {
      this.marginRight = aMarginRight;
      this.rerender();
    }
  };
  cPanel.prototype.setMarginBottom = function(aMarginBottom) {
    if (this.marginBottom != aMarginBottom) {
      this.marginBottom = aMarginBottom;
      this.rerender();
    }
  };
  cPanel.prototype.setBorderLeft = function(aBorderLeft) {
    if (this.borderLeft != aBorderLeft) {
      this.borderLeft = aBorderLeft;
      this.rerender();
    }
  };
  cPanel.prototype.setBorderTop = function(aBorderTop) {
    if (this.borderTop != aBorderTop) {
      this.borderTop = aBorderTop;
      this.rerender();
    }
  };
  cPanel.prototype.setBorderRight = function(aBorderRight) {
    if (this.borderRight != aBorderRight) {
      this.borderRight = aBorderRight;
      this.rerender();
    }
  };
  cPanel.prototype.setBorderBottom = function(aBorderBottom) {
    if (this.borderBottom != aBorderBottom) {
      this.borderBottom = aBorderBottom;
      this.rerender();
    }
  };
  cPanel.prototype.setPaddingLeft = function(aPaddingLeft) {
    if (this.paddingLeft != aPaddingLeft) {
      this.paddingLeft = aPaddingLeft;
      this.rerender();
    }
  };
  cPanel.prototype.setPaddingTop = function(aPaddingTop) {
    if (this.paddingTop != aPaddingTop) {
      this.paddingTop = aPaddingTop;
      this.rerender();
    }
  };
  cPanel.prototype.setPaddingRight = function(aPaddingRight) {
    if (this.paddingRight != aPaddingRight) {
      this.paddingRight = aPaddingRight;
      this.rerender();
    }
  };
  cPanel.prototype.setPaddingBottom = function(aPaddingBottom) {
    if (this.paddingBottom != aPaddingBottom) {
      this.paddingBottom = aPaddingBottom;
      this.rerender();
    }
  };
  cPanel.prototype.setMargin = function(aMargin) {
    this.marginLeft = aMargin;
    this.marginTop = aMargin;
    this.marginRight = aMargin;
    this.marginBottom = aMargin;
    this.rerender();
  };
  cPanel.prototype.setBorder = function(aBorder) {
    this.borderLeft = aBorder;
    this.borderTop = aBorder;
    this.borderRight = aBorder;
    this.borderBottom = aBorder;
    this.rerender();
  };
  cPanel.prototype.setPadding = function(aPadding) {
    this.paddingLeft = aPadding;
    this.paddingTop = aPadding;
    this.paddingRight = aPadding;
    this.paddingBottom = aPadding;
    this.rerender();
  };
  cPanel.prototype.setBackgroundColor = function(aBackgroundColor) {
    if (this.backgroundColor != aBackgroundColor) { 
      this.backgroundColor = aBackgroundColor; 
      if (this.element != null) {
        this.element.style.backgroundColor = this.backgroundColor;
      }
    }
  };
  cPanel.prototype.setBorderColor = function(aBorderColor) {
    if (this.borderColor != aBorderColor) {
      this.borderColor = aBorderColor;
      if (this.element != null) {
        this.element.style.borderColor = this.borderColor;
      }
    }
  };
  cPanel.prototype.setColor = function(aColor) {
    if (this.color != aColor) {
      this.color = aColor;
      if (this.element != null) {
        if (this.color != '') {
          this.element.style.color = this.color;
        } else {
          this.element.style.color = '#000000';
        }
      }
    }
  };
  cPanel.prototype.setFontSize = function(aFontSize) {
    if (this.fontSize != aFontSize) {
      this.fontSize = aFontSize;
      this.rerender();
    }
  };
  cPanel.prototype.setFontBold = function(aFontBold) {
    if (this.fontBold != aFontBold) {
      this.fontBold = aFontBold;
      this.rerender();
    }
  };
  cPanel.prototype.setNoWrap = function(aNoWrap) {
    if (this.noWrap != aNoWrap) {
      this.noWrap = aNoWrap;
      this.rerender();
    }
  };
  cPanel.prototype.setInnerHTML = function(aInnerHTML) {
    if (this.innerHTML != aInnerHTML) {
      this.innerHTML = aInnerHTML;
      if (this.element != null) {
        this.element.innerHTML = this.innerHTML;
      }
      this.rerender();
    }
  };
  cPanel.prototype.setImageSrc = function(aImageSrc) {
    this.imageSrc = aImageSrc; // TODO: maybe just change element's property directly, no need to fully re-render.
    this.rerender();
  };
  cPanel.prototype.setImageRepeat = function(aImageRepeat) {
    if (this.imageRepeat != aImageRepeat) {
      this.imageRepeat = aImageRepeat; // TODO: maybe just change element's property directly, no need to fully re-render.
      this.rerender();
    }
  };
  cPanel.prototype.setTransparencyPercentage = function(aTransparencyPercentage) {
    if (this.transparencyPercentage != aTransparencyPercentage) {
      this.transparencyPercentage = aTransparencyPercentage;
      if (this.element != null) {
        var lOpacityPercentage = 100 - this.transparencyPercentage;
        var lOpacityNormal = lOpacityPercentage / 100;
        this.element.style.opacity = lOpacityNormal;
        this.element.style.filter = 'alpha(opacity=' + lOpacityPercentage + ')';
      }
    }
  };
  cPanel.prototype.appendPanel = function(aPanel) {
    this.panels.push(aPanel);
    this.rerender();
  };
  cPanel.prototype.appendPanels = function(aPanels) {
    for (var i = 0; i < aPanels.length; i++) {
      this.panels.push(aPanels[i]);
    }
    this.rerender();
  };
  cPanel.prototype.removePanel = function(aPanel) {
    for (var i = 0; i < this.panels.length; i++) {
      if (this.panels[i] === aPanel) {
        if (this.element && aPanel.element) {
          this.element.removeChild(aPanel.element);
        }
        this.panels.splice(i, 1);
        break;
      }
    }
    this.rerender();
  };
  cPanel.prototype.removePanelWithoutRerender = function(aPanel) {
    for (var i = 0; i < this.panels.length; i++) {
      if (this.panels[i] === aPanel) {
        if (this.element && aPanel.element) {
          this.element.removeChild(aPanel.element);
        }
        this.panels.splice(i, 1);
        break;
      }
    }
  };
  cPanel.prototype.moveUpPanel = function(aPanel) {
    for (var i = 0; i < this.panels.length; i++) {
      if (this.panels[i] === aPanel) {
        if (i > 0) {
          if (this.element && aPanel.element) {
            this.element.insertBefore(aPanel.element, this.panels[i - 1]);
          }
          var lSwap = this.panels[i];
          this.panels[i] = this.panels[i - 1];
          this.panels[i - 1] = lSwap;
        }
        break;
      }
    }
    this.rerender();
  };
  cPanel.prototype.moveDownPanel = function(aPanel) {
    for (var i = 0; i < this.panels.length; i++) {
      if (this.panels[i] === aPanel) {
        if (i < (this.panels.length - 1)) {
          if (this.element && aPanel.element) {
            this.element.insertBefore(aPanel.element, aPanel.element.nextSibling);
          }
          var lSwap = this.panels[i];
          this.panels[i] = this.panels[i + 1];
          this.panels[i + 1] = lSwap;
        }
        break;
      }
    }
    this.rerender();
  };
  cPanel.prototype.clearPanels = function() {
    if (this.element != null) {
      this.element.innerHTML = '';
    }
    this.panels = [];
  };
})();
/**
  * Class clsModalPanel
  */
/*
  * Class clsModalPanel
  */
function clsModalPanel(aProperties) {
  var lProps = aProperties || {};
  lProps.align = lProps.align ? lProps.align : eAlign.eClient;
  lProps.backgroundColor = 'transparent';
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
clsModalPanel.deriveFrom(cPanel);
(function() {
  clsModalPanel.prototype.semiTransparantPanel = null;
  clsModalPanel.prototype.contentPanel = null;
})();
var gScreen = null;
/**
  * Class cScreen
  */
function cScreen(aApp, aContainer) {
  cBase.call(this);
  gScreen = this;
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
    cDOM.registerEvent(document.body, 'mouseout', this.onMouseOutDocument, this);
    cDOM.registerEvent(window, 'resize', this.onResize, this);
    this.initialized = true;
  }
}
cScreen.deriveFrom(cBase);
(function() {
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
    if (this.modalPanels.length > 0) {
      this.modalPanels[this.modalPanels.length - 1].recursiveHitTest(this.mouseX, this.mouseY, lNewMousePanelHovers);
    } else {
      this.panel.recursiveHitTest(this.mouseX, this.mouseY, lNewMousePanelHovers);
    }
    /*
    This does not function as wanted when panels with the same parent overlap each other.
    Only the top one remains, and all parents are removed.
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
        for (var lpi = (this.mousePanelHovers.length - 1); lpi >= 0; lpi--) {
          if (this.mousePanelHovers[lpi].panel.onClick) {
            var lMouseWasDown = false;
            for (var lpid = 0; (lpid < this.mousePanelHovers.length) && (!lMouseWasDown); lpid++) {
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
/**
  * Class cApp
  */
function cApp(aContainer) {
  cBase.call(this);
}
cApp.deriveFrom(cBase);
(function() {
  cApp.prototype.screen = null;
  cApp.prototype.onPreResize = null;
  cApp.prototype.onResize = null;
  cApp.prototype.onPostResize = null;
  cApp.prototype.onMouseDown = null;
  cApp.prototype.onMouseMove = null;
  cApp.prototype.onMouseUp = null;
})();
var eTabMenuAlign = {
  eAutoShortest: 0,
  eTop: 1,
  eLeft: 2
};
/*
  * Class cTabMenuPanel
  */
function cTabMenuPanel(aProperties) {
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
cTabMenuPanel.deriveFrom(cPanel);
(function() {
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
/*
  * Class cIFramePanel
  */
function cIFramePanel(aProperties) {
  cPanel.call(this, aProperties);
  this.iFrameElement = null;
  this.iFrameHTML = aProperties ? (typeof aProperties.iFrameHTML != 'undefined' ? aProperties.iFrameHTML : '') : '';
  this.iFrameHTMLWritten = '';
  this.supportScroll = aProperties ? (typeof aProperties.supportScroll != 'undefined' ? aProperties.supportScroll : true) : true;
  this.zoom = aProperties ? (aProperties.zoom > 0 ? aProperties.zoom : 1) : 1;
}
cIFramePanel.deriveFrom(cPanel);
(function() {
  cIFramePanel.prototype.iFrameElement = null;
  cIFramePanel.prototype.iFrameHTML = '';
  cIFramePanel.prototype.iFrameHTMLWritten = '';
  cIFramePanel.prototype.supportScroll = true;
  cIFramePanel.prototype.zoom = 1;
  cIFramePanel.prototype.render = function(aParentPanel, aParentElement, aClientRect) {
    cPanel.prototype.render.call(this, aParentPanel, aParentElement, aClientRect);
    if (this.element != null) {
      if (this.iFrameElement == null) {
        this.iFrameElement = document.createElement('iframe');
        this.iFrameElement.id = 'pnl_' + this.instanceId + '_' + this.innerId + '_iframe';
        this.iFrameElement.style.border = '0px';
        this.iFrameElement.style.margin = '0px';
        this.iFrameElement.style.padding = '0px';
        if (!this.supportScroll) {
          if (this.iFrameElement.setAttribute) {
            this.iFrameElement.setAttribute('scrolling', 'no');
          }
          this.iFrameElement.style.overflow = 'hidden';
        }
        /*
        if (this.textSelectable) {
          this.iFrameElement.style.userSelect = "text";
          this.iFrameElement.style.webkitUserSelect = "text";
          this.iFrameElement.style.MozUserSelect = "text";
        }
        */
        if ((this.zoom < 0.99) || (this.zoom > 1.01)) {
          this.iFrameElement.style.MozTransform = 'scale(' + this.zoom + ')';
          this.iFrameElement.style.MozTransformOrigin = '0 0';
          this.iFrameElement.style.OTransform = 'scale(' + this.zoom + ')';
          this.iFrameElement.style.OTransformOrigin = '0 0';
          this.iFrameElement.style.WebkitTransform = 'scale(' + this.zoom + ')';
          this.iFrameElement.style.WebkitTransformOrigin = '0 0';
          if (typeof this.iFrameElement.style.transform != 'undefined') {
            this.iFrameElement.style.transform = 'scale(' + this.zoom + ')';
            this.iFrameElement.style.transformOrigin = '0 0';
          } else if (typeof this.iFrameElement.style.msTransform != 'undefined') {
            this.iFrameElement.style.msTransform = 'scale(' + this.zoom + ')'; //IE9
            this.iFrameElement.style.msTransformOrigin = '0 0';
          } else if (typeof this.iFrameElement.style.msFilter != 'undefined') {
            this.iFrameElement.style.msFilter = "progid:DXImageTransform.Microsoft.Matrix(M11=" + this.zoom + ", M12=0, M21=0, M22=" + this.zoom + ", SizingMethod='auto expand')"; // IE8
          } else if (typeof this.iFrameElement.style.filter != 'undefined') {
            this.iFrameElement.style.filter = "progid:DXImageTransform.Microsoft.Matrix(M11=" + this.zoom + ", M12=0, M21=0, M22=" + this.zoom + ", SizingMethod='auto expand')"; // IE6 and IE7
          }
        }
        this.element.appendChild(this.iFrameElement);
        /*
        if (this.hidden) {
          this.element.style.display = 'none';
        }
        */
      }
      if ((this.zoom < 0.99) || (this.zoom > 1.01)) {
        this.iFrameElement.style.width = (((this.getInnerWidth() - (0 * this.zoom)) / this.zoom) | 0) + 'px';
        this.iFrameElement.style.height = (((this.getInnerHeight() - (0 * this.zoom)) / this.zoom) | 0) + 'px';
      } else {
        this.iFrameElement.style.width = this.getInnerWidth() + 'px';
        this.iFrameElement.style.height = this.getInnerHeight() + 'px';
      }
      if (this.iFrameHTML != this.iFrameHTMLWritten) {
        this.iFrameElement.src = 'about:blank';
        var lDocument = this.getDocument();
        lDocument.open();
        lDocument.write((this.iFrameHTML != '') ? this.iFrameHTML : '');
        lDocument.close();
        this.iFrameHTMLWritten = this.iFrameHTML;
      }
    }
  };
  cIFramePanel.prototype.getDocument = function() {
    if (this.iFrameElement != null) {
      var lDocument = (this.iFrameElement.contentWindow || this.iFrameElement.contentDocument);
      if (lDocument.document) {
        lDocument = lDocument.document;
      }
      return lDocument;
    }
    return null;
  };
  cIFramePanel.prototype.getWindow = function() {
    if (this.iFrameElement != null) {
      var lWindow = this.iFrameElement.contentWindow;
      return lWindow;
    }
    return null;
  };
  cIFramePanel.prototype.setContent = function(aContent) {
    this.iFrameHTML = aContent;
    if (this.element != null) {
      if (this.iFrameElement != null) {
        this.iFrameHTML = aContent;
        if (this.iFrameHTML != this.iFrameHTMLWritten) {
          this.iFrameElement.src = 'about:blank';
          var lDocument = this.getDocument();
          lDocument.open('text/html', 'replace');
          lDocument.write(this.iFrameHTML);
          lDocument.close();
          this.iFrameHTMLWritten = this.iFrameHTML;
        }
      }
    }  
  };
  cIFramePanel.prototype.setCSS = function(aCSS) {
    var lDocument = this.getDocument();
    var lHead = lDocument.getElementsByTagName("head").item(0);
    if (lHead) {
      var lStyleIndex = -1;
      for (var li = 0; li < lHead.children.length; li++) {
        var lCSSNode = lHead.children[li];
        if (lCSSNode.nodeName == "STYLE") {
          lStyleIndex = li;
        }
      }
      if (lStyleIndex > 0) {
        var lCSSNode = lHead.children[lStyleIndex];
        lCSSNode.innerHTML = aCSS;
      }
    }
  };
  cIFramePanel.prototype.setBody = function(aBody) {
    if (this.element != null) {
      if (this.iFrameElement != null) {
        var lDocument = this.getDocument();
        var lBody = lDocument.body; // lDocument.getElementsByTagName('body')[0];
        if (lBody) {
          lBody.innerHTML = aBody ? aBody : '';
        }
      }
    }  
  };
  cIFramePanel.prototype.getBody = function() {
    if (this.element != null) {
      if (this.iFrameElement != null) {
        var lDocument = this.getDocument();
        var lBody = lDocument.body; // getElementsByTagName('body')[0];
        if (lBody) {
          return lBody.innerHTML;
        }
      }
    }
    return '';
  };
})();
/*
  * Class cAutoSizePanel
  */
function cAutoSizePanel(aProperties) {
  cPanel.call(this, aProperties);
}
cAutoSizePanel.deriveFrom(cPanel);
(function() {
  cAutoSizePanel.prototype.render = function(aParentPanel, aParentElement, aClientRect) {
    cPanel.prototype.render.call(this, aParentPanel, aParentElement, aClientRect);
    if (this.element != null) {
      var lAutoSizeWidth = false;
      var lAutoSizeHeight = false;
      if (this.align == eAlign.eNone) {
        lAutoSizeWidth = true;
        lAutoSizeHeight = true;
      } else if (this.align == eAlign.eClient) {
      } else if (this.align == eAlign.eTop) {
        lAutoSizeHeight = true;
      } else if (this.align == eAlign.eBottom) {
        lAutoSizeHeight = true;
      } else if (this.align == eAlign.eLeft) {
        lAutoSizeWidth = true;
      } else if (this.align == eAlign.eRight) {
        lAutoSizeWidth = true;
      } else if (this.align == eAlign.eCenter) {
        lAutoSizeWidth = true;
        lAutoSizeHeight = true;
      } else if (this.align == eAlign.eWidth) {
        lAutoSizeHeight = true;
      } else if (this.align == eAlign.eHeight) {
        lAutoSizeWidth = true;
      }
      var lNewWidth = this.width;
      var lNewHeight = this.height;
      if (lAutoSizeWidth) {
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
/*
  * Class cScrollboxPanel
  */
function cScrollboxPanel(aProperties) {
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
  });
  this.panels.push(this.panelScrollBar);
  this.panelViewport = new cPanel({
    shape: (this.panelBoxRoundedBorder ? cPanel.cShapeRoundRect : cPanel.cShapeRectangle),
    borderRadius: 16,
    align: eAlign.eClient,
    backgroundColor: this.boxBackgroundColor
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
cScrollboxPanel.deriveFrom(cPanel);
(function() {
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
/**
  * Class cDataItem
  */
function cDataItem(aProperties) {
  cBase.call(this);
  this.id = aProperties ? ((typeof aProperties.id != 'undefined') ? aProperties.id : 0) : 0;
  this.name = aProperties ? ((typeof aProperties.name != 'undefined') ? aProperties.name : '') : '';
  this.content = aProperties ? ((typeof aProperties.content != 'undefined') ? aProperties.content : '') : '';
}
cDataItem.deriveFrom(cBase);
(function() {
  cDataItem.prototype.id = 0;
  cDataItem.prototype.name = '';
  cDataItem.prototype.content = '';
})();
/**
  * Class cDataArray
  */
function cDataArray(aProperties) {
  cBase.call(this);
  this.items = [];
}
cDataArray.deriveFrom(cBase);
(function() {
  cDataArray.prototype.items = [];
})();
/**
  * Class cFuture
  */
function cFuture(aProperties) {
  cBase.call(this);
  cFuture.lastId++;
  this.id = cFuture.lastId;
  this.worldHTML = '';
  this.evaluation = {
    like: 0,
    end: false,
    same: false,
    goal: false,
    illegal: false,
    ignore: false
  };
  this.actionDescription = '';
  this.evaluationDescription = '';
  this.past = null;
  this.futures = [];
  this.futuresDetermined = false;
  this.level = 0;
  this.multiverseColumns = [];
  this.modelData = {};
}
cFuture.deriveFrom(cBase);
(function() {
  cFuture.lastId = 0;
  cFuture.prototype.id = 0;
  cFuture.prototype.worldHTML = '';
  cFuture.prototype.evaluation = {
    like: 0,
    end: false,
    same: false,
    goal: false,
    illegal: false,
    ignore: false,
    evaluationDescription: ''
  };
  cFuture.prototype.actionDescription = '';
  cFuture.prototype.past = null;
  cFuture.prototype.futures = [];
  cFuture.prototype.futuresDetermined = false;
  cFuture.prototype.level = 0; // level 0 == now
  cFuture.prototype.multiverseColumns = [];
  cFuture.prototype.modelData = {};
  cFuture.prototype.resetFutures = function() {
    this.futures = [];
  };
  cFuture.prototype.setWorldHTML = function(aHTML) {
    this.worldHTML = aHTML;
  };
  cFuture.prototype.getPastWorld = function(aHTML) {
    var lstr1 = this.worldHTML.replace(/\s+/g, ''); // trick
    var lstr2 = aHTML.replace(/\s+/g, ''); // trick
    if (lstr1 == lstr2) {
      return this;
    } else if (this.past != null) {
      return this.past.getPastWorld(aHTML)
    }
    return null;
  };
  cFuture.prototype.sameAsWorld = function(aHTML) {
    var lstr1 = this.worldHTML.replace(/\s+/g, ''); // trick
    var lstr2 = aHTML.replace(/\s+/g, ''); // trick
    if (lstr1 == lstr2) {
      return true;
    }
    return false;
  };
  cFuture.prototype.isInColumnNumber = function(aColumnNumber) {
    var lResult = false;
    for (var ci = 0, cc = this.multiverseColumns.length; ci < cc; ci++) {
      if (this.multiverseColumns[ci].columnNumber == aColumnNumber) {
        lResult = true;
        break;
      }
    }
    return lResult;
  };
})();
/**
  * Class cMultiverseColumn
  */
function cMultiverseColumn(aProperties) {
  cBase.call(this);
  this.futures = [];
  this.columnNumber = aProperties ? ((typeof aProperties.columnNumber != 'undefined') ? aProperties.columnNumber : 0) : 0;
}
cMultiverseColumn.deriveFrom(cBase);
(function() {
  cMultiverseColumn.prototype.futures = [];
  cMultiverseColumn.prototype.columnNumber = 0; // can be negative
})();
/**
  * Class cMultiverse
  */
function cMultiverse(aProperties) {
  cBase.call(this);
  this.worldNow = new cFuture();
  this.columns = [];
  this.totalNumberOfFutures = 1;
  this.resetFutures();
}
cMultiverse.deriveFrom(cBase);
(function() {
  cMultiverse.prototype.worldNow = null;
  cMultiverse.prototype.columns = [];
  cMultiverse.prototype.totalNumberOfFutures = 0;
  var traverseFutures = function(aWorld, aCallback) {
    if (aWorld != null) {
      if (aCallback) {
        aCallback(aWorld);
      }
      for (var li = 0, lc = aWorld.futures.length; li < lc; li++) {
        traverseFutures(aWorld.futures[li], aCallback);
      }
    }
  };
  cMultiverse.prototype.resetFutures = function() {
    this.worldNow.resetFutures();
    this.worldNow.futuresDetermined = false;
    this.worldNow.level = 0;
    this.worldNow.evaluation.like = 0;
    this.worldNow.evaluation.end = false;
    this.worldNow.evaluation.same = false;
    this.worldNow.evaluation.goal = false;
    this.worldNow.evaluation.illegal = false;
    this.worldNow.evaluation.ignore = false;
    this.worldNow.evaluation.evaluationDescription = '';
    this.columns = [];
    var lColumn = new cMultiverseColumn({
      columnNumber: 0
    });
    this.columns.push(lColumn);
    lColumn.futures.push(this.worldNow);
    this.totalNumberOfFutures = 1;
    this.worldNow.multiverseColumns = [];
    this.worldNow.multiverseColumns.push(lColumn);
  };
  cMultiverse.prototype.indexOfColumnNumber = function(aColumnNumber) {
    var lResult = -1;
    for (var ci = 0, cc = this.columns.length; ci < cc; ci++) {
      if (this.columns[ci].columnNumber == aColumnNumber) {
        lResult = ci;
        break;
      }
    }
    return lResult;
  };
  cMultiverse.prototype.indexForNewColumnNumber = function(aColumnNumber) {
    var lResult = this.columns.length;
    for (var ci = 0, cc = this.columns.length; ci < cc; ci++) {
      if (this.columns[ci].columnNumber >= aColumnNumber) {
        lResult = ci;
        break;
      }
    }
    return lResult;
  };
  cMultiverse.prototype.getColumnByColumnNumber = function(aColumnNumber) {
    var lResult = null;
    for (var ci = 0, cc = this.columns.length; ci < cc; ci++) {
      if (this.columns[ci].columnNumber == aColumnNumber) {
        lResult = this.columns[ci];
        break;
      }
    }
    return lResult;
  };
  cMultiverse.prototype.addFuture = function(aFuture, aPast, aFocusColumnNumber) {
    aPast.futures.push(aFuture);
    aFuture.past = aPast;
    this.totalNumberOfFutures++;
    aFuture.level = aPast.level + 1;
    var lColumn;
    var lGoingStraightUp = (aPast.futures.length == 1);
    if (lGoingStraightUp) {
      lColumn = aPast.multiverseColumns[0];
    } else {
      var lLastColumn = aPast.multiverseColumns[aPast.multiverseColumns.length - 1];
      var lColumnNumber = lLastColumn.columnNumber + 1;
      var lColumnIndex = this.indexForNewColumnNumber(lLastColumn.columnNumber) + 1;
      var lReplacingExistingColumnNumber = (this.indexOfColumnNumber(lColumnNumber) >= 0);
      if (lReplacingExistingColumnNumber) {
        for (var ci = (this.columns.length - 1); ci >= lColumnIndex; ci--) {
          var liColumn = this.columns[ci];
          liColumn.columnNumber = liColumn.columnNumber + 1;
        }
      }
      lColumn = new cMultiverseColumn({ columnNumber: lColumnNumber });
      this.columns.splice(lColumnIndex, 0, lColumn);
      var lPasts = [];
      var liPast = aPast;
      while (liPast != null) {
        lPasts.push(liPast);
        liPast = liPast.past;
      }
      for (var lpi = (lPasts.length - 1); lpi >= 0; lpi--) {
        var lPast = lPasts[lpi];
        lColumn.futures.push(lPast);
        lPast.multiverseColumns.push(lColumn);
        lPast.multiverseColumns.sort(function(a, b) { return (a.columnNumber - b.columnNumber); });
      }
    }
    lColumn.futures.push(aFuture);
    aFuture.multiverseColumns.push(lColumn);
  };
  cMultiverse.prototype.removeFutureColumn = function(aFuture) {
    if ((aFuture.futures.length == 0) && (aFuture.id != this.worldNow.id)) {
      var lColumnNumber = aFuture.multiverseColumns[0].columnNumber;
      var lColumnIndex =  this.indexOfColumnNumber(lColumnNumber);
      if (lColumnIndex >= 0) {
        var lColumn = this.columns[lColumnIndex];
        for (var fi = (lColumn.futures.length - 1); fi >= 0; fi--) {
          var lFuture = lColumn.futures[fi];
          for (var fci = 0, fcc = lFuture.multiverseColumns.length; fci < fcc; fci++) {
            if (lFuture.multiverseColumns[fci].columnNumber == lColumnNumber) {
              lFuture.multiverseColumns.splice(fci, 1);
              if ((lFuture.multiverseColumns.length == 0) && (lFuture.id != this.worldNow.id)) {
                this.totalNumberOfFutures--;
                if (lFuture.past != null) {
                  for (var fpi = 0, fpc = lFuture.past.futures.length; fpi < fpc; fpi++) {
                    if (lFuture.past.futures[fpi].id == lFuture.id) {
                      lFuture.past.futures.splice(fpi, 1);
                      break;
                    }
                  }
                }
              }
              break;
            }
          }
        }
        this.columns.splice(lColumnIndex, 1);
        for (var ci = lColumnIndex, cc = this.columns.length; ci < cc; ci++) {
          var liColumn = this.columns[ci];
          liColumn.columnNumber = liColumn.columnNumber - 1;
        }
        for (var ci = 0, cc = this.columns.length; ci < cc; ci++) {
          var liColumn = this.columns[ci];
          if (liColumn.columnNumber != ci) {
            console.log('uh oh');
          }
        }
      }
    }
  };
/*
  cMultiverse.prototype.updateTotalNumberOfFutures = function() {
    this.totalNumberOfFutures = 0;
    var lThis = this;
    traverseFutures(this.worldNow, function() { lThis.totalNumberOfFutures++; });
  }
*/
  cMultiverse.prototype.breadthFirstFuture = function() {
    var lFuture = null;
    for (var ci = 0; ci < this.columns.length; ci++) {
      var liColumn = this.columns[ci];
      if (liColumn.futures.length > 0) {
        var lCF = liColumn.futures[liColumn.futures.length - 1];
        if (!lCF.futuresDetermined) {
          if ((lFuture == null) || ((lCF !== lFuture) && (lCF.level < lFuture.level))) {
            lFuture = lCF;
          }
        }
      }
    }
    return lFuture;
  };
  cMultiverse.prototype.highScoreFuture = function() {
    var lFuture = null;
    for (var ci = 0; ci < this.columns.length; ci++) {
      var liColumn = this.columns[ci];
      if (liColumn.futures.length > 0) {
        var lCF = liColumn.futures[liColumn.futures.length - 1];
        if (!lCF.futuresDetermined) {
          if ((lFuture == null) || ((lCF !== lFuture) && ((lCF.evaluation.like > lFuture.evaluation.like) || ((lCF.evaluation.like == lFuture.evaluation.like) && (lCF.level < lFuture.level))))) {
            lFuture = lCF;
          }
        }
      }
    }
    return lFuture;
  };
  cMultiverse.prototype.leftSideFuture = function() {
    var lFuture = null;
    for (var ci = 0; ci < this.columns.length; ci++) {
      var liColumn = this.columns[ci];
      if (liColumn.futures.length > 0) {
        var lCF = liColumn.futures[liColumn.futures.length - 1];
        if (!lCF.futuresDetermined) {
          lFuture = lCF;
          break;
        }
      }
    }
    return lFuture;
  };
  cMultiverse.prototype.rightSideFuture = function() {
    var lFuture = null;
    for (var ci = (this.columns.length - 1); ci >= 0; ci--) {
      var liColumn = this.columns[ci];
      if (liColumn.futures.length > 0) {
        var lCF = liColumn.futures[liColumn.futures.length - 1];
        if (!lCF.futuresDetermined) {
          if (lFuture == null) {
            lFuture = lCF;
            break;
          }
        }
      }
    }
    return lFuture;
  };
  cMultiverse.prototype.getGoalFuture = function() {
    var lFuture = null;
    for (var ci = 0; ci < this.columns.length; ci++) {
      var liColumn = this.columns[ci];
      if (liColumn.futures.length > 0) {
        var lCF = liColumn.futures[liColumn.futures.length - 1];
        if ((lCF.futuresDetermined) && (lCF.evaluation.goal)) {
          lFuture = lCF;
          break;
        }
      }
    }
    return lFuture;
  };
})();
/**
  * Class cAgent
  */
function cAgent(aProperties) {
  cBase.call(this);
}
cAgent.deriveFrom(cBase);
(function() {
  cAgent.prototype.evaluations = '';
  cAgent.prototype.actions = '';
})();
/**
 * Class cModel
 */
function cModel(aProperties) {
  cBase.call(this);
  this.worldCSS = '';
  this.agent = new cAgent();
  var lThis = this;
  this.multiverse = new cMultiverse();
  this.actionSandbox = null;
  this.evaluationSandbox = null;
  this.allUndeterminedFutures = [];
  this.searchAlgorithm = cModel.searchAlgorithms.msaLeftSideFirst;
  this.stopSearchWhenGoalFound = true;
  this.newestGoalFuture = null;
  this.ignoreSameAsParentOrSibling = true;
  this.ignoreIllegalFutures = true;
  this.onInitActionSandboxComplete = function() {
  };
  this.onInitEvaluationSandboxComplete = function() {
  };
}
cModel.deriveFrom(cBase);
(function() {
  cModel.searchAlgorithms = {
    msaBreadthFirst: 1,
    msaHighScoreFirst: 2,
    msaLeftSideFirst: 3,
    msaRightSideFirst: 4
  };
  cModel.prototype.worldCSS = '';
  cModel.prototype.agent = null;
  cModel.prototype.multiverse = null;
  cModel.prototype.actionSandbox = null;
  cModel.prototype.evaluationSandbox = null;
  cModel.prototype.allUndeterminedFutures = [];
  cModel.prototype.searchAlgorithm = cModel.searchAlgorithms.msaLeftSideFirst;
  cModel.prototype.stopSearchWhenGoalFound = false;
  cModel.prototype.newestGoalFuture = null;
  cModel.prototype.ignoreSameAsParentOrSibling = true;
  cModel.prototype.ignoreIllegalFutures = true;
  cModel.prototype.onInitActionSandboxComplete = function() {
  };
  cModel.prototype.onInitEvaluationSandboxComplete = function() {
  };
  var pActionSandboxLoaded = false;
  var pEvaluationSandboxLoaded = false;
  var pSpawnedWorlds = [];
  var pEvaluation = {
    like : 0,
    end : false,
    goal : false,
    illegal : false,
    ignore : false,
    evaluationDescription : ''
  };
  var pEvaluationSameFutureAsBefore = false;
  cModel.prototype.initActionSandbox = function(aIFrame, aOnInitComplete) {
    this.onInitActionSandboxComplete = aOnInitComplete ? (( typeof aOnInitComplete != 'undefined') ? aOnInitComplete : function() {
    }) : function() {
    };
    pActionSandboxLoaded = false;
    this.actionSandbox = aIFrame;
    if (this.actionSandbox) {
      var lHTMLDoc = '';
      lHTMLDoc += '<!DOCTYPE html>\n';
      lHTMLDoc += '<html>\n';
      lHTMLDoc += '<head>\n';
      lHTMLDoc += '<style>\n';
      lHTMLDoc += 'body {\n';
      lHTMLDoc += '  background-color: #ff00ff;\n';
      lHTMLDoc += '  font-family: Calibri, Arial, helvetica, sans-serif;\n';
      lHTMLDoc += '}\n';
      lHTMLDoc += '<\/style>\n';
      lHTMLDoc += '<script type="text/javascript" src="js/lib/jquery-1.10.2.min.js"><\/script>\n';
      lHTMLDoc += '<script type="text/javascript" src="js/lib/jchoose-min.js"><\/script>\n';
      lHTMLDoc += '<script type="text/javascript">\n';
      lHTMLDoc += '  var multiverse = {\n';
      lHTMLDoc += '    _memory: "",\n';
      lHTMLDoc += '    _memories: {},\n';
      lHTMLDoc += '    _init: function() {\n';
      lHTMLDoc += '      parent.Model.onActionIFrameReady();\n';
      lHTMLDoc += '    },\n';
      lHTMLDoc += '    spawn: function(aActionDescription) {\n';
      lHTMLDoc += '      parent.Model.spawnFuture($("body").html(), aActionDescription);\n';
      lHTMLDoc += '    },\n';
      lHTMLDoc += '    world: function(aActionDescription) {\n';
      lHTMLDoc += '      parent.Model.spawnFuture($("body").html(), aActionDescription);\n';
      lHTMLDoc += '    },\n';
      lHTMLDoc += '    forgetAll: function() {\n';
      lHTMLDoc += '      multiverse._memory = "";\n';
      lHTMLDoc += '      multiverse._memories = {};\n';
      lHTMLDoc += '    },\n';
      lHTMLDoc += '    remember: function(aMomentName) {\n';
      lHTMLDoc += '      if(aMomentName) {\n';
      lHTMLDoc += '        multiverse._memories[aMomentName] = $("body").html();\n';
      lHTMLDoc += '      } else {\n';
      lHTMLDoc += '        multiverse._memory = $("body").html();\n';
      lHTMLDoc += '      }\n';
      lHTMLDoc += '    },\n';
      lHTMLDoc += '    recall: function(aMomentName) {\n';
      lHTMLDoc += '      if(aMomentName && multiverse._memories[aMomentName]) {\n';
      lHTMLDoc += '        $("body").html(multiverse._memories[aMomentName]);\n';
      lHTMLDoc += '      } else {\n';
      lHTMLDoc += '        $("body").html(multiverse._memory);\n';
      lHTMLDoc += '      }\n';
      lHTMLDoc += '    }\n';
      lHTMLDoc += '  };\n';
      lHTMLDoc += '  function _runCode(aCode) {\n';
      lHTMLDoc += '    var _codeResult = {\n';
      lHTMLDoc += '      syntaxError: true,\n';
      lHTMLDoc += '      syntaxErrorMessage: "",\n';
      lHTMLDoc += '      runError: true,\n';
      lHTMLDoc += '      runErrorMessage: ""\n';
      lHTMLDoc += '    };\n';
      lHTMLDoc += '    var _func;\n';
      lHTMLDoc += '    try {\n';
      lHTMLDoc += '      _func = eval(\n';
      lHTMLDoc += '        "(function() {\\n" +\n';
      lHTMLDoc += '          "multiverse.remember();\\n" +\n';
      lHTMLDoc += '          aCode + "\\n" +\n';
      lHTMLDoc += '        "})"\n'; 
      lHTMLDoc += '      );\n';
      lHTMLDoc += '      _codeResult.syntaxError = false;\n';
      lHTMLDoc += '    } catch (e) {\n';
      lHTMLDoc += '      _codeResult.syntaxErrorMessage = e.message ? e.message : e;\n';
      lHTMLDoc += '    }\n';
      lHTMLDoc += '    if (!_codeResult.syntaxError) {\n';
      lHTMLDoc += '      try {\n';
      lHTMLDoc += '        _func.call(window);\n';
      lHTMLDoc += '        _codeResult.runError = false;\n';
      lHTMLDoc += '      } catch (e) {\n';
      lHTMLDoc += '        _codeResult.runErrorMessage = e.message ? e.message : e;\n';
      lHTMLDoc += '      }\n';
      lHTMLDoc += '    }\n';
      lHTMLDoc += '    return _codeResult;\n';
      lHTMLDoc += '  }\n';
      lHTMLDoc += '<\/script>\n';
      lHTMLDoc += '<\/head>\n';
      lHTMLDoc += '<body onload="multiverse._init()">\n';
      lHTMLDoc += '<\/body>\n';
      lHTMLDoc += '<\/html>';
      this.actionSandbox.setContent(lHTMLDoc);
      this.actionSandbox.lastRunResult = null;
    }
  };
  cModel.prototype.onActionIFrameReady = function() {
    if (pActionSandboxLoaded == false) {// it's possible that this get called multiple times, for example when iFrame is repositioned.
      pActionSandboxLoaded = true;
      this.onInitActionSandboxComplete();
    }
  };
  cModel.prototype.initEvaluationSandbox = function(aIFrame, aOnInitComplete) {
    this.onInitEvaluationSandboxComplete = aOnInitComplete ? (( typeof aOnInitComplete != 'undefined') ? aOnInitComplete : function() {
    }) : function() {
    };
    pEvaluationSandboxLoaded = false;
    this.evaluationSandbox = aIFrame;
    if (this.evaluationSandbox) {
      var lHTMLDoc = '';
      lHTMLDoc += '<!DOCTYPE html>\n';
      lHTMLDoc += '<html>\n';
      lHTMLDoc += '<head>\n';
      lHTMLDoc += '<style>\n';
      lHTMLDoc += 'body {\n';
      lHTMLDoc += '  background-color: #ff00ff;\n';
      lHTMLDoc += '  font-family: Calibri, Arial, helvetica, sans-serif;\n';
      lHTMLDoc += '}\n';
      lHTMLDoc += '<\/style>\n';
      lHTMLDoc += '<script type="text/javascript" src="js/lib/jquery-1.10.2.min.js"><\/script>\n';
      lHTMLDoc += '<script type="text/javascript">\n';
      lHTMLDoc += '  function _runCode(aCode) {\n';
      lHTMLDoc += '    var _codeResult = {\n';
      lHTMLDoc += '      syntaxError: true,\n';
      lHTMLDoc += '      syntaxErrorMessage: "",\n';
      lHTMLDoc += '      runError: true,\n';
      lHTMLDoc += '      runErrorMessage: ""\n';
      lHTMLDoc += '    };\n';
      lHTMLDoc += '    var _func;\n';
      lHTMLDoc += '    try {\n';
      lHTMLDoc += '      _func = eval(\n';
      lHTMLDoc += '        "(function() { \\n" +\n';
      lHTMLDoc += '        "  world._reset();\\n" + \n';
      lHTMLDoc += '        "  world._isSameAsBefore = parent.Model.isSameFutureAsBefore();\\n" + \n';
      lHTMLDoc += '           aCode + "\\n" + \n';
      lHTMLDoc += '        "  world._processEvaluation();\\n" + \n';
      lHTMLDoc += '        "})"\n';
      lHTMLDoc += '      );\n';
      lHTMLDoc += '      _codeResult.syntaxError = false;\n';
      lHTMLDoc += '    } catch (e) {\n';
      lHTMLDoc += '      _codeResult.syntaxErrorMessage = e.message ? e.message : e;\n';
      lHTMLDoc += '    }\n';
      lHTMLDoc += '    if (!_codeResult.syntaxError) {\n';
      lHTMLDoc += '      try {\n';
      lHTMLDoc += '        _func.call(window);\n';
      lHTMLDoc += '        _codeResult.runError = false;\n';
      lHTMLDoc += '      } catch (e) {\n';
      lHTMLDoc += '        _codeResult.runErrorMessage = e.message ? e.message : e;\n';
      lHTMLDoc += '      }\n';
      lHTMLDoc += '    }\n';
      lHTMLDoc += '    return _codeResult;\n';
      lHTMLDoc += '  }\n';
      lHTMLDoc += '  var world = {\n';
      lHTMLDoc += '    evaluation: {\n';
      lHTMLDoc += '      like : 0,\n';
      lHTMLDoc += '      end : false,\n';
      lHTMLDoc += '      goal : false,\n';
      lHTMLDoc += '      illegal : false,\n';
      lHTMLDoc += '      ignore : false\n';
      lHTMLDoc += '    },\n';
      lHTMLDoc += '    _isSameAsBefore: false,\n';
      lHTMLDoc += '    _init: function() {\n';
      lHTMLDoc += '      parent.Model.onEvaluationIFrameReady();\n';
      lHTMLDoc += '    },\n';
      lHTMLDoc += '    _reset: function() {\n';
      lHTMLDoc += '      world.evaluation.like = 0;\n';
      lHTMLDoc += '      world.evaluation.end = false;\n';
      lHTMLDoc += '      world.evaluation.goal = false;\n';
      lHTMLDoc += '      world.evaluation.illegal = false;\n';
      lHTMLDoc += '      world.evaluation.ignore = false;\n';
      lHTMLDoc += '      world.evaluation.evaluationDescription = \'\';\n';
      lHTMLDoc += '    },\n';
      lHTMLDoc += '    _processEvaluation: function() {\n';
      lHTMLDoc += '      if (world.evaluation.like) {\n';
      lHTMLDoc += '        parent.Model.likeFuture(world.evaluation.like);\n';
      lHTMLDoc += '      }\n';
      lHTMLDoc += '      if (world.evaluation.end) {\n';
      lHTMLDoc += '        parent.Model.endFuture(world.evaluation.evaluationDescription);\n';
      lHTMLDoc += '      }\n';
      lHTMLDoc += '      if (world.evaluation.goal) {\n';
      lHTMLDoc += '         parent.Model.goalFuture(world.evaluation.evaluationDescription);\n';
      lHTMLDoc += '      }\n';
      lHTMLDoc += '      if (world.evaluation.illegal) {\n';
      lHTMLDoc += '        parent.Model.illegalFuture(world.evaluation.evaluationDescription);\n';
      lHTMLDoc += '      }\n';
      lHTMLDoc += '      if (world.evaluation.ignore) {\n';
      lHTMLDoc += '        parent.Model.ignoreFuture();\n';
      lHTMLDoc += '      }\n';
      lHTMLDoc += '    },\n';
      lHTMLDoc += '    like: function(aLikeScore) {\n';
      lHTMLDoc += '      if (typeof aLikeScore == \'number\') {\n';
      lHTMLDoc += '        world.evaluation.like += aLikeScore;\n';
      lHTMLDoc += '      } else {\n';
      lHTMLDoc += '        world.evaluation.like++;\n';
      lHTMLDoc += '      }\n';
      lHTMLDoc += '    },\n';
      lHTMLDoc += '    dislike: function(aDislikeScore) {\n';
      lHTMLDoc += '      if (typeof aDislikeScore == \'number\') {\n';
      lHTMLDoc += '        world.evaluation.like -= aDislikeScore;\n';
      lHTMLDoc += '      } else {\n';
      lHTMLDoc += '        world.evaluation.like--;\n';
      lHTMLDoc += '      }\n';
      lHTMLDoc += '    },\n';
      lHTMLDoc += '    end: function(aEvaluationDescription) {\n';
      lHTMLDoc += '      world.evaluation.end = true;\n';
      lHTMLDoc += '      world.evaluation.evaluationDescription = aEvaluationDescription ? aEvaluationDescription : \'\';\n';
      lHTMLDoc += '    },\n';
      lHTMLDoc += '    isSameAsBefore: function() {\n';
      lHTMLDoc += '      return world._isSameAsBefore;\n';
      lHTMLDoc += '    },\n';
      lHTMLDoc += '    goal: function(aEvaluationDescription) {\n';
      lHTMLDoc += '      world.evaluation.goal = true;\n';
      lHTMLDoc += '      world.evaluation.evaluationDescription = aEvaluationDescription ? aEvaluationDescription : \'\';\n';
      lHTMLDoc += '    },\n';
      lHTMLDoc += '    illegal: function(aEvaluationDescription) {\n';
      lHTMLDoc += '      world.evaluation.illegal = true;\n';
      lHTMLDoc += '      world.evaluation.evaluationDescription = aEvaluationDescription ? aEvaluationDescription : \'\';\n';
      lHTMLDoc += '    },\n';
      lHTMLDoc += '    ignore: function() {\n';
      lHTMLDoc += '      world.evaluation.ignore = true;\n';
      lHTMLDoc += '    }\n';
      lHTMLDoc += '  };\n';
      lHTMLDoc += '<\/script>\n';
      lHTMLDoc += '<\/head>\n';
      lHTMLDoc += '<body onload="world._init()">\n';
      lHTMLDoc += '<\/body>\n';
      lHTMLDoc += '<\/html>';
      this.evaluationSandbox.setContent(lHTMLDoc);
      this.evaluationSandbox.lastRunResult = null;
    }
  };
  cModel.prototype.onEvaluationIFrameReady = function() {
    if (pEvaluationSandboxLoaded == false) {// it's possible that this get called multiple times, for example when iFrame is repositioned.
      pEvaluationSandboxLoaded = true;
      this.onInitEvaluationSandboxComplete();
    }
  };
  cModel.prototype.spawnFuture = function(aHTML, aActionDescription) {
    if (typeof aHTML == 'string') {
      pSpawnedWorlds.push({
        html: aHTML, 
        actionDescription: aActionDescription ? aActionDescription : ''
      });
    }
  };
  cModel.prototype.likeFuture = function(aLikeScore) {
    if (typeof aLikeScore == 'number') {
      pEvaluation.like += aLikeScore;
    } else {
      pEvaluation.like++;
    }
  };
  cModel.prototype.dislikeFuture = function(aDislikeScore) {
    if (typeof aDislikeScore == 'number') {
      pEvaluation.like -= aDislikeScore;
    } else {
      pEvaluation.like--;
    }
  };
  cModel.prototype.endFuture = function(aEvaluationDescription) {
    pEvaluation.end = true;
    pEvaluation.evaluationDescription = aEvaluationDescription;
  };
  cModel.prototype.isSameFutureAsBefore = function() {
    return pEvaluationSameFutureAsBefore;
  };
  cModel.prototype.goalFuture = function(aEvaluationDescription) {
    pEvaluation.goal = true;
    pEvaluation.evaluationDescription = aEvaluationDescription;
  };
  cModel.prototype.illegalFuture = function(aEvaluationDescription) {
    pEvaluation.illegal = true;
    pEvaluation.evaluationDescription = aEvaluationDescription;
  };
  cModel.prototype.ignoreFuture = function() {
    pEvaluation.ignore = true;
  };
  cModel.prototype.runWorldInActionSandbox = function(aWorldBodyHTML, aCode) {
    var lCodeResult = {};
    var lValidChoice = false;
    if (pActionSandboxLoaded) {
      this.actionSandbox.setBody(aWorldBodyHTML);
      var lWindow = this.actionSandbox.getWindow();
      lCodeResult = lWindow._runCode(aCode);
      lValidChoice = lWindow.jChoose.validChoice();
    }
    var lResult = {
      codeResult : lCodeResult,
      validChoice : lValidChoice
    };
    this.actionSandbox.lastRunResult = lCodeResult;
    return lResult;
  };
  cModel.prototype.evaluateWorld = function(aSourceFuture, aWorldBodyHTML, aCode) {
    pEvaluation = {
      like : 0,
      end : false,
      goal : false,
      illegal : false,
      ignore : false,
      evaluationDescription : ''
    };
    pEvaluationSameFutureAsBefore = false;
    if (aSourceFuture != null) {
      if (aSourceFuture.getPastWorld(aWorldBodyHTML) != null) { // if this situation happened before
        pEvaluationSameFutureAsBefore = true;
      }
    }
    var lCodeResult = {};
    if (pEvaluationSandboxLoaded) {
      if (aCode) {
        this.evaluationSandbox.setBody(aWorldBodyHTML);
        var lWindow = this.evaluationSandbox.getWindow();
        lCodeResult = lWindow._runCode(aCode);
      }
    }
    var lResult = {
      codeResult : lCodeResult,
      like : pEvaluation.like,
      end : pEvaluation.end,
      same : pEvaluationSameFutureAsBefore,
      goal : pEvaluation.goal,
      illegal : pEvaluation.illegal,
      ignore : pEvaluation.ignore,
      evaluationDescription : pEvaluation.evaluationDescription
    };
    this.evaluationSandbox.lastRunResult = lCodeResult;
    return lResult;
  };
  cModel.prototype.resetActionSandboxChooseCallStack = function() {
    if (pActionSandboxLoaded) {
      var lWindow = this.actionSandbox.getWindow();
      lWindow.jChoose.resetCallStack();
    }
  };
  cModel.prototype.getActionSandboxChooseCallStack = function() {
    if (pActionSandboxLoaded) {
      var lWindow = this.actionSandbox.getWindow();
      return lWindow.jChoose.callStack;
    }
    return null;
  };
  cModel.prototype.resetActionSandboxChooseCallStackIndexAndValidChoice = function() {
    if (pActionSandboxLoaded) {
      var lWindow = this.actionSandbox.getWindow();
      lWindow.jChoose.resetCallStackIndexAndValidChoice();
    }
  };
  cModel.prototype.getActionSandboxBodyHTML = function() {
    if (pActionSandboxLoaded) {
      return this.actionSandbox.getBody();
    }
    return '';
  };
  cModel.prototype.getWorldCSS = function() {
    return this.worldCSS;
  };
  cModel.prototype.getWorldNowHTML = function() {
    if (this.multiverse.worldNow != null) {
      return this.multiverse.worldNow.worldHTML;
    }
    return '';
  };
  cModel.prototype.getWorldNowFullHTML = function() {
    if (this.multiverse.worldNow != null) {
      var lHTMLDoc = this.compileFullHTML(this.multiverse.worldNow.worldHTML);
      return lHTMLDoc;
    }
    return '';
  };
  cModel.prototype.getFutureFullHTML = function(aFuture) {
    var lHTMLDoc = this.compileFullHTML(aFuture.worldHTML);
    return lHTMLDoc;
  };
  cModel.prototype.compileFullHTML = function(aBodyHTML) {
    var lHTMLDoc = '<!DOCTYPE html>\n' + '<html>\n' + '<head>\n' + '<style>\n' + 'body {\n' + '  margin: 0px;\n' + '  border: 0px;\n' + '  padding: 0px;\n' + '  background-color: #ffffff;\n' + '  font-family: Calibri, Arial, helvetica, sans-serif;\n' + '}\n' + this.worldCSS + '\n' + '</style>\n' + '</head>\n' + '<body>' + aBodyHTML + '\n' + '</body>\n' + '</html>';
    return lHTMLDoc;
  };
  cModel.prototype.setWorldCSS = function(aCSS) {
    this.worldCSS = aCSS;
    this.updateWorldNow();
  };
  cModel.prototype.setWorldNowHTML = function(aHTML) {
    if (this.multiverse.worldNow != null) {
      this.multiverse.worldNow.worldHTML = aHTML;
      this.updateWorldNow();
    }
  };
  cModel.prototype.getEvaluations = function() {
    return this.agent.evaluations;
  };
  cModel.prototype.setEvaluations = function(aEvaluations) {
    if (this.agent.evaluations != aEvaluations) {
      this.agent.evaluations = aEvaluations;
      this.updateWorldNow();
    }
  };
  cModel.prototype.getActions = function() {
    return this.agent.actions;
  };
  cModel.prototype.setActions = function(aActions) {
    if (this.agent.actions != aActions) {
      this.agent.actions = aActions;
      this.multiverse.resetFutures();
      this.actionSandbox.lastRunResult = null;
    }
  };
  cModel.prototype.ClearAll = function(aFile) {
    if (this.multiverse.worldNow != null) {
      this.multiverse.worldNow.worldHTML = '';
    }
    this.worldCSS = '';
    this.agent.actions = '';
    this.agent.evaluations = '';
    this.updateWorldNow();
  };
  cModel.prototype.loadFile = function(aFile) {
    var lResult = false;
    if (aFile.project) {
      if (typeof aFile.project.html == 'string') {
        if (this.multiverse.worldNow != null) {
          this.multiverse.worldNow.worldHTML = aFile.project.html;
        }
      }
      if (typeof aFile.project.css == 'string') {
        this.worldCSS = aFile.project.css;
      }
      if (typeof aFile.project.actions == 'string') {
        this.agent.actions = aFile.project.actions;
      }
      if (typeof aFile.project.evaluations == 'string') {
        this.agent.evaluations = aFile.project.evaluations;
      }
      if (typeof aFile.project.searchAlgorithm == 'string') {
        if (aFile.project.searchAlgorithm == 'breadth-first') {
          this.searchAlgorithm = cModel.searchAlgorithms.msaBreadthFirst;
        } else if (aFile.project.searchAlgorithm == 'high-score-first') {
          this.searchAlgorithm = cModel.searchAlgorithms.msaHighScoreFirst;
        } else if (aFile.project.searchAlgorithm == 'left-side-first') {
          this.searchAlgorithm = cModel.searchAlgorithms.msaLeftSideFirst;
        } else if (aFile.project.searchAlgorithm == 'right-side-first') {
          this.searchAlgorithm = cModel.searchAlgorithms.msaRightSideFirst;
        }
      }
      lResult = true;
    }
    this.updateWorldNow();
    return lResult;
  };
  cModel.prototype.generateFileContent = function(aName) {
    var lContent = '';
    var lAlgo = '';
    if (this.searchAlgorithm == cModel.searchAlgorithms.msaBreadthFirst) {
      lAlgo = 'breadth-first';
    } else if (this.searchAlgorithm == cModel.searchAlgorithms.msaHighScoreFirst) {
      lAlgo == 'high-score-first';
    } else if (this.searchAlgorithm == cModel.searchAlgorithms.msaLeftSideFirst) {
      lAlgo = 'left-side-first';
    } else if (this.searchAlgorithm == cModel.searchAlgorithms.msaRightSideFirst) {
      lAlgo = 'right-side-first';
    }
    lContent += '{\n';
    lContent += '  application:\n';
    lContent += '  {\n';
    lContent += '    name: "ProblemSolver",\n';
    lContent += '    home: "http://complexity.zone/problem_solver",\n';
    lContent += '    version: "0.0.1"\n';
    lContent += '  },\n';
    lContent += '  project:\n';
    lContent += '  {\n';
    lContent += '    date: "' + (new Date()).toJSON() + '",\n';
    lContent += '    name: "' + cLib.textToJSONString(aName) + '",\n';
    lContent += '    html: "' + cLib.textToJSONString(this.multiverse.worldNow.worldHTML) + '",\n';
    lContent += '    css: "' + cLib.textToJSONString(this.worldCSS) + '",\n';
    lContent += '    actions: "' + cLib.textToJSONString(this.agent.actions) + '",\n';
    lContent += '    evaluations: "' + cLib.textToJSONString(this.agent.evaluations) + '",\n';
    lContent += '    searchAlgorithm: "' + lAlgo + '"\n';
    lContent += '  }\n';
    lContent += '}\n';
    return lContent;
  };
  cModel.prototype.updateWorldNow = function() {
    this.multiverse.resetFutures();
    this.actionSandbox.lastRunResult = null;
    var lEvaluation = this.evaluateWorld(null, this.multiverse.worldNow.worldHTML, this.agent.evaluations);
    this.multiverse.worldNow.evaluation = lEvaluation;
    if (this.multiverse.worldNow.evaluation.end || this.multiverse.worldNow.evaluation.goal || this.multiverse.worldNow.evaluation.illegal || this.multiverse.worldNow.evaluation.ignore) {
      this.multiverse.worldNow.futuresDetermined = true;
    } else {
      this.multiverse.worldNow.futuresDetermined = false;
    }
  };
  cModel.prototype.resetFutures = function() {
    this.multiverse.resetFutures();
    this.allUndeterminedFutures = [];
    this.updateWorldNow();
    /*
    if ((!this.multiverse.worldNow.evaluation.end) && 
        (!this.multiverse.worldNow.evaluation.goal) && 
        (!this.multiverse.worldNow.evaluation.illegal) &&
        (!this.multiverse.worldNow.evaluation.ignore)) {
      this.allUndeterminedFutures.push(this.multiverse.worldNow);
    }
    */
  };
  cModel.prototype.planNextUndeterminedFuture = function() {
    this.allUndeterminedFutures = [];
    var lFuture = null;
    if (this.searchAlgorithm == cModel.searchAlgorithms.msaBreadthFirst) {
      lFuture = this.multiverse.breadthFirstFuture();
    } else if (this.searchAlgorithm == cModel.searchAlgorithms.msaHighScoreFirst) {
      lFuture = this.multiverse.highScoreFuture();
    } else if (this.searchAlgorithm == cModel.searchAlgorithms.msaLeftSideFirst) {
      lFuture = this.multiverse.leftSideFuture();
    } else if (this.searchAlgorithm == cModel.searchAlgorithms.msaRightSideFirst) {
      lFuture = this.multiverse.rightSideFuture();
    }
    if (lFuture != null) {
      this.allUndeterminedFutures.push(lFuture);
    }
  };  
  cModel.prototype.completedDeterminingFutures = function() {
    if (this.multiverse.totalNumberOfFutures >= 1000) {
      this.allUndeterminedFutures = [];
    }
    return (this.allUndeterminedFutures.length == 0);
  };
  cModel.prototype.continueDeterminingFutures = function(aOptions) {
    var lMaxTimeMs = aOptions ? (( typeof aOptions.maxTimeMs != 'undefined') ? aOptions.maxTimeMs : 100) : 100;
    var lMaxTotalFutures = aOptions ? (( typeof aOptions.maxTotalFutures != 'undefined') ? aOptions.maxTotalFutures : 100) : 100;
    var lMaxDepth = aOptions ? (( typeof aOptions.maxDepth != 'undefined') ? aOptions.maxDepth : 5) : 5;
    var lFocusColumnNumber = aOptions ? (( typeof aOptions.focusColumnNumber != 'undefined') ? aOptions.focusColumnNumber : 0) : 0;
    var lStartDate = new Date();
    var lStartTimeMs = lStartDate.getTime();
    var lDate;
    var lTimeMs;
    var lFuture;
    var lRunResult;
    var lContinue = true;
    while (lContinue) {
      if (this.multiverse.totalNumberOfFutures >= lMaxTotalFutures) {
        this.allUndeterminedFutures = [];
      }
      if (this.allUndeterminedFutures.length > 0) {
        if (this.multiverse.totalNumberOfFutures < lMaxTotalFutures) {
          lFuture = this.allUndeterminedFutures[0];
          lFuture.modelData.removeFutureColumn = false;
          this.allUndeterminedFutures.splice(0, 1);
          if ((!lFuture.futuresDetermined) && (lFuture.level < lMaxDepth)) {
            lFuture.modelData.removeFutureColumn = (true && (Model.multiverse.columns.length > 1)); // per-mark future as to be removed.
            pSpawnedWorlds = [];
            this.resetActionSandboxChooseCallStack();
            lRunResult = this.runWorldInActionSandbox(lFuture.worldHTML, this.agent.actions);
            if (!(lRunResult.codeResult.syntaxError || lRunResult.codeResult.runError)) {
              if (lRunResult.validChoice) {
                for (var hi = 0; hi < pSpawnedWorlds.length; hi++) {
                  var lSameAsParentOrSibling = false;
                  /*
                  if (this.ignoreSameAsParentOrSibling) {
                    if (lFuture.sameAsWorld(pSpawnedWorlds[hi].html)) {
                      lSameAsParentOrSibling = true;
                    } else {
                      for (var si = 0; si < lFuture.futures.length; si++) {
                        if (lFuture.futures[si].sameAsWorld(pSpawnedWorlds[hi].html)) {
                          lSameAsParentOrSibling = true;
                          break;
                        }
                      }
                    }
                  }
                  */
                  var lEvaluation = this.evaluateWorld(lFuture, pSpawnedWorlds[hi].html, this.agent.evaluations);
                  if (!(lEvaluation.codeResult.syntaxError || lEvaluation.codeResult.runError)) {
                    if ((this.ignoreSameAsParentOrSibling) && ((lEvaluation.same) || (lSameAsParentOrSibling))) {
                      lEvaluation.ignore = true;
                    } else if (this.ignoreIllegalFutures && (lEvaluation.illegal)) {
                      lEvaluation.ignore = true;
                    }
                    if (lEvaluation.ignore) {
                      lFuture.modelData.removeFutureColumn = lFuture.modelData.removeFutureColumn;
                    } else {
                      lFuture.modelData.removeFutureColumn = false;
                      var lNewFuture = new cFuture();
                      lNewFuture.worldHTML = pSpawnedWorlds[hi].html;
                      lNewFuture.actionDescription = pSpawnedWorlds[hi].actionDescription;
                      lNewFuture.evaluation = lEvaluation;
                      if (lEvaluation.illegal || lEvaluation.end || lEvaluation.goal) {
                        lNewFuture.futuresDetermined = true;
                      }
                      if (lEvaluation.goal) {
                        this.newestGoalFuture = lNewFuture;
                      }
                      this.multiverse.addFuture(lNewFuture, lFuture, lFocusColumnNumber);
                    }
                  } else {
                    lContinue = false;
                  }
                }
                if (lContinue) {
                  pSpawnedWorlds = [];
                  var lChooseCallStack = this.getActionSandboxChooseCallStack();
                  var lContinueChoose = true;
                  while (lContinueChoose) {
                    var si = lChooseCallStack.length - 1;
                    var lAllDone = true;
                    while (si >= 0) {
                      var lChooseCall = lChooseCallStack[si];
                      lChooseCall.choiceIndex++;
                      if (lChooseCall.choiceIndex < lChooseCall.choiceCount) {
                        lAllDone = false;
                        break;
                      } else {
                        lChooseCall.choiceIndex = 0;
                      }
                      si--;
                    }
                    if (lAllDone) {
                      lContinueChoose = false;
                    } else {
                      this.resetActionSandboxChooseCallStackIndexAndValidChoice();
                      lRunResult = this.runWorldInActionSandbox(lFuture.worldHTML, this.agent.actions);
                      if (!(lRunResult.codeResult.syntaxError || lRunResult.codeResult.runError)) {
                        if (lRunResult.validChoice) {
                          for (var hi = 0; hi < pSpawnedWorlds.length; hi++) {
                            var lSameAsParentOrSibling = false;
                            /*
                            if (this.ignoreSameAsParentOrSibling) {
                              if (lFuture.sameAsWorld(pSpawnedWorlds[hi].html)) {
                                lSameAsParentOrSibling = true;
                              } else {
                                for (var si = 0; si < lFuture.futures.length; si++) {
                                  if (lFuture.futures[si].sameAsWorld(pSpawnedWorlds[hi].html)) {
                                    lSameAsParentOrSibling = true;
                                    break;
                                  }
                                }
                              }
                            }
                            */
                            var lEvaluation = this.evaluateWorld(lFuture, pSpawnedWorlds[hi].html, this.agent.evaluations);
                            if (!(lEvaluation.codeResult.syntaxError || lEvaluation.codeResult.runError)) {
                              if ((this.ignoreSameAsParentOrSibling) && ((lEvaluation.same) || (lSameAsParentOrSibling))) {
                                lEvaluation.ignore = true;
                              } else if (this.ignoreIllegalFutures && (lEvaluation.illegal)) {
                                lEvaluation.ignore = true;
                              }
                              if (lEvaluation.ignore) {
                                lFuture.modelData.removeFutureColumn = lFuture.modelData.removeFutureColumn;
                              } else {
                                lFuture.modelData.removeFutureColumn = false;
                                var lNewFuture = new cFuture();
                                lNewFuture.worldHTML = pSpawnedWorlds[hi].html;
                                lNewFuture.actionDescription = pSpawnedWorlds[hi].actionDescription;
                                lNewFuture.evaluation = lEvaluation;
                                if (lEvaluation.illegal || lEvaluation.end || lEvaluation.goal) {
                                  lNewFuture.futuresDetermined = true;
                                }
                                if (lEvaluation.goal) {
                                  this.newestGoalFuture = lNewFuture;
                                }
                                this.multiverse.addFuture(lNewFuture, lFuture, lFocusColumnNumber);
                              }
                            } else {
                              lContinueChoose = false;
                              lContinue = false;
                            }
                          }
                          if (this.multiverse.totalNumberOfFutures >= lMaxTotalFutures) {
                            lContinueChoose = false;
                            lContinue = false;
                          }
                        }
                      } else {
                        lContinueChoose = false;
                        lContinue = false;
                      }
                      pSpawnedWorlds = [];
                    }
                  }
                }
              }
            } else {
              lContinue = false;
            }
          }
          lFuture.futuresDetermined = true;
          if (lFuture.futures.length == 0) {
            if (lFuture.modelData.removeFutureColumn) {
              this.multiverse.removeFutureColumn(lFuture);
            }
          }
          lDate = new Date();
          lTimeMs = lDate.getTime();
          if ((lTimeMs - lStartTimeMs) > lMaxTimeMs) {
            lContinue = false;
          }
        } else {
          this.allUndeterminedFutures = [];
          lContinue = false;
        }
      } else {
        lContinue = false;
      }
    }
  };
})();
var Model = new cModel();
/*
  * Class cMainPagePanel
  */
function cMainPagePanel(aProperties) {
  cPanel.call(this, aProperties);
  var lThis = this;
  this.screen = aProperties.screen;
  this.scrollPanel = new cScrollboxPanel({
    align: eAlign.eClient,
    backgroundColor: 'transparent',
    boxBackgroundColor: '#262626',
    scrollBarHandleColor: '#666666',
    autoHideScrollbar: true
  });
  this.panels.push(this.scrollPanel);
  this.introPanel = new cPanel({
    align: eAlign.eNone,
    left: 0,
    top: 0,
    height: 620,
    width: 620,
    backgroundColor: '#333333',
    padding: 20
  });
  this.scrollPanel.panelBox.panels.push(this.introPanel);
  if (aProperties.logoImage)
  {
    this.introLogoPanel = new cPanel({
      align: eAlign.eNone,
      width: 393,
      height: 100,
      backgroundColor: 'transparent',
      image: this.screen.getImageClone(aProperties.logoImage),
      imageStretch: true
    });
    this.introPanel.panels.push(this.introLogoPanel);
  }
  this.introTextPanel = new cPanel({
    align: eAlign.eClient,
    backgroundColor: '#333333',
    color: '#ffffff',
    innerHTML: 
      'Problem Solver is a novel online problem-solver and problem-analyser for (JavaScript) programmers.\n' +
      'Load examples from the "EXAMPLES" menu\n' +
      'and look at the code in the "world",\n' +
      '"changes" and "evaluate" screens. \n' +
      'By default, Problem Solver is pre-loaded with the "Towers of Hanoi" example.<br />\n' +
      '<b>To see Problem Solver in action, go to the <span style="background-color: #777777;">&nbsp;multiverse&nbsp;</span> viewer and click\n' +
      '"<span style="color: #00bb00;">GO!</span>"</b><br />\n' +
      'Got a puzzle or problem to analyse? Follow these steps:\n' +
      '<ol>\n' +
      '  <li>Describe the <span style="background-color: #88cc66;">&nbsp;world&nbsp;</span> (situation) with HTML/CSS.</li>\n' +
      '  <li>Describe possible <span style="background-color: #88bbaa;">&nbsp;changes&nbsp;</span> using JavaScript/jQuery and the choose() method/plugin.</li>\n' +
      '  <li>Describe how you would <span style="background-color: #FFAE3C;">&nbsp;evaluate&nbsp;</span> a world using JavaScript/jQuery.</li>\n' +
      '  <li>Click <span style="color: #00bb00;">GO!</span> in the <span style="background-color: #777777;">&nbsp;multiverse&nbsp;</span> viewer.</li>\n' +
      '</ol>\n' +
      'You can then explore the "multiverse" to navigate through\n' +
      'the space of all future "worlds",\n' +
      'for all possible combinations of "changes".\n' +
      'Click on any world in the multiverse viewer to see the sequence of changes that preceded.<br />\n' +
      '<br />\n' +
      'In CS and AI this is known as the "game tree".\n' +
      'In Problem Solver this is called the "multiverse".\n'
  });
  this.introPanel.panels.push(this.introTextPanel);
  this.worldPanel = new cPanel({
    align: eAlign.eNone,
    left: 0,
    top: 420,
    height: 300,
    width: 300,
    backgroundColor: '#333333'
  });
  this.scrollPanel.panelBox.panels.push(this.worldPanel);
  this.worldPanel.imagePanel = new cPanel({
    align : eAlign.eNone,
    left : 50,
    top : 20,
    width : 200,
    height : 167,
    backgroundColor : 'transparent',
    image: this.screen.getImageClone(aProperties.viewWorldImageId),
    imageStretchWidth: 200,
    imageStretchHeight: 167,
    onClick: function() {
      var lSupportShortCut = false;
      if (lSupportShortCut) {
        aProperties.onWorldClick.call(aProperties.onWorldClick_This);
      }
    }
  });
  this.worldPanel.panels.push(this.worldPanel.imagePanel);
  this.worldPanel.textPanel = new cPanel({
    align : eAlign.eNone,
    left : 20,
    top : 210,
    width : 260,
    height : 100,
    backgroundColor : 'transparent',
    color: '#ffffff',
    fontSize: 19,
    innerHTML: '<span style="font-size: 22px; font-weight: bold;">STEP 1</span><br />Describe the "now" world with HTML and CSS.'
  });
  this.worldPanel.panels.push(this.worldPanel.textPanel);
  this.evaluationPanel = new cPanel({
    align: eAlign.eNone,
    left: 0,
    top: 740,
    height: 300,
    width: 300,
    backgroundColor: '#333333',
    color: '#ffffff'
  });
  this.scrollPanel.panelBox.panels.push(this.evaluationPanel);
  this.evaluationPanel.imagePanel = new cPanel({
    align : eAlign.eNone,
    left : 50,
    top : 20,
    width : 200,
    height : 167,
    backgroundColor : 'transparent',
    image: this.screen.getImageClone(aProperties.viewEvaluateImageId),
    imageStretchWidth: 200,
    imageStretchHeight: 167,
    onClick: function() {
      var lSupportShortCut = false;
      if (lSupportShortCut) {
        aProperties.onEvaluateClick.call(aProperties.onEvaluateClick_This);
      }
    }
  });
  this.evaluationPanel.panels.push(this.evaluationPanel.imagePanel);
  this.evaluationPanel.textPanel = new cPanel({
    align : eAlign.eNone,
    left : 20,
    top : 210,
    width : 260,
    height : 100,
    backgroundColor : 'transparent',
    color: '#ffffff',
    fontSize: 19,
    innerHTML: '<span style="font-size: 22px; font-weight: bold;">STEP 3</span><br />Evaluate a world using JavaScript / jQuery.'
  });
  this.evaluationPanel.panels.push(this.evaluationPanel.textPanel);
  this.actionsPanel = new cPanel({
    align: eAlign.eNone,
    left: 320,
    top: 420,
    height: 300,
    width: 300,
    backgroundColor: '#333333',
    color: '#ffffff'
  });
  this.scrollPanel.panelBox.panels.push(this.actionsPanel);
  this.actionsPanel.imagePanel = new cPanel({
    align : eAlign.eNone,
    left : 50,
    top : 20,
    width : 200,
    height : 167,
    backgroundColor : 'transparent',
    image: this.screen.getImageClone(aProperties.viewChangesImageId),
    imageStretchWidth: 200,
    imageStretchHeight: 167,
    onClick: function() {
      var lSupportShortCut = false;
      if (lSupportShortCut) {
        aProperties.onChangesClick.call(aProperties.onChangesClick_This);
      }
    }
  });
  this.actionsPanel.panels.push(this.actionsPanel.imagePanel);
  this.actionsPanel.textPanel = new cPanel({
    align : eAlign.eNone,
    left : 20,
    top : 210,
    width : 260,
    height : 100,
    backgroundColor : 'transparent',
    color: '#ffffff',
    fontSize: 19,
    innerHTML: '<span style="font-size: 22px; font-weight: bold;">STEP 2</span><br />Describe possible changes to a world with JavaScript / jQuery.'
  });
  this.actionsPanel.panels.push(this.actionsPanel.textPanel);
  this.multiversePanel = new cPanel({
    align: eAlign.eNone,
    left: 320,
    top: 740,
    height: 300,
    width: 300,
    backgroundColor: '#333333',
    color: '#ffffff'
  });
  this.scrollPanel.panelBox.panels.push(this.multiversePanel);
  this.multiversePanel.imagePanel = new cPanel({
    align : eAlign.eNone,
    left : 50,
    top : 20,
    width : 200,
    height : 167,
    backgroundColor : 'transparent',
    image: this.screen.getImageClone(aProperties.viewMultiverseImageId),
    imageStretchWidth: 200,
    imageStretchHeight: 167,
    onClick: function() {
      var lSupportShortCut = false;
      if (lSupportShortCut) {
        aProperties.onMultiverseClick.call(aProperties.onMultiverseClick_This);
      }
    }
  });
  this.multiversePanel.panels.push(this.multiversePanel.imagePanel);
  this.multiversePanel.textPanel = new cPanel({
    align : eAlign.eNone,
    left : 20,
    top : 210,
    width : 260,
    height : 100,
    backgroundColor : 'transparent',
    color: '#ffffff',
    fontSize: 19,
    innerHTML: '<span style="font-size: 22px; font-weight: bold;">STEP 4</span><br />Click GO! in the multiverse viewer.'
  });
  this.multiversePanel.panels.push(this.multiversePanel.textPanel);
}
cMainPagePanel.deriveFrom(cPanel);
(function() {
  cMainPagePanel.prototype.screen = null;
  cMainPagePanel.prototype.scrollPanel = null;
  cMainPagePanel.prototype.introPanel = null;
  cMainPagePanel.prototype.introLogoPanel = null;
  cMainPagePanel.prototype.introTextPanel = null;
  cMainPagePanel.prototype.worldPanel = null;
  cMainPagePanel.prototype.evaluationPanel = null;
  cMainPagePanel.prototype.actionsPanel = null;
  cMainPagePanel.prototype.multiversePanel = null;
  cMainPagePanel.prototype.render = function(aParentPanel, aParentElement, aClientRect) {
    cPanel.prototype.render.call(this, aParentPanel, aParentElement, aClientRect);
    if (this.element != null) {
      if (this.scrollPanel.panelBox.getInnerWidth() > 1280) {
        this.worldPanel.left = 640;
        this.worldPanel.top = 0;
        this.actionsPanel.left = 640 + 320;
        this.actionsPanel.top = 0;
        this.evaluationPanel.left = 640;
        this.evaluationPanel.top = 320;
        this.multiversePanel.left = 640 + 320;
        this.multiversePanel.top = 320;
      } else {
        this.worldPanel.left = 0;
        this.worldPanel.top = 640;
        this.actionsPanel.left = 320;
        this.actionsPanel.top = 640;
        this.evaluationPanel.left = 0;
        this.evaluationPanel.top = 960;
        this.multiversePanel.left = 320;
        this.multiversePanel.top = 960;
      }
    }
  };
})();
/*
  * Class cTextEditPanel
  */
function cTextEditPanel(aProperties) {
  cPanel.call(this, aProperties);
  this.textEditElement = null;
  this.initValue = aProperties ? (aProperties.value ? aProperties.value : '') : '';
  this.onChange = aProperties ? (aProperties.onChange ? aProperties.onChange : null) : null;
  this.onEdit = aProperties ? (aProperties.onEdit ? aProperties.onEdit : null) : null;
  this.readOnly = aProperties ? (aProperties.readOnly ? true : false) : false;
}
cTextEditPanel.deriveFrom(cPanel);
(function() {
  cTextEditPanel.prototype.textEditElement = null;
  cTextEditPanel.prototype.initValue = '';
  cTextEditPanel.prototype.onChange = null;
  cTextEditPanel.prototype.onEdit = null;
  cTextEditPanel.prototype.readOnly = false;
  cTextEditPanel.prototype.render = function(aParentPanel, aParentElement, aClientRect) {
    cPanel.prototype.render.call(this, aParentPanel, aParentElement, aClientRect);
    if (this.element != null) {
      if (this.textEditElement == null) {
        this.textEditElement = document.createElement('TEXTAREA');
        this.textEditElement.id = 'pnl_' + this.instanceId + '_' + this.innerId + '_textarea';
        this.element.appendChild(this.textEditElement);
        this.textEditElement.value = this.initValue;
        this.textEditElement.style.fontFamily = '"Courier New", Courier, monospace';
        this.textEditElement.style.fontSize = this.fontSize + 'px';
        this.textEditElement.style.whiteSpace = 'nowrap';
        this.textEditElement.style.overflow = 'auto';
        this.textEditElement.setAttribute('wrap', 'off');
        this.textEditElement.setAttribute('spellcheck', 'false');
        this.textEditElement.style.whiteSpace = 'pre'; // otherwise it eats leading spaces
        this.textEditElement.style.resize = 'none';
        this.textEditElement.style.position = 'absolute';
        this.textEditElement.style.left = '0px';
        this.textEditElement.style.top = '0px';
        this.textEditElement.style.margin = '0px';
        this.textEditElement.style.border = '1px solid black';
        this.textEditElement.style.color = this.color;
        this.textEditElement.style.backgroundColor = this.backgroundColor;
        this.textEditElement.style.paddingLeft = '4px';
        if (this.readOnly) {
          this.textEditElement.readOnly = true;
        } else {
        }
        if (this.onChange !== null) {
          this.textEditElement.onchange = this.onChange;
        }
        if (this.onEdit !== null) {
          this.textEditElement.onkeypress = this.onEdit;
        }
      }
      this.textEditElement.style.width = (this.getInnerWidth() - 8) + 'px'; // TODO: why 8?
      this.textEditElement.style.height = (this.getInnerHeight() - 6) + 'px'; // TODO: why 6?
    }
  };
  cTextEditPanel.prototype.getValue = function() {
    var lResult = '';
    if (this.textEditElement != null) {
      lResult = this.textEditElement.value;
    }
    return lResult;
  };
  cTextEditPanel.prototype.setValue = function(aValue) {
    if (this.textEditElement != null) {
      this.textEditElement.value = aValue;
    } else {
      this.initValue = aValue;
    }
  };
})();
/*
  * Class cAutoSpanPanel
  */
function cAutoSpanPanel(aProperties) {
  cPanel.call(this, aProperties);
  this.spanMethod = aProperties ? (aProperties.spanMethod ? aProperties.spanMethod : cAutoSpanPanel.spanMethod_auto) : cAutoSpanPanel.spanMethod_auto;
  this.separationMargin = aProperties ? (typeof aProperties.separationMargin != 'undefined' ? aProperties.separationMargin : 16) : 16;
}
cAutoSpanPanel.deriveFrom(cPanel);
(function() {
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
/*
  * Class cTextLineEditPanel
  */
function cTextLineEditPanel(aProperties) {
  cPanel.call(this, aProperties);
  this.textLineEditElement = null;
  this.initValue = aProperties ? (aProperties.value ? aProperties.value : '') : '';
  this.onChange = aProperties ? (aProperties.onChange ? aProperties.onChange : null) : null;
  this.onEdit = aProperties ? (aProperties.onEdit ? aProperties.onEdit : null) : null;
}
cTextLineEditPanel.deriveFrom(cPanel);
(function() {
  cTextLineEditPanel.prototype.textLineEditElement = null;
  cTextLineEditPanel.prototype.initValue = '';
  cTextLineEditPanel.prototype.onChange = null;
  cTextLineEditPanel.prototype.onEdit = null;
  cTextLineEditPanel.prototype.render = function(aParentPanel, aParentElement, aClientRect) {
    cPanel.prototype.render.call(this, aParentPanel, aParentElement, aClientRect);
    if (this.element != null) {
      if (this.textLineEditElement == null) {
        this.textLineEditElement = document.createElement('INPUT');
        this.textLineEditElement.type = 'text';
        this.textLineEditElement.id = 'pnl_' + this.instanceId + '_' + this.innerId + '_inputtext';
        this.element.appendChild(this.textLineEditElement);
        this.textLineEditElement.value = this.initValue;
        this.textLineEditElement.style.fontFamily = 'Calibri, Arial, helvetica, sans-serif';
        this.textLineEditElement.style.fontSize = this.fontSize + 'px';
        this.textLineEditElement.style.whiteSpace = 'nowrap';
        this.textLineEditElement.style.overflow = 'auto';
        this.textLineEditElement.setAttribute('wrap', 'off');
        this.textLineEditElement.style.whiteSpace = 'pre'; // otherwise it eats leading spaces
        this.textLineEditElement.style.resize = 'none';
        this.textLineEditElement.style.position = 'absolute';
        this.textLineEditElement.style.left = '0px';
        this.textLineEditElement.style.top = '0px';
        this.textLineEditElement.style.margin = '0px';
        this.textLineEditElement.style.border = '1px solid black';
        this.textLineEditElement.style.color = this.color;
        this.textLineEditElement.style.backgroundColor = this.backgroundColor;
        this.textLineEditElement.style.paddingLeft = '4px';
        if (this.onEdit !== null) {
          this.textLineEditElement.onchange = this.onEdit;
          this.textLineEditElement.onkeypress = this.onEdit;
          this.textLineEditElement.onpaste = this.onEdit;
          this.textLineEditElement.oninput = this.onEdit;
        } else if (this.onChange !== null) {
          this.textLineEditElement.onchange = this.onChange;
        }
      }
      this.textLineEditElement.style.width = (this.getInnerWidth() - 6) + 'px'; // TODO: why 8?
      this.textLineEditElement.style.height = (this.getInnerHeight() - 4) + 'px'; // TODO: why 6?
    }
  };
  cTextLineEditPanel.prototype.getValue = function() {
    var lResult = '';
    if (this.textLineEditElement != null) {
      lResult = this.textLineEditElement.value;
    }
    return lResult;
  };
  cTextLineEditPanel.prototype.setValue = function(aValue) {
    if (this.textLineEditElement != null) {
      this.textLineEditElement.value = aValue;
    }
  };
})();
/**
  * Class cMasterDetailPanel
  */
function cMasterDetailPanel(aProperties) {
  cPanel.call(this, aProperties);
  var lThis = this;
  var lScreen = aProperties.screen;
  this.data = aProperties ? (typeof aProperties.data != 'undefined' ? aProperties.data : new cDataArray()) : new cDataArray();
  this.lastItemId = 0;
  this.selectedItemId = 0;
  this.itemName = aProperties ? (typeof aProperties.itemName != 'undefined' ? aProperties.itemName : '') : '';
  this.mainPanel = new cAutoSpanPanel({
    align: eAlign.eClient,
    backgroundColor: 'transparent'
  });
  this.panels.push(this.mainPanel);
  this.mainPanel_Master = new cPanel({
    align: eAlign.eClient,
    backgroundColor: 'transparent'
  });
  this.mainPanel.panels.push(this.mainPanel_Master);
  this.mainPanel_DetailContainer = new cPanel({
    shape: cPanel.cShapeRoundRect,
    borderRadius: 12,
    align: eAlign.eClient,
    backgroundColor: '#b4b4b4',
    padding: 10
  });
  this.mainPanel.panels.push(this.mainPanel_DetailContainer);
  this.mainPanel_DetailContainer_root = new cPanel({
    align: eAlign.eClient,
    backgroundColor: 'transparent',
    innerHTML: '' // can be set through this.setRootPanelHTMLContent()
  });
  this.mainPanel_DetailContainer.panels.push(this.mainPanel_DetailContainer_root);
  this.mainPanel_DetailContainer_Panel = new cPanel({
    align: eAlign.eClient,
    backgroundColor: '#b4b4b4',
    visible: false // initialize as hidden
  });
  this.mainPanel_DetailContainer.panels.push(this.mainPanel_DetailContainer_Panel);
  this.mainPanel_DetailContainer_Panel_ControlPanel = new cPanel({
    align: eAlign.eTop,
    height: 51,
    backgroundColor: 'transparent',
    borderBottom: 1,
    borderColor: '#000000',
    paddingBottom: 8,
    marginBottom: 6
  });
  this.mainPanel_DetailContainer_Panel.panels.push(this.mainPanel_DetailContainer_Panel_ControlPanel);
  this.mainPanel_DetailContainer_Panel_ControlPanel_MoveUpPanel = new cPanel({
    shape: cPanel.cShapeRoundRect,
    borderRadius: 6,
    align: eAlign.eLeft,
    width: 110,
    padding: 4,
    marginRight: 10,
    backgroundColor: '#6d6d6d',
    onMouseUp: function() {
      if (lThis.selectedItemId > 0) {
        var lMoveOk = false;
        for (var li = 0; li < lThis.data.items.length; li++) {
          if (lThis.data.items[li].id == lThis.selectedItemId) {
            if (li > 0) {
              var lSwapItem = lThis.data.items[li];
              lThis.data.items[li] = lThis.data.items[li - 1];
              lThis.data.items[li - 1] = lSwapItem;
              lMoveOk = true;
            }
            break;
          }
        }
        if (lMoveOk) {
          for (var li = 0; li < lThis.mainPanel_Master_Scrollbox.panelBox.panels.length; li++) {
            if (lThis.mainPanel_Master_Scrollbox.panelBox.panels[li].itemId == lThis.selectedItemId) {
              if (li > 0) {
                lThis.mainPanel_Master_Scrollbox.panelBox.moveUpPanel(lThis.mainPanel_Master_Scrollbox.panelBox.panels[li]);
                lThis.mainPanel_Master_Scrollbox.scrollToPercentage((((li - 1) * 100) / lThis.mainPanel_Master_Scrollbox.panelBox.panels.length));
              }
              break;
            }
          }
          lThis.selectItemId(lThis.selectedItemId);
          lScreen.panel.rerender();
        }
      }
    }
  });
  this.mainPanel_DetailContainer_Panel_ControlPanel.panels.push(this.mainPanel_DetailContainer_Panel_ControlPanel_MoveUpPanel);
  this.mainPanel_DetailContainer_Panel_ControlPanel_MoveUpPanel_Button = new cPanel({
    align: eAlign.eLeft,
    width: 28,
    backgroundColor: 'transparent',
    image: lScreen.getImageClone(aProperties.upImage),
    imageStretch: true
  });
  this.mainPanel_DetailContainer_Panel_ControlPanel_MoveUpPanel.panels.push(this.mainPanel_DetailContainer_Panel_ControlPanel_MoveUpPanel_Button);
  this.mainPanel_DetailContainer_Panel_ControlPanel_MoveUpPanel_Label = new cPanel({
    align: eAlign.eClient,
    marginLeft: 6,
    paddingTop: 1,
    color: '#ffffff',
    backgroundColor: 'transparent',
    innerHTML: 'up',
    fontSize: 20,
    fontBold: true,
    noWrap: true
  });
  this.mainPanel_DetailContainer_Panel_ControlPanel_MoveUpPanel.panels.push(this.mainPanel_DetailContainer_Panel_ControlPanel_MoveUpPanel_Label);
  this.mainPanel_DetailContainer_Panel_ControlPanel_MoveDownPanel = new cPanel({
    shape: cPanel.cShapeRoundRect,
    borderRadius: 6,
    align: eAlign.eLeft,
    width: 110,
    padding: 4,
    marginRight: 10,
    backgroundColor: '#6d6d6d',
    onMouseUp: function() {
      if (lThis.selectedItemId > 0) {
        var lMoveOk = false;
        for (var li = 0; li < lThis.data.items.length; li++) {
          if (lThis.data.items[li].id == lThis.selectedItemId) {
            if (li < (lThis.data.items.length - 1)) {
              var lSwapItem = lThis.data.items[li];
              lThis.data.items[li] = lThis.data.items[li + 1];
              lThis.data.items[li + 1] = lSwapItem;
              lMoveOk = true;
            }
            break;
          }
        }
        if (lMoveOk) {
          for (var li = 0; li < lThis.mainPanel_Master_Scrollbox.panelBox.panels.length; li++) {
            if (lThis.mainPanel_Master_Scrollbox.panelBox.panels[li].itemId == lThis.selectedItemId) {
              if (li < (lThis.mainPanel_Master_Scrollbox.panelBox.panels.length - 1)) {
                lThis.mainPanel_Master_Scrollbox.panelBox.moveDownPanel(lThis.mainPanel_Master_Scrollbox.panelBox.panels[li]);
                lThis.mainPanel_Master_Scrollbox.scrollToPercentage((((li + 1) * 100) / lThis.mainPanel_Master_Scrollbox.panelBox.panels.length));
              }
              break;
            }
          }
          lThis.selectItemId(lThis.selectedItemId);
          lScreen.panel.rerender();
        }
      }
    }
  });
  this.mainPanel_DetailContainer_Panel_ControlPanel.panels.push(this.mainPanel_DetailContainer_Panel_ControlPanel_MoveDownPanel);
  this.mainPanel_DetailContainer_Panel_ControlPanel_MoveDownPanel_Button = new cPanel({
    align: eAlign.eLeft,
    width: 28,
    backgroundColor: 'transparent',
    image: lScreen.getImageClone(aProperties.downImage),
    imageStretch: true
  });
  this.mainPanel_DetailContainer_Panel_ControlPanel_MoveDownPanel.panels.push(this.mainPanel_DetailContainer_Panel_ControlPanel_MoveDownPanel_Button);
  this.mainPanel_DetailContainer_Panel_ControlPanel_MoveDownPanel_Label = new cPanel({
    align: eAlign.eClient,
    marginLeft: 6,
    paddingTop: 1,
    color: '#ffffff',
    backgroundColor: 'transparent',
    innerHTML: 'down',
    fontSize: 20,
    fontBold: true,
    noWrap: true
  });
  this.mainPanel_DetailContainer_Panel_ControlPanel_MoveDownPanel.panels.push(this.mainPanel_DetailContainer_Panel_ControlPanel_MoveDownPanel_Label);
  this.mainPanel_DetailContainer_Panel_ControlPanel_DeletePanel = new cPanel({
    shape: cPanel.cShapeRoundRect,
    borderRadius: 6,
    align: eAlign.eLeft,
    width: 110,
    padding: 4,
    marginRight: 10,
    backgroundColor: '#6d6d6d',
    onMouseUp: function() {
      if (lThis.selectedItemId > 0) {
        for (var li = 0; li < lThis.data.items.length; li++) {
          if (lThis.data.items[li].id == lThis.selectedItemId) {
            lThis.data.items.splice(li, 1);
            break;
          }
        }
        for (var li = 0; li < lThis.mainPanel_Master_Scrollbox.panelBox.panels.length; li++) {
          if (lThis.mainPanel_Master_Scrollbox.panelBox.panels[li].itemId == lThis.selectedItemId) {
            lThis.mainPanel_Master_Scrollbox.panelBox.removePanel(lThis.mainPanel_Master_Scrollbox.panelBox.panels[li]);
            break;
          }
        }
        lThis.selectItemId(0);
        lScreen.panel.rerender();
      }
    }
  });
  this.mainPanel_DetailContainer_Panel_ControlPanel.panels.push(this.mainPanel_DetailContainer_Panel_ControlPanel_DeletePanel);
  this.mainPanel_DetailContainer_Panel_ControlPanel_DeletePanel_Button = new cPanel({
    align: eAlign.eLeft,
    width: 28,
    backgroundColor: 'transparent',
    image: lScreen.getImageClone(aProperties.deleteImage),
    imageStretch: true
  });
  this.mainPanel_DetailContainer_Panel_ControlPanel_DeletePanel.panels.push(this.mainPanel_DetailContainer_Panel_ControlPanel_DeletePanel_Button);
  this.mainPanel_DetailContainer_Panel_ControlPanel_DeletePanel_Label = new cPanel({
    align: eAlign.eClient,
    marginLeft: 6,
    paddingTop: 1,
    color: '#ffffff',
    backgroundColor: 'transparent',
    innerHTML: 'delete',
    fontSize: 20,
    fontBold: true,
    noWrap: true
  });
  this.mainPanel_DetailContainer_Panel_ControlPanel_DeletePanel.panels.push(this.mainPanel_DetailContainer_Panel_ControlPanel_DeletePanel_Label);
  this.mainPanel_DetailContainer_Panel_ControlPanel_HidePanel = new cPanel({
    align: eAlign.eRight,
    width: 37,
    backgroundColor: 'transparent',
    image: lScreen.getImageClone(aProperties.closeImage),
    imageStretch: true,
    onMouseUp: function() {
      lThis.selectItemId(0);
    }
  });
  this.mainPanel_DetailContainer_Panel_ControlPanel.panels.push(this.mainPanel_DetailContainer_Panel_ControlPanel_HidePanel);
  this.mainPanel_DetailContainer_Panel_NamePanel = new cPanel({
    align: eAlign.eTop,
    height: 40,
    backgroundColor: 'transparent'
  });
  this.mainPanel_DetailContainer_Panel.panels.push(this.mainPanel_DetailContainer_Panel_NamePanel);
  this.mainPanel_DetailContainer_Panel_NamePanel_Label = new cPanel({
    align: eAlign.eLeft,
    width: 90,
    color: '#ffffff',
    backgroundColor: 'transparent',
    fontSize: 24,
    fontBold: true,
    innerHTML: 'name:'
  });
  this.mainPanel_DetailContainer_Panel_NamePanel.panels.push(this.mainPanel_DetailContainer_Panel_NamePanel_Label);
  this.mainPanel_DetailContainer_Panel_NamePanel_Name = new cTextLineEditPanel({
    align: eAlign.eClient,
    color: '#000000',
    backgroundColor: '#ffffff',
    fontSize: 24,
    value: '',
    onEdit: function() {
      if (lThis.selectedItemId > 0) {
        var lItem = null;
        for (var li = 0; li < lThis.data.items.length; li++) {
          if (lThis.data.items[li].id == lThis.selectedItemId) {
            lItem = lThis.data.items[li];
            break;
          }
        }
        if (lItem != null) {
          lItem.name = lThis.mainPanel_DetailContainer_Panel_NamePanel_Name.getValue();
          var lItemButtonPanel = lThis.mainPanel_Master_Scrollbox.panelBox;
          for (var bi = 0; bi < lItemButtonPanel.panels.length; bi++) {
            if (lItemButtonPanel.panels[bi].itemId == lThis.selectedItemId) {
              lItemButtonPanel.panels[bi].setInnerHTML(cLib.textToHTML(lItem.name));
              break;
            }
          }
        }
      }
    }
  });
  this.mainPanel_DetailContainer_Panel_NamePanel.panels.push(this.mainPanel_DetailContainer_Panel_NamePanel_Name);
  this.mainPanel_DetailContainer_Panel_ContentLabel = new cPanel({
    align: eAlign.eTop,
    height: 45,
    marginTop: 10,
    color: '#ffffff',
    backgroundColor: 'transparent',
    fontSize: 24,
    fontBold: true,
    innerHTML: 'definition:'
  });
  this.mainPanel_DetailContainer_Panel.panels.push(this.mainPanel_DetailContainer_Panel_ContentLabel);
  this.mainPanel_DetailContainer_Panel_Content = new cTextEditPanel({
    align: eAlign.eClient,
    color: '#dddddd',
    backgroundColor: '#333333',
    fontSize: 16,
    value: '',
    onChange: function() {
      if (lThis.selectedItemId > 0) {
        var lItem = null;
        for (var li = 0; li < lThis.data.items.length; li++) {
          if (lThis.data.items[li].id == lThis.selectedItemId) {
            lItem = lThis.data.items[li];
            break;
          }
        }
        if (lItem != null) {
          lItem.content = lThis.mainPanel_DetailContainer_Panel_Content.getValue();
        }
      }
    }
  });
  this.mainPanel_DetailContainer_Panel.panels.push(this.mainPanel_DetailContainer_Panel_Content);  
  this.mainPanel_Master_Menu = new cPanel({
    align: eAlign.eTop,
    height: 70,
    paddingBottom: 10,
    backgroundColor: 'transparent'
  });
  this.mainPanel_Master.panels.push(this.mainPanel_Master_Menu);
  this.mainPanel_Master_Menu_ButtonAdd = new cPanel({
    shape: cPanel.cShapeRoundRect,
    borderRadius: 12,
    align: eAlign.eClient,
    width: 200,
    padding: 6,
    backgroundColor: '#6d6d6d', //'#575757'
    onMouseUp: function() {
      lThis.lastItemId++;
      var lItem = new cDataItem({
        id: lThis.lastItemId,
        name: lThis.itemName + ' ' + lThis.lastItemId,
        content: ''
      });
      lThis.data.items.push(lItem);
      var lItemPanel = new cPanel({
        shape: cPanel.cShapeRoundRect,
        borderRadius: 12,
        border: 1,
        borderColor: '#000000',
        align: eAlign.eTop,
        height: 60,
        backgroundColor: '#6d6d6d',
        marginTop: 6,
        marginLeft: 6,
        marginRight: 6,
        padding: 10,
        color: '#ffffff',
        fontSize: 24,
        fontBold: true,
        noWrap: true,
        innerHTML: cLib.textToHTML(lItem.name),
        onMouseUp: function() {
          if (lThis.selectedItemId == this.itemId) {
            lThis.selectItemId(0);
          } else {
            lThis.selectItemId(this.itemId);
          }
        }
      });
      lItemPanel.itemId = lThis.lastItemId;
      lThis.mainPanel_Master_Scrollbox.panelBox.panels.push(lItemPanel);
      lScreen.panel.rerender();
      lThis.mainPanel_Master_Scrollbox.scrollToBottom();
      lThis.selectItemId(lThis.lastItemId);
    }
  });
  this.mainPanel_Master_Menu.panels.push(this.mainPanel_Master_Menu_ButtonAdd);
  this.mainPanel_Master_Menu_ButtonAdd.panels.push(new cPanel({
    align: eAlign.eLeft,
    width: 58,
    marginLeft: 10,
    backgroundColor: 'transparent',
    image: lScreen.getImageClone(aProperties.addImage),
    imageStretch: true
  }));
  this.mainPanel_Master_Menu_ButtonAdd.panels.push(new cPanel({
    align: eAlign.eClient,
    marginLeft: 6,
    paddingTop: 6,
    color: '#ffffff',
    backgroundColor: 'transparent',
    innerHTML: 'new ' + this.itemName,
    fontSize: 24,
    fontBold: true,
    noWrap: true
  }));
  this.mainPanel_Master_Scrollbox = new cScrollboxPanel({
    align: eAlign.eClient,
    backgroundColor: 'transparent',
    boxBackgroundColor: '#b4b4b4',
    scrollBarHandleColor: '#6d6d6d',
    autoHideScrollbar: true
  });
  this.mainPanel_Master.panels.push(this.mainPanel_Master_Scrollbox);  
}
cMasterDetailPanel.deriveFrom(cPanel);
(function() {
  cMasterDetailPanel.prototype.data = null;
  cMasterDetailPanel.prototype.lastItemId = 0;
  cMasterDetailPanel.prototype.selectedItemId = 0;
  cMasterDetailPanel.prototype.itemName = 'item';
  cMasterDetailPanel.prototype.mainPanel = null;
  cMasterDetailPanel.prototype.mainPanel_Master = null;
  cMasterDetailPanel.prototype.mainPanel_Master_Menu = null;
  cMasterDetailPanel.prototype.mainPanel_Master_Menu_ButtonAdd = null;
  cMasterDetailPanel.prototype.mainPanel_Master_Scrollbox = null;
  cMasterDetailPanel.prototype.mainPanel_DetailContainer = null;
  cMasterDetailPanel.prototype.mainPanel_DetailContainer_root = null;
  cMasterDetailPanel.prototype.mainPanel_DetailContainer_Panel = null;
  cMasterDetailPanel.prototype.mainPanel_DetailContainer_Panel_ControlPanel = null;
  cMasterDetailPanel.prototype.mainPanel_DetailContainer_Panel_ControlPanel_MoveUpPanel = null;
  cMasterDetailPanel.prototype.mainPanel_DetailContainer_Panel_ControlPanel_MoveUpPanel_Button = null;
  cMasterDetailPanel.prototype.mainPanel_DetailContainer_Panel_ControlPanel_MoveUpPanel_Label = null;
  cMasterDetailPanel.prototype.mainPanel_DetailContainer_Panel_ControlPanel_MoveDownPanel = null;
  cMasterDetailPanel.prototype.mainPanel_DetailContainer_Panel_ControlPanel_MoveDownPanel_Button = null;
  cMasterDetailPanel.prototype.mainPanel_DetailContainer_Panel_ControlPanel_MoveDownPanel_Label = null;
  cMasterDetailPanel.prototype.mainPanel_DetailContainer_Panel_ControlPanel_DeletePanel = null;
  cMasterDetailPanel.prototype.mainPanel_DetailContainer_Panel_ControlPanel_DeletePanel_Button = null;
  cMasterDetailPanel.prototype.mainPanel_DetailContainer_Panel_ControlPanel_DeletePanel_Label = null;
  cMasterDetailPanel.prototype.mainPanel_DetailContainer_Panel_ControlPanel_HidePanel = null;
  cMasterDetailPanel.prototype.mainPanel_DetailContainer_Panel_NamePanel = null;
  cMasterDetailPanel.prototype.mainPanel_DetailContainer_Panel_NamePanel_Label = null;
  cMasterDetailPanel.prototype.mainPanel_DetailContainer_Panel_NamePanel_Name = null;
  cMasterDetailPanel.prototype.mainPanel_DetailContainer_Panel_ContentLabel = null;
  cMasterDetailPanel.prototype.mainPanel_DetailContainer_Panel_Content = null;
  cMasterDetailPanel.prototype.selectItemId = function(aId) {
    this.selectedItemId = 0;
    this.mainPanel_DetailContainer_Panel.hide();
    var lItemButtonPanel = this.mainPanel_Master_Scrollbox.panelBox;
    for (var bi = 0; bi < lItemButtonPanel.panels.length; bi++) {
      lItemButtonPanel.panels[bi].setBackgroundColor('#6d6d6d');
    }
    if (aId > 0) {
      var lItem = null;
      for (var li = 0; li < this.data.items.length; li++) {
        if (this.data.items[li].id == aId) {
          lItem = this.data.items[li];
          break;
        }
      }
      if (lItem != null) {
        this.selectedItemId = aId;
        for (var bi = 0; bi < lItemButtonPanel.panels.length; bi++) {
          if (lItemButtonPanel.panels[bi].itemId == aId) {
            lItemButtonPanel.panels[bi].setBackgroundColor('#404040');
            break;
          }
        }
        this.mainPanel_DetailContainer_Panel_NamePanel_Name.setValue(lItem.name);
        this.mainPanel_DetailContainer_Panel_Content.setValue(lItem.content);
        this.mainPanel_DetailContainer_Panel.show();
      }
    }
    this.mainPanel_DetailContainer_Panel.rerender();
  };
  cMasterDetailPanel.prototype.setRootPanelHTMLContent = function(aHTMLContent) {
    this.mainPanel_DetailContainer_root.setInnerHTML(aHTMLContent);
  };
})();
/**
  * Class cViewWorldPanel
  */
function cViewWorldPanel(aProperties) {
  cPanel.call(this, aProperties);
  var lThis = this;
  this.onEditWorld = aProperties.onEditWorld;
  this.onEditWorld_This = aProperties.onEditWorld_This;
  this.screen = aProperties.screen;
  this.viewWorld = new cAutoSpanPanel({
    align: eAlign.eClient,
    backgroundColor: 'transparent'
  });
  this.panels.push(this.viewWorld);
  this.viewWorld_Edit_Master = new cAutoSpanPanel({
    align: eAlign.eClient,
    backgroundColor: 'transparent',
    spanMethod: cAutoSpanPanel.spanMethod_vertical
  });
  this.viewWorld.panels.push(this.viewWorld_Edit_Master);
  this.viewWorld_Edit_Master_HTML = new cPanel({
    align: eAlign.eClient,
    backgroundColor: 'transparent'
  });
  this.viewWorld_Edit_Master.panels.push(this.viewWorld_Edit_Master_HTML);
  this.viewWorld_Edit_Master_HTML_Header = new cPanel({
    align: eAlign.eTop,
    height: 40,
    backgroundColor: 'transparent',
    innerHTML: '<b>HTML body</b>'
  });
  this.viewWorld_Edit_Master_HTML.panels.push(this.viewWorld_Edit_Master_HTML_Header);
  this.viewWorld_Edit_Master_HTML_Edit = new cTextEditPanel({
    align: eAlign.eClient,
    color: '#dddddd',
    backgroundColor: '#333333',
    fontSize: 16,
    value: '',
    onChange: function() {
      Model.setWorldNowHTML(lThis.viewWorld_Edit_Master_HTML_Edit.getValue());
      lThis.updateWorld();
    }
  });
  this.viewWorld_Edit_Master_HTML.panels.push(this.viewWorld_Edit_Master_HTML_Edit);
  this.viewWorld_Edit_Master_CSS = new cPanel({
    align: eAlign.eClient,
    backgroundColor: 'transparent'
  });
  this.viewWorld_Edit_Master.panels.push(this.viewWorld_Edit_Master_CSS);
  this.viewWorld_Edit_Master_CSS_Header = new cPanel({
    align: eAlign.eTop,
    height: 40,
    backgroundColor: 'transparent',
    innerHTML: '<b>CSS</b>'
  });
  this.viewWorld_Edit_Master_CSS.panels.push(this.viewWorld_Edit_Master_CSS_Header);
  this.viewWorld_Edit_Master_CSS_Edit = new cTextEditPanel({
    align: eAlign.eClient,
    color: '#dddddd',
    backgroundColor: '#333333',
    fontSize: 16,
    value: '',
    onChange: function() {
      Model.setWorldCSS(lThis.viewWorld_Edit_Master_CSS_Edit.getValue());
      lThis.updateWorld();
    }
  });
  this.viewWorld_Edit_Master_CSS.panels.push(this.viewWorld_Edit_Master_CSS_Edit);
  this.viewWorld_Edit_Detail = new cAutoSpanPanel({
    align: eAlign.eClient,
    backgroundColor: 'transparent',
    spanMethod: cAutoSpanPanel.spanMethod_vertical
  });
  this.viewWorld.panels.push(this.viewWorld_Edit_Detail);
  this.viewWorld_Edit_Detail_Document = new cPanel({
    align: eAlign.eClient,
    backgroundColor: 'transparent'
  });
  this.viewWorld_Edit_Detail.panels.push(this.viewWorld_Edit_Detail_Document);    
  this.viewWorld_Edit_Detail_Document_Header = new cPanel({
    align: eAlign.eTop,
    height: 40,
    backgroundColor: 'transparent'
  });
  this.viewWorld_Edit_Detail_Document.panels.push(this.viewWorld_Edit_Detail_Document_Header);
  this.viewWorld_Edit_Detail_Document_Header_Caption = new cPanel({
    align: eAlign.eLeft,
    width: 80,
    backgroundColor: 'transparent',
    innerHTML: '<b>World</b>'
  });
  this.viewWorld_Edit_Detail_Document_Header.panels.push(this.viewWorld_Edit_Detail_Document_Header_Caption);
  this.viewWorld_Edit_Detail_Document_Header_Refresh = new cPanel({
    align: eAlign.eLeft,
    width: 34,
    marginBottom: 6,
    backgroundColor: 'transparent',
    image: this.screen.getImageClone(aProperties.refreshImage),
    imageStretch: true,
    onClick: function() {
      lThis.updateWorld();
    }
  });
  this.viewWorld_Edit_Detail_Document_Header.panels.push(this.viewWorld_Edit_Detail_Document_Header_Refresh);    
  this.viewWorld_Edit_Detail_Document_View = new cIFramePanel({
    align: eAlign.eClient,
    backgroundColor: 'transparent',
    border: 1,
    borderColor: '#000000',
    iFrameHTML: '',
    supportScroll: true,
    zoom: 1
  });
  this.viewWorld_Edit_Detail_Document.panels.push(this.viewWorld_Edit_Detail_Document_View);  
/*
  this.viewWorld_Edit_Detail_Help = new cPanel({
    align: eAlign.eClient,
    backgroundColor: 'transparent'
  });
  this.viewWorld_Edit_Detail.panels.push(this.viewWorld_Edit_Detail_Help);    
  this.viewWorld_Edit_Detail_Help_Header = new cPanel({
    align: eAlign.eTop,
    height: 40,
    backgroundColor: 'transparent'
  });
  this.viewWorld_Edit_Detail_Help.panels.push(this.viewWorld_Edit_Detail_Help_Header);
  this.viewWorld_Edit_Detail_Help_Header_Caption = new cPanel({
    align: eAlign.eLeft,
    width: 300,
    backgroundColor: 'transparent',
    innerHTML: '<b>Problem Solver World documentation</b>'
  });
  this.viewWorld_Edit_Detail_Help_Header.panels.push(this.viewWorld_Edit_Detail_Help_Header_Caption);
  this.viewWorld_Edit_Detail_Help_View = new cPanel({
    align: eAlign.eClient,
    backgroundColor: 'transparent'
  });
  this.viewWorld_Edit_Detail_Help.panels.push(this.viewWorld_Edit_Detail_Help_View);
  this.viewWorld_Edit_Detail_Help_View_scrollPanel = null;
  this.viewWorld_Edit_Detail_Help_View_scrollPanel = new cScrollboxPanel({
    align: eAlign.eClient,
    backgroundColor: 'transparent',
    boxBackgroundColor: '#ffeead',
    scrollBarHandleColor: '#666666',
    autoHideScrollbar: true
  });
  this.viewWorld_Edit_Detail_Help_View.panels.push(this.viewWorld_Edit_Detail_Help_View_scrollPanel);  
  this.viewWorld_Edit_Detail_Help_View_scrollPanel_content = new cPanel({
    align: eAlign.eTop,
    height: 1000,
    padding: 20,
    backgroundColor: 'transparent',
    textSelectable: true,
    innerHTML:
      '<div style="position: static; font-size: 32px; font-weight: bold;">\n' +
      '  World\n' +
      '</div>\n' +
      'A "world" is a HTML document that represents a situation or state.\n' +
      'Here you can enter the HTML code for the body of the document. \n' +
      'The CSS code is simply for styling the document.<br />\n' +
      'When modelling the world as HTML code, make sure that the content is easily manipulatable with JavaScript / jQuery.<br />\n' +
      'Manipulations can be entered in the "changes" screen.\n' +
      '\n' +
      '\n' +
      '\n' +
      '\n' +
      '\n' +
      '\n' +
      '\n'
  });
  this.viewWorld_Edit_Detail_Help_View_scrollPanel.panelBox.panels.push(this.viewWorld_Edit_Detail_Help_View_scrollPanel_content);
  */
}
cViewWorldPanel.deriveFrom(cPanel);
(function() {
  cViewWorldPanel.prototype.screen = null;
  cViewWorldPanel.prototype.viewWorld = null;
  cViewWorldPanel.prototype.viewWorld_Edit_Master = null;
  cViewWorldPanel.prototype.viewWorld_Edit_Master_HTML = null;
  cViewWorldPanel.prototype.viewWorld_Edit_Master_HTML_Header = null;
  cViewWorldPanel.prototype.viewWorld_Edit_Master_HTML_Edit = null;
  cViewWorldPanel.prototype.viewWorld_Edit_Master_CSS = null;
  cViewWorldPanel.prototype.viewWorld_Edit_Master_CSS_Header = null;
  cViewWorldPanel.prototype.viewWorld_Edit_Master_CSS_Edit = null;
  cViewWorldPanel.prototype.viewWorld_Edit_Detail = null;
  cViewWorldPanel.prototype.viewWorld_Edit_Detail_Document = null;
  cViewWorldPanel.prototype.viewWorld_Edit_Detail_Document_Header = null;
  cViewWorldPanel.prototype.viewWorld_Edit_Detail_Document_Header_Caption = null;
  cViewWorldPanel.prototype.viewWorld_Edit_Detail_Document_Header_Refresh = null;
  cViewWorldPanel.prototype.viewWorld_Edit_Detail_Document_View = null;
  cViewWorldPanel.prototype.viewWorld_Edit_Detail_Help = null;
  cViewWorldPanel.prototype.viewWorld_Edit_Detail_Help_Header = null;
  cViewWorldPanel.prototype.viewWorld_Edit_Detail_Help_Header_Caption = null;
  cViewWorldPanel.prototype.viewWorld_Edit_Detail_Help_View = null;
  cViewWorldPanel.prototype.viewWorld_Edit_Detail_Help_View_scrollPanel = null;
  cViewWorldPanel.prototype.viewWorld_Edit_Detail_Help_View_scrollPanel_content = null;
  cViewWorldPanel.prototype.onEditWorld = null;
  cViewWorldPanel.prototype.onEditWorld_This = null;
  cViewWorldPanel.prototype.reloadWorld = function() {
    if (this.viewWorld_Edit_Master_HTML_Edit) {
      this.viewWorld_Edit_Master_HTML_Edit.setValue(Model.getWorldNowHTML());
    }
    if (this.viewWorld_Edit_Master_CSS_Edit) {
      this.viewWorld_Edit_Master_CSS_Edit.setValue(Model.getWorldCSS());
    }
    this.updateWorld();
  };
  cViewWorldPanel.prototype.updateWorld = function() {
    if (this.viewWorld_Edit_Detail_Document_View) {
      var lThis = this;
      setTimeout(function() {
        var lFullHTML = Model.getWorldNowFullHTML();
        lThis.viewWorld_Edit_Detail_Document_View.setContent(lFullHTML);
        if (lThis.onEditWorld) {
          if (lThis.onEditWorld_This) {
            lThis.onEditWorld.apply(lThis.onEditWorld_This, []);
          } else {
            lThis.onEditWorld();
          }
        }
      }, 100);
    }
  };
})();
/**
  * Class cViewChangesPanel
  */
function cViewChangesPanel(aProperties) {
  cPanel.call(this, aProperties);
  var lThis = this;
  this.screen = aProperties.screen;
  this.viewChanges = new cAutoSpanPanel({
    align: eAlign.eClient,
    backgroundColor: 'transparent'
  });
  this.panels.push(this.viewChanges);
  this.viewChanges_Edit_Master_Actions = new cPanel({
    align: eAlign.eClient,
    backgroundColor: 'transparent'
  });
  this.viewChanges.panels.push(this.viewChanges_Edit_Master_Actions);
  this.viewChanges_Edit_Master_Actions_Header = new cPanel({
    align: eAlign.eTop,
    height: 40,
    backgroundColor: 'transparent',
    innerHTML: '<b>Changes (JavaScript/jQuery)</b>'
  });
  this.viewChanges_Edit_Master_Actions.panels.push(this.viewChanges_Edit_Master_Actions_Header);
  this.viewChanges_Edit_Master_Actions_Edit = new cTextEditPanel({
    align: eAlign.eClient,
    color: '#dddddd',
    backgroundColor: '#333333',
    fontSize: 16,
    value: '',
    onChange: function() {
      Model.setActions(lThis.viewChanges_Edit_Master_Actions_Edit.getValue());
    }
  });
  this.viewChanges_Edit_Master_Actions.panels.push(this.viewChanges_Edit_Master_Actions_Edit);
  this.viewChanges_Edit_Detail = new cPanel({
    align: eAlign.eClient,
    backgroundColor: 'transparent'
  });
  this.viewChanges.panels.push(this.viewChanges_Edit_Detail);    
  this.viewChanges_Edit_Detail_Header = new cPanel({
    align: eAlign.eTop,
    height: 40,
    backgroundColor: 'transparent',
    innerHTML: '<b>Problem Solver Changes API documentation</b>'
  });
  this.viewChanges_Edit_Detail.panels.push(this.viewChanges_Edit_Detail_Header);
  this.viewChanges_Edit_Detail_View = new cPanel({
    align: eAlign.eClient,
    backgroundColor: 'transparent'
  });
  this.viewChanges_Edit_Detail.panels.push(this.viewChanges_Edit_Detail_View);
  this.viewChanges_Edit_Detail_View_scrollPanel = new cScrollboxPanel({
    align: eAlign.eClient,
    backgroundColor: 'transparent',
    boxBackgroundColor: '#ffeead', //'#ffffff', //  '#96ceb4',
    scrollBarHandleColor: '#666666',
    autoHideScrollbar: true
  });
  this.viewChanges_Edit_Detail_View.panels.push(this.viewChanges_Edit_Detail_View_scrollPanel);
  this.viewChanges_Edit_Detail_View_scrollPanel_content = new cPanel({
    align: eAlign.eTop,
    height: 4000,
    padding: 20,
    backgroundColor: 'transparent',
    textSelectable: true,
    innerHTML:
      '<div style="position: static; font-size: 32px; font-weight: bold;">\n' +
      '  Changes\n' +
      '</div>\n' +
      'The "changes" define the voluntary and involuntary actions - the dynamic rules of the game.\n' +
      'The code entered here is applied to a world (world = HTML document), and the purpose of this\n' +
      'code is to create new worlds - new possible worlds which may succeed the current world.\n' +
      'This code is then applied to those new worlds too, and so on. This results in many worlds,\n' +
      'branching out like a tree, growing exponentially. The tree of all these possible worlds is\n' + 
      'called the "multiverse". The term "multiverse" is borrowed from quantum mechanics,\n' +
      'because of the similarities to the\n' +
      '<a href="http://en.wikipedia.org/wiki/Many-worlds_interpretation" target="_blank">many-worlds interpretation</a>.\n' +
      'The multiverse is also similar to the\n' +
      '<a href="http://en.wikipedia.org/wiki/Game_tree" target="_blank">game tree</a> in\n' +
      '<a href="http://en.wikipedia.org/wiki/Game_theory" target="_blank">game theory</a>,\n' +
      'or the <a href="http://en.wikipedia.org/wiki/Decision_tree" target="_blank">decision tree</a> in\n' +
      '<a href="http://en.wikipedia.org/wiki/Decision_analysis" target="_blank">decision analysis</a>.\n' +
      '<br />\n' +
      'With JavaScript code you can generate multiple possible worlds (world = HTML document) as follows:\n' +
      '<ol>\n' +
      '  <li>Create multiple choices using one of the choose() methods.</li>\n' +
      '  <li>Manipulate the current world (HTML document) using DOM and/or jQuery commands.</li>\n' +
      '  <li>Register the manipulated HTML document as a new world with the\n' +
      '      <span style="font-family: \'Courier New\', Courier, monospace;">multiverse.world()</span> function.</li>\n' +
      '</ol>\n' +
      'To create multiple branches of options, you can use\n' + 
      '<span style="font-family: \'Courier New\', Courier, monospace;">Array.choose()</span> or\n' + 
      '<span style="font-family: \'Courier New\', Courier, monospace;">jQuery.choose()</span> to\n' +
      'tell Problem Solver to apply this code multiple times to a single world, for each combination of\n' +
      'options returned by the choose() method. This is how you create multiple voluntary options.\n' +
      'This code may (depending on conditions set in the "evaluate" code) then automatically be\n' +
      'applied to any of the newly created documents, which in turn will generate more worlds,\n' +
      'and so on. This is how the "multiverse" gets created.<br />\n' +
      'Note: the code you enter may contain multiple calls to choose()!<br />\n' +
      '<br />\n' +
      '<br />\n' +
      '<div style="position: static; background-color: #2A2A1A; padding: 10px;\n' + 
      ' font-family: \'Courier New\', Courier, monospace; font-size: 18px;\n' + 
      ' color: #dddddd;">\n' +
      '  Array.choose( atLeast, atMost )\n' +
      '</div>\n' +
      '<div style="position: static; background-color: #cccccc; border: 2px solid #2A2A1A; padding: 10px; font-size: 16px;">\n' +
      '  The Array.choose() method performs the following:\n' + 
      '  <div style="position: static; margin-left: 20px; font-size: 16px;">\n' +
      '    1. Determine all the combinations of subsets of items in the array, where the subset contains\n' +
      '    at least <span style="font-family: \'Courier New\', Courier, monospace; background-color: #2A2A1A; color: #dddddd;">atLeast</span> items, and at most\n' +
      '    <span style="font-family: \'Courier New\', Courier, monospace; background-color: #2A2A1A; color: #dddddd;">atMost</span> items.\n' +
      '    <br />\n' +
      '    2. Tell Problem Solver to run the entire code in the current world for each possible combination.<br />\n' +
      '    3. During each run of the code, the method returns the selected combination (subset) of items.\n' +
      '  </div>\n' +
      '  The <span style="font-family: \'Courier New\', Courier, monospace; background-color: #2A2A1A; color: #dddddd;">atMost</span> argument must be greater than or equal to\n' +
      '  <span style="font-family: \'Courier New\', Courier, monospace; background-color: #2A2A1A; color: #dddddd;">atLeast</span>.\n' +
      '  If <span style="font-family: \'Courier New\', Courier, monospace; background-color: #2A2A1A; color: #dddddd;">atMost</span> is undefined\n' +
      '  then it is assumed to be equal to <span style="font-family: \'Courier New\', Courier, monospace; background-color: #2A2A1A; color: #dddddd;">atLeast</span>.\n' +
      '  <br />\n' + 
      '  &nbsp;<br />\n' + 
      '  <b>Example:</b>\n' + 
      '  <div style="position: static; margin-left: 20px;">\n' + 
      '    The example code below will get executed 3 times in a single run.\n' +
      '    This is because there are three ways of selecting at least 1 item and at most 2 items from a set of 2 items.<br />\n' +
      '    In the first run the choice variable will be set to ["A"].<br />\n' +
      '    In the second run the choice variable will be set to ["B"].<br />\n' +
      '    In the third run the choice variable will be set to ["A", "B"].\n' +
      '  </div>\n' +
      '  <div style="position: static; margin-left: 20px; background-color: #333333; padding: 10px;\n' + 
      '     font-family: \'Courier New\', Courier, monospace; font-size: 16px;\n' + 
      '     color: #dddddd;">\n' +
      '    var choice = [ "A", "B" ].choose( 1, 2 );<br />\n' +
      '    new multiverse.world( choice.toString() );\n' +
      '  </div>\n' +
      '</div>\n' +
      '<br />\n' +
      '<div style="position: static; background-color: #2A2A1A; padding: 10px;\n' + 
      ' font-family: \'Courier New\', Courier, monospace; font-size: 18px;\n' + 
      ' color: #dddddd;">\n' +
      '  Array.chooseOne()\n' +
      '</div>\n' +
      '<div style="position: static; background-color: #cccccc; border: 2px solid #2A2A1A; padding: 10px; font-size: 16px;">\n' +
      '  The Array.chooseOne() method is equivalent to calling Array.choose( 1, 1 )[0] or Array.choose( 1 )[0].\n' + 
      '  Note that the method returns a single element, and not an array.\n' + 
      '  <br />\n' + 
      '  &nbsp;<br />\n' + 
      '  <b>Example:</b>\n' + 
      '  <div style="position: static; margin-left: 20px;">\n' + 
      '    The example code below will get executed twice in a single run.\n' +
      '    This is because there are two ways of selecting a single item from a set of 2 items.<br />\n' +
      '    In the first run the toss variable will be set to ["heads"].<br />\n' +
      '    In the second run the toss variable will be set to ["tails"].\n' +
      '  </div>\n' +
      '  <div style="position: static; margin-left: 20px; background-color: #333333; padding: 10px;\n' + 
      '     font-family: \'Courier New\', Courier, monospace; font-size: 16px;\n' + 
      '     color: #dddddd;">\n' +
      '    var toss = [ "heads", "tails" ].chooseOne();<br />\n' +
      '    new multiverse.world( toss );\n' +
      '  </div>\n' +
      '  &nbsp;<br />\n' + 
      '  <b>Example:</b>\n' + 
      '  <div style="position: static; margin-left: 20px;">\n' + 
      '    The example code below will get executed twice in a single run.\n' +
      '    This is because there are two ways of selecting a single item from a set of 2 items.<br />\n' +
      '    In the first run the measurement variable will be set to 0.<br />\n' +
      '    In the second run the measurement variable will be set to 1.\n' +
      '  </div>\n' +
      '  <div style="position: static; margin-left: 20px; background-color: #333333; padding: 10px;\n' + 
      '     font-family: \'Courier New\', Courier, monospace; font-size: 16px;\n' + 
      '     color: #dddddd;">\n' +
      '    var qubit = [ 0, 1 ];<br />\n' +
      '    var measurement = qubit.chooseOne();<br />\n' +
      '    new multiverse.world( "measured: " + measurement );\n' +
      '  </div>\n' +
      '</div>\n' +
      '<br />\n' +      
      '<div style="position: static; background-color: #2A2A1A; padding: 10px;\n' + 
      ' font-family: \'Courier New\', Courier, monospace; font-size: 18px;\n' + 
      ' color: #dddddd;">\n' +
      'jQuery.choose( atLeast, atMost )\n' +
      '</div>\n' +
      '<div style="position: static; background-color: #cccccc; border: 2px solid #2A2A1A; padding: 10px; font-size: 16px;">\n' +
      '  The jQuery.choose() method (a jQuery plugin) is similar to the Array.choose() method, except it deals\n' +
      '  with jQuery\'s DOM elements instead of array elements.<br />\n' +
      '  The jQuery.choose() method performs the following:\n' + 
      '  <div style="position: static; margin-left: 20px; font-size: 16px;">\n' +
      '    1. Given a jQuery object that represents a set of DOM elements,\n' +
      '    determine all the combinations of subsets of elements, where the subset consists of\n' +
      '    at least <span style="font-family: \'Courier New\', Courier, monospace; background-color: #2A2A1A; color: #dddddd;">atLeast</span> elements, and at most\n' +
      '    <span style="font-family: \'Courier New\', Courier, monospace; background-color: #2A2A1A; color: #dddddd;">atMost</span> elements.\n' +
      '    <br />\n' +
      '    2. Tell Problem Solver to run the entire code in the current world for each possible combination.<br />\n' +
      '    3. During each run of the code, the method returns a new jQuery object containing the selected\n' +
      '    combination (subset) of elements.\n' +
      '  </div>\n' +
      '  The <span style="font-family: \'Courier New\', Courier, monospace; background-color: #2A2A1A; color: #dddddd;">atMost</span> argument must be greater than or equal to\n' +
      '  <span style="font-family: \'Courier New\', Courier, monospace; background-color: #2A2A1A; color: #dddddd;">atLeast</span>.\n' +
      '  If <span style="font-family: \'Courier New\', Courier, monospace; background-color: #2A2A1A; color: #dddddd;">atMost</span> is undefined\n' +
      '  then it is assumed to be equal to <span style="font-family: \'Courier New\', Courier, monospace; background-color: #2A2A1A; color: #dddddd;">atLeast</span>.\n' +
      '  <br />\n' + 
      '  &nbsp;<br />\n' + 
      '  <b>Example:</b>\n' + 
      '  <div style="position: static; margin-left: 20px;">\n' + 
      '    The example code below will ...\n' +
      '  </div>\n' +
      '  <div style="position: static; margin-left: 20px; background-color: #333333; padding: 10px;\n' + 
      '     font-family: \'Courier New\', Courier, monospace; font-size: 16px;\n' + 
      '     color: #dddddd;">\n' +
      '    $( ".matchstick" ).choose( 1, 3 ).remove();<br />\n' +
      '    new multiverse.world();\n' +
      '  </div>\n' +
      '</div>\n' +
      '<br />\n' +
      '<div style="position: static; background-color: #2A2A1A; padding: 10px;\n' + 
      ' font-family: \'Courier New\', Courier, monospace; font-size: 18px;\n' + 
      ' color: #dddddd;">\n' +
      'jQuery.chooseOne()\n' +
      '</div>\n' +
      '<div style="position: static; background-color: #cccccc; border: 2px solid #2A2A1A; padding: 10px; font-size: 16px;">\n' +
      '  The jQuery.chooseOne() method (a jQuery plugin) is equivalent to calling jQuery.choose( 1, 1 ) or\n' +
      '  jQuery.choose( 1 ).<br />\n' +
      '  The jQuery.chooseOne() method performs the following:\n' + 
      '  <div style="position: static; margin-left: 20px; font-size: 16px;">\n' +
      '    1. Given a jQuery object that represents a set of DOM elements,\n' +
      '    select a single element.<br />\n' +
      '    2. Tell Problem Solver to re-run the entire code, selecting a different element each time,\n' +
      '    until each element has been selected.<br />\n' +
      '    3. During each run of the code, the method returns a new jQuery object containing the selected\n' +
      '    element.\n' +
      '  </div>\n' +
      '  <br />\n' + 
      '  &nbsp;<br />\n' + 
      '  <b>Example:</b>\n' + 
      '  <div style="position: static; margin-left: 20px;">\n' + 
      '    The example code below will select a single td cell and fill it with the text "X".\n' +
      '    It will run this code for each empty cell, generating a new world for each cell it selected.\n' +
      '    The resulting multiverse will be finite, because eventually all cells will be filled with "X".\n' +
      '  </div>\n' +
      '  <div style="position: static; margin-left: 20px; background-color: #333333; padding: 10px;\n' + 
      '     font-family: \'Courier New\', Courier, monospace; font-size: 16px;\n' + 
      '     color: #dddddd;">\n' +
      '    $( "#td:empty" ).chooseOne().text( "X" );<br />\n' +
      '    new multiverse.world();\n' +
      '  </div>\n' +
      '</div>\n' +
      '<br />\n' +      
      '<div style="position: static; background-color: #2A2A1A; padding: 10px;\n' + 
      ' font-family: \'Courier New\', Courier, monospace; font-size: 18px;\n' + 
      ' color: #dddddd;">\n' +
      'multiverse.world( changeDescription )\n' +
      '</div>\n' +
      '<div style="position: static; background-color: #cccccc; border: 2px solid #2A2A1A; padding: 10px; font-size: 16px;">\n' +
      '  The multiverse.world() function tells Problem Solver to create a new world that represents a\n' +
      '  possible future, a possible succession to the current world. The new world will be set with\n' +
      '  with the current state of the manipulated HTML. Note that the "new" operator (frequently used in the\n' +
      '  examples) is optional.<br />\n' +
      '  The optional <span style="font-family: \'Courier New\', Courier, monospace; background-color: #2A2A1A;\n' +
      '    color: #dddddd;">changeDescription</span> argument is a string that describes the action,\n' +
      '  how the new world was created. This string is displayed as part of the newly created world,\n' +
      '  made visible in the multiverse viewer.\n' +
      '  <br />\n' + 
      '  &nbsp;<br />\n' + 
      '  <b>Example:</b>\n' + 
      '  <div style="position: static; margin-left: 20px;">\n' + 
      '    The example code below will select a one of the numbers in the array and create a new (identical) world, recording the\n' +
      '    chosen number.\n' +
      '    It will run this code for each new world created, generating six new worlds each run, and so on.\n' +
      '  </div>\n' +
      '  <div style="position: static; margin-left: 20px; background-color: #333333; padding: 10px;\n' + 
      '     font-family: \'Courier New\', Courier, monospace; font-size: 16px;\n' + 
      '     color: #dddddd;">\n' +
      '    var dice = [ 1, 2, 3, 4, 5, 6 ];<br />\n' +
      '    var diceRoll = dice.chooseOne();<br />\n' +
      '    new multiverse.world( "threw " + diceRoll );\n' +
      '  </div>\n' +
      '</div>\n' +
      '<br />\n'
  });
  this.viewChanges_Edit_Detail_View_scrollPanel.panelBox.panels.push(this.viewChanges_Edit_Detail_View_scrollPanel_content);
}
cViewChangesPanel.deriveFrom(cPanel);
(function() {
  cViewChangesPanel.prototype.screen = null;
  cViewChangesPanel.prototype.viewChanges = null;
  cViewChangesPanel.prototype.viewChanges_Edit_Master_Actions = null;
  cViewChangesPanel.prototype.viewChanges_Edit_Master_Actions_Header = null;
  cViewChangesPanel.prototype.viewChanges_Edit_Master_Actions_Edit = null;
  cViewChangesPanel.prototype.viewChanges_Edit_Detail = null;
  cViewChangesPanel.prototype.viewChanges_Edit_Detail_Header = null;
  cViewChangesPanel.prototype.viewChanges_Edit_Detail_View = null;
  cViewChangesPanel.prototype.viewChanges_Edit_Detail_View_scrollPanel = null;
  cViewChangesPanel.prototype.viewChanges_Edit_Detail_View_scrollPanel_content = null;
  cViewChangesPanel.prototype.render = function(aParentPanel, aParentElement, aClientRect) {
    cPanel.prototype.render.call(this, aParentPanel, aParentElement, aClientRect);
    if (this.element != null) {
      var lDetailHeight = 1000 + ((1600000 / (this.viewChanges_Edit_Detail_View_scrollPanel.panelBox.getInnerWidth() + 1)) | 0);
      if (this.viewChanges_Edit_Detail_View_scrollPanel_content.height != lDetailHeight) {
        this.viewChanges_Edit_Detail_View_scrollPanel_content.setHeight(lDetailHeight);
        this.viewChanges_Edit_Detail_View_scrollPanel.rerender();
      }
    }
  };
  cViewChangesPanel.prototype.reloadWorld = function() {
    if (this.viewChanges_Edit_Master_Actions_Edit) {
      this.viewChanges_Edit_Master_Actions_Edit.setValue(Model.getActions());
    }
  };
})();
/**
  * Class cViewEvaluatePanel
  */
function cViewEvaluatePanel(aProperties) {
  cPanel.call(this, aProperties);
  var lThis = this;
  this.screen = aProperties.screen;
  this.viewEvaluate = new cAutoSpanPanel({
    align: eAlign.eClient,
    backgroundColor: 'transparent'
  });
  this.panels.push(this.viewEvaluate);
  this.viewEvaluate_Edit_Master_Evaluations = new cPanel({
    align: eAlign.eClient,
    backgroundColor: 'transparent'
  });
  this.viewEvaluate.panels.push(this.viewEvaluate_Edit_Master_Evaluations);
  this.viewEvaluate_Edit_Master_Evaluations_Header = new cPanel({
    align: eAlign.eTop,
    height: 40,
    backgroundColor: 'transparent',
    innerHTML: '<b>Evaluations (JavaScript/jQuery)</b>'
  });
  this.viewEvaluate_Edit_Master_Evaluations.panels.push(this.viewEvaluate_Edit_Master_Evaluations_Header);
  this.viewEvaluate_Edit_Master_Evaluations_Edit = new cTextEditPanel({
    align: eAlign.eClient,
    color: '#dddddd',
    backgroundColor: '#333333',
    fontSize: 16,
    value: '',
    onChange: function() {
      Model.setEvaluations(lThis.viewEvaluate_Edit_Master_Evaluations_Edit.getValue());
    }
  });
  this.viewEvaluate_Edit_Master_Evaluations.panels.push(this.viewEvaluate_Edit_Master_Evaluations_Edit);  
  this.viewEvaluate_Edit_Detail = new cPanel({
    align: eAlign.eClient,
    backgroundColor: 'transparent'
  });
  this.viewEvaluate.panels.push(this.viewEvaluate_Edit_Detail);    
  this.viewEvaluate_Edit_Detail_Header = new cPanel({
    align: eAlign.eTop,
    height: 40,
    backgroundColor: 'transparent',
    innerHTML: '<b>Problem Solver Evaluations API documentation</b>'
  });
  this.viewEvaluate_Edit_Detail.panels.push(this.viewEvaluate_Edit_Detail_Header);
  this.viewEvaluate_Edit_Detail_View = new cPanel({
    align: eAlign.eClient,
    backgroundColor: 'transparent'
  });
  this.viewEvaluate_Edit_Detail.panels.push(this.viewEvaluate_Edit_Detail_View);
  this.viewEvaluate_Edit_Detail_View_scrollPanel = new cScrollboxPanel({
    align: eAlign.eClient,
    backgroundColor: 'transparent',
    boxBackgroundColor: '#ffeead', //'#ffffff', //  '#96ceb4',
    scrollBarHandleColor: '#666666',
    autoHideScrollbar: true
  });
  this.viewEvaluate_Edit_Detail_View.panels.push(this.viewEvaluate_Edit_Detail_View_scrollPanel);
  /*
    payoff, loss, gain, score, like
    goal, lethal, illegal
    score(like, half-life);
  */
  this.viewEvaluate_Edit_Detail_View_scrollPanel_content = new cPanel({
    align: eAlign.eTop,
    height: 2000,
    padding: 20,
    backgroundColor: 'transparent',
    textSelectable: true,
    innerHTML:
      '<div style="position: static; font-size: 32px; font-weight: bold;">\n' +
      '  Evaluations\n' +
      '</div>\n' +
      'The "evaluations" define a world\'s score, whether a world is favorable or not, whether a goal has been reached,\n' +
      'or whether a world is illegal (as with games or puzzles). These are known as the static rules of the game.\n' +
      'It is similar to the <a href="http://en.wikipedia.org/wiki/Evaluation_function" target="_blank">evaluation function</a> or "payoff function" in game theory.\n' +
      'As you will notice in the multiverse viewer, the multiverse usually grows very fast (exponentially),\n' +
      'like many <a href="http://en.wikipedia.org/wiki/Game_tree" target="_blank">game trees</a> do.\n' +
      'The evaluations are <a href="http://en.wikipedia.org/wiki/Heuristic" target="_blank">heuristics</a>\n' +
      'that help limit the growth of the multiverse.\n' +
      'Evaluations help in restricting the number of choices, possibly constraining the path towards a\n' +
      'desirable outcome, making it easier to overview the multiverse and find a favorable path.\n' +
      'Evaluations can also help to highlight good paths, or warn for bad outcomes.\n' +
      'With JavaScript code you can evaluate a world (world = HTML document) as follows:\n' +
      '<ol>\n' +
      '  <li>Access the world (HTML document) using DOM and/or jQuery commands, and determine whether the world satisfies some condition.\n' +
      '  <li>Mark the world with any of the built-in evaluation functions (e.g. \n' +
      '      <span style="font-family: \'Courier New\', Courier, monospace;">world.like()</span>).</li>\n' +
      '</ol>\n' +
      '<br />\n' +
      '<br />\n' +
      '<div style="position: static; background-color: #2A2A1A; padding: 10px;\n' + //#BF2D10
      ' font-family: \'Courier New\', Courier, monospace; font-size: 18px;\n' + 
      ' color: #dddddd;">\n' +
      '  world.goal( goalDescription )\n' +
      '</div>\n' +
      '<div style="position: static; background-color: #cccccc; border: 2px solid #2A2A1A; padding: 10px; font-size: 16px;">\n' +
      '  The world.goal() method tells Problem Solver to mark the current world as qualifying as having achieved the goal.\n' + 
      '  The search expansion ends at such a goal world, and further expansion from this world is disabled.\n' + 
      '  A goal-world is colored <span style="background-color: #339933;">&nbsp;green&nbsp;</span> in the multiverse viewer.\n' + 
      '  The optional <span style="font-family: \'Courier New\', Courier, monospace; background-color: #2A2A1A;\n' +
      '    color: #dddddd;">goalDescription</span> argument is a string to describe the goal, which is shown in the multiverse viewer.\n' +
      '  \n' +
      '  <br />\n' + 
      '  <br />\n' + 
      '  <b>Example:</b>\n' + 
      '  <div style="position: static; margin-left: 20px;">\n' + 
      '    The example code below will determine whether there are 8 queens on the chessboard and, if so, mark the world as a goal.\n' +
      '  </div>\n' +
      '  <div style="position: static; margin-left: 20px; background-color: #333333; padding: 10px;\n' + 
      '     font-family: \'Courier New\', Courier, monospace; font-size: 16px;\n' + 
      '     color: #dddddd;">\n' +
      '    if ($("chessboard queen").length == 8) {<br />\n' +
      '    &nbsp;&nbsp;world.goal("Solution!");<br />\n' +
      '    }\n' +
      '  </div>\n' +
      '</div>\n' +
      '<br />\n' +
      '<br />\n' +
      '<div style="position: static; background-color: #2A2A1A; padding: 10px;\n' + //#BF2D10
      ' font-family: \'Courier New\', Courier, monospace; font-size: 18px;\n' + 
      ' color: #dddddd;">\n' +
      '  world.illegal( illegalReason )\n' +
      '</div>\n' +
      '<div style="position: static; background-color: #cccccc; border: 2px solid #2A2A1A; padding: 10px; font-size: 16px;">\n' +
      '  The world.goal() method tells Problem Solver to mark the current world as illegal.\n' + 
      '  The search expansion ends at such am illegal world, and further expansion from this world is disabled.\n' + 
      '  An illegal world is colored <span style="background-color: #ff4444;">&nbsp;red&nbsp;</span> in the multiverse viewer.\n' + 
      '  The optional <span style="font-family: \'Courier New\', Courier, monospace; background-color: #2A2A1A;\n' +
      '    color: #dddddd;">illegalReason</span> argument is a string to describe the reason why the world is illegal, which is shown in the multiverse viewer.<br />\n' +
      '  <span style="font-weight: bold;">*</span> Note that the illegal worlds can be ommitted from the multiverse viewer by disabling the "hide/ignore illegal world" within the "options" panel.\n' +
      '  \n' +
      '  <br />\n' + 
      '  <br />\n' + 
      '  <b>Example:</b>\n' + 
      '  <div style="position: static; margin-left: 20px;">\n' + 
      '    The example code below will determine whether there is more than one piece on any position on the chessboard and, if so, mark the world as a illegal.\n' +
      '  </div>\n' +
      '  <div style="position: static; margin-left: 20px; background-color: #333333; padding: 10px;\n' + 
      '     font-family: \'Courier New\', Courier, monospace; font-size: 16px;\n' + 
      '     color: #dddddd;">\n' +
      '    if ($("chessboard position piece").length > 1) {<br />\n' +
      '    &nbsp;&nbsp;world.illegal("A position is not allowed to hold more than one piece.");<br />\n' +
      '    }\n' +
      '  </div>\n' +
      '</div>\n' +
      '<br />\n' +
      '<br />\n' +
      '<div style="position: static; background-color: #2A2A1A; padding: 10px;\n' + //#BF2D10
      ' font-family: \'Courier New\', Courier, monospace; font-size: 18px;\n' + 
      ' color: #dddddd;">\n' +
      '  world.like( likeScore )\n' +
      '</div>\n' +
      '<div style="position: static; background-color: #cccccc; border: 2px solid #2A2A1A; padding: 10px; font-size: 16px;">\n' +
      '  The world.like() method tells Problem Solver to increment the like-score of the current world.\n' + 
      '  The optional <span style="font-family: \'Courier New\', Courier, monospace; background-color: #2A2A1A;\n' +
      '    color: #dddddd;">likeScore</span> argument is the like-score to add to the world\'s current like-score.\n' +
      '  The default value is "1".\n' +
      '  The initial like-score of a world is zero. If a world\'s like-score is non-zero, then its value is shown\n' + 
      '  in the multiverse viewer. If the like-score is positive, then the background is colored <span style="background-color: #FFAE3C;">orange</span>.\n' + 
      '  If the like-score is negative, then the background is colored <span style="background-color: #FFBBBB;">&nbsp;light&nbsp;red&nbsp;</span>.<br />\n' + 
      '  <span style="font-weight: bold;">*</span> Note that when the search method in the multiverse-viewer is set to "high like-score first", then auto-search\n' + 
      '  function will follow the path of the world\'s highest score.\n' + 
      '  <br />\n' + 
      '  <br />\n' + 
      '  <b>Example:</b>\n' + 
      '  <div style="position: static; margin-left: 20px;">\n' + 
      '    The example code below will determine the number of "person" tags with the class set to "happy" and set this as the like-score.\n' +
      '  </div>\n' +
      '  <div style="position: static; margin-left: 20px; background-color: #333333; padding: 10px;\n' + 
      '     font-family: \'Courier New\', Courier, monospace; font-size: 16px;\n' + 
      '     color: #dddddd;">\n' +
      '    world.like($(\'person.happy\').length);\n' +
      '  </div>\n' +
      '</div>\n' +
      '<br />\n'
 });
 this.viewEvaluate_Edit_Detail_View_scrollPanel.panelBox.panels.push(this.viewEvaluate_Edit_Detail_View_scrollPanel_content);
}
cViewEvaluatePanel.deriveFrom(cPanel);
(function() {
  cViewEvaluatePanel.prototype.screen = null;
  cViewEvaluatePanel.prototype.viewEvaluate = null;
  cViewEvaluatePanel.prototype.viewEvaluate_Edit_Master_Evaluations = null;
  cViewEvaluatePanel.prototype.viewEvaluate_Edit_Master_Evaluations_Header = null;
  cViewEvaluatePanel.prototype.viewEvaluate_Edit_Master_Evaluations_Edit = null;
  cViewEvaluatePanel.prototype.viewEvaluate_Edit_Detail = null;
  cViewEvaluatePanel.prototype.viewEvaluate_Edit_Detail_Header = null;
  cViewEvaluatePanel.prototype.viewEvaluate_Edit_Detail_View = null;
  cViewEvaluatePanel.prototype.viewEvaluate_Edit_Detail_View_scrollPanel = null;
  cViewEvaluatePanel.prototype.viewEvaluate_Edit_Detail_View_scrollPanel_content = null;
  cViewEvaluatePanel.prototype.render = function(aParentPanel, aParentElement, aClientRect) {
    cPanel.prototype.render.call(this, aParentPanel, aParentElement, aClientRect);
    if (this.element != null) {
      var lDetailHeight = 1000 + ((800000 / (this.viewEvaluate_Edit_Detail_View_scrollPanel.panelBox.getInnerWidth() + 1)) | 0);
      if (this.viewEvaluate_Edit_Detail_View_scrollPanel_content.height != lDetailHeight) {
        this.viewEvaluate_Edit_Detail_View_scrollPanel_content.setHeight(lDetailHeight);
        this.viewEvaluate_Edit_Detail_View_scrollPanel.rerender();
      }
    }
  };
  cViewEvaluatePanel.prototype.reloadWorld = function() {
    if (this.viewEvaluate_Edit_Master_Evaluations_Edit) {
      this.viewEvaluate_Edit_Master_Evaluations_Edit.setValue(Model.getEvaluations());
    }
  };
})();
/**
 * Class cMultiverseFuturePanel
 */
function cMultiverseFuturePanel(aProperties) {
  cPanel.call(this, aProperties);
  var lThis = this;
  this.backgroundColor = 'transparent';
  this.screen = aProperties.screen;
  this.future = aProperties.future ? aProperties.future : null;
  this.state = aProperties.state ? aProperties.state : '';
  this.stateColor = aProperties.stateColor ? aProperties.stateColor : '#000000';
  this.changesImageId = aProperties.changesImageId;
  this.evaluateImageId = aProperties.evaluateImageId;
  /*
  this.horizontalConnectorPanel = new cPanel({
    align : eAlign.eCenterHorizontal,
    height: 8,
    marginLeft: ((cMultiverseFuturePanel.cViewColumnWidth / 2) | 0),
    marginRight: ((cMultiverseFuturePanel.cViewColumnWidth / 2) | 0),
    backgroundColor : '#000000'
  });
  this.panels.push(this.horizontalConnectorPanel);
  */
  this.containerPanel = new cPanel({
    align : eAlign.eHeight, //eAlign.eCenterVertical,
    left : 0,
    width : cMultiverseFuturePanel.cViewColumnWidth - 8,
    backgroundColor : 'transparent',
    onTap: function() {
      this.stopBubble = true;
      lThis.openDetailPanel();
    }
  });
  this.panels.push(this.containerPanel);
  this.iFramePanel = new cIFramePanel({
    align : eAlign.eLeft,
    width : ((cMultiverseFuturePanel.cViewColumnWidth / 2) | 0) - 4,
    backgroundColor : 'transparent',
    iFrameHTML : '',
    supportScroll : false,
    zoom : 0.3 // 0.25
  });
  this.containerPanel.panels.push(this.iFramePanel);
  this.iFramePanel.setContent(Model.getFutureFullHTML(this.future));
  this.infoPanel = new cPanel({
    align : eAlign.eClient,
    backgroundColor : '#96ceb4',
    color : '#000000',
    fontSize: 12
  });
  this.containerPanel.panels.push(this.infoPanel);
  this.infoPanelAction = new cPanel({
    align : eAlign.eTop,
    height : ((cMultiverseFuturePanel.cViewHeight / 2) | 0),
    backgroundColor : '#96ceb4',
    color : '#000000',
    fontSize: 12,
    textAlign: eTextAlign.eCenter,
    innerHTML : ((this.future.id == Model.multiverse.worldNow.id) ? 'now' :  cLib.textToHTML(this.future.actionDescription))
  });
  this.infoPanel.panels.push(this.infoPanelAction);
  this.infoPanelEvaluation = new cPanel({
    align : eAlign.eTop,
    height : ((cMultiverseFuturePanel.cViewHeight / 2) | 0),
    backgroundColor : this.stateColor,
    color : '#000000',
    fontSize: 12, //22,
    textAlign: eTextAlign.eCenter,
    innerHTML : this.state
  });
  this.infoPanel.panels.push(this.infoPanelEvaluation);
}
cMultiverseFuturePanel.deriveFrom(cPanel);
(function() {
  cMultiverseFuturePanel.cViewColumnWidth = 180; //92;
  cMultiverseFuturePanel.cViewHeight = 100; // 92;
  cMultiverseFuturePanel.evaluationColor = function(aFuture) {
    var lColor = '#ffeead'; // '#aa9977';
    if (aFuture.evaluation.illegal) {
      lColor = '#ff4444';
    } else if (aFuture.evaluation.goal) {
      lColor = '#339933';
    } else if (aFuture.evaluation.ignore) {
      lColor = '#666666';
    } else if (aFuture.evaluation.end) {
      lColor = '#666666';
    } else if (aFuture.evaluation.like > 0) {
      lColor = '#FFAE3C'; //'#339933';
    } else if (aFuture.evaluation.like < 0) {
      lColor = '#FFBBBB'; //'#993333';
    } else if (aFuture.evaluation.same) {
    }
    return lColor;
  };
  cMultiverseFuturePanel.evaluationText = function(aFuture) {
    var lText = '';
    if (aFuture.evaluation.evaluationDescription != '') {
      lText = aFuture.evaluation.evaluationDescription;
    } else if (aFuture.evaluation.illegal) {
      lText = 'illegal';
    } else if (aFuture.evaluation.goal) {
      lText = 'goal';
    } else if (aFuture.evaluation.ignore) {
      lText = 'ignore';
    } else if (aFuture.evaluation.end) {
      lText = 'end';
    } else if (aFuture.evaluation.like > 0) {
      lText = '' + aFuture.evaluation.like;
    } else if (aFuture.evaluation.like < 0) {
      lText = '' + aFuture.evaluation.like;
    } else if (aFuture.evaluation.same) {
    }
    return lText;
  };
  cMultiverseFuturePanel.prototype.screen = null;
  cMultiverseFuturePanel.prototype.future = null;
  cMultiverseFuturePanel.prototype.state = '';
  cMultiverseFuturePanel.prototype.stateColor = '#000000';
  cMultiverseFuturePanel.prototype.containerPanel = null;
  cMultiverseFuturePanel.prototype.iFramePanel = null;
  cMultiverseFuturePanel.prototype.infoPanel = null;
  cMultiverseFuturePanel.prototype.infoPanelAction = null;
  cMultiverseFuturePanel.prototype.infoPanelEvaluation = null;
  cMultiverseFuturePanel.prototype.changesImageId = null;
  cMultiverseFuturePanel.prototype.evaluateImageId = null;
  cMultiverseFuturePanel.prototype.setState = function(aState) {
    if (this.state != aState) {
      this.state = aState;
      this.infoPanelEvaluation.setInnerHTML(cLib.textToHTML(this.state));
    }
  };
  cMultiverseFuturePanel.prototype.setStateColor = function(aStateColor) {
    if (this.stateColor != aStateColor) {
      this.stateColor = aStateColor;
      this.infoPanelEvaluation.backgroundColor = this.stateColor;
    }
  };
  cMultiverseFuturePanel.prototype.setFocusLine = function(aLineX) {
    /*
    var lInnerX = aLineX - (this.left + 2);
    var lLeft = lInnerX - (((cMultiverseFuturePanel.cViewColumnWidth - 8) / 2) | 0);
    if (lLeft < 0) {
      lLeft = 0;
    } else if (lLeft > (this.getInnerWidth() - (cMultiverseFuturePanel.cViewColumnWidth - 8))) {
      lLeft = (this.getInnerWidth() - (cMultiverseFuturePanel.cViewColumnWidth - 8));
    }
    this.containerPanel.setLeft(lLeft);
    */
    var lLeft = (((this.getInnerWidth() - (cMultiverseFuturePanel.cViewColumnWidth - 8)) / 2) | 0);
    this.containerPanel.setLeft(lLeft);
  };
  cMultiverseFuturePanel.prototype.openDetailPanel = function(aLineX) {
    var lThis = this;
    var lModalPanel = new clsModalPanel({
      onClick: function() {
        setTimeout(function() {
          lThis.screen.panel.removePanel(lModalPanel);
        }, 10);
      }
    });
    this.screen.panel.appendPanel(lModalPanel);
    lModalPanel.futureDetailPanel = new cPanel({
      align: eAlign.eClient,
      shape: cPanel.cShapeRoundRect,
      marginLeft: 100,
      marginTop: 40,
      marginRight: 100,
      marginBottom: 40,
      border: 1,
      borderColor: '#262626',
      borderRadius: 16,
      backgroundColor: '#262626', 
      color: '#ffffff',
      fontSize: 36,
      onClick: function() {
        this.stopBubble = true;
      }
    });
    lModalPanel.contentPanel.panels.push(lModalPanel.futureDetailPanel);
    lModalPanel.futureDetailPanel.headerPanel = new cPanel({
      align: eAlign.eTop,
      height: 50,
      paddingLeft: 20,
      backgroundColor: '#444444', 
      color: '#eeeeee',
      fontSize: 36,
      innerHTML: 'Future world'
    });
    lModalPanel.futureDetailPanel.panels.push(lModalPanel.futureDetailPanel.headerPanel);
    lModalPanel.futureDetailPanel.bottomPanel = new cPanel({
      align: eAlign.eBottom,
      height: 70,
      paddingLeft: 20,
      backgroundColor: '#444444'
    });
    lModalPanel.futureDetailPanel.panels.push(lModalPanel.futureDetailPanel.bottomPanel);
    lModalPanel.futureDetailPanel.bottomPanel.cancelButton = new cPanel({
      align: eAlign.eCenterVertical,
      shape: cPanel.cShapeRoundRect,
      width: 200,
      marginTop: 10,
      marginBottom: 10,
      padding: 2,
      backgroundColor: '#262626',
      border: 1,
      borderColor: '#262626',
      borderRadius: 16,
      color: '#eeeeee',
      fontSize: 36,
      textAlign: eTextAlign.eCenter,
      innerHTML: 'close',
      onClick: function() {
        this.stopBubble = true;
        setTimeout(function() {
          lThis.screen.panel.removePanel(lModalPanel);
        }, 10);
      }
    });
    lModalPanel.futureDetailPanel.bottomPanel.panels.push(lModalPanel.futureDetailPanel.bottomPanel.cancelButton);
    lModalPanel.futureDetailPanel.spanPanel = new cAutoSpanPanel({
      align: eAlign.eClient,
      backgroundColor: 'transparent',
      spanMethod: cAutoSpanPanel.spanMethod_auto
    });
    lModalPanel.futureDetailPanel.panels.push(lModalPanel.futureDetailPanel.spanPanel);
    lModalPanel.futureDetailPanel.masterPanel = new cScrollboxPanel({
      align: eAlign.eClient,
      panelBoxRoundedBorder: false,
      marginLeft: 10,
      marginRight: 10,
      paddingTop: 20,
      paddingBottom: 20,
      backgroundColor: 'transparent',
      boxBackgroundColor: '#262626', //'#ffffff', //  '#96ceb4',
      scrollBarHandleColor: '#666666',
      autoHideScrollbar: true
    });
    lModalPanel.futureDetailPanel.spanPanel.panels.push(lModalPanel.futureDetailPanel.masterPanel);
    var lFuturePath = [];
    var lFuture = this.future;
    while (lFuture != null) {
      lFuturePath.splice(0, 0, lFuture);
      lFuture = lFuture.past; 
    }
    var lFuturePanels = [];
    for (var fi = 0, fc = lFuturePath.length; fi < fc; fi++) {
      lFuture = lFuturePath[fi];
      var lFuturePanel = new cPanel({
        align: eAlign.eTop,
        marginTop: 4,
        marginBottom: 4,
        height: cMultiverseFuturePanel.cViewHeight + 8,
        backgroundColor: ((lFuture.id == this.future.id) ? '#cccccc' : '#333333'),
        onClick: function() {
          for (var fpi = 0, fpc = lFuturePanels.length; fpi < fpc; fpi++) {
            var lFP = lFuturePanels[fpi];
            if (lFP.future.id == this.future.id) {
              lFP.setBackgroundColor('#cccccc');
            } else {
              lFP.setBackgroundColor('#333333');
            }
          }
          lModalPanel.futureDetailPanel.detailPanel.spanPanel.worldPanel.iFramePanel.setContent(Model.getFutureFullHTML(this.future));
          lModalPanel.futureDetailPanel.detailPanel.spanPanel.worldPanel.htmlCodePanel.setValue(this.future.worldHTML);
          lModalPanel.futureDetailPanel.detailPanel.spanPanel.infoPanel.actionPanel.textPanel.setInnerHTML(cLib.textToHTML(this.future.actionDescription));
          lModalPanel.futureDetailPanel.detailPanel.spanPanel.infoPanel.evaluationPanel.textPanel.setBackgroundColor(cMultiverseFuturePanel.evaluationColor(this.future));
          lModalPanel.futureDetailPanel.detailPanel.spanPanel.infoPanel.evaluationPanel.textPanel.setInnerHTML(cLib.textToHTML(cMultiverseFuturePanel.evaluationText(this.future)));
        }
      });
      lFuturePanel.future = lFuture;
      lModalPanel.futureDetailPanel.masterPanel.panelBox.panels.push(lFuturePanel);
      lFuturePanels.push(lFuturePanel);
      lFuturePanel.containerPanel = new cPanel({
        align : eAlign.eCenterVertical,
        width : cMultiverseFuturePanel.cViewColumnWidth - 8,
        backgroundColor : 'transparent',
        borderLeft : 1,
        borderRight : 1,
        borderColor : '#000000'
      });
      lFuturePanel.panels.push(lFuturePanel.containerPanel);
      lFuturePanel.iFramePanel = new cIFramePanel({
        align : eAlign.eLeft,
        width : ((cMultiverseFuturePanel.cViewColumnWidth / 2) | 0) - 4,
        backgroundColor : 'transparent',
        iFrameHTML : '',
        supportScroll : false,
        zoom : 0.3 // 0.25
      });
      lFuturePanel.containerPanel.panels.push(lFuturePanel.iFramePanel);
      lFuturePanel.iFramePanel.setContent(Model.getFutureFullHTML(lFuture));
      lFuturePanel.infoPanel = new cPanel({
        align : eAlign.eClient,
        backgroundColor : '#96ceb4',
        color : '#000000',
        fontSize: 12
      });
      lFuturePanel.containerPanel.panels.push(lFuturePanel.infoPanel);
      lFuturePanel.infoPanelAction = new cPanel({
        align : eAlign.eTop,
        height : ((cMultiverseFuturePanel.cViewHeight / 2) | 0),
        backgroundColor : '#96ceb4',
        color : '#000000',
        fontSize: 12,
        textAlign: eTextAlign.eCenter,
        innerHTML : ((lFuture.id == Model.multiverse.worldNow.id) ? 'now' :  cLib.textToHTML(lFuture.actionDescription))
      });
      lFuturePanel.infoPanel.panels.push(lFuturePanel.infoPanelAction);
      lFuturePanel.infoPanelEvaluation = new cPanel({
        align : eAlign.eTop,
        height : ((cMultiverseFuturePanel.cViewHeight / 2) | 0),
        backgroundColor : cMultiverseFuturePanel.evaluationColor(lFuture),
        color : '#000000',
        fontSize: 12, //22,
        textAlign: eTextAlign.eCenter,
        innerHTML : cLib.textToHTML(cMultiverseFuturePanel.evaluationText(lFuture))
      });
      lFuturePanel.infoPanel.panels.push(lFuturePanel.infoPanelEvaluation);
      lFuturePanel.levelIndicator = new cPanel({
        align : eAlign.eRight,
        width : ((cMultiverseFuturePanel.cViewColumnWidth / 2) | 0),
        paddingTop : ((cMultiverseFuturePanel.cViewHeight / 5) | 0),
        backgroundColor : '#666666',
        transparencyPercentage : 50,
        color: '#ffffff',
        fontSize: 36,
        borderColor: '#333333',
        borderTop: 1,
        borderBottom: 1,
        textAlign: eTextAlign.eCenter,
        innerHTML: ((fi == 0) ? 'now' : (fi + ''))
      });
      lFuturePanel.panels.push(lFuturePanel.levelIndicator);
    }
    lModalPanel.futureDetailPanel.detailPanel = new cPanel({
      align: eAlign.eClient,
      backgroundColor: '#ffffff' //transparent'
    });
    lModalPanel.futureDetailPanel.spanPanel.panels.push(lModalPanel.futureDetailPanel.detailPanel);
    lModalPanel.futureDetailPanel.detailPanel.spanPanel = new cAutoSpanPanel({
      align: eAlign.eClient,
      backgroundColor: 'transparent',
      spanMethod: cAutoSpanPanel.spanMethod_auto,
      separationMargin: 0
    });
    lModalPanel.futureDetailPanel.detailPanel.panels.push(lModalPanel.futureDetailPanel.detailPanel.spanPanel);
    lModalPanel.futureDetailPanel.detailPanel.spanPanel.worldPanel = new cAutoSpanPanel({
      align : eAlign.eClient,
      backgroundColor : 'transparent',
      spanMethod: cAutoSpanPanel.spanMethod_auto,
      separationMargin: 0
    });
    lModalPanel.futureDetailPanel.detailPanel.spanPanel.panels.push(lModalPanel.futureDetailPanel.detailPanel.spanPanel.worldPanel);
    lModalPanel.futureDetailPanel.detailPanel.spanPanel.worldPanel.iFramePanel = new cIFramePanel({
      align : eAlign.eClient,
      backgroundColor : 'transparent',
      iFrameHTML : '',
      supportScroll : true,
      zoom : 1.0 // 0.25
    });
    lModalPanel.futureDetailPanel.detailPanel.spanPanel.worldPanel.panels.push(lModalPanel.futureDetailPanel.detailPanel.spanPanel.worldPanel.iFramePanel);
    lModalPanel.futureDetailPanel.detailPanel.spanPanel.worldPanel.iFramePanel.setContent(Model.getFutureFullHTML(this.future));
    lModalPanel.futureDetailPanel.detailPanel.spanPanel.worldPanel.htmlCodePanel = new cTextEditPanel({
      align: eAlign.eClient,
      color: '#dddddd',
      backgroundColor: '#333333',
      fontSize: 16,
      value: this.future.worldHTML,
      readOnly: true
    });
    lModalPanel.futureDetailPanel.detailPanel.spanPanel.worldPanel.panels.push(lModalPanel.futureDetailPanel.detailPanel.spanPanel.worldPanel.htmlCodePanel);
    lModalPanel.futureDetailPanel.detailPanel.spanPanel.infoPanel = new cAutoSpanPanel({
      align : eAlign.eClient,
      backgroundColor : 'transparent',
      spanMethod: cAutoSpanPanel.spanMethod_auto,
      separationMargin: 0
    });
    lModalPanel.futureDetailPanel.detailPanel.spanPanel.panels.push(lModalPanel.futureDetailPanel.detailPanel.spanPanel.infoPanel);
    lModalPanel.futureDetailPanel.detailPanel.spanPanel.infoPanel.actionPanel = new cPanel({
      align : eAlign.eClient,
      backgroundColor : '#96ceb4'
    });
    lModalPanel.futureDetailPanel.detailPanel.spanPanel.infoPanel.panels.push(lModalPanel.futureDetailPanel.detailPanel.spanPanel.infoPanel.actionPanel);
    lModalPanel.futureDetailPanel.detailPanel.spanPanel.infoPanel.actionPanel.imageContainerPanel = new cPanel({
      align : eAlign.eTop,
      height : 100,
      backgroundColor : 'transparent'
    });
    lModalPanel.futureDetailPanel.detailPanel.spanPanel.infoPanel.actionPanel.panels.push(lModalPanel.futureDetailPanel.detailPanel.spanPanel.infoPanel.actionPanel.imageContainerPanel);
    lModalPanel.futureDetailPanel.detailPanel.spanPanel.infoPanel.actionPanel.imageContainerPanel.imagePanel = new cPanel({
      align : eAlign.eCenter,
      width : 90,
      height : 90,
      backgroundColor : 'transparent',
      image: this.screen.getImageClone(this.changesImageId),
      imageStretchWidth: 90,
      imageStretchHeight: 90
    });
    lModalPanel.futureDetailPanel.detailPanel.spanPanel.infoPanel.actionPanel.imageContainerPanel.panels.push(lModalPanel.futureDetailPanel.detailPanel.spanPanel.infoPanel.actionPanel.imageContainerPanel.imagePanel);
    lModalPanel.futureDetailPanel.detailPanel.spanPanel.infoPanel.actionPanel.textPanel = new cPanel({
      align : eAlign.eClient,
      backgroundColor : 'transparent',
      color : '#000000',
      fontSize: 30,
      textAlign: eTextAlign.eCenter,
      innerHTML : cLib.textToHTML(this.future.actionDescription) // ((this.future == Model.multiverse.worldNow) ? 'now' :  cLib.textToHTML(this.future.actionDescription))
    });
    lModalPanel.futureDetailPanel.detailPanel.spanPanel.infoPanel.actionPanel.panels.push(lModalPanel.futureDetailPanel.detailPanel.spanPanel.infoPanel.actionPanel.textPanel);
    lModalPanel.futureDetailPanel.detailPanel.spanPanel.infoPanel.evaluationPanel = new cPanel({
      align : eAlign.eClient,
      backgroundColor : '#FFAE3C'
    });
    lModalPanel.futureDetailPanel.detailPanel.spanPanel.infoPanel.panels.push(lModalPanel.futureDetailPanel.detailPanel.spanPanel.infoPanel.evaluationPanel);
    lModalPanel.futureDetailPanel.detailPanel.spanPanel.infoPanel.evaluationPanel.imageContainerPanel = new cPanel({
      align : eAlign.eTop,
      height : 100,
      backgroundColor : 'transparent'
    });
    lModalPanel.futureDetailPanel.detailPanel.spanPanel.infoPanel.evaluationPanel.panels.push(lModalPanel.futureDetailPanel.detailPanel.spanPanel.infoPanel.evaluationPanel.imageContainerPanel);
    lModalPanel.futureDetailPanel.detailPanel.spanPanel.infoPanel.evaluationPanel.imageContainerPanel.imagePanel = new cPanel({
      align : eAlign.eCenter,
      width : 90,
      height : 90,
      backgroundColor : 'transparent',
      image: this.screen.getImageClone(this.evaluateImageId),
      imageStretchWidth: 90,
      imageStretchHeight: 90
    });
    lModalPanel.futureDetailPanel.detailPanel.spanPanel.infoPanel.evaluationPanel.imageContainerPanel.panels.push(lModalPanel.futureDetailPanel.detailPanel.spanPanel.infoPanel.evaluationPanel.imageContainerPanel.imagePanel);
    lModalPanel.futureDetailPanel.detailPanel.spanPanel.infoPanel.evaluationPanel.textPanel = new cPanel({
      align : eAlign.eClient,
      backgroundColor :  this.stateColor,
      borderLeft: 30,
      borderRight: 30,
      borderBottom: 30,
      borderColor: '#FFAE3C',
      padding : 20,
      color : '#000000',
      fontSize: 30,
      textAlign: eTextAlign.eCenter,
      innerHTML :  this.state
    });
    lModalPanel.futureDetailPanel.detailPanel.spanPanel.infoPanel.evaluationPanel.panels.push(lModalPanel.futureDetailPanel.detailPanel.spanPanel.infoPanel.evaluationPanel.textPanel);
    lModalPanel.contentPanel.rerender();
    lModalPanel.futureDetailPanel.rerender();
    lModalPanel.futureDetailPanel.masterPanel.scrollToBottom();    
  };
})();
/**
  * Class clsCheckBox
  */
/*
  * Class clsCheckBox
  */
function clsCheckBox(aProperties) {
  var lProps = aProperties || {};
  lProps.shape = lProps.radioButtonStyle ? cPanel.cShapeCircleRect : cPanel.cShapeRectangle;
  cPanel.call(this, lProps);
  this.checked = (aProperties.checked === true) ? true : false;
  this.onCheckedChange = aProperties ? (aProperties.onCheckedChange ? aProperties.onCheckedChange : null) : null;
  this.radioButtonStyle = aProperties ? (aProperties.radioButtonStyle ? true : false) : false;
  this.checkedPanel = new cPanel({
    shape: this.radioButtonStyle ? cPanel.cShapeCircleRect : cPanel.cShapeRectangle,
    align: eAlign.eClient,
    margin: 8,
    backgroundColor: (this.checked ? '#22b14c' : '#444444'),
    border: 6,
    borderColor: '#444444' //'#262626'
  });
  this.panels.push(this.checkedPanel);
}
clsCheckBox.deriveFrom(cPanel);
(function() {
  clsCheckBox.prototype.checked = false;
  clsCheckBox.prototype.onCheckedChange = null;
  clsCheckBox.prototype.radioButtonStyle = false;
  clsCheckBox.prototype.checkedPanel = null;
  clsCheckBox.prototype.setChecked = function(aChecked) {
    if (this.checked != aChecked) {
      this.checked = aChecked;
      this.checkedPanel.setBackgroundColor(this.checked ? '#22b14c' : '#444444');
      if (this.onCheckedChange) {
        this.onCheckedChange();
      }
    }
  };
  clsCheckBox.prototype.onClick = function() {
    this.checked = !this.checked;
    this.checkedPanel.setBackgroundColor(this.checked ? '#22b14c' : '#444444');
    if (this.onCheckedChange) {
      this.onCheckedChange();
    }
  };
})();
/**
 * Class cViewMultiversePanel
 */
function cViewMultiversePanel(aProperties) {
  cPanel.call(this, aProperties);
  var lThis = this;
  this.screen = aProperties.screen;
  this.futureGeneratorThreadActive = false;
  this.maxTotalFutures = 1000;
  this.firstOnVisible = true;
  this.expansionMode = cViewMultiversePanel.eExpansionMode_Manual;
  this.viewMode = cViewMultiversePanel.eViewMode_Fit;
  this.viewOffset = { left: 0, top: 0 };
  this.changesImageId = aProperties.changesImage;
  this.evaluateImageId = aProperties.evaluateImage;
  this.viewMultiverse = new cPanel({
    align : eAlign.eClient,
    backgroundColor : 'transparent'
  });
  this.panels.push(this.viewMultiverse);
  this.viewOverlay = null;
  this.topControlPanel = new cPanel({
    align : eAlign.eTop,
    height : 48,
    paddingBottom : 4,
    backgroundColor : '#777777'
  });
  this.viewMultiverse.panels.push(this.topControlPanel);
  this.topControlPanel.innerControlPanel = new cPanel({
    align : eAlign.eClient, //eAlign.eLeft,
    width : 624,
    backgroundColor : '#777777' //'#222222'
  });
  this.topControlPanel.panels.push(this.topControlPanel.innerControlPanel);
  this.topControlPanel.innerControlPanel.homePanel = new cPanel({
    align : eAlign.eLeft,
    width : 100,
    paddingTop : 10,
    shape: cPanel.cShapeRoundRect,
    borderRadius: 8,
    backgroundColor : '#333333',
    color : '#cccccc',
    fontSize : 20,
    fontBold : true,
    textAlign : eTextAlign.eCenter,
    innerHTML: 'HOME',
    onClick : function () {
      var lWindowWidth = lThis.viewFlat.viewMultiverse_Future.getInnerWidth();
      var lHalfWindowWidth = ((lWindowWidth / 2) | 0);
      lThis.viewOffset.left = lHalfWindowWidth;
      if (lThis.viewOffset.left > 240) {
        lThis.viewOffset.left = 240;
      }
      lThis.viewOffset.top = 140;
      lThis.onUpdateMultiverse();
    }
  });
  this.topControlPanel.innerControlPanel.panels.push(this.topControlPanel.innerControlPanel.homePanel);
  this.topControlPanel.innerControlPanel.viewModePanel = new cPanel({
    align : eAlign.eLeft,
    width : 292,
    marginLeft : 10,
    backgroundColor : 'transparent'
  });
  this.topControlPanel.innerControlPanel.panels.push(this.topControlPanel.innerControlPanel.viewModePanel);
  this.topControlPanel.innerControlPanel.viewModePanel.labelPanel = new cPanel({
    align : eAlign.eLeft,
    width : 86,
    marginLeft : 20,
    marginRight : 10,
    paddingTop: 12,
    backgroundColor : 'transparent',
    color : '#eeeeee',
    fontSize : 16,
    fontBold : true,
    textAlign : eTextAlign.eRight,
    innerHTML: 'ZOOM:'
  });
  this.topControlPanel.innerControlPanel.viewModePanel.panels.push(this.topControlPanel.innerControlPanel.viewModePanel.labelPanel);
  this.topControlPanel.innerControlPanel.viewModePanel.fitPanel = new cPanel({
    align : eAlign.eLeft,
    width : 96,
    marginRight : 4,
    shape: cPanel.cShapeRoundRect,
    borderRadius: 8,
    backgroundColor : '#333333',
    onClick : function () {
      if (lThis.viewMode != cViewMultiversePanel.eViewMode_Fit) {
        lThis.viewMode = cViewMultiversePanel.eViewMode_Fit;
        lThis.topControlPanel.innerControlPanel.viewModePanel.fitPanel.labelPanel.setColor('#ffffff');
        lThis.topControlPanel.innerControlPanel.viewModePanel.fitPanel.indicatorPanel.setBackgroundColor('#993333');
        lThis.topControlPanel.innerControlPanel.viewModePanel.flatPanel.labelPanel.setColor('#cccccc');
        lThis.topControlPanel.innerControlPanel.viewModePanel.flatPanel.indicatorPanel.setBackgroundColor('transparent');
        lThis.viewFlat.hide();
        lThis.viewFit.show();
        lThis.onUpdateMultiverse();
      }
    }
  });
  this.topControlPanel.innerControlPanel.viewModePanel.panels.push(this.topControlPanel.innerControlPanel.viewModePanel.fitPanel);
  this.topControlPanel.innerControlPanel.viewModePanel.fitPanel.labelPanel = new cPanel({
    align : eAlign.eClient,
    paddingTop: 12,
    backgroundColor : 'transparent',
    color : (this.viewMode == cViewMultiversePanel.eViewMode_Fit ? '#ffffff' : '#cccccc'),
    fontSize : 12,
    fontBold : true,
    textAlign : eTextAlign.eCenter,
    innerHTML: 'OUT',
    cursor: 'pointer'
  });
  this.topControlPanel.innerControlPanel.viewModePanel.fitPanel.panels.push(this.topControlPanel.innerControlPanel.viewModePanel.fitPanel.labelPanel);
  this.topControlPanel.innerControlPanel.viewModePanel.fitPanel.indicatorPanel = new cPanel({
    align : eAlign.eNone,
    left : 12,
    top : 32,
    width : 70,
    height : 4,
    backgroundColor : (this.viewMode == cViewMultiversePanel.eViewMode_Fit ? '#993333' : 'transparent')
  });
  this.topControlPanel.innerControlPanel.viewModePanel.fitPanel.panels.push(this.topControlPanel.innerControlPanel.viewModePanel.fitPanel.indicatorPanel);
  this.topControlPanel.innerControlPanel.viewModePanel.flatPanel = new cPanel({
    align : eAlign.eLeft,
    width : 96,
    marginRight : 4,
    shape: cPanel.cShapeRoundRect,
    borderRadius: 8,
    backgroundColor : '#333333',
    onClick : function () {
      if (lThis.viewMode != cViewMultiversePanel.eViewMode_Flat) {
        lThis.viewMode = cViewMultiversePanel.eViewMode_Flat;
        lThis.topControlPanel.innerControlPanel.viewModePanel.fitPanel.labelPanel.setColor('#cccccc');
        lThis.topControlPanel.innerControlPanel.viewModePanel.fitPanel.indicatorPanel.setBackgroundColor('transparent');
        lThis.topControlPanel.innerControlPanel.viewModePanel.flatPanel.labelPanel.setColor('#ffffff');
        lThis.topControlPanel.innerControlPanel.viewModePanel.flatPanel.indicatorPanel.setBackgroundColor('#993333');
        lThis.viewFlat.show();
        lThis.viewFit.hide();
        lThis.onUpdateMultiverse();
      }
    }
  });
  this.topControlPanel.innerControlPanel.viewModePanel.panels.push(this.topControlPanel.innerControlPanel.viewModePanel.flatPanel);
  this.topControlPanel.innerControlPanel.viewModePanel.flatPanel.labelPanel = new cPanel({
    align : eAlign.eClient,
    paddingTop: 2,
    backgroundColor : 'transparent',
    color : (this.viewMode == cViewMultiversePanel.eViewMode_Flat ? '#ffffff' : '#cccccc'),
    fontSize : 26,
    fontBold : true,
    textAlign : eTextAlign.eCenter,
    innerHTML: 'IN',
    cursor: 'pointer'
  });
  this.topControlPanel.innerControlPanel.viewModePanel.flatPanel.panels.push(this.topControlPanel.innerControlPanel.viewModePanel.flatPanel.labelPanel);
  this.topControlPanel.innerControlPanel.viewModePanel.flatPanel.indicatorPanel = new cPanel({
    align : eAlign.eNone,
    left : 12,
    top : 32,
    width : 70,
    height : 4,
    backgroundColor : (this.viewMode == cViewMultiversePanel.eViewMode_Flat ? '#993333' : 'transparent')
  });
  this.topControlPanel.innerControlPanel.viewModePanel.flatPanel.panels.push(this.topControlPanel.innerControlPanel.viewModePanel.flatPanel.indicatorPanel);
  this.topControlPanel.innerControlPanel.muliverseSizePanel = new cPanel({
    align : eAlign.eLeft,
    width : 220,
    marginLeft: 20,
    marginTop: 2,
    marginBottom: 2,
    backgroundColor : '#333333'
  });
  this.topControlPanel.innerControlPanel.panels.push(this.topControlPanel.innerControlPanel.muliverseSizePanel);
  this.topControlPanel.innerControlPanel.muliverseSizePanel.scrollPanel = new cPanel({
    align : eAlign.eNone,
    left :  0,
    top : 0,
    height : 40,
    width : 1, // filled dynamically
    backgroundColor : '#444444'
  });
  this.topControlPanel.innerControlPanel.muliverseSizePanel.panels.push(this.topControlPanel.innerControlPanel.muliverseSizePanel.scrollPanel);
  this.topControlPanel.innerControlPanel.muliverseSizePanel.labelPanel = new cPanel({
    align : eAlign.eClient,
    paddingTop: 8,
    backgroundColor : 'transparent',
    color : '#cccccc',
    fontSize : 20,
    fontBold : true,
    textAlign : eTextAlign.eCenter,
    innerHTML: '' // filled dynamically
  });
  this.topControlPanel.innerControlPanel.muliverseSizePanel.panels.push(this.topControlPanel.innerControlPanel.muliverseSizePanel.labelPanel);
  this.topControlPanel.innerControlPanel.muliverseSizePanel.setNumberOfWorlds = function(aNumberOfWorlds, aMaxNumberOfWorlds) {
    lThis.topControlPanel.innerControlPanel.muliverseSizePanel.scrollPanel.setWidth((((lThis.topControlPanel.innerControlPanel.muliverseSizePanel.width - 20) * aNumberOfWorlds) / aMaxNumberOfWorlds) | 0);
    lThis.topControlPanel.innerControlPanel.muliverseSizePanel.labelPanel.setInnerHTML('' + aNumberOfWorlds + ' ' + (aNumberOfWorlds == 1 ? 'world' : 'worlds'));
  };
  this.bottomControlPanel = new cPanel({
    align : eAlign.eBottom,
    height : 48,
    paddingTop : 4,
    backgroundColor : '#777777'
  });
  this.viewMultiverse.panels.push(this.bottomControlPanel);
  this.bottomControlPanel.innerControlPanel = new cPanel({
    align : eAlign.eClient, //eAlign.eLeft,
    width : 624,
    backgroundColor : '#777777' //'#222222'
  });
  this.bottomControlPanel.panels.push(this.bottomControlPanel.innerControlPanel);
  this.bottomControlPanel.innerControlPanel.resetMuliversePanel = new cPanel({
    align : eAlign.eLeft,
    width : 100,
    paddingTop : 10,
    shape: cPanel.cShapeRoundRect,
    borderRadius: 8,
    backgroundColor : '#333333',
    color : '#cccccc',
    fontSize : 20,
    fontBold : true,
    textAlign : eTextAlign.eCenter,
    innerHTML: 'RESET',
    onClick : function () {
      lThis.resetMultiverse();
    }
  });
  this.bottomControlPanel.innerControlPanel.panels.push(this.bottomControlPanel.innerControlPanel.resetMuliversePanel);
  this.bottomControlPanel.innerControlPanel.expansionModePanel = new cPanel({
    align : eAlign.eLeft,
    width : 292,
    borderRadius: 12,
    backgroundColor : 'transparent' //'#222222'
  });
  this.bottomControlPanel.innerControlPanel.panels.push(this.bottomControlPanel.innerControlPanel.expansionModePanel);
  this.bottomControlPanel.innerControlPanel.expansionModePanel.labelPanel = new cPanel({
    align : eAlign.eLeft,
    width : 96,
    marginLeft : 10,
    marginRight : 10,
    paddingTop: 3,
    backgroundColor : 'transparent',
    color : '#eeeeee',
    fontSize : 16,
    fontBold : true,
    textAlign : eTextAlign.eRight,
    innerHTML: 'AUTO SEARCH:'
  });
  this.bottomControlPanel.innerControlPanel.expansionModePanel.panels.push(this.bottomControlPanel.innerControlPanel.expansionModePanel.labelPanel);
  this.bottomControlPanel.innerControlPanel.expansionModePanel.manualPanel = new cPanel({
    align : eAlign.eLeft,
    width : 96,
    marginRight : 4,
    shape: cPanel.cShapeRoundRect,
    borderRadius: 8,
    backgroundColor : '#333333',
    onClick : function () {
      lThis.expansionMode = cViewMultiversePanel.eExpansionMode_Manual;
      lThis.bottomControlPanel.innerControlPanel.expansionModePanel.manualPanel.labelPanel.setColor('#ffffff');
      lThis.bottomControlPanel.innerControlPanel.expansionModePanel.manualPanel.indicatorPanel.setBackgroundColor('#993333');
      lThis.bottomControlPanel.innerControlPanel.expansionModePanel.autoPanel.labelPanel.setColor('#33cc33');
      lThis.bottomControlPanel.innerControlPanel.expansionModePanel.autoPanel.indicatorPanel.setBackgroundColor('transparent');
      lThis.onUpdateMultiverse();
    }
  });
  this.bottomControlPanel.innerControlPanel.expansionModePanel.panels.push(this.bottomControlPanel.innerControlPanel.expansionModePanel.manualPanel);
  this.bottomControlPanel.innerControlPanel.expansionModePanel.manualPanel.labelPanel = new cPanel({
    align : eAlign.eClient,
    paddingTop: 4,
    backgroundColor : 'transparent',
    color : '#ffffff',
    fontSize : 20,
    fontBold : true,
    textAlign : eTextAlign.eCenter,
    innerHTML: 'PAUSE',
    cursor: 'pointer'
  });
  this.bottomControlPanel.innerControlPanel.expansionModePanel.manualPanel.panels.push(this.bottomControlPanel.innerControlPanel.expansionModePanel.manualPanel.labelPanel);
  this.bottomControlPanel.innerControlPanel.expansionModePanel.manualPanel.indicatorPanel = new cPanel({
    align : eAlign.eNone,
    left : 12,
    top : 32,
    width : 70,
    height : 4,
    backgroundColor :  '#993333' //'transparent' // '#993333'
  });
  this.bottomControlPanel.innerControlPanel.expansionModePanel.manualPanel.panels.push(this.bottomControlPanel.innerControlPanel.expansionModePanel.manualPanel.indicatorPanel);
  this.bottomControlPanel.innerControlPanel.expansionModePanel.autoPanel = new cPanel({
    align : eAlign.eLeft,
    width : 96,
    marginRight : 4,
    shape: cPanel.cShapeRoundRect,
    borderRadius: 8,
    backgroundColor : '#333333',
    onClick : function () {
      lThis.expansionMode = cViewMultiversePanel.eExpansionMode_Auto;
      lThis.bottomControlPanel.innerControlPanel.expansionModePanel.manualPanel.labelPanel.setColor('#cccccc');
      lThis.bottomControlPanel.innerControlPanel.expansionModePanel.manualPanel.indicatorPanel.setBackgroundColor('transparent');
      lThis.bottomControlPanel.innerControlPanel.expansionModePanel.autoPanel.labelPanel.setColor('#33cc33');
      lThis.bottomControlPanel.innerControlPanel.expansionModePanel.autoPanel.indicatorPanel.setBackgroundColor('#993333');
      lThis.onUpdateMultiverse();
    }
  });
  this.bottomControlPanel.innerControlPanel.expansionModePanel.panels.push(this.bottomControlPanel.innerControlPanel.expansionModePanel.autoPanel);
  this.bottomControlPanel.innerControlPanel.expansionModePanel.autoPanel.labelPanel = new cPanel({
    align : eAlign.eClient,
    paddingTop: 4,
    backgroundColor : 'transparent',
    color : '#33cc33', //'#33cc33', //#cccccc',
    fontSize : 20,
    fontBold : true,
    textAlign : eTextAlign.eCenter,
    innerHTML: 'GO!',
    cursor: 'pointer'
  });
  this.bottomControlPanel.innerControlPanel.expansionModePanel.autoPanel.panels.push(this.bottomControlPanel.innerControlPanel.expansionModePanel.autoPanel.labelPanel);
  this.bottomControlPanel.innerControlPanel.expansionModePanel.autoPanel.indicatorPanel = new cPanel({
    align : eAlign.eNone,
    left : 12,
    top : 32,
    width : 70,
    height : 4,
    backgroundColor : 'transparent' //'#993333'
  });
  this.bottomControlPanel.innerControlPanel.expansionModePanel.autoPanel.panels.push(this.bottomControlPanel.innerControlPanel.expansionModePanel.autoPanel.indicatorPanel);
  this.bottomControlPanel.innerControlPanel.searchMethodOptionsPanel = new cPanel({
    align : eAlign.eLeft,
    width : 180,
    marginLeft : 20,
    paddingTop : 3,
    shape: cPanel.cShapeRoundRect,
    borderRadius: 8,
    backgroundColor : '#333333',
    color : '#cccccc',
    fontSize : 15,
    fontBold : true,
    textAlign : eTextAlign.eCenter,
    innerHTML: 'Search method<br /><span style="color: #ffffff;">breadth-first</span>',
    onClick : function () {
      var lModalPanel = new clsModalPanel({
        onClick: function() {
          setTimeout(function() {
            lThis.screen.panel.removePanel(lModalPanel);
          }, 10);
        }
      });
      lThis.screen.panel.appendPanel(lModalPanel);
      lModalPanel.optionsPanel = new cPanel({
        align: eAlign.eCenter,
        shape: cPanel.cShapeRoundRect,
        width: 720,
        height: 480,
        border: 1,
        borderColor: '#262626',
        borderRadius: 16,
        backgroundColor: '#262626', 
        color: '#ffffff',
        fontSize: 36,
        onClick: function() {
          this.stopBubble = true;
        }
      });
      lModalPanel.contentPanel.panels.push(lModalPanel.optionsPanel);
      lModalPanel.optionsPanel.headerPanel = new cPanel({
        align: eAlign.eTop,
        height: 50,
        paddingLeft: 20,
        backgroundColor: '#444444', 
        color: '#eeeeee',
        fontSize: 36,
        innerHTML: 'Search method'
      });
      lModalPanel.optionsPanel.panels.push(lModalPanel.optionsPanel.headerPanel);
      lModalPanel.optionsPanel.bottomPanel = new cPanel({
        align: eAlign.eBottom,
        height: 70,
        paddingLeft: 20,
        backgroundColor: '#444444'
      });
      lModalPanel.optionsPanel.panels.push(lModalPanel.optionsPanel.bottomPanel);
      lModalPanel.optionsPanel.bottomPanel.closeButton = new cPanel({
        align: eAlign.eCenterVertical,
        shape: cPanel.cShapeRoundRect,
        width: 200,
        marginTop: 10,
        marginBottom: 10,
        padding: 2,
        backgroundColor: '#262626',
        border: 1,
        borderColor: '#262626',
        borderRadius: 16,
        color: '#eeeeee',
        fontSize: 36,
        textAlign: eTextAlign.eCenter,
        innerHTML: 'close',
        onClick: function() {
          this.stopBubble = true;
          setTimeout(function() {
            lThis.screen.panel.removePanel(lModalPanel);
          }, 10);
        }
      });
      lModalPanel.optionsPanel.bottomPanel.panels.push(lModalPanel.optionsPanel.bottomPanel.closeButton);
      lModalPanel.optionsPanel.contentPanel = new cPanel({
        align: eAlign.eClient,
        paddingTop: 20,
        backgroundColor: 'transparent'
      });
      lModalPanel.optionsPanel.panels.push(lModalPanel.optionsPanel.contentPanel);
      lModalPanel.optionsPanel.contentPanel.optionBreadthFirstPanel = new cPanel({
        align: eAlign.eTop,
        height: 80,
        backgroundColor: 'transparent',
        onClick: function() {
          this.stopBubble = true;
          lModalPanel.optionsPanel.contentPanel.optionBreadthFirstPanel.checkBoxPanel.setChecked(true);
        }
      });
      lModalPanel.optionsPanel.contentPanel.panels.push(lModalPanel.optionsPanel.contentPanel.optionBreadthFirstPanel);
      lModalPanel.optionsPanel.contentPanel.optionBreadthFirstPanel.checkBoxPanel = new clsCheckBox({
        align: eAlign.eLeft,
        width: 100,
        marginLeft: 30,
        marginTop: 10,
        marginRight: 10,
        marginBottom: 10,
        backgroundColor: '#101010',
        radioButtonStyle: true,
        checked: (Model.searchAlgorithm == cModel.searchAlgorithms.msaBreadthFirst),
        onCheckedChange: function() {
          if (this.checked) {
            Model.searchAlgorithm = cModel.searchAlgorithms.msaBreadthFirst;
            lModalPanel.optionsPanel.contentPanel.optionHighScoreFirstPanel.checkBoxPanel.setChecked(false);
            lModalPanel.optionsPanel.contentPanel.optionLeftSideFirstPanel.checkBoxPanel.setChecked(false);
            lModalPanel.optionsPanel.contentPanel.optionRightSideFirstPanel.checkBoxPanel.setChecked(false);
            lThis.bottomControlPanel.innerControlPanel.searchMethodOptionsPanel.updateSearchMethodCaption();
          } 
        }
      });
      lModalPanel.optionsPanel.contentPanel.optionBreadthFirstPanel.panels.push(lModalPanel.optionsPanel.contentPanel.optionBreadthFirstPanel.checkBoxPanel);
      lModalPanel.optionsPanel.contentPanel.optionBreadthFirstPanel.labelPanel = new cPanel({
        align: eAlign.eLeft,
        width: 600,
        paddingLeft: 30,
        paddingTop: 20,
        backgroundColor: 'transparent', //'#aa9977',
        fontSize: 32,
        color: '#eeeeee',
        innerHTML: 'breadth first'
      });
      lModalPanel.optionsPanel.contentPanel.optionBreadthFirstPanel.panels.push(lModalPanel.optionsPanel.contentPanel.optionBreadthFirstPanel.labelPanel);
      lModalPanel.optionsPanel.contentPanel.optionHighScoreFirstPanel = new cPanel({
        align: eAlign.eTop,
        height: 80,
        backgroundColor: 'transparent',
        onClick: function() {
          this.stopBubble = true;
          lModalPanel.optionsPanel.contentPanel.optionHighScoreFirstPanel.checkBoxPanel.setChecked(true);
        }
      });
      lModalPanel.optionsPanel.contentPanel.panels.push(lModalPanel.optionsPanel.contentPanel.optionHighScoreFirstPanel);
      lModalPanel.optionsPanel.contentPanel.optionHighScoreFirstPanel.checkBoxPanel = new clsCheckBox({
        align: eAlign.eLeft,
        width: 100,
        marginLeft: 30,
        marginTop: 10,
        marginRight: 10,
        marginBottom: 10,
        backgroundColor: '#101010',
        radioButtonStyle: true,
        checked: (Model.searchAlgorithm == cModel.searchAlgorithms.msaHighScoreFirst),
        onCheckedChange: function() {
          if (this.checked) {
            Model.searchAlgorithm = cModel.searchAlgorithms.msaHighScoreFirst;
            lModalPanel.optionsPanel.contentPanel.optionBreadthFirstPanel.checkBoxPanel.setChecked(false);
            lModalPanel.optionsPanel.contentPanel.optionLeftSideFirstPanel.checkBoxPanel.setChecked(false);
            lModalPanel.optionsPanel.contentPanel.optionRightSideFirstPanel.checkBoxPanel.setChecked(false);
            lThis.bottomControlPanel.innerControlPanel.searchMethodOptionsPanel.updateSearchMethodCaption();
          } 
        }
      });
      lModalPanel.optionsPanel.contentPanel.optionHighScoreFirstPanel.panels.push(lModalPanel.optionsPanel.contentPanel.optionHighScoreFirstPanel.checkBoxPanel);
      lModalPanel.optionsPanel.contentPanel.optionHighScoreFirstPanel.labelPanel = new cPanel({
        align: eAlign.eLeft,
        width: 600,
        paddingLeft: 30,
        paddingTop: 20,
        backgroundColor: 'transparent', //'#aa9977',
        fontSize: 32,
        color: '#eeeeee',
        innerHTML: 'high like-score first'
      });
      lModalPanel.optionsPanel.contentPanel.optionHighScoreFirstPanel.panels.push(lModalPanel.optionsPanel.contentPanel.optionHighScoreFirstPanel.labelPanel);
      lModalPanel.optionsPanel.contentPanel.optionLeftSideFirstPanel = new cPanel({
        align: eAlign.eTop,
        height: 80,
        backgroundColor: 'transparent',
        onClick: function() {
          this.stopBubble = true;
          lModalPanel.optionsPanel.contentPanel.optionLeftSideFirstPanel.checkBoxPanel.setChecked(true);
        }
      });
      lModalPanel.optionsPanel.contentPanel.panels.push(lModalPanel.optionsPanel.contentPanel.optionLeftSideFirstPanel);
      lModalPanel.optionsPanel.contentPanel.optionLeftSideFirstPanel.checkBoxPanel = new clsCheckBox({
        align: eAlign.eLeft,
        width: 100,
        marginLeft: 30,
        marginTop: 10,
        marginRight: 10,
        marginBottom: 10,
        backgroundColor: '#101010',
        radioButtonStyle: true,
        checked: (Model.searchAlgorithm == cModel.searchAlgorithms.msaLeftSideFirst),
        onCheckedChange: function() {
          if (this.checked) {
            Model.searchAlgorithm = cModel.searchAlgorithms.msaLeftSideFirst;
            lModalPanel.optionsPanel.contentPanel.optionBreadthFirstPanel.checkBoxPanel.setChecked(false);
            lModalPanel.optionsPanel.contentPanel.optionHighScoreFirstPanel.checkBoxPanel.setChecked(false);
            lModalPanel.optionsPanel.contentPanel.optionRightSideFirstPanel.checkBoxPanel.setChecked(false);
            lThis.bottomControlPanel.innerControlPanel.searchMethodOptionsPanel.updateSearchMethodCaption();
          } 
        }
      });
      lModalPanel.optionsPanel.contentPanel.optionLeftSideFirstPanel.panels.push(lModalPanel.optionsPanel.contentPanel.optionLeftSideFirstPanel.checkBoxPanel);
      lModalPanel.optionsPanel.contentPanel.optionLeftSideFirstPanel.labelPanel = new cPanel({
        align: eAlign.eLeft,
        width: 600,
        paddingLeft: 30,
        paddingTop: 20,
        backgroundColor: 'transparent', //'#aa9977',
        fontSize: 32,
        color: '#eeeeee',
        innerHTML: 'left side first'
      });
      lModalPanel.optionsPanel.contentPanel.optionLeftSideFirstPanel.panels.push(lModalPanel.optionsPanel.contentPanel.optionLeftSideFirstPanel.labelPanel);
      lModalPanel.optionsPanel.contentPanel.optionRightSideFirstPanel = new cPanel({
        align: eAlign.eTop,
        height: 80,
        backgroundColor: 'transparent',
        onClick: function() {
          this.stopBubble = true;
          lModalPanel.optionsPanel.contentPanel.optionRightSideFirstPanel.checkBoxPanel.setChecked(true);
        }
      });
      lModalPanel.optionsPanel.contentPanel.panels.push(lModalPanel.optionsPanel.contentPanel.optionRightSideFirstPanel);
      lModalPanel.optionsPanel.contentPanel.optionRightSideFirstPanel.checkBoxPanel = new clsCheckBox({
        align: eAlign.eLeft,
        width: 100,
        marginLeft: 30,
        marginTop: 10,
        marginRight: 10,
        marginBottom: 10,
        backgroundColor: '#101010',
        radioButtonStyle: true,
        checked: (Model.searchAlgorithm == cModel.searchAlgorithms.msaRightSideFirst),
        onCheckedChange: function() {
          if (this.checked) {
            Model.searchAlgorithm = cModel.searchAlgorithms.msaRightSideFirst;
            lModalPanel.optionsPanel.contentPanel.optionBreadthFirstPanel.checkBoxPanel.setChecked(false);
            lModalPanel.optionsPanel.contentPanel.optionHighScoreFirstPanel.checkBoxPanel.setChecked(false);
            lModalPanel.optionsPanel.contentPanel.optionLeftSideFirstPanel.checkBoxPanel.setChecked(false);
            lThis.bottomControlPanel.innerControlPanel.searchMethodOptionsPanel.updateSearchMethodCaption();
          } 
        }
      });
      lModalPanel.optionsPanel.contentPanel.optionRightSideFirstPanel.panels.push(lModalPanel.optionsPanel.contentPanel.optionRightSideFirstPanel.checkBoxPanel);
      lModalPanel.optionsPanel.contentPanel.optionRightSideFirstPanel.labelPanel = new cPanel({
        align: eAlign.eLeft,
        width: 600,
        paddingLeft: 30,
        paddingTop: 20,
        backgroundColor: 'transparent', //'#aa9977',
        fontSize: 32,
        color: '#eeeeee',
        innerHTML: 'right side first'
      });
      lModalPanel.optionsPanel.contentPanel.optionRightSideFirstPanel.panels.push(lModalPanel.optionsPanel.contentPanel.optionRightSideFirstPanel.labelPanel);
      lModalPanel.contentPanel.rerender();
      lModalPanel.optionsPanel.rerender();
      lModalPanel.contentPanel.rerender();
    }
  });
  this.bottomControlPanel.innerControlPanel.panels.push(this.bottomControlPanel.innerControlPanel.searchMethodOptionsPanel);
  this.bottomControlPanel.innerControlPanel.searchMethodOptionsPanel.updateSearchMethodCaption = function() {
    var lCaption = 'Search method<br /><span style="color: #ffffff;">';
    if (Model.searchAlgorithm == cModel.searchAlgorithms.msaBreadthFirst) {
      lCaption += 'breadth first';
    } else if (Model.searchAlgorithm == cModel.searchAlgorithms.msaHighScoreFirst) {
      lCaption += 'high like-score first';
    } else if (Model.searchAlgorithm == cModel.searchAlgorithms.msaLeftSideFirst) {
      lCaption += 'left side first';
    } else if (Model.searchAlgorithm == cModel.searchAlgorithms.msaRightSideFirst) {
      lCaption += 'right side first';
    }
    lCaption += '</span>';
    this.setInnerHTML(lCaption);
  };
  this.bottomControlPanel.innerControlPanel.searchMethodOptionsPanel.updateSearchMethodCaption();
  this.bottomControlPanel.innerControlPanel.optionsPanel = new cPanel({
    align : eAlign.eLeft,
    width : 140,
    marginLeft : 20,
    paddingTop : 10,
    shape: cPanel.cShapeRoundRect,
    borderRadius: 8,
    backgroundColor : '#333333',
    color : '#cccccc',
    fontSize : 20,
    fontBold : true,
    textAlign : eTextAlign.eCenter,
    innerHTML: 'OPTIONS',
    onClick : function () {
      var lModalPanel = new clsModalPanel({
        onClick: function() {
          setTimeout(function() {
            lThis.screen.panel.removePanel(lModalPanel);
          }, 10);
        }
      });
      lThis.screen.panel.appendPanel(lModalPanel);
      lModalPanel.optionsPanel = new cPanel({
        align: eAlign.eCenter,
        shape: cPanel.cShapeRoundRect,
        width: 720,
        height: 400,
        border: 1,
        borderColor: '#262626',
        borderRadius: 16,
        backgroundColor: '#262626', 
        color: '#ffffff',
        fontSize: 36,
        onClick: function() {
          this.stopBubble = true;
        }
      });
      lModalPanel.contentPanel.panels.push(lModalPanel.optionsPanel);
      lModalPanel.optionsPanel.headerPanel = new cPanel({
        align: eAlign.eTop,
        height: 50,
        paddingLeft: 20,
        backgroundColor: '#444444', 
        color: '#eeeeee',
        fontSize: 36,
        innerHTML: 'Multiverse options'
      });
      lModalPanel.optionsPanel.panels.push(lModalPanel.optionsPanel.headerPanel);
      lModalPanel.optionsPanel.bottomPanel = new cPanel({
        align: eAlign.eBottom,
        height: 70,
        paddingLeft: 20,
        backgroundColor: '#444444'
      });
      lModalPanel.optionsPanel.panels.push(lModalPanel.optionsPanel.bottomPanel);
      lModalPanel.optionsPanel.bottomPanel.closeButton = new cPanel({
        align: eAlign.eCenterVertical,
        shape: cPanel.cShapeRoundRect,
        width: 200,
        marginTop: 10,
        marginBottom: 10,
        padding: 2,
        backgroundColor: '#262626',
        border: 1,
        borderColor: '#262626',
        borderRadius: 16,
        color: '#eeeeee',
        fontSize: 36,
        textAlign: eTextAlign.eCenter,
        innerHTML: 'close',
        onClick: function() {
          this.stopBubble = true;
          setTimeout(function() {
            lThis.screen.panel.removePanel(lModalPanel);
          }, 10);
        }
      });
      lModalPanel.optionsPanel.bottomPanel.panels.push(lModalPanel.optionsPanel.bottomPanel.closeButton);
      lModalPanel.optionsPanel.contentPanel = new cPanel({
        align: eAlign.eClient,
        backgroundColor: 'transparent'
      });
      lModalPanel.optionsPanel.panels.push(lModalPanel.optionsPanel.contentPanel);
      lModalPanel.optionsPanel.contentPanel.topHeaderPanel = new cPanel({
        align: eAlign.eTop,
        height: 60,
        backgroundColor: 'transparent'
      });
      lModalPanel.optionsPanel.contentPanel.panels.push(lModalPanel.optionsPanel.contentPanel.topHeaderPanel);
      lModalPanel.optionsPanel.contentPanel.topHeaderPanel.labelPanel = new cPanel({
        align: eAlign.eClient,
        paddingLeft: 30,
        paddingTop: 10,
        backgroundColor: '#111111', //'#aa9977',
        textAlign: eTextAlign.eLeft,
        fontSize: 32,
        color: '#eeeeee',
        innerHTML: 'For each new created world:'
      });
      lModalPanel.optionsPanel.contentPanel.topHeaderPanel.panels.push(lModalPanel.optionsPanel.contentPanel.topHeaderPanel.labelPanel);
      lModalPanel.optionsPanel.contentPanel.optionStopPanel = new cPanel({
        align: eAlign.eTop,
        height: 70,
        backgroundColor: 'transparent'
      });
      lModalPanel.optionsPanel.contentPanel.panels.push(lModalPanel.optionsPanel.contentPanel.optionStopPanel);
      lModalPanel.optionsPanel.contentPanel.optionStopPanel.labelPanel = new cPanel({
        align: eAlign.eLeft,
        width: 600,
        paddingRight: 30,
        paddingTop: 15,
        backgroundColor: 'transparent', //'#aa9977',
        textAlign: eTextAlign.eRight,
        fontSize: 32,
        color: '#eeeeee',
        innerHTML: 'pause search if new goal'
      });
      lModalPanel.optionsPanel.contentPanel.optionStopPanel.panels.push(lModalPanel.optionsPanel.contentPanel.optionStopPanel.labelPanel);
      lModalPanel.optionsPanel.contentPanel.optionStopPanel.checkBoxPanel = new clsCheckBox({
        align: eAlign.eLeft,
        width: 70,
        margin: 5,
        backgroundColor: '#101010',
        checked: Model.stopSearchWhenGoalFound,
        onCheckedChange: function() {
          Model.stopSearchWhenGoalFound = this.checked;
        }
      });
      lModalPanel.optionsPanel.contentPanel.optionStopPanel.panels.push(lModalPanel.optionsPanel.contentPanel.optionStopPanel.checkBoxPanel);
      lModalPanel.optionsPanel.contentPanel.optionIgnoreRepeatsPanel = new cPanel({
        align: eAlign.eTop,
        height: 70,
        backgroundColor: 'transparent'
      });
      lModalPanel.optionsPanel.contentPanel.panels.push(lModalPanel.optionsPanel.contentPanel.optionIgnoreRepeatsPanel);
      lModalPanel.optionsPanel.contentPanel.optionIgnoreRepeatsPanel.labelPanel = new cPanel({
        align: eAlign.eLeft,
        width: 600,
        paddingRight: 30,
        paddingTop: 15,
        backgroundColor: 'transparent', //'#aa9977',
        textAlign: eTextAlign.eRight,
        fontSize: 32,
        color: '#eeeeee',
        innerHTML: 'remove if repeating sequence'
      });
      lModalPanel.optionsPanel.contentPanel.optionIgnoreRepeatsPanel.panels.push(lModalPanel.optionsPanel.contentPanel.optionIgnoreRepeatsPanel.labelPanel);
      lModalPanel.optionsPanel.contentPanel.optionIgnoreRepeatsPanel.checkBoxPanel = new clsCheckBox({
        align: eAlign.eLeft,
        width: 70,
        margin: 5,
        backgroundColor: '#101010',
        checked: Model.ignoreSameAsParentOrSibling,
        onCheckedChange: function() {
          Model.ignoreSameAsParentOrSibling = this.checked;
        }
      });
      lModalPanel.optionsPanel.contentPanel.optionIgnoreRepeatsPanel.panels.push(lModalPanel.optionsPanel.contentPanel.optionIgnoreRepeatsPanel.checkBoxPanel);
      lModalPanel.optionsPanel.contentPanel.optionIgnoreIllegalPanel = new cPanel({
        align: eAlign.eTop,
        height: 70,
        backgroundColor: 'transparent'
      });
      lModalPanel.optionsPanel.contentPanel.panels.push(lModalPanel.optionsPanel.contentPanel.optionIgnoreIllegalPanel);
      lModalPanel.optionsPanel.contentPanel.optionIgnoreIllegalPanel.labelPanel = new cPanel({
        align: eAlign.eLeft,
        width: 600,
        paddingRight: 30,
        paddingTop: 15,
        backgroundColor: 'transparent', //'#aa9977',
        textAlign: eTextAlign.eRight,
        fontSize: 32,
        color: '#eeeeee',
        innerHTML: 'remove if illegal'
      });
      lModalPanel.optionsPanel.contentPanel.optionIgnoreIllegalPanel.panels.push(lModalPanel.optionsPanel.contentPanel.optionIgnoreIllegalPanel.labelPanel);
      lModalPanel.optionsPanel.contentPanel.optionIgnoreIllegalPanel.checkBoxPanel = new clsCheckBox({
        align: eAlign.eLeft,
        width: 70,
        margin: 5,
        backgroundColor: '#101010',
        checked: Model.ignoreIllegalFutures,
        onCheckedChange: function() {
          Model.ignoreIllegalFutures = this.checked;
        }
      });
      lModalPanel.optionsPanel.contentPanel.optionIgnoreIllegalPanel.panels.push(lModalPanel.optionsPanel.contentPanel.optionIgnoreIllegalPanel.checkBoxPanel);
      lModalPanel.contentPanel.rerender();
      lModalPanel.optionsPanel.rerender();
      lModalPanel.contentPanel.rerender();
    }
  });
  this.bottomControlPanel.innerControlPanel.panels.push(this.bottomControlPanel.innerControlPanel.optionsPanel);  
  this.viewFlat = new cPanel({
    align : eAlign.eClient,
    backgroundColor :  (this.viewMode == cViewMultiversePanel.eViewMode_Flat ? '#333333' : 'transparent'),
    visible : (this.viewMode == cViewMultiversePanel.eViewMode_Flat)
  });
  this.viewMultiverse.panels.push(this.viewFlat);
  this.viewFlat.offsetLeft = 0;
  this.viewFlat.offsetTop = 0;
  this.viewFlat.draggingOffset = false;
  this.viewFlat.draggingOffsetStartLeft = 0;
  this.viewFlat.draggingOffsetStartTop = 0;
  this.viewFlat.draggingOffsetStartX = 0;
  this.viewFlat.draggingOffsetStartY = 0;
  this.viewFlat.futurePanels = [];
  this.viewFlat.columnIndicatorPanels = [];
  this.viewFlat.levelIndicatorPanels = [];
  this.viewFlat.centerLinePanel = null;
  this.viewFlat.leftBlurPanel = null;
  this.viewFlat.rightBlurPanel = null;
  this.viewFlat.topBlurPanel = null;
  this.viewFlat.futureAxisImage = this.screen.getImageClone(aProperties.futureAxisImage);
  this.viewFlat.optionsAxisImage = this.screen.getImageClone(aProperties.optionsAxisImage);
  this.viewFlat.expandImageId = aProperties.expandImage;
  this.viewFlat.viewMultiverse_FutureBackground = new cPanel({
    align : eAlign.eClient,
    backgroundColor : '#333333' //'#ffeead'
  });
  this.viewFlat.panels.push(this.viewFlat.viewMultiverse_FutureBackground);
  this.viewFlat.visibleMultiversePanel = null;
  this.viewFlat.outerMultiversePanel = null;
  this.viewFlat.viewMultiverse_Future = new cPanel({
    align : eAlign.eClient,
    backgroundColor : 'transparent',
    onMouseDown : function(aX, aY) { lThis.onViewFlatFuturePanelMouseDown(aX, aY); },
    onMouseMove : function(aX, aY) { lThis.onViewFlatFuturePanelMouseMove(aX, aY); },
    onMouseUp : function(aX, aY) { lThis.onViewFlatFuturePanelMouseUp(aX, aY); },
    cursor : 'pointer',
    onScroll : function(aDelta) { lThis.onViewFlatFuturePanelScroll(aDelta); },
    onTap : function(aX, aY) { lThis.onViewFlatFuturePanelTap(aX, aY); }
  });
  this.viewFlat.panels.push(this.viewFlat.viewMultiverse_Future);
  this.viewFlat.viewMultiverse_FutureOverlay = new cPanel({
    align : eAlign.eClient,
    backgroundColor : 'transparent',
    invisibleToMouseEvents: true
  });
  this.viewFlat.panels.push(this.viewFlat.viewMultiverse_FutureOverlay);
  this.viewFit = new cPanel({
    align : eAlign.eClient,
    backgroundColor : (this.viewMode == cViewMultiversePanel.eViewMode_Fit ? '#333333' : 'transparent'),
    visible : (this.viewMode == cViewMultiversePanel.eViewMode_Fit)
  });
  this.viewMultiverse.panels.push(this.viewFit);
  this.viewFit.offsetLeft = 0;
  this.viewFit.offsetTop = 0;
  this.viewFit.draggingOffset = false;
  this.viewFit.draggingOffsetStartLeft = 0;
  this.viewFit.draggingOffsetStartTop = 0;
  this.viewFit.draggingOffsetStartX = 0;
  this.viewFit.draggingOffsetStartY = 0;
  this.viewFit.futurePanels = [];
  this.viewFit.columnIndicatorPanels = [];
  this.viewFit.levelIndicatorPanels = [];
  this.viewFit.futureAxisImage = this.screen.getImageClone(aProperties.futureAxisImage);
  this.viewFit.optionsAxisImage = this.screen.getImageClone(aProperties.optionsAxisImage);
  this.viewFit.viewBackground = new cPanel({
    align : eAlign.eNone,
    left: 0,
    top: 0,
    width: 20000,
    height: 20000,
    backgroundColor : '#222222' //'#333333' //'#ffeead'
  });
  this.viewFit.panels.push(this.viewFit.viewBackground);
  this.viewFit.viewFuture = new cPanel({
    align : eAlign.eClient,
    backgroundColor : 'transparent',
    onMouseDown : function(aX, aY) { lThis.onViewFitFuturePanelMouseDown(aX, aY); },
    onMouseMove : function(aX, aY) { lThis.onViewFitFuturePanelMouseMove(aX, aY); },
    onMouseUp : function(aX, aY) { lThis.onViewFitFuturePanelMouseUp(aX, aY); },
    cursor : 'pointer',
    onTap : function(aX, aY) { lThis.onViewFitFuturePanelTap(aX, aY); },
    onScroll : function(aDelta) { lThis.onViewFitFuturePanelScroll(aDelta); }
  });
  this.viewFit.panels.push(this.viewFit.viewFuture);
  this.viewFit.viewFutureOrigin = new cPanel({
    align : eAlign.eNone,
    left: 0,
    top: 0,
    width: 20000,
    height: 20000,
    backgroundColor : 'transparent' //'#222222'
  });
  this.viewFit.viewFuture.panels.push(this.viewFit.viewFutureOrigin);
  this.viewFit.futureAxisLabel = new cPanel({
    align : eAlign.eNone,
    left: 0,
    top: 0,
    width: ((117 / 3) | 0),
    height: ((171 / 3) | 0),
    backgroundColor: 'transparent',
    image: this.viewFit.futureAxisImage,
    imageStretch: true
  });
  this.viewFit.viewFuture.panels.push(this.viewFit.futureAxisLabel);
  this.viewFit.optionsAxisLabel = new cPanel({
    align : eAlign.eNone,
    left: 0,
    top: 0,
    width: ((275 / 3) | 0),
    height: ((65 / 3) | 0),
    backgroundColor: 'transparent',
    image: this.viewFit.optionsAxisImage,
    imageStretch: true
  });
  this.viewFit.viewFuture.panels.push(this.viewFit.optionsAxisLabel);
  this.viewFit.viewOverlay = new cPanel({
    align : eAlign.eClient,
    backgroundColor : 'transparent',
    invisibleToMouseEvents: true
  });
  this.viewFit.panels.push(this.viewFit.viewOverlay);
}
cViewMultiversePanel.deriveFrom(cPanel);
(function() {
  cViewMultiversePanel.eViewMode_Flat = 1;
  cViewMultiversePanel.eViewMode_Fit = 2;
  cViewMultiversePanel.eExpansionMode_Manual = 1;
  cViewMultiversePanel.eExpansionMode_Auto = 2;  
  cViewMultiversePanel.prototype.screen = null;
  cViewMultiversePanel.prototype.futureGeneratorThreadActive = false;
  cViewMultiversePanel.prototype.maxTotalFutures = 1000;
  cViewMultiversePanel.prototype.firstOnVisible = true;
  cViewMultiversePanel.prototype.expansionMode = cViewMultiversePanel.eExpansionMode_Manual;
  cViewMultiversePanel.prototype.viewMode = cViewMultiversePanel.eViewMode_Fit;
  cViewMultiversePanel.prototype.changesImageId = null;
  cViewMultiversePanel.prototype.evaluateImageId = null;
  cViewMultiversePanel.prototype.viewMultiverse = null;
  cViewMultiversePanel.prototype.viewOverlay = null;
  cViewMultiversePanel.prototype.viewFlat = null;
  cViewMultiversePanel.prototype.viewFit = null;
  cViewMultiversePanel.prototype.viewOffset = { left: 0, top: 0 };
  cViewMultiversePanel.prototype.topControlPanel = null;
  cViewMultiversePanel.prototype.bottomControlPanel = null;
  cViewMultiversePanel.prototype.render = function(aParentPanel, aParentElement, aClientRect) {
    cPanel.prototype.render.call(this, aParentPanel, aParentElement, aClientRect);
    if (this.element != null) {
      this.onUpdateMultiverse();
    }
  };
  cViewMultiversePanel.prototype.onUpdateMultiverse = function() {
    if (this.viewMode == cViewMultiversePanel.eViewMode_Flat) {
      this.onUpdateMultiverse_Flat();
    } else if (this.viewMode == cViewMultiversePanel.eViewMode_Fit) {
      this.onUpdateMultiverse_Fit(false);
    }
    var lRunErrorText = '';
    var lChangesError = false;
    var lEvaluationError = false;
    if (Model.actionSandbox.lastRunResult != null) {
      if (Model.actionSandbox.lastRunResult.syntaxError)  {
        lRunErrorText += 'Error while processing changes JavaScript code:<br />\n<i>' + (Model.actionSandbox.lastRunResult.syntaxErrorMessage != '' ? Model.actionSandbox.lastRunResult.syntaxErrorMessage : 'Syntax error.') + '</i><br />\n';
        lChangesError = true;
      } else if (Model.actionSandbox.lastRunResult.runError)  {
        lRunErrorText += 'Error while processing changes JavaScript code:<br />\n<i>' + (Model.actionSandbox.lastRunResult.runErrorMessage != '' ? Model.actionSandbox.lastRunResult.runErrorMessage : 'Runtime error.') + '</i><br />\n';
        lChangesError = true;
      }
    }
    if (Model.evaluationSandbox.lastRunResult != null) {
      if (Model.evaluationSandbox.lastRunResult.syntaxError)  {
        lRunErrorText += 'Error while processing evaluations JavaScript code:<br />\n<i>' + (Model.evaluationSandbox.lastRunResult.syntaxErrorMessage != '' ? Model.evaluationSandbox.lastRunResult.syntaxErrorMessage : 'Syntax error.') + '</i><br />\n';
        lEvaluationError = true;
      } else if (Model.evaluationSandbox.lastRunResult.runError)  {
        lRunErrorText += 'Error while processing evaluations JavaScript code:<br />\n<i>' + (Model.evaluationSandbox.lastRunResult.runErrorMessage != '' ? Model.evaluationSandbox.lastRunResult.runErrorMessage : 'Runtime error.') + '</i><br />\n';
        lEvaluationError = true;
      }
    }
    if (lRunErrorText != '') {
      if (this.viewOverlay == null) {
        this.viewOverlay = new cPanel({
          align : eAlign.eClient,
          backgroundColor : '#ffcccc',
          transparencyPercentage : 50,
          onClick : function() {
          }
        });
        this.panels.push(this.viewOverlay);
        this.viewOverlay.messageBox = new cPanel({
          align : eAlign.eCenter,
          width : 700,
          height : 200,
          padding : 20,
          backgroundColor : '#222222', //#ffffff',
          color : '#00ff00',
          fontSize: 18,
          onClick : function() {
            if (lChangesError) {
            } else if (lEvaluationError) {
            }
          }
        });
        this.panels.push(this.viewOverlay.messageBox);
        this.rerender();
      }
      lRunErrorText = '<span style="font-family: \'Courier New\', Courier, monospace">' + lRunErrorText + '</span';
      if (this.viewOverlay.messageBox.innerHTML != lRunErrorText) {
        this.viewOverlay.messageBox.setInnerHTML(lRunErrorText);
        this.rerender();
      }
    } else {
      if (this.viewOverlay != null) {
        this.removePanelWithoutRerender(this.viewOverlay);
        this.removePanelWithoutRerender(this.viewOverlay.messageBox);
        this.viewOverlay = null;
        this.rerender();
      }
    }
  };
  cViewMultiversePanel.prototype.onUpdateMultiverse_Flat = function() {
    var lViewMultiverse = this.viewFlat;
    lViewMultiverse.offsetLeft = this.viewOffset.left;
    lViewMultiverse.offsetTop = this.viewOffset.top;
    var lWindowWidth = lViewMultiverse.viewMultiverse_Future.getInnerWidth();
    var lHalfWindowWidth = ((lWindowWidth / 2) | 0);
    var lWindowHeight = lViewMultiverse.viewMultiverse_Future.getInnerHeight();
    var lHalfColumnWidth = ((cMultiverseFuturePanel.cViewColumnWidth / 2) | 0);
    this.topControlPanel.innerControlPanel.muliverseSizePanel.setNumberOfWorlds(Model.multiverse.totalNumberOfFutures, this.maxTotalFutures);
    var lShowCenterLine = false;
    if (lShowCenterLine) {
      var lShowCenterLineBottomOnly = false;
      if (lViewMultiverse.centerLinePanel == null) {
        lViewMultiverse.centerLinePanel = new cPanel({
          align : eAlign.eCenterVertical,
          width : 4,
          backgroundColor : '#ff0000',
          transparencyPercentage : 30
        });
        lViewMultiverse.viewMultiverse_FutureOverlay.panels.push(lViewMultiverse.centerLinePanel);
      }
      if (lShowCenterLineBottomOnly) {
        lViewMultiverse.centerLinePanel.align = eAlign.eNone;
        lViewMultiverse.centerLinePanel.left = lHalfWindowWidth - 2;
        lViewMultiverse.centerLinePanel.top = ((lWindowHeight / 2) | 0);
        lViewMultiverse.centerLinePanel.height = ((lWindowHeight / 2) | 0);
      }
    }
    var lShowBlurPanels = false;
    if (lShowBlurPanels) {
      if (lViewMultiverse.leftBlurPanel == null) {
        lViewMultiverse.leftBlurPanel = new cPanel({
          align : eAlign.eNone,
          top : 0,
          backgroundColor : '#000000',
          transparencyPercentage : 70
        });
        lViewMultiverse.viewMultiverse_FutureOverlay.panels.push(lViewMultiverse.leftBlurPanel);
      }
      if (lViewMultiverse.rightBlurPanel == null) {
        lViewMultiverse.rightBlurPanel = new cPanel({
          align : eAlign.eNone,
          top : 0,
          backgroundColor : '#000000',
          transparencyPercentage : 70
        });
        lViewMultiverse.viewMultiverse_FutureOverlay.panels.push(lViewMultiverse.rightBlurPanel);
      }
      /*
      if (lViewMultiverse.topBlurPanel == null) {
        lViewMultiverse.topBlurPanel = new cPanel({
          align : eAlign.eNone,
          top : 0,
          width: cMultiverseFuturePanel.cViewColumnWidth,
          backgroundColor : '#000000',
          transparencyPercentage : 70
        });
        lViewMultiverse.viewMultiverse_FutureOverlay.panels.push(lViewMultiverse.topBlurPanel);
      }
      */
      lViewMultiverse.leftBlurPanel.left = 0;
      lViewMultiverse.leftBlurPanel.width = lHalfWindowWidth - lHalfColumnWidth;
      lViewMultiverse.leftBlurPanel.height = lWindowHeight;
      lViewMultiverse.rightBlurPanel.left = lHalfWindowWidth + lHalfColumnWidth;
      lViewMultiverse.rightBlurPanel.width = lHalfWindowWidth - lHalfColumnWidth;
      lViewMultiverse.rightBlurPanel.height = lWindowHeight;
    }
    /*
    if (lViewMultiverse.horizontalScrollbarPanel == null) {
      lViewMultiverse.horizontalScrollbarPanel = new cPanel({
        align : eAlign.eNone,
        top : 0,
        height : 8,
        backgroundColor : '#000000'
      });
      lViewMultiverse.viewMultiverse_FutureOverlay.panels.push(lViewMultiverse.horizontalScrollbarPanel);
    }
    var lMultiverseWidth = (Model.multiverse.columns.length * cMultiverseFuturePanel.cViewColumnWidth);
    if (lMultiverseWidth == 0) {
      lViewMultiverse.horizontalScrollbarPanel.width = lWindowWidth;
    } else {
      lViewMultiverse.horizontalScrollbarPanel.width = (((lWindowWidth / lMultiverseWidth) * lWindowWidth) | 0);
    }
    var lHalfViewColumnNumber = -((lViewMultiverse.offsetLeft - (cMultiverseFuturePanel.cViewColumnWidth / 2)) / cMultiverseFuturePanel.cViewColumnWidth);
    var lLeftMostColumnNumber = Model.multiverse.columns[0].columnNumber;
    var lRightMostColumnNumber = Model.multiverse.columns[Model.multiverse.columns.length - 1].columnNumber;
    var lMiddleColumnNumber = ((lRightMostColumnNumber + lLeftMostColumnNumber) / 2);
    var lScrollbarOffset = (((lHalfViewColumnNumber - lMiddleColumnNumber) * cMultiverseFuturePanel.cViewColumnWidth * (lWindowWidth / lMultiverseWidth)) | 0);
    lViewMultiverse.horizontalScrollbarPanel.left = (lHalfWindowWidth - ((lViewMultiverse.horizontalScrollbarPanel.width / 2) | 0)) + lScrollbarOffset;
    */
    var lVisibleColumnNumberLeft = ((-(lHalfColumnWidth + lViewMultiverse.offsetLeft)) / cMultiverseFuturePanel.cViewColumnWidth) | 0;
    var lVisibleColumnNumberRight = lVisibleColumnNumberLeft + ((lWindowWidth / cMultiverseFuturePanel.cViewColumnWidth) | 0) + 2;
    var lDrawColumnIndicators = false;
    if (lDrawColumnIndicators) {
      for (var ci = 0, cc = lViewMultiverse.columnIndicatorPanels.length; ci < cc; ci++) {
        lViewMultiverse.columnIndicatorPanels[ci].columnIndicatorHandled = false;
      }
      for (var cn = lVisibleColumnNumberLeft; cn <= lVisibleColumnNumberRight; cn++) {
        if (cn >= 0) {
          var lColumnIndicator = null;
          for (var ci = 0, cc = lViewMultiverse.columnIndicatorPanels.length; ci < cc; ci++) {
            if (lViewMultiverse.columnIndicatorPanels[ci].columnNumber == cn) {
              lColumnIndicator = lViewMultiverse.columnIndicatorPanels[ci];
              break;
            }
          }
          if (lColumnIndicator == null) {
            lColumnIndicator = new cPanel({
              align : eAlign.eNone,
              top : 0,
              width : cMultiverseFuturePanel.cViewColumnWidth,
              height : ((cMultiverseFuturePanel.cViewHeight / 2) | 0),
              backgroundColor : '#666666',
              transparencyPercentage : 50,
              color: '#000000',
              fontSize: 36,
              borderColor: '#333333',
              borderLeft: 1,
              borderRight: 1,
              textAlign: eTextAlign.eCenter,
              innerHTML: (Math.abs(cn + 1) + '')
            });
            lColumnIndicator.columnNumber = cn;
            lViewMultiverse.viewMultiverse_FutureOverlay.panels.push(lColumnIndicator);
            lViewMultiverse.columnIndicatorPanels.push(lColumnIndicator);
          }
          lColumnIndicator.left = (lViewMultiverse.offsetLeft + (cn * cMultiverseFuturePanel.cViewColumnWidth)) - lHalfColumnWidth;
          var lIndicatorBackgroundColor = '#666666';
          var lIndicatorTextColor = '#990000';
          if (Math.abs((lColumnIndicator.left + lHalfColumnWidth) - lHalfWindowWidth) < lHalfColumnWidth) {
            lIndicatorBackgroundColor = '#cccccc';
          }
          if (cn < 0) {
            lIndicatorTextColor = '#999900';
          } else if (cn > 0) {
            lIndicatorTextColor = '#000099';
          }
          lIndicatorTextColor = '#ffffff';
          lColumnIndicator.backgroundColor = lIndicatorBackgroundColor;
          lColumnIndicator.color = lIndicatorTextColor;
          lColumnIndicator.columnIndicatorHandled = true;
        }
      }
      for (var ci = 0, cc = lViewMultiverse.columnIndicatorPanels.length; ci < cc; ci++) {
        if (!lViewMultiverse.columnIndicatorPanels[ci].columnIndicatorHandled) {
          lViewMultiverse.viewMultiverse_FutureOverlay.removePanelWithoutRerender(lViewMultiverse.columnIndicatorPanels[ci]);
          lViewMultiverse.columnIndicatorPanels.splice(ci, 1);
          ci--;
          cc--;
        }
      }
    }
    var lVisibleLevelTop = -((lViewMultiverse.offsetTop / cMultiverseFuturePanel.cViewHeight) | 0);
    if (lVisibleLevelTop < 0) {
      lVisibleLevelTop = 0;
    }
    var lVisibleLevelBottom = lVisibleLevelTop + (((lWindowHeight + cMultiverseFuturePanel.cViewHeight) / cMultiverseFuturePanel.cViewHeight) | 0);
    if (lVisibleLevelBottom < 0) {
      lVisibleLevelBottom = 0;
    }
    for (var li = 0, lc = lViewMultiverse.levelIndicatorPanels.length; li < lc; li++) {
      lViewMultiverse.levelIndicatorPanels[li].levelIndicatorHandled = false;
    }
    for (var ln = lVisibleLevelTop; ln <= lVisibleLevelBottom; ln++) {
      var lLevelIndicator = null;
      for (var li = 0, lc = lViewMultiverse.levelIndicatorPanels.length; li < lc; li++) {
        if (lViewMultiverse.levelIndicatorPanels[li].levelNumber == ln) {
          lLevelIndicator = lViewMultiverse.levelIndicatorPanels[li];
          break;
        }
      }
      if (lLevelIndicator == null) {
        lLevelIndicator = new cPanel({
          align : eAlign.eNone,
          width : ((cMultiverseFuturePanel.cViewColumnWidth / 2) | 0),
          height : cMultiverseFuturePanel.cViewHeight,
          paddingTop : ((cMultiverseFuturePanel.cViewHeight / 5) | 0),
          backgroundColor : '#666666',
          transparencyPercentage : 50,
          color: '#ffffff',
          fontSize: 36,
          borderColor: '#333333',
          borderTop: 1,
          borderBottom: 1,
          textAlign: eTextAlign.eCenter,
          innerHTML: ((ln == 0) ? 'now' : (ln + ''))
        });
        lLevelIndicator.levelNumber = ln;
        lViewMultiverse.viewMultiverse_FutureOverlay.panels.push(lLevelIndicator);
        lViewMultiverse.levelIndicatorPanels.push(lLevelIndicator);
      }
      lLevelIndicator.left = lWindowWidth - lLevelIndicator.width;
      lLevelIndicator.top = lViewMultiverse.offsetTop + (ln * cMultiverseFuturePanel.cViewHeight);
      var lIndicatorBackgroundColor = '#666666';
      var lIndicatorTextColor = '#ffffff';
      lLevelIndicator.backgroundColor = lIndicatorBackgroundColor;
      lLevelIndicator.color = lIndicatorTextColor;
      lLevelIndicator.levelIndicatorHandled = true;
    }
    for (var li = 0, lc = lViewMultiverse.levelIndicatorPanels.length; li < lc; li++) {
      if (!lViewMultiverse.levelIndicatorPanels[li].levelIndicatorHandled) {
        lViewMultiverse.viewMultiverse_FutureOverlay.removePanelWithoutRerender(lViewMultiverse.levelIndicatorPanels[li]);
        lViewMultiverse.levelIndicatorPanels.splice(li, 1);
        li--;
        lc--;
      }
    }
    lViewMultiverse.viewMultiverse_FutureOverlay.rerender();
    var lOuterLeftSize = 400;
    var lOuterTopSize = 140;
    var lNeedToRerenderFutureBackgroundPanel = false;
    if (lViewMultiverse.outerMultiversePanel == null) {
      lViewMultiverse.outerMultiversePanel = new cPanel({
        align : eAlign.eNone,
        backgroundColor : '#333333'
      });
      lViewMultiverse.viewMultiverse_FutureBackground.panels.push(lViewMultiverse.outerMultiversePanel);
      var lFutureAxisLabel = new cPanel({
        align : eAlign.eNone,
        left: 270,
        top: 190,
        width: 117,
        height: 171,
        backgroundColor: 'transparent',
        image: lViewMultiverse.futureAxisImage,
        imageStretch: true
      });
      lViewMultiverse.outerMultiversePanel.panels.push(lFutureAxisLabel);
      var lOptionsAxisLabel = new cPanel({
        align : eAlign.eNone,
        left: 500,
        top: 56,
        width: 275,
        height: 65,
        backgroundColor: 'transparent',
        image: lViewMultiverse.optionsAxisImage,
        imageStretch: true
      });
      lViewMultiverse.outerMultiversePanel.panels.push(lOptionsAxisLabel);
      lNeedToRerenderFutureBackgroundPanel = true;
    }
    if (lViewMultiverse.outerMultiversePanel.width != ((lWindowWidth * 2) + lOuterLeftSize)) {
      lViewMultiverse.outerMultiversePanel.width = ((lWindowWidth * 2) + lOuterLeftSize);
      lNeedToRerenderFutureBackgroundPanel = true;
    }
    if (lViewMultiverse.outerMultiversePanel.height != ((lWindowHeight * 2) + lOuterTopSize)) {
      lViewMultiverse.outerMultiversePanel.height = ((lWindowHeight * 2) + lOuterTopSize);
      lNeedToRerenderFutureBackgroundPanel = true;
    }
    var lOuterMultiversePanelLeft = -lWindowWidth; // out of sight
    var lOuterMultiversePanelTop = -lWindowHeight; // out of sight
    if (lViewMultiverse.offsetLeft > -lWindowWidth) {
      lOuterMultiversePanelLeft = lViewMultiverse.offsetLeft - (((cMultiverseFuturePanel.cViewColumnWidth / 2) | 0) + lOuterLeftSize);
      if (lOuterMultiversePanelLeft < -(lOuterLeftSize + lWindowWidth)) {
        lOuterMultiversePanelLeft = -(lOuterLeftSize + lWindowWidth);
      }
    }
    if (lViewMultiverse.offsetTop > -lWindowHeight) {
      lOuterMultiversePanelTop = (lViewMultiverse.offsetTop - lOuterTopSize) - 40;
      if (lOuterMultiversePanelTop < -(lOuterTopSize + lWindowHeight)) {
        lOuterMultiversePanelTop = -(lOuterTopSize + lWindowHeight);
      }
    }
    if (lViewMultiverse.outerMultiversePanel.left != lOuterMultiversePanelLeft) {
      lViewMultiverse.outerMultiversePanel.left = lOuterMultiversePanelLeft;
      lNeedToRerenderFutureBackgroundPanel = true;
    }
    if (lViewMultiverse.outerMultiversePanel.top != lOuterMultiversePanelTop) {
      lViewMultiverse.outerMultiversePanel.top = lOuterMultiversePanelTop;
      lNeedToRerenderFutureBackgroundPanel = true;
    }
    if (lViewMultiverse.visibleMultiversePanel == null) {
      lViewMultiverse.visibleMultiversePanel = new cPanel({
        align : eAlign.eNone,
        backgroundColor : '#222222'
      });
      lViewMultiverse.viewMultiverse_FutureBackground.panels.push(lViewMultiverse.visibleMultiversePanel);
      lNeedToRerenderFutureBackgroundPanel = true;
    }
    if (lViewMultiverse.visibleMultiversePanel.width != lWindowWidth) {
      lViewMultiverse.visibleMultiversePanel.width = lWindowWidth;
      lNeedToRerenderFutureBackgroundPanel = true;
    }
    if (lViewMultiverse.visibleMultiversePanel.height != lWindowHeight) {
      lViewMultiverse.visibleMultiversePanel.height = lWindowHeight;
      lNeedToRerenderFutureBackgroundPanel = true;
    }
    var lVisibleMultiversePanelLeft = 0;
    var lVisibleMultiversePanelTop = 0;
    if (lViewMultiverse.offsetLeft > 0) {
      lVisibleMultiversePanelLeft = lViewMultiverse.offsetLeft - (((cMultiverseFuturePanel.cViewColumnWidth / 2) | 0) + 10);
      if (lVisibleMultiversePanelLeft < 0) {
        lVisibleMultiversePanelLeft = 0;
      }
    }
    if (lViewMultiverse.offsetTop > 0) {
      lVisibleMultiversePanelTop = lViewMultiverse.offsetTop - 40;
      if (lVisibleMultiversePanelTop < 0) {
        lVisibleMultiversePanelTop = 0;
      }
    }
    if (lViewMultiverse.visibleMultiversePanel.left != lVisibleMultiversePanelLeft) {
      lViewMultiverse.visibleMultiversePanel.left = lVisibleMultiversePanelLeft;
      lNeedToRerenderFutureBackgroundPanel = true;
    }
    if (lViewMultiverse.visibleMultiversePanel.top != lVisibleMultiversePanelTop) {
      lViewMultiverse.visibleMultiversePanel.top = lVisibleMultiversePanelTop;
      lNeedToRerenderFutureBackgroundPanel = true;
    }
    var lNeedToRerenderFuturePanel = false;
    var lFutureIDsDrawn = [];
    for (var fi = 0, fc = lViewMultiverse.futurePanels.length; fi < fc; fi++) {
      lViewMultiverse.futurePanels[fi].futurePanelHandled = false;
    }
    for (var cn = lVisibleColumnNumberLeft; cn <= lVisibleColumnNumberRight; cn++) {
      var lMultiverseColumn = Model.multiverse.getColumnByColumnNumber(cn);
      if (lMultiverseColumn != null) {
        for (var ln = lVisibleLevelTop; (ln <= lVisibleLevelBottom) && (ln < lMultiverseColumn.futures.length); ln++) {
          var lFuture = lMultiverseColumn.futures[ln];
          var lFutureDrawn = false;
          for (var fi = 0, fc = lFutureIDsDrawn.length; fi < fc; fi++) {
            if (lFutureIDsDrawn[fi] == lFuture.id) {
              lFutureDrawn = true;
              break;
            }
          }
          if (!lFutureDrawn) {
            lFutureIDsDrawn.push(lFuture.id);
            /*
            if (this.expansionMode == cViewMultiversePanel.eExpansionMode_Auto) {
              if (!lFuture.futuresDetermined) {
                if (lSelectedVisibleUndeterminedFuture == null) {
                  lSelectedVisibleUndeterminedFuture = lFuture;
                }
              }
            }
            */
            var lFuturePanel = null;
            for (var fi = 0, fc = lViewMultiverse.futurePanels.length; fi < fc; fi++) {
              if (lViewMultiverse.futurePanels[fi].future.id == lFuture.id) {
                lFuturePanel = lViewMultiverse.futurePanels[fi];
                break;
              }
            }
            if (lFuturePanel == null) {
              lFuturePanel = new cMultiverseFuturePanel({
                align : eAlign.eNone,
                left : 0,
                top : 0,
                width : cMultiverseFuturePanel.cViewColumnWidth,
                height : cMultiverseFuturePanel.cViewHeight,
                backgroundColor : 'transparent',
                screen : this.screen,
                future : lFuture,
                changesImageId : this.changesImageId,
                evaluateImageId : this.evaluateImageId
              });
              lViewMultiverse.viewMultiverse_Future.panels.push(lFuturePanel);
              lViewMultiverse.futurePanels.push(lFuturePanel);
              lNeedToRerenderFuturePanel = true;
            }
            var lFutureBorderColor = cMultiverseFuturePanel.evaluationColor(lFuture);
            var lFutureState = cMultiverseFuturePanel.evaluationText(lFuture);
            var lFutureTerminated = (lFuture.evaluation.end || lFuture.evaluation.ignore ||  lFuture.evaluation.goal || lFuture.evaluation.illegal);
            var lFutureLeft = (lFuture.multiverseColumns[0].columnNumber * cMultiverseFuturePanel.cViewColumnWidth) - ((cMultiverseFuturePanel.cViewColumnWidth / 2) | 0);
            var lFutureTop = (lFuture.level * cMultiverseFuturePanel.cViewHeight);
            var lFutureWidth = (lFuture.multiverseColumns.length * cMultiverseFuturePanel.cViewColumnWidth);
            var lFutureHeight = cMultiverseFuturePanel.cViewHeight;
            var lMarginWidth = 2;
            var lMarginHeight = 2;
            if (lFuturePanel.top != (lViewMultiverse.offsetTop + lFutureTop)) {
              lFuturePanel.top = (lViewMultiverse.offsetTop + lFutureTop);
              lNeedToRerenderFuturePanel = true;
            }
            if (lFuturePanel.left != (lViewMultiverse.offsetLeft + lFutureLeft + lMarginWidth)) {
              lFuturePanel.left = (lViewMultiverse.offsetLeft + lFutureLeft + lMarginWidth);
              lNeedToRerenderFuturePanel = true;
            }
            if (lFuturePanel.width != (lFutureWidth - (lMarginWidth * 2))) {
              lFuturePanel.width = (lFutureWidth - (lMarginWidth * 2));
              lNeedToRerenderFuturePanel = true;
            }
            if (lFuturePanel.height != (lFutureHeight - (lMarginHeight * 2))) {
              lFuturePanel.setHeight(lFutureHeight - (lMarginHeight * 2));
              lNeedToRerenderFuturePanel = true;
            }
            if (lFuturePanel.state != lFutureState) {
              lFuturePanel.setState(lFutureState);
              lNeedToRerenderFuturePanel = true;
            }
            if (lFuturePanel.stateColor != lFutureBorderColor) {
              lFuturePanel.setStateColor(lFutureBorderColor);
              lNeedToRerenderFuturePanel = true;
            }
            if (lNeedToRerenderFuturePanel) {
              lFuturePanel.setFocusLine(lHalfWindowWidth);
            }
            lFuturePanel.futurePanelHandled = true;
            var lDrawLinks = true;
            if (lDrawLinks) {
              if (lFuture.futures.length > 0) {
                if (!lFuturePanel.futureConnectorHorizontal) {
                  lFuturePanel.futureConnectorHorizontal = new cPanel({
                    align : eAlign.eNone,
                    left : 0,
                    top : 0,
                    width : 1,
                    height : 8,
                    backgroundColor : '#666666'
                  });
                  lViewMultiverse.viewMultiverse_FutureBackground.panels.push(lFuturePanel.futureConnectorHorizontal);
                  lNeedToRerenderFutureBackgroundPanel = true;
                }
                if (lFuturePanel.futureConnectorHorizontal.top != (lFuturePanel.top + ((cMultiverseFuturePanel.cViewHeight / 2) | 0))) {
                  lFuturePanel.futureConnectorHorizontal.top = (lFuturePanel.top + ((cMultiverseFuturePanel.cViewHeight / 2) | 0));
                  lNeedToRerenderFutureBackgroundPanel = true;
                }
                var lHalfwayFirstFuturesColumnWidth = (((lFuture.futures[0].multiverseColumns.length * cMultiverseFuturePanel.cViewColumnWidth) / 2) | 0);
                if (lFuturePanel.futureConnectorHorizontal.left != ((lFuturePanel.left + lHalfwayFirstFuturesColumnWidth) - 6)) {
                  lFuturePanel.futureConnectorHorizontal.left = ((lFuturePanel.left + lHalfwayFirstFuturesColumnWidth) - 6);
                  lNeedToRerenderFutureBackgroundPanel = true;
                }
                var lHalfwayLastFuturesColumnWidth = (((lFuture.futures[lFuture.futures.length - 1].multiverseColumns.length * cMultiverseFuturePanel.cViewColumnWidth) / 2) | 0);
                if (lFuturePanel.futureConnectorHorizontal.width != (lFutureWidth - (lHalfwayFirstFuturesColumnWidth + lHalfwayLastFuturesColumnWidth))) {
                  lFuturePanel.futureConnectorHorizontal.width = (lFutureWidth - (lHalfwayFirstFuturesColumnWidth + lHalfwayLastFuturesColumnWidth));
                  lNeedToRerenderFutureBackgroundPanel = true;
                }
              }
              var lPastPanel = null;
              if (lFuture.past) {
                for (var fi = 0, fc = lViewMultiverse.futurePanels.length; fi < fc; fi++) {
                  if (lViewMultiverse.futurePanels[fi].future.id == lFuture.past.id) {
                    lPastPanel = lViewMultiverse.futurePanels[fi];
                    break;
                  }
                }
              }
              if (lPastPanel != null) {
                if (!lFuturePanel.pastConnectorVertical) {
                  lFuturePanel.pastConnectorVertical = new cPanel({
                    align : eAlign.eNone,
                    left : 0,
                    top : 0,
                    width : 8,
                    height : cMultiverseFuturePanel.cViewHeight,
                    backgroundColor : '#666666'
                  });
                  lViewMultiverse.viewMultiverse_FutureBackground.panels.push(lFuturePanel.pastConnectorVertical);
                  lNeedToRerenderFutureBackgroundPanel = true;
                }
                if (lFuturePanel.pastConnectorVertical.left != ((lFuturePanel.left + ((lFutureWidth / 2) | 0)) - 6)) {
                  lFuturePanel.pastConnectorVertical.left = ((lFuturePanel.left + ((lFutureWidth / 2) | 0)) - 6);
                  lNeedToRerenderFutureBackgroundPanel = true;
                }
                if (lFuturePanel.pastConnectorVertical.top != (lFuturePanel.top - ((cMultiverseFuturePanel.cViewHeight / 2) | 0))) {
                  lFuturePanel.pastConnectorVertical.top = (lFuturePanel.top - ((cMultiverseFuturePanel.cViewHeight / 2) | 0));
                  lNeedToRerenderFutureBackgroundPanel = true;
                }
              } else {
                if (lFuturePanel.pastConnectorVertical) {
                  lViewMultiverse.viewMultiverse_FutureBackground.removePanelWithoutRerender(lFuturePanel.pastConnectorVertical);
                  lFuturePanel.pastConnectorVertical = null;
                  lNeedToRerenderFutureBackgroundPanel = true;
                }
              }
            }
            if (!lFuture.futuresDetermined) {
              if (!lFuturePanel.terminatorPanel) {
                lFuturePanel.terminatorPanel = new cPanel({
                  align : eAlign.eNone,
                  left : 0,
                  top : 0,
                  width : cMultiverseFuturePanel.cViewColumnWidth,
                  height : cMultiverseFuturePanel.cViewHeight,
                  backgroundColor : '#96ceb4', //'#666666',
                  transparencyPercentage: 15,
                  shape: cPanel.cShapeRoundRect,
                  borderRadius: 40,
                  textAlign: eTextAlign.eCenter,
                  color: '#000000',
                  fontSize: 40
                });
                lViewMultiverse.viewMultiverse_Future.panels.push(lFuturePanel.terminatorPanel);
                if (!lFuture.futuresDetermined) {
                  (function() {
                    var lThisFuture = lFuture;
                    lFuturePanel.terminatorPanel.onTap = function() {
                      this.stopBubble = true;
                      var lFoundFuture = false;
                      for (var fi = 0, fc = Model.allUndeterminedFutures.length; fi < fc; fi++) {
                        if (Model.allUndeterminedFutures[fi].future.id == lThisFuture.id) {
                          lFoundFuture = true;
                          break;
                        }
                      }
                      if (!lFoundFuture) {
                        Model.allUndeterminedFutures.push(lThisFuture);
                      }
                    };
                  })();
                }
                  lFuturePanel.terminatorPanel.image = this.screen.getImageClone(lViewMultiverse.expandImageId);
                  lFuturePanel.terminatorPanel.imageStretchWidth = 90;
                  lFuturePanel.terminatorPanel.imageStretchHeight = 90;
                  lFuturePanel.terminatorPanel.innerHTML = '';
                lNeedToRerenderFuturePanel = true;
              }
              var lTerminatorPanelLeftRightMargin = 20;
              var lTerminatorPanelBottomMargin = 10;
              if (lFuturePanel.terminatorPanel.left != (lFuturePanel.left + lTerminatorPanelLeftRightMargin)) {
                lFuturePanel.terminatorPanel.left = lFuturePanel.left + lTerminatorPanelLeftRightMargin;
                lNeedToRerenderFuturePanel = true;
              }
              if (lFuturePanel.terminatorPanel.top != (lFuturePanel.top + (((cMultiverseFuturePanel.cViewHeight * 3) / 5) |0))) {
                lFuturePanel.terminatorPanel.top = (lFuturePanel.top + (((cMultiverseFuturePanel.cViewHeight * 3) / 5) |0));
                lNeedToRerenderFuturePanel = true;
              }
              if (lFuturePanel.terminatorPanel.width != (lFuturePanel.width - (2 * lTerminatorPanelLeftRightMargin))) {
                lFuturePanel.terminatorPanel.width = lFuturePanel.width - (2 * lTerminatorPanelLeftRightMargin);
                lNeedToRerenderFuturePanel = true;
              }
              if (lFuturePanel.terminatorPanel.height != (cMultiverseFuturePanel.cViewHeight - lTerminatorPanelBottomMargin)) {
                lFuturePanel.terminatorPanel.height = cMultiverseFuturePanel.cViewHeight - lTerminatorPanelBottomMargin;
                lNeedToRerenderFuturePanel = true;
              }
            } else {
              if (lFuturePanel.terminatorPanel) {
                lViewMultiverse.viewMultiverse_Future.removePanelWithoutRerender(lFuturePanel.terminatorPanel);
                lFuturePanel.terminatorPanel = null;
                lNeedToRerenderFuturePanel = true;
              }
            }
          }
        }
      }
    }
    for (var fi = 0, fc = lViewMultiverse.futurePanels.length; fi < fc; fi++) {
      if (!lViewMultiverse.futurePanels[fi].futurePanelHandled) {
        if (lViewMultiverse.futurePanels[fi].futureConnectorHorizontal) {
          lViewMultiverse.viewMultiverse_FutureBackground.removePanelWithoutRerender(lViewMultiverse.futurePanels[fi].futureConnectorHorizontal);
          lViewMultiverse.futurePanels[fi].futureConnectorHorizontal = null;
          lNeedToRerenderFutureBackgroundPanel = true;
        }
        if (lViewMultiverse.futurePanels[fi].pastConnectorVertical) {
          lViewMultiverse.viewMultiverse_FutureBackground.removePanelWithoutRerender(lViewMultiverse.futurePanels[fi].pastConnectorVertical);
          lViewMultiverse.futurePanels[fi].pastConnectorVertical = null;
          lNeedToRerenderFutureBackgroundPanel = true;
        }
        if (lViewMultiverse.futurePanels[fi].terminatorPanel) {
          lViewMultiverse.viewMultiverse_Future.removePanelWithoutRerender(lViewMultiverse.futurePanels[fi].terminatorPanel);
          lViewMultiverse.futurePanels[fi].terminatorPanel = null;
        }
        lViewMultiverse.viewMultiverse_Future.removePanelWithoutRerender(lViewMultiverse.futurePanels[fi]);
        lNeedToRerenderFuturePanel = true;
        lViewMultiverse.futurePanels.splice(fi, 1);
        fi--;
        fc--;
      }
    }
    if (lNeedToRerenderFutureBackgroundPanel) {
      lViewMultiverse.viewMultiverse_FutureBackground.rerender();
    }
    if (lNeedToRerenderFuturePanel) {
      lViewMultiverse.viewMultiverse_Future.rerender();
    }
    /*
    if (lSelectedVisibleUndeterminedFuture != null) {
      var lFoundSelectedFuture = false;
      for (var fi = 0, fc = Model.allUndeterminedFutures.length; fi < fc; fi++) {
        if (Model.allUndeterminedFutures[fi].future.id == lSelectedVisibleUndeterminedFuture.id) {
          lFoundSelectedFuture = true;
          break;
        }
      }
      if (!lFoundSelectedFuture) {
        Model.allUndeterminedFutures.push(lSelectedVisibleUndeterminedFuture);
      }
    }
    */
  };
  cViewMultiversePanel.prototype.onUpdateMultiverse_Fit = function(aJustDragMultiverse) {
    var lViewMultiverse = this.viewFit;
    var lThis = this;
    var lWindowWidth = lViewMultiverse.viewFuture.getInnerWidth();
    var lHalfWindowWidth = ((lWindowWidth / 2) | 0);
    var lWindowHeight = lViewMultiverse.viewFuture.getInnerHeight();
    var lHalfWindowHeight = ((lWindowHeight / 2) | 0);
    var lNumberOfColumns = Model.multiverse.columns.length;
    var lColumnWidthReal = lWindowWidth / lNumberOfColumns;
    var lNumberOfVisibleColumns = lNumberOfColumns;
    var lZoomedWidth = ((lWindowWidth * (32 / cMultiverseFuturePanel.cViewColumnWidth)) | 0);
    var lZoomedHeight = ((lWindowHeight * (32 / cMultiverseFuturePanel.cViewHeight)) | 0);
    var lZoomAlignOffsetLeft = lHalfWindowWidth - ((lZoomedWidth / 2) | 0);
    var lZoomAlignOffsetTop = lHalfWindowHeight - ((lZoomedHeight / 2) | 0);
    lViewMultiverse.offsetLeft = lZoomAlignOffsetLeft + ((this.viewOffset.left * (32 / cMultiverseFuturePanel.cViewColumnWidth)) | 0);
    lViewMultiverse.offsetTop = lZoomAlignOffsetTop + ((this.viewOffset.top * (32 / cMultiverseFuturePanel.cViewHeight)) | 0);
    if (lViewMultiverse.viewFutureOrigin.left != lViewMultiverse.offsetLeft) {
      lViewMultiverse.viewFutureOrigin.setLeft(lViewMultiverse.offsetLeft);
      this.viewFit.futureAxisLabel.setLeft(lViewMultiverse.offsetLeft - 40);
      this.viewFit.optionsAxisLabel.setLeft(lViewMultiverse.offsetLeft + 36);
    }
    if (lViewMultiverse.viewFutureOrigin.top != lViewMultiverse.offsetTop) {
      lViewMultiverse.viewFutureOrigin.setTop(lViewMultiverse.offsetTop);
      this.viewFit.futureAxisLabel.setTop(lViewMultiverse.offsetTop + 36);
      this.viewFit.optionsAxisLabel.setTop(lViewMultiverse.offsetTop - 26);
    }
    if (lViewMultiverse.viewBackground.left != lViewMultiverse.offsetLeft) {
      lViewMultiverse.viewBackground.setLeft(lViewMultiverse.offsetLeft);
    }
    if (lViewMultiverse.viewBackground.top != lViewMultiverse.offsetTop) {
      lViewMultiverse.viewBackground.setTop(lViewMultiverse.offsetTop);
    }
    if (aJustDragMultiverse) {
      return;
    }
    this.topControlPanel.innerControlPanel.muliverseSizePanel.setNumberOfWorlds(Model.multiverse.totalNumberOfFutures, this.maxTotalFutures);
      lColumnWidthReal = 32;
      lNumberOfVisibleColumns = ((lWindowWidth / lColumnWidthReal) | 0);
    if (lViewMultiverse.viewFutureOrigin.width != ((lNumberOfColumns * (lColumnWidthReal + 1)) | 0)) {
      lViewMultiverse.viewFutureOrigin.setWidth(((lNumberOfColumns + 1) * lColumnWidthReal));
    }
    if (lViewMultiverse.viewBackground.width != lViewMultiverse.viewFutureOrigin.width) {
      lViewMultiverse.viewBackground.setWidth(lViewMultiverse.viewFutureOrigin.width);
    }
    var lLevelHeight = 40;
    if (lLevelHeight > lColumnWidthReal) {
      lLevelHeight = lColumnWidthReal;
    }
    var lNeedToRerenderOverlayPanel = false;
    if (!lViewMultiverse.viewOverlay.ZoomBoundaryPanel) {
      lViewMultiverse.viewOverlay.ZoomBoundaryPanel = new cPanel({
        align : eAlign.eNone,
        left: 0,
        top: 0,
        width: 500,
        height: 500,
        border: 1,
        borderColor: '#cc0000',
        backgroundColor : 'transparent'
      });
      lViewMultiverse.viewOverlay.panels.push(lViewMultiverse.viewOverlay.ZoomBoundaryPanel);
      lNeedToRerenderOverlayPanel = true;
    }
    lViewMultiverse.viewOverlay.ZoomBoundaryPanel.left = lZoomAlignOffsetLeft + 32;
    lViewMultiverse.viewOverlay.ZoomBoundaryPanel.top = lZoomAlignOffsetTop;
    lViewMultiverse.viewOverlay.ZoomBoundaryPanel.width = lZoomedWidth;
    lViewMultiverse.viewOverlay.ZoomBoundaryPanel.height = lZoomedHeight;
    lNeedToRerenderOverlayPanel = true;
    var lNeedToRerenderFutureBackgroundPanel = false;
    var lNeedToRerenderFuturePanel = false;
    var lFutureIDsDrawn = [];
    for (var fi = 0, fc = lViewMultiverse.futurePanels.length; fi < fc; fi++) {
      lViewMultiverse.futurePanels[fi].futurePanelHandled = false;
    }
    for (var ci = 0; ci < lNumberOfColumns; ci++) {
      var lMultiverseColumn = Model.multiverse.columns[ci];
      if (lMultiverseColumn != null) {
        for (var li = 0; li < lMultiverseColumn.futures.length; li++) {
          var lFuture = lMultiverseColumn.futures[li];
          var lFutureDrawn = false;
          for (var fi = 0, fc = lFutureIDsDrawn.length; fi < fc; fi++) {
            if (lFutureIDsDrawn[fi] == lFuture.id) {
              lFutureDrawn = true;
              break;
            }
          }
          if (!lFutureDrawn) {
            lFutureIDsDrawn.push(lFuture.id);
            /*
            if (this.expansionMode == cViewMultiversePanel.eExpansionMode_Auto) {
              if (!lFuture.futuresDetermined) {
                var lDepthFirst = false;
                if (lDepthFirst) {
                  if (lSelectedVisibleUndeterminedFuture == null) {
                    lSelectedVisibleUndeterminedFuture = lFuture;
                  }
                } else {
                  lSelectedVisibleUndeterminedFuture = lFuture;
                }
              }
            }
            */
            var lFuturePanel = null;
            for (var fi = 0, fc = lViewMultiverse.futurePanels.length; fi < fc; fi++) {
              if (lViewMultiverse.futurePanels[fi].future.id == lFuture.id) {
                lFuturePanel = lViewMultiverse.futurePanels[fi];
                break;
              }
            }
            if (lFuturePanel == null) {
              lFuturePanel = new cPanel({ // new cMultiverseFuturePanel({
                align : eAlign.eNone,
                left : 0,
                top : 0,
                width : cMultiverseFuturePanel.cViewColumnWidth,
                height : lLevelHeight,
                border: 2,
                borderColor : '#000000',
                paddingLeft : 5,
                backgroundColor : '#ffffff',
                color : '#ffffff',
                fontSize : 30,
                onTap: function() {
                  if (!this.future.futuresDetermined) {
                    this.stopBubble = true;
                    var lFoundFuture = false;
                    for (var fi = 0, fc = Model.allUndeterminedFutures.length; fi < fc; fi++) {
                      if (Model.allUndeterminedFutures[fi].future.id == this.future.id) {
                        lFoundFuture = true;
                        break;
                      }
                    }
                    if (!lFoundFuture) {
                      Model.allUndeterminedFutures.push(this.future);
                    }
                  }
                }
              });
              lFuturePanel.future = lFuture;
              lViewMultiverse.viewFutureOrigin.panels.push(lFuturePanel);
              lViewMultiverse.futurePanels.push(lFuturePanel);
              lNeedToRerenderFuturePanel = true;
            }
            var lFutureBorderColor = cMultiverseFuturePanel.evaluationColor(lFuture);
            var lFutureInnerHTML = ' '; // set to non-empty string, otherwise update of cPanel.innerHTML does nt work.
            var lFutureState = cMultiverseFuturePanel.evaluationText(lFuture);
            var lFutureTerminated = (lFuture.evaluation.end || lFuture.evaluation.ignore ||  lFuture.evaluation.goal || lFuture.evaluation.illegal);
            if (!lFuture.futuresDetermined) {
              lFutureBorderColor = '#96ceb4';
              lFutureInnerHTML = '*';
            }
            var lFutureLeft = 20 + ((lFuture.multiverseColumns[0].columnNumber * lColumnWidthReal) | 0);
            var lFutureFullSpanLeft = lFutureLeft;
            var lFutureTop = 20 + (lFuture.level * lLevelHeight);
            var lFutureWidth = (lColumnWidthReal | 0);
            var lFutureFullSpanWidth = ((lFuture.multiverseColumns.length * lColumnWidthReal) | 0);
            lFutureLeft += ((((lFuture.multiverseColumns.length - 1) * lColumnWidthReal) / 2) | 0);
            var lFutureHeight = lLevelHeight;
            var lMarginWidth = 2;
            var lMarginHeight = 2;
            if (lFuturePanel.top != lFutureTop) {
              lFuturePanel.top = lFutureTop;
              lNeedToRerenderFuturePanel = true;
            }
            if (lFuturePanel.left != (lFutureLeft + lMarginWidth)) {
              lFuturePanel.left = lFutureLeft + lMarginWidth;
              lNeedToRerenderFuturePanel = true;
            }
            if (lFuturePanel.width != (lFutureWidth - (lMarginWidth * 2))) {
              lFuturePanel.width = (lFutureWidth - (lMarginWidth * 2));
              lNeedToRerenderFuturePanel = true;
            }
            if (lFuturePanel.height != (lFutureHeight - (lMarginHeight * 2))) {
              lFuturePanel.height = (lFutureHeight - (lMarginHeight * 2));
              lNeedToRerenderFuturePanel = true;
            }
            if (lFuturePanel.backgroundColor != lFutureBorderColor) {
              lFuturePanel.backgroundColor = lFutureBorderColor;
              lNeedToRerenderFuturePanel = true;
            }
            if (lFuturePanel.innerHTML != lFutureInnerHTML) {
              lFuturePanel.innerHTML = lFutureInnerHTML;
              lNeedToRerenderFuturePanel = true;
            }
            /*
            if (lFuturePanel.state != lFutureState) {
              lFuturePanel.setState(lFutureState);
              lNeedToRerenderFuturePanel = true;
            }
            if (lFuturePanel.stateColor != lFutureBorderColor) {
              lFuturePanel.setStateColor(lFutureBorderColor);
              lNeedToRerenderFuturePanel = true;
            }
            if (lNeedToRerenderFuturePanel) {
              lFuturePanel.setFocusLine(lHalfWindowWidth);
            }
            */
            lFuturePanel.futurePanelHandled = true;            
            var lDrawLinks = true;
            if (lDrawLinks) {
              if (lFuture.futures.length > 0) {
                if (!lFuturePanel.futureConnectorHorizontal) {
                  lFuturePanel.futureConnectorHorizontal = new cPanel({
                    align : eAlign.eNone,
                    left : 0,
                    top : 0,
                    width : 1,
                    height : 4,
                    backgroundColor : '#666666'
                  });
                  lViewMultiverse.viewBackground.panels.push(lFuturePanel.futureConnectorHorizontal);
                  lNeedToRerenderFutureBackgroundPanel = true;
                }
                if (lFuturePanel.futureConnectorHorizontal.top != (lFuturePanel.top + ((32 / 2) | 0))) {
                  lFuturePanel.futureConnectorHorizontal.top = (lFuturePanel.top + ((32 / 2) | 0));
                  lNeedToRerenderFutureBackgroundPanel = true;
                }
                var lHalfwayFirstFuturesColumnWidth = (((lFuture.futures[0].multiverseColumns.length * 32) / 2) | 0);
                if (lFuturePanel.futureConnectorHorizontal.left != (lFutureFullSpanLeft + ((0 + lHalfwayFirstFuturesColumnWidth) - 0))) {
                  lFuturePanel.futureConnectorHorizontal.left = (lFutureFullSpanLeft + ((0 + lHalfwayFirstFuturesColumnWidth) - 0));
                  lNeedToRerenderFutureBackgroundPanel = true;
                }
                var lHalfwayLastFuturesColumnWidth = (((lFuture.futures[lFuture.futures.length - 1].multiverseColumns.length * 32) / 2) | 0);
                if (lFuturePanel.futureConnectorHorizontal.width != (lFutureFullSpanWidth - (lHalfwayFirstFuturesColumnWidth + lHalfwayLastFuturesColumnWidth))) {
                  lFuturePanel.futureConnectorHorizontal.width = (lFutureFullSpanWidth - (lHalfwayFirstFuturesColumnWidth + lHalfwayLastFuturesColumnWidth));
                  lNeedToRerenderFutureBackgroundPanel = true;
                }
              } else {
                if (lFuturePanel.futureConnectorHorizontal) {
                  lViewMultiverse.viewBackground.removePanelWithoutRerender(lFuturePanel.futureConnectorHorizontal);
                  lFuturePanel.futureConnectorHorizontal = null;
                  lNeedToRerenderFutureBackgroundPanel = true;
                }
              }
              var lPastPanel = null;
              if (lFuture.past) {
                for (var fi = 0, fc = lViewMultiverse.futurePanels.length; fi < fc; fi++) {
                  if (lViewMultiverse.futurePanels[fi].future.id == lFuture.past.id) {
                    lPastPanel = lViewMultiverse.futurePanels[fi];
                    break;
                  }
                }
              }
              if (lPastPanel != null) {
                if (!lFuturePanel.pastConnectorVertical) {
                  lFuturePanel.pastConnectorVertical = new cPanel({
                    align : eAlign.eNone,
                    left : 0,
                    top : 0,
                    width : 4,
                    height : 32,
                    backgroundColor : '#666666'
                  });
                  lViewMultiverse.viewBackground.panels.push(lFuturePanel.pastConnectorVertical);
                  lNeedToRerenderFutureBackgroundPanel = true;
                }
                if (lFuturePanel.pastConnectorVertical.left != ((lFuturePanel.left + ((lFutureWidth / 2) | 0)) - 4)) {
                  lFuturePanel.pastConnectorVertical.left = ((lFuturePanel.left + ((lFutureWidth / 2) | 0)) - 4);
                  lNeedToRerenderFutureBackgroundPanel = true;
                }
                if (lFuturePanel.pastConnectorVertical.top != (lFuturePanel.top - ((32 / 2) | 0))) {
                  lFuturePanel.pastConnectorVertical.top = (lFuturePanel.top - ((32 / 2) | 0));
                  lNeedToRerenderFutureBackgroundPanel = true;
                }
              } else {
                if (lFuturePanel.pastConnectorVertical) {
                  lViewMultiverse.viewBackground.removePanelWithoutRerender(lFuturePanel.pastConnectorVertical);
                  lFuturePanel.pastConnectorVertical = null;
                  lNeedToRerenderFutureBackgroundPanel = true;
                }
              }
            }
          }
        }
      }
    }
    for (var fi = 0, fc = lViewMultiverse.futurePanels.length; fi < fc; fi++) {
      if (!lViewMultiverse.futurePanels[fi].futurePanelHandled) {
        if (lViewMultiverse.futurePanels[fi].futureConnectorHorizontal) {
          lViewMultiverse.viewBackground.removePanelWithoutRerender(lViewMultiverse.futurePanels[fi].futureConnectorHorizontal);
          lViewMultiverse.futurePanels[fi].futureConnectorHorizontal = null;
          lNeedToRerenderFutureBackgroundPanel = true;
        }
        if (lViewMultiverse.futurePanels[fi].pastConnectorVertical) {
          lViewMultiverse.viewBackground.removePanelWithoutRerender(lViewMultiverse.futurePanels[fi].pastConnectorVertical);
          lViewMultiverse.futurePanels[fi].pastConnectorVertical = null;
          lNeedToRerenderFutureBackgroundPanel = true;
        }
        if (lViewMultiverse.futurePanels[fi].terminatorPanel) {
          lViewMultiverse.viewFutureOrigin.removePanelWithoutRerender(lViewMultiverse.futurePanels[fi].terminatorPanel);
        }
        lViewMultiverse.viewFutureOrigin.removePanelWithoutRerender(lViewMultiverse.futurePanels[fi]);
        lNeedToRerenderFuturePanel = true;
        lViewMultiverse.futurePanels.splice(fi, 1);
        fi--;
        fc--;
      }
    }
    if (lNeedToRerenderFutureBackgroundPanel) {
      lViewMultiverse.viewBackground.rerender();
    }
    if (lNeedToRerenderFuturePanel) {
      lViewMultiverse.viewFuture.rerender();
      lViewMultiverse.viewFutureOrigin.rerender();
    }
    if (lNeedToRerenderOverlayPanel) {
      lViewMultiverse.viewOverlay.rerender();
    }
    /*
    if (lSelectedVisibleUndeterminedFuture != null) {
      var lFoundSelectedFuture = false;
      for (var fi = 0, fc = Model.allUndeterminedFutures.length; fi < fc; fi++) {
        if (Model.allUndeterminedFutures[fi].future.id == lSelectedVisibleUndeterminedFuture.id) {
          lFoundSelectedFuture = true;
          break;
        }
      }
      if (!lFoundSelectedFuture) {
        Model.allUndeterminedFutures.push(lSelectedVisibleUndeterminedFuture);
      }
    }
    */
  };
  cViewMultiversePanel.prototype.resetMultiverse = function() {
    Model.resetFutures();
    var lWindowWidth = this.viewFlat.viewMultiverse_Future.getInnerWidth();
    var lHalfWindowWidth = ((lWindowWidth / 2) | 0);
    this.viewOffset.left = lHalfWindowWidth;
    if (this.viewOffset.left > 240) {
      this.viewOffset.left = 240;
    }
    this.viewOffset.top = 140;
    this.viewFlat.viewMultiverse_Future.clearPanels();
    this.viewFlat.viewMultiverse_FutureBackground.clearPanels();
    this.viewFlat.viewMultiverse_FutureOverlay.clearPanels();
    this.viewFlat.columnIndicatorPanels = [];
    this.viewFlat.levelIndicatorPanels = [];
    this.viewFlat.futurePanels = [];
    this.viewFlat.visibleMultiversePanel = null;
    this.viewFlat.outerMultiversePanel = null;
    this.viewFlat.leftBlurPanel = null;
    this.viewFlat.rightBlurPanel = null;
    this.viewFlat.topBlurPanel = null;
    this.viewFlat.centerLinePanel = null;
    this.viewFlat.viewMultiverse_FutureBackground.rerender();
    this.viewFlat.viewMultiverse_Future.rerender();
    this.viewFlat.viewMultiverse_FutureOverlay.rerender();
    this.viewFit.viewFutureOrigin.clearPanels();
    this.viewFit.viewBackground.clearPanels();
    this.viewFit.viewOverlay.clearPanels();
    this.viewFit.viewOverlay.ZoomBoundaryPanel = null;
    this.viewFit.columnIndicatorPanels = [];
    this.viewFit.levelIndicatorPanels = [];
    this.viewFit.futurePanels = [];
    this.viewFit.viewBackground.rerender();
    this.viewFit.viewFuture.rerender();
    this.viewFit.viewFutureOrigin.rerender();
    this.viewFit.viewOverlay.rerender();
    this.onUpdateMultiverse();
  };
  cViewMultiversePanel.prototype.onVisible = function() {
    if (this.firstOnVisible || (Model.multiverse.totalNumberOfFutures <= 1)) {
      this.firstOnVisible = false;
      this.resetMultiverse();
    } else {
      this.onUpdateMultiverse();
    }
    this.bottomControlPanel.innerControlPanel.searchMethodOptionsPanel.updateSearchMethodCaption();
    if (!this.futureGeneratorThreadActive) {
      this.futureGeneratorThreadActive = true;
      var lThis = this;
      setTimeout(function() {
        lThis.generateFuturesThread();
      }, 100);
    }
  };
  cViewMultiversePanel.prototype.onInvisible = function() {
  };
  cViewMultiversePanel.prototype.onViewFlatFuturePanelMouseDown = function(aX, aY) {
    this.viewFlat.draggingOffset = true;
    this.viewFlat.draggingOffsetStartLeft = this.viewOffset.left;
    this.viewFlat.draggingOffsetStartTop = this.viewOffset.top;
    this.viewFlat.draggingOffsetStartX = aX;
    this.viewFlat.draggingOffsetStartY = aY;
  };
  cViewMultiversePanel.prototype.onViewFlatFuturePanelMouseMove = function(aX, aY) {
    if (this.viewFlat.draggingOffset) {
      this.viewOffset.left = this.viewFlat.draggingOffsetStartLeft + (aX - this.viewFlat.draggingOffsetStartX);
      this.viewOffset.top = this.viewFlat.draggingOffsetStartTop + (aY - this.viewFlat.draggingOffsetStartY);
      this.onUpdateMultiverse();
    }
  };
  cViewMultiversePanel.prototype.onViewFlatFuturePanelMouseUp = function(aX, aY) {
    this.viewFlat.draggingOffset = false;
  };
  cViewMultiversePanel.prototype.onViewFlatFuturePanelScroll = function(aDelta) {
    this.viewOffset.top += (aDelta * 50);
    this.onUpdateMultiverse();
  };
  cViewMultiversePanel.prototype.onViewFlatFuturePanelTap = function(aX, aY) {
    this.topControlPanel.innerControlPanel.viewModePanel.fitPanel.onClick();
    this.onUpdateMultiverse();
  };
  cViewMultiversePanel.prototype.onViewFitFuturePanelMouseDown = function(aX, aY) {
    this.viewFit.draggingOffset = true;
    this.viewFit.draggingOffsetStartLeft = this.viewOffset.left;
    this.viewFit.draggingOffsetStartTop = this.viewOffset.top;
    this.viewFit.draggingOffsetStartX = aX;
    this.viewFit.draggingOffsetStartY = aY;
  };
  cViewMultiversePanel.prototype.onViewFitFuturePanelMouseMove = function(aX, aY) {
    if (this.viewFit.draggingOffset) {
      var lDeltaX = (((aX - this.viewFit.draggingOffsetStartX) / (32 / cMultiverseFuturePanel.cViewColumnWidth)) | 0);
      var lDeltaY = (((aY - this.viewFit.draggingOffsetStartY) / (32 / cMultiverseFuturePanel.cViewHeight)) | 0);
      this.viewOffset.left = this.viewFit.draggingOffsetStartLeft + lDeltaX;
      this.viewOffset.top = this.viewFit.draggingOffsetStartTop + lDeltaY;
      this.onUpdateMultiverse_Fit(true);
    }
  };
  cViewMultiversePanel.prototype.onViewFitFuturePanelMouseUp = function(aX, aY) {
    this.viewFit.draggingOffset = false;
  };
  cViewMultiversePanel.prototype.onViewFitFuturePanelScroll = function(aDelta) {
    this.viewOffset.top += (((aDelta * 50) / (32 / cMultiverseFuturePanel.cViewHeight)) | 0);
    this.onUpdateMultiverse_Fit(true);
  };
  cViewMultiversePanel.prototype.onViewFitFuturePanelTap = function(aX, aY) {
    var lSupportSoomIntoClickedCoordinates = true;
    if (lSupportSoomIntoClickedCoordinates) {
      var lDeltaX = ((((aX - (this.viewFit.getInnerWidth() / 2)) - 36) / (32 / cMultiverseFuturePanel.cViewColumnWidth)) | 0);
      var lDeltaY = ((((aY - (this.viewFit.getInnerHeight() / 2)) - 18) / (32 / cMultiverseFuturePanel.cViewHeight)) | 0);
      this.viewOffset.left -= lDeltaX;
      this.viewOffset.top -= lDeltaY;
    }
    this.topControlPanel.innerControlPanel.viewModePanel.flatPanel.onClick();
    this.onUpdateMultiverse();
  };
  cViewMultiversePanel.prototype.focusOnFuture = function(aFuture) {
    this.viewOffset.left = (-2 + ((this.getInnerWidth() / 2) | 0)) - (aFuture.multiverseColumns[0].columnNumber * cMultiverseFuturePanel.cViewColumnWidth);
    this.viewOffset.top =  (-98 + ((this.getInnerHeight() / 2) | 0)) - (aFuture.level * cMultiverseFuturePanel.cViewHeight);
    this.onUpdateMultiverse();
  };
  cViewMultiversePanel.prototype.generateFuturesThread = function() {
    if (this.expansionMode == cViewMultiversePanel.eExpansionMode_Auto) {
      if (Model.stopSearchWhenGoalFound) {
        /*
        var lGoalFuture = Model.multiverse.getGoalFuture();
        if (lGoalFuture != null) {
          Model.allUndeterminedFutures = [];
          this.bottomControlPanel.innerControlPanel.expansionModePanel.manualPanel.onClick();
        }
        */
        if (Model.newestGoalFuture != null) {
          Model.allUndeterminedFutures = [];
          this.bottomControlPanel.innerControlPanel.expansionModePanel.manualPanel.onClick();
          this.focusOnFuture(Model.newestGoalFuture);
          Model.newestGoalFuture = null;
        }
      }
    }
    if (Model.completedDeterminingFutures()) {
      if (this.expansionMode == cViewMultiversePanel.eExpansionMode_Auto) {
        Model.planNextUndeterminedFuture();
      } else {
        Model.allUndeterminedFutures = [];
      }
    }
    if (!Model.completedDeterminingFutures()) {
      var lHalfViewColumnNumber = -((this.viewOffset.left - (cMultiverseFuturePanel.cViewColumnWidth / 2)) / cMultiverseFuturePanel.cViewColumnWidth);
      Model.continueDeterminingFutures({
        maxTimeMs : 60,
        maxTotalFutures : this.maxTotalFutures,
        maxDepth : 999,
        focusColumnNumber: (lHalfViewColumnNumber | 0)
      });
      this.onUpdateMultiverse();
    } else {
      if (this.expansionMode == cViewMultiversePanel.eExpansionMode_Auto) {
        this.bottomControlPanel.innerControlPanel.expansionModePanel.manualPanel.onClick();
      }
    }
    var lThis = this;
    setTimeout(function() {
      lThis.generateFuturesThread();
    }, 50);
  };
})();
var cFilePresets = {
  presets: []
};
/*
world:
<world>
  <item name="farmer" side="left"></item>
  <item name="fox" side="left"></item>
  <item name="chicken" side="left"></item>
  <item name="grain" side="left"></item>
</world>
css:
world
{
  display: block;
  width: 250px;
  padding: 10px;
  background-color: #00aa00;
}
item
{
  display: block;
  width: 80px;
  margin: 10px;
  padding: 10px;
  font-size: 22px;
  text-align: center;
}
item:before
{
  content: attr(name);
}
item[side=right]
{
  margin-left: 140px;
}
item[name=farmer]
{
  font-weight: bold;
  color: #ffffff;
  background-color: #0000ff;
}
item[name=fox]
{
  background-color: #D2691E;
}
item[name=chicken]
{
  background-color: #ff0000;
}
item[name=grain]
{
  background-color: #ffff00;
}
changes:
var farmer = $("item[name|='farmer']");
var side = farmer.attr("side");
var otherSide = (side == "left") ? "right" : "left";
farmer.attr( "side", otherSide);
var optionalItem = $("item[side|='" + side + "']").choose(0, 1);
optionalItem.attr( "side", otherSide);
new multiverse.world();
=========================
determining sqrt(3)
html:
  1
changes:
  var x = +($('body').html());
  x = (x + (3 / x)) / 2;
  $('body').html(x);
  new multiverse.world();
evaluate:
  var x = +($('body').html());
  if (((x * x) - 3) < Math.abs(0.0000000001))
  {
    world.goal();
  }
============================
<table id="rivercrossing" cellpadding="0" cellspacing="0">
  <tr>
    <td class="farmer">farmer</td>
  </tr>
  <tr>
    <td class="fox">fox</td>
  </tr>
  <tr class="chicken">
    <td>chicken</td>
    <td></td>
  </tr>
  <tr class="grain">
    <td>grain</td>
    <td></td>
  </tr>
</table>
<world>
  <item name="farmer" side="left"></item>
  <item name="fox" side="left"></item>
  <item name="chicken" side="left"></item>
  <item name="grain" side="left"></item>
</world>
=============================
<table id="tictactoe" cellpadding="0" cellspacing="0">
  <tr>
    <td id="p11"></td>
    <td id="p12"></td>
    <td id="p13"></td>
  </tr>
  <tr>
    <td id="p21"></td>
    <td id="p22"></td>
    <td id="p23"></td>
  </tr>
  <tr>
    <td id="p31"></td>
    <td id="p32"></td>
    <td id="p33"></td>
  </tr>
</table>
#tictactoe {
  border: 3px solid #333333;
}
#tictactoe td {
  width: 80px;
  height: 80px;
  background: #cccccc;
  color: #000000;
  font-size: 60px;
  font-weight: bold;
  text-align: center;
  vertical-align: middle;
  border: 2px solid #333333;
}
var numberOfXsAndOs = $("td:not(:empty)").length;
var turn = ((numberOfXsAndOs % 2) == 0) ? 'X' : 'O';
var emptyCells = $("td:empty");
if (emptyCells.length) {
  var chosenCell = emptyCells.chooseOne();
  chosenCell.html(turn);
  new multiverse.world(turn);
}
var emptyCells = $("td:empty");
if (emptyCells.length == 0) {
  world.end();
}
===============================
*/
cFilePresets.presets.push({
  application:
  {
    name: "ProblemSolver",
    home: "http://complexity.zone/problem_solver",
    version: "0.0.1"
  },
  project:
  {
    name: "Towers of Hanoi",
    html: 
          '<!-- Model the Towers of Hanoi puzzle using HTML. -->\n' +
          '\n' +
          "<towersofhanoi>\n" +
          "  <rod>\n" +
          "    <disk size=\"1\" color=\"red\"></disk>\n" +
          "    <disk size=\"2\" color=\"yellow\"></disk>\n" +
          "    <disk size=\"3\" color=\"blue\"></disk>\n" +
          "  </rod>\n" +
          "  <rod>\n" +
          "  </rod>\n" +
          "  <rod>\n" +
          "  </rod>\n" +
          "</towersofhanoi>\n" +
          "\n" +
          '<!-- The HTML code below is just for displaying the pins as a background. -->\n' +
          "\n" +
          "<background>\n" +
          "  <pin></pin>\n" +
          "  <pin></pin>\n" +
          "  <pin></pin>\n" +
          "</background>\n",
    css:
          '/* Apply CSS to make the world appear natural. */\n' +
          '\n' +
          "body {\n" +
          "  padding: 6px;\n" +
          "}\n" +
          "\n" +
          "towersofhanoi {\n" +
          "  position: absolute;\n" +
          "  display: block;\n" +
          "  width: 300px;\n" +
          "}\n" +
          "\n" +
          "rod {\n" +
          "  display: inline-block;\n" +
          "  position: relative;\n" +
          "  width: 86px;\n" +
          "  height: 150px;\n" +
          "  background-color: transparent;\n" +
          "}\n" +
          "\n" +
          "disk {\n" +
          "  display: block;\n" +
          "  position: absolute;\n" +
          "  height: 30px;\n" +
          "  border: 1px solid black;\n" +
          "  background-color: #cccccc;\n" +
          "}\n" +
          "\n" +
          "disk[size=\"1\"] {\n" +
          "  left: 28px;\n" +
          "  width: 30px;\n" +
          "  background-color: #ff0000;\n" +
          "}\n" +
          "\n" +
          "disk[size=\"2\"] {\n" +
          "  left: 18px;\n" +
          "  width: 50px;\n" +
          "  background-color: #ffff00;\n" +
          "}\n" +
          "\n" +
          "disk[size=\"3\"] {\n" +
          "  left: 3px;\n" +
          "  width: 80px;\n" +
          "  background-color: #0000ff;\n" +
          "}\n" +
          "\n" +
          "disk:nth-last-child(1) {\n" +
          "  top: 100px;\n" +
          "}\n" +
          "\n" +
          "disk:nth-last-child(2) {\n" +
          "  top: 60px;\n" +
          "}\n" +
          "\n" +
          "disk:nth-last-child(3) {\n" +
          "  top: 20px;\n" +
          "}\n" +
          "\n" +
          '/* The following CSS rules apply to the background. */\n' +
          '\n' +
          "background {\n" +
          "  position: absolute;\n" +
          "  display: block;\n" +
          "  z-index: -1;\n" +
          "  width: 270px;\n" +
          "  height: 140px;\n" +
          "  border-bottom: 25px solid #aaaa66;\n" +
          "}\n" +
          "\n" +
          "pin {\n" +
          "  display: block;\n" +
          "  position: absolute;\n" +
          "  top: 10px;\n" +
          "  width: 10px;\n" +
          "  height: 150px;\n" +
          "  background-color: #aaaa66;\n" +
          "}\n" +
          "\n" +
          "pin:nth-child(1) {\n" +
          "  left: 38px;\n" +
          "}\n" +
          "\n" +
          "pin:nth-child(2) {\n" +
          "  left: 128px;\n" +
          "}\n" +
          "\n" +
          "pin:nth-child(3) {\n" +
          "  left: 218px;\n" +
          "}\n",
    actions:
          "// First select all the rods which have at least one disk.\n" +
          "var rodsWithDisks = $(\"rod\").has(\"disk\");\n" +
          "\n" +
          "// Choose any one of these rods using Problem Solver's chooseOne() plugin.\n" +
          "// This tells Problem Solver to run this code for each rod which is not empty.\n" +
          "var chosenRod = rodsWithDisks.chooseOne();\n" +
          "\n" +
          "// Select the top-most disk on the chosen rod.\n" +
          "var topDisk = chosenRod.children().eq(0);\n" +
          "\n" +
          "// Choose a any other rod as the destination using Problem Solver's chooseOne() plugin.\n" +
          "// This tells Problem Solver to run this code for each possible destination rod.\n" +
          "var destinationRod = chosenRod.siblings().chooseOne();\n" +
          "\n" +
          "// Move this disk to the chosen destination rod.\n" +
          "topDisk.prependTo(destinationRod);\n" +
          "\n" +
          "// Store resulting world in a new world and describe the changes:\n" +
          "new multiverse.world('move ' + topDisk.attr('color') + ' disk to rod number ' + (destinationRod.index() + 1));\n" +
          "\n",
    evaluations:
          "if ($(\"disk[size='2'] ~ disk[size='1']\").length) {\n" +
          "  // A disk of size 2 is placed on top of a disk with size 1,\n" +
          "  // so mark this world as illegal:\n" +
          "  world.illegal();\n" +
          "} else if ($(\"disk[size='3'] ~ disk[size='1']\").length) {\n" +
          "  // A disk of size 3 is placed on top of a disk with size 1,\n" +
          "  // so mark this world as illegal:\n" +
          "  world.illegal();\n" +
          "} else if ($(\"disk[size='3'] ~ disk[size='2']\").length) {\n" +
          "  // A disk of size 3 is placed on top of a disk with size 2,\n" +
          "  // so mark this world as illegal:\n" +
          "  world.illegal();\n" +
          "} else if ($('rod').last().children().length == 3) {\n" +
          "  // There are no violations and all 3 disks are placed on the last rod - the puzzle is solved,\n" +
          "  // so mark this world as the goal:\n" +
          "  world.goal('DONE!');\n" +
          "}\n",
    searchAlgorithm:
          "breadth-first"
  }
});
cFilePresets.presets.push({
  application:
  {
    name: "ProblemSolver",
    home: "http://complexity.zone/problem_solver",
    version: "0.0.1"
  },
  project:
  {
    name: 'River crossing',
    html:
          '<!-- Model the initial "now" situation (world) using HTML. -->\n' +
          '\n' +
          '<riverBank class="A">\n' +
          '  <farmer>farmer</farmer>\n' +
          '  <fox>fox</fox>\n' +
          '  <chicken>chicken</chicken>\n' +
          '  <grain>grain</grain>\n' +
          '</riverBank>\n' +
          '\n' +
          '<river></river>\n' +
          '\n' +
          '<riverBank class="B">\n' +
          '</riverBank>\n',
    css:
          '/* Apply CSS to make the world appear natural. */\n' +
          '\n' +
          'river {\n' +
          '  /* position and color the river */\n' +
          '  position: absolute;\n' +
          '  left: 100px;\n' +
          '  width: 50px;\n' +
          '  height: 210px;\n' +
          '  /* color the river blue */\n' +
          '  background-color: #aaaaff;\n' +
          '}\n' +
          '\n' +
          'riverBank {\n' +
          '  /* set the size and color of the river bank */\n' +
          '  position: absolute;\n' +
          '  width: 100px;\n' +
          '  height: 210px;\n' +
          '  /* color the riverside green */\n' +
          '  background-color: #00aa00;\n' +
          '}\n' +
          'riverBank.A {\n' +
          '  /* position river bank A on the left side */\n' +
          '  left: 0px;\n' +
          '}\n' +
          'riverBank.B {\n' +
          '  /* position river bank B on the right side */\n' +
          '  left: 150px;\n' +
          '}\n' +
          '\n' +
          'riverBank * {\n' +
          '  /* common properties for farmer, fox, chicken and grain */\n' +
          '  display: block;\n' +
          '  margin: 10px;\n' +
          '  padding: 10px;\n' +
          '  text-align: center;\n' +
          '}\n' +
          '\n' +
          'farmer {\n' +
          '  font-weight: bold;\n' +
          '  color: #ffffff;\n' +
          '  background-color: #0000ff;\n' +
          '}\n' +
          '\n' +
          'fox {\n' +
          '  background-color: #D2691E;\n' +
          '}\n' +
          '\n' +
          'chicken {\n' +
          '  background-color: #ff0000;\n' +
          '}\n' +
          '\n' +
          'grain {\n' +
          '  background-color: #ffff00;\n' +
          '}\n',
    actions:
          "\n" +
          "// Select the farmer:\n" +
          "var farmer = $('farmer');\n" +
          "\n" +
          "// List the available items to take to the other river bank.\n" +
          "var selectableItems = farmer.siblings();\n" +
          "\n" +
          "// Optionally select any single item (0 or 1 items) using the special choose() plugin.\n" +
          "var optionalItem = selectableItems.choose(0, 1);\n" +
          "\n" +
          "// Select the destination river bank:\n" +
          "var otherBank = farmer.parent().siblings('riverBank');\n" +
          "\n" +
          "// Move the farmer (and optionally an item) to the other river bank:\n" +
          "farmer.add(optionalItem).appendTo(otherBank);\n" +
          "\n" +
          "// Store resulting world in a new world and describe the changes:\n" +
          "new multiverse.world('move to ' + otherBank[0].className + (optionalItem.length > 0 ? ' with ' + optionalItem[0].nodeName : ' alone'));\n",
    evaluations:
          "\n" +
          "if ($('riverBank.B *').length == 4)\n" +
          "{\n" +
          "  // All four subjects are on the other side - the puzzle is solved,\n" +
          "  // so mark this world as the goal:\n" +
          "  world.goal('made it!');\n" +
          "}\n" +
          "\n" +
          "if (($('fox').siblings('chicken').length > 0) &&\n"+
          "    ($('fox').siblings('farmer').length == 0))\n" +
          "{\n" +
          "  // The fox and chicken are at the same river bank but\n" +
          "  // unattended by the farmer, so mark this world as illegal:\n" +
          "  world.illegal('not allowed to leave fox and chicken unattended');\n" +
          "}\n" +
          "\n" +
          "if (($('chicken').siblings('grain').length > 0) &&\n"+
          "    ($('chicken').siblings('farmer').length == 0))\n" +
          "{\n" +
          "  // The chicken and grain are at the same river bank but\n" +
          "  // unattended by the farmer, so mark this world as illegal:\n" +
          "  world.illegal('not allowed to leave chicken and grain unattended');\n" +
          "}\n" +
          "\n" +
          /*
          "if (world.isSameAsBefore())\n" +
          "{\n" +
          "  // Tell Problem Solver to ignore (discontinue) paths which lead to repetition.\n" +
          "  // This will greatly limit the growth of the multiverse.\n" +
          "  world.ignore();\n" +
          "}\n" +
          "\n" +
          */
          "// If we haven't achieved our goal, at least give it some kind of score with\n" +
          "// the like() function, where its value is the number of subjects on the other side.\n" +
          "// This will guide the auto search function when the search method is set to \"high like-score first\".\n" +
          "world.like($('riverBank.B *').length);\n",
    searchAlgorithm:
          "breadth-first"
  }
});
/*
cFilePresets.presets.push({
  name: "Qubits",
  html: 
        "",
  css:
        "body {\n" +
        "  font-size: 40px;\n" +
        "}\n",
  actions:
        "var qubit1 = [0, 1].choose(1, 1)[0];\n" +
        "var qubit2 = [0, 1].choose(1, 1)[0];\n" +
        "var qubit3 = [0, 1].choose(1, 1)[0];\n" +
        "var display = '' + qubit1 + qubit2 + qubit3;\n" +
        "document.body.innerHTML = display;\n" +
        "new multiverse.world(display);\n",
  evaluations:
        "if (document.body.innerHTML != '') {\n" +
        "  world.end();\n" +
        "}\n"
});
*/
/*
cFilePresets.presets.push({
  name: "Throwing coins, binary tree",
  html: 
        "",
  css:
        "",
  actions:
        "var toss = ['heads', 'tails'].choose(1, 1)[0];\n" +
        "new multiverse.world(toss);\n",
  evaluations:
        ""
});
*/
/*
cFilePresets.presets.push({
  name: "Yahtzee",
  html: 
        "",
  css:
        "",
  actions:
        "var dice = [1, 2, 3, 4, 5, 6];\n" +
        "var roll = dice.choose(1, 1)[0];\n" +
        "new multiverse.world(roll);\n",
  evaluations:
        ""
});
*/
var lChessBoard = "";
lChessBoard += "<table id=\"chessboard\" cellpadding=\"0\" cellspacing=\"0\">\n";
for (var lrow = 1; lrow <= 8; lrow++) {
  lChessBoard += "  <tr>\n";
  for (var lcolumn = 1; lcolumn <= 8; lcolumn++) {
    lChessBoard += "    <td id=\"p" + lrow + lcolumn + "\"></td>\n";
  }
  lChessBoard += "  </tr>\n";
}
lChessBoard += "</table>\n";
cFilePresets.presets.push({
  application:
  {
    name: "ProblemSolver",
    home: "http://complexity.zone/problem_solver",
    version: "0.0.1"
  },
  project:
  {
    name: "Eight queens puzzle",
    html: lChessBoard,
    css:
          "#chessboard {\n" +
          "  border: 3px solid #333333;\n" +
          "}\n" +
          "\n" +
          "#chessboard td {\n" +
          "  width: 40px;\n" +
          "  height: 40px;\n" +
          "  background: #ffffff;\n" +
          "  color: #000000;\n" +
          "  font-size: 30px;\n" +
          "  text-shadow: 0 1px #ffffff;\n" +
          "  text-align: center;\n" +
          "  vertical-align: middle;\n" +
          "}\n" +
          "\n" +
          "#chessboard tr:nth-child(odd) td:nth-child(even),\n" +
          "#chessboard tr:nth-child(even) td:nth-child(odd) {\n" +
          "  background: #aaaaaa;\n" +
          "}\n",
    actions:
    /*
          "var firstemptyrow = 0;\n" +
          "// find first empty row\n" +
          "for (var row = 1; row <= 8; row++) {\n" +
          "  var foundone = false;\n" +
          "  for (var column = 1; column <= 8; column++) {\n" +
          "    if ($(\"#p\" + row + column).html() != \"\") {\n" +
          "      foundone = true;\n" +
          "      break;\n" +
          "    }\n" +
          "  }\n" +
          "  if (!foundone) {\n" +
          "    firstemptyrow = row;\n" +
          "    break;\n" +
          "  }\n" +
          "}\n" +
          "if (firstemptyrow) {\n" +
          "  var column = [1,2,3,4,5,6,7,8].chooseOne();\n" +
          "  var cell = $(\"#p\" + firstemptyrow + column);\n" +
          "  if (cell.html() == \"\") {\n" +
          "    cell.html(\"&#9818;\");\n" +
          "    new multiverse.world();\n" +
          "  }\n" +
          "}\n",
    */
          "// Method: place a queen on the first empty row and mark the row as 'done'.\n" +
          "\n" +
          "// Select the first row that we have not yet filled with a queen.\n" +
          "var row = $('tr:not(.done)').eq(0);\n" +
          "\n" +
          "// Select one of the 8 cells within the row.\n" +
          "var cell = row.children().chooseOne();\n" +
          "\n" +
          "// Fill the cell with the unicode value for the black queen symbol.\n" +
          "cell.html('&#9818;');\n" +
          "\n" +
          "// Mark the row's class with 'done'.\n" +
          "row.addClass('done');\n" +
          "\n" +
          "// Create the new world.\n" +
          "new multiverse.world();\n" +
          "\n",
    evaluations:
          "\n" +
          "// List all vertical and diagonal lines in an array. We will use these lines\n" +
          "// to determine whether any of them contains more than one queen. Note that\n" +
          "// we do not need to look at horizontal lines because we place a single\n" +
          "// queen on each row.\n" +
          "var lines = [\n" + 
  /*
          "  // horizontal lines (actually no need to test these, because we place a single queen on each row):\n" +
          "  ['11', '12', '13', '14', '15', '16', '17', '18'],\n" + 
          "  ['21', '22', '23', '24', '25', '26', '27', '28'],\n" + 
          "  ['31', '32', '33', '34', '35', '36', '37', '38'],\n" + 
          "  ['41', '42', '43', '44', '45', '46', '47', '48'],\n" + 
          "  ['51', '52', '53', '54', '55', '56', '57', '58'],\n" + 
          "  ['61', '62', '63', '64', '65', '66', '67', '68'],\n" + 
          "  ['71', '72', '73', '74', '75', '76', '77', '78'],\n" + 
          "  ['81', '82', '83', '84', '85', '86', '87', '88'],\n" + 
  */
          "  // vertical lines:\n" +
          "  ['11', '21', '31', '41', '51', '61', '71', '81'],\n" + 
          "  ['12', '22', '32', '42', '52', '62', '72', '82'],\n" + 
          "  ['13', '23', '33', '43', '53', '63', '73', '83'],\n" + 
          "  ['14', '24', '34', '44', '54', '64', '74', '84'],\n" + 
          "  ['15', '25', '35', '45', '55', '65', '75', '85'],\n" + 
          "  ['16', '26', '36', '46', '56', '66', '76', '86'],\n" + 
          "  ['17', '27', '37', '47', '57', '67', '77', '87'],\n" + 
          "  ['18', '28', '38', '48', '58', '68', '78', '88'],\n" + 
          "  // diagonal lines:\n" +
          "  ['21', '12'],\n" + 
          "  ['31', '22', '13'],\n" + 
          "  ['41', '32', '23', '14'],\n" + 
          "  ['51', '42', '33', '24', '15'],\n" + 
          "  ['61', '52', '43', '34', '25', '16'],\n" + 
          "  ['71', '62', '53', '44', '35', '26', '17'],\n" + 
          "  ['81', '72', '63', '54', '45', '36', '27', '18'],\n" + 
          "  [      '82', '73', '64', '55', '46', '37', '28'],\n" + 
          "  [            '83', '74', '65', '56', '47', '38'],\n" + 
          "  [                  '84', '75', '66', '57', '48'],\n" + 
          "  [                        '85', '76', '67', '58'],\n" + 
          "  [                              '86', '77', '68'],\n" + 
          "  [                                    '87', '78'],\n" + 
          "  ['71', '82'],\n" + 
          "  ['61', '72', '83'],\n" + 
          "  ['51', '62', '73', '84'],\n" + 
          "  ['41', '52', '63', '74', '85'],\n" + 
          "  ['31', '42', '53', '64', '75', '86'],\n" + 
          "  ['21', '32', '43', '54', '65', '76', '87'],\n" + 
          "  ['11', '22', '33', '44', '55', '66', '77', '88'],\n" + 
          "  [      '12', '23', '34', '45', '56', '67', '78'],\n" + 
          "  [            '13', '24', '35', '46', '57', '68'],\n" + 
          "  [                  '14', '25', '36', '47', '58'],\n" + 
          "  [                        '15', '26', '37', '48'],\n" + 
          "  [                              '16', '27', '38'],\n" + 
          "  [                                    '17', '28']\n" + 
          "];\n" + 
          "\n" + 
          "// Now we look at whether more than one queen is present on any of these lines.\n" + 
          "// If so, we will store the violation in the string variable 'violation'.\n" + 
          "var violation = '';\n" +
          "for (var li = 0; li < lines.length; li++) {\n" + 
          "  var line = lines[li];\n" + 
          "  var numberOfQueens = 0;\n" +
          "  for (var ci = 0; ci < line.length; ci++) {\n" + 
          "    if ($('#p' + line[ci]).html() != '') {\n" +
          "      numberOfQueens++;\n" +
          "    }\n" +
          "  }\n" + 
          "  if (numberOfQueens > 1) {\n" +
          "    // We have found more than one queen on a line.\n" +
          "    violation = numberOfQueens + ' queens found on a line';\n" +
          "    // No need to look any further. Break the loop.\n" +
          "    break;\n" +
          "  }\n" +
          "}\n" + 
          "\n" + 
          "// Check whether a violation was found.\n" + 
          "if (violation != '') {\n" +
          "  // We have found a violation, mark the world as illegal.\n" +
          "  world.illegal(violation);\n" +
          "} else  {\n" +
          "  // No violations found. Check whether the goal is achieved:\n" +
          "  if($('tr.done').length == 8) {\n" +
          "    // We have placed a queen on each of the eight rows without violations:\n" +
          "    world.goal('8 queens!');\n" +
          "  }\n" +
          "}\n" +
          "\n" + 
          "\n",
    searchAlgorithm:
          "left-side-first"
  }
/*
        "// Find horizontal, vertical or diagonal violations.\n" +
        "var violation = '';\n" +
        "\n" +
        "// check horizontal violations:\n" +
        "for (var row = 1; row <= 8; row++) {\n" +
        "  var numberOfQueens = 0;\n" +
        "  for (var column = 1; column <= 8; column++) {\n" +
        "    if ($('#p' + row + column).html() != '') {\n" +
        "      numberOfQueens++;\n" +
        "    }\n" +
        "  }\n" +
        "  if (numberOfQueens > 1) {\n" +
        "    violation = numberOfQueens + ' queens in row ' + row;\n" +
        "    break;\n" +
        "  }\n" +
        "}\n" +
        "\n" +
        "if (!violation) {\n" +
        "  // check vertical violations:\n" +
        "  for (var column = 1; column <= 8; column++) {\n" +
        "    var numberOfQueens = 0;\n" +
        "    for (var row = 1; row <= 8; row++) {\n" +
        "      if ($('#p' + row + column).html() != '') {\n" +
        "        numberOfQueens++;\n" +
        "      }\n" +
        "    }\n" +
        "    if (numberOfQueens > 1) {\n" +
        "      violation = numberOfQueens + ' queens in column ' + column;\n" +
        "      break;\n" +
        "    }\n" +
        "  }\n" +
        "}\n" +
        "\n" +
        "if (!violation) {\n" +
        "  // check right-up diagonal violations:\n" +
        "  for (var row = 2; row <= 8; row++) {\n" +
        "    var numberOfQueens = 0;\n" +
        "    var rowi = row;\n" +
        "    var column = 1;\n" +
        "    while ((rowi >= 1) && (column <= 8)) {\n" +
        "      if ($('#p' + rowi + column).html() != '') {\n" +
        "        numberOfQueens++;\n" +
        "      }\n" +
        "      rowi--;\n" +
        "      column++;\n" +
        "    }\n" +
        "    if (numberOfQueens > 1) {\n" +
        "      violation = numberOfQueens + ' queens along diagonal';\n" +
        "      break;\n" +
        "    }\n" +
        "  }\n" +
        "  if (!violation) {\n" +
        "    for (var column = 2; column <= 7; column++) {\n" +
        "      var numberOfQueens = 0;\n" +
        "      var row = 8;\n" +
        "      var columni = column;\n" +
        "      while ((row >= 1) && (columni <= 8)) {\n" +
        "        if ($('#p' + row + columni).html() != '') {\n" +
        "          numberOfQueens++;\n" +
        "        }\n" +
        "        row--;\n" +
        "        columni++;\n" +
        "      }\n" +
        "      if (numberOfQueens > 1) {\n" +
        "        violation = numberOfQueens + ' queens along diagonal';\n" +
        "        break;\n" +
        "      }\n" +
        "    }\n" +
        "  }\n" +
        "}\n" +
        "\n" +
        "if (!violation) {\n" +
        "  // check right-down diagonal violations:\n" +
        "  for (var row = 7; row >= 1; row--) {\n" +
        "    var numberOfQueens = 0;\n" +
        "    var rowi = row;\n" +
        "    var column = 1;\n" +
        "    while ((rowi <= 8) && (column <= 8)) {\n" +
        "      if ($('#p' + rowi + column).html() != '') {\n" +
        "        numberOfQueens++;\n" +
        "      }\n" +
        "      rowi++;\n" +
        "      column++;\n" +
        "    }\n" +
        "    if (numberOfQueens > 1) {\n" +
        "      violation = numberOfQueens + ' queens along diagonal';\n" +
        "      break;\n" +
        "    }\n" +
        "  }\n" +
        "  if (!violation) {\n" +
        "    for (var column = 2; column <= 7; column++) {\n" +
        "      var numberOfQueens = 0;\n" +
        "      var row = 1;\n" +
        "      var columni = column;\n" +
        "      while ((row <= 8) && (columni <= 8)) {\n" +
        "        if ($('#p' + row + columni).html() != '') {\n" +
        "          numberOfQueens++;\n" +
        "        }\n" +
        "        row++;\n" +
        "        columni++;\n" +
        "      }\n" +
        "      if (numberOfQueens > 1) {\n" +
        "        violation = numberOfQueens + ' queens along diagonal';\n" +
        "        break;\n" +
        "      }\n" +
        "    }\n" +
        "  }\n" +
        "}\n" +
        "\n" +
        "if (violation) {\n" +
        "  //We have found a violation, mark the world as illegal.\n" +
        "  world.illegal(violation);\n" +
        "} else  {\n" +
        "  // Check whether the goal is achieved:\n" +
        "  if($('tr.done').length == 8) {\n" +
        "    // We have placed a queen on each of the eight rows without vialations:\n" +
        "    world.goal('8 queens!');\n" +
        "  }\n" +
        "}\n" +
        ""
*/
});
/*
  * Class clsFileLoadPanel
  */
function clsFileLoadPanel(aProperties) {
  cPanel.call(this, aProperties);
  this.inputElement = null;
  this.fileLoaded = false;
  this.fileContent = '';
  this.onSelectFile = aProperties ? (typeof aProperties.onSelectFile != 'undefined' ? aProperties.onSelectFile : null) : null;
  this.onSelectFileThis = aProperties ? (typeof aProperties.onSelectFileThis != 'undefined' ? aProperties.onSelectFileThis : null) : null;
}
clsFileLoadPanel.deriveFrom(cPanel);
(function() {
  clsFileLoadPanel.prototype.inputElement = null;
  clsFileLoadPanel.prototype.fileLoaded = false;
  clsFileLoadPanel.prototype.fileContent = '';
  clsFileLoadPanel.prototype.onSelectFile = null;
  clsFileLoadPanel.prototype.onSelectFileThis = null;
  clsFileLoadPanel.prototype.render = function(aParentPanel, aParentElement, aClientRect) {
    cPanel.prototype.render.call(this, aParentPanel, aParentElement, aClientRect);
    var lThis = this;
    if (this.element != null) {
      if (this.inputElement == null) {
        this.inputElement = document.createElement('INPUT');
        this.inputElement.type = 'file';
        this.inputElement.id = 'pnl_' + this.instanceId + '_' + this.innerId + '_input';
        this.element.appendChild(this.inputElement);
        this.inputElement.style.fontSize = this.fontSize + 'px';
        this.inputElement.style.color = this.color;
        this.inputElement.style.backgroundColor = this.backgroundColor;
        this.inputElement.addEventListener('change', function(aEvent) { lThis.onOpenFile(aEvent); } , false);
      }
      this.inputElement.style.width = (this.getInnerWidth() - 6) + 'px';
      this.inputElement.style.height = (this.getInnerHeight() - 4) + 'px';
    }
  };
  clsFileLoadPanel.prototype.onOpenFile = function(aEvent) {
    var file = aEvent.target.files[0];
    var lThis = this;
    if ((file) && ((file.type == '') || file.type.match('/text.*/'))) {
      var lFileReader = new FileReader();
      lFileReader.onload = function(e) {
        lThis.fileLoaded = true;
        lThis.fileContent = lFileReader.result;
        if (lThis.onSelectFile) {
          if (lThis.onSelectFileThis) {
            lThis.onSelectFile.call(lThis.onSelectFileThis, true);
          } else {
            lThis.onSelectFile(true);
          }
        }
      };
      lFileReader.onabort = function(e) {
        lThis.fileLoaded = false;
        lThis.fileContent = '';
        if (lThis.onSelectFileThis) {
          lThis.onSelectFile.call(lThis.onSelectFileThis, false);
        } else {
          lThis.onSelectFile(false);
        }
      };
      lFileReader.onerror = function(e) {
        lThis.fileLoaded = false;
        lThis.fileContent = '';
        if (lThis.onSelectFileThis) {
          lThis.onSelectFile.call(lThis.onSelectFileThis, false);
        } else {
          lThis.onSelectFile(false);
        }
      };
      lFileReader.readAsText(file);  
    } else {
      lThis.fileLoaded = false;
      lThis.fileContent = '';
      if (lThis.onSelectFileThis) {
        lThis.onSelectFile.call(lThis.onSelectFileThis, false);
      } else {
        lThis.onSelectFile(false);
      }
    }
  };
})();
/*
Strategy:
We strive for more possibilities, less possible events due to rules.
More voluntaries, less expectations.
  var a = [765765, 76768, 344];
  var b = a.choose(1,2)
-------------------------------
*/
/**
  * Class cProblemSolverApp
  */
function cProblemSolverApp(aContainer) {
  cApp.call(this, aContainer);
  this.resourcesLoaded = false;
  this.screen = new cScreen(this, (aContainer ? aContainer : document.body));
  this.screen.loadImages([
    {id: cProblemSolverApp.cImageProblemSolver, src: 'img/problemsolver.png'},
    {id: cProblemSolverApp.cImageViewWorldImage, src: 'img/view_world.png'},
    {id: cProblemSolverApp.cImageViewChangesImage, src: 'img/view_changes.png'},
    {id: cProblemSolverApp.cImageViewEvaluateImage, src: 'img/view_evaluate.png'},
    {id: cProblemSolverApp.cImageViewMultiverseImage, src: 'img/view_multiverse.png'},
    {id: cProblemSolverApp.cImageWorld, src: 'img/world.png'},
    {id: cProblemSolverApp.cImageChanges, src: 'img/changes.png'},
    {id: cProblemSolverApp.cImageEvaluate, src: 'img/evaluate.png'},
    {id: cProblemSolverApp.cImageAgent, src: 'img/agent.png'},
    {id: cProblemSolverApp.cImageMultiverse, src: 'img/multiverse.png'},
    {id: cProblemSolverApp.cImageQuestion, src: 'img/question.png'},
    {id: cProblemSolverApp.cImageClose, src: 'img/close.png'},
    {id: cProblemSolverApp.cImageRefresh, src: 'img/refresh.png'},
    {id: cProblemSolverApp.cImageAdd, src: 'img/add.png'},
    {id: cProblemSolverApp.cImageDelete, src: 'img/delete.png'},
    {id: cProblemSolverApp.cImageUp, src: 'img/up.png'},
    {id: cProblemSolverApp.cImageDown, src: 'img/down.png'},
    {id: cProblemSolverApp.cFutureAxis, src: 'img/futureaxis.png'},
    {id: cProblemSolverApp.cOptionsAxis, src: 'img/optionsaxis.png'},
    {id: cProblemSolverApp.cExpand, src: 'img/expand.png'}
  ]);
  this.actionSandboxIFrame_Initialized = false;
  this.evaluationSandboxIFrame_Initialized = false;
  this.screen.waitForResources(this, function() {
    this.resourcesLoaded = true;
    this.screen.setup();
    var lThis = this;
    this.actionSandboxIFrame = new cIFramePanel({
      align: eAlign.eNone,
      visible: false,
      width: 128,
      height: 128,
      backgroundColor: 'transparent',
      border: 1,
      borderColor: '#000000',
      iFrameHTML: '',
      supportScroll: false
    });
    this.screen.panel.panels.push(this.actionSandboxIFrame);
    Model.initActionSandbox(this.actionSandboxIFrame, 
      function() {
        lThis.actionSandboxIFrame_Initialized = true;
        lThis.updateSandboxInitialized();
      }
    );
    this.evaluationSandboxIFrame = new cIFramePanel({
      align: eAlign.eNone,
      visible: false,
      width: 128,
      height: 128,
      backgroundColor: 'transparent',
      border: 1,
      borderColor: '#000000',
      iFrameHTML: '',
      supportScroll: false
    });
    this.screen.panel.panels.push(this.evaluationSandboxIFrame);
    Model.initEvaluationSandbox(this.evaluationSandboxIFrame, 
      function() {
        lThis.evaluationSandboxIFrame_Initialized = true;
        lThis.updateSandboxInitialized();
      }
    );
    this.screenPanel = new cPanel({
      align: eAlign.eClient,
      backgroundColor: 'transparent'
    });
    this.screen.panel.panels.push(this.screenPanel);
    this.panelTopMenu = new cPanel({
      align: eAlign.eTop,
      height: 60,
      backgroundColor: '#333333'
    });
    this.screenPanel.panels.push(this.panelTopMenu);
    this.panelTopMenuLogo = new cPanel({
      align: eAlign.eLeft,
      width: 192,
      margin: 6,
      backgroundColor: 'transparent',
      image: this.screen.getImageClone(cProblemSolverApp.cImageProblemSolver),
      imageStretch: true,
      onClick: function() {
        lThis.panelTabMenu.closeMenus();
      }
    });
    this.panelTopMenu.panels.push(this.panelTopMenuLogo);
    this.panelTopMenuFile = new cPanel({
      align: eAlign.eLeft,
      shape: cPanel.cShapeRoundRect,
      width: 172,
      marginLeft: 16, 
      marginTop: 8,
      marginBottom: 8,
      paddingTop: 2,
      border: 1,
      borderColor: '#262626',
      borderRadius: 16,
      backgroundColor: '#262626', 
      color: '#ffffff',
      fontSize: 30,
      textAlign: eTextAlign.eCenter,
      innerHTML: 'EXAMPLES',
      onClick: function() {
        var lModalPanel = new clsModalPanel({
          onClick: function() {
            setTimeout(function() {
              lThis.screen.panel.removePanel(lModalPanel);
            }, 10);
          }
        });
        lThis.screen.panel.appendPanel(lModalPanel);
        lModalPanel.fileDialogPanel = new cPanel({
          align: eAlign.eCenterVertical,
          shape: cPanel.cShapeRoundRect,
          width: 720,
          marginLeft: 100,
          marginTop: 100,
          marginRight: 100,
          marginBottom: 100,
          border: 1,
          borderColor: '#262626',
          borderRadius: 16,
          backgroundColor: '#262626', 
          color: '#ffffff',
          fontSize: 36,
          onClick: function() {
            this.stopBubble = true;
          }
        });
        lModalPanel.contentPanel.panels.push(lModalPanel.fileDialogPanel);
        lModalPanel.fileDialogPanel.headerPanel = new cPanel({
          align: eAlign.eTop,
          height: 50,
          paddingLeft: 20,
          backgroundColor: '#444444', 
          color: '#eeeeee',
          fontSize: 36,
          innerHTML: 'Open an example project'
        });
        lModalPanel.fileDialogPanel.panels.push(lModalPanel.fileDialogPanel.headerPanel);
        lModalPanel.fileDialogPanel.bottomPanel = new cPanel({
          align: eAlign.eBottom,
          height: 70,
          paddingLeft: 20,
          backgroundColor: '#444444'
        });
        lModalPanel.fileDialogPanel.panels.push(lModalPanel.fileDialogPanel.bottomPanel);
        lModalPanel.fileDialogPanel.bottomPanel.cancelButton = new cPanel({
          align: eAlign.eCenterVertical,
          shape: cPanel.cShapeRoundRect,
          width: 200,
          marginTop: 10,
          marginBottom: 10,
          padding: 2,
          backgroundColor: '#262626',
          border: 1,
          borderColor: '#262626',
          borderRadius: 16,
          color: '#eeeeee',
          fontSize: 36,
          textAlign: eTextAlign.eCenter,
          innerHTML: 'CANCEL',
          onClick: function() {
            this.stopBubble = true;
            setTimeout(function() {
              lThis.screen.panel.removePanel(lModalPanel);
            }, 10);
          }
        });
        lModalPanel.fileDialogPanel.bottomPanel.panels.push(lModalPanel.fileDialogPanel.bottomPanel.cancelButton);
        lModalPanel.fileDialogPanel.contentScrollPanel = new cScrollboxPanel({
          align: eAlign.eClient,
          panelBoxRoundedBorder: false,
          marginLeft: 10,
          marginRight: 10,
          paddingTop: 20,
          paddingBottom: 20,
          backgroundColor: 'transparent',
          boxBackgroundColor: '#262626', //'#ffffff', //  '#96ceb4',
          scrollBarHandleColor: '#666666',
          autoHideScrollbar: true
        });
        lModalPanel.fileDialogPanel.panels.push(lModalPanel.fileDialogPanel.contentScrollPanel);
        for (var li = 0, lc = cFilePresets.presets.length; li < lc; li++) {
          var lPresetPanel = new cPanel({
            align: eAlign.eTop,
            height: 70,
            marginBottom: 4,
            backgroundColor: 'transparent',
            onClick: function() {
              this.stopBubble = true;
              var lPresetIndex = this.presetIndex;
              setTimeout(function() {
                lThis.screen.panel.removePanel(lModalPanel);
                var lFilePreset = cFilePresets.presets[lPresetIndex];
                Model.loadFile(lFilePreset);
                lThis.viewWorldPanel.reloadWorld();
                lThis.viewChangesPanel.reloadWorld();
                lThis.viewEvaluatePanel.reloadWorld();
                lThis.viewMultiversePanel.resetMultiverse();
                lThis.panelTabMenu.selectTabIndex(0);
              }, 10);
            }
          });
          lModalPanel.fileDialogPanel.contentScrollPanel.panelBox.panels.push(lPresetPanel);
          lPresetPanel.presetIndex = li;
          var lHTMLContainerPanel = new cPanel({
            align: eAlign.eLeft,
            width: 70,
            marginRight: 4,
            backgroundColor: '#444444'
          });
          lPresetPanel.panels.push(lHTMLContainerPanel);
          if (cFilePresets.presets[li].html != '') {
            var lHTMLDoc = '<!DOCTYPE html>\n' + '<html>\n' + '<head>\n' + '<style>\n' + 'body {\n' + '  margin: 0px;\n' + '  border: 0px;\n' + '  padding: 0px;\n' + '  background-color: #ffffff;\n' + '  font-family: Calibri, Arial, helvetica, sans-serif;\n' + '  -moz-user-select: -moz-none;\n' + '  -khtml-user-select: none;\n' + '  -webkit-user-select: none;\n' + '  -ms-user-select: none;\n' + '  user-select: none;\n' + '}\n' + cFilePresets.presets[li].project.css + '\n' + '</style>\n' + '</head>\n' + '<body>' + cFilePresets.presets[li].project.html + '\n' + '</body>\n' + '</html>';
            var lPresetHTMLPanel = new cIFramePanel({
              align: eAlign.eClient,
              iFrameHTML : lHTMLDoc,
              supportScroll : false,
              zoom : 0.2 // 0.25
            });
            lHTMLContainerPanel.panels.push(lPresetHTMLPanel);
            var lHTMLOverlayPanel = new cPanel({
              align: eAlign.eClient,
              backgroundColor: 'transparant',
              onClick: function() {
                this.stopBubble = true;
                var lPresetIndex = this.presetIndex;
                setTimeout(function() {
                  lThis.screen.panel.removePanel(lModalPanel);
                  var lFilePreset = cFilePresets.presets[lPresetIndex];
                  Model.loadFile(lFilePreset);
                  lThis.viewWorldPanel.reloadWorld();
                  lThis.viewChangesPanel.reloadWorld();
                  lThis.viewEvaluatePanel.reloadWorld();
                  lThis.viewMultiversePanel.resetMultiverse();
                  lThis.panelTabMenu.selectTabIndex(0);
                }, 10);
              }
            });
            lHTMLContainerPanel.panels.push(lHTMLOverlayPanel);
            lHTMLOverlayPanel.presetIndex = li;
          }
          var lPresetLabelPanel = new cPanel({
            align: eAlign.eClient,
            paddingLeft: 8,
            paddingRight: 8,
            paddingTop: 20,
            backgroundColor: '#444444',
            color: '#eeeeee',
            fontSize: 24,
            textAlign: eTextAlign.eLeft,
            innerHTML: cLib.textToHTML(cFilePresets.presets[li].project.name)
          });
          lPresetPanel.panels.push(lPresetLabelPanel);
        };
        lModalPanel.contentPanel.rerender();
      }
    });
    this.panelTopMenu.panels.push(this.panelTopMenuFile);
    this.panelTopMenuClear = new cPanel({
      align: eAlign.eLeft,
      shape: cPanel.cShapeRoundRect,
      width: 118,
      marginLeft: 8, 
      marginTop: 8,
      marginBottom: 8,
      paddingTop: 2,
      border: 1,
      borderColor: '#262626',
      borderRadius: 16,
      backgroundColor: '#262626', 
      color: '#ffffff',
      fontSize: 30,
      textAlign: eTextAlign.eCenter,
      innerHTML: 'CLEAR',
      onClick: function() {
        this.stopBubble = true;
        var lModalPanel = new clsModalPanel({
          onClick: function() {
            setTimeout(function() {
              lThis.screen.panel.removePanel(lModalPanel);
            }, 10);
          }
        });
        lThis.screen.panel.appendPanel(lModalPanel);
        lModalPanel.clearPanel = new cPanel({
          align: eAlign.eCenter, //eAlign.eCenterVertical,
          shape: cPanel.cShapeRoundRect,
          width: 640,
          height: 300,
          border: 1,
          borderColor: '#262626',
          borderRadius: 16,
          backgroundColor: '#262626', 
          onClick: function() {
            this.stopBubble = true;
          }
        });
        lModalPanel.contentPanel.panels.push(lModalPanel.clearPanel);
        lModalPanel.clearPanel.headerPanel = new cPanel({
          align: eAlign.eTop,
          height: 50,
          paddingLeft: 20,
          backgroundColor: '#444444', 
          color: '#eeeeee',
          fontSize: 36,
          innerHTML: 'Clear project'
        });
        lModalPanel.clearPanel.panels.push(lModalPanel.clearPanel.headerPanel);
        lModalPanel.clearPanel.bottomPanel = new cPanel({
          align: eAlign.eBottom,
          height: 70,
          paddingLeft: 20,
          backgroundColor: '#444444'
        });
        lModalPanel.clearPanel.panels.push(lModalPanel.clearPanel.bottomPanel);
        lModalPanel.clearPanel.bottomPanel.buttonPanel = new cPanel({
          align: eAlign.eCenterVertical,
          width: 420,
          backgroundColor: 'transparent'
        });
        lModalPanel.clearPanel.bottomPanel.panels.push(lModalPanel.clearPanel.bottomPanel.buttonPanel);
        lModalPanel.clearPanel.bottomPanel.buttonPanel.okButton = new cPanel({
          align: eAlign.eLeft,
          shape: cPanel.cShapeRoundRect,
          width: 200,
          marginTop: 10,
          marginBottom: 10,
          padding: 2,
          backgroundColor: '#262626',
          border: 1,
          borderColor: '#262626',
          borderRadius: 16,
          color: '#eeeeee',
          fontSize: 36,
          textAlign: eTextAlign.eCenter,
          innerHTML: 'OK',
          onClick: function() {
            this.stopBubble = true;
            lThis.screen.panel.removePanel(lModalPanel);
            setTimeout(function() {
              Model.ClearAll();
              lThis.viewWorldPanel.reloadWorld();
              lThis.viewChangesPanel.reloadWorld();
              lThis.viewEvaluatePanel.reloadWorld();
              lThis.viewMultiversePanel.resetMultiverse();
              lThis.panelTabMenu.selectTabIndex(0);
            }, 10);
          }
        });
        lModalPanel.clearPanel.bottomPanel.buttonPanel.panels.push(lModalPanel.clearPanel.bottomPanel.buttonPanel.okButton);
        lModalPanel.clearPanel.bottomPanel.buttonPanel.cancelButton = new cPanel({
          align: eAlign.eLeft,
          shape: cPanel.cShapeRoundRect,
          width: 200,
          marginLeft: 20,
          marginTop: 10,
          marginBottom: 10,
          padding: 2,
          backgroundColor: '#262626',
          border: 1,
          borderColor: '#262626',
          borderRadius: 16,
          color: '#eeeeee',
          fontSize: 36,
          textAlign: eTextAlign.eCenter,
          innerHTML: 'CANCEL',
          onClick: function() {
            this.stopBubble = true;
            setTimeout(function() {
              lThis.screen.panel.removePanel(lModalPanel);
            }, 10);
          }
        });
        lModalPanel.clearPanel.bottomPanel.buttonPanel.panels.push(lModalPanel.clearPanel.bottomPanel.buttonPanel.cancelButton);
        lModalPanel.clearPanel.messagePanel = new cPanel({
          align: eAlign.eClient,
          padding: 20,
          backgroundColor: '#262626',
          color: '#eeeeee',
          fontSize: 32,
          innerHTML: 
            'Would you like to start with a new empty project?<br />\n' +
            '<span style="font-size: 20px;">All contents in "world", "changes" and "evaluate" will be cleared.</span>'
        });
        lModalPanel.clearPanel.panels.push(lModalPanel.clearPanel.messagePanel);
        lModalPanel.contentPanel.rerender();
      }
    });
    this.panelTopMenu.panels.push(this.panelTopMenuClear);
    this.panelTopMenuSaveAs = new cPanel({
      align: eAlign.eLeft,
      shape: cPanel.cShapeRoundRect,
      width: 110,
      marginLeft: 8, 
      marginTop: 8,
      marginBottom: 8,
      paddingTop: 2,
      border: 1,
      borderColor: '#262626',
      borderRadius: 16,
      backgroundColor: '#262626', 
      color: '#ffffff',
      fontSize: 30,
      textAlign: eTextAlign.eCenter,
      innerHTML: 'SAVE',
      onClick: function() {
        this.stopBubble = true;
        var lModalPanel = new clsModalPanel({
          onClick: function() {
            setTimeout(function() {
              lThis.screen.panel.removePanel(lModalPanel);
            }, 10);
          }
        });
        lThis.screen.panel.appendPanel(lModalPanel);
        var lDownloadAttributeSupported = ("download" in document.createElement("a"));
        if (lDownloadAttributeSupported) {
          lModalPanel.windowPanel = new cPanel({
            align: eAlign.eCenter, //eAlign.eCenterVertical,
            shape: cPanel.cShapeRoundRect,
            width: 640,
            height: 480,
            border: 1,
            borderColor: '#262626',
            borderRadius: 16,
            backgroundColor: '#262626', 
            onClick: function() {
              this.stopBubble = true;
            }
          });
          lModalPanel.contentPanel.panels.push(lModalPanel.windowPanel);
          lModalPanel.windowPanel.headerPanel = new cPanel({
            align: eAlign.eTop,
            height: 50,
            paddingLeft: 20,
            backgroundColor: '#444444', 
            color: '#eeeeee',
            fontSize: 36,
            innerHTML: 'Download project to your PC'
          });
          lModalPanel.windowPanel.panels.push(lModalPanel.windowPanel.headerPanel);
          lModalPanel.windowPanel.bottomPanel = new cPanel({
            align: eAlign.eBottom,
            height: 70,
            paddingLeft: 20,
            backgroundColor: '#444444'
          });
          lModalPanel.windowPanel.panels.push(lModalPanel.windowPanel.bottomPanel);
          lModalPanel.windowPanel.bottomPanel.buttonPanel = new cPanel({
            align: eAlign.eCenterVertical,
            width: 420,
            backgroundColor: 'transparent'
          });
          lModalPanel.windowPanel.bottomPanel.panels.push(lModalPanel.windowPanel.bottomPanel.buttonPanel);
          lModalPanel.windowPanel.bottomPanel.buttonPanel.okButton = new cPanel({
            align: eAlign.eLeft,
            shape: cPanel.cShapeRoundRect,
            width: 200,
            marginTop: 10,
            marginBottom: 10,
            padding: 2,
            backgroundColor: '#262626',
            border: 1,
            borderColor: '#262626',
            borderRadius: 16,
            color: '#eeeeee',
            fontSize: 36,
            textAlign: eTextAlign.eCenter,
            innerHTML: 'OK',
            onClick: function() {
              var lFileName = lModalPanel.windowPanel.clientPanel.fileNamePanel.inputPanel.getValue();
              if (lFileName != '') {
                this.stopBubble = true;
                lThis.screen.panel.removePanel(lModalPanel);
                setTimeout(function() {
                  var download = function(aFilename, aContent) {
                    var a = document.createElement('a');
                    a.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(aContent));
                    a.setAttribute('download', aFilename);
                    a.click();
                  };
                  var lFileName = lModalPanel.windowPanel.clientPanel.fileNamePanel.inputPanel.getValue();
                  download(
                    (lFileName ? lFileName : ''),
                    Model.generateFileContent(lModalPanel.windowPanel.clientPanel.projectPanel.inputPanel.getValue())
                  );
                }, 10);
              }
            }
          });
          lModalPanel.windowPanel.bottomPanel.buttonPanel.panels.push(lModalPanel.windowPanel.bottomPanel.buttonPanel.okButton);
          lModalPanel.windowPanel.bottomPanel.buttonPanel.cancelButton = new cPanel({
            align: eAlign.eLeft,
            shape: cPanel.cShapeRoundRect,
            width: 200,
            marginLeft: 20,
            marginTop: 10,
            marginBottom: 10,
            padding: 2,
            backgroundColor: '#262626',
            border: 1,
            borderColor: '#262626',
            borderRadius: 16,
            color: '#eeeeee',
            fontSize: 36,
            textAlign: eTextAlign.eCenter,
            innerHTML: 'CANCEL',
            onClick: function() {
              this.stopBubble = true;
              setTimeout(function() {
                lThis.screen.panel.removePanel(lModalPanel);
              }, 10);
            }
          });
          lModalPanel.windowPanel.bottomPanel.buttonPanel.panels.push(lModalPanel.windowPanel.bottomPanel.buttonPanel.cancelButton);
          lModalPanel.windowPanel.clientPanel = new cPanel({
            align: eAlign.eClient,
            paddingTop: 20,
            backgroundColor: 'transparent'
          });
          lModalPanel.windowPanel.panels.push(lModalPanel.windowPanel.clientPanel);
          lModalPanel.windowPanel.clientPanel.topMessageLabelPanel = new cPanel({
            align: eAlign.eTop,
            height: 120,
            paddingLeft: 20,
            paddingRight: 20,
            backgroundColor: 'transparent',
            color: '#eeeeee',
            fontSize: 26,
            innerHTML: 
              'Enter your project\'s name and the file name you want to save the project to.\n' +
              'The project will be downloaded to your "downloads" folder when you press OK.'
          });
          lModalPanel.windowPanel.clientPanel.panels.push(lModalPanel.windowPanel.clientPanel.topMessageLabelPanel);
          lModalPanel.windowPanel.clientPanel.projectPanel = new cPanel({
            align: eAlign.eTop,
            height: 80,
            backgroundColor: 'transparent'
          });
          lModalPanel.windowPanel.clientPanel.panels.push(lModalPanel.windowPanel.clientPanel.projectPanel);
          lModalPanel.windowPanel.clientPanel.projectPanel.labelPanel = new cPanel({
            align: eAlign.eLeft,
            width: 280,
            padding: 20,
            backgroundColor: 'transparent',
            color: '#eeeeee',
            fontSize: 32,
            textAlign: eTextAlign.eRight,
            innerHTML: 'Project name:'
          });
          lModalPanel.windowPanel.clientPanel.projectPanel.panels.push(lModalPanel.windowPanel.clientPanel.projectPanel.labelPanel);
          lModalPanel.windowPanel.clientPanel.projectPanel.inputPanel = new cTextLineEditPanel({
            align: eAlign.eClient,
            marginTop: 15,
            marginBottom: 15,
            marginRight: 30,
            backgroundColor: '#eeeeee',
            color: '#111111',
            fontSize: 32,
            value: 'My project'
          });
          lModalPanel.windowPanel.clientPanel.projectPanel.panels.push(lModalPanel.windowPanel.clientPanel.projectPanel.inputPanel);
          lModalPanel.windowPanel.clientPanel.fileNamePanel = new cPanel({
            align: eAlign.eTop,
            height: 80,
            backgroundColor: 'transparent'
          });
          lModalPanel.windowPanel.clientPanel.panels.push(lModalPanel.windowPanel.clientPanel.fileNamePanel);
          lModalPanel.windowPanel.clientPanel.fileNamePanel.labelPanel = new cPanel({
            align: eAlign.eLeft,
            width: 280,
            padding: 20,
            backgroundColor: 'transparent',
            color: '#eeeeee',
            fontSize: 32,
            textAlign: eTextAlign.eRight,
            innerHTML: 'Project file name:'
          });
          lModalPanel.windowPanel.clientPanel.fileNamePanel.panels.push(lModalPanel.windowPanel.clientPanel.fileNamePanel.labelPanel);
          lModalPanel.windowPanel.clientPanel.fileNamePanel.inputPanel = new cTextLineEditPanel({
            align: eAlign.eClient,
            marginTop: 15,
            marginBottom: 15,
            marginRight: 30,
            backgroundColor: '#eeeeee',
            color: '#111111',
            fontSize: 32,
            value: 'myproject.psp'
          });
          lModalPanel.windowPanel.clientPanel.fileNamePanel.panels.push(lModalPanel.windowPanel.clientPanel.fileNamePanel.inputPanel);
        } else {
          lModalPanel.windowPanel = new cPanel({
            align: eAlign.eCenter, //eAlign.eCenterVertical,
            shape: cPanel.cShapeRoundRect,
            width: 700,
            height: 360,
            border: 1,
            borderColor: '#262626',
            borderRadius: 16,
            backgroundColor: '#262626', 
            onClick: function() {
              this.stopBubble = true;
            }
          });
          lModalPanel.contentPanel.panels.push(lModalPanel.windowPanel);
          lModalPanel.windowPanel.headerPanel = new cPanel({
            align: eAlign.eTop,
            height: 50,
            paddingLeft: 20,
            backgroundColor: '#444444', 
            color: '#eeeeee',
            fontSize: 36,
            innerHTML: 'Save project as...&nbsp&nbsp&nbsp;<span style="font-size: 28px; color: #cc9999;">not supported in your browser</span>'
          });
          lModalPanel.windowPanel.panels.push(lModalPanel.windowPanel.headerPanel);
          lModalPanel.windowPanel.bottomPanel = new cPanel({
            align: eAlign.eBottom,
            height: 70,
            paddingLeft: 20,
            backgroundColor: '#444444'
          });
          lModalPanel.windowPanel.panels.push(lModalPanel.windowPanel.bottomPanel);
          lModalPanel.windowPanel.bottomPanel.buttonPanel = new cPanel({
            align: eAlign.eCenterVertical,
            width: 420,
            backgroundColor: 'transparent'
          });
          lModalPanel.windowPanel.bottomPanel.panels.push(lModalPanel.windowPanel.bottomPanel.buttonPanel);
          lModalPanel.windowPanel.bottomPanel.buttonPanel.okButton = new cPanel({
            align: eAlign.eCenterVertical,
            shape: cPanel.cShapeRoundRect,
            width: 200,
            marginTop: 10,
            marginBottom: 10,
            padding: 2,
            backgroundColor: '#262626',
            border: 1,
            borderColor: '#262626',
            borderRadius: 16,
            color: '#eeeeee',
            fontSize: 36,
            textAlign: eTextAlign.eCenter,
            innerHTML: 'OK',
            onClick: function() {
              this.stopBubble = true;
              lThis.screen.panel.removePanel(lModalPanel);
            }
          });
          lModalPanel.windowPanel.bottomPanel.buttonPanel.panels.push(lModalPanel.windowPanel.bottomPanel.buttonPanel.okButton);
          lModalPanel.windowPanel.clientPanel = new cPanel({
            align: eAlign.eClient,
            paddingTop: 10,
            backgroundColor: 'transparent'
          });
          lModalPanel.windowPanel.panels.push(lModalPanel.windowPanel.clientPanel);
          lModalPanel.windowPanel.clientPanel.messagePanel = new cPanel({
            align: eAlign.eClient,
            padding: 20,
            backgroundColor: 'transparent',
            color: '#eeeeee',
            fontSize: 28,
            innerHTML: 
              'Sorry, your browser does not support Problem Solver\'s method for downloading files to your PC.<br /><br />\n' +
              'Examples of browsers that support downloading files are Chrome, Firefox and Opera.'
          });
          lModalPanel.windowPanel.clientPanel.panels.push(lModalPanel.windowPanel.clientPanel.messagePanel);
        }
        lModalPanel.contentPanel.rerender();
      }
    });
    this.panelTopMenu.panels.push(this.panelTopMenuSaveAs);
    this.panelTopMenuLoad = new cPanel({
      align: eAlign.eLeft,
      shape: cPanel.cShapeRoundRect,
      width: 120,
      marginLeft: 8, 
      marginTop: 8,
      marginBottom: 8,
      paddingTop: 2,
      border: 1,
      borderColor: '#262626',
      borderRadius: 16,
      backgroundColor: '#262626', 
      color: '#ffffff',
      fontSize: 30,
      textAlign: eTextAlign.eCenter,
      innerHTML: 'OPEN',
      onClick: function() {
        this.stopBubble = true;
        var lModalPanel = new clsModalPanel({
          onClick: function() {
            setTimeout(function() {
              lThis.screen.panel.removePanel(lModalPanel);
            }, 10);
          }
        });
        lThis.screen.panel.appendPanel(lModalPanel);
        var lLoadSupported = (window.File && window.FileReader && window.FileList && window.Blob);
        if (lLoadSupported) {
          lModalPanel.windowPanel = new cPanel({
            align: eAlign.eCenter, //eAlign.eCenterVertical,
            shape: cPanel.cShapeRoundRect,
            width: 700,
            height: 480,
            border: 1,
            borderColor: '#262626',
            borderRadius: 16,
            backgroundColor: '#262626', 
            onClick: function() {
              this.stopBubble = true;
            }
          });
          lModalPanel.contentPanel.panels.push(lModalPanel.windowPanel);
          lModalPanel.windowPanel.headerPanel = new cPanel({
            align: eAlign.eTop,
            height: 50,
            paddingLeft: 20,
            backgroundColor: '#444444', 
            color: '#eeeeee',
            fontSize: 36,
            innerHTML: 'Load Problem Solver project from disk'
          });
          lModalPanel.windowPanel.panels.push(lModalPanel.windowPanel.headerPanel);
          lModalPanel.windowPanel.bottomPanel = new cPanel({
            align: eAlign.eBottom,
            height: 70,
            paddingLeft: 20,
            backgroundColor: '#444444'
          });
          lModalPanel.windowPanel.panels.push(lModalPanel.windowPanel.bottomPanel);
          lModalPanel.windowPanel.bottomPanel.buttonPanel = new cPanel({
            align: eAlign.eCenterVertical,
            width: 420,
            backgroundColor: 'transparent'
          });
          lModalPanel.windowPanel.bottomPanel.panels.push(lModalPanel.windowPanel.bottomPanel.buttonPanel);
          lModalPanel.windowPanel.bottomPanel.buttonPanel.okButton = new cPanel({
            align: eAlign.eLeft,
            shape: cPanel.cShapeRoundRect,
            width: 200,
            marginTop: 10,
            marginBottom: 10,
            padding: 2,
            backgroundColor: '#999999', // '#262626',
            border: 1,
            borderColor: '#999999', // '#262626',
            borderRadius: 16,
            color: '#eeeeee',
            fontSize: 36,
            textAlign: eTextAlign.eCenter,
            innerHTML: 'OK',
            onClick: function() {
              this.stopBubble = true;
              if (lModalPanel.windowPanel.clientPanel.fileLoadPanel.fileAsObject !== null) {
                lThis.screen.panel.removePanel(lModalPanel);
                setTimeout(function() {
                  Model.loadFile(lModalPanel.windowPanel.clientPanel.fileLoadPanel.fileAsObject);
                  lThis.viewWorldPanel.reloadWorld();
                  lThis.viewChangesPanel.reloadWorld();
                  lThis.viewEvaluatePanel.reloadWorld();
                  lThis.viewMultiversePanel.resetMultiverse();
                  lThis.panelTabMenu.selectTabIndex(0);
                }, 10);
              }
            }
          });
          lModalPanel.windowPanel.bottomPanel.buttonPanel.panels.push(lModalPanel.windowPanel.bottomPanel.buttonPanel.okButton);
          lModalPanel.windowPanel.bottomPanel.buttonPanel.cancelButton = new cPanel({
            align: eAlign.eLeft,
            shape: cPanel.cShapeRoundRect,
            width: 200,
            marginLeft: 20,
            marginTop: 10,
            marginBottom: 10,
            padding: 2,
            backgroundColor: '#262626',
            border: 1,
            borderColor: '#262626',
            borderRadius: 16,
            color: '#eeeeee',
            fontSize: 36,
            textAlign: eTextAlign.eCenter,
            innerHTML: 'CANCEL',
            onClick: function() {
              this.stopBubble = true;
              setTimeout(function() {
                lThis.screen.panel.removePanel(lModalPanel);
              }, 10);
            }
          });
          lModalPanel.windowPanel.bottomPanel.buttonPanel.panels.push(lModalPanel.windowPanel.bottomPanel.buttonPanel.cancelButton);
          lModalPanel.windowPanel.clientPanel = new cPanel({
            align: eAlign.eClient,
            paddingTop: 20,
            backgroundColor: 'transparent'
          });
          lModalPanel.windowPanel.panels.push(lModalPanel.windowPanel.clientPanel);
          lModalPanel.windowPanel.clientPanel.topMessageLabelPanel = new cPanel({
            align: eAlign.eTop,
            height: 100,
            paddingLeft: 20,
            paddingRight: 20,
            backgroundColor: 'transparent',
            color: '#eeeeee',
            fontSize: 26,
            innerHTML: 
              'Select a Problem Solver project file that you want to import.\n' +
              'The project file will be imported into Problem Solver when you press OK.'
          });
          lModalPanel.windowPanel.clientPanel.panels.push(lModalPanel.windowPanel.clientPanel.topMessageLabelPanel);
          lModalPanel.windowPanel.clientPanel.fileLoadPanel = new clsFileLoadPanel({
            align: eAlign.eTop,
            height: 80,
            paddingLeft: 40,
            paddingTop: 20,
            backgroundColor: 'transparent',
            color: '#eeeeee',
            fontSize: 32,
            onSelectFile: function(aSuccess) {
              var lImported = false;
              if (aSuccess) {
                if ((lModalPanel.windowPanel.clientPanel.fileLoadPanel.fileLoaded) && 
                    (lModalPanel.windowPanel.clientPanel.fileLoadPanel.fileContent != '')) {
                  var lFile = null;
                  try {
                    lFile = eval('(' + lModalPanel.windowPanel.clientPanel.fileLoadPanel.fileContent + ')');
                  } catch (e) {
                    lFile = null;
                  }
                  if (lFile && (lFile.application) && (lFile.application.name === "ProblemSolver") && (lFile.project)) {
                    lModalPanel.windowPanel.clientPanel.fileLoadPanel.fileAsObject = lFile;
                    lModalPanel.windowPanel.clientPanel.projectNamePanel.valuePanel.setInnerHTML(lFile.project.name ? lFile.project.name : '');
                    lImported = true;
                  }
                }
              }
              if (lImported) {
                lModalPanel.windowPanel.bottomPanel.buttonPanel.okButton.setBackgroundColor('#262626');
                lModalPanel.windowPanel.bottomPanel.buttonPanel.okButton.setBorderColor('#262626');
                lModalPanel.windowPanel.clientPanel.statusMessageLabelPanel.setInnerHTML(
                  '<span style="color: #66ee66;">Successfully recognized file as a Problem Solver project.\n' +
                  'Click OK to import file into Problem Solver.</span>'
                );
              } else {
                lModalPanel.windowPanel.clientPanel.fileLoadPanel.fileAsObject = null;
                lModalPanel.windowPanel.clientPanel.projectNamePanel.valuePanel.setInnerHTML('');
                lModalPanel.windowPanel.clientPanel.fileLoadPanel.fileLoaded = false;
                lModalPanel.windowPanel.clientPanel.fileLoadPanel.fileContent = '';
                lModalPanel.windowPanel.bottomPanel.buttonPanel.okButton.setBackgroundColor('#999999');
                lModalPanel.windowPanel.bottomPanel.buttonPanel.okButton.setBorderColor('#999999');
                lModalPanel.windowPanel.clientPanel.statusMessageLabelPanel.setInnerHTML(
                  '<span style="color: #ee6666;">Error: Failed to read file as an Problem Solver project.\n' +
                  'Please select a file that was created with Problem Solver.</span>'
                );
              }
            }
          });
          lModalPanel.windowPanel.clientPanel.fileLoadPanel.fileAsObject = null;
          lModalPanel.windowPanel.clientPanel.panels.push(lModalPanel.windowPanel.clientPanel.fileLoadPanel);
          lModalPanel.windowPanel.clientPanel.projectNamePanel = new cPanel({
            align: eAlign.eTop,
            height: 70,
            backgroundColor: 'transparent'
          });
          lModalPanel.windowPanel.clientPanel.panels.push(lModalPanel.windowPanel.clientPanel.projectNamePanel);
          lModalPanel.windowPanel.clientPanel.projectNamePanel.labelPanel = new cPanel({
            align: eAlign.eLeft,
            width: 280,
            padding: 15,
            backgroundColor: 'transparent',
            color: '#eeeeee',
            fontSize: 32,
            textAlign: eTextAlign.eRight,
            innerHTML: 'Project name:'
          });
          lModalPanel.windowPanel.clientPanel.projectNamePanel.panels.push(lModalPanel.windowPanel.clientPanel.projectNamePanel.labelPanel);
          lModalPanel.windowPanel.clientPanel.projectNamePanel.valuePanel = new cPanel({
            align: eAlign.eClient,
            padding: 15,
            backgroundColor: 'transparent',
            color: '#eeeeee',
            fontSize: 32,
            innerHTML: ''
          });
          lModalPanel.windowPanel.clientPanel.projectNamePanel.panels.push(lModalPanel.windowPanel.clientPanel.projectNamePanel.valuePanel);
          lModalPanel.windowPanel.clientPanel.statusMessageLabelPanel = new cPanel({
            align: eAlign.eBottom,
            height: 80,
            paddingLeft: 20,
            paddingRight: 20,
            backgroundColor: 'transparent',
            color: '#eeeeee',
            fontSize: 26,
            innerHTML: ''
          });
          lModalPanel.windowPanel.clientPanel.panels.push(lModalPanel.windowPanel.clientPanel.statusMessageLabelPanel);
        } else {
          lModalPanel.windowPanel = new cPanel({
            align: eAlign.eCenter, //eAlign.eCenterVertical,
            shape: cPanel.cShapeRoundRect,
            width: 700,
            height: 360,
            border: 1,
            borderColor: '#262626',
            borderRadius: 16,
            backgroundColor: '#262626', 
            onClick: function() {
              this.stopBubble = true;
            }
          });
          lModalPanel.contentPanel.panels.push(lModalPanel.windowPanel);
          lModalPanel.windowPanel.headerPanel = new cPanel({
            align: eAlign.eTop,
            height: 50,
            paddingLeft: 20,
            backgroundColor: '#444444', 
            color: '#eeeeee',
            fontSize: 36,
            innerHTML: 'Load project from disk&nbsp&nbsp&nbsp;<span style="font-size: 28px; color: #cc9999;">not supported</span>'
          });
          lModalPanel.windowPanel.panels.push(lModalPanel.windowPanel.headerPanel);
          lModalPanel.windowPanel.bottomPanel = new cPanel({
            align: eAlign.eBottom,
            height: 70,
            paddingLeft: 20,
            backgroundColor: '#444444'
          });
          lModalPanel.windowPanel.panels.push(lModalPanel.windowPanel.bottomPanel);
          lModalPanel.windowPanel.bottomPanel.buttonPanel = new cPanel({
            align: eAlign.eCenterVertical,
            width: 420,
            backgroundColor: 'transparent'
          });
          lModalPanel.windowPanel.bottomPanel.panels.push(lModalPanel.windowPanel.bottomPanel.buttonPanel);
          lModalPanel.windowPanel.bottomPanel.buttonPanel.okButton = new cPanel({
            align: eAlign.eCenterVertical,
            shape: cPanel.cShapeRoundRect,
            width: 200,
            marginTop: 10,
            marginBottom: 10,
            padding: 2,
            backgroundColor: '#262626',
            border: 1,
            borderColor: '#262626',
            borderRadius: 16,
            color: '#eeeeee',
            fontSize: 36,
            textAlign: eTextAlign.eCenter,
            innerHTML: 'OK',
            onClick: function() {
              this.stopBubble = true;
              lThis.screen.panel.removePanel(lModalPanel);
            }
          });
          lModalPanel.windowPanel.bottomPanel.buttonPanel.panels.push(lModalPanel.windowPanel.bottomPanel.buttonPanel.okButton);
          lModalPanel.windowPanel.clientPanel = new cPanel({
            align: eAlign.eClient,
            paddingTop: 10,
            backgroundColor: 'transparent'
          });
          lModalPanel.windowPanel.panels.push(lModalPanel.windowPanel.clientPanel);
          lModalPanel.windowPanel.clientPanel.messagePanel = new cPanel({
            align: eAlign.eClient,
            padding: 20,
            backgroundColor: 'transparent',
            color: '#eeeeee',
            fontSize: 28,
            innerHTML: 
              'Sorry, your browser does not support Problem Solver\'s method for loading files from your PC.<br /><br />\n' +
              'Consider updating your browser to the newest version (or trying another browser).'
          });
          lModalPanel.windowPanel.clientPanel.panels.push(lModalPanel.windowPanel.clientPanel.messagePanel);
        }
        lModalPanel.contentPanel.rerender();
      }
    });
    this.panelTopMenu.panels.push(this.panelTopMenuLoad);
    this.panelTopMenuLogoBetaAndCopyright = new cPanel({
      align: eAlign.eRight,
      width: 200,
      marginTop: 6,
      marginRight: 12,
      backgroundColor: 'transparent',
      color: '#ffffff',
      fontSize: 18,
      textAlign: eTextAlign.eRight,
      innerHTML: 
        '<i>v0.01 Beta</i><br />\n' +
        '&copy; 2014 Complexity.zone'
    });
    this.panelTopMenu.panels.push(this.panelTopMenuLogoBetaAndCopyright);
    this.panelTopMenuAbout = new cPanel({
      align: eAlign.eRight,
      shape: cPanel.cShapeRoundRect,
      width: 120,
      marginRight: 8, 
      marginTop: 8,
      marginBottom: 8,
      paddingTop: 2,
      border: 1,
      borderColor: '#262626',
      borderRadius: 16,
      backgroundColor: '#262626', 
      color: '#ffffff',
      fontSize: 30,
      textAlign: eTextAlign.eCenter,
      innerHTML: 'ABOUT',
      onClick: function() {
        this.stopBubble = true;
        var lModalPanel = new clsModalPanel({
          onClick: function() {
            setTimeout(function() {
              lThis.screen.panel.removePanel(lModalPanel);
            }, 10);
          }
        });
        lThis.screen.panel.appendPanel(lModalPanel);
        lModalPanel.dialogPanel = new cPanel({
          align: eAlign.eCenterVertical,
          shape: cPanel.cShapeRoundRect,
          width: 800,
          marginTop: 80,
          marginBottom: 80,
          border: 1,
          borderColor: '#262626',
          borderRadius: 16,
          backgroundColor: '#262626', 
          onClick: function() {
            this.stopBubble = true;
          }
        });
        lModalPanel.contentPanel.panels.push(lModalPanel.dialogPanel);
        lModalPanel.dialogPanel.headerPanel = new cPanel({
          align: eAlign.eTop,
          height: 50,
          paddingLeft: 20,
          backgroundColor: '#444444', 
          color: '#eeeeee',
          fontSize: 36,
          innerHTML: 'About Problem Solver'
        });
        lModalPanel.dialogPanel.panels.push(lModalPanel.dialogPanel.headerPanel);
        lModalPanel.dialogPanel.bottomPanel = new cPanel({
          align: eAlign.eBottom,
          height: 70,
          paddingLeft: 20,
          backgroundColor: '#444444'
        });
        lModalPanel.dialogPanel.panels.push(lModalPanel.dialogPanel.bottomPanel);
        lModalPanel.dialogPanel.bottomPanel.buttonPanel = new cPanel({
          align: eAlign.eCenterVertical,
          width: 420,
          backgroundColor: 'transparent'
        });
        lModalPanel.dialogPanel.bottomPanel.panels.push(lModalPanel.dialogPanel.bottomPanel.buttonPanel);
        lModalPanel.dialogPanel.bottomPanel.buttonPanel.closeButton = new cPanel({
          align: eAlign.eCenterVertical,
          shape: cPanel.cShapeRoundRect,
          width: 200,
          marginLeft: 10,
          marginTop: 10,
          marginBottom: 10,
          padding: 2,
          backgroundColor: '#262626',
          border: 1,
          borderColor: '#262626',
          borderRadius: 16,
          color: '#eeeeee',
          fontSize: 36,
          textAlign: eTextAlign.eCenter,
          innerHTML: 'CLOSE',
          onClick: function() {
            this.stopBubble = true;
            setTimeout(function() {
              lThis.screen.panel.removePanel(lModalPanel);
            }, 10);
          }
        });
        lModalPanel.dialogPanel.bottomPanel.buttonPanel.panels.push(lModalPanel.dialogPanel.bottomPanel.buttonPanel.closeButton);
        lModalPanel.dialogPanel.contentScrollPanel = new cScrollboxPanel({
          align: eAlign.eClient,
          panelBoxRoundedBorder: false,
          marginLeft: 10,
          marginRight: 10,
          paddingTop: 20,
          paddingBottom: 20,
          backgroundColor: 'transparent',
          boxBackgroundColor: '#262626', //'#ffffff', //  '#96ceb4',
          scrollBarHandleColor: '#666666',
          autoHideScrollbar: true
        });
        lModalPanel.dialogPanel.panels.push(lModalPanel.dialogPanel.contentScrollPanel);
        lModalPanel.dialogPanel.messagePanel = new cPanel({
          align: eAlign.eTop,
          height: 600,
          padding: 20,
          backgroundColor: '#262626',
          color: '#eeeeee',
          fontSize: 18,
          innerHTML: 
            '<span style="font-style: italic;">A solution looking for a problem</span><br />\n' +
            '<br />\n' +
            'Problem Solver is an online programmable "game tree viewer", a web application for those who are looking for a tool to analyse puzzles, problems and algorithms.\n' +
            'Simple puzzles (see the puzzles in the "examples" menu) can be modelled in Problem Solver, and it\'s solutions are visible in the multiverse viewer.\n' +
            '<br />\n'
        });
        lModalPanel.dialogPanel.contentScrollPanel.panelBox.panels.push(lModalPanel.dialogPanel.messagePanel);
        lModalPanel.contentPanel.rerender();
      }
    });
    this.panelTopMenu.panels.push(this.panelTopMenuAbout);    
    /*
    nice colors:
    #fffee9 : nice off-white
    #ffeead : shade of beige
    #E6E2AF : shade of beige
    #B3B088 : shade of beige
    #52A75B : green
    */
    this.panelTabMenu = new cTabMenuPanel({
      align: eAlign.eClient,
      color: '#ffffff',
      backgroundColor: '#262626',
      border: 0,
      padding: 0,
      panelHTML: 'Welcome',
      closeImage: this.screen.getImageClone(cProblemSolverApp.cImageClose),
      tabs: [
        {id: 'world', backgroundColor: '#98D47E', image: this.screen.getImageClone(cProblemSolverApp.cImageWorld)}, //#b4da81
        {id: 'changes', backgroundColor: '#96ceb4', image: this.screen.getImageClone(cProblemSolverApp.cImageChanges)}, //#96ceb4
        {id: 'evaluate', backgroundColor: '#FFAE3C', image: this.screen.getImageClone(cProblemSolverApp.cImageEvaluate)}, //#96ceb4
        {id: 'multiverse', backgroundColor: '#777777', image: this.screen.getImageClone(cProblemSolverApp.cImageMultiverse)} //#BD8D46 //#ffcc5c
      ]
    });
    this.screenPanel.panels.push(this.panelTabMenu);
    this.mainPagePanel = new cMainPagePanel({
      align: eAlign.eClient,
      backgroundColor: 'transparent',
      screen: this.screen,
      viewWorldImageId: cProblemSolverApp.cImageViewWorldImage,
      viewChangesImageId: cProblemSolverApp.cImageViewChangesImage,
      viewEvaluateImageId: cProblemSolverApp.cImageViewEvaluateImage,
      viewMultiverseImageId: cProblemSolverApp.cImageViewMultiverseImage,
      onWorldClick: function() {
        this.panelTabMenu.selectTabIndex(0);
      },
      onWorldClick_This: this,
      onChangesClick: function() {
        this.panelTabMenu.selectTabIndex(1);
      },
      onChangesClick_This: this,
      onEvaluateClick: function() {
        this.panelTabMenu.selectTabIndex(2);
      },
      onEvaluateClick_This: this,
      onMultiverseClick: function() {
        this.panelTabMenu.selectTabIndex(3);
      },
      onMultiverseClick_This: this
    });
    this.panelTabMenu.rootClientPanel.panels.push(this.mainPagePanel);
    this.viewWorldPanel = new cViewWorldPanel({
      align: eAlign.eClient,
      backgroundColor: 'transparent',
      screen: this.screen,
      closeImage: cProblemSolverApp.cImageClose,
      refreshImage: cProblemSolverApp.cImageRefresh,
      addImage: cProblemSolverApp.cImageAdd,
      deleteImage: cProblemSolverApp.cImageDelete,
      upImage: cProblemSolverApp.cImageUp,
      downImage: cProblemSolverApp.cImageDown
    });
    this.panelTabMenu.getPanelById('world').panels.push(this.viewWorldPanel);
    this.viewChangesPanel = new cViewChangesPanel({
      align: eAlign.eClient,
      backgroundColor: 'transparent',
      screen: this.screen,
      closeImage: cProblemSolverApp.cImageClose,
      refreshImage: cProblemSolverApp.cImageRefresh,
      addImage: cProblemSolverApp.cImageAdd,
      deleteImage: cProblemSolverApp.cImageDelete,
      upImage: cProblemSolverApp.cImageUp,
      downImage: cProblemSolverApp.cImageDown
    });
    this.panelTabMenu.getPanelById('changes').panels.push(this.viewChangesPanel);
    this.viewEvaluatePanel = new cViewEvaluatePanel({
      align: eAlign.eClient,
      backgroundColor: 'transparent',
      screen: this.screen,
      closeImage: cProblemSolverApp.cImageClose,
      refreshImage: cProblemSolverApp.cImageRefresh,
      addImage: cProblemSolverApp.cImageAdd,
      deleteImage: cProblemSolverApp.cImageDelete,
      upImage: cProblemSolverApp.cImageUp,
      downImage: cProblemSolverApp.cImageDown
    });
    this.panelTabMenu.getPanelById('evaluate').panels.push(this.viewEvaluatePanel);
    this.viewMultiversePanel = new cViewMultiversePanel({
      align: eAlign.eClient,
      backgroundColor: 'transparent',
      screen: this.screen,
      closeImage: cProblemSolverApp.cImageClose,
      refreshImage: cProblemSolverApp.cImageRefresh,
      addImage: cProblemSolverApp.cImageAdd,
      deleteImage: cProblemSolverApp.cImageDelete,
      upImage: cProblemSolverApp.cImageUp,
      downImage: cProblemSolverApp.cImageDown,
      futureAxisImage: cProblemSolverApp.cFutureAxis,
      optionsAxisImage: cProblemSolverApp.cOptionsAxis,
      expandImage: cProblemSolverApp.cExpand,
      changesImage: cProblemSolverApp.cImageChanges,
      evaluateImage: cProblemSolverApp.cImageEvaluate
    });
    var lMultiverseTab = this.panelTabMenu.getPanelById('multiverse');
    lMultiverseTab.panels.push(this.viewMultiversePanel);
    lMultiverseTab.onVisible = this.viewMultiversePanel.onVisible;
    lMultiverseTab.onVisibleCallee = this.viewMultiversePanel;
    lMultiverseTab.onInvisible = this.viewMultiversePanel.onInvisible;
    lMultiverseTab.onInvisibleCallee = this.viewMultiversePanel;
    /*
    this.panelTabMenu_System = new cPanel({
      align: eAlign.eClient,
      backgroundColor: 'transparent',
      innerHTML: 'system'
    });
    this.panelTabMenu.getPanelById('system').panels.push(this.panelTabMenu_System);
    */
    /*
    this.viewHelpPanel = new cViewHelpPanel({
      align: eAlign.eClient,
      backgroundColor: 'transparent',
      screen: this.screen
    });
    this.panelTabMenu.getPanelById('help').panels.push(this.viewHelpPanel);
    */
    this.screen.onResize();
  });
}
cProblemSolverApp.deriveFrom(cApp);
(function() {
  cProblemSolverApp.cImageProblemSolver = 1;
  cProblemSolverApp.cImageViewWorldImage = 2;
  cProblemSolverApp.cImageViewChangesImage = 3;
  cProblemSolverApp.cImageViewEvaluateImage = 4;
  cProblemSolverApp.cImageViewMultiverseImage = 5;
  cProblemSolverApp.cImageWorld = 6;
  cProblemSolverApp.cImageChanges = 7;
  cProblemSolverApp.cImageEvaluate = 8;
  cProblemSolverApp.cImageAgent = 9;
  cProblemSolverApp.cImageMultiverse = 10;
  cProblemSolverApp.cImageQuestion = 11;
  cProblemSolverApp.cImageClose = 12;
  cProblemSolverApp.cImageRefresh = 13;
  cProblemSolverApp.cImageAdd = 14;
  cProblemSolverApp.cImageDelete = 15;
  cProblemSolverApp.cImageUp = 16;
  cProblemSolverApp.cImageDown = 17;
  cProblemSolverApp.cFutureAxis = 18;
  cProblemSolverApp.cOptionsAxis = 19;
  cProblemSolverApp.cExpand = 20;
  cProblemSolverApp.prototype.resourcesLoaded = false;
  cProblemSolverApp.prototype.actionSandboxIFrame = null;
  cProblemSolverApp.prototype.actionSandboxIFrame_Initialized = false;
  cProblemSolverApp.prototype.evaluationSandboxIFrame = null;
  cProblemSolverApp.prototype.evaluationSandboxIFrame_Initialized = false;
  cProblemSolverApp.prototype.screenPanel = null;
  cProblemSolverApp.prototype.panelTopMenu = null;
  cProblemSolverApp.prototype.panelTopMenuLogo = null;
  cProblemSolverApp.prototype.panelTopMenuFile = null;
  cProblemSolverApp.prototype.panelTopMenuClear = null;
  cProblemSolverApp.prototype.panelTopMenuAbout = null;
  cProblemSolverApp.prototype.panelTopMenuLogoBetaAndCopyright = null;
  cProblemSolverApp.prototype.panelTabMenu = null;
  cProblemSolverApp.prototype.mainPagePanel = null;
  cProblemSolverApp.prototype.viewWorldPanel = null;
  cProblemSolverApp.prototype.viewChangesPanel = null;
  cProblemSolverApp.prototype.viewEvaluatePanel = null;
  cProblemSolverApp.prototype.viewMultiversePanel = null;
  cProblemSolverApp.prototype.onResize = function() {
  };
  cProblemSolverApp.prototype.onPostResize = function() {
  };
  cProblemSolverApp.prototype.onMouseDown = function() {
    if (this.resourcesLoaded) {
    }
  };
  cProblemSolverApp.prototype.onMouseMove = function() {
    if (this.resourcesLoaded) {
    }
  };
  cProblemSolverApp.prototype.onMouseUp = function() {
    if (this.resourcesLoaded) {
    }
  };
  cProblemSolverApp.prototype.updateSandboxInitialized = function() {
    if (this.actionSandboxIFrame_Initialized && this.evaluationSandboxIFrame_Initialized) {
      if (cFilePresets.presets.length > 0) {
        Model.loadFile(cFilePresets.presets[0]); // cFilePresets.presets.length - 1]); // 0
        this.viewWorldPanel.reloadWorld();
        this.viewChangesPanel.reloadWorld();
        this.viewEvaluatePanel.reloadWorld();
      }
    }
  };
})();
var lApp = null;
function Main() {
  /*
  var lfullscreen = true;  
  if (lfullscreen) {
    lApp = new cProblemSolverApp(document.body);
  } else {
    document.body.innerHTML =
      '<p></p>' +
      '<div id="oob" style="position: static; overflow:auto; width:700px; height:600px; border:10px solid blue;"></div>';
    lApp = new cProblemSolverApp(cDOM.getElement("oob"));
  }
  */
  lApp = new cProblemSolverApp(document.body);
}
cDOM.registerEvent(window, 'load', Main);
