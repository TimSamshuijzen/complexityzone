// Copyright 2012 Tim Samshuijzen.

include("ccommon.js");
include("cpanel.js");
include("ctexteditpanel.js");
include("cscrollboxpanel.js");
include("ctabmenupanel.js");
include("cautospanpanel.js");
include("clsModalPanel.js");
include("ciframepanel.js");
include("cfuture.js");
include("cmultiverse.js");
include("cmodel.js");
include("cmultiversefuturepanel.js");
include("clsCheckBox.js");

/**
 * Class cViewMultiversePanel
 */
// Instance class constructor:
function cViewMultiversePanel(aProperties) {
  // Call the base constructor:
  cPanel.call(this, aProperties);

  var lThis = this;

  this.screen = aProperties.screen;
  this.futureGeneratorThreadActive = false;
  this.maxTotalFutures = 1000;
  this.firstOnVisible = true;
  this.expansionMode = cViewMultiversePanel.eExpansionMode_Manual;
  this.viewMode = cViewMultiversePanel.eViewMode_Fit;
  this.viewOffset = { left: 0, top: 0 };
  this.changesImageId = aProperties.changesImage;
  this.evaluateImageId = aProperties.evaluateImage;

  this.viewMultiverse = new cPanel({
    align : eAlign.eClient,
    backgroundColor : 'transparent'
  });
  this.panels.push(this.viewMultiverse);

  this.viewOverlay = null;



  // top control panel
  
  this.topControlPanel = new cPanel({
    align : eAlign.eTop,
    height : 48,
    paddingBottom : 4,
    backgroundColor : '#777777'
  });
  this.viewMultiverse.panels.push(this.topControlPanel);
  

  // inner control panel

  this.topControlPanel.innerControlPanel = new cPanel({
    align : eAlign.eClient, //eAlign.eLeft,
    width : 624,
    backgroundColor : '#777777' //'#222222'
  });
  this.topControlPanel.panels.push(this.topControlPanel.innerControlPanel);


  // Home button

  this.topControlPanel.innerControlPanel.homePanel = new cPanel({
    align : eAlign.eLeft,
    width : 100,
    paddingTop : 10,
    shape: cPanel.cShapeRoundRect,
    borderRadius: 8,
    backgroundColor : '#333333',
    color : '#cccccc',
    fontSize : 20,
    fontBold : true,
    textAlign : eTextAlign.eCenter,
    innerHTML: 'HOME',
    onClick : function () {
      var lWindowWidth = lThis.viewFlat.viewMultiverse_Future.getInnerWidth();
      var lHalfWindowWidth = ((lWindowWidth / 2) | 0);
      
      lThis.viewOffset.left = lHalfWindowWidth;
      if (lThis.viewOffset.left > 240) {
        lThis.viewOffset.left = 240;
      }
      lThis.viewOffset.top = 140;

      lThis.onUpdateMultiverse();
    }
  });
  this.topControlPanel.innerControlPanel.panels.push(this.topControlPanel.innerControlPanel.homePanel);


  // view mode panel

  this.topControlPanel.innerControlPanel.viewModePanel = new cPanel({
    align : eAlign.eLeft,
    width : 292,
    marginLeft : 10,
    //padding : 4,
    backgroundColor : 'transparent'
  });
  this.topControlPanel.innerControlPanel.panels.push(this.topControlPanel.innerControlPanel.viewModePanel);

  this.topControlPanel.innerControlPanel.viewModePanel.labelPanel = new cPanel({
    align : eAlign.eLeft,
    width : 86,
    marginLeft : 20,
    marginRight : 10,
    paddingTop: 12,
    backgroundColor : 'transparent',
    color : '#eeeeee',
    fontSize : 16,
    fontBold : true,
    textAlign : eTextAlign.eRight,
    innerHTML: 'ZOOM:'
  });
  this.topControlPanel.innerControlPanel.viewModePanel.panels.push(this.topControlPanel.innerControlPanel.viewModePanel.labelPanel);
  
  this.topControlPanel.innerControlPanel.viewModePanel.fitPanel = new cPanel({
    align : eAlign.eLeft,
    width : 96,
    marginRight : 4,
    shape: cPanel.cShapeRoundRect,
    borderRadius: 8,
    backgroundColor : '#333333',
    onClick : function () {
      if (lThis.viewMode != cViewMultiversePanel.eViewMode_Fit) {
        lThis.viewMode = cViewMultiversePanel.eViewMode_Fit;
        lThis.topControlPanel.innerControlPanel.viewModePanel.fitPanel.labelPanel.setColor('#ffffff');
        lThis.topControlPanel.innerControlPanel.viewModePanel.fitPanel.indicatorPanel.setBackgroundColor('#993333');
        lThis.topControlPanel.innerControlPanel.viewModePanel.flatPanel.labelPanel.setColor('#cccccc');
        lThis.topControlPanel.innerControlPanel.viewModePanel.flatPanel.indicatorPanel.setBackgroundColor('transparent');
        lThis.viewFlat.hide();
        lThis.viewFit.show();
        lThis.onUpdateMultiverse();
      }
    }
  });
  this.topControlPanel.innerControlPanel.viewModePanel.panels.push(this.topControlPanel.innerControlPanel.viewModePanel.fitPanel);

  this.topControlPanel.innerControlPanel.viewModePanel.fitPanel.labelPanel = new cPanel({
    align : eAlign.eClient,
    paddingTop: 12,
    backgroundColor : 'transparent',
    color : (this.viewMode == cViewMultiversePanel.eViewMode_Fit ? '#ffffff' : '#cccccc'),
    fontSize : 12,
    fontBold : true,
    textAlign : eTextAlign.eCenter,
    innerHTML: 'OUT',
    cursor: 'pointer'
  });
  this.topControlPanel.innerControlPanel.viewModePanel.fitPanel.panels.push(this.topControlPanel.innerControlPanel.viewModePanel.fitPanel.labelPanel);
  
  this.topControlPanel.innerControlPanel.viewModePanel.fitPanel.indicatorPanel = new cPanel({
    align : eAlign.eNone,
    left : 12,
    top : 32,
    width : 70,
    height : 4,
    backgroundColor : (this.viewMode == cViewMultiversePanel.eViewMode_Fit ? '#993333' : 'transparent')
  });
  this.topControlPanel.innerControlPanel.viewModePanel.fitPanel.panels.push(this.topControlPanel.innerControlPanel.viewModePanel.fitPanel.indicatorPanel);

  this.topControlPanel.innerControlPanel.viewModePanel.flatPanel = new cPanel({
    align : eAlign.eLeft,
    width : 96,
    marginRight : 4,
    shape: cPanel.cShapeRoundRect,
    borderRadius: 8,
    backgroundColor : '#333333',
    onClick : function () {
      if (lThis.viewMode != cViewMultiversePanel.eViewMode_Flat) {
        lThis.viewMode = cViewMultiversePanel.eViewMode_Flat;
        lThis.topControlPanel.innerControlPanel.viewModePanel.fitPanel.labelPanel.setColor('#cccccc');
        lThis.topControlPanel.innerControlPanel.viewModePanel.fitPanel.indicatorPanel.setBackgroundColor('transparent');
        lThis.topControlPanel.innerControlPanel.viewModePanel.flatPanel.labelPanel.setColor('#ffffff');
        lThis.topControlPanel.innerControlPanel.viewModePanel.flatPanel.indicatorPanel.setBackgroundColor('#993333');
        lThis.viewFlat.show();
        lThis.viewFit.hide();
        lThis.onUpdateMultiverse();
      }
    }
  });
  this.topControlPanel.innerControlPanel.viewModePanel.panels.push(this.topControlPanel.innerControlPanel.viewModePanel.flatPanel);

  this.topControlPanel.innerControlPanel.viewModePanel.flatPanel.labelPanel = new cPanel({
    align : eAlign.eClient,
    paddingTop: 2,
    backgroundColor : 'transparent',
    color : (this.viewMode == cViewMultiversePanel.eViewMode_Flat ? '#ffffff' : '#cccccc'),
    fontSize : 26,
    fontBold : true,
    textAlign : eTextAlign.eCenter,
    innerHTML: 'IN',
    cursor: 'pointer'
  });
  this.topControlPanel.innerControlPanel.viewModePanel.flatPanel.panels.push(this.topControlPanel.innerControlPanel.viewModePanel.flatPanel.labelPanel);
  
  this.topControlPanel.innerControlPanel.viewModePanel.flatPanel.indicatorPanel = new cPanel({
    align : eAlign.eNone,
    left : 12,
    top : 32,
    width : 70,
    height : 4,
    backgroundColor : (this.viewMode == cViewMultiversePanel.eViewMode_Flat ? '#993333' : 'transparent')
  });
  this.topControlPanel.innerControlPanel.viewModePanel.flatPanel.panels.push(this.topControlPanel.innerControlPanel.viewModePanel.flatPanel.indicatorPanel);


  // multiverse size panel
  
  this.topControlPanel.innerControlPanel.muliverseSizePanel = new cPanel({
    align : eAlign.eLeft,
    width : 220,
    marginLeft: 20,
    marginTop: 2,
    marginBottom: 2,
    //padding : 4,
    //shape: cPanel.cShapeRoundRect,
    //borderRadius: 12,
    //border: 4,
    //borderColor: '#222222',
    backgroundColor : '#333333'
  });
  this.topControlPanel.innerControlPanel.panels.push(this.topControlPanel.innerControlPanel.muliverseSizePanel);
  
  this.topControlPanel.innerControlPanel.muliverseSizePanel.scrollPanel = new cPanel({
    align : eAlign.eNone,
    left :  0,
    top : 0,
    height : 40,
    width : 1, // filled dynamically
    backgroundColor : '#444444'
  });
  this.topControlPanel.innerControlPanel.muliverseSizePanel.panels.push(this.topControlPanel.innerControlPanel.muliverseSizePanel.scrollPanel);

  this.topControlPanel.innerControlPanel.muliverseSizePanel.labelPanel = new cPanel({
    align : eAlign.eClient,
    paddingTop: 8,
    backgroundColor : 'transparent',
    color : '#cccccc',
    fontSize : 20,
    fontBold : true,
    textAlign : eTextAlign.eCenter,
    innerHTML: '' // filled dynamically
  });
  this.topControlPanel.innerControlPanel.muliverseSizePanel.panels.push(this.topControlPanel.innerControlPanel.muliverseSizePanel.labelPanel);

  this.topControlPanel.innerControlPanel.muliverseSizePanel.setNumberOfWorlds = function(aNumberOfWorlds, aMaxNumberOfWorlds) {
    lThis.topControlPanel.innerControlPanel.muliverseSizePanel.scrollPanel.setWidth((((lThis.topControlPanel.innerControlPanel.muliverseSizePanel.width - 20) * aNumberOfWorlds) / aMaxNumberOfWorlds) | 0);
    lThis.topControlPanel.innerControlPanel.muliverseSizePanel.labelPanel.setInnerHTML('' + aNumberOfWorlds + ' ' + (aNumberOfWorlds == 1 ? 'world' : 'worlds'));
  };



  // bottom control panel

  this.bottomControlPanel = new cPanel({
    align : eAlign.eBottom,
    height : 48,
    paddingTop : 4,
    backgroundColor : '#777777'
  });
  this.viewMultiverse.panels.push(this.bottomControlPanel);

  // inner control panel

  this.bottomControlPanel.innerControlPanel = new cPanel({
    align : eAlign.eClient, //eAlign.eLeft,
    width : 624,
    backgroundColor : '#777777' //'#222222'
  });
  this.bottomControlPanel.panels.push(this.bottomControlPanel.innerControlPanel);

  // Reset multiverse button

  this.bottomControlPanel.innerControlPanel.resetMuliversePanel = new cPanel({
    align : eAlign.eLeft,
    width : 100,
    paddingTop : 10,
    shape: cPanel.cShapeRoundRect,
    borderRadius: 8,
    backgroundColor : '#333333',
    color : '#cccccc',
    fontSize : 20,
    fontBold : true,
    textAlign : eTextAlign.eCenter,
    innerHTML: 'RESET',
    onClick : function () {
      lThis.resetMultiverse();
    }
  });
  this.bottomControlPanel.innerControlPanel.panels.push(this.bottomControlPanel.innerControlPanel.resetMuliversePanel);


  // expansion mode panel
  
  this.bottomControlPanel.innerControlPanel.expansionModePanel = new cPanel({
    align : eAlign.eLeft,
    width : 292,
    //padding : 4,
    //shape: cPanel.cShapeRoundRect,
    borderRadius: 12,
    backgroundColor : 'transparent' //'#222222'
  });
  this.bottomControlPanel.innerControlPanel.panels.push(this.bottomControlPanel.innerControlPanel.expansionModePanel);
  
  this.bottomControlPanel.innerControlPanel.expansionModePanel.labelPanel = new cPanel({
    align : eAlign.eLeft,
    width : 96,
    marginLeft : 10,
    marginRight : 10,
    paddingTop: 3,
    backgroundColor : 'transparent',
    color : '#eeeeee',
    fontSize : 16,
    fontBold : true,
    textAlign : eTextAlign.eRight,
    innerHTML: 'AUTO SEARCH:'
  });
  this.bottomControlPanel.innerControlPanel.expansionModePanel.panels.push(this.bottomControlPanel.innerControlPanel.expansionModePanel.labelPanel);
  
  this.bottomControlPanel.innerControlPanel.expansionModePanel.manualPanel = new cPanel({
    align : eAlign.eLeft,
    width : 96,
    marginRight : 4,
    shape: cPanel.cShapeRoundRect,
    borderRadius: 8,
    backgroundColor : '#333333',
    onClick : function () {
      lThis.expansionMode = cViewMultiversePanel.eExpansionMode_Manual;
      lThis.bottomControlPanel.innerControlPanel.expansionModePanel.manualPanel.labelPanel.setColor('#ffffff');
      lThis.bottomControlPanel.innerControlPanel.expansionModePanel.manualPanel.indicatorPanel.setBackgroundColor('#993333');
      lThis.bottomControlPanel.innerControlPanel.expansionModePanel.autoPanel.labelPanel.setColor('#33cc33');
      lThis.bottomControlPanel.innerControlPanel.expansionModePanel.autoPanel.indicatorPanel.setBackgroundColor('transparent');
      lThis.onUpdateMultiverse();
    }
  });
  this.bottomControlPanel.innerControlPanel.expansionModePanel.panels.push(this.bottomControlPanel.innerControlPanel.expansionModePanel.manualPanel);

  this.bottomControlPanel.innerControlPanel.expansionModePanel.manualPanel.labelPanel = new cPanel({
    align : eAlign.eClient,
    paddingTop: 4,
    backgroundColor : 'transparent',
    color : '#ffffff',
    fontSize : 20,
    fontBold : true,
    textAlign : eTextAlign.eCenter,
    innerHTML: 'PAUSE',
    cursor: 'pointer'
  });
  this.bottomControlPanel.innerControlPanel.expansionModePanel.manualPanel.panels.push(this.bottomControlPanel.innerControlPanel.expansionModePanel.manualPanel.labelPanel);
  
  this.bottomControlPanel.innerControlPanel.expansionModePanel.manualPanel.indicatorPanel = new cPanel({
    align : eAlign.eNone,
    left : 12,
    top : 32,
    width : 70,
    height : 4,
    backgroundColor :  '#993333' //'transparent' // '#993333'
  });
  this.bottomControlPanel.innerControlPanel.expansionModePanel.manualPanel.panels.push(this.bottomControlPanel.innerControlPanel.expansionModePanel.manualPanel.indicatorPanel);
  
  this.bottomControlPanel.innerControlPanel.expansionModePanel.autoPanel = new cPanel({
    align : eAlign.eLeft,
    width : 96,
    marginRight : 4,
    shape: cPanel.cShapeRoundRect,
    borderRadius: 8,
    backgroundColor : '#333333',
    onClick : function () {
      lThis.expansionMode = cViewMultiversePanel.eExpansionMode_Auto;
      lThis.bottomControlPanel.innerControlPanel.expansionModePanel.manualPanel.labelPanel.setColor('#cccccc');
      lThis.bottomControlPanel.innerControlPanel.expansionModePanel.manualPanel.indicatorPanel.setBackgroundColor('transparent');
      lThis.bottomControlPanel.innerControlPanel.expansionModePanel.autoPanel.labelPanel.setColor('#33cc33');
      lThis.bottomControlPanel.innerControlPanel.expansionModePanel.autoPanel.indicatorPanel.setBackgroundColor('#993333');
      lThis.onUpdateMultiverse();
    }
  });
  this.bottomControlPanel.innerControlPanel.expansionModePanel.panels.push(this.bottomControlPanel.innerControlPanel.expansionModePanel.autoPanel);

  this.bottomControlPanel.innerControlPanel.expansionModePanel.autoPanel.labelPanel = new cPanel({
    align : eAlign.eClient,
    paddingTop: 4,
    backgroundColor : 'transparent',
    color : '#33cc33', //'#33cc33', //#cccccc',
    fontSize : 20,
    fontBold : true,
    textAlign : eTextAlign.eCenter,
    innerHTML: 'GO!',
    cursor: 'pointer'
  });
  this.bottomControlPanel.innerControlPanel.expansionModePanel.autoPanel.panels.push(this.bottomControlPanel.innerControlPanel.expansionModePanel.autoPanel.labelPanel);
  
  this.bottomControlPanel.innerControlPanel.expansionModePanel.autoPanel.indicatorPanel = new cPanel({
    align : eAlign.eNone,
    left : 12,
    top : 32,
    width : 70,
    height : 4,
    backgroundColor : 'transparent' //'#993333'
  });
  this.bottomControlPanel.innerControlPanel.expansionModePanel.autoPanel.panels.push(this.bottomControlPanel.innerControlPanel.expansionModePanel.autoPanel.indicatorPanel);
    

  // Expansion options

  this.bottomControlPanel.innerControlPanel.searchMethodOptionsPanel = new cPanel({
    align : eAlign.eLeft,
    width : 180,
    marginLeft : 20,
    paddingTop : 3,
    shape: cPanel.cShapeRoundRect,
    borderRadius: 8,
    backgroundColor : '#333333',
    color : '#cccccc',
    fontSize : 15,
    fontBold : true,
    textAlign : eTextAlign.eCenter,
    innerHTML: 'Search method<br /><span style="color: #ffffff;">breadth-first</span>',
    onClick : function () {
      var lModalPanel = new clsModalPanel({
        onClick: function() {
          setTimeout(function() {
            lThis.screen.panel.removePanel(lModalPanel);
          }, 10);
        }
      });
      lThis.screen.panel.appendPanel(lModalPanel);

      lModalPanel.optionsPanel = new cPanel({
        align: eAlign.eCenter,
        shape: cPanel.cShapeRoundRect,
        width: 720,
        height: 480,
        border: 1,
        borderColor: '#262626',
        borderRadius: 16,
        backgroundColor: '#262626', 
        color: '#ffffff',
        fontSize: 36,
        onClick: function() {
          this.stopBubble = true;
        }
      });
      lModalPanel.contentPanel.panels.push(lModalPanel.optionsPanel);
      lModalPanel.optionsPanel.headerPanel = new cPanel({
        align: eAlign.eTop,
        height: 50,
        paddingLeft: 20,
        backgroundColor: '#444444', 
        color: '#eeeeee',
        fontSize: 36,
        innerHTML: 'Search method'
      });
      lModalPanel.optionsPanel.panels.push(lModalPanel.optionsPanel.headerPanel);
      
      lModalPanel.optionsPanel.bottomPanel = new cPanel({
        align: eAlign.eBottom,
        height: 70,
        paddingLeft: 20,
        backgroundColor: '#444444'
      });
      lModalPanel.optionsPanel.panels.push(lModalPanel.optionsPanel.bottomPanel);

      lModalPanel.optionsPanel.bottomPanel.closeButton = new cPanel({
        align: eAlign.eCenterVertical,
        shape: cPanel.cShapeRoundRect,
        width: 200,
        marginTop: 10,
        marginBottom: 10,
        padding: 2,
        backgroundColor: '#262626',
        border: 1,
        borderColor: '#262626',
        borderRadius: 16,
        color: '#eeeeee',
        fontSize: 36,
        textAlign: eTextAlign.eCenter,
        innerHTML: 'close',
        onClick: function() {
          this.stopBubble = true;
          setTimeout(function() {
            lThis.screen.panel.removePanel(lModalPanel);
          }, 10);
        }
      });
      lModalPanel.optionsPanel.bottomPanel.panels.push(lModalPanel.optionsPanel.bottomPanel.closeButton);

      lModalPanel.optionsPanel.contentPanel = new cPanel({
        align: eAlign.eClient,
        paddingTop: 20,
        backgroundColor: 'transparent'
      });
      lModalPanel.optionsPanel.panels.push(lModalPanel.optionsPanel.contentPanel);

      // breadth first
      lModalPanel.optionsPanel.contentPanel.optionBreadthFirstPanel = new cPanel({
        align: eAlign.eTop,
        height: 80,
        backgroundColor: 'transparent',
        onClick: function() {
          this.stopBubble = true;
          lModalPanel.optionsPanel.contentPanel.optionBreadthFirstPanel.checkBoxPanel.setChecked(true);
        }
      });
      lModalPanel.optionsPanel.contentPanel.panels.push(lModalPanel.optionsPanel.contentPanel.optionBreadthFirstPanel);

      lModalPanel.optionsPanel.contentPanel.optionBreadthFirstPanel.checkBoxPanel = new clsCheckBox({
        align: eAlign.eLeft,
        width: 100,
        marginLeft: 30,
        marginTop: 10,
        marginRight: 10,
        marginBottom: 10,
        backgroundColor: '#101010',
        radioButtonStyle: true,
        checked: (Model.searchAlgorithm == cModel.searchAlgorithms.msaBreadthFirst),
        onCheckedChange: function() {
          if (this.checked) {
            Model.searchAlgorithm = cModel.searchAlgorithms.msaBreadthFirst;
            // uncheck other checkboxes
            lModalPanel.optionsPanel.contentPanel.optionHighScoreFirstPanel.checkBoxPanel.setChecked(false);
            lModalPanel.optionsPanel.contentPanel.optionLeftSideFirstPanel.checkBoxPanel.setChecked(false);
            lModalPanel.optionsPanel.contentPanel.optionRightSideFirstPanel.checkBoxPanel.setChecked(false);
            // update main panel button caption
            lThis.bottomControlPanel.innerControlPanel.searchMethodOptionsPanel.updateSearchMethodCaption();
          } 
        }
      });
      lModalPanel.optionsPanel.contentPanel.optionBreadthFirstPanel.panels.push(lModalPanel.optionsPanel.contentPanel.optionBreadthFirstPanel.checkBoxPanel);

      lModalPanel.optionsPanel.contentPanel.optionBreadthFirstPanel.labelPanel = new cPanel({
        align: eAlign.eLeft,
        width: 600,
        paddingLeft: 30,
        paddingTop: 20,
        backgroundColor: 'transparent', //'#aa9977',
        fontSize: 32,
        color: '#eeeeee',
        innerHTML: 'breadth first'
      });
      lModalPanel.optionsPanel.contentPanel.optionBreadthFirstPanel.panels.push(lModalPanel.optionsPanel.contentPanel.optionBreadthFirstPanel.labelPanel);


      // high like-score first
      lModalPanel.optionsPanel.contentPanel.optionHighScoreFirstPanel = new cPanel({
        align: eAlign.eTop,
        height: 80,
        backgroundColor: 'transparent',
        onClick: function() {
          this.stopBubble = true;
          lModalPanel.optionsPanel.contentPanel.optionHighScoreFirstPanel.checkBoxPanel.setChecked(true);
        }
      });
      lModalPanel.optionsPanel.contentPanel.panels.push(lModalPanel.optionsPanel.contentPanel.optionHighScoreFirstPanel);

      lModalPanel.optionsPanel.contentPanel.optionHighScoreFirstPanel.checkBoxPanel = new clsCheckBox({
        align: eAlign.eLeft,
        width: 100,
        marginLeft: 30,
        marginTop: 10,
        marginRight: 10,
        marginBottom: 10,
        backgroundColor: '#101010',
        radioButtonStyle: true,
        checked: (Model.searchAlgorithm == cModel.searchAlgorithms.msaHighScoreFirst),
        onCheckedChange: function() {
          if (this.checked) {
            Model.searchAlgorithm = cModel.searchAlgorithms.msaHighScoreFirst;
            // uncheck other checkboxes
            lModalPanel.optionsPanel.contentPanel.optionBreadthFirstPanel.checkBoxPanel.setChecked(false);
            lModalPanel.optionsPanel.contentPanel.optionLeftSideFirstPanel.checkBoxPanel.setChecked(false);
            lModalPanel.optionsPanel.contentPanel.optionRightSideFirstPanel.checkBoxPanel.setChecked(false);
            // update main panel button caption
            lThis.bottomControlPanel.innerControlPanel.searchMethodOptionsPanel.updateSearchMethodCaption();
          } 
        }
      });
      lModalPanel.optionsPanel.contentPanel.optionHighScoreFirstPanel.panels.push(lModalPanel.optionsPanel.contentPanel.optionHighScoreFirstPanel.checkBoxPanel);

      lModalPanel.optionsPanel.contentPanel.optionHighScoreFirstPanel.labelPanel = new cPanel({
        align: eAlign.eLeft,
        width: 600,
        paddingLeft: 30,
        paddingTop: 20,
        backgroundColor: 'transparent', //'#aa9977',
        fontSize: 32,
        color: '#eeeeee',
        innerHTML: 'high like-score first'
      });
      lModalPanel.optionsPanel.contentPanel.optionHighScoreFirstPanel.panels.push(lModalPanel.optionsPanel.contentPanel.optionHighScoreFirstPanel.labelPanel);

      // left side first
      lModalPanel.optionsPanel.contentPanel.optionLeftSideFirstPanel = new cPanel({
        align: eAlign.eTop,
        height: 80,
        backgroundColor: 'transparent',
        onClick: function() {
          this.stopBubble = true;
          lModalPanel.optionsPanel.contentPanel.optionLeftSideFirstPanel.checkBoxPanel.setChecked(true);
        }
      });
      lModalPanel.optionsPanel.contentPanel.panels.push(lModalPanel.optionsPanel.contentPanel.optionLeftSideFirstPanel);

      lModalPanel.optionsPanel.contentPanel.optionLeftSideFirstPanel.checkBoxPanel = new clsCheckBox({
        align: eAlign.eLeft,
        width: 100,
        marginLeft: 30,
        marginTop: 10,
        marginRight: 10,
        marginBottom: 10,
        backgroundColor: '#101010',
        radioButtonStyle: true,
        checked: (Model.searchAlgorithm == cModel.searchAlgorithms.msaLeftSideFirst),
        onCheckedChange: function() {
          if (this.checked) {
            Model.searchAlgorithm = cModel.searchAlgorithms.msaLeftSideFirst;
            // uncheck other checkboxes
            lModalPanel.optionsPanel.contentPanel.optionBreadthFirstPanel.checkBoxPanel.setChecked(false);
            lModalPanel.optionsPanel.contentPanel.optionHighScoreFirstPanel.checkBoxPanel.setChecked(false);
            lModalPanel.optionsPanel.contentPanel.optionRightSideFirstPanel.checkBoxPanel.setChecked(false);
            // update main panel button caption
            lThis.bottomControlPanel.innerControlPanel.searchMethodOptionsPanel.updateSearchMethodCaption();
          } 
        }
      });
      lModalPanel.optionsPanel.contentPanel.optionLeftSideFirstPanel.panels.push(lModalPanel.optionsPanel.contentPanel.optionLeftSideFirstPanel.checkBoxPanel);

      lModalPanel.optionsPanel.contentPanel.optionLeftSideFirstPanel.labelPanel = new cPanel({
        align: eAlign.eLeft,
        width: 600,
        paddingLeft: 30,
        paddingTop: 20,
        backgroundColor: 'transparent', //'#aa9977',
        fontSize: 32,
        color: '#eeeeee',
        innerHTML: 'left side first'
      });
      lModalPanel.optionsPanel.contentPanel.optionLeftSideFirstPanel.panels.push(lModalPanel.optionsPanel.contentPanel.optionLeftSideFirstPanel.labelPanel);

      // right side first
      lModalPanel.optionsPanel.contentPanel.optionRightSideFirstPanel = new cPanel({
        align: eAlign.eTop,
        height: 80,
        backgroundColor: 'transparent',
        onClick: function() {
          this.stopBubble = true;
          lModalPanel.optionsPanel.contentPanel.optionRightSideFirstPanel.checkBoxPanel.setChecked(true);
        }
      });
      lModalPanel.optionsPanel.contentPanel.panels.push(lModalPanel.optionsPanel.contentPanel.optionRightSideFirstPanel);

      lModalPanel.optionsPanel.contentPanel.optionRightSideFirstPanel.checkBoxPanel = new clsCheckBox({
        align: eAlign.eLeft,
        width: 100,
        marginLeft: 30,
        marginTop: 10,
        marginRight: 10,
        marginBottom: 10,
        backgroundColor: '#101010',
        radioButtonStyle: true,
        checked: (Model.searchAlgorithm == cModel.searchAlgorithms.msaRightSideFirst),
        onCheckedChange: function() {
          if (this.checked) {
            Model.searchAlgorithm = cModel.searchAlgorithms.msaRightSideFirst;
            // uncheck other checkboxes
            lModalPanel.optionsPanel.contentPanel.optionBreadthFirstPanel.checkBoxPanel.setChecked(false);
            lModalPanel.optionsPanel.contentPanel.optionHighScoreFirstPanel.checkBoxPanel.setChecked(false);
            lModalPanel.optionsPanel.contentPanel.optionLeftSideFirstPanel.checkBoxPanel.setChecked(false);
            // update main panel button caption
            lThis.bottomControlPanel.innerControlPanel.searchMethodOptionsPanel.updateSearchMethodCaption();
          } 
        }
      });
      lModalPanel.optionsPanel.contentPanel.optionRightSideFirstPanel.panels.push(lModalPanel.optionsPanel.contentPanel.optionRightSideFirstPanel.checkBoxPanel);

      lModalPanel.optionsPanel.contentPanel.optionRightSideFirstPanel.labelPanel = new cPanel({
        align: eAlign.eLeft,
        width: 600,
        paddingLeft: 30,
        paddingTop: 20,
        backgroundColor: 'transparent', //'#aa9977',
        fontSize: 32,
        color: '#eeeeee',
        innerHTML: 'right side first'
      });
      lModalPanel.optionsPanel.contentPanel.optionRightSideFirstPanel.panels.push(lModalPanel.optionsPanel.contentPanel.optionRightSideFirstPanel.labelPanel);


      lModalPanel.contentPanel.rerender();
      lModalPanel.optionsPanel.rerender();
      lModalPanel.contentPanel.rerender();
    }
  });
  this.bottomControlPanel.innerControlPanel.panels.push(this.bottomControlPanel.innerControlPanel.searchMethodOptionsPanel);
  this.bottomControlPanel.innerControlPanel.searchMethodOptionsPanel.updateSearchMethodCaption = function() {
    var lCaption = 'Search method<br /><span style="color: #ffffff;">';
    if (Model.searchAlgorithm == cModel.searchAlgorithms.msaBreadthFirst) {
      lCaption += 'breadth first';
    } else if (Model.searchAlgorithm == cModel.searchAlgorithms.msaHighScoreFirst) {
      lCaption += 'high like-score first';
    } else if (Model.searchAlgorithm == cModel.searchAlgorithms.msaLeftSideFirst) {
      lCaption += 'left side first';
    } else if (Model.searchAlgorithm == cModel.searchAlgorithms.msaRightSideFirst) {
      lCaption += 'right side first';
    }
    lCaption += '</span>';
    this.setInnerHTML(lCaption);
  };
  this.bottomControlPanel.innerControlPanel.searchMethodOptionsPanel.updateSearchMethodCaption();


  // search options

  this.bottomControlPanel.innerControlPanel.optionsPanel = new cPanel({
    align : eAlign.eLeft,
    width : 140,
    marginLeft : 20,
    paddingTop : 10,
    shape: cPanel.cShapeRoundRect,
    borderRadius: 8,
    backgroundColor : '#333333',
    color : '#cccccc',
    fontSize : 20,
    fontBold : true,
    textAlign : eTextAlign.eCenter,
    innerHTML: 'OPTIONS',
    onClick : function () {
      var lModalPanel = new clsModalPanel({
        onClick: function() {
          setTimeout(function() {
            lThis.screen.panel.removePanel(lModalPanel);
          }, 10);
        }
      });
      lThis.screen.panel.appendPanel(lModalPanel);

      lModalPanel.optionsPanel = new cPanel({
        align: eAlign.eCenter,
        shape: cPanel.cShapeRoundRect,
        width: 720,
        height: 400,
        border: 1,
        borderColor: '#262626',
        borderRadius: 16,
        backgroundColor: '#262626', 
        color: '#ffffff',
        fontSize: 36,
        onClick: function() {
          this.stopBubble = true;
        }
      });
      lModalPanel.contentPanel.panels.push(lModalPanel.optionsPanel);
      lModalPanel.optionsPanel.headerPanel = new cPanel({
        align: eAlign.eTop,
        height: 50,
        paddingLeft: 20,
        backgroundColor: '#444444', 
        color: '#eeeeee',
        fontSize: 36,
        innerHTML: 'Multiverse options'
      });
      lModalPanel.optionsPanel.panels.push(lModalPanel.optionsPanel.headerPanel);
      
      lModalPanel.optionsPanel.bottomPanel = new cPanel({
        align: eAlign.eBottom,
        height: 70,
        paddingLeft: 20,
        backgroundColor: '#444444'
      });
      lModalPanel.optionsPanel.panels.push(lModalPanel.optionsPanel.bottomPanel);

      lModalPanel.optionsPanel.bottomPanel.closeButton = new cPanel({
        align: eAlign.eCenterVertical,
        shape: cPanel.cShapeRoundRect,
        width: 200,
        marginTop: 10,
        marginBottom: 10,
        padding: 2,
        backgroundColor: '#262626',
        border: 1,
        borderColor: '#262626',
        borderRadius: 16,
        color: '#eeeeee',
        fontSize: 36,
        textAlign: eTextAlign.eCenter,
        innerHTML: 'close',
        onClick: function() {
          this.stopBubble = true;
          setTimeout(function() {
            lThis.screen.panel.removePanel(lModalPanel);
          }, 10);
        }
      });
      lModalPanel.optionsPanel.bottomPanel.panels.push(lModalPanel.optionsPanel.bottomPanel.closeButton);

      lModalPanel.optionsPanel.contentPanel = new cPanel({
        align: eAlign.eClient,
        //paddingTop: 20,
        backgroundColor: 'transparent'
      });
      lModalPanel.optionsPanel.panels.push(lModalPanel.optionsPanel.contentPanel);


      lModalPanel.optionsPanel.contentPanel.topHeaderPanel = new cPanel({
        align: eAlign.eTop,
        height: 60,
        backgroundColor: 'transparent'
      });
      lModalPanel.optionsPanel.contentPanel.panels.push(lModalPanel.optionsPanel.contentPanel.topHeaderPanel);

      lModalPanel.optionsPanel.contentPanel.topHeaderPanel.labelPanel = new cPanel({
        align: eAlign.eClient,
        paddingLeft: 30,
        paddingTop: 10,
        backgroundColor: '#111111', //'#aa9977',
        textAlign: eTextAlign.eLeft,
        fontSize: 32,
        color: '#eeeeee',
        innerHTML: 'For each new created world:'
      });
      lModalPanel.optionsPanel.contentPanel.topHeaderPanel.panels.push(lModalPanel.optionsPanel.contentPanel.topHeaderPanel.labelPanel);



      lModalPanel.optionsPanel.contentPanel.optionStopPanel = new cPanel({
        align: eAlign.eTop,
        height: 70,
        backgroundColor: 'transparent'
      });
      lModalPanel.optionsPanel.contentPanel.panels.push(lModalPanel.optionsPanel.contentPanel.optionStopPanel);

      lModalPanel.optionsPanel.contentPanel.optionStopPanel.labelPanel = new cPanel({
        align: eAlign.eLeft,
        width: 600,
        paddingRight: 30,
        paddingTop: 15,
        backgroundColor: 'transparent', //'#aa9977',
        textAlign: eTextAlign.eRight,
        fontSize: 32,
        color: '#eeeeee',
        innerHTML: 'pause search if new goal'
      });
      lModalPanel.optionsPanel.contentPanel.optionStopPanel.panels.push(lModalPanel.optionsPanel.contentPanel.optionStopPanel.labelPanel);

      lModalPanel.optionsPanel.contentPanel.optionStopPanel.checkBoxPanel = new clsCheckBox({
        align: eAlign.eLeft,
        width: 70,
        margin: 5,
        backgroundColor: '#101010',
        checked: Model.stopSearchWhenGoalFound,
        onCheckedChange: function() {
          Model.stopSearchWhenGoalFound = this.checked;
        }
      });
      lModalPanel.optionsPanel.contentPanel.optionStopPanel.panels.push(lModalPanel.optionsPanel.contentPanel.optionStopPanel.checkBoxPanel);

      lModalPanel.optionsPanel.contentPanel.optionIgnoreRepeatsPanel = new cPanel({
        align: eAlign.eTop,
        height: 70,
        backgroundColor: 'transparent'
      });
      lModalPanel.optionsPanel.contentPanel.panels.push(lModalPanel.optionsPanel.contentPanel.optionIgnoreRepeatsPanel);

      lModalPanel.optionsPanel.contentPanel.optionIgnoreRepeatsPanel.labelPanel = new cPanel({
        align: eAlign.eLeft,
        width: 600,
        paddingRight: 30,
        paddingTop: 15,
        backgroundColor: 'transparent', //'#aa9977',
        textAlign: eTextAlign.eRight,
        fontSize: 32,
        color: '#eeeeee',
        innerHTML: 'remove if repeating sequence'
      });
      lModalPanel.optionsPanel.contentPanel.optionIgnoreRepeatsPanel.panels.push(lModalPanel.optionsPanel.contentPanel.optionIgnoreRepeatsPanel.labelPanel);

      lModalPanel.optionsPanel.contentPanel.optionIgnoreRepeatsPanel.checkBoxPanel = new clsCheckBox({
        align: eAlign.eLeft,
        width: 70,
        margin: 5,
        backgroundColor: '#101010',
        checked: Model.ignoreSameAsParentOrSibling,
        onCheckedChange: function() {
          Model.ignoreSameAsParentOrSibling = this.checked;
        }
      });
      lModalPanel.optionsPanel.contentPanel.optionIgnoreRepeatsPanel.panels.push(lModalPanel.optionsPanel.contentPanel.optionIgnoreRepeatsPanel.checkBoxPanel);

      lModalPanel.optionsPanel.contentPanel.optionIgnoreIllegalPanel = new cPanel({
        align: eAlign.eTop,
        height: 70,
        backgroundColor: 'transparent'
      });
      lModalPanel.optionsPanel.contentPanel.panels.push(lModalPanel.optionsPanel.contentPanel.optionIgnoreIllegalPanel);

      lModalPanel.optionsPanel.contentPanel.optionIgnoreIllegalPanel.labelPanel = new cPanel({
        align: eAlign.eLeft,
        width: 600,
        paddingRight: 30,
        paddingTop: 15,
        backgroundColor: 'transparent', //'#aa9977',
        textAlign: eTextAlign.eRight,
        fontSize: 32,
        color: '#eeeeee',
        innerHTML: 'remove if illegal'
      });
      lModalPanel.optionsPanel.contentPanel.optionIgnoreIllegalPanel.panels.push(lModalPanel.optionsPanel.contentPanel.optionIgnoreIllegalPanel.labelPanel);

      lModalPanel.optionsPanel.contentPanel.optionIgnoreIllegalPanel.checkBoxPanel = new clsCheckBox({
        align: eAlign.eLeft,
        width: 70,
        margin: 5,
        backgroundColor: '#101010',
        checked: Model.ignoreIllegalFutures,
        onCheckedChange: function() {
          Model.ignoreIllegalFutures = this.checked;
        }
      });
      lModalPanel.optionsPanel.contentPanel.optionIgnoreIllegalPanel.panels.push(lModalPanel.optionsPanel.contentPanel.optionIgnoreIllegalPanel.checkBoxPanel);

      lModalPanel.contentPanel.rerender();
      lModalPanel.optionsPanel.rerender();
      lModalPanel.contentPanel.rerender();
    }
  });
  this.bottomControlPanel.innerControlPanel.panels.push(this.bottomControlPanel.innerControlPanel.optionsPanel);  

  // Flat view
  
  this.viewFlat = new cPanel({
    align : eAlign.eClient,
    backgroundColor :  (this.viewMode == cViewMultiversePanel.eViewMode_Flat ? '#333333' : 'transparent'),
    visible : (this.viewMode == cViewMultiversePanel.eViewMode_Flat)
  });
  this.viewMultiverse.panels.push(this.viewFlat);

  this.viewFlat.offsetLeft = 0;
  this.viewFlat.offsetTop = 0;
  this.viewFlat.draggingOffset = false;
  this.viewFlat.draggingOffsetStartLeft = 0;
  this.viewFlat.draggingOffsetStartTop = 0;
  this.viewFlat.draggingOffsetStartX = 0;
  this.viewFlat.draggingOffsetStartY = 0;
  this.viewFlat.futurePanels = [];
  this.viewFlat.columnIndicatorPanels = [];
  this.viewFlat.levelIndicatorPanels = [];
  //this.viewFlat.horizontalScrollbarPanel = null;
  this.viewFlat.centerLinePanel = null;
  this.viewFlat.leftBlurPanel = null;
  this.viewFlat.rightBlurPanel = null;
  this.viewFlat.topBlurPanel = null;
  this.viewFlat.futureAxisImage = this.screen.getImageClone(aProperties.futureAxisImage);
  this.viewFlat.optionsAxisImage = this.screen.getImageClone(aProperties.optionsAxisImage);
  this.viewFlat.expandImageId = aProperties.expandImage;
  
  // Future view within flat view

  this.viewFlat.viewMultiverse_FutureBackground = new cPanel({
    align : eAlign.eClient,
    backgroundColor : '#333333' //'#ffeead'
  });
  this.viewFlat.panels.push(this.viewFlat.viewMultiverse_FutureBackground);

  this.viewFlat.visibleMultiversePanel = null;
  this.viewFlat.outerMultiversePanel = null;

  this.viewFlat.viewMultiverse_Future = new cPanel({
    align : eAlign.eClient,
    backgroundColor : 'transparent',
    onMouseDown : function(aX, aY) { lThis.onViewFlatFuturePanelMouseDown(aX, aY); },
    onMouseMove : function(aX, aY) { lThis.onViewFlatFuturePanelMouseMove(aX, aY); },
    onMouseUp : function(aX, aY) { lThis.onViewFlatFuturePanelMouseUp(aX, aY); },
    cursor : 'pointer',
    onScroll : function(aDelta) { lThis.onViewFlatFuturePanelScroll(aDelta); },
    onTap : function(aX, aY) { lThis.onViewFlatFuturePanelTap(aX, aY); }
  });
  this.viewFlat.panels.push(this.viewFlat.viewMultiverse_Future);
  
  this.viewFlat.viewMultiverse_FutureOverlay = new cPanel({
    align : eAlign.eClient,
    backgroundColor : 'transparent',
    invisibleToMouseEvents: true
  });
  this.viewFlat.panels.push(this.viewFlat.viewMultiverse_FutureOverlay);
  

  // Fit view
  
  this.viewFit = new cPanel({
    align : eAlign.eClient,
    backgroundColor : (this.viewMode == cViewMultiversePanel.eViewMode_Fit ? '#333333' : 'transparent'),
    visible : (this.viewMode == cViewMultiversePanel.eViewMode_Fit)
  });
  this.viewMultiverse.panels.push(this.viewFit);

  this.viewFit.offsetLeft = 0;
  this.viewFit.offsetTop = 0;
  this.viewFit.draggingOffset = false;
  this.viewFit.draggingOffsetStartLeft = 0;
  this.viewFit.draggingOffsetStartTop = 0;
  this.viewFit.draggingOffsetStartX = 0;
  this.viewFit.draggingOffsetStartY = 0;
  this.viewFit.futurePanels = [];
  this.viewFit.columnIndicatorPanels = [];
  this.viewFit.levelIndicatorPanels = [];
  this.viewFit.futureAxisImage = this.screen.getImageClone(aProperties.futureAxisImage);
  this.viewFit.optionsAxisImage = this.screen.getImageClone(aProperties.optionsAxisImage);
  
  // Future view within fit view

  this.viewFit.viewBackground = new cPanel({
    align : eAlign.eNone,
    left: 0,
    top: 0,
    width: 20000,
    height: 20000,
    backgroundColor : '#222222' //'#333333' //'#ffeead'
  });
  this.viewFit.panels.push(this.viewFit.viewBackground);

  this.viewFit.viewFuture = new cPanel({
    align : eAlign.eClient,
    backgroundColor : 'transparent',
    onMouseDown : function(aX, aY) { lThis.onViewFitFuturePanelMouseDown(aX, aY); },
    onMouseMove : function(aX, aY) { lThis.onViewFitFuturePanelMouseMove(aX, aY); },
    onMouseUp : function(aX, aY) { lThis.onViewFitFuturePanelMouseUp(aX, aY); },
    cursor : 'pointer',
    onTap : function(aX, aY) { lThis.onViewFitFuturePanelTap(aX, aY); },
    onScroll : function(aDelta) { lThis.onViewFitFuturePanelScroll(aDelta); }
  });
  this.viewFit.panels.push(this.viewFit.viewFuture);
  
  this.viewFit.viewFutureOrigin = new cPanel({
    align : eAlign.eNone,
    left: 0,
    top: 0,
    width: 20000,
    height: 20000,
    backgroundColor : 'transparent' //'#222222'
  });
  this.viewFit.viewFuture.panels.push(this.viewFit.viewFutureOrigin);

  this.viewFit.futureAxisLabel = new cPanel({
    align : eAlign.eNone,
    left: 0,
    top: 0,
    width: ((117 / 3) | 0),
    height: ((171 / 3) | 0),
    backgroundColor: 'transparent',
    image: this.viewFit.futureAxisImage,
    imageStretch: true
  });
  this.viewFit.viewFuture.panels.push(this.viewFit.futureAxisLabel);
  
  this.viewFit.optionsAxisLabel = new cPanel({
    align : eAlign.eNone,
    left: 0,
    top: 0,
    width: ((275 / 3) | 0),
    height: ((65 / 3) | 0),
    backgroundColor: 'transparent',
    image: this.viewFit.optionsAxisImage,
    imageStretch: true
  });
  this.viewFit.viewFuture.panels.push(this.viewFit.optionsAxisLabel);


  this.viewFit.viewOverlay = new cPanel({
    align : eAlign.eClient,
    backgroundColor : 'transparent',
    invisibleToMouseEvents: true
  });
  this.viewFit.panels.push(this.viewFit.viewOverlay);



}

