// Copyright 2012 Tim Samshuijzen.

include("ccommon.js");
include("cpanel.js");
include("ctexteditpanel.js");
include("ctextlineeditpanel.js");
include("cscrollboxpanel.js");
include("ctabmenupanel.js");
include("cautospanpanel.js");
include("cdataarray.js");
include("cdataitem.js");

/**
  * Class cMasterDetailPanel
  */
// Instance class constructor:
function cMasterDetailPanel(aProperties) {
  // Call the base constructor:
  cPanel.call(this, aProperties);
  
  var lThis = this;
  
  var lScreen = aProperties.screen;
  
  this.data = aProperties ? (typeof aProperties.data != 'undefined' ? aProperties.data : new cDataArray()) : new cDataArray();
  this.lastItemId = 0;
  this.selectedItemId = 0;
  this.itemName = aProperties ? (typeof aProperties.itemName != 'undefined' ? aProperties.itemName : '') : '';
  
  this.mainPanel = new cAutoSpanPanel({
    align: eAlign.eClient,
    backgroundColor: 'transparent'
  });
  this.panels.push(this.mainPanel);

  this.mainPanel_Master = new cPanel({
    align: eAlign.eClient,
    backgroundColor: 'transparent'
  });
  this.mainPanel.panels.push(this.mainPanel_Master);

  this.mainPanel_DetailContainer = new cPanel({
    shape: cPanel.cShapeRoundRect,
    borderRadius: 12,
    align: eAlign.eClient,
    backgroundColor: '#b4b4b4',
    padding: 10
  });
  this.mainPanel.panels.push(this.mainPanel_DetailContainer);
  
  this.mainPanel_DetailContainer_root = new cPanel({
    align: eAlign.eClient,
    backgroundColor: 'transparent',
    innerHTML: '' // can be set through this.setRootPanelHTMLContent()
  });
  this.mainPanel_DetailContainer.panels.push(this.mainPanel_DetailContainer_root);
  
  this.mainPanel_DetailContainer_Panel = new cPanel({
    align: eAlign.eClient,
    backgroundColor: '#b4b4b4',
    visible: false // initialize as hidden
  });
  this.mainPanel_DetailContainer.panels.push(this.mainPanel_DetailContainer_Panel);

  this.mainPanel_DetailContainer_Panel_ControlPanel = new cPanel({
    align: eAlign.eTop,
    height: 51,
    backgroundColor: 'transparent',
    borderBottom: 1,
    borderColor: '#000000',
    paddingBottom: 8,
    marginBottom: 6
  });
  this.mainPanel_DetailContainer_Panel.panels.push(this.mainPanel_DetailContainer_Panel_ControlPanel);

  // Move up
  this.mainPanel_DetailContainer_Panel_ControlPanel_MoveUpPanel = new cPanel({
    shape: cPanel.cShapeRoundRect,
    borderRadius: 6,
    align: eAlign.eLeft,
    width: 110,
    padding: 4,
    marginRight: 10,
    backgroundColor: '#6d6d6d',
    onMouseUp: function() {
      // move up item
      if (lThis.selectedItemId > 0) {
        var lMoveOk = false;
        for (var li = 0; li < lThis.data.items.length; li++) {
          if (lThis.data.items[li].id == lThis.selectedItemId) {
            if (li > 0) {
              var lSwapItem = lThis.data.items[li];
              lThis.data.items[li] = lThis.data.items[li - 1];
              lThis.data.items[li - 1] = lSwapItem;
              lMoveOk = true;
            }
            break;
          }
        }
        if (lMoveOk) {
          for (var li = 0; li < lThis.mainPanel_Master_Scrollbox.panelBox.panels.length; li++) {
            if (lThis.mainPanel_Master_Scrollbox.panelBox.panels[li].itemId == lThis.selectedItemId) {
              if (li > 0) {
                lThis.mainPanel_Master_Scrollbox.panelBox.moveUpPanel(lThis.mainPanel_Master_Scrollbox.panelBox.panels[li]);
                lThis.mainPanel_Master_Scrollbox.scrollToPercentage((((li - 1) * 100) / lThis.mainPanel_Master_Scrollbox.panelBox.panels.length));
              }
              break;
            }
          }
          lThis.selectItemId(lThis.selectedItemId);
          lScreen.panel.rerender();
        }
      }
    }
  });
  this.mainPanel_DetailContainer_Panel_ControlPanel.panels.push(this.mainPanel_DetailContainer_Panel_ControlPanel_MoveUpPanel);
  this.mainPanel_DetailContainer_Panel_ControlPanel_MoveUpPanel_Button = new cPanel({
    align: eAlign.eLeft,
    width: 28,
    backgroundColor: 'transparent',
    image: lScreen.getImageClone(aProperties.upImage),
    imageStretch: true
  });
  this.mainPanel_DetailContainer_Panel_ControlPanel_MoveUpPanel.panels.push(this.mainPanel_DetailContainer_Panel_ControlPanel_MoveUpPanel_Button);
  this.mainPanel_DetailContainer_Panel_ControlPanel_MoveUpPanel_Label = new cPanel({
    align: eAlign.eClient,
    marginLeft: 6,
    paddingTop: 1,
    color: '#ffffff',
    backgroundColor: 'transparent',
    innerHTML: 'up',
    fontSize: 20,
    fontBold: true,
    noWrap: true
  });
  this.mainPanel_DetailContainer_Panel_ControlPanel_MoveUpPanel.panels.push(this.mainPanel_DetailContainer_Panel_ControlPanel_MoveUpPanel_Label);
  
  // Move down
  this.mainPanel_DetailContainer_Panel_ControlPanel_MoveDownPanel = new cPanel({
    shape: cPanel.cShapeRoundRect,
    borderRadius: 6,
    align: eAlign.eLeft,
    width: 110,
    padding: 4,
    marginRight: 10,
    backgroundColor: '#6d6d6d',
    onMouseUp: function() {
      // move down item
      if (lThis.selectedItemId > 0) {
        var lMoveOk = false;
        for (var li = 0; li < lThis.data.items.length; li++) {
          if (lThis.data.items[li].id == lThis.selectedItemId) {
            if (li < (lThis.data.items.length - 1)) {
              var lSwapItem = lThis.data.items[li];
              lThis.data.items[li] = lThis.data.items[li + 1];
              lThis.data.items[li + 1] = lSwapItem;
              lMoveOk = true;
            }
            break;
          }
        }
        if (lMoveOk) {
          for (var li = 0; li < lThis.mainPanel_Master_Scrollbox.panelBox.panels.length; li++) {
            if (lThis.mainPanel_Master_Scrollbox.panelBox.panels[li].itemId == lThis.selectedItemId) {
              if (li < (lThis.mainPanel_Master_Scrollbox.panelBox.panels.length - 1)) {
                lThis.mainPanel_Master_Scrollbox.panelBox.moveDownPanel(lThis.mainPanel_Master_Scrollbox.panelBox.panels[li]);
                lThis.mainPanel_Master_Scrollbox.scrollToPercentage((((li + 1) * 100) / lThis.mainPanel_Master_Scrollbox.panelBox.panels.length));
              }
              break;
            }
          }
          lThis.selectItemId(lThis.selectedItemId);
          lScreen.panel.rerender();
        }
      }
    }
  });
  this.mainPanel_DetailContainer_Panel_ControlPanel.panels.push(this.mainPanel_DetailContainer_Panel_ControlPanel_MoveDownPanel);
  this.mainPanel_DetailContainer_Panel_ControlPanel_MoveDownPanel_Button = new cPanel({
    align: eAlign.eLeft,
    width: 28,
    backgroundColor: 'transparent',
    image: lScreen.getImageClone(aProperties.downImage),
    imageStretch: true
  });
  this.mainPanel_DetailContainer_Panel_ControlPanel_MoveDownPanel.panels.push(this.mainPanel_DetailContainer_Panel_ControlPanel_MoveDownPanel_Button);
  this.mainPanel_DetailContainer_Panel_ControlPanel_MoveDownPanel_Label = new cPanel({
    align: eAlign.eClient,
    marginLeft: 6,
    paddingTop: 1,
    color: '#ffffff',
    backgroundColor: 'transparent',
    innerHTML: 'down',
    fontSize: 20,
    fontBold: true,
    noWrap: true
  });
  this.mainPanel_DetailContainer_Panel_ControlPanel_MoveDownPanel.panels.push(this.mainPanel_DetailContainer_Panel_ControlPanel_MoveDownPanel_Label);

  // Delete
  this.mainPanel_DetailContainer_Panel_ControlPanel_DeletePanel = new cPanel({
    shape: cPanel.cShapeRoundRect,
    borderRadius: 6,
    align: eAlign.eLeft,
    width: 110,
    padding: 4,
    marginRight: 10,
    backgroundColor: '#6d6d6d',
    onMouseUp: function() {
      // delete item
      if (lThis.selectedItemId > 0) {
        for (var li = 0; li < lThis.data.items.length; li++) {
          if (lThis.data.items[li].id == lThis.selectedItemId) {
            lThis.data.items.splice(li, 1);
            break;
          }
        }
        for (var li = 0; li < lThis.mainPanel_Master_Scrollbox.panelBox.panels.length; li++) {
          if (lThis.mainPanel_Master_Scrollbox.panelBox.panels[li].itemId == lThis.selectedItemId) {
            lThis.mainPanel_Master_Scrollbox.panelBox.removePanel(lThis.mainPanel_Master_Scrollbox.panelBox.panels[li]);
            break;
          }
        }
        lThis.selectItemId(0);
        lScreen.panel.rerender();
      }
    }
  });
  this.mainPanel_DetailContainer_Panel_ControlPanel.panels.push(this.mainPanel_DetailContainer_Panel_ControlPanel_DeletePanel);
  this.mainPanel_DetailContainer_Panel_ControlPanel_DeletePanel_Button = new cPanel({
    align: eAlign.eLeft,
    width: 28,
    backgroundColor: 'transparent',
    image: lScreen.getImageClone(aProperties.deleteImage),
    imageStretch: true
  });
  this.mainPanel_DetailContainer_Panel_ControlPanel_DeletePanel.panels.push(this.mainPanel_DetailContainer_Panel_ControlPanel_DeletePanel_Button);
  this.mainPanel_DetailContainer_Panel_ControlPanel_DeletePanel_Label = new cPanel({
    align: eAlign.eClient,
    marginLeft: 6,
    paddingTop: 1,
    color: '#ffffff',
    backgroundColor: 'transparent',
    innerHTML: 'delete',
    fontSize: 20,
    fontBold: true,
    noWrap: true
  });
  this.mainPanel_DetailContainer_Panel_ControlPanel_DeletePanel.panels.push(this.mainPanel_DetailContainer_Panel_ControlPanel_DeletePanel_Label);

  // Hide
  this.mainPanel_DetailContainer_Panel_ControlPanel_HidePanel = new cPanel({
    align: eAlign.eRight,
    width: 37,
    backgroundColor: 'transparent',
    image: lScreen.getImageClone(aProperties.closeImage),
    imageStretch: true,
    onMouseUp: function() {
      lThis.selectItemId(0);
    }
  });
  this.mainPanel_DetailContainer_Panel_ControlPanel.panels.push(this.mainPanel_DetailContainer_Panel_ControlPanel_HidePanel);
  
  
  this.mainPanel_DetailContainer_Panel_NamePanel = new cPanel({
    align: eAlign.eTop,
    height: 40,
    backgroundColor: 'transparent'
  });
  this.mainPanel_DetailContainer_Panel.panels.push(this.mainPanel_DetailContainer_Panel_NamePanel);
  
  this.mainPanel_DetailContainer_Panel_NamePanel_Label = new cPanel({
    align: eAlign.eLeft,
    width: 90,
    color: '#ffffff',
    backgroundColor: 'transparent',
    fontSize: 24,
    fontBold: true,
    innerHTML: 'name:'
  });
  this.mainPanel_DetailContainer_Panel_NamePanel.panels.push(this.mainPanel_DetailContainer_Panel_NamePanel_Label);
  this.mainPanel_DetailContainer_Panel_NamePanel_Name = new cTextLineEditPanel({
    align: eAlign.eClient,
    color: '#000000',
    backgroundColor: '#ffffff',
    fontSize: 24,
    value: '',
    onEdit: function() {
      if (lThis.selectedItemId > 0) {
        var lItem = null;
        for (var li = 0; li < lThis.data.items.length; li++) {
          if (lThis.data.items[li].id == lThis.selectedItemId) {
            lItem = lThis.data.items[li];
            break;
          }
        }
        if (lItem != null) {
          lItem.name = lThis.mainPanel_DetailContainer_Panel_NamePanel_Name.getValue();
          var lItemButtonPanel = lThis.mainPanel_Master_Scrollbox.panelBox;
          for (var bi = 0; bi < lItemButtonPanel.panels.length; bi++) {
            if (lItemButtonPanel.panels[bi].itemId == lThis.selectedItemId) {
              lItemButtonPanel.panels[bi].setInnerHTML(cLib.textToHTML(lItem.name));
              break;
            }
          }
        }
      }
    }
  });
  this.mainPanel_DetailContainer_Panel_NamePanel.panels.push(this.mainPanel_DetailContainer_Panel_NamePanel_Name);
  
  this.mainPanel_DetailContainer_Panel_ContentLabel = new cPanel({
    align: eAlign.eTop,
    height: 45,
    marginTop: 10,
    color: '#ffffff',
    backgroundColor: 'transparent',
    fontSize: 24,
    fontBold: true,
    innerHTML: 'definition:'
  });
  this.mainPanel_DetailContainer_Panel.panels.push(this.mainPanel_DetailContainer_Panel_ContentLabel);
  this.mainPanel_DetailContainer_Panel_Content = new cTextEditPanel({
    align: eAlign.eClient,
    color: '#dddddd',
    backgroundColor: '#333333',
    fontSize: 16,
    value: '',
    onChange: function() {
      if (lThis.selectedItemId > 0) {
        var lItem = null;
        for (var li = 0; li < lThis.data.items.length; li++) {
          if (lThis.data.items[li].id == lThis.selectedItemId) {
            lItem = lThis.data.items[li];
            break;
          }
        }
        if (lItem != null) {
          lItem.content = lThis.mainPanel_DetailContainer_Panel_Content.getValue();
          // update world ...
        }
      }
    }
  });
  this.mainPanel_DetailContainer_Panel.panels.push(this.mainPanel_DetailContainer_Panel_Content);  
  
  this.mainPanel_Master_Menu = new cPanel({
    align: eAlign.eTop,
    height: 70,
    paddingBottom: 10,
    backgroundColor: 'transparent'
  });
  this.mainPanel_Master.panels.push(this.mainPanel_Master_Menu);

  // Add
  this.mainPanel_Master_Menu_ButtonAdd = new cPanel({
    shape: cPanel.cShapeRoundRect,
    borderRadius: 12,
    align: eAlign.eClient,
    width: 200,
    padding: 6,
    backgroundColor: '#6d6d6d', //'#575757'
    onMouseUp: function() {
      lThis.lastItemId++;
      var lItem = new cDataItem({
        id: lThis.lastItemId,
        name: lThis.itemName + ' ' + lThis.lastItemId,
        content: ''
      });
      lThis.data.items.push(lItem);
      var lItemPanel = new cPanel({
        shape: cPanel.cShapeRoundRect,
        borderRadius: 12,
        border: 1,
        borderColor: '#000000',
        align: eAlign.eTop,
        height: 60,
        backgroundColor: '#6d6d6d',
        marginTop: 6,
        marginLeft: 6,
        marginRight: 6,
        padding: 10,
        color: '#ffffff',
        fontSize: 24,
        fontBold: true,
        noWrap: true,
        innerHTML: cLib.textToHTML(lItem.name),
        onMouseUp: function() {
          if (lThis.selectedItemId == this.itemId) {
            lThis.selectItemId(0);
          } else {
            lThis.selectItemId(this.itemId);
          }
        }
      });
      lItemPanel.itemId = lThis.lastItemId;
      lThis.mainPanel_Master_Scrollbox.panelBox.panels.push(lItemPanel);
      lScreen.panel.rerender();
      lThis.mainPanel_Master_Scrollbox.scrollToBottom();
      lThis.selectItemId(lThis.lastItemId);
    }
  });
  this.mainPanel_Master_Menu.panels.push(this.mainPanel_Master_Menu_ButtonAdd);
  
  this.mainPanel_Master_Menu_ButtonAdd.panels.push(new cPanel({
    align: eAlign.eLeft,
    width: 58,
    marginLeft: 10,
    backgroundColor: 'transparent',
    image: lScreen.getImageClone(aProperties.addImage),
    imageStretch: true
  }));
  this.mainPanel_Master_Menu_ButtonAdd.panels.push(new cPanel({
    align: eAlign.eClient,
    marginLeft: 6,
    paddingTop: 6,
    color: '#ffffff',
    backgroundColor: 'transparent',
    innerHTML: 'new ' + this.itemName,
    fontSize: 24,
    fontBold: true,
    noWrap: true
  }));

  this.mainPanel_Master_Scrollbox = new cScrollboxPanel({
    align: eAlign.eClient,
    backgroundColor: 'transparent',
    boxBackgroundColor: '#b4b4b4',
    scrollBarHandleColor: '#6d6d6d',
    autoHideScrollbar: true
  });
  this.mainPanel_Master.panels.push(this.mainPanel_Master_Scrollbox);  
}
// Class inheritance setup:
cMasterDetailPanel.deriveFrom(cPanel);
// Static class constructor:
(function() {

  cMasterDetailPanel.prototype.data = null;
  cMasterDetailPanel.prototype.lastItemId = 0;
  cMasterDetailPanel.prototype.selectedItemId = 0;

  cMasterDetailPanel.prototype.itemName = 'item';
  
  cMasterDetailPanel.prototype.mainPanel = null;
  cMasterDetailPanel.prototype.mainPanel_Master = null;
  cMasterDetailPanel.prototype.mainPanel_Master_Menu = null;
  cMasterDetailPanel.prototype.mainPanel_Master_Menu_ButtonAdd = null;
  cMasterDetailPanel.prototype.mainPanel_Master_Scrollbox = null;

  cMasterDetailPanel.prototype.mainPanel_DetailContainer = null;
  cMasterDetailPanel.prototype.mainPanel_DetailContainer_root = null;
  cMasterDetailPanel.prototype.mainPanel_DetailContainer_Panel = null;
  
  cMasterDetailPanel.prototype.mainPanel_DetailContainer_Panel_ControlPanel = null;
  cMasterDetailPanel.prototype.mainPanel_DetailContainer_Panel_ControlPanel_MoveUpPanel = null;
  cMasterDetailPanel.prototype.mainPanel_DetailContainer_Panel_ControlPanel_MoveUpPanel_Button = null;
  cMasterDetailPanel.prototype.mainPanel_DetailContainer_Panel_ControlPanel_MoveUpPanel_Label = null;
  cMasterDetailPanel.prototype.mainPanel_DetailContainer_Panel_ControlPanel_MoveDownPanel = null;
  cMasterDetailPanel.prototype.mainPanel_DetailContainer_Panel_ControlPanel_MoveDownPanel_Button = null;
  cMasterDetailPanel.prototype.mainPanel_DetailContainer_Panel_ControlPanel_MoveDownPanel_Label = null;
  cMasterDetailPanel.prototype.mainPanel_DetailContainer_Panel_ControlPanel_DeletePanel = null;
  cMasterDetailPanel.prototype.mainPanel_DetailContainer_Panel_ControlPanel_DeletePanel_Button = null;
  cMasterDetailPanel.prototype.mainPanel_DetailContainer_Panel_ControlPanel_DeletePanel_Label = null;
  cMasterDetailPanel.prototype.mainPanel_DetailContainer_Panel_ControlPanel_HidePanel = null;

  cMasterDetailPanel.prototype.mainPanel_DetailContainer_Panel_NamePanel = null;
  cMasterDetailPanel.prototype.mainPanel_DetailContainer_Panel_NamePanel_Label = null;
  cMasterDetailPanel.prototype.mainPanel_DetailContainer_Panel_NamePanel_Name = null;
  cMasterDetailPanel.prototype.mainPanel_DetailContainer_Panel_ContentLabel = null;
  cMasterDetailPanel.prototype.mainPanel_DetailContainer_Panel_Content = null;

  cMasterDetailPanel.prototype.selectItemId = function(aId) {
    this.selectedItemId = 0;
    this.mainPanel_DetailContainer_Panel.hide();
    var lItemButtonPanel = this.mainPanel_Master_Scrollbox.panelBox;
    for (var bi = 0; bi < lItemButtonPanel.panels.length; bi++) {
      lItemButtonPanel.panels[bi].setBackgroundColor('#6d6d6d');
    }
    if (aId > 0) {
      var lItem = null;
      for (var li = 0; li < this.data.items.length; li++) {
        if (this.data.items[li].id == aId) {
          lItem = this.data.items[li];
          break;
        }
      }
      if (lItem != null) {
        this.selectedItemId = aId;
        for (var bi = 0; bi < lItemButtonPanel.panels.length; bi++) {
          if (lItemButtonPanel.panels[bi].itemId == aId) {
            lItemButtonPanel.panels[bi].setBackgroundColor('#404040');
            break;
          }
        }
        this.mainPanel_DetailContainer_Panel_NamePanel_Name.setValue(lItem.name);
        this.mainPanel_DetailContainer_Panel_Content.setValue(lItem.content);
        this.mainPanel_DetailContainer_Panel.show();
      }
    }
    this.mainPanel_DetailContainer_Panel.rerender();
  };

  cMasterDetailPanel.prototype.setRootPanelHTMLContent = function(aHTMLContent) {
    this.mainPanel_DetailContainer_root.setInnerHTML(aHTMLContent);
  };
  
})();
  
