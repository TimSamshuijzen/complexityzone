// Copyright 2012 Tim Samshuijzen.

include("cbase.js");
include("cpanel.js");
include("ciframepanel.js");
include("cscrollboxpanel.js");
include("cmodel.js");

/*
  * Class cMainPagePanel
  */
// Instance class constructor:
function cMainPagePanel(aProperties) {
  // Call the base constructor:
  cPanel.call(this, aProperties);

  var lThis = this;
  this.screen = aProperties.screen;
  
  this.scrollPanel = new cScrollboxPanel({
    align: eAlign.eClient,
    backgroundColor: 'transparent',
    boxBackgroundColor: '#262626',
    scrollBarHandleColor: '#666666',
    autoHideScrollbar: true
  });
  this.panels.push(this.scrollPanel);
  
  this.introPanel = new cPanel({
    align: eAlign.eNone,
    left: 0,
    top: 0,
    height: 620,
    width: 620,
    backgroundColor: '#333333',
    padding: 20
  });
  this.scrollPanel.panelBox.panels.push(this.introPanel);
  
  if (aProperties.logoImage)
  {
    this.introLogoPanel = new cPanel({
      align: eAlign.eNone,
      width: 393,
      height: 100,
      backgroundColor: 'transparent',
      image: this.screen.getImageClone(aProperties.logoImage),
      imageStretch: true
    });
    this.introPanel.panels.push(this.introLogoPanel);
  }
  
  this.introTextPanel = new cPanel({
    align: eAlign.eClient,
    //height: 460,
    backgroundColor: '#333333',
    color: '#ffffff',
    innerHTML: 
      'Problem Solver is a novel online problem-solver and problem-analyser for (JavaScript) programmers.\n' +
      'Load examples from the "EXAMPLES" menu\n' +
      'and look at the code in the "world",\n' +
      '"changes" and "evaluate" screens. \n' +
      'By default, Problem Solver is pre-loaded with the "Towers of Hanoi" example.<br />\n' +
      '<b>To see Problem Solver in action, go to the <span style="background-color: #777777;">&nbsp;multiverse&nbsp;</span> viewer and click\n' +
      '"<span style="color: #00bb00;">GO!</span>"</b><br />\n' +
      'Got a puzzle or problem to analyse? Follow these steps:\n' +
      '<ol>\n' +
      '  <li>Describe the <span style="background-color: #88cc66;">&nbsp;world&nbsp;</span> (situation) with HTML/CSS.</li>\n' +
      '  <li>Describe possible <span style="background-color: #88bbaa;">&nbsp;changes&nbsp;</span> using JavaScript/jQuery and the choose() method/plugin.</li>\n' +
      '  <li>Describe how you would <span style="background-color: #FFAE3C;">&nbsp;evaluate&nbsp;</span> a world using JavaScript/jQuery.</li>\n' +
      '  <li>Click <span style="color: #00bb00;">GO!</span> in the <span style="background-color: #777777;">&nbsp;multiverse&nbsp;</span> viewer.</li>\n' +
      '</ol>\n' +
      'You can then explore the "multiverse" to navigate through\n' +
      'the space of all future "worlds",\n' +
      'for all possible combinations of "changes".\n' +
      'Click on any world in the multiverse viewer to see the sequence of changes that preceded.<br />\n' +
      '<br />\n' +
      'In CS and AI this is known as the "game tree".\n' +
      'In Problem Solver this is called the "multiverse".\n'
  });
  this.introPanel.panels.push(this.introTextPanel);
  
  this.worldPanel = new cPanel({
    align: eAlign.eNone,
    left: 0,
    top: 420,
    height: 300,
    width: 300,
    backgroundColor: '#333333'
    //padding: 20,
    //innerHTML: 'World'
  });
  this.scrollPanel.panelBox.panels.push(this.worldPanel);
  
  this.worldPanel.imagePanel = new cPanel({
    align : eAlign.eNone,
    left : 50,
    top : 20,
    width : 200,
    height : 167,
    backgroundColor : 'transparent',
    image: this.screen.getImageClone(aProperties.viewWorldImageId),
    imageStretchWidth: 200,
    imageStretchHeight: 167,
    onClick: function() {
      var lSupportShortCut = false;
      if (lSupportShortCut) {
        aProperties.onWorldClick.call(aProperties.onWorldClick_This);
      }
    }
  });
  this.worldPanel.panels.push(this.worldPanel.imagePanel);

  this.worldPanel.textPanel = new cPanel({
    align : eAlign.eNone,
    left : 20,
    top : 210,
    width : 260,
    height : 100,
    backgroundColor : 'transparent',
    color: '#ffffff',
    fontSize: 19,
    innerHTML: '<span style="font-size: 22px; font-weight: bold;">STEP 1</span><br />Describe the "now" world with HTML and CSS.'
  });
  this.worldPanel.panels.push(this.worldPanel.textPanel);

  this.evaluationPanel = new cPanel({
    align: eAlign.eNone,
    left: 0,
    top: 740,
    height: 300,
    width: 300,
    backgroundColor: '#333333',
    color: '#ffffff'
  });
  this.scrollPanel.panelBox.panels.push(this.evaluationPanel);

  this.evaluationPanel.imagePanel = new cPanel({
    align : eAlign.eNone,
    left : 50,
    top : 20,
    width : 200,
    height : 167,
    backgroundColor : 'transparent',
    image: this.screen.getImageClone(aProperties.viewEvaluateImageId),
    imageStretchWidth: 200,
    imageStretchHeight: 167,
    onClick: function() {
      var lSupportShortCut = false;
      if (lSupportShortCut) {
        aProperties.onEvaluateClick.call(aProperties.onEvaluateClick_This);
      }
    }
  });
  this.evaluationPanel.panels.push(this.evaluationPanel.imagePanel);

  this.evaluationPanel.textPanel = new cPanel({
    align : eAlign.eNone,
    left : 20,
    top : 210,
    width : 260,
    height : 100,
    backgroundColor : 'transparent',
    color: '#ffffff',
    fontSize: 19,
    innerHTML: '<span style="font-size: 22px; font-weight: bold;">STEP 3</span><br />Evaluate a world using JavaScript / jQuery.'
  });
  this.evaluationPanel.panels.push(this.evaluationPanel.textPanel);

  this.actionsPanel = new cPanel({
    align: eAlign.eNone,
    left: 320,
    top: 420,
    height: 300,
    width: 300,
    backgroundColor: '#333333',
    color: '#ffffff'
  });
  this.scrollPanel.panelBox.panels.push(this.actionsPanel);
  
  this.actionsPanel.imagePanel = new cPanel({
    align : eAlign.eNone,
    left : 50,
    top : 20,
    width : 200,
    height : 167,
    backgroundColor : 'transparent',
    image: this.screen.getImageClone(aProperties.viewChangesImageId),
    imageStretchWidth: 200,
    imageStretchHeight: 167,
    onClick: function() {
      var lSupportShortCut = false;
      if (lSupportShortCut) {
        aProperties.onChangesClick.call(aProperties.onChangesClick_This);
      }
    }
  });
  this.actionsPanel.panels.push(this.actionsPanel.imagePanel);

  this.actionsPanel.textPanel = new cPanel({
    align : eAlign.eNone,
    left : 20,
    top : 210,
    width : 260,
    height : 100,
    backgroundColor : 'transparent',
    color: '#ffffff',
    fontSize: 19,
    innerHTML: '<span style="font-size: 22px; font-weight: bold;">STEP 2</span><br />Describe possible changes to a world with JavaScript / jQuery.'
  });
  this.actionsPanel.panels.push(this.actionsPanel.textPanel);

  this.multiversePanel = new cPanel({
    align: eAlign.eNone,
    left: 320,
    top: 740,
    height: 300,
    width: 300,
    backgroundColor: '#333333',
    color: '#ffffff'
  });
  this.scrollPanel.panelBox.panels.push(this.multiversePanel);
  
  this.multiversePanel.imagePanel = new cPanel({
    align : eAlign.eNone,
    left : 50,
    top : 20,
    width : 200,
    height : 167,
    backgroundColor : 'transparent',
    image: this.screen.getImageClone(aProperties.viewMultiverseImageId),
    imageStretchWidth: 200,
    imageStretchHeight: 167,
    onClick: function() {
      var lSupportShortCut = false;
      if (lSupportShortCut) {
        aProperties.onMultiverseClick.call(aProperties.onMultiverseClick_This);
      }
    }
  });
  this.multiversePanel.panels.push(this.multiversePanel.imagePanel);

  this.multiversePanel.textPanel = new cPanel({
    align : eAlign.eNone,
    left : 20,
    top : 210,
    width : 260,
    height : 100,
    backgroundColor : 'transparent',
    color: '#ffffff',
    fontSize: 19,
    innerHTML: '<span style="font-size: 22px; font-weight: bold;">STEP 4</span><br />Click GO! in the multiverse viewer.'
  });
  this.multiversePanel.panels.push(this.multiversePanel.textPanel);
}
// Class inheritance setup:
cMainPagePanel.deriveFrom(cPanel);
// Static class constructor:
(function() {
  // Public static virtual members (properties):
  cMainPagePanel.prototype.screen = null;
  cMainPagePanel.prototype.scrollPanel = null;
  cMainPagePanel.prototype.introPanel = null;
  cMainPagePanel.prototype.introLogoPanel = null;
  cMainPagePanel.prototype.introTextPanel = null;
  cMainPagePanel.prototype.worldPanel = null;
  cMainPagePanel.prototype.evaluationPanel = null;
  cMainPagePanel.prototype.actionsPanel = null;
  cMainPagePanel.prototype.multiversePanel = null;

  cMainPagePanel.prototype.render = function(aParentPanel, aParentElement, aClientRect) {
    cPanel.prototype.render.call(this, aParentPanel, aParentElement, aClientRect);
    if (this.element != null) {
      if (this.scrollPanel.panelBox.getInnerWidth() > 1280) {
        this.worldPanel.left = 640;
        this.worldPanel.top = 0;
        this.actionsPanel.left = 640 + 320;
        this.actionsPanel.top = 0;
        this.evaluationPanel.left = 640;
        this.evaluationPanel.top = 320;
        this.multiversePanel.left = 640 + 320;
        this.multiversePanel.top = 320;
      } else {
        this.worldPanel.left = 0;
        this.worldPanel.top = 640;
        this.actionsPanel.left = 320;
        this.actionsPanel.top = 640;
        this.evaluationPanel.left = 0;
        this.evaluationPanel.top = 960;
        this.multiversePanel.left = 320;
        this.multiversePanel.top = 960;
      }
    }
  };

})();
