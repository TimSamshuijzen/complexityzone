/**
 * Moba B.V. The Netherlands www.moba.nl
 * Copyright (c) 2013 - All rights reserved
 *
 * Module:
 * cajax.js
 *
 * Description:
 * Static class for ajax calls.
 *
 * Namespace:
 * None
 *
 * Known issues:
 * None
 */

var cAjaxMaxTimeout = 20000;

var cAjax = {

  createXMLHTTPObject: function()
  {
    var lXMLHTTP = null;
    if (window.ActiveXObject)
    {
      lXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
    }
    else if (window.XMLHttpRequest)
    {
      lXMLHTTP = new XMLHttpRequest();
    }
    return lXMLHTTP;
  },

  sendRequest: function(aUrl, aCallback, aOnError, aPostData)
  {
    var lRequest = this.createXMLHTTPObject();
    if (lRequest)
    {
      var method = aPostData ? "POST" : "GET";
      var postData = null;
      lRequest.open(method, aUrl, true);
      lRequest.setRequestHeader("If-Modified-Since", "Sat, 1 Jan 2000 00:00:00 GMT");
      
      if (method == "POST")
      {
        postData = aPostData;
        lRequest.setRequestHeader('Content-type','application/json');
      }
      
      // Initialize timeout timer
      var lRequestTimer = window.setTimeout(function()
      {
        lRequest.abort(); // will result in ready state == 4
      }, cAjaxMaxTimeout);
      
      lRequest.onreadystatechange = function()
      {
        if (lRequest.readyState == 4)
        {
          // prevent re-call
          lRequest.onreadystatechange = function() { };

          // Clear timeout timer
          window.clearTimeout(lRequestTimer);
          
          if (lRequest.status == 0) // Aborted/error
          {
            if (aOnError)
            {
              aOnError(lRequest);
            }
          }
          else if (lRequest.status == 500)
          {
            // server too busy, try again.
            setTimeout(function()
            { 
              cAjax.sendRequest(aUrl, aCallback, aOnError, aPostData); 
            }, 100);
          }
          else
          {
            if ((lRequest.status != 200) && (lRequest.status != 304))
            {
              if (aOnError)
              {
                aOnError(lRequest);
              }
            }
            else if (aCallback)
            {
              aCallback(lRequest.responseText);
            }
          }
        }
      };
      if (lRequest.readyState != 4)
      {
        lRequest.send(postData);
      }
    }
    return lRequest;
  }
  
};

