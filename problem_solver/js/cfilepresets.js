// Copyright 2012 Tim Samshuijzen.

var cFilePresets = {
  presets: []
};

/*

world:

<world>
  <item name="farmer" side="left"></item>
  <item name="fox" side="left"></item>
  <item name="chicken" side="left"></item>
  <item name="grain" side="left"></item>
</world>


css:

world
{
  display: block;
  width: 250px;
  padding: 10px;
  background-color: #00aa00;
}

item
{
  display: block;
  width: 80px;
  margin: 10px;
  padding: 10px;
  font-size: 22px;
  text-align: center;
}

item:before
{
  content: attr(name);
}

item[side=right]
{
  margin-left: 140px;
}

item[name=farmer]
{
  font-weight: bold;
  color: #ffffff;
  background-color: #0000ff;
}

item[name=fox]
{
  background-color: #D2691E;
}

item[name=chicken]
{
  background-color: #ff0000;
}

item[name=grain]
{
  background-color: #ffff00;
}


changes:

var farmer = $("item[name|='farmer']");
var side = farmer.attr("side");
var otherSide = (side == "left") ? "right" : "left";

farmer.attr( "side", otherSide);

//todo: optionally take along another item
var optionalItem = $("item[side|='" + side + "']").choose(0, 1);
optionalItem.attr( "side", otherSide);


new multiverse.world();


=========================

determining sqrt(3)

html:
  1

changes:
  var x = +($('body').html());
  x = (x + (3 / x)) / 2;
  $('body').html(x);
  new multiverse.world();

evaluate:
  var x = +($('body').html());
  if (((x * x) - 3) < Math.abs(0.0000000001))
  {
    world.goal();
  }

============================

<table id="rivercrossing" cellpadding="0" cellspacing="0">
  <tr>
    <td class="farmer">farmer</td>
  </tr>
  <tr>
    <td class="fox">fox</td>
  </tr>
  <tr class="chicken">
    <td>chicken</td>
    <td></td>
  </tr>
  <tr class="grain">
    <td>grain</td>
    <td></td>
  </tr>
</table>



<world>
  <item name="farmer" side="left"></item>
  <item name="fox" side="left"></item>
  <item name="chicken" side="left"></item>
  <item name="grain" side="left"></item>
</world>


=============================


<table id="tictactoe" cellpadding="0" cellspacing="0">
  <tr>
    <td id="p11"></td>
    <td id="p12"></td>
    <td id="p13"></td>
  </tr>
  <tr>
    <td id="p21"></td>
    <td id="p22"></td>
    <td id="p23"></td>
  </tr>
  <tr>
    <td id="p31"></td>
    <td id="p32"></td>
    <td id="p33"></td>
  </tr>
</table>


#tictactoe {
  border: 3px solid #333333;
}

#tictactoe td {
  width: 80px;
  height: 80px;
  background: #cccccc;
  color: #000000;
  font-size: 60px;
  font-weight: bold;
  text-align: center;
  vertical-align: middle;
  border: 2px solid #333333;
}

var numberOfXsAndOs = $("td:not(:empty)").length;

var turn = ((numberOfXsAndOs % 2) == 0) ? 'X' : 'O';

var emptyCells = $("td:empty");

if (emptyCells.length) {
  var chosenCell = emptyCells.chooseOne();

  chosenCell.html(turn);

  new multiverse.world(turn);
}





var emptyCells = $("td:empty");

if (emptyCells.length == 0) {
  world.end();
}


===============================



*/

