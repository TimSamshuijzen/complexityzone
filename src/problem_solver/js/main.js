include("cdom.js");
include("cproblemsolverapp.js");

var lApp = null;

function Main() {
  // cDebug.debug = true;
  // cDebug.tag = 'debug';
  // cDebug.log('debug', 'starting app...');
  
  /*
  var lfullscreen = true;  
  if (lfullscreen) {
    lApp = new cProblemSolverApp(document.body);
  } else {
    document.body.innerHTML =
      '<p></p>' +
      '<div id="oob" style="position: static; overflow:auto; width:700px; height:600px; border:10px solid blue;"></div>';
    lApp = new cProblemSolverApp(cDOM.getElement("oob"));
  }
  */

  lApp = new cProblemSolverApp(document.body);
}
  
cDOM.registerEvent(window, 'load', Main);
  