
// requires cCombination/cCombinationRange

/** class cCombination
  * Stores a combination of indices.
  */
function cCombination(n, k, data) {
  this.n = n;
  this.k = k;
  this.data = [];

  if (n < 0 || k < 0) { // normally n >= k
    throw 'Negative parameter in constructor';
  }
  if ((typeof data != 'undefined') && (data.length == k)) {
    // Initialize data[] with passed data.
    for (var li = 0; li < k; li++) {
      this.data.push(data[li]);
    }
  } else {
    // Initialize data[] with dummy data.
    for (var li = 0; li < k; li++) {
      this.data.push(li);
    }
  }
}
(function() {
  cCombination.prototype.n = 0;
  cCombination.prototype.k = 0;
  cCombination.prototype.data = [];

  cCombination.prototype.isValid = function() {
    if (this.data.Length != this.k) {
      return false; // corrupted
    }
    for (var li = 0; li < this.k; li++) {
      if ((this.data[li] < 0) || (this.data[li] > this.n - 1)) {
        return false; // value out of range
      }
      for (var lj = li + 1; lj < this.k; lj++) {
        if (this.data[li] >= this.data[lj]) {
          return false; // duplicate or not lexicographic
        }
      }
    }
    return true;
  };

  cCombination.prototype.successor = function() {
    if (this.data[0] == (this.n - this.k)) {
      return null;
    }
    var lResult = new cCombination(this.n, this.k);
    var li;
    for (li = 0; li < this.k; li++) {
      lResult.data[li] = this.data[li];
    }
    for (li = this.k - 1; li > 0 && lResult.data[li] == this.n - this.k + li; li--) {
    }
    lResult.data[li]++;
    for (var lj = li; lj < this.k - 1; lj++) {
      lResult.data[lj + 1] = lResult.data[lj] + 1;
    }
    return lResult;
  };

  cCombination.numberOfCombinations = function(n, k) {
    if ((n < 0) || (k < 0)) {
      throw 'Invalid negative parameter in numberOfCombinations()'; 
      return 0;
    }
    if (n < k) {
      return 0;  // special case
    }
    if (n == k) {
      return 1;
    }
    if (k == 0) { // special case, number of possibilities to select none = 1
      return 1;
    }
    var delta;
    var iMax;
    if (k < n-k) { // ex: Choose(100,3)
      delta = n-k;
      iMax = k;
    } else { // ex: Choose(100,97)
      delta = k;
      iMax = n-k;
    }
    var lResult = delta + 1;
    for (var li = 2; li <= iMax; li++) {
      lResult = (lResult * (delta + li)) / li;
    }
    return lResult;
  };
  
  cCombination.prototype.element = function(aCombinationIndex) {
    lResultData = [];
    for (var li = 0; li < this.k; li++) {
      lResultData.push(0);
    }
    var a = this.n; // number of elements to choose
    var b = this.k; // total number of elements
    var x = (cCombination.numberOfCombinations(this.n, this.k) - 1) - aCombinationIndex; // x is the "dual" of aCombinationIndex
    for (var li = 0; li < this.k; li++) {
      lResultData[li] = this.largestValue(a, b, x); // largest value v, where v < a and vCb < x    
      x = x - cCombination.numberOfCombinations(lResultData[li], b);
      a = lResultData[li];
      b = b - 1;
    }
    for (var li = 0; li < this.k; li++) {
      lResultData[li] = (this.n - 1) - lResultData[li];
    }
    var lResult = new cCombination(this.n, this.k, lResultData);
    return lResult;
  };

  // return largest value v where v < a and  Choose(v,b) <= x
  cCombination.prototype.largestValue = function(a, b, x) {
    var lResult = a - 1;
    while (cCombination.numberOfCombinations(lResult, b) > x) {
      lResult--;
    }
    return lResult;
  };
  
  cCombination.prototype.toString = function() {
    var s = '{ ';
    for (var li = 0; li < this.k; li++) {
      s += this.data[li] + ' ';
    }
    s += '}';
    return s;
  };
  
  cCombination.unitTest = function() {
    var lCombination = new cCombination(52, 5);
    var lNumberOfCombinations = cCombination.numberOfCombinations(52, 5);
    if (typeof console != "undefined") {
      console.log('number of combinations = ' + lNumberOfCombinations);
      for (var li = 0; li < 10; li++) {
        console.log('combination ' + li + ' = ' + lCombination.element(li).toString());
      }
    }
  };
  
})();

/** class cCombinationRange
  * Stores a range of combinations of indices, one for each number choose-set-size.
  */
