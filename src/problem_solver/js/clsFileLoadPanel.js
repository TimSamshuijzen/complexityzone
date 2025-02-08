// Copyright 2012 Tim Samshuijzen.

include("cbase.js");
include("cpanel.js");

/*
  * Class clsFileLoadPanel
  */
// Instance class constructor:
function clsFileLoadPanel(aProperties) {
  // Call the base constructor:
  cPanel.call(this, aProperties);

  this.inputElement = null;
  this.fileLoaded = false;
  this.fileContent = '';
  this.onSelectFile = aProperties ? (typeof aProperties.onSelectFile != 'undefined' ? aProperties.onSelectFile : null) : null;
  this.onSelectFileThis = aProperties ? (typeof aProperties.onSelectFileThis != 'undefined' ? aProperties.onSelectFileThis : null) : null;
}
// Class inheritance setup:
clsFileLoadPanel.deriveFrom(cPanel);
// Static class constructor:
(function() {
  // Public static virtual members (properties):
  clsFileLoadPanel.prototype.inputElement = null;
  clsFileLoadPanel.prototype.fileLoaded = false;
  clsFileLoadPanel.prototype.fileContent = '';
  clsFileLoadPanel.prototype.onSelectFile = null;
  clsFileLoadPanel.prototype.onSelectFileThis = null;
  
  clsFileLoadPanel.prototype.render = function(aParentPanel, aParentElement, aClientRect) {
    cPanel.prototype.render.call(this, aParentPanel, aParentElement, aClientRect);
    var lThis = this;
    if (this.element != null) {
      if (this.inputElement == null) {
        this.inputElement = document.createElement('INPUT');
        this.inputElement.type = 'file';
        this.inputElement.id = 'pnl_' + this.instanceId + '_' + this.innerId + '_input';
        this.element.appendChild(this.inputElement);
        this.inputElement.style.fontSize = this.fontSize + 'px';
        this.inputElement.style.color = this.color;
        this.inputElement.style.backgroundColor = this.backgroundColor;
        this.inputElement.addEventListener('change', function(aEvent) { lThis.onOpenFile(aEvent); } , false);
      }
      this.inputElement.style.width = (this.getInnerWidth() - 6) + 'px';
      this.inputElement.style.height = (this.getInnerHeight() - 4) + 'px';
    }
  };

  clsFileLoadPanel.prototype.onOpenFile = function(aEvent) {
    var file = aEvent.target.files[0];
    var lThis = this;
    if ((file) && ((file.type == '') || file.type.match('/text.*/'))) {
      var lFileReader = new FileReader();
      lFileReader.onload = function(e) {
        lThis.fileLoaded = true;
        lThis.fileContent = lFileReader.result;
        if (lThis.onSelectFile) {
          if (lThis.onSelectFileThis) {
            lThis.onSelectFile.call(lThis.onSelectFileThis, true);
          } else {
            lThis.onSelectFile(true);
          }
        }
      };
      lFileReader.onabort = function(e) {
        lThis.fileLoaded = false;
        lThis.fileContent = '';
        if (lThis.onSelectFileThis) {
          lThis.onSelectFile.call(lThis.onSelectFileThis, false);
        } else {
          lThis.onSelectFile(false);
        }
      };
      lFileReader.onerror = function(e) {
        lThis.fileLoaded = false;
        lThis.fileContent = '';
        if (lThis.onSelectFileThis) {
          lThis.onSelectFile.call(lThis.onSelectFileThis, false);
        } else {
          lThis.onSelectFile(false);
        }
      };
      lFileReader.readAsText(file);  
    } else {
      lThis.fileLoaded = false;
      lThis.fileContent = '';
      if (lThis.onSelectFileThis) {
        lThis.onSelectFile.call(lThis.onSelectFileThis, false);
      } else {
        lThis.onSelectFile(false);
      }
    }
  };
  
})();