cFilePresets.presets.push({
  application:
  {
    name: "ProblemSolver",
    home: "http://complexity.zone/problem_solver",
    version: "0.0.1"
  },
  project:
  {
    name: "Towers of Hanoi",
    html: 
          '<!-- Model the Towers of Hanoi puzzle using HTML. -->\n' +
          '\n' +
          "<towersofhanoi>\n" +
          "  <rod>\n" +
          "    <disk size=\"1\" color=\"red\"></disk>\n" +
          "    <disk size=\"2\" color=\"yellow\"></disk>\n" +
          "    <disk size=\"3\" color=\"blue\"></disk>\n" +
          "  </rod>\n" +
          "  <rod>\n" +
          "  </rod>\n" +
          "  <rod>\n" +
          "  </rod>\n" +
          "</towersofhanoi>\n" +
          "\n" +
          '<!-- The HTML code below is just for displaying the pins as a background. -->\n' +
          "\n" +
          "<background>\n" +
          "  <pin></pin>\n" +
          "  <pin></pin>\n" +
          "  <pin></pin>\n" +
          "</background>\n",
    css:
          '/* Apply CSS to make the world appear natural. */\n' +
          '\n' +
          "body {\n" +
          "  padding: 6px;\n" +
          "}\n" +
          "\n" +
          "towersofhanoi {\n" +
          "  position: absolute;\n" +
          "  display: block;\n" +
          "  width: 300px;\n" +
          "}\n" +
          "\n" +
          "rod {\n" +
          "  display: inline-block;\n" +
          "  position: relative;\n" +
          "  width: 86px;\n" +
          "  height: 150px;\n" +
          "  background-color: transparent;\n" +
          "}\n" +
          "\n" +
          "disk {\n" +
          "  display: block;\n" +
          "  position: absolute;\n" +
          "  height: 30px;\n" +
          "  border: 1px solid black;\n" +
          "  background-color: #cccccc;\n" +
          "}\n" +
          "\n" +
          "disk[size=\"1\"] {\n" +
          "  left: 28px;\n" +
          "  width: 30px;\n" +
          "  background-color: #ff0000;\n" +
          "}\n" +
          "\n" +
          "disk[size=\"2\"] {\n" +
          "  left: 18px;\n" +
          "  width: 50px;\n" +
          "  background-color: #ffff00;\n" +
          "}\n" +
          "\n" +
          "disk[size=\"3\"] {\n" +
          "  left: 3px;\n" +
          "  width: 80px;\n" +
          "  background-color: #0000ff;\n" +
          "}\n" +
          "\n" +
          "disk:nth-last-child(1) {\n" +
          "  top: 100px;\n" +
          "}\n" +
          "\n" +
          "disk:nth-last-child(2) {\n" +
          "  top: 60px;\n" +
          "}\n" +
          "\n" +
          "disk:nth-last-child(3) {\n" +
          "  top: 20px;\n" +
          "}\n" +
          "\n" +
          '/* The following CSS rules apply to the background. */\n' +
          '\n' +
          "background {\n" +
          "  position: absolute;\n" +
          "  display: block;\n" +
          "  z-index: -1;\n" +
          "  width: 270px;\n" +
          "  height: 140px;\n" +
          "  border-bottom: 25px solid #aaaa66;\n" +
          "}\n" +
          "\n" +
          "pin {\n" +
          "  display: block;\n" +
          "  position: absolute;\n" +
          "  top: 10px;\n" +
          "  width: 10px;\n" +
          "  height: 150px;\n" +
          "  background-color: #aaaa66;\n" +
          "}\n" +
          "\n" +
          "pin:nth-child(1) {\n" +
          "  left: 38px;\n" +
          "}\n" +
          "\n" +
          "pin:nth-child(2) {\n" +
          "  left: 128px;\n" +
          "}\n" +
          "\n" +
          "pin:nth-child(3) {\n" +
          "  left: 218px;\n" +
          "}\n",

    actions:
          "// First select all the rods which have at least one disk.\n" +
          "var rodsWithDisks = $(\"rod\").has(\"disk\");\n" +
          "\n" +
          "// Choose any one of these rods using Problem Solver's chooseOne() plugin.\n" +
          "// This tells Problem Solver to run this code for each rod which is not empty.\n" +
          "var chosenRod = rodsWithDisks.chooseOne();\n" +
          "\n" +
          "// Select the top-most disk on the chosen rod.\n" +
          "var topDisk = chosenRod.children().eq(0);\n" +
          "\n" +
          "// Choose a any other rod as the destination using Problem Solver's chooseOne() plugin.\n" +
          "// This tells Problem Solver to run this code for each possible destination rod.\n" +
          "var destinationRod = chosenRod.siblings().chooseOne();\n" +
          "\n" +
          "// Move this disk to the chosen destination rod.\n" +
          "topDisk.prependTo(destinationRod);\n" +
          "\n" +
          "// Store resulting world in a new world and describe the changes:\n" +
          "new multiverse.world('move ' + topDisk.attr('color') + ' disk to rod number ' + (destinationRod.index() + 1));\n" +
          "\n",

    evaluations:
          "if ($(\"disk[size='2'] ~ disk[size='1']\").length) {\n" +
          "  // A disk of size 2 is placed on top of a disk with size 1,\n" +
          "  // so mark this world as illegal:\n" +
          "  world.illegal();\n" +
          "} else if ($(\"disk[size='3'] ~ disk[size='1']\").length) {\n" +
          "  // A disk of size 3 is placed on top of a disk with size 1,\n" +
          "  // so mark this world as illegal:\n" +
          "  world.illegal();\n" +
          "} else if ($(\"disk[size='3'] ~ disk[size='2']\").length) {\n" +
          "  // A disk of size 3 is placed on top of a disk with size 2,\n" +
          "  // so mark this world as illegal:\n" +
          "  world.illegal();\n" +
          "} else if ($('rod').last().children().length == 3) {\n" +
          "  // There are no violations and all 3 disks are placed on the last rod - the puzzle is solved,\n" +
          "  // so mark this world as the goal:\n" +
          "  world.goal('DONE!');\n" +
          "}\n",
    searchAlgorithm:
          "breadth-first"
  }
});

