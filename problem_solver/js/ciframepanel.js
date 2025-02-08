// Copyright 2012 Tim Samshuijzen.

include("cbase.js");
include("cpanel.js");

/*
  * Class cIFramePanel
  */
// Instance class constructor:
function cIFramePanel(aProperties) {
  // Call the base constructor:

  cPanel.call(this, aProperties);

  //this.textSelectable = aProperties ? (typeof aProperties.textSelectable != 'undefined' ? aProperties.textSelectable : true) : true;
  this.iFrameElement = null;
  this.iFrameHTML = aProperties ? (typeof aProperties.iFrameHTML != 'undefined' ? aProperties.iFrameHTML : '') : '';
  this.iFrameHTMLWritten = '';
  this.supportScroll = aProperties ? (typeof aProperties.supportScroll != 'undefined' ? aProperties.supportScroll : true) : true;
  this.zoom = aProperties ? (aProperties.zoom > 0 ? aProperties.zoom : 1) : 1;
  //this.hidden = aProperties ? (typeof aProperties.hidden != 'undefined' ? aProperties.hidden : false) : false;
}
// Class inheritance setup:
cIFramePanel.deriveFrom(cPanel);
// Static class constructor:
(function() {
  // Public static virtual members (properties):
  cIFramePanel.prototype.iFrameElement = null;
  cIFramePanel.prototype.iFrameHTML = '';
  cIFramePanel.prototype.iFrameHTMLWritten = '';
  cIFramePanel.prototype.supportScroll = true;
  cIFramePanel.prototype.zoom = 1;
  //cIFramePanel.prototype.hidden = false;
  
  cIFramePanel.prototype.render = function(aParentPanel, aParentElement, aClientRect) {
    cPanel.prototype.render.call(this, aParentPanel, aParentElement, aClientRect);
    if (this.element != null) {
      if (this.iFrameElement == null) {
        this.iFrameElement = document.createElement('iframe');
        this.iFrameElement.id = 'pnl_' + this.instanceId + '_' + this.innerId + '_iframe';
        //this.iFrameElement.style.border = '1px solid black';
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
          //this.iFrameElement.style.visibility = 'hidden';
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
        //lDocument.replaceChild(lDocument.createElement("html"), lDocument.documentElement);
        //lDocument.replaceChild(lDocument.createElement(lDocument.documentElement.tagName), lDocument.documentElement);
        //lDocument.body.innerHTML = this.bodyHTML;
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
    // Assume that we only need to fill the last css
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
