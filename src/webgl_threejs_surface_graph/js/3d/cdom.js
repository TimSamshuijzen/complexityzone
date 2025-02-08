// Copyright 2012 Tim Samshuijzen.

// Static class cDOM.
var cDOM = {
  getElement: function(id) {
    return document.getElementById(id);
  },
  registerEvent: function(aElement, aEventName, aFunction, aScope) {
    var lScopedEventHandler = aScope ? function(aEvent) {
      aEvent = aEvent || window.event;
      // var lTarget = aEvent.target || aEvent.srcElement;
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
    if (aEvent.pageX || aEvent.pageX == 0) { // Firefox
      lCoordinates.x = aEvent.pageX;
      lCoordinates.y = aEvent.pageY;
    } else if (aEvent.clientX || aEvent.clientY)     {
      lCoordinates.x = aEvent.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
      lCoordinates.y = aEvent.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    } else if (aEvent.offsetX || aEvent.offsetX == 0) { // Opera
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

