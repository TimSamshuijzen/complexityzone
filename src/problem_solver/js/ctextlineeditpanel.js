// Copyright 2012 Tim Samshuijzen.

include("cbase.js");
include("cpanel.js");

/*
  * Class cTextLineEditPanel
  */
// Instance class constructor:
function cTextLineEditPanel(aProperties) {
  // Call the base constructor:
  cPanel.call(this, aProperties);

  this.textLineEditElement = null;
  this.initValue = aProperties ? (aProperties.value ? aProperties.value : '') : '';
  this.onChange = aProperties ? (aProperties.onChange ? aProperties.onChange : null) : null;
  this.onEdit = aProperties ? (aProperties.onEdit ? aProperties.onEdit : null) : null;
}
// Class inheritance setup:
cTextLineEditPanel.deriveFrom(cPanel);
// Static class constructor:
(function() {
  // Public static virtual members (properties):
  cTextLineEditPanel.prototype.textLineEditElement = null;
  cTextLineEditPanel.prototype.initValue = '';
  cTextLineEditPanel.prototype.onChange = null;
  cTextLineEditPanel.prototype.onEdit = null;
  
  cTextLineEditPanel.prototype.render = function(aParentPanel, aParentElement, aClientRect) {
    cPanel.prototype.render.call(this, aParentPanel, aParentElement, aClientRect);
    if (this.element != null) {
      if (this.textLineEditElement == null) {
        this.textLineEditElement = document.createElement('INPUT');
        this.textLineEditElement.type = 'text';
        this.textLineEditElement.id = 'pnl_' + this.instanceId + '_' + this.innerId + '_inputtext';
        this.element.appendChild(this.textLineEditElement);
        this.textLineEditElement.value = this.initValue;
        this.textLineEditElement.style.fontFamily = 'Calibri, Arial, helvetica, sans-serif';
        this.textLineEditElement.style.fontSize = this.fontSize + 'px';
        this.textLineEditElement.style.whiteSpace = 'nowrap';
        this.textLineEditElement.style.overflow = 'auto';
        this.textLineEditElement.setAttribute('wrap', 'off');
        this.textLineEditElement.style.whiteSpace = 'pre'; // otherwise it eats leading spaces
        this.textLineEditElement.style.resize = 'none';
        this.textLineEditElement.style.position = 'absolute';
        this.textLineEditElement.style.left = '0px';
        this.textLineEditElement.style.top = '0px';
        this.textLineEditElement.style.margin = '0px';
        this.textLineEditElement.style.border = '1px solid black';
        this.textLineEditElement.style.color = this.color;
        this.textLineEditElement.style.backgroundColor = this.backgroundColor;
        this.textLineEditElement.style.paddingLeft = '4px';
        if (this.onEdit !== null) {
          this.textLineEditElement.onchange = this.onEdit;
          this.textLineEditElement.onkeypress = this.onEdit;
          this.textLineEditElement.onpaste = this.onEdit;
          this.textLineEditElement.oninput = this.onEdit;
        } else if (this.onChange !== null) {
          this.textLineEditElement.onchange = this.onChange;
        }
      }
      this.textLineEditElement.style.width = (this.getInnerWidth() - 6) + 'px'; // TODO: why 8?
      this.textLineEditElement.style.height = (this.getInnerHeight() - 4) + 'px'; // TODO: why 6?
    }
  };
  
  cTextLineEditPanel.prototype.getValue = function() {
    var lResult = '';
    if (this.textLineEditElement != null) {
      lResult = this.textLineEditElement.value;
    }
    return lResult;
  };

  cTextLineEditPanel.prototype.setValue = function(aValue) {
    if (this.textLineEditElement != null) {
      this.textLineEditElement.value = aValue;
    }
  };
  
})();