// Class inheritance setup:
cViewMultiversePanel.deriveFrom(cPanel);
// Static class constructor:
(function() {
  cViewMultiversePanel.eViewMode_Flat = 1;
  cViewMultiversePanel.eViewMode_Fit = 2;
  cViewMultiversePanel.eExpansionMode_Manual = 1;
  cViewMultiversePanel.eExpansionMode_Auto = 2;  
  
  cViewMultiversePanel.prototype.screen = null;
  cViewMultiversePanel.prototype.futureGeneratorThreadActive = false;
  cViewMultiversePanel.prototype.maxTotalFutures = 1000;
  cViewMultiversePanel.prototype.firstOnVisible = true;
  cViewMultiversePanel.prototype.expansionMode = cViewMultiversePanel.eExpansionMode_Manual;
  cViewMultiversePanel.prototype.viewMode = cViewMultiversePanel.eViewMode_Fit;
  cViewMultiversePanel.prototype.changesImageId = null;
  cViewMultiversePanel.prototype.evaluateImageId = null;
  cViewMultiversePanel.prototype.viewMultiverse = null;
  cViewMultiversePanel.prototype.viewOverlay = null;
  cViewMultiversePanel.prototype.viewFlat = null;
  cViewMultiversePanel.prototype.viewFit = null;
  cViewMultiversePanel.prototype.viewOffset = { left: 0, top: 0 };
  cViewMultiversePanel.prototype.topControlPanel = null;
  cViewMultiversePanel.prototype.bottomControlPanel = null;
  
  cViewMultiversePanel.prototype.render = function(aParentPanel, aParentElement, aClientRect) {
    cPanel.prototype.render.call(this, aParentPanel, aParentElement, aClientRect);
    if (this.element != null) {
      this.onUpdateMultiverse();
    }
  };

  cViewMultiversePanel.prototype.onUpdateMultiverse = function() {
    if (this.viewMode == cViewMultiversePanel.eViewMode_Flat) {
      this.onUpdateMultiverse_Flat();
    } else if (this.viewMode == cViewMultiversePanel.eViewMode_Fit) {
      this.onUpdateMultiverse_Fit(false);
    }
    var lRunErrorText = '';
    var lChangesError = false;
    var lEvaluationError = false;
    if (Model.actionSandbox.lastRunResult != null) {
      if (Model.actionSandbox.lastRunResult.syntaxError)  {
        lRunErrorText += 'Error while processing changes JavaScript code:<br />\n<i>' + (Model.actionSandbox.lastRunResult.syntaxErrorMessage != '' ? Model.actionSandbox.lastRunResult.syntaxErrorMessage : 'Syntax error.') + '</i><br />\n';
        lChangesError = true;
      } else if (Model.actionSandbox.lastRunResult.runError)  {
        lRunErrorText += 'Error while processing changes JavaScript code:<br />\n<i>' + (Model.actionSandbox.lastRunResult.runErrorMessage != '' ? Model.actionSandbox.lastRunResult.runErrorMessage : 'Runtime error.') + '</i><br />\n';
        lChangesError = true;
      }
    }
    if (Model.evaluationSandbox.lastRunResult != null) {
      if (Model.evaluationSandbox.lastRunResult.syntaxError)  {
        lRunErrorText += 'Error while processing evaluations JavaScript code:<br />\n<i>' + (Model.evaluationSandbox.lastRunResult.syntaxErrorMessage != '' ? Model.evaluationSandbox.lastRunResult.syntaxErrorMessage : 'Syntax error.') + '</i><br />\n';
        lEvaluationError = true;
      } else if (Model.evaluationSandbox.lastRunResult.runError)  {
        lRunErrorText += 'Error while processing evaluations JavaScript code:<br />\n<i>' + (Model.evaluationSandbox.lastRunResult.runErrorMessage != '' ? Model.evaluationSandbox.lastRunResult.runErrorMessage : 'Runtime error.') + '</i><br />\n';
        lEvaluationError = true;
      }
    }
    if (lRunErrorText != '') {
      if (this.viewOverlay == null) {
        this.viewOverlay = new cPanel({
          align : eAlign.eClient,
          backgroundColor : '#ffcccc',
          transparencyPercentage : 50,
          onClick : function() {
            // TODO: go to changes or evaluate tab
          }
        });
        this.panels.push(this.viewOverlay);

        // Note that the messageBox property is not a child-panel of viewOverlay.
        this.viewOverlay.messageBox = new cPanel({
          align : eAlign.eCenter,
          width : 700,
          height : 200,
          padding : 20,
          backgroundColor : '#222222', //#ffffff',
          color : '#00ff00',
          fontSize: 18,
          onClick : function() {
            // TODO: go to changes or evaluate tab
            if (lChangesError) {
              //...
            } else if (lEvaluationError) {
              //...
            }
          }
        });
        this.panels.push(this.viewOverlay.messageBox);

        this.rerender();
      }
      lRunErrorText = '<span style="font-family: \'Courier New\', Courier, monospace">' + lRunErrorText + '</span';

      if (this.viewOverlay.messageBox.innerHTML != lRunErrorText) {
        this.viewOverlay.messageBox.setInnerHTML(lRunErrorText);
        this.rerender();
      }
    } else {
      if (this.viewOverlay != null) {
        this.removePanelWithoutRerender(this.viewOverlay);
        this.removePanelWithoutRerender(this.viewOverlay.messageBox);
        this.viewOverlay = null;
        this.rerender();
      }
    }
  };
    
  cViewMultiversePanel.prototype.onUpdateMultiverse_Flat = function() {
    //Model.allUndeterminedFutures = [];
    var lViewMultiverse = this.viewFlat;

    lViewMultiverse.offsetLeft = this.viewOffset.left;
    lViewMultiverse.offsetTop = this.viewOffset.top;

    
    var lWindowWidth = lViewMultiverse.viewMultiverse_Future.getInnerWidth();
    var lHalfWindowWidth = ((lWindowWidth / 2) | 0);
    var lWindowHeight = lViewMultiverse.viewMultiverse_Future.getInnerHeight();
    var lHalfColumnWidth = ((cMultiverseFuturePanel.cViewColumnWidth / 2) | 0);

    // TODO: nicer way to do this
    this.topControlPanel.innerControlPanel.muliverseSizePanel.setNumberOfWorlds(Model.multiverse.totalNumberOfFutures, this.maxTotalFutures);

    var lShowCenterLine = false;
    if (lShowCenterLine) {
      var lShowCenterLineBottomOnly = false;
      // draw center line
      if (lViewMultiverse.centerLinePanel == null) {
        lViewMultiverse.centerLinePanel = new cPanel({
          align : eAlign.eCenterVertical,
          width : 4,
          backgroundColor : '#ff0000',
          transparencyPercentage : 30
        });
        lViewMultiverse.viewMultiverse_FutureOverlay.panels.push(lViewMultiverse.centerLinePanel);
      }
      if (lShowCenterLineBottomOnly) {
        lViewMultiverse.centerLinePanel.align = eAlign.eNone;
        lViewMultiverse.centerLinePanel.left = lHalfWindowWidth - 2;
        lViewMultiverse.centerLinePanel.top = ((lWindowHeight / 2) | 0);
        lViewMultiverse.centerLinePanel.height = ((lWindowHeight / 2) | 0);
      }
    }

    var lShowBlurPanels = false;
    if (lShowBlurPanels) {
      if (lViewMultiverse.leftBlurPanel == null) {
        lViewMultiverse.leftBlurPanel = new cPanel({
          align : eAlign.eNone,
          top : 0,
          backgroundColor : '#000000',
          transparencyPercentage : 70
        });
        lViewMultiverse.viewMultiverse_FutureOverlay.panels.push(lViewMultiverse.leftBlurPanel);
      }
      if (lViewMultiverse.rightBlurPanel == null) {
        lViewMultiverse.rightBlurPanel = new cPanel({
          align : eAlign.eNone,
          top : 0,
          backgroundColor : '#000000',
          transparencyPercentage : 70
        });
        lViewMultiverse.viewMultiverse_FutureOverlay.panels.push(lViewMultiverse.rightBlurPanel);
      }
      /*
      if (lViewMultiverse.topBlurPanel == null) {
        lViewMultiverse.topBlurPanel = new cPanel({
          align : eAlign.eNone,
          top : 0,
          width: cMultiverseFuturePanel.cViewColumnWidth,
          backgroundColor : '#000000',
          transparencyPercentage : 70
        });
        lViewMultiverse.viewMultiverse_FutureOverlay.panels.push(lViewMultiverse.topBlurPanel);
      }
      */
      lViewMultiverse.leftBlurPanel.left = 0;
      lViewMultiverse.leftBlurPanel.width = lHalfWindowWidth - lHalfColumnWidth;
      lViewMultiverse.leftBlurPanel.height = lWindowHeight;
      lViewMultiverse.rightBlurPanel.left = lHalfWindowWidth + lHalfColumnWidth;
      lViewMultiverse.rightBlurPanel.width = lHalfWindowWidth - lHalfColumnWidth;
      lViewMultiverse.rightBlurPanel.height = lWindowHeight;
      //lViewMultiverse.topBlurPanel.left = lHalfWindowWidth - lHalfColumnWidth;
      //lViewMultiverse.topBlurPanel.height = ((lWindowHeight / 2) | 0);
    }

    /*
    // Draw horizontal scrollbar.
    if (lViewMultiverse.horizontalScrollbarPanel == null) {
      lViewMultiverse.horizontalScrollbarPanel = new cPanel({
        align : eAlign.eNone,
        top : 0,
        height : 8,
        backgroundColor : '#000000'
        //transparencyPercentage : 30
      });
      lViewMultiverse.viewMultiverse_FutureOverlay.panels.push(lViewMultiverse.horizontalScrollbarPanel);
    }
    var lMultiverseWidth = (Model.multiverse.columns.length * cMultiverseFuturePanel.cViewColumnWidth);
    if (lMultiverseWidth == 0) {
      lViewMultiverse.horizontalScrollbarPanel.width = lWindowWidth;
    } else {
      lViewMultiverse.horizontalScrollbarPanel.width = (((lWindowWidth / lMultiverseWidth) * lWindowWidth) | 0);
    }
    var lHalfViewColumnNumber = -((lViewMultiverse.offsetLeft - (cMultiverseFuturePanel.cViewColumnWidth / 2)) / cMultiverseFuturePanel.cViewColumnWidth);
    var lLeftMostColumnNumber = Model.multiverse.columns[0].columnNumber;
    var lRightMostColumnNumber = Model.multiverse.columns[Model.multiverse.columns.length - 1].columnNumber;
    var lMiddleColumnNumber = ((lRightMostColumnNumber + lLeftMostColumnNumber) / 2);
    var lScrollbarOffset = (((lHalfViewColumnNumber - lMiddleColumnNumber) * cMultiverseFuturePanel.cViewColumnWidth * (lWindowWidth / lMultiverseWidth)) | 0);
    lViewMultiverse.horizontalScrollbarPanel.left = (lHalfWindowWidth - ((lViewMultiverse.horizontalScrollbarPanel.width / 2) | 0)) + lScrollbarOffset;
    */

    var lVisibleColumnNumberLeft = ((-(lHalfColumnWidth + lViewMultiverse.offsetLeft)) / cMultiverseFuturePanel.cViewColumnWidth) | 0;
    var lVisibleColumnNumberRight = lVisibleColumnNumberLeft + ((lWindowWidth / cMultiverseFuturePanel.cViewColumnWidth) | 0) + 2;
    var lDrawColumnIndicators = false;
    if (lDrawColumnIndicators) {
      // Draw column indicators
      for (var ci = 0, cc = lViewMultiverse.columnIndicatorPanels.length; ci < cc; ci++) {
        lViewMultiverse.columnIndicatorPanels[ci].columnIndicatorHandled = false;
      }
      for (var cn = lVisibleColumnNumberLeft; cn <= lVisibleColumnNumberRight; cn++) {
        if (cn >= 0) {
          var lColumnIndicator = null;
          for (var ci = 0, cc = lViewMultiverse.columnIndicatorPanels.length; ci < cc; ci++) {
            if (lViewMultiverse.columnIndicatorPanels[ci].columnNumber == cn) {
              lColumnIndicator = lViewMultiverse.columnIndicatorPanels[ci];
              break;
            }
          }
          if (lColumnIndicator == null) {
            lColumnIndicator = new cPanel({
              align : eAlign.eNone,
              top : 0,
              width : cMultiverseFuturePanel.cViewColumnWidth,
              height : ((cMultiverseFuturePanel.cViewHeight / 2) | 0),
              backgroundColor : '#666666',
              transparencyPercentage : 50,
              color: '#000000',
              fontSize: 36,
              borderColor: '#333333',
              borderLeft: 1,
              borderRight: 1,
              textAlign: eTextAlign.eCenter,
              innerHTML: (Math.abs(cn + 1) + '')
            });
            lColumnIndicator.columnNumber = cn;
            lViewMultiverse.viewMultiverse_FutureOverlay.panels.push(lColumnIndicator);
            lViewMultiverse.columnIndicatorPanels.push(lColumnIndicator);
          }
          lColumnIndicator.left = (lViewMultiverse.offsetLeft + (cn * cMultiverseFuturePanel.cViewColumnWidth)) - lHalfColumnWidth;
          var lIndicatorBackgroundColor = '#666666';
          var lIndicatorTextColor = '#990000';
          if (Math.abs((lColumnIndicator.left + lHalfColumnWidth) - lHalfWindowWidth) < lHalfColumnWidth) {
            lIndicatorBackgroundColor = '#cccccc';
          }
          if (cn < 0) {
            lIndicatorTextColor = '#999900';
          } else if (cn > 0) {
            lIndicatorTextColor = '#000099';
          }
          lIndicatorTextColor = '#ffffff';
          lColumnIndicator.backgroundColor = lIndicatorBackgroundColor;
          lColumnIndicator.color = lIndicatorTextColor;
          lColumnIndicator.columnIndicatorHandled = true;
        }
      }
      // Remove column indicators which have gone out of view.
      for (var ci = 0, cc = lViewMultiverse.columnIndicatorPanels.length; ci < cc; ci++) {
        if (!lViewMultiverse.columnIndicatorPanels[ci].columnIndicatorHandled) {
          lViewMultiverse.viewMultiverse_FutureOverlay.removePanelWithoutRerender(lViewMultiverse.columnIndicatorPanels[ci]);
          lViewMultiverse.columnIndicatorPanels.splice(ci, 1);
          ci--;
          cc--;
        }
      }
    }
    
    // Draw level indicators
    var lVisibleLevelTop = -((lViewMultiverse.offsetTop / cMultiverseFuturePanel.cViewHeight) | 0);
    if (lVisibleLevelTop < 0) {
      lVisibleLevelTop = 0;
    }
    var lVisibleLevelBottom = lVisibleLevelTop + (((lWindowHeight + cMultiverseFuturePanel.cViewHeight) / cMultiverseFuturePanel.cViewHeight) | 0);
    if (lVisibleLevelBottom < 0) {
      lVisibleLevelBottom = 0;
    }
    for (var li = 0, lc = lViewMultiverse.levelIndicatorPanels.length; li < lc; li++) {
      lViewMultiverse.levelIndicatorPanels[li].levelIndicatorHandled = false;
    }
    for (var ln = lVisibleLevelTop; ln <= lVisibleLevelBottom; ln++) {
      var lLevelIndicator = null;
      for (var li = 0, lc = lViewMultiverse.levelIndicatorPanels.length; li < lc; li++) {
        if (lViewMultiverse.levelIndicatorPanels[li].levelNumber == ln) {
          lLevelIndicator = lViewMultiverse.levelIndicatorPanels[li];
          break;
        }
      }
      if (lLevelIndicator == null) {
        lLevelIndicator = new cPanel({
          align : eAlign.eNone,
          width : ((cMultiverseFuturePanel.cViewColumnWidth / 2) | 0),
          height : cMultiverseFuturePanel.cViewHeight,
          paddingTop : ((cMultiverseFuturePanel.cViewHeight / 5) | 0),
          backgroundColor : '#666666',
          transparencyPercentage : 50,
          color: '#ffffff',
          fontSize: 36,
          borderColor: '#333333',
          borderTop: 1,
          borderBottom: 1,
          textAlign: eTextAlign.eCenter,
          innerHTML: ((ln == 0) ? 'now' : (ln + ''))
        });
        lLevelIndicator.levelNumber = ln;
        lViewMultiverse.viewMultiverse_FutureOverlay.panels.push(lLevelIndicator);
        lViewMultiverse.levelIndicatorPanels.push(lLevelIndicator);
      }
      lLevelIndicator.left = lWindowWidth - lLevelIndicator.width;
      lLevelIndicator.top = lViewMultiverse.offsetTop + (ln * cMultiverseFuturePanel.cViewHeight);
      var lIndicatorBackgroundColor = '#666666';
      var lIndicatorTextColor = '#ffffff';
      lLevelIndicator.backgroundColor = lIndicatorBackgroundColor;
      lLevelIndicator.color = lIndicatorTextColor;
      lLevelIndicator.levelIndicatorHandled = true;
    }
    // Remove level indicators which have gone out of view.
    for (var li = 0, lc = lViewMultiverse.levelIndicatorPanels.length; li < lc; li++) {
      if (!lViewMultiverse.levelIndicatorPanels[li].levelIndicatorHandled) {
        lViewMultiverse.viewMultiverse_FutureOverlay.removePanelWithoutRerender(lViewMultiverse.levelIndicatorPanels[li]);
        lViewMultiverse.levelIndicatorPanels.splice(li, 1);
        li--;
        lc--;
      }
    }
    
    lViewMultiverse.viewMultiverse_FutureOverlay.rerender();
    
    // Draw outer multiverse background panel
    var lOuterLeftSize = 400;
    var lOuterTopSize = 140;
    var lNeedToRerenderFutureBackgroundPanel = false;
    if (lViewMultiverse.outerMultiversePanel == null) {
      lViewMultiverse.outerMultiversePanel = new cPanel({
        align : eAlign.eNone,
        backgroundColor : '#333333'
      });
      lViewMultiverse.viewMultiverse_FutureBackground.panels.push(lViewMultiverse.outerMultiversePanel);
      
      var lFutureAxisLabel = new cPanel({
        align : eAlign.eNone,
        left: 270,
        top: 190,
        width: 117,
        height: 171,
        backgroundColor: 'transparent',
        image: lViewMultiverse.futureAxisImage,
        imageStretch: true
      });
      lViewMultiverse.outerMultiversePanel.panels.push(lFutureAxisLabel);
      
      var lOptionsAxisLabel = new cPanel({
        align : eAlign.eNone,
        left: 500,
        top: 56,
        width: 275,
        height: 65,
        backgroundColor: 'transparent',
        image: lViewMultiverse.optionsAxisImage,
        imageStretch: true
      });
      lViewMultiverse.outerMultiversePanel.panels.push(lOptionsAxisLabel);
      
      lNeedToRerenderFutureBackgroundPanel = true;
    }
    if (lViewMultiverse.outerMultiversePanel.width != ((lWindowWidth * 2) + lOuterLeftSize)) {
      lViewMultiverse.outerMultiversePanel.width = ((lWindowWidth * 2) + lOuterLeftSize);
      lNeedToRerenderFutureBackgroundPanel = true;
    }
    if (lViewMultiverse.outerMultiversePanel.height != ((lWindowHeight * 2) + lOuterTopSize)) {
      lViewMultiverse.outerMultiversePanel.height = ((lWindowHeight * 2) + lOuterTopSize);
      lNeedToRerenderFutureBackgroundPanel = true;
    }
    var lOuterMultiversePanelLeft = -lWindowWidth; // out of sight
    var lOuterMultiversePanelTop = -lWindowHeight; // out of sight
    if (lViewMultiverse.offsetLeft > -lWindowWidth) {
      lOuterMultiversePanelLeft = lViewMultiverse.offsetLeft - (((cMultiverseFuturePanel.cViewColumnWidth / 2) | 0) + lOuterLeftSize);
      if (lOuterMultiversePanelLeft < -(lOuterLeftSize + lWindowWidth)) {
        lOuterMultiversePanelLeft = -(lOuterLeftSize + lWindowWidth);
      }
    }
    if (lViewMultiverse.offsetTop > -lWindowHeight) {
      lOuterMultiversePanelTop = (lViewMultiverse.offsetTop - lOuterTopSize) - 40;
      if (lOuterMultiversePanelTop < -(lOuterTopSize + lWindowHeight)) {
        lOuterMultiversePanelTop = -(lOuterTopSize + lWindowHeight);
      }
    }
    if (lViewMultiverse.outerMultiversePanel.left != lOuterMultiversePanelLeft) {
      lViewMultiverse.outerMultiversePanel.left = lOuterMultiversePanelLeft;
      lNeedToRerenderFutureBackgroundPanel = true;
    }
    if (lViewMultiverse.outerMultiversePanel.top != lOuterMultiversePanelTop) {
      lViewMultiverse.outerMultiversePanel.top = lOuterMultiversePanelTop;
      lNeedToRerenderFutureBackgroundPanel = true;
    }
    
    // Draw visible multiverse background panel
    if (lViewMultiverse.visibleMultiversePanel == null) {
      lViewMultiverse.visibleMultiversePanel = new cPanel({
        align : eAlign.eNone,
        backgroundColor : '#222222'
      });
      lViewMultiverse.viewMultiverse_FutureBackground.panels.push(lViewMultiverse.visibleMultiversePanel);
      lNeedToRerenderFutureBackgroundPanel = true;
    }
    if (lViewMultiverse.visibleMultiversePanel.width != lWindowWidth) {
      lViewMultiverse.visibleMultiversePanel.width = lWindowWidth;
      lNeedToRerenderFutureBackgroundPanel = true;
    }
    if (lViewMultiverse.visibleMultiversePanel.height != lWindowHeight) {
      lViewMultiverse.visibleMultiversePanel.height = lWindowHeight;
      lNeedToRerenderFutureBackgroundPanel = true;
    }
    var lVisibleMultiversePanelLeft = 0;
    var lVisibleMultiversePanelTop = 0;
    if (lViewMultiverse.offsetLeft > 0) {
      lVisibleMultiversePanelLeft = lViewMultiverse.offsetLeft - (((cMultiverseFuturePanel.cViewColumnWidth / 2) | 0) + 10);
      if (lVisibleMultiversePanelLeft < 0) {
        lVisibleMultiversePanelLeft = 0;
      }
    }
    if (lViewMultiverse.offsetTop > 0) {
      lVisibleMultiversePanelTop = lViewMultiverse.offsetTop - 40;
      if (lVisibleMultiversePanelTop < 0) {
        lVisibleMultiversePanelTop = 0;
      }
    }
    if (lViewMultiverse.visibleMultiversePanel.left != lVisibleMultiversePanelLeft) {
      lViewMultiverse.visibleMultiversePanel.left = lVisibleMultiversePanelLeft;
      lNeedToRerenderFutureBackgroundPanel = true;
    }
    if (lViewMultiverse.visibleMultiversePanel.top != lVisibleMultiversePanelTop) {
      lViewMultiverse.visibleMultiversePanel.top = lVisibleMultiversePanelTop;
      lNeedToRerenderFutureBackgroundPanel = true;
    }


    // Draw futures
    var lNeedToRerenderFuturePanel = false;
    var lFutureIDsDrawn = [];
    //var lSelectedVisibleUndeterminedFuture = null;
    for (var fi = 0, fc = lViewMultiverse.futurePanels.length; fi < fc; fi++) {
      lViewMultiverse.futurePanels[fi].futurePanelHandled = false;
    }
    for (var cn = lVisibleColumnNumberLeft; cn <= lVisibleColumnNumberRight; cn++) {
      var lMultiverseColumn = Model.multiverse.getColumnByColumnNumber(cn);
      if (lMultiverseColumn != null) {
        for (var ln = lVisibleLevelTop; (ln <= lVisibleLevelBottom) && (ln < lMultiverseColumn.futures.length); ln++) {
          var lFuture = lMultiverseColumn.futures[ln];
          var lFutureDrawn = false;
          for (var fi = 0, fc = lFutureIDsDrawn.length; fi < fc; fi++) {
            if (lFutureIDsDrawn[fi] == lFuture.id) {
              lFutureDrawn = true;
              break;
            }
          }
          if (!lFutureDrawn) {
            lFutureIDsDrawn.push(lFuture.id);
            /*
            if (this.expansionMode == cViewMultiversePanel.eExpansionMode_Auto) {
              if (!lFuture.futuresDetermined) {
                if (lSelectedVisibleUndeterminedFuture == null) {
                  lSelectedVisibleUndeterminedFuture = lFuture;
                }
              }
            }
            */
            var lFuturePanel = null;
            for (var fi = 0, fc = lViewMultiverse.futurePanels.length; fi < fc; fi++) {
              if (lViewMultiverse.futurePanels[fi].future.id == lFuture.id) {
                lFuturePanel = lViewMultiverse.futurePanels[fi];
                break;
              }
            }
            if (lFuturePanel == null) {
              lFuturePanel = new cMultiverseFuturePanel({
                align : eAlign.eNone,
                left : 0,
                top : 0,
                width : cMultiverseFuturePanel.cViewColumnWidth,
                height : cMultiverseFuturePanel.cViewHeight,
                backgroundColor : 'transparent',
                screen : this.screen,
                future : lFuture,
                changesImageId : this.changesImageId,
                evaluateImageId : this.evaluateImageId
              });
              lViewMultiverse.viewMultiverse_Future.panels.push(lFuturePanel);
              lViewMultiverse.futurePanels.push(lFuturePanel);
              lNeedToRerenderFuturePanel = true;
            }
            var lFutureBorderColor = cMultiverseFuturePanel.evaluationColor(lFuture);
            var lFutureState = cMultiverseFuturePanel.evaluationText(lFuture);
            var lFutureTerminated = (lFuture.evaluation.end || lFuture.evaluation.ignore ||  lFuture.evaluation.goal || lFuture.evaluation.illegal);
            var lFutureLeft = (lFuture.multiverseColumns[0].columnNumber * cMultiverseFuturePanel.cViewColumnWidth) - ((cMultiverseFuturePanel.cViewColumnWidth / 2) | 0);
            //var lFutureTop = -((lFuture.level + 1) * cMultiverseFuturePanel.cViewHeight);
            var lFutureTop = (lFuture.level * cMultiverseFuturePanel.cViewHeight);
            var lFutureWidth = (lFuture.multiverseColumns.length * cMultiverseFuturePanel.cViewColumnWidth);
            var lFutureHeight = cMultiverseFuturePanel.cViewHeight;
            var lMarginWidth = 2;
            var lMarginHeight = 2;
            if (lFuturePanel.top != (lViewMultiverse.offsetTop + lFutureTop)) {
              lFuturePanel.top = (lViewMultiverse.offsetTop + lFutureTop);
              lNeedToRerenderFuturePanel = true;
            }
            if (lFuturePanel.left != (lViewMultiverse.offsetLeft + lFutureLeft + lMarginWidth)) {
              lFuturePanel.left = (lViewMultiverse.offsetLeft + lFutureLeft + lMarginWidth);
              lNeedToRerenderFuturePanel = true;
            }
            if (lFuturePanel.width != (lFutureWidth - (lMarginWidth * 2))) {
              lFuturePanel.width = (lFutureWidth - (lMarginWidth * 2));
              lNeedToRerenderFuturePanel = true;
            }
            if (lFuturePanel.height != (lFutureHeight - (lMarginHeight * 2))) {
              lFuturePanel.setHeight(lFutureHeight - (lMarginHeight * 2));
              lNeedToRerenderFuturePanel = true;
            }
            if (lFuturePanel.state != lFutureState) {
              lFuturePanel.setState(lFutureState);
              lNeedToRerenderFuturePanel = true;
            }
            if (lFuturePanel.stateColor != lFutureBorderColor) {
              lFuturePanel.setStateColor(lFutureBorderColor);
              lNeedToRerenderFuturePanel = true;
            }
            if (lNeedToRerenderFuturePanel) {
              lFuturePanel.setFocusLine(lHalfWindowWidth);
            }
            lFuturePanel.futurePanelHandled = true;
            var lDrawLinks = true;
            if (lDrawLinks) {
              if (lFuture.futures.length > 0) {
                if (!lFuturePanel.futureConnectorHorizontal) {
                  lFuturePanel.futureConnectorHorizontal = new cPanel({
                    align : eAlign.eNone,
                    left : 0,
                    top : 0,
                    width : 1,
                    height : 8,
                    backgroundColor : '#666666'
                  });
                  lViewMultiverse.viewMultiverse_FutureBackground.panels.push(lFuturePanel.futureConnectorHorizontal);
                  lNeedToRerenderFutureBackgroundPanel = true;
                }
                if (lFuturePanel.futureConnectorHorizontal.top != (lFuturePanel.top + ((cMultiverseFuturePanel.cViewHeight / 2) | 0))) {
                  lFuturePanel.futureConnectorHorizontal.top = (lFuturePanel.top + ((cMultiverseFuturePanel.cViewHeight / 2) | 0));
                  lNeedToRerenderFutureBackgroundPanel = true;
                }
                // left should be halfway first future's column-width
                var lHalfwayFirstFuturesColumnWidth = (((lFuture.futures[0].multiverseColumns.length * cMultiverseFuturePanel.cViewColumnWidth) / 2) | 0);
                if (lFuturePanel.futureConnectorHorizontal.left != ((lFuturePanel.left + lHalfwayFirstFuturesColumnWidth) - 6)) {
                  lFuturePanel.futureConnectorHorizontal.left = ((lFuturePanel.left + lHalfwayFirstFuturesColumnWidth) - 6);
                  lNeedToRerenderFutureBackgroundPanel = true;
                }
                // width should be lFutureWidth minus half of first future's column-width and minus half of last future's column-width
                var lHalfwayLastFuturesColumnWidth = (((lFuture.futures[lFuture.futures.length - 1].multiverseColumns.length * cMultiverseFuturePanel.cViewColumnWidth) / 2) | 0);
                if (lFuturePanel.futureConnectorHorizontal.width != (lFutureWidth - (lHalfwayFirstFuturesColumnWidth + lHalfwayLastFuturesColumnWidth))) {
                  lFuturePanel.futureConnectorHorizontal.width = (lFutureWidth - (lHalfwayFirstFuturesColumnWidth + lHalfwayLastFuturesColumnWidth));
                  lNeedToRerenderFutureBackgroundPanel = true;
                }
              }
            
              var lPastPanel = null;
              if (lFuture.past) {
                for (var fi = 0, fc = lViewMultiverse.futurePanels.length; fi < fc; fi++) {
                  if (lViewMultiverse.futurePanels[fi].future.id == lFuture.past.id) {
                    lPastPanel = lViewMultiverse.futurePanels[fi];
                    break;
                  }
                }
              }
              if (lPastPanel != null) {
                if (!lFuturePanel.pastConnectorVertical) {
                  lFuturePanel.pastConnectorVertical = new cPanel({
                    align : eAlign.eNone,
                    left : 0,
                    top : 0,
                    width : 8,
                    height : cMultiverseFuturePanel.cViewHeight,
                    backgroundColor : '#666666'
                  });
                  lViewMultiverse.viewMultiverse_FutureBackground.panels.push(lFuturePanel.pastConnectorVertical);
                  lNeedToRerenderFutureBackgroundPanel = true;
                }
                if (lFuturePanel.pastConnectorVertical.left != ((lFuturePanel.left + ((lFutureWidth / 2) | 0)) - 6)) {
                  lFuturePanel.pastConnectorVertical.left = ((lFuturePanel.left + ((lFutureWidth / 2) | 0)) - 6);
                  lNeedToRerenderFutureBackgroundPanel = true;
                }
                if (lFuturePanel.pastConnectorVertical.top != (lFuturePanel.top - ((cMultiverseFuturePanel.cViewHeight / 2) | 0))) {
                  lFuturePanel.pastConnectorVertical.top = (lFuturePanel.top - ((cMultiverseFuturePanel.cViewHeight / 2) | 0));
                  lNeedToRerenderFutureBackgroundPanel = true;
                }
              } else {
                if (lFuturePanel.pastConnectorVertical) {
                  lViewMultiverse.viewMultiverse_FutureBackground.removePanelWithoutRerender(lFuturePanel.pastConnectorVertical);
                  lFuturePanel.pastConnectorVertical = null;
                  lNeedToRerenderFutureBackgroundPanel = true;
                }
              }
            }
            //if (lFutureTerminated || (!lFuture.futuresDetermined)) {
            if (!lFuture.futuresDetermined) {
              if (!lFuturePanel.terminatorPanel) {
                lFuturePanel.terminatorPanel = new cPanel({
                  align : eAlign.eNone,
                  left : 0,
                  top : 0,
                  width : cMultiverseFuturePanel.cViewColumnWidth,
                  height : cMultiverseFuturePanel.cViewHeight,
                  backgroundColor : '#96ceb4', //'#666666',
                  transparencyPercentage: 15,
                  //borderColor: '#cccccc',
                  //border: 1,
                  shape: cPanel.cShapeRoundRect,
                  borderRadius: 40,
                  textAlign: eTextAlign.eCenter,
                  color: '#000000',
                  fontSize: 40
                });
                lViewMultiverse.viewMultiverse_Future.panels.push(lFuturePanel.terminatorPanel);
                
                if (!lFuture.futuresDetermined) {
                  (function() {
                    var lThisFuture = lFuture;
                    lFuturePanel.terminatorPanel.onTap = function() {
                      this.stopBubble = true;
                      var lFoundFuture = false;
                      for (var fi = 0, fc = Model.allUndeterminedFutures.length; fi < fc; fi++) {
                        if (Model.allUndeterminedFutures[fi].future.id == lThisFuture.id) {
                          lFoundFuture = true;
                          break;
                        }
                      }
                      if (!lFoundFuture) {
                        Model.allUndeterminedFutures.push(lThisFuture);
                      }
                    };
                  })();
                }
                
                //lFuturePanel.terminatorPanel.backgroundColor = (lFutureTerminated ? lFutureBorderColor : '#96ceb4');
                //if (!lFuture.futuresDetermined) {
                  lFuturePanel.terminatorPanel.image = this.screen.getImageClone(lViewMultiverse.expandImageId);
                  lFuturePanel.terminatorPanel.imageStretchWidth = 90;
                  lFuturePanel.terminatorPanel.imageStretchHeight = 90;
                  lFuturePanel.terminatorPanel.innerHTML = '';
                //} else {
                //  lFuturePanel.terminatorPanel.image = null;
                //  lFuturePanel.terminatorPanel.innerHTML = lFutureState;
                //}

                lNeedToRerenderFuturePanel = true;
              }
              var lTerminatorPanelLeftRightMargin = 20;
              var lTerminatorPanelBottomMargin = 10;
              if (lFuturePanel.terminatorPanel.left != (lFuturePanel.left + lTerminatorPanelLeftRightMargin)) {
                lFuturePanel.terminatorPanel.left = lFuturePanel.left + lTerminatorPanelLeftRightMargin;
                lNeedToRerenderFuturePanel = true;
              }
              if (lFuturePanel.terminatorPanel.top != (lFuturePanel.top + (((cMultiverseFuturePanel.cViewHeight * 3) / 5) |0))) {
                lFuturePanel.terminatorPanel.top = (lFuturePanel.top + (((cMultiverseFuturePanel.cViewHeight * 3) / 5) |0));
                lNeedToRerenderFuturePanel = true;
              }
              if (lFuturePanel.terminatorPanel.width != (lFuturePanel.width - (2 * lTerminatorPanelLeftRightMargin))) {
                lFuturePanel.terminatorPanel.width = lFuturePanel.width - (2 * lTerminatorPanelLeftRightMargin);
                lNeedToRerenderFuturePanel = true;
              }
              if (lFuturePanel.terminatorPanel.height != (cMultiverseFuturePanel.cViewHeight - lTerminatorPanelBottomMargin)) {
                lFuturePanel.terminatorPanel.height = cMultiverseFuturePanel.cViewHeight - lTerminatorPanelBottomMargin;
                lNeedToRerenderFuturePanel = true;
              }
            } else {
              if (lFuturePanel.terminatorPanel) {
                lViewMultiverse.viewMultiverse_Future.removePanelWithoutRerender(lFuturePanel.terminatorPanel);
                lFuturePanel.terminatorPanel = null;
                lNeedToRerenderFuturePanel = true;
              }
            }
          }
        }
      }
    }
    // Remove future panels which have gone out of view.
    for (var fi = 0, fc = lViewMultiverse.futurePanels.length; fi < fc; fi++) {
      if (!lViewMultiverse.futurePanels[fi].futurePanelHandled) {
        if (lViewMultiverse.futurePanels[fi].futureConnectorHorizontal) {
          lViewMultiverse.viewMultiverse_FutureBackground.removePanelWithoutRerender(lViewMultiverse.futurePanels[fi].futureConnectorHorizontal);
          lViewMultiverse.futurePanels[fi].futureConnectorHorizontal = null;
          lNeedToRerenderFutureBackgroundPanel = true;
        }
        if (lViewMultiverse.futurePanels[fi].pastConnectorVertical) {
          lViewMultiverse.viewMultiverse_FutureBackground.removePanelWithoutRerender(lViewMultiverse.futurePanels[fi].pastConnectorVertical);
          lViewMultiverse.futurePanels[fi].pastConnectorVertical = null;
          lNeedToRerenderFutureBackgroundPanel = true;
        }
        if (lViewMultiverse.futurePanels[fi].terminatorPanel) {
          lViewMultiverse.viewMultiverse_Future.removePanelWithoutRerender(lViewMultiverse.futurePanels[fi].terminatorPanel);
          lViewMultiverse.futurePanels[fi].terminatorPanel = null;
        }
        lViewMultiverse.viewMultiverse_Future.removePanelWithoutRerender(lViewMultiverse.futurePanels[fi]);
        lNeedToRerenderFuturePanel = true;
        lViewMultiverse.futurePanels.splice(fi, 1);
        fi--;
        fc--;
      }
    }
    
    if (lNeedToRerenderFutureBackgroundPanel) {
      lViewMultiverse.viewMultiverse_FutureBackground.rerender();
    }
    if (lNeedToRerenderFuturePanel) {
      lViewMultiverse.viewMultiverse_Future.rerender();
    }
    /*
    // select which undetermined futures we want to determine.
    if (lSelectedVisibleUndeterminedFuture != null) {
      var lFoundSelectedFuture = false;
      for (var fi = 0, fc = Model.allUndeterminedFutures.length; fi < fc; fi++) {
        if (Model.allUndeterminedFutures[fi].future.id == lSelectedVisibleUndeterminedFuture.id) {
          lFoundSelectedFuture = true;
          break;
        }
      }
      if (!lFoundSelectedFuture) {
        Model.allUndeterminedFutures.push(lSelectedVisibleUndeterminedFuture);
      }
    }
    */

  };
  
  cViewMultiversePanel.prototype.onUpdateMultiverse_Fit = function(aJustDragMultiverse) {
    //Model.allUndeterminedFutures = [];
    var lViewMultiverse = this.viewFit;
    var lThis = this;

    var lWindowWidth = lViewMultiverse.viewFuture.getInnerWidth();
    var lHalfWindowWidth = ((lWindowWidth / 2) | 0);
    var lWindowHeight = lViewMultiverse.viewFuture.getInnerHeight();
    var lHalfWindowHeight = ((lWindowHeight / 2) | 0);
    var lNumberOfColumns = Model.multiverse.columns.length;
    var lColumnWidthReal = lWindowWidth / lNumberOfColumns;
    var lNumberOfVisibleColumns = lNumberOfColumns;
    var lZoomedWidth = ((lWindowWidth * (32 / cMultiverseFuturePanel.cViewColumnWidth)) | 0);
    var lZoomedHeight = ((lWindowHeight * (32 / cMultiverseFuturePanel.cViewHeight)) | 0);
    var lZoomAlignOffsetLeft = lHalfWindowWidth - ((lZoomedWidth / 2) | 0);
    var lZoomAlignOffsetTop = lHalfWindowHeight - ((lZoomedHeight / 2) | 0);
    
    lViewMultiverse.offsetLeft = lZoomAlignOffsetLeft + ((this.viewOffset.left * (32 / cMultiverseFuturePanel.cViewColumnWidth)) | 0);
    lViewMultiverse.offsetTop = lZoomAlignOffsetTop + ((this.viewOffset.top * (32 / cMultiverseFuturePanel.cViewHeight)) | 0);
    
    if (lViewMultiverse.viewFutureOrigin.left != lViewMultiverse.offsetLeft) {
      lViewMultiverse.viewFutureOrigin.setLeft(lViewMultiverse.offsetLeft);
      this.viewFit.futureAxisLabel.setLeft(lViewMultiverse.offsetLeft - 40);
      this.viewFit.optionsAxisLabel.setLeft(lViewMultiverse.offsetLeft + 36);
    }
    if (lViewMultiverse.viewFutureOrigin.top != lViewMultiverse.offsetTop) {
      lViewMultiverse.viewFutureOrigin.setTop(lViewMultiverse.offsetTop);
      this.viewFit.futureAxisLabel.setTop(lViewMultiverse.offsetTop + 36);
      this.viewFit.optionsAxisLabel.setTop(lViewMultiverse.offsetTop - 26);
    }
    if (lViewMultiverse.viewBackground.left != lViewMultiverse.offsetLeft) {
      lViewMultiverse.viewBackground.setLeft(lViewMultiverse.offsetLeft);
    }
    if (lViewMultiverse.viewBackground.top != lViewMultiverse.offsetTop) {
      lViewMultiverse.viewBackground.setTop(lViewMultiverse.offsetTop);
    }

    if (aJustDragMultiverse) {
      return;
    }

    // TODO: nicer way to do this
    this.topControlPanel.innerControlPanel.muliverseSizePanel.setNumberOfWorlds(Model.multiverse.totalNumberOfFutures, this.maxTotalFutures);

    //if (lColumnWidthReal < 20) {
      lColumnWidthReal = 32;
      lNumberOfVisibleColumns = ((lWindowWidth / lColumnWidthReal) | 0);
    //}
    if (lViewMultiverse.viewFutureOrigin.width != ((lNumberOfColumns * (lColumnWidthReal + 1)) | 0)) {
      lViewMultiverse.viewFutureOrigin.setWidth(((lNumberOfColumns + 1) * lColumnWidthReal));
    }
    if (lViewMultiverse.viewBackground.width != lViewMultiverse.viewFutureOrigin.width) {
      lViewMultiverse.viewBackground.setWidth(lViewMultiverse.viewFutureOrigin.width);
    }
    var lLevelHeight = 40;
    if (lLevelHeight > lColumnWidthReal) {
      lLevelHeight = lColumnWidthReal;
    }

    var lNeedToRerenderOverlayPanel = false;
    if (!lViewMultiverse.viewOverlay.ZoomBoundaryPanel) {
      lViewMultiverse.viewOverlay.ZoomBoundaryPanel = new cPanel({
        align : eAlign.eNone,
        left: 0,
        top: 0,
        width: 500,
        height: 500,
        border: 1,
        borderColor: '#cc0000',
        backgroundColor : 'transparent'
      });
      lViewMultiverse.viewOverlay.panels.push(lViewMultiverse.viewOverlay.ZoomBoundaryPanel);
      lNeedToRerenderOverlayPanel = true;
    }
    lViewMultiverse.viewOverlay.ZoomBoundaryPanel.left = lZoomAlignOffsetLeft + 32;
    lViewMultiverse.viewOverlay.ZoomBoundaryPanel.top = lZoomAlignOffsetTop;
    lViewMultiverse.viewOverlay.ZoomBoundaryPanel.width = lZoomedWidth;
    lViewMultiverse.viewOverlay.ZoomBoundaryPanel.height = lZoomedHeight;
    lNeedToRerenderOverlayPanel = true;

    var lNeedToRerenderFutureBackgroundPanel = false;
    
    // Draw futures
    var lNeedToRerenderFuturePanel = false;
    var lFutureIDsDrawn = [];
    //var lSelectedVisibleUndeterminedFuture = null;
    for (var fi = 0, fc = lViewMultiverse.futurePanels.length; fi < fc; fi++) {
      lViewMultiverse.futurePanels[fi].futurePanelHandled = false;
    }
    for (var ci = 0; ci < lNumberOfColumns; ci++) {
      var lMultiverseColumn = Model.multiverse.columns[ci];
      if (lMultiverseColumn != null) {
        for (var li = 0; li < lMultiverseColumn.futures.length; li++) {
          var lFuture = lMultiverseColumn.futures[li];
          var lFutureDrawn = false;
          for (var fi = 0, fc = lFutureIDsDrawn.length; fi < fc; fi++) {
            if (lFutureIDsDrawn[fi] == lFuture.id) {
              lFutureDrawn = true;
              break;
            }
          }
          if (!lFutureDrawn) {
            lFutureIDsDrawn.push(lFuture.id);
            
            /*
            if (this.expansionMode == cViewMultiversePanel.eExpansionMode_Auto) {
              if (!lFuture.futuresDetermined) {
                var lDepthFirst = false;
                if (lDepthFirst) {
                  if (lSelectedVisibleUndeterminedFuture == null) {
                    lSelectedVisibleUndeterminedFuture = lFuture;
                  }
                } else {
                  // TODO: do breadth first
                  lSelectedVisibleUndeterminedFuture = lFuture;
                }
              }
            }
            */
            
            var lFuturePanel = null;
            for (var fi = 0, fc = lViewMultiverse.futurePanels.length; fi < fc; fi++) {
              if (lViewMultiverse.futurePanels[fi].future.id == lFuture.id) {
                lFuturePanel = lViewMultiverse.futurePanels[fi];
                break;
              }
            }
            if (lFuturePanel == null) {
              lFuturePanel = new cPanel({ // new cMultiverseFuturePanel({
                align : eAlign.eNone,
                left : 0,
                top : 0,
                width : cMultiverseFuturePanel.cViewColumnWidth,
                height : lLevelHeight,
                border: 2,
                borderColor : '#000000',
                paddingLeft : 5,
                backgroundColor : '#ffffff',
                color : '#ffffff',
                fontSize : 30,
                //future : lFuture
                onTap: function() {
                  if (!this.future.futuresDetermined) {
                    this.stopBubble = true;
                    // expand future
                    var lFoundFuture = false;
                    for (var fi = 0, fc = Model.allUndeterminedFutures.length; fi < fc; fi++) {
                      if (Model.allUndeterminedFutures[fi].future.id == this.future.id) {
                        lFoundFuture = true;
                        break;
                      }
                    }
                    if (!lFoundFuture) {
                      Model.allUndeterminedFutures.push(this.future);
                    }
                  }
                }
              });
              lFuturePanel.future = lFuture;
              lViewMultiverse.viewFutureOrigin.panels.push(lFuturePanel);
              lViewMultiverse.futurePanels.push(lFuturePanel);
              lNeedToRerenderFuturePanel = true;
            }
            
            var lFutureBorderColor = cMultiverseFuturePanel.evaluationColor(lFuture);
            var lFutureInnerHTML = ' '; // set to non-empty string, otherwise update of cPanel.innerHTML does nt work.
            var lFutureState = cMultiverseFuturePanel.evaluationText(lFuture);
            var lFutureTerminated = (lFuture.evaluation.end || lFuture.evaluation.ignore ||  lFuture.evaluation.goal || lFuture.evaluation.illegal);
            if (!lFuture.futuresDetermined) {
              lFutureBorderColor = '#96ceb4';
              lFutureInnerHTML = '*';
            }
            //var lFutureLeft = (lHalfWindowWidth - (((lNumberOfColumns * lColumnWidthReal) / 2) | 0)) + ((lFuture.multiverseColumns[0].columnNumber * lColumnWidthReal) | 0);
            var lFutureLeft = 20 + ((lFuture.multiverseColumns[0].columnNumber * lColumnWidthReal) | 0);
            var lFutureFullSpanLeft = lFutureLeft;
            var lFutureTop = 20 + (lFuture.level * lLevelHeight);
            //var lFutureWidth = ((lFuture.multiverseColumns.length * lColumnWidthReal) | 0);
            var lFutureWidth = (lColumnWidthReal | 0);
            var lFutureFullSpanWidth = ((lFuture.multiverseColumns.length * lColumnWidthReal) | 0);
            lFutureLeft += ((((lFuture.multiverseColumns.length - 1) * lColumnWidthReal) / 2) | 0);
            var lFutureHeight = lLevelHeight;
            var lMarginWidth = 2;
            var lMarginHeight = 2;
            if (lFuturePanel.top != lFutureTop) {
              lFuturePanel.top = lFutureTop;
              lNeedToRerenderFuturePanel = true;
            }
            if (lFuturePanel.left != (lFutureLeft + lMarginWidth)) {
              lFuturePanel.left = lFutureLeft + lMarginWidth;
              lNeedToRerenderFuturePanel = true;
            }
            if (lFuturePanel.width != (lFutureWidth - (lMarginWidth * 2))) {
              lFuturePanel.width = (lFutureWidth - (lMarginWidth * 2));
              lNeedToRerenderFuturePanel = true;
            }
            if (lFuturePanel.height != (lFutureHeight - (lMarginHeight * 2))) {
              lFuturePanel.height = (lFutureHeight - (lMarginHeight * 2));
              lNeedToRerenderFuturePanel = true;
            }
            if (lFuturePanel.backgroundColor != lFutureBorderColor) {
              lFuturePanel.backgroundColor = lFutureBorderColor;
              lNeedToRerenderFuturePanel = true;
            }
            if (lFuturePanel.innerHTML != lFutureInnerHTML) {
              lFuturePanel.innerHTML = lFutureInnerHTML;
              lNeedToRerenderFuturePanel = true;
            }
            /*
            if (lFuturePanel.state != lFutureState) {
              lFuturePanel.setState(lFutureState);
              lNeedToRerenderFuturePanel = true;
            }
            if (lFuturePanel.stateColor != lFutureBorderColor) {
              lFuturePanel.setStateColor(lFutureBorderColor);
              lNeedToRerenderFuturePanel = true;
            }
            if (lNeedToRerenderFuturePanel) {
              lFuturePanel.setFocusLine(lHalfWindowWidth);
            }
            */
            lFuturePanel.futurePanelHandled = true;            

            var lDrawLinks = true;
            if (lDrawLinks) {

              if (lFuture.futures.length > 0) {
                if (!lFuturePanel.futureConnectorHorizontal) {
                  lFuturePanel.futureConnectorHorizontal = new cPanel({
                    align : eAlign.eNone,
                    left : 0,
                    top : 0,
                    width : 1,
                    height : 4,
                    backgroundColor : '#666666'
                  });
                  lViewMultiverse.viewBackground.panels.push(lFuturePanel.futureConnectorHorizontal);
                  lNeedToRerenderFutureBackgroundPanel = true;
                }
                if (lFuturePanel.futureConnectorHorizontal.top != (lFuturePanel.top + ((32 / 2) | 0))) {
                  lFuturePanel.futureConnectorHorizontal.top = (lFuturePanel.top + ((32 / 2) | 0));
                  lNeedToRerenderFutureBackgroundPanel = true;
                }
                // left should be halfway first future's column-width
                var lHalfwayFirstFuturesColumnWidth = (((lFuture.futures[0].multiverseColumns.length * 32) / 2) | 0);
                if (lFuturePanel.futureConnectorHorizontal.left != (lFutureFullSpanLeft + ((0 + lHalfwayFirstFuturesColumnWidth) - 0))) {
                  lFuturePanel.futureConnectorHorizontal.left = (lFutureFullSpanLeft + ((0 + lHalfwayFirstFuturesColumnWidth) - 0));
                  lNeedToRerenderFutureBackgroundPanel = true;
                }
                // width should be lFutureWidth minus half of first future's column-width and minus half of last future's column-width
                var lHalfwayLastFuturesColumnWidth = (((lFuture.futures[lFuture.futures.length - 1].multiverseColumns.length * 32) / 2) | 0);
                if (lFuturePanel.futureConnectorHorizontal.width != (lFutureFullSpanWidth - (lHalfwayFirstFuturesColumnWidth + lHalfwayLastFuturesColumnWidth))) {
                  lFuturePanel.futureConnectorHorizontal.width = (lFutureFullSpanWidth - (lHalfwayFirstFuturesColumnWidth + lHalfwayLastFuturesColumnWidth));
                  lNeedToRerenderFutureBackgroundPanel = true;
                }
              } else {
                if (lFuturePanel.futureConnectorHorizontal) {
                  lViewMultiverse.viewBackground.removePanelWithoutRerender(lFuturePanel.futureConnectorHorizontal);
                  lFuturePanel.futureConnectorHorizontal = null;
                  lNeedToRerenderFutureBackgroundPanel = true;
                }
              }

              var lPastPanel = null;
              if (lFuture.past) {
                for (var fi = 0, fc = lViewMultiverse.futurePanels.length; fi < fc; fi++) {
                  if (lViewMultiverse.futurePanels[fi].future.id == lFuture.past.id) {
                    lPastPanel = lViewMultiverse.futurePanels[fi];
                    break;
                  }
                }
              }
              if (lPastPanel != null) {
                if (!lFuturePanel.pastConnectorVertical) {
                  lFuturePanel.pastConnectorVertical = new cPanel({
                    align : eAlign.eNone,
                    left : 0,
                    top : 0,
                    width : 4,
                    height : 32,
                    backgroundColor : '#666666'
                  });
                  lViewMultiverse.viewBackground.panels.push(lFuturePanel.pastConnectorVertical);
                  lNeedToRerenderFutureBackgroundPanel = true;
                }
                if (lFuturePanel.pastConnectorVertical.left != ((lFuturePanel.left + ((lFutureWidth / 2) | 0)) - 4)) {
                  lFuturePanel.pastConnectorVertical.left = ((lFuturePanel.left + ((lFutureWidth / 2) | 0)) - 4);
                  lNeedToRerenderFutureBackgroundPanel = true;
                }
                if (lFuturePanel.pastConnectorVertical.top != (lFuturePanel.top - ((32 / 2) | 0))) {
                  lFuturePanel.pastConnectorVertical.top = (lFuturePanel.top - ((32 / 2) | 0));
                  lNeedToRerenderFutureBackgroundPanel = true;
                }
              } else {
                if (lFuturePanel.pastConnectorVertical) {
                  lViewMultiverse.viewBackground.removePanelWithoutRerender(lFuturePanel.pastConnectorVertical);
                  lFuturePanel.pastConnectorVertical = null;
                  lNeedToRerenderFutureBackgroundPanel = true;
                }
              }
              
            }
            
          }
        }
      
      }
    }
    
    // Remove future panels which have gone out of view.
    for (var fi = 0, fc = lViewMultiverse.futurePanels.length; fi < fc; fi++) {
      if (!lViewMultiverse.futurePanels[fi].futurePanelHandled) {
        if (lViewMultiverse.futurePanels[fi].futureConnectorHorizontal) {
          lViewMultiverse.viewBackground.removePanelWithoutRerender(lViewMultiverse.futurePanels[fi].futureConnectorHorizontal);
          lViewMultiverse.futurePanels[fi].futureConnectorHorizontal = null;
          lNeedToRerenderFutureBackgroundPanel = true;
        }
        if (lViewMultiverse.futurePanels[fi].pastConnectorVertical) {
          lViewMultiverse.viewBackground.removePanelWithoutRerender(lViewMultiverse.futurePanels[fi].pastConnectorVertical);
          lViewMultiverse.futurePanels[fi].pastConnectorVertical = null;
          lNeedToRerenderFutureBackgroundPanel = true;
        }
        if (lViewMultiverse.futurePanels[fi].terminatorPanel) {
          lViewMultiverse.viewFutureOrigin.removePanelWithoutRerender(lViewMultiverse.futurePanels[fi].terminatorPanel);
        }
        lViewMultiverse.viewFutureOrigin.removePanelWithoutRerender(lViewMultiverse.futurePanels[fi]);
        lNeedToRerenderFuturePanel = true;
        lViewMultiverse.futurePanels.splice(fi, 1);
        fi--;
        fc--;
      }
    }
    
    if (lNeedToRerenderFutureBackgroundPanel) {
      lViewMultiverse.viewBackground.rerender();
    }
    if (lNeedToRerenderFuturePanel) {
      lViewMultiverse.viewFuture.rerender();
      lViewMultiverse.viewFutureOrigin.rerender();
    }
    if (lNeedToRerenderOverlayPanel) {
      lViewMultiverse.viewOverlay.rerender();
    }
    /*
    // select which undetermined futures we want to determine.
    if (lSelectedVisibleUndeterminedFuture != null) {
      var lFoundSelectedFuture = false;
      for (var fi = 0, fc = Model.allUndeterminedFutures.length; fi < fc; fi++) {
        if (Model.allUndeterminedFutures[fi].future.id == lSelectedVisibleUndeterminedFuture.id) {
          lFoundSelectedFuture = true;
          break;
        }
      }
      if (!lFoundSelectedFuture) {
        Model.allUndeterminedFutures.push(lSelectedVisibleUndeterminedFuture);
      }
    }
    */
  };

  cViewMultiversePanel.prototype.resetMultiverse = function() {
    Model.resetFutures();

    var lWindowWidth = this.viewFlat.viewMultiverse_Future.getInnerWidth();
    var lHalfWindowWidth = ((lWindowWidth / 2) | 0);

    this.viewOffset.left = lHalfWindowWidth;
    if (this.viewOffset.left > 240) {
      this.viewOffset.left = 240;
    }
    this.viewOffset.top = 140;
    
    // reset flat view
    
    // clear panel futures
    this.viewFlat.viewMultiverse_Future.clearPanels();
    // clear panel background
    this.viewFlat.viewMultiverse_FutureBackground.clearPanels();
    // clear overlay
    this.viewFlat.viewMultiverse_FutureOverlay.clearPanels();
    this.viewFlat.columnIndicatorPanels = [];
    this.viewFlat.levelIndicatorPanels = [];
    this.viewFlat.futurePanels = [];
    //this.viewFlat.horizontalScrollbarPanel = null;
    this.viewFlat.visibleMultiversePanel = null;
    this.viewFlat.outerMultiversePanel = null;
    this.viewFlat.leftBlurPanel = null;
    this.viewFlat.rightBlurPanel = null;
    this.viewFlat.topBlurPanel = null;
    this.viewFlat.centerLinePanel = null;

    this.viewFlat.viewMultiverse_FutureBackground.rerender();
    this.viewFlat.viewMultiverse_Future.rerender();
    this.viewFlat.viewMultiverse_FutureOverlay.rerender();

    // reset fit view
    
    // clear panel futures
    this.viewFit.viewFutureOrigin.clearPanels();
    // clear panel background
    this.viewFit.viewBackground.clearPanels();
    // clear overlay
    this.viewFit.viewOverlay.clearPanels();
    this.viewFit.viewOverlay.ZoomBoundaryPanel = null;
    this.viewFit.columnIndicatorPanels = [];
    this.viewFit.levelIndicatorPanels = [];
    this.viewFit.futurePanels = [];

    this.viewFit.viewBackground.rerender();
    this.viewFit.viewFuture.rerender();
    this.viewFit.viewFutureOrigin.rerender();
    this.viewFit.viewOverlay.rerender();

    this.onUpdateMultiverse();
  };
  
  cViewMultiversePanel.prototype.onVisible = function() {
    if (this.firstOnVisible || (Model.multiverse.totalNumberOfFutures <= 1)) {
      this.firstOnVisible = false;
      this.resetMultiverse();
    } else {
      this.onUpdateMultiverse();
    }
    this.bottomControlPanel.innerControlPanel.searchMethodOptionsPanel.updateSearchMethodCaption();
    if (!this.futureGeneratorThreadActive) {
      this.futureGeneratorThreadActive = true;
      var lThis = this;
      // start timer
      setTimeout(function() {
        lThis.generateFuturesThread();
      }, 100);
    }
  };

  cViewMultiversePanel.prototype.onInvisible = function() {
  };

  cViewMultiversePanel.prototype.onViewFlatFuturePanelMouseDown = function(aX, aY) {
    this.viewFlat.draggingOffset = true;
    this.viewFlat.draggingOffsetStartLeft = this.viewOffset.left;
    this.viewFlat.draggingOffsetStartTop = this.viewOffset.top;
    this.viewFlat.draggingOffsetStartX = aX;
    this.viewFlat.draggingOffsetStartY = aY;
  };

  cViewMultiversePanel.prototype.onViewFlatFuturePanelMouseMove = function(aX, aY) {
    if (this.viewFlat.draggingOffset) {
      this.viewOffset.left = this.viewFlat.draggingOffsetStartLeft + (aX - this.viewFlat.draggingOffsetStartX);
      this.viewOffset.top = this.viewFlat.draggingOffsetStartTop + (aY - this.viewFlat.draggingOffsetStartY);
      this.onUpdateMultiverse();
    }
  };

  cViewMultiversePanel.prototype.onViewFlatFuturePanelMouseUp = function(aX, aY) {
    this.viewFlat.draggingOffset = false;
  };
  
  cViewMultiversePanel.prototype.onViewFlatFuturePanelScroll = function(aDelta) {
    this.viewOffset.top += (aDelta * 50);
    this.onUpdateMultiverse();
  };

  cViewMultiversePanel.prototype.onViewFlatFuturePanelTap = function(aX, aY) {
    // TODO: nicer way to call this
    this.topControlPanel.innerControlPanel.viewModePanel.fitPanel.onClick();
    this.onUpdateMultiverse();
  };
  
  cViewMultiversePanel.prototype.onViewFitFuturePanelMouseDown = function(aX, aY) {
    this.viewFit.draggingOffset = true;
    this.viewFit.draggingOffsetStartLeft = this.viewOffset.left;
    this.viewFit.draggingOffsetStartTop = this.viewOffset.top;
    this.viewFit.draggingOffsetStartX = aX;
    this.viewFit.draggingOffsetStartY = aY;
  };

  cViewMultiversePanel.prototype.onViewFitFuturePanelMouseMove = function(aX, aY) {
    if (this.viewFit.draggingOffset) {
      var lDeltaX = (((aX - this.viewFit.draggingOffsetStartX) / (32 / cMultiverseFuturePanel.cViewColumnWidth)) | 0);
      var lDeltaY = (((aY - this.viewFit.draggingOffsetStartY) / (32 / cMultiverseFuturePanel.cViewHeight)) | 0);
      this.viewOffset.left = this.viewFit.draggingOffsetStartLeft + lDeltaX;
      this.viewOffset.top = this.viewFit.draggingOffsetStartTop + lDeltaY;
      this.onUpdateMultiverse_Fit(true);
    }
  };

  cViewMultiversePanel.prototype.onViewFitFuturePanelMouseUp = function(aX, aY) {
    this.viewFit.draggingOffset = false;
  };
  
  cViewMultiversePanel.prototype.onViewFitFuturePanelScroll = function(aDelta) {
    this.viewOffset.top += (((aDelta * 50) / (32 / cMultiverseFuturePanel.cViewHeight)) | 0);
    this.onUpdateMultiverse_Fit(true);
  };
  
  cViewMultiversePanel.prototype.onViewFitFuturePanelTap = function(aX, aY) {
    var lSupportSoomIntoClickedCoordinates = true;
    if (lSupportSoomIntoClickedCoordinates) {
      var lDeltaX = ((((aX - (this.viewFit.getInnerWidth() / 2)) - 36) / (32 / cMultiverseFuturePanel.cViewColumnWidth)) | 0);
      var lDeltaY = ((((aY - (this.viewFit.getInnerHeight() / 2)) - 18) / (32 / cMultiverseFuturePanel.cViewHeight)) | 0);
      this.viewOffset.left -= lDeltaX;
      this.viewOffset.top -= lDeltaY;
    }
    // TODO: nicer way to call this
    this.topControlPanel.innerControlPanel.viewModePanel.flatPanel.onClick();
    this.onUpdateMultiverse();
  };

  cViewMultiversePanel.prototype.focusOnFuture = function(aFuture) {
    this.viewOffset.left = (-2 + ((this.getInnerWidth() / 2) | 0)) - (aFuture.multiverseColumns[0].columnNumber * cMultiverseFuturePanel.cViewColumnWidth);
    this.viewOffset.top =  (-98 + ((this.getInnerHeight() / 2) | 0)) - (aFuture.level * cMultiverseFuturePanel.cViewHeight);
    this.onUpdateMultiverse();
  };
  
  cViewMultiversePanel.prototype.generateFuturesThread = function() {
    if (this.expansionMode == cViewMultiversePanel.eExpansionMode_Auto) {
      if (Model.stopSearchWhenGoalFound) {
        /*
        var lGoalFuture = Model.multiverse.getGoalFuture();
        if (lGoalFuture != null) {
          Model.allUndeterminedFutures = [];
          // TODO: nicer way to call this
          this.bottomControlPanel.innerControlPanel.expansionModePanel.manualPanel.onClick();
        }
        */
        // TODO: this should be handled completely in Model.
        if (Model.newestGoalFuture != null) {
          Model.allUndeterminedFutures = [];
          // TODO: nicer way to call this
          this.bottomControlPanel.innerControlPanel.expansionModePanel.manualPanel.onClick();
          // auto focus new found goal
          this.focusOnFuture(Model.newestGoalFuture);
          Model.newestGoalFuture = null;
        }
      }
    }
    if (Model.completedDeterminingFutures()) {
      if (this.expansionMode == cViewMultiversePanel.eExpansionMode_Auto) {
        Model.planNextUndeterminedFuture();
      } else {
        Model.allUndeterminedFutures = [];
      }
    }
    if (!Model.completedDeterminingFutures()) {
      var lHalfViewColumnNumber = -((this.viewOffset.left - (cMultiverseFuturePanel.cViewColumnWidth / 2)) / cMultiverseFuturePanel.cViewColumnWidth);
      // This is where futures are generated
      Model.continueDeterminingFutures({
        maxTimeMs : 60,
        maxTotalFutures : this.maxTotalFutures,
        maxDepth : 999,
        focusColumnNumber: (lHalfViewColumnNumber | 0)
      });
      this.onUpdateMultiverse();
    } else {
      if (this.expansionMode == cViewMultiversePanel.eExpansionMode_Auto) {
        // TODO: nicer way to call this
        this.bottomControlPanel.innerControlPanel.expansionModePanel.manualPanel.onClick();
      }
    }
    var lThis = this;
    setTimeout(function() {
      lThis.generateFuturesThread();
    }, 50);
  };

})();

