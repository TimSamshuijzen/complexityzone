// Copyright 2012 Tim Samshuijzen.

include("ccommon.js");
include("cbase.js");

/*

function loadXMLDocErr(dname)
{
try //Internet Explorer
  {
  xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
  xmlDoc.async=false;
  xmlDoc.load(dname); 

  if (xmlDoc.parseError.errorCode != 0)
    {
    alert("Error in line " + xmlDoc.parseError.line +
    " position " + xmlDoc.parseError.linePos +
    "\nError Code: " + xmlDoc.parseError.errorCode +
    "\nError Reason: " + xmlDoc.parseError.reason +
    "Error Line: " + xmlDoc.parseError.srcText);
    return(null);
    }
  }
catch(e)
  {
  try //Firefox
    {
    xmlDoc=document.implementation.createDocument("","",null);
    xmlDoc.async=false;
    xmlDoc.load(dname);
    if (xmlDoc.documentElement.nodeName=="parsererror")
      {
      alert(xmlDoc.documentElement.childNodes[0].nodeValue);
      return(null);
      }
    }
  catch(e) {alert(e.message)}
  }
try
  {
  return(xmlDoc);
  }
catch(e) {alert(e.message)}
return(null);
}


*/


/**
  * Class cXML
  */
// Instance class constructor:
function cXML(aProperties) {
  // Call the base constructor:
  cBase.call(this);
  
  this.xmlDoc = null;
}
// Class inheritance setup:
cXML.deriveFrom(cBase);
// Static class constructor:
(function() {

  // static:
  cXML.createHTMLDocument = function(aHTML, aCSS) {
    var lHTMLDoc = 
      '<!DOCTYPE html>\n' +
      '<html>\n' +
      '<head>\n' +
      '<style>\n' +
      'body {\n' +
      '  background-color: #ffffff;\n' +
      '  font-family: Calibri, Arial, helvetica, sans-serif;\n' +
      '}\n' +
      '</style>\n' +
      '<style>\n' + 
      (aCSS !== undefined ? aCSS : '') + '\n' + 
      '</style>\n' +
      '</head>\n' +
      '<body>\n' + 
      (aHTML !== undefined ? aHTML : '') + '\n' +
      '</body>\n' +
      '</html>';
    return lHTMLDoc;
  }

  cXML.prototype.xmlDoc = null;

  cXML.prototype.importXMLString = function(aXMLString) {
    this.xmlDoc = null;
    if (aXMLString === undefined) {
      return;
    }
    if (window.DOMParser) {
      var parser = new window.DOMParser();
      try {
        this.xmlDoc = parser.parseFromString('<div>' + aXMLString + '</div>', "text/xml"); // add standard div, because simple text does not parse.
      } catch(e) {
        this.xmlDoc = null;
      }
      if ((this.xmlDoc != null) && (this.xmlDoc.documentElement.firstChild.nodeName == "parsererror")) {
        this.xmlDoc = null;
      }
    } else {
      // IE :(
      //if(aXMLString.indexOf("<?") == 0) {
      //  aXMLString = aXMLString.substr(aXMLString.indexOf("?>") + 2 );
      //}
      this.xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
      this.xmlDoc.async = false; //"false";
      try {
        this.xmlDoc.loadXML('<div>' + aXMLString + '</div>');
      } catch(e) {
        this.xmlDoc = null;
      }
    }
  };

  cXML.prototype.exportXMLString = function() {
    var lXMLString = '';
    if ((this.xmlDoc != null) && (this.xmlDoc.childNodes.length > 0)) { // remove standard surrounding div
      var lDivNode = this.xmlDoc.childNodes[0];
      if (typeof window.XMLSerializer != "undefined") {
        var lXMLSerializer = new window.XMLSerializer();
        for (var li = 0; li < lDivNode.childNodes.length; li++) {
          lXMLString += lXMLSerializer.serializeToString(lDivNode.childNodes[li]);
        }
      } else if (typeof lDivNode.xml != "undefined") {
        for (var li = 0; li < lDivNode.childNodes.length; li++) {
          lXMLString += lDivNode.childNodes[li].xml;
        }
      }
    }
    return lXMLString;
  };

  cXML.prototype.exportChildNodes = function() {
    var lNodes = [];
    if ((this.xmlDoc != null) && (this.xmlDoc.childNodes.length > 0)) { // remove standard surrounding div
      for (var li = 0; li < this.xmlDoc.childNodes.length; li++) {
        var lDivNode = this.xmlDoc.childNodes[li];
        lNodes.push(this.xmlDoc.childNodes[li]);
      }
    }
    return lNodes;
  };

  // private function:
  function traverseGetNodeById(aNode, aId) {
    var lNodeRes = null;
    if (aNode != null) {
      if (aNode.attributes) {
        var lIdAttribute = aNode.attributes.getNamedItem("id");
        if (lIdAttribute) {
          if (lIdAttribute.value == aId) {
            lNodeRes = aNode;
          }
        }
      }
      if (lNodeRes == null) {
        for (var li = 0; li < aNode.childNodes.length; li++) {
          lNodeRes = traverseGetNodeById(aNode.childNodes[li], aId);
          if (lNodeRes != null) {
            break;
          }
        }
      }
    }
    return lNodeRes;
  }

  // access and manipulation methods:
  
  cXML.prototype.getNodeById = function(aId) {
    var lNode = null;
    if (this.xmlDoc != null) {
      lNode = traverseGetNodeById(this.xmlDoc, aId);
    }
    return lNode;
  };
  
  cXML.prototype.setTextInNodeById = function(aId, aText) {
    if (this.xmlDoc != null) {
      var lNode = traverseGetNodeById(this.xmlDoc, aId);
      if (lNode != null) {
        while (lNode.firstChild) {
          lNode.removeChild(lNode.firstChild);
        }
        lTextNode = this.xmlDoc.createTextNode(aText);
        lNode.appendChild(lTextNode);
      }
    }
  };

  cXML.prototype.setXMLInNodeById = function(aId, aXML) {
    if (this.xmlDoc != null) {
      var lNode = traverseGetNodeById(this.xmlDoc, aId);
      if (lNode != null) {
        while (lNode.firstChild) {
          lNode.removeChild(lNode.firstChild);
        }
        var lXML = new cXML();
        lXML.importXMLString(aXML);
        if (lXML.xmlDoc != null) {
          for (var li = 0; li < lXML.xmlDoc.childNodes.length; li++) {
            lNode.appendChild(lXML.xmlDoc.childNodes[li]);
          }
        }
      }
    }
  };
  
})();
  
