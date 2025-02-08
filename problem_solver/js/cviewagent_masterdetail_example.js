// Copyright 2012 Tim Samshuijzen.

include("ccommon.js");
include("cpanel.js");
include("cmasterdetailpanel.js");
include("ctabmenupanel.js");

/**
  * Class cViewAgent
  */
// Instance class constructor:
function cViewAgent(aProperties) {
  // Call the base constructor:
  cBase.call(this);
  
  var lThis = this;
  
  this.screen = aProperties.screen;
  
  this.viewAgent = new cTabMenuPanel({
    align: eAlign.eClient,
    maxTabWidth: 140,
    backgroundColor: 'transparant',
    panelHTML: '',
    closeImage: this.screen.getImageClone(aProperties.closeImage),
    tabs: [
      {id: 'evaluations', backgroundColor: '#4e8c77', imageSrc: '', caption: 'evaluations'}, // '#364659'
      {id: 'actions', backgroundColor: '#D3FFEB', imageSrc: '', caption: 'actions'} //'#ffcc5c'
    ]
  });
  aProperties.parentPanel.panels.push(this.viewAgent);
  
  this.viewAgent_root = new cPanel({
    align: eAlign.eClient,
    backgroundColor: 'transparant'
  });
  this.viewAgent.rootClientPanel.panels.push(this.viewAgent_root);
  
  this.viewAgent_root_activeevaluations = new cPanel({
    align: eAlign.eTop,
    height: 100,
    marginTop: 4,
    border: 1,
    backgroundColor: 'transparant',
    innerHTML: 'active evaluations'
  });
  this.viewAgent_root.panels.push(this.viewAgent_root_activeevaluations);

  this.viewAgent_root_possibleactions = new cPanel({
    align: eAlign.eTop,
    height: 100,
    marginTop: 4,
    border: 1,
    backgroundColor: 'transparant',
    innerHTML: 'possible actions'
  });
  this.viewAgent_root.panels.push(this.viewAgent_root_possibleactions);  
  
  
  this.viewAgent_Evaluations = new cMasterDetailPanel({
    align: eAlign.eClient,
    backgroundColor: 'transparant',
    screen: aProperties.screen,
    data: Model.agent.evaluations,
    itemName: 'evaluation',
    closeImage: aProperties.closeImage,
    refreshImage: aProperties.refreshImage,
    addImage: aProperties.addImage,
    deleteImage: aProperties.deleteImage,
    upImage: aProperties.upImage,
    downImage: aProperties.downImage
  });
  this.viewAgent.getPanelById('evaluations').panels.push(this.viewAgent_Evaluations);
  
  this.viewAgent_Actions = new cMasterDetailPanel({
    align: eAlign.eClient,
    backgroundColor: 'transparant',
    screen: aProperties.screen,
    data: Model.agent.actions,
    itemName: 'action',
    closeImage: aProperties.closeImage,
    refreshImage: aProperties.refreshImage,
    addImage: aProperties.addImage,
    deleteImage: aProperties.deleteImage,
    upImage: aProperties.upImage,
    downImage: aProperties.downImage
  });
  this.viewAgent.getPanelById('actions').panels.push(this.viewAgent_Actions);
}
// Class inheritance setup:
cViewAgent.deriveFrom(cBase);
// Static class constructor:
(function() {

  cViewAgent.prototype.screen = null;

  cViewAgent.prototype.viewAgent = null;
  cViewAgent.prototype.viewAgent_root = null;
  cViewAgent.prototype.viewAgent_root_activeevaluations = null;
  cViewAgent.prototype.viewAgent_root_possibleactions = null;
  cViewAgent.prototype.viewAgent_Evaluations = null;
  cViewAgent.prototype.viewAgent_Actions = null;

})();
  