cFilePresets.presets.push({
  application:
  {
    name: "ProblemSolver",
    home: "http://complexity.zone/problem_solver",
    version: "0.0.1"
  },
  project:
  {
    name: 'River crossing',
    html:
          '<!-- Model the initial "now" situation (world) using HTML. -->\n' +
          '\n' +
          '<riverBank class="A">\n' +
          '  <farmer>farmer</farmer>\n' +
          '  <fox>fox</fox>\n' +
          '  <chicken>chicken</chicken>\n' +
          '  <grain>grain</grain>\n' +
          '</riverBank>\n' +
          '\n' +
          '<river></river>\n' +
          '\n' +
          '<riverBank class="B">\n' +
          '</riverBank>\n',
    css:
          '/* Apply CSS to make the world appear natural. */\n' +
          '\n' +
          'river {\n' +
          '  /* position and color the river */\n' +
          '  position: absolute;\n' +
          '  left: 100px;\n' +
          '  width: 50px;\n' +
          '  height: 210px;\n' +
          '  /* color the river blue */\n' +
          '  background-color: #aaaaff;\n' +
          '}\n' +
          '\n' +
          'riverBank {\n' +
          '  /* set the size and color of the river bank */\n' +
          '  position: absolute;\n' +
          '  width: 100px;\n' +
          '  height: 210px;\n' +
          '  /* color the riverside green */\n' +
          '  background-color: #00aa00;\n' +
          '}\n' +
          'riverBank.A {\n' +
          '  /* position river bank A on the left side */\n' +
          '  left: 0px;\n' +
          '}\n' +
          'riverBank.B {\n' +
          '  /* position river bank B on the right side */\n' +
          '  left: 150px;\n' +
          '}\n' +
          '\n' +
          'riverBank * {\n' +
          '  /* common properties for farmer, fox, chicken and grain */\n' +
          '  display: block;\n' +
          '  margin: 10px;\n' +
          '  padding: 10px;\n' +
          '  text-align: center;\n' +
          '}\n' +
          '\n' +
          'farmer {\n' +
          '  font-weight: bold;\n' +
          '  color: #ffffff;\n' +
          '  background-color: #0000ff;\n' +
          '}\n' +
          '\n' +
          'fox {\n' +
          '  background-color: #D2691E;\n' +
          '}\n' +
          '\n' +
          'chicken {\n' +
          '  background-color: #ff0000;\n' +
          '}\n' +
          '\n' +
          'grain {\n' +
          '  background-color: #ffff00;\n' +
          '}\n',

    actions:
          "\n" +
          "// Select the farmer:\n" +
          "var farmer = $('farmer');\n" +
          "\n" +
          "// List the available items to take to the other river bank.\n" +
          "var selectableItems = farmer.siblings();\n" +
          "\n" +
          "// Optionally select any single item (0 or 1 items) using the special choose() plugin.\n" +
          "var optionalItem = selectableItems.choose(0, 1);\n" +
          "\n" +
          "// Select the destination river bank:\n" +
          "var otherBank = farmer.parent().siblings('riverBank');\n" +
          "\n" +
          "// Move the farmer (and optionally an item) to the other river bank:\n" +
          "farmer.add(optionalItem).appendTo(otherBank);\n" +
          "\n" +
          "// Store resulting world in a new world and describe the changes:\n" +
          "new multiverse.world('move to ' + otherBank[0].className + (optionalItem.length > 0 ? ' with ' + optionalItem[0].nodeName : ' alone'));\n",

    evaluations:
          "\n" +
          "if ($('riverBank.B *').length == 4)\n" +
          "{\n" +
          "  // All four subjects are on the other side - the puzzle is solved,\n" +
          "  // so mark this world as the goal:\n" +
          "  world.goal('made it!');\n" +
          "}\n" +
          "\n" +
          "if (($('fox').siblings('chicken').length > 0) &&\n"+
          "    ($('fox').siblings('farmer').length == 0))\n" +
          "{\n" +
          "  // The fox and chicken are at the same river bank but\n" +
          "  // unattended by the farmer, so mark this world as illegal:\n" +
          "  world.illegal('not allowed to leave fox and chicken unattended');\n" +
          "}\n" +
          "\n" +
          "if (($('chicken').siblings('grain').length > 0) &&\n"+
          "    ($('chicken').siblings('farmer').length == 0))\n" +
          "{\n" +
          "  // The chicken and grain are at the same river bank but\n" +
          "  // unattended by the farmer, so mark this world as illegal:\n" +
          "  world.illegal('not allowed to leave chicken and grain unattended');\n" +
          "}\n" +
          "\n" +
          /*
          "if (world.isSameAsBefore())\n" +
          "{\n" +
          "  // Tell Problem Solver to ignore (discontinue) paths which lead to repetition.\n" +
          "  // This will greatly limit the growth of the multiverse.\n" +
          "  world.ignore();\n" +
          "}\n" +
          "\n" +
          */
          "// If we haven't achieved our goal, at least give it some kind of score with\n" +
          "// the like() function, where its value is the number of subjects on the other side.\n" +
          "// This will guide the auto search function when the search method is set to \"high like-score first\".\n" +
          "world.like($('riverBank.B *').length);\n",

    searchAlgorithm:
          "breadth-first"
  }
});

