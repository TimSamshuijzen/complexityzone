// Copyright 2012 Tim Samshuijzen.

include("ccommon.js");
include("cpanel.js");
include("ciframepanel.js");
include("cfuture.js");
include("cmodel.js");
include("clsModalPanel.js");
include("cautospanpanel.js");
include("ctexteditpanel.js");

/**
 * Class cMultiverseFuturePanel
 */
// Instance class constructor:
function cMultiverseFuturePanel(aProperties) {
  // Call the base constructor:
  cPanel.call(this, aProperties);

  var lThis = this;

  this.backgroundColor = 'transparent';
  //this.backgroundColor = #666666'; //'transparent'; //'#ffffff'; // make 'transparent' after lines have been added
  //this.borderLeft = 2;
  //this.borderTop = 1;
  //this.borderRight = 2;
  //this.borderBottom = 1;
  this.screen = aProperties.screen;
  this.future = aProperties.future ? aProperties.future : null;
  this.state = aProperties.state ? aProperties.state : '';
  this.stateColor = aProperties.stateColor ? aProperties.stateColor : '#000000';
  this.changesImageId = aProperties.changesImageId;
  this.evaluateImageId = aProperties.evaluateImageId;
  //this.borderColor = this.stateColor;

  /*
  this.horizontalConnectorPanel = new cPanel({
    align : eAlign.eCenterHorizontal,
    height: 8,
    marginLeft: ((cMultiverseFuturePanel.cViewColumnWidth / 2) | 0),
    marginRight: ((cMultiverseFuturePanel.cViewColumnWidth / 2) | 0),
    backgroundColor : '#000000'
  });
  this.panels.push(this.horizontalConnectorPanel);
  */
 
  this.containerPanel = new cPanel({
    align : eAlign.eHeight, //eAlign.eCenterVertical,
    left : 0,
    width : cMultiverseFuturePanel.cViewColumnWidth - 8,
    backgroundColor : 'transparent',
    //borderLeft : 1,
    //borderRight : 1,
    //borderColor : '#000000', // this.stateColor
    onTap: function() {
      this.stopBubble = true;
      lThis.openDetailPanel();
    }
  });
  this.panels.push(this.containerPanel);

  this.iFramePanel = new cIFramePanel({
    align : eAlign.eLeft,
    width : ((cMultiverseFuturePanel.cViewColumnWidth / 2) | 0) - 4,
    backgroundColor : 'transparent',
    iFrameHTML : '',
    supportScroll : false,
    zoom : 0.3 // 0.25
  });
  this.containerPanel.panels.push(this.iFramePanel);
  this.iFramePanel.setContent(Model.getFutureFullHTML(this.future));

  this.infoPanel = new cPanel({
    align : eAlign.eClient,
    backgroundColor : '#96ceb4',
    color : '#000000',
    fontSize: 12
  });
  this.containerPanel.panels.push(this.infoPanel);
  
  this.infoPanelAction = new cPanel({
    align : eAlign.eTop,
    height : ((cMultiverseFuturePanel.cViewHeight / 2) | 0),
    backgroundColor : '#96ceb4',
    color : '#000000',
    fontSize: 12,
    textAlign: eTextAlign.eCenter,
    innerHTML : ((this.future.id == Model.multiverse.worldNow.id) ? 'now' :  cLib.textToHTML(this.future.actionDescription))
  });
  this.infoPanel.panels.push(this.infoPanelAction);
  
  this.infoPanelEvaluation = new cPanel({
    align : eAlign.eTop,
    height : ((cMultiverseFuturePanel.cViewHeight / 2) | 0),
    backgroundColor : this.stateColor,
    color : '#000000',
    fontSize: 12, //22,
    //border: 10,
    //borderColor: '#FFAE3C',
    textAlign: eTextAlign.eCenter,
    innerHTML : this.state
  });
  this.infoPanel.panels.push(this.infoPanelEvaluation);

}

