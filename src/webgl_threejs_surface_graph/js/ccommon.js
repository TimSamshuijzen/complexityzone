function include() {
  // This dummy function is to be able to include individual files without compiler.
}

if (typeof Object.create !== 'function') {
  (function () {
    var F = function () {};
    Object.create = function (o) {
      if (arguments.length > 1) {
        throw new Error('Second argument not supported');
      }
      if (o === null) {
        F.prototype = Object.prototype;
      } else {
        if (typeof o !== 'object') {
          throw new TypeError('Argument must be an object');
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
  };
};

// Static class cLib.
var cLib = {
  deepCopy: function(aObject) {
    if ((aObject == null) || (typeof(aObject) !== 'object')) {
      return aObject;
    }
    //make sure the returned object has the same prototype as the original
    var lClone = Object.create(aObject.constructor.prototype);
    for (var lKey in aObject){
      lClone[lKey] = this.deepCopy(aObject[lKey]);
    }
    return lClone;
  },
  trunc: function(aValue) {
    return aValue | 0; // a neat alternative to truncating a number with parseInt().
  },
  evalJSON: function(aJSON) {
    var lResult = {};
    try {
      lResult = eval('(' + aJSON + ')');
    } catch(err){
      lResult = {};
    }
    return lResult;
  },
  animate: function(aStartValue, aEndValue, aCompleteDuration, aAnimateFunc, aCompletionFunc, aScope) {
    if (aCompleteDuration) {
      var lStartDate = new Date();
      var lStartTimeMs = lStartDate.getTime();  
      function doAnimate() {
        var lDate = new Date();
        var lTimeMs = lDate.getTime();
        lCompletionFactor = (lTimeMs - lStartTimeMs) / aCompleteDuration;
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

// Static class cConfig.
var cConfig = {
  version: '1.0.1',
  options: {}
};

// Static class cDebug.
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

