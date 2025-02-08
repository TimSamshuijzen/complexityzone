// Copyright 2012 Tim Samshuijzen.

include("cbase.js");

// Enum eAlign
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
// Enum eTextAlign
var eTextAlign = {
  eLeft: 0,
  eRight: 1,
  eCenter: 2
};

/*
  * Class cPanel
  */
// Instance class constructor:
function cPanel(aProperties) {
  // Call the base constructor:
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
// Class inheritance setup:
cPanel.deriveFrom(cBase);
// Static class constructor:
(function() {
  cPanel.cShapeRectangle = 1;
  cPanel.cShapeRoundRect = 2;
  cPanel.cShapeCircleRect = 3;
  cPanel.cImageNoRepeat = 1;
  cPanel.cImageRepeat = 2;
  cPanel.cImageRepeatX = 3;
  cPanel.cImageRepeatY = 4;
  cPanel.largestInnerId = 0;
  // Public static virtual members (properties):
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
          //lWithinBorder = false;??
        } else if (this.shape == cPanel.cShapeCircleRect) {
          //lWithinBorder = false;??
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
      //this.element.style.visibility = this.visible ? 'visible' : 'hidden';
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
        //no need, unless changed
        //this.element.style.borderRadius = '0px';
        //this.element.style.MozBorderRadius = '0px';
        //this.element.style.webkitBorderRadius = '0px';
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
        //this.element.style.whiteSpace = 'normal';
      }
      if (this.textSelectable) {
        this.element.style.userSelect = "text";
        this.element.style.webkitUserSelect = "text";
        this.element.style.MozUserSelect = "text";
      }
      
      if (this.textAlign == eTextAlign.eLeft) {
        //this.element.style.textAlign = 'left';
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
    //this.element.style.visibility = this.visible ? 'visible' : 'hidden';
  };
  cPanel.prototype.hide = function() {
    this.visible = false;
    if (this.element != null) {
      this.element.style.display = this.visible ? 'block' : 'none';
    }
    //this.element.style.visibility = this.visible ? 'visible' : 'hidden';
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