// Class inheritance setup:
cMultiverseFuturePanel.deriveFrom(cPanel);
// Static class constructor:
(function() {
  cMultiverseFuturePanel.cViewColumnWidth = 180; //92;
  cMultiverseFuturePanel.cViewHeight = 100; // 92;

  cMultiverseFuturePanel.evaluationColor = function(aFuture) {
    var lColor = '#ffeead'; // '#aa9977';
    if (aFuture.evaluation.illegal) {
      lColor = '#ff4444';
    } else if (aFuture.evaluation.goal) {
      lColor = '#339933';
    } else if (aFuture.evaluation.ignore) {
      lColor = '#666666';
    } else if (aFuture.evaluation.end) {
      lColor = '#666666';
    } else if (aFuture.evaluation.like > 0) {
      lColor = '#FFAE3C'; //'#339933';
    } else if (aFuture.evaluation.like < 0) {
      lColor = '#FFBBBB'; //'#993333';
    } else if (aFuture.evaluation.same) {
      //lColor = '#666666';
    }
    return lColor;
  };

  cMultiverseFuturePanel.evaluationText = function(aFuture) {
    var lText = '';
    if (aFuture.evaluation.evaluationDescription != '') {
      lText = aFuture.evaluation.evaluationDescription;
    } else if (aFuture.evaluation.illegal) {
      lText = 'illegal';
    } else if (aFuture.evaluation.goal) {
      lText = 'goal';
    } else if (aFuture.evaluation.ignore) {
      lText = 'ignore';
    } else if (aFuture.evaluation.end) {
      lText = 'end';
    } else if (aFuture.evaluation.like > 0) {
      lText = '' + aFuture.evaluation.like;
    } else if (aFuture.evaluation.like < 0) {
      lText = '' + aFuture.evaluation.like;
    } else if (aFuture.evaluation.same) {
      //lText = 'same';
    }
    return lText;
  };

  cMultiverseFuturePanel.prototype.screen = null;
  cMultiverseFuturePanel.prototype.future = null;
  cMultiverseFuturePanel.prototype.state = '';
  cMultiverseFuturePanel.prototype.stateColor = '#000000';
  //cMultiverseFuturePanel.prototype.horizontalConnectorPanel = null;
  cMultiverseFuturePanel.prototype.containerPanel = null;
  cMultiverseFuturePanel.prototype.iFramePanel = null;
  cMultiverseFuturePanel.prototype.infoPanel = null;
  cMultiverseFuturePanel.prototype.infoPanelAction = null;
  cMultiverseFuturePanel.prototype.infoPanelEvaluation = null;
  cMultiverseFuturePanel.prototype.changesImageId = null;
  cMultiverseFuturePanel.prototype.evaluateImageId = null;

  cMultiverseFuturePanel.prototype.setState = function(aState) {
    if (this.state != aState) {
      this.state = aState;
      this.infoPanelEvaluation.setInnerHTML(cLib.textToHTML(this.state));
    }
  };

  cMultiverseFuturePanel.prototype.setStateColor = function(aStateColor) {
    if (this.stateColor != aStateColor) {
      this.stateColor = aStateColor;
      this.infoPanelEvaluation.backgroundColor = this.stateColor;
      //this.setBorderColor(this.stateColor);
      //this.containerPanel.setBorderColor(this.stateColor);
    }
  };
  
  cMultiverseFuturePanel.prototype.setFocusLine = function(aLineX) {
    /*
    var lInnerX = aLineX - (this.left + 2);
    var lLeft = lInnerX - (((cMultiverseFuturePanel.cViewColumnWidth - 8) / 2) | 0);
    if (lLeft < 0) {
      lLeft = 0;
    } else if (lLeft > (this.getInnerWidth() - (cMultiverseFuturePanel.cViewColumnWidth - 8))) {
      lLeft = (this.getInnerWidth() - (cMultiverseFuturePanel.cViewColumnWidth - 8));
    }
    this.containerPanel.setLeft(lLeft);
    */
   

    var lLeft = (((this.getInnerWidth() - (cMultiverseFuturePanel.cViewColumnWidth - 8)) / 2) | 0);
    this.containerPanel.setLeft(lLeft);
  };

  cMultiverseFuturePanel.prototype.openDetailPanel = function(aLineX) {
    var lThis = this;
    // open future detail panel
    var lModalPanel = new clsModalPanel({
      onClick: function() {
        setTimeout(function() {
          lThis.screen.panel.removePanel(lModalPanel);
        }, 10);
      }
    });
    this.screen.panel.appendPanel(lModalPanel);
    lModalPanel.futureDetailPanel = new cPanel({
      align: eAlign.eClient,
      shape: cPanel.cShapeRoundRect,
      //width: 720,
      //height: 200,
      marginLeft: 100,
      marginTop: 40,
      marginRight: 100,
      marginBottom: 40,
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
    lModalPanel.contentPanel.panels.push(lModalPanel.futureDetailPanel);
    lModalPanel.futureDetailPanel.headerPanel = new cPanel({
      align: eAlign.eTop,
      height: 50,
      paddingLeft: 20,
      backgroundColor: '#444444', 
      color: '#eeeeee',
      fontSize: 36,
      innerHTML: 'Future world'
    });
    lModalPanel.futureDetailPanel.panels.push(lModalPanel.futureDetailPanel.headerPanel);
    
    lModalPanel.futureDetailPanel.bottomPanel = new cPanel({
      align: eAlign.eBottom,
      height: 70,
      paddingLeft: 20,
      backgroundColor: '#444444'
    });
    lModalPanel.futureDetailPanel.panels.push(lModalPanel.futureDetailPanel.bottomPanel);

    lModalPanel.futureDetailPanel.bottomPanel.cancelButton = new cPanel({
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
    lModalPanel.futureDetailPanel.bottomPanel.panels.push(lModalPanel.futureDetailPanel.bottomPanel.cancelButton);

    lModalPanel.futureDetailPanel.spanPanel = new cAutoSpanPanel({
      align: eAlign.eClient,
      backgroundColor: 'transparent',
      spanMethod: cAutoSpanPanel.spanMethod_auto
    });
    lModalPanel.futureDetailPanel.panels.push(lModalPanel.futureDetailPanel.spanPanel);

    lModalPanel.futureDetailPanel.masterPanel = new cScrollboxPanel({
      align: eAlign.eClient,
      panelBoxRoundedBorder: false,
      marginLeft: 10,
      marginRight: 10,
      paddingTop: 20,
      paddingBottom: 20,
      backgroundColor: 'transparent',
      boxBackgroundColor: '#262626', //'#ffffff', //  '#96ceb4',
      scrollBarHandleColor: '#666666',
      autoHideScrollbar: true
    });
    lModalPanel.futureDetailPanel.spanPanel.panels.push(lModalPanel.futureDetailPanel.masterPanel);

    var lFuturePath = [];
    var lFuture = this.future;
    while (lFuture != null) {
      lFuturePath.splice(0, 0, lFuture);
      lFuture = lFuture.past; 
    }
    var lFuturePanels = [];
    for (var fi = 0, fc = lFuturePath.length; fi < fc; fi++) {
      lFuture = lFuturePath[fi];
      var lFuturePanel = new cPanel({
        align: eAlign.eTop,
        marginTop: 4,
        marginBottom: 4,
        height: cMultiverseFuturePanel.cViewHeight + 8,
        backgroundColor: ((lFuture.id == this.future.id) ? '#cccccc' : '#333333'),
        onClick: function() {
          for (var fpi = 0, fpc = lFuturePanels.length; fpi < fpc; fpi++) {
            var lFP = lFuturePanels[fpi];
            if (lFP.future.id == this.future.id) {
              lFP.setBackgroundColor('#cccccc');
            } else {
              lFP.setBackgroundColor('#333333');
            }
          }
          lModalPanel.futureDetailPanel.detailPanel.spanPanel.worldPanel.iFramePanel.setContent(Model.getFutureFullHTML(this.future));
          lModalPanel.futureDetailPanel.detailPanel.spanPanel.worldPanel.htmlCodePanel.setValue(this.future.worldHTML);
          lModalPanel.futureDetailPanel.detailPanel.spanPanel.infoPanel.actionPanel.textPanel.setInnerHTML(cLib.textToHTML(this.future.actionDescription));
          lModalPanel.futureDetailPanel.detailPanel.spanPanel.infoPanel.evaluationPanel.textPanel.setBackgroundColor(cMultiverseFuturePanel.evaluationColor(this.future));
          lModalPanel.futureDetailPanel.detailPanel.spanPanel.infoPanel.evaluationPanel.textPanel.setInnerHTML(cLib.textToHTML(cMultiverseFuturePanel.evaluationText(this.future)));
        }
      });
      lFuturePanel.future = lFuture;
      lModalPanel.futureDetailPanel.masterPanel.panelBox.panels.push(lFuturePanel);
      lFuturePanels.push(lFuturePanel);

      lFuturePanel.containerPanel = new cPanel({
        align : eAlign.eCenterVertical,
        width : cMultiverseFuturePanel.cViewColumnWidth - 8,
        backgroundColor : 'transparent',
        borderLeft : 1,
        borderRight : 1,
        borderColor : '#000000'
      });
      lFuturePanel.panels.push(lFuturePanel.containerPanel);

      lFuturePanel.iFramePanel = new cIFramePanel({
        align : eAlign.eLeft,
        width : ((cMultiverseFuturePanel.cViewColumnWidth / 2) | 0) - 4,
        backgroundColor : 'transparent',
        iFrameHTML : '',
        supportScroll : false,
        zoom : 0.3 // 0.25
      });
      lFuturePanel.containerPanel.panels.push(lFuturePanel.iFramePanel);
      lFuturePanel.iFramePanel.setContent(Model.getFutureFullHTML(lFuture));

      lFuturePanel.infoPanel = new cPanel({
        align : eAlign.eClient,
        backgroundColor : '#96ceb4',
        color : '#000000',
        fontSize: 12
      });
      lFuturePanel.containerPanel.panels.push(lFuturePanel.infoPanel);
      
      lFuturePanel.infoPanelAction = new cPanel({
        align : eAlign.eTop,
        height : ((cMultiverseFuturePanel.cViewHeight / 2) | 0),
        backgroundColor : '#96ceb4',
        color : '#000000',
        fontSize: 12,
        textAlign: eTextAlign.eCenter,
        innerHTML : ((lFuture.id == Model.multiverse.worldNow.id) ? 'now' :  cLib.textToHTML(lFuture.actionDescription))
      });
      lFuturePanel.infoPanel.panels.push(lFuturePanel.infoPanelAction);
      
      lFuturePanel.infoPanelEvaluation = new cPanel({
        align : eAlign.eTop,
        height : ((cMultiverseFuturePanel.cViewHeight / 2) | 0),
        backgroundColor : cMultiverseFuturePanel.evaluationColor(lFuture),
        color : '#000000',
        fontSize: 12, //22,
        //border: 10,
        //borderColor: '#FFAE3C',
        textAlign: eTextAlign.eCenter,
        innerHTML : cLib.textToHTML(cMultiverseFuturePanel.evaluationText(lFuture))
      });
      lFuturePanel.infoPanel.panels.push(lFuturePanel.infoPanelEvaluation);

      lFuturePanel.levelIndicator = new cPanel({
        align : eAlign.eRight,
        width : ((cMultiverseFuturePanel.cViewColumnWidth / 2) | 0),
        paddingTop : ((cMultiverseFuturePanel.cViewHeight / 5) | 0),
        backgroundColor : '#666666',
        transparencyPercentage : 50,
        color: '#ffffff',
        fontSize: 36,
        borderColor: '#333333',
        borderTop: 1,
        borderBottom: 1,
        textAlign: eTextAlign.eCenter,
        innerHTML: ((fi == 0) ? 'now' : (fi + ''))
      });
      lFuturePanel.panels.push(lFuturePanel.levelIndicator);
    }
    
    lModalPanel.futureDetailPanel.detailPanel = new cPanel({
      align: eAlign.eClient,
      backgroundColor: '#ffffff' //transparent'
    });
    lModalPanel.futureDetailPanel.spanPanel.panels.push(lModalPanel.futureDetailPanel.detailPanel);

    lModalPanel.futureDetailPanel.detailPanel.spanPanel = new cAutoSpanPanel({
      align: eAlign.eClient,
      backgroundColor: 'transparent',
      spanMethod: cAutoSpanPanel.spanMethod_auto,
      separationMargin: 0
    });
    lModalPanel.futureDetailPanel.detailPanel.panels.push(lModalPanel.futureDetailPanel.detailPanel.spanPanel);


    lModalPanel.futureDetailPanel.detailPanel.spanPanel.worldPanel = new cAutoSpanPanel({
      align : eAlign.eClient,
      backgroundColor : 'transparent',
      spanMethod: cAutoSpanPanel.spanMethod_auto,
      separationMargin: 0
    });
    lModalPanel.futureDetailPanel.detailPanel.spanPanel.panels.push(lModalPanel.futureDetailPanel.detailPanel.spanPanel.worldPanel);

    lModalPanel.futureDetailPanel.detailPanel.spanPanel.worldPanel.iFramePanel = new cIFramePanel({
      align : eAlign.eClient,
      backgroundColor : 'transparent',
      iFrameHTML : '',
      supportScroll : true,
      zoom : 1.0 // 0.25
    });
    lModalPanel.futureDetailPanel.detailPanel.spanPanel.worldPanel.panels.push(lModalPanel.futureDetailPanel.detailPanel.spanPanel.worldPanel.iFramePanel);
    lModalPanel.futureDetailPanel.detailPanel.spanPanel.worldPanel.iFramePanel.setContent(Model.getFutureFullHTML(this.future));

    lModalPanel.futureDetailPanel.detailPanel.spanPanel.worldPanel.htmlCodePanel = new cTextEditPanel({
      align: eAlign.eClient,
      color: '#dddddd',
      backgroundColor: '#333333',
      fontSize: 16,
      value: this.future.worldHTML,
      readOnly: true
    });
    lModalPanel.futureDetailPanel.detailPanel.spanPanel.worldPanel.panels.push(lModalPanel.futureDetailPanel.detailPanel.spanPanel.worldPanel.htmlCodePanel);

    lModalPanel.futureDetailPanel.detailPanel.spanPanel.infoPanel = new cAutoSpanPanel({
      align : eAlign.eClient,
      backgroundColor : 'transparent',
      spanMethod: cAutoSpanPanel.spanMethod_auto,
      separationMargin: 0
    });
    lModalPanel.futureDetailPanel.detailPanel.spanPanel.panels.push(lModalPanel.futureDetailPanel.detailPanel.spanPanel.infoPanel);

    lModalPanel.futureDetailPanel.detailPanel.spanPanel.infoPanel.actionPanel = new cPanel({
      align : eAlign.eClient,
      backgroundColor : '#96ceb4'
    });
    lModalPanel.futureDetailPanel.detailPanel.spanPanel.infoPanel.panels.push(lModalPanel.futureDetailPanel.detailPanel.spanPanel.infoPanel.actionPanel);

    lModalPanel.futureDetailPanel.detailPanel.spanPanel.infoPanel.actionPanel.imageContainerPanel = new cPanel({
      align : eAlign.eTop,
      height : 100,
      backgroundColor : 'transparent'
    });
    lModalPanel.futureDetailPanel.detailPanel.spanPanel.infoPanel.actionPanel.panels.push(lModalPanel.futureDetailPanel.detailPanel.spanPanel.infoPanel.actionPanel.imageContainerPanel);

    lModalPanel.futureDetailPanel.detailPanel.spanPanel.infoPanel.actionPanel.imageContainerPanel.imagePanel = new cPanel({
      align : eAlign.eCenter,
      width : 90,
      height : 90,
      backgroundColor : 'transparent',
      image: this.screen.getImageClone(this.changesImageId),
      imageStretchWidth: 90,
      imageStretchHeight: 90
    });
    lModalPanel.futureDetailPanel.detailPanel.spanPanel.infoPanel.actionPanel.imageContainerPanel.panels.push(lModalPanel.futureDetailPanel.detailPanel.spanPanel.infoPanel.actionPanel.imageContainerPanel.imagePanel);

    lModalPanel.futureDetailPanel.detailPanel.spanPanel.infoPanel.actionPanel.textPanel = new cPanel({
      align : eAlign.eClient,
      backgroundColor : 'transparent',
      color : '#000000',
      fontSize: 30,
      textAlign: eTextAlign.eCenter,
      innerHTML : cLib.textToHTML(this.future.actionDescription) // ((this.future == Model.multiverse.worldNow) ? 'now' :  cLib.textToHTML(this.future.actionDescription))
    });
    lModalPanel.futureDetailPanel.detailPanel.spanPanel.infoPanel.actionPanel.panels.push(lModalPanel.futureDetailPanel.detailPanel.spanPanel.infoPanel.actionPanel.textPanel);


    lModalPanel.futureDetailPanel.detailPanel.spanPanel.infoPanel.evaluationPanel = new cPanel({
      align : eAlign.eClient,
      backgroundColor : '#FFAE3C'
    });
    lModalPanel.futureDetailPanel.detailPanel.spanPanel.infoPanel.panels.push(lModalPanel.futureDetailPanel.detailPanel.spanPanel.infoPanel.evaluationPanel);

    lModalPanel.futureDetailPanel.detailPanel.spanPanel.infoPanel.evaluationPanel.imageContainerPanel = new cPanel({
      align : eAlign.eTop,
      height : 100,
      backgroundColor : 'transparent'
    });
    lModalPanel.futureDetailPanel.detailPanel.spanPanel.infoPanel.evaluationPanel.panels.push(lModalPanel.futureDetailPanel.detailPanel.spanPanel.infoPanel.evaluationPanel.imageContainerPanel);

    lModalPanel.futureDetailPanel.detailPanel.spanPanel.infoPanel.evaluationPanel.imageContainerPanel.imagePanel = new cPanel({
      align : eAlign.eCenter,
      width : 90,
      height : 90,
      backgroundColor : 'transparent',
      image: this.screen.getImageClone(this.evaluateImageId),
      imageStretchWidth: 90,
      imageStretchHeight: 90
    });
    lModalPanel.futureDetailPanel.detailPanel.spanPanel.infoPanel.evaluationPanel.imageContainerPanel.panels.push(lModalPanel.futureDetailPanel.detailPanel.spanPanel.infoPanel.evaluationPanel.imageContainerPanel.imagePanel);

    lModalPanel.futureDetailPanel.detailPanel.spanPanel.infoPanel.evaluationPanel.textPanel = new cPanel({
      align : eAlign.eClient,
      backgroundColor :  this.stateColor,
      borderLeft: 30,
      borderRight: 30,
      borderBottom: 30,
      borderColor: '#FFAE3C',
      padding : 20,
      color : '#000000',
      fontSize: 30,
      textAlign: eTextAlign.eCenter,
      innerHTML :  this.state
    });
    lModalPanel.futureDetailPanel.detailPanel.spanPanel.infoPanel.evaluationPanel.panels.push(lModalPanel.futureDetailPanel.detailPanel.spanPanel.infoPanel.evaluationPanel.textPanel);

    lModalPanel.contentPanel.rerender();
    lModalPanel.futureDetailPanel.rerender();

    lModalPanel.futureDetailPanel.masterPanel.scrollToBottom();    
  };


})();

