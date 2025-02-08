// Copyright 2012 Tim Samshuijzen.

include("ccommon.js");
include("cbase.js");
include("cfuture.js");
include("cmultiversecolumn.js");

/**
  * Class cMultiverse
  */
  
// Instance class constructor:
function cMultiverse(aProperties) {
  // Call the base constructor:
  cBase.call(this);
  
  this.worldNow = new cFuture();
  this.columns = [];
  this.totalNumberOfFutures = 1;
  this.resetFutures();
}
// Class inheritance setup:
cMultiverse.deriveFrom(cBase);
// Static class constructor:
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
    // TODO: we can do this much faster by direct indexing, because we know all column numbers follow each other.
    for (var ci = 0, cc = this.columns.length; ci < cc; ci++) {
      if (this.columns[ci].columnNumber == aColumnNumber) {
        lResult = this.columns[ci];
        break;
      }
    }
    return lResult;
  };
    

  cMultiverse.prototype.addFuture = function(aFuture, aPast, aFocusColumnNumber) {
    // Add aFuture to aPast's future.
    aPast.futures.push(aFuture);
    aFuture.past = aPast;
    this.totalNumberOfFutures++;
    // Set new level.
    aFuture.level = aPast.level + 1;

    // Prepare lColumnNumber and lColumn for adding aFuture to lColumn.
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
        // Renumber all columns' column numbers.
        for (var ci = (this.columns.length - 1); ci >= lColumnIndex; ci--) {
          var liColumn = this.columns[ci];
          liColumn.columnNumber = liColumn.columnNumber + 1;
        }
      }
      // Create new column and insert.
      lColumn = new cMultiverseColumn({ columnNumber: lColumnNumber });
      this.columns.splice(lColumnIndex, 0, lColumn);
      // Add all pasts to this new column, in order of time.
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
    // Add aFuture to column.
    lColumn.futures.push(aFuture);
    aFuture.multiverseColumns.push(lColumn);
  };

  cMultiverse.prototype.removeFutureColumn = function(aFuture) {
    // Can only remove topmost futures which is not worldNow.
    if ((aFuture.futures.length == 0) && (aFuture.id != this.worldNow.id)) {
      var lColumnNumber = aFuture.multiverseColumns[0].columnNumber;
      var lColumnIndex =  this.indexOfColumnNumber(lColumnNumber);
      if (lColumnIndex >= 0) {
        var lColumn = this.columns[lColumnIndex];
        // Remove this column from futures in the column.
        for (var fi = (lColumn.futures.length - 1); fi >= 0; fi--) {
          var lFuture = lColumn.futures[fi];
          for (var fci = 0, fcc = lFuture.multiverseColumns.length; fci < fcc; fci++) {
            if (lFuture.multiverseColumns[fci].columnNumber == lColumnNumber) {
              lFuture.multiverseColumns.splice(fci, 1);
              if ((lFuture.multiverseColumns.length == 0) && (lFuture.id != this.worldNow.id)) {
                // This future is not present in any other column so can be deleted completely.
                this.totalNumberOfFutures--;
                // Remove this future from the past's future.
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
        // Remove column from this.columns.
        this.columns.splice(lColumnIndex, 1);
        // Renumber columns' column numbers by decrementing the right.
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
  
