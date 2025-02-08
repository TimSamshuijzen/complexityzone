// Copyright 2012 Tim Samshuijzen.

include("ccommon.js");
include("cbase.js");
include("cdataarray.js");
include("cdataitem.js");
include("cfuture.js");
include("cmultiverse.js");
include("cagent.js");

/**
 * Class cModel
 */
// Instance class constructor:
function cModel(aProperties) {
  // Call the base constructor:
  cBase.call(this);

  this.worldCSS = '';
  this.agent = new cAgent();
  var lThis = this;
  // for now we do just one agent
  this.multiverse = new cMultiverse();
  this.actionSandbox = null;
  this.evaluationSandbox = null;
  this.allUndeterminedFutures = [];
  //this.allUndeterminedFutures.push(this.multiverse.worldNow);
  
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

// Class inheritance setup:
cModel.deriveFrom(cBase);
// Static class constructor:
(function() {

  cModel.searchAlgorithms = {
    msaBreadthFirst: 1,
    msaHighScoreFirst: 2,
    msaLeftSideFirst: 3,
    msaRightSideFirst: 4
  };

  cModel.prototype.worldCSS = '';
  //cModel.prototype.agents = []; // for now we do just one agent
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
    // + '  -moz-user-select: -moz-none;\n' + '  -khtml-user-select: none;\n' + '  -webkit-user-select: none;\n' + '  -ms-user-select: none;\n' + '  user-select: none;\n'
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
    //aHTML, aCSS, aActions, aEvaluations
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

    // TODO: get rid of this constant!!!
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
                      // not interesting
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
                    // code error!
                    lContinue = false;
                  }
                }
                if (lContinue) {
                  pSpawnedWorlds = [];
        
                  var lChooseCallStack = this.getActionSandboxChooseCallStack();
                  // todo: do all choices (with an upper limit of say 100)
                  var lContinueChoose = true;
                  while (lContinueChoose) {
                    // This loop loops through all choices.
                    // Start at last call stack, treat it as least significant digit.
                    var si = lChooseCallStack.length - 1;
                    var lAllDone = true;
                    while (si >= 0) {
                      var lChooseCall = lChooseCallStack[si];
                      lChooseCall.choiceIndex++;
                      // The big question: does this communicate back into iFrame? Answer: yes.
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
                                // not interesting
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
                              // code error!
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
                        // code error!
                        lContinueChoose = false;
                        lContinue = false;
                      }
                      pSpawnedWorlds = [];
                    }
                  }
                }
              }
            } else {
              // code error!
              lContinue = false;
            }
          }
          lFuture.futuresDetermined = true;
          if (lFuture.futures.length == 0) {
            if (lFuture.modelData.removeFutureColumn) {
              // we should delete this column.
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

// Global singleton instance
var Model = new cModel();