/*
cFilePresets.presets.push({
  name: "Qubits",
  html: 
        "",
  css:
        "body {\n" +
        "  font-size: 40px;\n" +
        "}\n",

  actions:
        "var qubit1 = [0, 1].choose(1, 1)[0];\n" +
        "var qubit2 = [0, 1].choose(1, 1)[0];\n" +
        "var qubit3 = [0, 1].choose(1, 1)[0];\n" +
        "var display = '' + qubit1 + qubit2 + qubit3;\n" +
        "document.body.innerHTML = display;\n" +
        "new multiverse.world(display);\n",

  evaluations:
        "if (document.body.innerHTML != '') {\n" +
        "  world.end();\n" +
        "}\n"
});
*/

/*
cFilePresets.presets.push({
  name: "Throwing coins, binary tree",
  html: 
        "",
  css:
        "",

  actions:
        "var toss = ['heads', 'tails'].choose(1, 1)[0];\n" +
        "new multiverse.world(toss);\n",

  evaluations:
        ""
});
*/
/*
cFilePresets.presets.push({
  name: "Yahtzee",
  html: 
        "",
  css:
        "",

  actions:
        "var dice = [1, 2, 3, 4, 5, 6];\n" +
        "var roll = dice.choose(1, 1)[0];\n" +
        "new multiverse.world(roll);\n",

  evaluations:
        ""
});
*/


var lChessBoard = "";
lChessBoard += "<table id=\"chessboard\" cellpadding=\"0\" cellspacing=\"0\">\n";
for (var lrow = 1; lrow <= 8; lrow++) {
  lChessBoard += "  <tr>\n";
  for (var lcolumn = 1; lcolumn <= 8; lcolumn++) {
    lChessBoard += "    <td id=\"p" + lrow + lcolumn + "\"></td>\n";
  }
  lChessBoard += "  </tr>\n";
}
lChessBoard += "</table>\n";