function cCombinationRange(n, kFrom, kTo) {
  this.n = n;
  this.kFrom = kFrom;
  this.kTo = kTo;
  this.combinations = [];

  if (n < 0 || kFrom < 0 || kTo < 0) { // normally n >= k
    throw 'Negative parameter in constructor';
  }
  if (kFrom > kTo) {
    throw 'invalid arguments';
  }
  for (var kn = kFrom; kn <= kTo; kn++) {
    var lCombination = new cCombination(n, kn);
    // Initialize 
    for (var li = 0; li < kn; li++) {
      lCombination.data[li] = li;
    }
    this.combinations.push(lCombination);
  }
}
(function() {
  cCombinationRange.prototype.n = 0;
  cCombinationRange.prototype.kFrom = 0;
  cCombinationRange.prototype.kTo = 0;
  cCombinationRange.prototype.combinations = [];

  cCombinationRange.numberOfCombinations = function(n, kFrom, kTo) {
    var lResult = 0;
    for (var kn = kFrom; kn <= kTo; kn++) {
      lResult += cCombination.numberOfCombinations(n, kn);
    }
    return lResult;
  };
  
  cCombinationRange.prototype.element = function(aCombinationIndex) {
    var lResult = null;
    var lCIndex = aCombinationIndex;
    var lCount;
    for (var kn = this.kFrom; kn <= this.kTo; kn++) {
      lCount = cCombination.numberOfCombinations(this.n, kn);
      if (lCIndex < lCount) {
        lResult = this.combinations[kn - this.kFrom].element(lCIndex);
        break;
      }
      lCIndex -= lCount;
    }
    return lResult;
  };
  
  cCombinationRange.unitTest = function() {
    var lCombinationRange = new cCombinationRange(8, 3, 5);
    var lNumberOfCombinations = cCombinationRange.numberOfCombinations(8, 3, 5);
    if (typeof console != "undefined") {
      console.log('number of combinations = ' + lNumberOfCombinations);
      for (var li = 0; li < 100; li++) {
        console.log('combination ' + li + ' = ' + lCombinationRange.element(li).toString());
      }
    }
  };  
  
})();

var jChoose = {
  callStack: [],
  callStackIndex: 0, // the nested call index, when code contains multiple calls to choose()
  choose: function(aAtLeast, aAtMost, aListType, aList) {
    var lCallStackElement = {};
    var lAtLeast = (typeof aAtLeast != 'undefined' ? (aAtLeast >= 0 ? aAtLeast : 0) : 0);
    var lAtMost = (typeof aAtMost != 'undefined' ? (aAtMost >= lAtLeast ? aAtMost : lAtLeast) : lAtLeast);
    var lListLength = 0;
    if (aListType == 'jQuery') {
      lListLength = aList.length;
    } else if (aListType == 'array') {
      lListLength = aList.length;
    }
    // For each call to choose a callStack element is created, referred to by jChoose.callStackIndex.
    if (jChoose.callStackIndex > (jChoose.callStack.length - 1)) {
      lCallStackElement = { // stack element is created when called first time
        atLeast: lAtLeast, 
        atMost: lAtMost,
        listType: aListType,
        elementCount: lListLength,
        choiceCount: cCombinationRange.numberOfCombinations(lListLength, lAtLeast, lAtMost),
        choiceIndex: 0,
        validChoice: true
      };
      jChoose.callStack.push(lCallStackElement);
    } else {
      lCallStackElement = jChoose.callStack[jChoose.callStackIndex];
      if (lCallStackElement.elementCount != lListLength) { // this is possible when callStackIndex > 0
        lCallStackElement.choiceCount = cCombinationRange.numberOfCombinations(lCallStackElement.elementCount, lAtLeast, lAtMost);
      }
      lCallStackElement.validChoice = true;
    }
    var lResult = [];
    if (aListType == 'jQuery') {
      lResult = $();
    }
    if (lAtLeast <= lAtMost) {
      if (lCallStackElement.choiceCount > 0) {
        if (lCallStackElement.choiceIndex < lCallStackElement.choiceCount) {
          lCombinationRange = new cCombinationRange(lCallStackElement.elementCount, lAtLeast, lAtMost);
          var lChoice = lCombinationRange.element(lCallStackElement.choiceIndex);
          if (lChoice) {
            for (var ii = 0; ii < lChoice.data.length; ii++) {
              var ei = lChoice.data[ii];
              if (ei < lListLength) {
                if (aListType == 'jQuery') {
                  lResult = lResult.add(aList.eq(ei));
                } else {
                  lResult.push(aList[ei]);
                }
              } else {
                lCallStackElement.validChoice = false;
                break;
              }
            }
          } else {
            lCallStackElement.validChoice = false;
          }
        }
      } else {
        if (lAtLeast > 0) {
          lCallStackElement.validChoice = false;
        }
      }
    } else {
      lCallStackElement.validChoice = false;
    }
    jChoose.callStackIndex++;
    return lResult;
  },
  resetCallStack: function() {
    jChoose.callStack = [];
    jChoose.callStackIndex = 0;
  },
  resetCallStackIndexAndValidChoice: function() {
    jChoose.callStackIndex = 0;
    for (var ci = 0, cc = jChoose.callStack.length; ci < cc; ci++) {
      jChoose.callStack[ci].validChoice = true;
    }
  },
  validChoice: function() {
    for (var ci = 0, cc = jChoose.callStack.length; ci < cc; ci++) {
      if (!(jChoose.callStack[ci].validChoice)) {
        return false;
      }
    }
    return true;
  }
};

Array.prototype.choose = function(aAtLeast, aAtMost) {
  return jChoose.choose(aAtLeast, aAtMost, 'array', this);
};
Array.prototype.chooseOne = function() {
  var lChoice = jChoose.choose(1, 1, 'array', this);
  if (lChoice.length > 0) {
    return lChoice[0];
  }
  return null;
};

(function( $ ) {
  $.fn.choose = function(aAtLeast, aAtMost) {
    return jChoose.choose(aAtLeast, aAtMost, 'jQuery', this);
  };
  $.fn.chooseOne = function() {
    return jChoose.choose(1, 1, 'jQuery', this);
  };
}( jQuery ));
