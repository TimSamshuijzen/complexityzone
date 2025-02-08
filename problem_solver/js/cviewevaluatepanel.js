// Copyright 2012 Tim Samshuijzen.

include("ccommon.js");
include("cpanel.js");
include("cmasterdetailpanel.js");
include("ctabmenupanel.js");
include("cmodel.js");
include("cscrollboxpanel.js");

/**
  * Class cViewEvaluatePanel
  */
// Instance class constructor:
function cViewEvaluatePanel(aProperties) {
  // Call the base constructor:
  cPanel.call(this, aProperties);
  
  var lThis = this;
  
  this.screen = aProperties.screen;

  this.viewEvaluate = new cAutoSpanPanel({
    align: eAlign.eClient,
    backgroundColor: 'transparent'
  });
  this.panels.push(this.viewEvaluate);

  this.viewEvaluate_Edit_Master_Evaluations = new cPanel({
    align: eAlign.eClient,
    backgroundColor: 'transparent'
  });
  this.viewEvaluate.panels.push(this.viewEvaluate_Edit_Master_Evaluations);

  this.viewEvaluate_Edit_Master_Evaluations_Header = new cPanel({
    align: eAlign.eTop,
    height: 40,
    backgroundColor: 'transparent',
    innerHTML: '<b>Evaluations (JavaScript/jQuery)</b>'
  });
  this.viewEvaluate_Edit_Master_Evaluations.panels.push(this.viewEvaluate_Edit_Master_Evaluations_Header);
  
  this.viewEvaluate_Edit_Master_Evaluations_Edit = new cTextEditPanel({
    align: eAlign.eClient,
    color: '#dddddd',
    backgroundColor: '#333333',
    fontSize: 16,
    value: '',
    onChange: function() {
      Model.setEvaluations(lThis.viewEvaluate_Edit_Master_Evaluations_Edit.getValue());
    }
  });
  this.viewEvaluate_Edit_Master_Evaluations.panels.push(this.viewEvaluate_Edit_Master_Evaluations_Edit);  
  
  this.viewEvaluate_Edit_Detail = new cPanel({
    align: eAlign.eClient,
    backgroundColor: 'transparent'
  });
  this.viewEvaluate.panels.push(this.viewEvaluate_Edit_Detail);    
  
  this.viewEvaluate_Edit_Detail_Header = new cPanel({
    align: eAlign.eTop,
    height: 40,
    backgroundColor: 'transparent',
    innerHTML: '<b>Problem Solver Evaluations API documentation</b>'
  });
  this.viewEvaluate_Edit_Detail.panels.push(this.viewEvaluate_Edit_Detail_Header);

  this.viewEvaluate_Edit_Detail_View = new cPanel({
    align: eAlign.eClient,
    backgroundColor: 'transparent'
  });
  this.viewEvaluate_Edit_Detail.panels.push(this.viewEvaluate_Edit_Detail_View);
  
  this.viewEvaluate_Edit_Detail_View_scrollPanel = new cScrollboxPanel({
    align: eAlign.eClient,
    backgroundColor: 'transparent',
    boxBackgroundColor: '#ffeead', //'#ffffff', //  '#96ceb4',
    scrollBarHandleColor: '#666666',
    autoHideScrollbar: true
  });
  this.viewEvaluate_Edit_Detail_View.panels.push(this.viewEvaluate_Edit_Detail_View_scrollPanel);
  
  /*
    payoff, loss, gain, score, like
    goal, lethal, illegal
    score(like, half-life);
  */
  this.viewEvaluate_Edit_Detail_View_scrollPanel_content = new cPanel({
    align: eAlign.eTop,
    height: 2000,
    padding: 20,
    backgroundColor: 'transparent',
    textSelectable: true,
    innerHTML:
      '<div style="position: static; font-size: 32px; font-weight: bold;">\n' +
      '  Evaluations\n' +
      '</div>\n' +
      'The "evaluations" define a world\'s score, whether a world is favorable or not, whether a goal has been reached,\n' +
      'or whether a world is illegal (as with games or puzzles). These are known as the static rules of the game.\n' +
      'It is similar to the <a href="http://en.wikipedia.org/wiki/Evaluation_function" target="_blank">evaluation function</a> or "payoff function" in game theory.\n' +
      'As you will notice in the multiverse viewer, the multiverse usually grows very fast (exponentially),\n' +
      'like many <a href="http://en.wikipedia.org/wiki/Game_tree" target="_blank">game trees</a> do.\n' +
      'The evaluations are <a href="http://en.wikipedia.org/wiki/Heuristic" target="_blank">heuristics</a>\n' +
      'that help limit the growth of the multiverse.\n' +
      'Evaluations help in restricting the number of choices, possibly constraining the path towards a\n' +
      'desirable outcome, making it easier to overview the multiverse and find a favorable path.\n' +
      'Evaluations can also help to highlight good paths, or warn for bad outcomes.\n' +
      'With JavaScript code you can evaluate a world (world = HTML document) as follows:\n' +
      '<ol>\n' +
      '  <li>Access the world (HTML document) using DOM and/or jQuery commands, and determine whether the world satisfies some condition.\n' +
      '  <li>Mark the world with any of the built-in evaluation functions (e.g. \n' +
      '      <span style="font-family: \'Courier New\', Courier, monospace;">world.like()</span>).</li>\n' +
      '</ol>\n' +
      '<br />\n' +
      '<br />\n' +
      '<div style="position: static; background-color: #2A2A1A; padding: 10px;\n' + //#BF2D10
      ' font-family: \'Courier New\', Courier, monospace; font-size: 18px;\n' + 
      ' color: #dddddd;">\n' +
      '  world.goal( goalDescription )\n' +
      '</div>\n' +
      '<div style="position: static; background-color: #cccccc; border: 2px solid #2A2A1A; padding: 10px; font-size: 16px;">\n' +
      '  The world.goal() method tells Problem Solver to mark the current world as qualifying as having achieved the goal.\n' + 
      '  The search expansion ends at such a goal world, and further expansion from this world is disabled.\n' + 
      '  A goal-world is colored <span style="background-color: #339933;">&nbsp;green&nbsp;</span> in the multiverse viewer.\n' + 
      '  The optional <span style="font-family: \'Courier New\', Courier, monospace; background-color: #2A2A1A;\n' +
      '    color: #dddddd;">goalDescription</span> argument is a string to describe the goal, which is shown in the multiverse viewer.\n' +
      '  \n' +
      '  <br />\n' + 
      '  <br />\n' + 
      '  <b>Example:</b>\n' + 
      '  <div style="position: static; margin-left: 20px;">\n' + 
      '    The example code below will determine whether there are 8 queens on the chessboard and, if so, mark the world as a goal.\n' +
      '  </div>\n' +
      '  <div style="position: static; margin-left: 20px; background-color: #333333; padding: 10px;\n' + 
      '     font-family: \'Courier New\', Courier, monospace; font-size: 16px;\n' + 
      '     color: #dddddd;">\n' +
      '    if ($("chessboard queen").length == 8) {<br />\n' +
      '    &nbsp;&nbsp;world.goal("Solution!");<br />\n' +
      '    }\n' +
      '  </div>\n' +
      '</div>\n' +
      '<br />\n' +
      '<br />\n' +
      '<div style="position: static; background-color: #2A2A1A; padding: 10px;\n' + //#BF2D10
      ' font-family: \'Courier New\', Courier, monospace; font-size: 18px;\n' + 
      ' color: #dddddd;">\n' +
      '  world.illegal( illegalReason )\n' +
      '</div>\n' +
      '<div style="position: static; background-color: #cccccc; border: 2px solid #2A2A1A; padding: 10px; font-size: 16px;">\n' +
      '  The world.goal() method tells Problem Solver to mark the current world as illegal.\n' + 
      '  The search expansion ends at such am illegal world, and further expansion from this world is disabled.\n' + 
      '  An illegal world is colored <span style="background-color: #ff4444;">&nbsp;red&nbsp;</span> in the multiverse viewer.\n' + 
      '  The optional <span style="font-family: \'Courier New\', Courier, monospace; background-color: #2A2A1A;\n' +
      '    color: #dddddd;">illegalReason</span> argument is a string to describe the reason why the world is illegal, which is shown in the multiverse viewer.<br />\n' +
      '  <span style="font-weight: bold;">*</span> Note that the illegal worlds can be ommitted from the multiverse viewer by disabling the "hide/ignore illegal world" within the "options" panel.\n' +
      '  \n' +
      '  <br />\n' + 
      '  <br />\n' + 
      '  <b>Example:</b>\n' + 
      '  <div style="position: static; margin-left: 20px;">\n' + 
      '    The example code below will determine whether there is more than one piece on any position on the chessboard and, if so, mark the world as a illegal.\n' +
      '  </div>\n' +
      '  <div style="position: static; margin-left: 20px; background-color: #333333; padding: 10px;\n' + 
      '     font-family: \'Courier New\', Courier, monospace; font-size: 16px;\n' + 
      '     color: #dddddd;">\n' +
      '    if ($("chessboard position piece").length > 1) {<br />\n' +
      '    &nbsp;&nbsp;world.illegal("A position is not allowed to hold more than one piece.");<br />\n' +
      '    }\n' +
      '  </div>\n' +
      '</div>\n' +
      '<br />\n' +
      '<br />\n' +
      '<div style="position: static; background-color: #2A2A1A; padding: 10px;\n' + //#BF2D10
      ' font-family: \'Courier New\', Courier, monospace; font-size: 18px;\n' + 
      ' color: #dddddd;">\n' +
      '  world.like( likeScore )\n' +
      '</div>\n' +
      '<div style="position: static; background-color: #cccccc; border: 2px solid #2A2A1A; padding: 10px; font-size: 16px;">\n' +
      '  The world.like() method tells Problem Solver to increment the like-score of the current world.\n' + 
      '  The optional <span style="font-family: \'Courier New\', Courier, monospace; background-color: #2A2A1A;\n' +
      '    color: #dddddd;">likeScore</span> argument is the like-score to add to the world\'s current like-score.\n' +
      '  The default value is "1".\n' +
      '  The initial like-score of a world is zero. If a world\'s like-score is non-zero, then its value is shown\n' + 
      '  in the multiverse viewer. If the like-score is positive, then the background is colored <span style="background-color: #FFAE3C;">orange</span>.\n' + 
      '  If the like-score is negative, then the background is colored <span style="background-color: #FFBBBB;">&nbsp;light&nbsp;red&nbsp;</span>.<br />\n' + 
      '  <span style="font-weight: bold;">*</span> Note that when the search method in the multiverse-viewer is set to "high like-score first", then auto-search\n' + 
      '  function will follow the path of the world\'s highest score.\n' + 
      '  <br />\n' + 
      '  <br />\n' + 
      '  <b>Example:</b>\n' + 
      '  <div style="position: static; margin-left: 20px;">\n' + 
      '    The example code below will determine the number of "person" tags with the class set to "happy" and set this as the like-score.\n' +
      '  </div>\n' +
      '  <div style="position: static; margin-left: 20px; background-color: #333333; padding: 10px;\n' + 
      '     font-family: \'Courier New\', Courier, monospace; font-size: 16px;\n' + 
      '     color: #dddddd;">\n' +
      '    world.like($(\'person.happy\').length);\n' +
      '  </div>\n' +
      '</div>\n' +
      '<br />\n'
 });
 this.viewEvaluate_Edit_Detail_View_scrollPanel.panelBox.panels.push(this.viewEvaluate_Edit_Detail_View_scrollPanel_content);
  
  

}
// Class inheritance setup:
cViewEvaluatePanel.deriveFrom(cPanel);
// Static class constructor:
(function() {

  cViewEvaluatePanel.prototype.screen = null;

  cViewEvaluatePanel.prototype.viewEvaluate = null;
  cViewEvaluatePanel.prototype.viewEvaluate_Edit_Master_Evaluations = null;
  cViewEvaluatePanel.prototype.viewEvaluate_Edit_Master_Evaluations_Header = null;
  cViewEvaluatePanel.prototype.viewEvaluate_Edit_Master_Evaluations_Edit = null;
  cViewEvaluatePanel.prototype.viewEvaluate_Edit_Detail = null;
  cViewEvaluatePanel.prototype.viewEvaluate_Edit_Detail_Header = null;
  cViewEvaluatePanel.prototype.viewEvaluate_Edit_Detail_View = null;
  cViewEvaluatePanel.prototype.viewEvaluate_Edit_Detail_View_scrollPanel = null;
  cViewEvaluatePanel.prototype.viewEvaluate_Edit_Detail_View_scrollPanel_content = null;

  cViewEvaluatePanel.prototype.render = function(aParentPanel, aParentElement, aClientRect) {
    cPanel.prototype.render.call(this, aParentPanel, aParentElement, aClientRect);
    if (this.element != null) {
      var lDetailHeight = 1000 + ((800000 / (this.viewEvaluate_Edit_Detail_View_scrollPanel.panelBox.getInnerWidth() + 1)) | 0);
      if (this.viewEvaluate_Edit_Detail_View_scrollPanel_content.height != lDetailHeight) {
        this.viewEvaluate_Edit_Detail_View_scrollPanel_content.setHeight(lDetailHeight);
        this.viewEvaluate_Edit_Detail_View_scrollPanel.rerender();
      }
    }
  };

  cViewEvaluatePanel.prototype.reloadWorld = function() {
    if (this.viewEvaluate_Edit_Master_Evaluations_Edit) {
      this.viewEvaluate_Edit_Master_Evaluations_Edit.setValue(Model.getEvaluations());
    }
  };
  
})();
  
