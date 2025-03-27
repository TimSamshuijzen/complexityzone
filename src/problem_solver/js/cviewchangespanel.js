include("ccommon.js");
include("cpanel.js");
include("cmasterdetailpanel.js");
include("ctabmenupanel.js");
include("cscrollboxpanel.js");
include("cmodel.js");

/**
  * Class cViewChangesPanel
  */
// Instance class constructor:
function cViewChangesPanel(aProperties) {
  // Call the base constructor:
  cPanel.call(this, aProperties);
  
  var lThis = this;
  
  this.screen = aProperties.screen;

  this.viewChanges = new cAutoSpanPanel({
    align: eAlign.eClient,
    backgroundColor: 'transparent'
  });
  this.panels.push(this.viewChanges);

 
  this.viewChanges_Edit_Master_Actions = new cPanel({
    align: eAlign.eClient,
    backgroundColor: 'transparent'
  });
  this.viewChanges.panels.push(this.viewChanges_Edit_Master_Actions);

  this.viewChanges_Edit_Master_Actions_Header = new cPanel({
    align: eAlign.eTop,
    height: 40,
    backgroundColor: 'transparent',
    innerHTML: '<b>Changes (JavaScript/jQuery)</b>'
  });
  this.viewChanges_Edit_Master_Actions.panels.push(this.viewChanges_Edit_Master_Actions_Header);
  
  this.viewChanges_Edit_Master_Actions_Edit = new cTextEditPanel({
    align: eAlign.eClient,
    color: '#dddddd',
    backgroundColor: '#333333',
    fontSize: 16,
    value: '',
    onChange: function() {
      Model.setActions(lThis.viewChanges_Edit_Master_Actions_Edit.getValue());
    }
  });
  this.viewChanges_Edit_Master_Actions.panels.push(this.viewChanges_Edit_Master_Actions_Edit);
  
  

  this.viewChanges_Edit_Detail = new cPanel({
    align: eAlign.eClient,
    backgroundColor: 'transparent'
  });
  this.viewChanges.panels.push(this.viewChanges_Edit_Detail);    
  
  this.viewChanges_Edit_Detail_Header = new cPanel({
    align: eAlign.eTop,
    height: 40,
    backgroundColor: 'transparent',
    innerHTML: '<b>Problem Solver Changes API documentation</b>'
  });
  this.viewChanges_Edit_Detail.panels.push(this.viewChanges_Edit_Detail_Header);

  this.viewChanges_Edit_Detail_View = new cPanel({
    align: eAlign.eClient,
    backgroundColor: 'transparent'
  });
  this.viewChanges_Edit_Detail.panels.push(this.viewChanges_Edit_Detail_View);
  
  this.viewChanges_Edit_Detail_View_scrollPanel = new cScrollboxPanel({
    align: eAlign.eClient,
    backgroundColor: 'transparent',
    boxBackgroundColor: '#ffeead', //'#ffffff', //  '#96ceb4',
    scrollBarHandleColor: '#666666',
    autoHideScrollbar: true
  });
  this.viewChanges_Edit_Detail_View.panels.push(this.viewChanges_Edit_Detail_View_scrollPanel);
  
  this.viewChanges_Edit_Detail_View_scrollPanel_content = new cPanel({
    align: eAlign.eTop,
    height: 4000,
    padding: 20,
    backgroundColor: 'transparent',
    textSelectable: true,
    innerHTML:
      '<div style="position: static; font-size: 32px; font-weight: bold;">\n' +
      '  Changes\n' +
      '</div>\n' +
      'The "changes" define the voluntary and involuntary actions - the dynamic rules of the game.\n' +
      'The code entered here is applied to a world (world = HTML document), and the purpose of this\n' +
      'code is to create new worlds - new possible worlds which may succeed the current world.\n' +
      'This code is then applied to those new worlds too, and so on. This results in many worlds,\n' +
      'branching out like a tree, growing exponentially. The tree of all these possible worlds is\n' + 
      'called the "multiverse". The term "multiverse" is borrowed from quantum mechanics,\n' +
      'because of the similarities to the\n' +
      '<a href="http://en.wikipedia.org/wiki/Many-worlds_interpretation" target="_blank">many-worlds interpretation</a>.\n' +
      'The multiverse is also similar to the\n' +
      '<a href="http://en.wikipedia.org/wiki/Game_tree" target="_blank">game tree</a> in\n' +
      '<a href="http://en.wikipedia.org/wiki/Game_theory" target="_blank">game theory</a>,\n' +
      'or the <a href="http://en.wikipedia.org/wiki/Decision_tree" target="_blank">decision tree</a> in\n' +
      '<a href="http://en.wikipedia.org/wiki/Decision_analysis" target="_blank">decision analysis</a>.\n' +
      '<br />\n' +
      'With JavaScript code you can generate multiple possible worlds (world = HTML document) as follows:\n' +
      '<ol>\n' +
      '  <li>Create multiple choices using one of the choose() methods.</li>\n' +
      '  <li>Manipulate the current world (HTML document) using DOM and/or jQuery commands.</li>\n' +
      '  <li>Register the manipulated HTML document as a new world with the\n' +
      '      <span style="font-family: \'Courier New\', Courier, monospace;">multiverse.world()</span> function.</li>\n' +
      '</ol>\n' +
      'To create multiple branches of options, you can use\n' + 
      '<span style="font-family: \'Courier New\', Courier, monospace;">Array.choose()</span> or\n' + 
      '<span style="font-family: \'Courier New\', Courier, monospace;">jQuery.choose()</span> to\n' +
      'tell Problem Solver to apply this code multiple times to a single world, for each combination of\n' +
      'options returned by the choose() method. This is how you create multiple voluntary options.\n' +
      'This code may (depending on conditions set in the "evaluate" code) then automatically be\n' +
      'applied to any of the newly created documents, which in turn will generate more worlds,\n' +
      'and so on. This is how the "multiverse" gets created.<br />\n' +
      'Note: the code you enter may contain multiple calls to choose()!<br />\n' +
      '<br />\n' +
      '<br />\n' +
      
      
      '<div style="position: static; background-color: #2A2A1A; padding: 10px;\n' + 
      ' font-family: \'Courier New\', Courier, monospace; font-size: 18px;\n' + 
      ' color: #dddddd;">\n' +
      '  Array.choose( atLeast, atMost )\n' +
      '</div>\n' +
      '<div style="position: static; background-color: #cccccc; border: 2px solid #2A2A1A; padding: 10px; font-size: 16px;">\n' +
      '  The Array.choose() method performs the following:\n' + 
      '  <div style="position: static; margin-left: 20px; font-size: 16px;">\n' +
      '    1. Determine all the combinations of subsets of items in the array, where the subset contains\n' +
      '    at least <span style="font-family: \'Courier New\', Courier, monospace; background-color: #2A2A1A; color: #dddddd;">atLeast</span> items, and at most\n' +
      '    <span style="font-family: \'Courier New\', Courier, monospace; background-color: #2A2A1A; color: #dddddd;">atMost</span> items.\n' +
      '    <br />\n' +
      '    2. Tell Problem Solver to run the entire code in the current world for each possible combination.<br />\n' +
      '    3. During each run of the code, the method returns the selected combination (subset) of items.\n' +
      '  </div>\n' +
      '  The <span style="font-family: \'Courier New\', Courier, monospace; background-color: #2A2A1A; color: #dddddd;">atMost</span> argument must be greater than or equal to\n' +
      '  <span style="font-family: \'Courier New\', Courier, monospace; background-color: #2A2A1A; color: #dddddd;">atLeast</span>.\n' +
      '  If <span style="font-family: \'Courier New\', Courier, monospace; background-color: #2A2A1A; color: #dddddd;">atMost</span> is undefined\n' +
      '  then it is assumed to be equal to <span style="font-family: \'Courier New\', Courier, monospace; background-color: #2A2A1A; color: #dddddd;">atLeast</span>.\n' +
      '  <br />\n' + 
      '  &nbsp;<br />\n' + 
      '  <b>Example:</b>\n' + 
      '  <div style="position: static; margin-left: 20px;">\n' + 
      '    The example code below will get executed 3 times in a single run.\n' +
      '    This is because there are three ways of selecting at least 1 item and at most 2 items from a set of 2 items.<br />\n' +
      '    In the first run the choice variable will be set to ["A"].<br />\n' +
      '    In the second run the choice variable will be set to ["B"].<br />\n' +
      '    In the third run the choice variable will be set to ["A", "B"].\n' +
      '  </div>\n' +
      '  <div style="position: static; margin-left: 20px; background-color: #333333; padding: 10px;\n' + 
      '     font-family: \'Courier New\', Courier, monospace; font-size: 16px;\n' + 
      '     color: #dddddd;">\n' +
      '    var choice = [ "A", "B" ].choose( 1, 2 );<br />\n' +
      '    new multiverse.world( choice.toString() );\n' +
      '  </div>\n' +
      '</div>\n' +
      '<br />\n' +
      
      '<div style="position: static; background-color: #2A2A1A; padding: 10px;\n' + 
      ' font-family: \'Courier New\', Courier, monospace; font-size: 18px;\n' + 
      ' color: #dddddd;">\n' +
      '  Array.chooseOne()\n' +
      '</div>\n' +
      '<div style="position: static; background-color: #cccccc; border: 2px solid #2A2A1A; padding: 10px; font-size: 16px;">\n' +
      '  The Array.chooseOne() method is equivalent to calling Array.choose( 1, 1 )[0] or Array.choose( 1 )[0].\n' + 
      '  Note that the method returns a single element, and not an array.\n' + 
      '  <br />\n' + 
      '  &nbsp;<br />\n' + 
      '  <b>Example:</b>\n' + 
      '  <div style="position: static; margin-left: 20px;">\n' + 
      '    The example code below will get executed twice in a single run.\n' +
      '    This is because there are two ways of selecting a single item from a set of 2 items.<br />\n' +
      '    In the first run the toss variable will be set to ["heads"].<br />\n' +
      '    In the second run the toss variable will be set to ["tails"].\n' +
      '  </div>\n' +
      '  <div style="position: static; margin-left: 20px; background-color: #333333; padding: 10px;\n' + 
      '     font-family: \'Courier New\', Courier, monospace; font-size: 16px;\n' + 
      '     color: #dddddd;">\n' +
      '    var toss = [ "heads", "tails" ].chooseOne();<br />\n' +
      '    new multiverse.world( toss );\n' +
      '  </div>\n' +
      '  &nbsp;<br />\n' + 
      '  <b>Example:</b>\n' + 
      '  <div style="position: static; margin-left: 20px;">\n' + 
      '    The example code below will get executed twice in a single run.\n' +
      '    This is because there are two ways of selecting a single item from a set of 2 items.<br />\n' +
      '    In the first run the measurement variable will be set to 0.<br />\n' +
      '    In the second run the measurement variable will be set to 1.\n' +
      '  </div>\n' +
      '  <div style="position: static; margin-left: 20px; background-color: #333333; padding: 10px;\n' + 
      '     font-family: \'Courier New\', Courier, monospace; font-size: 16px;\n' + 
      '     color: #dddddd;">\n' +
      '    var qubit = [ 0, 1 ];<br />\n' +
      '    var measurement = qubit.chooseOne();<br />\n' +
      '    new multiverse.world( "measured: " + measurement );\n' +
      '  </div>\n' +
      '</div>\n' +
      '<br />\n' +      
      
      '<div style="position: static; background-color: #2A2A1A; padding: 10px;\n' + 
      ' font-family: \'Courier New\', Courier, monospace; font-size: 18px;\n' + 
      ' color: #dddddd;">\n' +
      'jQuery.choose( atLeast, atMost )\n' +
      '</div>\n' +
      '<div style="position: static; background-color: #cccccc; border: 2px solid #2A2A1A; padding: 10px; font-size: 16px;">\n' +
      '  The jQuery.choose() method (a jQuery plugin) is similar to the Array.choose() method, except it deals\n' +
      '  with jQuery\'s DOM elements instead of array elements.<br />\n' +
      '  The jQuery.choose() method performs the following:\n' + 
      '  <div style="position: static; margin-left: 20px; font-size: 16px;">\n' +
      '    1. Given a jQuery object that represents a set of DOM elements,\n' +
      '    determine all the combinations of subsets of elements, where the subset consists of\n' +
      '    at least <span style="font-family: \'Courier New\', Courier, monospace; background-color: #2A2A1A; color: #dddddd;">atLeast</span> elements, and at most\n' +
      '    <span style="font-family: \'Courier New\', Courier, monospace; background-color: #2A2A1A; color: #dddddd;">atMost</span> elements.\n' +
      '    <br />\n' +
      '    2. Tell Problem Solver to run the entire code in the current world for each possible combination.<br />\n' +
      '    3. During each run of the code, the method returns a new jQuery object containing the selected\n' +
      '    combination (subset) of elements.\n' +
      '  </div>\n' +
      '  The <span style="font-family: \'Courier New\', Courier, monospace; background-color: #2A2A1A; color: #dddddd;">atMost</span> argument must be greater than or equal to\n' +
      '  <span style="font-family: \'Courier New\', Courier, monospace; background-color: #2A2A1A; color: #dddddd;">atLeast</span>.\n' +
      '  If <span style="font-family: \'Courier New\', Courier, monospace; background-color: #2A2A1A; color: #dddddd;">atMost</span> is undefined\n' +
      '  then it is assumed to be equal to <span style="font-family: \'Courier New\', Courier, monospace; background-color: #2A2A1A; color: #dddddd;">atLeast</span>.\n' +
      '  <br />\n' + 
      '  &nbsp;<br />\n' + 
      '  <b>Example:</b>\n' + 
      '  <div style="position: static; margin-left: 20px;">\n' + 
      '    The example code below will ...\n' +
      '  </div>\n' +
      '  <div style="position: static; margin-left: 20px; background-color: #333333; padding: 10px;\n' + 
      '     font-family: \'Courier New\', Courier, monospace; font-size: 16px;\n' + 
      '     color: #dddddd;">\n' +
      '    $( ".matchstick" ).choose( 1, 3 ).remove();<br />\n' +
      '    new multiverse.world();\n' +
      '  </div>\n' +
      '</div>\n' +
      '<br />\n' +
      
      '<div style="position: static; background-color: #2A2A1A; padding: 10px;\n' + 
      ' font-family: \'Courier New\', Courier, monospace; font-size: 18px;\n' + 
      ' color: #dddddd;">\n' +
      'jQuery.chooseOne()\n' +
      '</div>\n' +
      '<div style="position: static; background-color: #cccccc; border: 2px solid #2A2A1A; padding: 10px; font-size: 16px;">\n' +
      '  The jQuery.chooseOne() method (a jQuery plugin) is equivalent to calling jQuery.choose( 1, 1 ) or\n' +
      '  jQuery.choose( 1 ).<br />\n' +
      '  The jQuery.chooseOne() method performs the following:\n' + 
      '  <div style="position: static; margin-left: 20px; font-size: 16px;">\n' +
      '    1. Given a jQuery object that represents a set of DOM elements,\n' +
      '    select a single element.<br />\n' +
      '    2. Tell Problem Solver to re-run the entire code, selecting a different element each time,\n' +
      '    until each element has been selected.<br />\n' +
      '    3. During each run of the code, the method returns a new jQuery object containing the selected\n' +
      '    element.\n' +
      '  </div>\n' +
      '  <br />\n' + 
      '  &nbsp;<br />\n' + 
      '  <b>Example:</b>\n' + 
      '  <div style="position: static; margin-left: 20px;">\n' + 
      '    The example code below will select a single td cell and fill it with the text "X".\n' +
      '    It will run this code for each empty cell, generating a new world for each cell it selected.\n' +
      '    The resulting multiverse will be finite, because eventually all cells will be filled with "X".\n' +
      '  </div>\n' +
      '  <div style="position: static; margin-left: 20px; background-color: #333333; padding: 10px;\n' + 
      '     font-family: \'Courier New\', Courier, monospace; font-size: 16px;\n' + 
      '     color: #dddddd;">\n' +
      '    $( "#td:empty" ).chooseOne().text( "X" );<br />\n' +
      '    new multiverse.world();\n' +
      '  </div>\n' +
      '</div>\n' +
      '<br />\n' +      
      
      '<div style="position: static; background-color: #2A2A1A; padding: 10px;\n' + 
      ' font-family: \'Courier New\', Courier, monospace; font-size: 18px;\n' + 
      ' color: #dddddd;">\n' +
      'multiverse.world( changeDescription )\n' +
      '</div>\n' +
      '<div style="position: static; background-color: #cccccc; border: 2px solid #2A2A1A; padding: 10px; font-size: 16px;">\n' +
      '  The multiverse.world() function tells Problem Solver to create a new world that represents a\n' +
      '  possible future, a possible succession to the current world. The new world will be set with\n' +
      '  with the current state of the manipulated HTML. Note that the "new" operator (frequently used in the\n' +
      '  examples) is optional.<br />\n' +
      '  The optional <span style="font-family: \'Courier New\', Courier, monospace; background-color: #2A2A1A;\n' +
      '    color: #dddddd;">changeDescription</span> argument is a string that describes the action,\n' +
      '  how the new world was created. This string is displayed as part of the newly created world,\n' +
      '  made visible in the multiverse viewer.\n' +
      '  <br />\n' + 
      '  &nbsp;<br />\n' + 
      '  <b>Example:</b>\n' + 
      '  <div style="position: static; margin-left: 20px;">\n' + 
      '    The example code below will select a one of the numbers in the array and create a new (identical) world, recording the\n' +
      '    chosen number.\n' +
      '    It will run this code for each new world created, generating six new worlds each run, and so on.\n' +
      '  </div>\n' +
      '  <div style="position: static; margin-left: 20px; background-color: #333333; padding: 10px;\n' + 
      '     font-family: \'Courier New\', Courier, monospace; font-size: 16px;\n' + 
      '     color: #dddddd;">\n' +
      '    var dice = [ 1, 2, 3, 4, 5, 6 ];<br />\n' +
      '    var diceRoll = dice.chooseOne();<br />\n' +
      '    new multiverse.world( "threw " + diceRoll );\n' +
      '  </div>\n' +
      '</div>\n' +
      '<br />\n'
  });
  this.viewChanges_Edit_Detail_View_scrollPanel.panelBox.panels.push(this.viewChanges_Edit_Detail_View_scrollPanel_content);
}
// Class inheritance setup:
cViewChangesPanel.deriveFrom(cPanel);
// Static class constructor:
(function() {

  cViewChangesPanel.prototype.screen = null;

  cViewChangesPanel.prototype.viewChanges = null;
  cViewChangesPanel.prototype.viewChanges_Edit_Master_Actions = null;
  cViewChangesPanel.prototype.viewChanges_Edit_Master_Actions_Header = null;
  cViewChangesPanel.prototype.viewChanges_Edit_Master_Actions_Edit = null;
  cViewChangesPanel.prototype.viewChanges_Edit_Detail = null;
  cViewChangesPanel.prototype.viewChanges_Edit_Detail_Header = null;
  cViewChangesPanel.prototype.viewChanges_Edit_Detail_View = null;
  cViewChangesPanel.prototype.viewChanges_Edit_Detail_View_scrollPanel = null;
  cViewChangesPanel.prototype.viewChanges_Edit_Detail_View_scrollPanel_content = null;

  cViewChangesPanel.prototype.render = function(aParentPanel, aParentElement, aClientRect) {
    cPanel.prototype.render.call(this, aParentPanel, aParentElement, aClientRect);
    if (this.element != null) {
      var lDetailHeight = 1000 + ((1600000 / (this.viewChanges_Edit_Detail_View_scrollPanel.panelBox.getInnerWidth() + 1)) | 0);
      if (this.viewChanges_Edit_Detail_View_scrollPanel_content.height != lDetailHeight) {
        this.viewChanges_Edit_Detail_View_scrollPanel_content.setHeight(lDetailHeight);
        this.viewChanges_Edit_Detail_View_scrollPanel.rerender();
      }
    }
  };


  cViewChangesPanel.prototype.reloadWorld = function() {
    if (this.viewChanges_Edit_Master_Actions_Edit) {
      this.viewChanges_Edit_Master_Actions_Edit.setValue(Model.getActions());
    }
  };
  
})();
  
