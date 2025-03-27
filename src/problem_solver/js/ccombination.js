include("ccommon.js");
include("cbase.js");


function cCombination(n, k, data) {
  this.n = n;
  this.k = k;
  this.data = [];

  if (n < 0 || k < 0) { // normally n >= k
    throw 'Negative parameter in constructor';
  }
  if ((typeof data != 'undefined') && (data.length == k)) {
    for (var li = 0; li < k; li++) {
      this.data.push(data[li]);
    }
  } else {
    for (var li = 0; li < k; li++) {
      this.data.push(li);
    }
  }
}
// Class inheritance setup:
cCombination.deriveFrom(cBase);
// Static class constructor:
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
    var a = this.n;
    var b = this.k;
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
    cDebug.log('', 'number of combinations = ' + lNumberOfCombinations);
    for (var li = 0; li < 10; li++) {
      cDebug.log('', 'combination ' + li + ' = ' + lCombination.element(li).toString());
    }
  };
  
})();

//cDebug.debug = true;
//cCombination.unitTest();
//cDebug.debug = false;

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
    for (var li = 0; li < kn; li++) {
      lCombination.data.push(li);
    }
    this.combinations.push(lCombination);
  }
}
// Class inheritance setup:
cCombinationRange.deriveFrom(cBase);
// Static class constructor:
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
    var lCount = 0;
    for (var kn = this.kFrom; kn <= this.kTo; kn++) {
      lCount += cCombination.numberOfCombinations(this.n, kn);
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
    cDebug.debug = true;
    cDebug.log('', 'number of combinations = ' + lNumberOfCombinations);
    for (var li = 0; li < 100; li++) {
      cDebug.log('', 'combination ' + li + ' = ' + lCombinationRange.element(li).toString());
    }
  };  
  
})();

//cDebug.debug = true;
//cCombinationRange.unitTest();
//cDebug.debug = false;