cFilePresets.presets.push({
  application:
  {
    name: "ProblemSolver",
    home: "http://complexity.zone/problem_solver",
    version: "0.0.1"
  },
  project:
  {
    name: "Eight queens puzzle",
    html: lChessBoard,

    css:
          "#chessboard {\n" +
          "  border: 3px solid #333333;\n" +
          "}\n" +
          "\n" +
          "#chessboard td {\n" +
          "  width: 40px;\n" +
          "  height: 40px;\n" +
          "  background: #ffffff;\n" +
          "  color: #000000;\n" +
          "  font-size: 30px;\n" +
          "  text-shadow: 0 1px #ffffff;\n" +
          "  text-align: center;\n" +
          "  vertical-align: middle;\n" +
          "}\n" +
          "\n" +
          "#chessboard tr:nth-child(odd) td:nth-child(even),\n" +
          "#chessboard tr:nth-child(even) td:nth-child(odd) {\n" +
          "  background: #aaaaaa;\n" +
          "}\n",

    actions:
    /*
          "var firstemptyrow = 0;\n" +
          "// find first empty row\n" +
          "for (var row = 1; row <= 8; row++) {\n" +
          "  var foundone = false;\n" +
          "  for (var column = 1; column <= 8; column++) {\n" +
          "    if ($(\"#p\" + row + column).html() != \"\") {\n" +
          "      foundone = true;\n" +
          "      break;\n" +
          "    }\n" +
          "  }\n" +
          "  if (!foundone) {\n" +
          "    firstemptyrow = row;\n" +
          "    break;\n" +
          "  }\n" +
          "}\n" +
          "if (firstemptyrow) {\n" +
          "  var column = [1,2,3,4,5,6,7,8].chooseOne();\n" +
          "  var cell = $(\"#p\" + firstemptyrow + column);\n" +
          "  if (cell.html() == \"\") {\n" +
          "    cell.html(\"&#9818;\");\n" +
          "    new multiverse.world();\n" +
          "  }\n" +
          "}\n",
    */
          "// Method: place a queen on the first empty row and mark the row as 'done'.\n" +
          "\n" +
          "// Select the first row that we have not yet filled with a queen.\n" +
          "var row = $('tr:not(.done)').eq(0);\n" +
          "\n" +
          "// Select one of the 8 cells within the row.\n" +
          "var cell = row.children().chooseOne();\n" +
          "\n" +
          "// Fill the cell with the unicode value for the black queen symbol.\n" +
          "cell.html('&#9818;');\n" +
          "\n" +
          "// Mark the row's class with 'done'.\n" +
          "row.addClass('done');\n" +
          "\n" +
          "// Create the new world.\n" +
          "new multiverse.world();\n" +
          "\n",

    evaluations:
          "\n" +
          "// List all vertical and diagonal lines in an array. We will use these lines\n" +
          "// to determine whether any of them contains more than one queen. Note that\n" +
          "// we do not need to look at horizontal lines because we place a single\n" +
          "// queen on each row.\n" +
          "var lines = [\n" + 
  /*
          "  // horizontal lines (actually no need to test these, because we place a single queen on each row):\n" +
          "  ['11', '12', '13', '14', '15', '16', '17', '18'],\n" + 
          "  ['21', '22', '23', '24', '25', '26', '27', '28'],\n" + 
          "  ['31', '32', '33', '34', '35', '36', '37', '38'],\n" + 
          "  ['41', '42', '43', '44', '45', '46', '47', '48'],\n" + 
          "  ['51', '52', '53', '54', '55', '56', '57', '58'],\n" + 
          "  ['61', '62', '63', '64', '65', '66', '67', '68'],\n" + 
          "  ['71', '72', '73', '74', '75', '76', '77', '78'],\n" + 
          "  ['81', '82', '83', '84', '85', '86', '87', '88'],\n" + 
  */
          "  // vertical lines:\n" +
          "  ['11', '21', '31', '41', '51', '61', '71', '81'],\n" + 
          "  ['12', '22', '32', '42', '52', '62', '72', '82'],\n" + 
          "  ['13', '23', '33', '43', '53', '63', '73', '83'],\n" + 
          "  ['14', '24', '34', '44', '54', '64', '74', '84'],\n" + 
          "  ['15', '25', '35', '45', '55', '65', '75', '85'],\n" + 
          "  ['16', '26', '36', '46', '56', '66', '76', '86'],\n" + 
          "  ['17', '27', '37', '47', '57', '67', '77', '87'],\n" + 
          "  ['18', '28', '38', '48', '58', '68', '78', '88'],\n" + 
          "  // diagonal lines:\n" +
          "  ['21', '12'],\n" + 
          "  ['31', '22', '13'],\n" + 
          "  ['41', '32', '23', '14'],\n" + 
          "  ['51', '42', '33', '24', '15'],\n" + 
          "  ['61', '52', '43', '34', '25', '16'],\n" + 
          "  ['71', '62', '53', '44', '35', '26', '17'],\n" + 
          "  ['81', '72', '63', '54', '45', '36', '27', '18'],\n" + 
          "  [      '82', '73', '64', '55', '46', '37', '28'],\n" + 
          "  [            '83', '74', '65', '56', '47', '38'],\n" + 
          "  [                  '84', '75', '66', '57', '48'],\n" + 
          "  [                        '85', '76', '67', '58'],\n" + 
          "  [                              '86', '77', '68'],\n" + 
          "  [                                    '87', '78'],\n" + 
          "  ['71', '82'],\n" + 
          "  ['61', '72', '83'],\n" + 
          "  ['51', '62', '73', '84'],\n" + 
          "  ['41', '52', '63', '74', '85'],\n" + 
          "  ['31', '42', '53', '64', '75', '86'],\n" + 
          "  ['21', '32', '43', '54', '65', '76', '87'],\n" + 
          "  ['11', '22', '33', '44', '55', '66', '77', '88'],\n" + 
          "  [      '12', '23', '34', '45', '56', '67', '78'],\n" + 
          "  [            '13', '24', '35', '46', '57', '68'],\n" + 
          "  [                  '14', '25', '36', '47', '58'],\n" + 
          "  [                        '15', '26', '37', '48'],\n" + 
          "  [                              '16', '27', '38'],\n" + 
          "  [                                    '17', '28']\n" + 
          "];\n" + 
          "\n" + 
          "// Now we look at whether more than one queen is present on any of these lines.\n" + 
          "// If so, we will store the violation in the string variable 'violation'.\n" + 
          "var violation = '';\n" +
          "for (var li = 0; li < lines.length; li++) {\n" + 
          "  var line = lines[li];\n" + 
          "  var numberOfQueens = 0;\n" +
          "  for (var ci = 0; ci < line.length; ci++) {\n" + 
          "    if ($('#p' + line[ci]).html() != '') {\n" +
          "      numberOfQueens++;\n" +
          "    }\n" +
          "  }\n" + 
          "  if (numberOfQueens > 1) {\n" +
          "    // We have found more than one queen on a line.\n" +
          "    violation = numberOfQueens + ' queens found on a line';\n" +
          "    // No need to look any further. Break the loop.\n" +
          "    break;\n" +
          "  }\n" +
          "}\n" + 
          "\n" + 
          "// Check whether a violation was found.\n" + 
          "if (violation != '') {\n" +
          "  // We have found a violation, mark the world as illegal.\n" +
          "  world.illegal(violation);\n" +
          "} else  {\n" +
          "  // No violations found. Check whether the goal is achieved:\n" +
          "  if($('tr.done').length == 8) {\n" +
          "    // We have placed a queen on each of the eight rows without violations:\n" +
          "    world.goal('8 queens!');\n" +
          "  }\n" +
          "}\n" +
          "\n" + 
          "\n",

    searchAlgorithm:
          "left-side-first"
  }

/*
        "// Find horizontal, vertical or diagonal violations.\n" +
        "var violation = '';\n" +
        "\n" +
        "// check horizontal violations:\n" +
        "for (var row = 1; row <= 8; row++) {\n" +
        "  var numberOfQueens = 0;\n" +
        "  for (var column = 1; column <= 8; column++) {\n" +
        "    if ($('#p' + row + column).html() != '') {\n" +
        "      numberOfQueens++;\n" +
        "    }\n" +
        "  }\n" +
        "  if (numberOfQueens > 1) {\n" +
        "    violation = numberOfQueens + ' queens in row ' + row;\n" +
        "    break;\n" +
        "  }\n" +
        "}\n" +
        "\n" +
        "if (!violation) {\n" +
        "  // check vertical violations:\n" +
        "  for (var column = 1; column <= 8; column++) {\n" +
        "    var numberOfQueens = 0;\n" +
        "    for (var row = 1; row <= 8; row++) {\n" +
        "      if ($('#p' + row + column).html() != '') {\n" +
        "        numberOfQueens++;\n" +
        "      }\n" +
        "    }\n" +
        "    if (numberOfQueens > 1) {\n" +
        "      violation = numberOfQueens + ' queens in column ' + column;\n" +
        "      break;\n" +
        "    }\n" +
        "  }\n" +
        "}\n" +
        "\n" +
        "if (!violation) {\n" +
        "  // check right-up diagonal violations:\n" +
        "  for (var row = 2; row <= 8; row++) {\n" +
        "    var numberOfQueens = 0;\n" +
        "    var rowi = row;\n" +
        "    var column = 1;\n" +
        "    while ((rowi >= 1) && (column <= 8)) {\n" +
        "      if ($('#p' + rowi + column).html() != '') {\n" +
        "        numberOfQueens++;\n" +
        "      }\n" +
        "      rowi--;\n" +
        "      column++;\n" +
        "    }\n" +
        "    if (numberOfQueens > 1) {\n" +
        "      violation = numberOfQueens + ' queens along diagonal';\n" +
        "      break;\n" +
        "    }\n" +
        "  }\n" +
        "  if (!violation) {\n" +
        "    for (var column = 2; column <= 7; column++) {\n" +
        "      var numberOfQueens = 0;\n" +
        "      var row = 8;\n" +
        "      var columni = column;\n" +
        "      while ((row >= 1) && (columni <= 8)) {\n" +
        "        if ($('#p' + row + columni).html() != '') {\n" +
        "          numberOfQueens++;\n" +
        "        }\n" +
        "        row--;\n" +
        "        columni++;\n" +
        "      }\n" +
        "      if (numberOfQueens > 1) {\n" +
        "        violation = numberOfQueens + ' queens along diagonal';\n" +
        "        break;\n" +
        "      }\n" +
        "    }\n" +
        "  }\n" +
        "}\n" +
        "\n" +
        "if (!violation) {\n" +
        "  // check right-down diagonal violations:\n" +
        "  for (var row = 7; row >= 1; row--) {\n" +
        "    var numberOfQueens = 0;\n" +
        "    var rowi = row;\n" +
        "    var column = 1;\n" +
        "    while ((rowi <= 8) && (column <= 8)) {\n" +
        "      if ($('#p' + rowi + column).html() != '') {\n" +
        "        numberOfQueens++;\n" +
        "      }\n" +
        "      rowi++;\n" +
        "      column++;\n" +
        "    }\n" +
        "    if (numberOfQueens > 1) {\n" +
        "      violation = numberOfQueens + ' queens along diagonal';\n" +
        "      break;\n" +
        "    }\n" +
        "  }\n" +
        "  if (!violation) {\n" +
        "    for (var column = 2; column <= 7; column++) {\n" +
        "      var numberOfQueens = 0;\n" +
        "      var row = 1;\n" +
        "      var columni = column;\n" +
        "      while ((row <= 8) && (columni <= 8)) {\n" +
        "        if ($('#p' + row + columni).html() != '') {\n" +
        "          numberOfQueens++;\n" +
        "        }\n" +
        "        row++;\n" +
        "        columni++;\n" +
        "      }\n" +
        "      if (numberOfQueens > 1) {\n" +
        "        violation = numberOfQueens + ' queens along diagonal';\n" +
        "        break;\n" +
        "      }\n" +
        "    }\n" +
        "  }\n" +
        "}\n" +
        "\n" +
        "if (violation) {\n" +
        "  //We have found a violation, mark the world as illegal.\n" +
        "  world.illegal(violation);\n" +
        "} else  {\n" +
        "  // Check whether the goal is achieved:\n" +
        "  if($('tr.done').length == 8) {\n" +
        "    // We have placed a queen on each of the eight rows without vialations:\n" +
        "    world.goal('8 queens!');\n" +
        "  }\n" +
        "}\n" +
        ""
*/
});


