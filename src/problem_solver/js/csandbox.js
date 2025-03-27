include("ccommon.js");
include("cbase.js");
include("cdataarray.js");
include("cdataitem.js");
include("cagent.js");

/**
  * Class cSandbox
  */
// Instance class constructor:
function cSandbox(aProperties) {
  // Call the base constructor:
  cBase.call(this);

  this.loaded = false;
  this.iFrame = null;
  this.onInitComplete = function() {};
}
// Class inheritance setup:
cSandbox.deriveFrom(cBase);
// Static class constructor:
(function() {

  cSandbox.prototype.loaded = false;
  cSandbox.prototype.iFrame = null;
  cSandbox.prototype.onInitComplete = function() {};
  
  cSandbox.prototype.init = function(aIFrame, aCSS, aScriptTags, aOnInitComplete) {
    this.onInitComplete = aOnInitComplete ? ((typeof aOnInitComplete != 'undefined') ? aOnInitComplete : function() {}) : function() {};
    this.loaded = false;
    this.iFrame = aIFrame;
    if (this.iFrame) {
      var lHTMLDoc = 
        '<!DOCTYPE html>\n' +
        '<html>\n' +
        '<head>\n' +
        '<style>\n' +
        'body {\n' +
        '  background-color: #ff00ff;\n' +
        '  font-family: Calibri, Arial, helvetica, sans-serif;\n' +
        '}\n' +
        '<\/style>\n' +
        '<style>\n' +
        aCSS + '\n' + 
        '<\/style>\n' +
        aScriptTags + '\n' +
        '<script type="text/javascript">\n' + 
        '  var _memory = "";\n' + 
        '  var _memories = {};\n' + 
        '  function _runCode(aCode) {\n' + 
        '    var func = eval(\n' + 
        '      "(function() { " + \n' +
        '        aCode + " " + \n' +
        '      "})"\n' +
        '    );\n' + 
        '    func.call(window);\n' + 
        '  }\n' + 
        '  function forgetAll() {\n' + 
        '    _memory = "";\n' + 
        '    _memories = {};\n' + 
        '  }\n' + 
        '  function remember(aMomentName) {\n' + 
        '    if(aMomentName) {\n' + 
        '      _memories[aMomentName] = $("body").html();\n' + 
        '    } else {\n' + 
        '      _memory = $("body").html();\n' + 
        '    }\n' + 
        '  }\n' + 
        '  function recall(aMomentName) {\n' + 
        '    if(aMomentName && _memories[aMomentName]) {\n' + 
        '      $("body").html(_memories[aMomentName]);\n' + 
        '    } else {\n' + 
        '      $("body").html(_memory);\n' + 
        '    }\n' + 
        '  }\n' + 
        '  function spawn() {\n' + 
        '    parent.Model.spawnFuture($("body").html());\n' + 
        '  }\n' + 
        '  function _init() {\n' + 
        '    parent.Model.onIFrameReady();\n' + 
        '  }\n' + 
        '<\/script>\n' +
        '<\/head>\n' +
        '<body onload="_init()">\n' + 
         '<\/body>\n' +
        '<\/html>';    
      this.iFrame.setContent(lHTMLDoc);
    }
  };
  
  cSandbox.prototype.onIFrameReady = function() {
    if (!this.loaded) { // it's possible that this get called multiple times, for example when iFrame is repositioned.
      this.loaded = true;
      this.onInitComplete();
    }
  };
  
  // TODO: this should be made better, not just a syntax check.
  // Simply do a try-catch within execution, and display error in iFrame.
  cSandbox.prototype.syntaxCheck = function(aCode) {
    var lSyntaxError = "";
    if (aCode != "") {
      try {
        eval(
        '  function forgetAll() {\n' + 
        '  }\n' + 
        '  function remember() {\n' + 
        '  }\n' + 
        '  function recall() {\n' + 
        '  }\n' + 
        '  function spawn() {\n' + 
        '  }\n' + 
        '  xyxyxyx();\n' + // force an exception, but not an instance of SyntaxError
        aCode); 
      } catch (e) {
        if (e instanceof SyntaxError) {
          lSyntaxError = e.message;
        }
      }
    }
    return lSyntaxError;
  };

  cModel.prototype.spawnFuture = function(aHTML) {
    pSpawnedWorlds.push(aHTML);
  };

  cModel.prototype.runWorldInSandbox = function(aWorldBodyHTML, aCode) {
    if (pSandboxLoaded) {
      this.iFrame.setCSS(this.worldCSS);
      this.iFrame.setBody(aWorldBodyHTML);
      var lWindow = this.sandbox.getWindow();
      lWindow._runCode('remember();\n' + aCode);
    }
  };
  
  cModel.prototype.resetSandboxChooseSet = function() {
    if (pSandboxLoaded) {
      var lWindow = this.sandbox.getWindow();
      lWindow.$.fn.choose.resetChooseStack();
    }
  };
  
  cModel.prototype.getSandboxChooseSet = function() {
    if (pSandboxLoaded) {
      var lWindow = this.sandbox.getWindow();
      return lWindow.$.fn.choose.chooseStack;
    }
    return [];
  };

  cModel.prototype.getSandboxBodyHTML = function() {
    if (pSandboxLoaded) {
      return this.sandbox.getBody();
    }
    return '';
  };
  

})();

// Global singleton instance
var Model = new cModel();
  
