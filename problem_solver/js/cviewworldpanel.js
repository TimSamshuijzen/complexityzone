// Copyright 2012 Tim Samshuijzen.

include("ccommon.js");
include("cpanel.js");
include("ctexteditpanel.js");
include("cscrollboxpanel.js");
include("ctabmenupanel.js");
include("cautospanpanel.js");
include("ciframepanel.js");
include("cmasterdetailpanel.js");
include("cmodel.js");

/**
  * Class cViewWorldPanel
  */
// Instance class constructor:
function cViewWorldPanel(aProperties) {
  // Call the base constructor:
  cPanel.call(this, aProperties);
  
  var lThis = this;
  
  this.onEditWorld = aProperties.onEditWorld;
  this.onEditWorld_This = aProperties.onEditWorld_This;
  this.screen = aProperties.screen;
  
  this.viewWorld = new cAutoSpanPanel({
    align: eAlign.eClient,
    backgroundColor: 'transparent'
  });
  this.panels.push(this.viewWorld);

  this.viewWorld_Edit_Master = new cAutoSpanPanel({
    align: eAlign.eClient,
    backgroundColor: 'transparent',
    spanMethod: cAutoSpanPanel.spanMethod_vertical
  });
  this.viewWorld.panels.push(this.viewWorld_Edit_Master);
  
  this.viewWorld_Edit_Master_HTML = new cPanel({
    align: eAlign.eClient,
    backgroundColor: 'transparent'
  });
  this.viewWorld_Edit_Master.panels.push(this.viewWorld_Edit_Master_HTML);

  this.viewWorld_Edit_Master_HTML_Header = new cPanel({
    align: eAlign.eTop,
    height: 40,
    backgroundColor: 'transparent',
    innerHTML: '<b>HTML body</b>'
  });
  this.viewWorld_Edit_Master_HTML.panels.push(this.viewWorld_Edit_Master_HTML_Header);
  
  this.viewWorld_Edit_Master_HTML_Edit = new cTextEditPanel({
    align: eAlign.eClient,
    color: '#dddddd',
    backgroundColor: '#333333',
    fontSize: 16,
    value: '',
    onChange: function() {
      Model.setWorldNowHTML(lThis.viewWorld_Edit_Master_HTML_Edit.getValue());
      lThis.updateWorld();
    }
  });
  this.viewWorld_Edit_Master_HTML.panels.push(this.viewWorld_Edit_Master_HTML_Edit);

  this.viewWorld_Edit_Master_CSS = new cPanel({
    align: eAlign.eClient,
    backgroundColor: 'transparent'
  });
  this.viewWorld_Edit_Master.panels.push(this.viewWorld_Edit_Master_CSS);
  
  this.viewWorld_Edit_Master_CSS_Header = new cPanel({
    align: eAlign.eTop,
    height: 40,
    backgroundColor: 'transparent',
    innerHTML: '<b>CSS</b>'
  });
  this.viewWorld_Edit_Master_CSS.panels.push(this.viewWorld_Edit_Master_CSS_Header);
  
  this.viewWorld_Edit_Master_CSS_Edit = new cTextEditPanel({
    align: eAlign.eClient,
    color: '#dddddd',
    backgroundColor: '#333333',
    fontSize: 16,
    value: '',
    onChange: function() {
      Model.setWorldCSS(lThis.viewWorld_Edit_Master_CSS_Edit.getValue());
      lThis.updateWorld();
    }
  });
  this.viewWorld_Edit_Master_CSS.panels.push(this.viewWorld_Edit_Master_CSS_Edit);
  
  this.viewWorld_Edit_Detail = new cAutoSpanPanel({
    align: eAlign.eClient,
    backgroundColor: 'transparent',
    spanMethod: cAutoSpanPanel.spanMethod_vertical
  });
  this.viewWorld.panels.push(this.viewWorld_Edit_Detail);
  
  this.viewWorld_Edit_Detail_Document = new cPanel({
    align: eAlign.eClient,
    backgroundColor: 'transparent'
  });
  this.viewWorld_Edit_Detail.panels.push(this.viewWorld_Edit_Detail_Document);    
  
  this.viewWorld_Edit_Detail_Document_Header = new cPanel({
    align: eAlign.eTop,
    height: 40,
    backgroundColor: 'transparent'
  });
  this.viewWorld_Edit_Detail_Document.panels.push(this.viewWorld_Edit_Detail_Document_Header);
  
  this.viewWorld_Edit_Detail_Document_Header_Caption = new cPanel({
    align: eAlign.eLeft,
    width: 80,
    backgroundColor: 'transparent',
    innerHTML: '<b>World</b>'
  });
  this.viewWorld_Edit_Detail_Document_Header.panels.push(this.viewWorld_Edit_Detail_Document_Header_Caption);

  this.viewWorld_Edit_Detail_Document_Header_Refresh = new cPanel({
    align: eAlign.eLeft,
    width: 34,
    marginBottom: 6,
    backgroundColor: 'transparent',
    image: this.screen.getImageClone(aProperties.refreshImage),
    imageStretch: true,
    onClick: function() {
      lThis.updateWorld();
    }
  });
  this.viewWorld_Edit_Detail_Document_Header.panels.push(this.viewWorld_Edit_Detail_Document_Header_Refresh);    
  
  this.viewWorld_Edit_Detail_Document_View = new cIFramePanel({
    align: eAlign.eClient,
    backgroundColor: 'transparent',
    border: 1,
    borderColor: '#000000',
    iFrameHTML: '',
    supportScroll: true,
    zoom: 1
  });
  this.viewWorld_Edit_Detail_Document.panels.push(this.viewWorld_Edit_Detail_Document_View);  

/*
  this.viewWorld_Edit_Detail_Help = new cPanel({
    align: eAlign.eClient,
    backgroundColor: 'transparent'
  });
  this.viewWorld_Edit_Detail.panels.push(this.viewWorld_Edit_Detail_Help);    
  
  this.viewWorld_Edit_Detail_Help_Header = new cPanel({
    align: eAlign.eTop,
    height: 40,
    backgroundColor: 'transparent'
  });
  this.viewWorld_Edit_Detail_Help.panels.push(this.viewWorld_Edit_Detail_Help_Header);
  
  this.viewWorld_Edit_Detail_Help_Header_Caption = new cPanel({
    align: eAlign.eLeft,
    width: 300,
    backgroundColor: 'transparent',
    innerHTML: '<b>Problem Solver World documentation</b>'
  });
  this.viewWorld_Edit_Detail_Help_Header.panels.push(this.viewWorld_Edit_Detail_Help_Header_Caption);

  this.viewWorld_Edit_Detail_Help_View = new cPanel({
    align: eAlign.eClient,
    backgroundColor: 'transparent'
  });
  this.viewWorld_Edit_Detail_Help.panels.push(this.viewWorld_Edit_Detail_Help_View);
  
  this.viewWorld_Edit_Detail_Help_View_scrollPanel = null;
  
  this.viewWorld_Edit_Detail_Help_View_scrollPanel = new cScrollboxPanel({
    align: eAlign.eClient,
    backgroundColor: 'transparent',
    boxBackgroundColor: '#ffeead',
    scrollBarHandleColor: '#666666',
    autoHideScrollbar: true
  });
  this.viewWorld_Edit_Detail_Help_View.panels.push(this.viewWorld_Edit_Detail_Help_View_scrollPanel);  
  
  this.viewWorld_Edit_Detail_Help_View_scrollPanel_content = new cPanel({
    align: eAlign.eTop,
    height: 1000,
    padding: 20,
    backgroundColor: 'transparent',
    textSelectable: true,
    innerHTML:
      '<div style="position: static; font-size: 32px; font-weight: bold;">\n' +
      '  World\n' +
      '</div>\n' +
      'A "world" is a HTML document that represents a situation or state.\n' +
      'Here you can enter the HTML code for the body of the document. \n' +
      'The CSS code is simply for styling the document.<br />\n' +
      'When modelling the world as HTML code, make sure that the content is easily manipulatable with JavaScript / jQuery.<br />\n' +
      'Manipulations can be entered in the "changes" screen.\n' +
      '\n' +
      '\n' +
      '\n' +
      '\n' +
      '\n' +
      '\n' +
      '\n'
  });
  this.viewWorld_Edit_Detail_Help_View_scrollPanel.panelBox.panels.push(this.viewWorld_Edit_Detail_Help_View_scrollPanel_content);
  */
  
}
// Class inheritance setup:
cViewWorldPanel.deriveFrom(cPanel);
// Static class constructor:
(function() {

  cViewWorldPanel.prototype.screen = null;

  cViewWorldPanel.prototype.viewWorld = null;
  cViewWorldPanel.prototype.viewWorld_Edit_Master = null;
  cViewWorldPanel.prototype.viewWorld_Edit_Master_HTML = null;
  cViewWorldPanel.prototype.viewWorld_Edit_Master_HTML_Header = null;
  cViewWorldPanel.prototype.viewWorld_Edit_Master_HTML_Edit = null;
  cViewWorldPanel.prototype.viewWorld_Edit_Master_CSS = null;
  cViewWorldPanel.prototype.viewWorld_Edit_Master_CSS_Header = null;
  cViewWorldPanel.prototype.viewWorld_Edit_Master_CSS_Edit = null;
  cViewWorldPanel.prototype.viewWorld_Edit_Detail = null;
  cViewWorldPanel.prototype.viewWorld_Edit_Detail_Document = null;
  cViewWorldPanel.prototype.viewWorld_Edit_Detail_Document_Header = null;
  cViewWorldPanel.prototype.viewWorld_Edit_Detail_Document_Header_Caption = null;
  cViewWorldPanel.prototype.viewWorld_Edit_Detail_Document_Header_Refresh = null;
  cViewWorldPanel.prototype.viewWorld_Edit_Detail_Document_View = null;
  cViewWorldPanel.prototype.viewWorld_Edit_Detail_Help = null;
  cViewWorldPanel.prototype.viewWorld_Edit_Detail_Help_Header = null;
  cViewWorldPanel.prototype.viewWorld_Edit_Detail_Help_Header_Caption = null;
  cViewWorldPanel.prototype.viewWorld_Edit_Detail_Help_View = null;
  cViewWorldPanel.prototype.viewWorld_Edit_Detail_Help_View_scrollPanel = null;
  cViewWorldPanel.prototype.viewWorld_Edit_Detail_Help_View_scrollPanel_content = null;
  cViewWorldPanel.prototype.onEditWorld = null;
  cViewWorldPanel.prototype.onEditWorld_This = null;

  cViewWorldPanel.prototype.reloadWorld = function() {
    if (this.viewWorld_Edit_Master_HTML_Edit) {
      this.viewWorld_Edit_Master_HTML_Edit.setValue(Model.getWorldNowHTML());
    }
    if (this.viewWorld_Edit_Master_CSS_Edit) {
      this.viewWorld_Edit_Master_CSS_Edit.setValue(Model.getWorldCSS());
    }
    this.updateWorld();
  };

  cViewWorldPanel.prototype.updateWorld = function() {
    if (this.viewWorld_Edit_Detail_Document_View) {
      var lThis = this;
      setTimeout(function() {
        var lFullHTML = Model.getWorldNowFullHTML();
        lThis.viewWorld_Edit_Detail_Document_View.setContent(lFullHTML);
        
        if (lThis.onEditWorld) {
          if (lThis.onEditWorld_This) {
            lThis.onEditWorld.apply(lThis.onEditWorld_This, []);
          } else {
            lThis.onEditWorld();
          }
        }
      }, 100);
    }
  };

})();
  
