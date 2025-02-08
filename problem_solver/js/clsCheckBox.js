/**
  * Class clsCheckBox
  */

include("cbase.js");
include("cpanel.js");

/*
  * Class clsCheckBox
  */
// Instance class constructor:
function clsCheckBox(aProperties) {
  var lProps = aProperties || {};
  lProps.shape = lProps.radioButtonStyle ? cPanel.cShapeCircleRect : cPanel.cShapeRectangle;
  cPanel.call(this, lProps);
  
  this.checked = (aProperties.checked === true) ? true : false;
  this.onCheckedChange = aProperties ? (aProperties.onCheckedChange ? aProperties.onCheckedChange : null) : null;
  this.radioButtonStyle = aProperties ? (aProperties.radioButtonStyle ? true : false) : false;

  this.checkedPanel = new cPanel({
    shape: this.radioButtonStyle ? cPanel.cShapeCircleRect : cPanel.cShapeRectangle,
    align: eAlign.eClient,
    margin: 8,
    backgroundColor: (this.checked ? '#22b14c' : '#444444'),
    border: 6,
    borderColor: '#444444' //'#262626'
  });
  this.panels.push(this.checkedPanel);

}
// Class inheritance setup:
clsCheckBox.deriveFrom(cPanel);
// Static class constructor:
(function() {
  
  clsCheckBox.prototype.checked = false;
  clsCheckBox.prototype.onCheckedChange = null;
  clsCheckBox.prototype.radioButtonStyle = false;
  clsCheckBox.prototype.checkedPanel = null;

  clsCheckBox.prototype.setChecked = function(aChecked) {
    if (this.checked != aChecked) {
      this.checked = aChecked;
      this.checkedPanel.setBackgroundColor(this.checked ? '#22b14c' : '#444444');
      if (this.onCheckedChange) {
        this.onCheckedChange();
      }
    }
  };

  clsCheckBox.prototype.onClick = function() {
    this.checked = !this.checked;
    this.checkedPanel.setBackgroundColor(this.checked ? '#22b14c' : '#444444');
    if (this.onCheckedChange) {
      this.onCheckedChange();
    }
  };

})();
