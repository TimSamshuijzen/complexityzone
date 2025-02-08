// Copyright 2012 Tim Samshuijzen.

include("cbase.js");
include("cpanel.js");

/*
  * Class cTextEditPanel
  */
// Instance class constructor:
function cTextEditPanel(aProperties) {
  // Call the base constructor:
  cPanel.call(this, aProperties);

  this.textEditElement = null;
  this.initValue = aProperties ? (aProperties.value ? aProperties.value : '') : '';
  this.onChange = aProperties ? (aProperties.onChange ? aProperties.onChange : null) : null;
  this.onEdit = aProperties ? (aProperties.onEdit ? aProperties.onEdit : null) : null;
  this.readOnly = aProperties ? (aProperties.readOnly ? true : false) : false;
}
// Class inheritance setup:
cTextEditPanel.deriveFrom(cPanel);
// Static class constructor:
(function() {
  // Public static virtual members (properties):
  cTextEditPanel.prototype.textEditElement = null;
  cTextEditPanel.prototype.initValue = '';
  cTextEditPanel.prototype.onChange = null;
  cTextEditPanel.prototype.onEdit = null;
  cTextEditPanel.prototype.readOnly = false;
  
  cTextEditPanel.prototype.render = function(aParentPanel, aParentElement, aClientRect) {
    cPanel.prototype.render.call(this, aParentPanel, aParentElement, aClientRect);
    if (this.element != null) {
      if (this.textEditElement == null) {
        this.textEditElement = document.createElement('TEXTAREA');
        this.textEditElement.id = 'pnl_' + this.instanceId + '_' + this.innerId + '_textarea';
        this.element.appendChild(this.textEditElement);
        this.textEditElement.value = this.initValue;
        this.textEditElement.style.fontFamily = '"Courier New", Courier, monospace';
        this.textEditElement.style.fontSize = this.fontSize + 'px';
        this.textEditElement.style.whiteSpace = 'nowrap';
        this.textEditElement.style.overflow = 'auto';
        this.textEditElement.setAttribute('wrap', 'off');
        this.textEditElement.setAttribute('spellcheck', 'false');
        this.textEditElement.style.whiteSpace = 'pre'; // otherwise it eats leading spaces
        this.textEditElement.style.resize = 'none';
        this.textEditElement.style.position = 'absolute';
        this.textEditElement.style.left = '0px';
        this.textEditElement.style.top = '0px';
        this.textEditElement.style.margin = '0px';
        this.textEditElement.style.border = '1px solid black';
        this.textEditElement.style.color = this.color;
        this.textEditElement.style.backgroundColor = this.backgroundColor;
        this.textEditElement.style.paddingLeft = '4px';
        if (this.readOnly) {
          this.textEditElement.readOnly = true;
        } else {
          // this.textEditElement.style.userSelect = 'text';
          // this.textEditElement.style.webkitUserSelect = 'text';
          // this.textEditElement.style.MozUserSelect = 'text';
          // this.textEditElement.setAttribute("unselectable", "off");
        }
        if (this.onChange !== null) {
          this.textEditElement.onchange = this.onChange;
        }
        if (this.onEdit !== null) {
          this.textEditElement.onkeypress = this.onEdit;
        }
      }
      this.textEditElement.style.width = (this.getInnerWidth() - 8) + 'px'; // TODO: why 8?
      this.textEditElement.style.height = (this.getInnerHeight() - 6) + 'px'; // TODO: why 6?
    }
  };
  
  cTextEditPanel.prototype.getValue = function() {
    var lResult = '';
    if (this.textEditElement != null) {
      lResult = this.textEditElement.value;
    }
    return lResult;
  };

  cTextEditPanel.prototype.setValue = function(aValue) {
    if (this.textEditElement != null) {
      this.textEditElement.value = aValue;
    } else {
      this.initValue = aValue;
    }
  };
  
})();
