include("ccommon.js");
include("cbase.js");

/**
  * Class cFuture
  */
// Instance class constructor:
function cFuture(aProperties) {
  // Call the base constructor:
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
// Class inheritance setup:
cFuture.deriveFrom(cBase);
// Static class constructor:
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
  
