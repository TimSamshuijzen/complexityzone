
// Tim Samshuijzen 2013

/**
 *  Class cls3dApp
 */
var cls3dApp = (function()
{
  /**
   *  Constructor
   *  @param String aContainerId Id of the container to append renderer to.
   */
  function cls3dApp(aContainerId)
  {
    /**
     *  Initialize "private" member variables
     */
    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.controls = null;
    this.controlCenter = null;
    this.wireframe = false;
    
    // Get container div
    var container = document.getElementById(aContainerId);

    var lThis = this;

    // Create the Three.js renderer
    this.renderer = new THREE.WebGLRenderer({antialias: true});
    //this.renderer = new THREE.CanvasRenderer({antialias: true});

    this.renderer.physicallyBasedShading = true;
    
    this.renderer.setClearColor(0x000000, 1);
    this.renderer.setSize(container.offsetWidth, container.offsetHeight);
    container.appendChild(this.renderer.domElement);

    // Create a new Three.js scene
    this.scene = new THREE.Scene();
    
    // Put in a camera
    this.camera = new THREE.PerspectiveCamera(45, container.offsetWidth / container.offsetHeight, 50, 300000);
    // this is the normal three.js view:
    this.camera.position.set(5000, 4000, 15000);
    // this is the graph view: (disabled because mesh edges look broken  )
    // this.camera.position.set(-15000, 4000, 5000);
    var lcenter = new THREE.Vector3(5000, 0, 5000);
    this.camera.lookAt(lcenter);
    this.controls = new THREE.navigateControl(this.camera, this.renderer.domElement, lcenter);

    var lShowControlCenter = false;
    if (lShowControlCenter) {
      this.controlCenter = new THREE.Mesh(new THREE.SphereGeometry(10), new THREE.MeshPhongMaterial({color: 0x666699 }));
      this.controlCenter.position.set(this.controls.center.x, this.controls.center.y, this.controls.center.z);
      this.scene.add(this.controlCenter);
      this.controls.addEventListener('change', function() { lThis.controlCenter.position.set(lThis.controls.center.x, lThis.controls.center.y, lThis.controls.center.z); });
    }
    
    var light;
    var lLightStrength = (this.wireframe ? 0.5 : 0.30);

    light = new THREE.PointLight(0xffffff, lLightStrength);
    light.position.set(5000, 26000, 5000);
    this.scene.add(light);

    light = new THREE.PointLight(0xffffff, lLightStrength);
    light.position.set(0, 26000, 0);
    this.scene.add(light);
    light = new THREE.PointLight(0xffffff, lLightStrength);
    light.position.set(0, 26000, 11000);
    this.scene.add(light);
    light = new THREE.PointLight(0xffffff, lLightStrength);
    light.position.set(11000, 26000, 0);
    this.scene.add(light);
    light = new THREE.PointLight(0xffffff, lLightStrength);
    light.position.set(11000, 26000, 11000);
    this.scene.add(light);
    // bottom light
    light = new THREE.PointLight(0xffffff, lLightStrength);
    light.position.set(0, -16000, 0);
    this.scene.add(light);

    this.scene.add(createAxes());

    var dom = this.renderer.domElement;
    dom.addEventListener( 'mouseup', function(event) { event.preventDefault(); }, false);
    
    var onKeyUpCameraPreset = function (event) {
      if (!lThis.controls.enabled) {
        return;
      }
      switch ( event.keyCode ) {
        case 48: // '0'..'9'
        case 49:
        case 50:
        case 51:
        case 52:
        case 53:
        case 54:
        case 55:
        case 56:
        case 57: {
          var presetNum = event.keyCode - 48;
          var doPreset = false;
          var lCameraPositionCurrent = {
            x: lThis.camera.position.x,
            y: lThis.camera.position.y,
            z: lThis.camera.position.z
          };
          var lCameraLookAtCurrent = {
            x: lThis.controls.center.x,
            y: lThis.controls.center.y,
            z: lThis.controls.center.z
          };
          var lCameraPositionTarget = {
            x: lThis.camera.position.x,
            y: lThis.camera.position.y,
            z: lThis.camera.position.z
          };
          var lCameraLookAtTarget = {
            x: lThis.controls.center.x,
            y: lThis.controls.center.y,
            z: lThis.controls.center.z
          };
          if (presetNum == 0)
          {
            lCameraPositionTarget = {
              x: 5000,
              y: 4000,
              z: 15000
            };
            lCameraLookAtTarget = {
              x: 5000,
              y: 0,
              z: 5000
            };
            doPreset = true;
          }
          else if (presetNum == 1)
          {
            lCameraPositionTarget = {
              x: -3300,
              y: 3500,
              z: 10000 + 3300
            };
            lCameraLookAtTarget = {
              x: 5000,
              y: 0,
              z: 5000
            };
            doPreset = true;
          }
          else if (presetNum == 2)
          {
            lCameraPositionTarget = {
              x: -3300,
              y: 3500,
              z: -3300
            };
            lCameraLookAtTarget = {
              x: 5000,
              y: 0,
              z: 5000
            };
            doPreset = true;
          }
          else if (presetNum == 3)
          {
            lCameraPositionTarget = {
              x: 10000 + 3300,
              y: 3500,
              z: -3300
            };
            lCameraLookAtTarget = {
              x: 5000,
              y: 0,
              z: 5000
            };
            doPreset = true;
          }
          else if (presetNum == 4)
          {
            lCameraPositionTarget = {
              x: 10000 + 3300,
              y: 3500,
              z: 10000 + 3300
            };
            lCameraLookAtTarget = {
              x: 5000,
              y: 0,
              z: 5000
            };
            doPreset = true;
          }
          if (doPreset) {
            var tweenCam = new TWEEN.Tween(lCameraPositionCurrent).to(lCameraPositionTarget, 1200).easing(TWEEN.Easing.Linear.None).onUpdate(function() {
              lThis.camera.position.set(lCameraPositionCurrent.x, lCameraPositionCurrent.y, lCameraPositionCurrent.z);
            }).start();
            var tweenLkt = new TWEEN.Tween(lCameraLookAtCurrent).to(lCameraLookAtTarget, 1200).easing(TWEEN.Easing.Linear.None).onUpdate(function() {
              lThis.controls.center.x = lCameraLookAtCurrent.x;
              lThis.controls.center.y = lCameraLookAtCurrent.y;
              lThis.controls.center.z = lCameraLookAtCurrent.z;
            }).start();
          }
        }
        break;
      }
    };
    window.addEventListener( 'keydown', onKeyUpCameraPreset, false );
    
    var windowResize = THREEx.WindowResize(this.renderer, this.camera);
    windowResize.do();
    // windowResize.stop()
    
    var homePanel = document.createElement('div');
    homePanel.style.position = 'absolute';
    homePanel.style.zIndex = '1';
    homePanel.style.left = '1000px';
    homePanel.style.top = '10px';
    homePanel.style.width = '240px';
    homePanel.style.height = '46px';
    homePanel.margin = '0px';
    homePanel.style.margin = '0';
    homePanel.style.paddingLeft = '30px';
    homePanel.style.paddingTop = '6px';
    homePanel.style.border = '0';
    homePanel.style.overflow = 'hidden';
    homePanel.style.backgroundColor = '#333333';
    homePanel.innerHTML = 
      '<a href="../" style="color: #cccccc; font-size: 32px; text-decoration: inherit; font-family: Calibri, Arial, helvetica, sans-serif;">complexity.zone</a>';
    document.getElementsByTagName('body')[0].appendChild(homePanel); 
    window.addEventListener('resize', function() {
      homePanel.style.left = (window.innerWidth - 280) + 'px';
    }, false);
    homePanel.style.left = (window.innerWidth - 280) + 'px';
    
    var lControlPanelWidth = 640;
    var lControlPanelHeight = 286;
    
    var controlPanel = document.createElement('div');
    controlPanel.style.position = 'absolute';
    controlPanel.style.zIndex = '1';
    controlPanel.style.left = '0px';
    controlPanel.style.top = '0px';
    controlPanel.style.width = lControlPanelWidth + 'px';
    controlPanel.style.height = lControlPanelHeight + 'px';
    controlPanel.margin = '0px';
    controlPanel.style.margin = '0';
    controlPanel.style.padding = '0';
    controlPanel.style.border = '0';
    controlPanel.style.overflow = 'hidden';
    controlPanel.style.backgroundColor = '#080808';
    document.getElementsByTagName('body')[0].appendChild(controlPanel);

    controlPanel.minimized = false;
    var minimizeButton = document.createElement('div');
    minimizeButton.title = 'hide control panel';
    minimizeButton.style.position = 'absolute';
    minimizeButton.style.left = (lControlPanelWidth - 44)  + 'px';
    minimizeButton.style.top = (lControlPanelHeight - 44)  + 'px';
    minimizeButton.style.width = '20px';
    minimizeButton.style.height = '20px';
    minimizeButton.margin = '0px';
    minimizeButton.style.borderLeft = '2px solid #999999';
    minimizeButton.style.borderTop = '2px solid #999999';
    minimizeButton.style.borderRight = '10px solid #999999';
    minimizeButton.style.borderBottom = '10px solid #999999';
    minimizeButton.style.backgroundColor = '#222222';
    minimizeButton.style.cursor = 'pointer';
    controlPanel.appendChild(minimizeButton);
    minimizeButton.addEventListener("click", function() {
      if (controlPanel.minimized) {
        // move out
        cLib.animate2d(-(lControlPanelWidth - 44), -(lControlPanelHeight - 44),
                       0, 0,  
                      500, 
                      function(left, top) {
                        controlPanel.style.left = left + 'px';
                        controlPanel.style.top = top + 'px';
                      },
                      function(left, top) {
                        controlPanel.style.left = left + 'px';
                        controlPanel.style.top = top + 'px';
                        minimizeButton.title = 'hide control panel';
                      });
        controlPanel.minimized = false;
      } else {
        // retreat
        cLib.animate2d(0, 0,
                       -(lControlPanelWidth - 44), -(lControlPanelHeight - 44),
                      500, 
                      function(left, top) {
                        controlPanel.style.left = left + 'px';
                        controlPanel.style.top = top + 'px';
                      },
                      function(left, top) {
                        controlPanel.style.left = left + 'px';
                        controlPanel.style.top = top + 'px';
                        minimizeButton.title = 'show control panel';
                      });
        controlPanel.minimized = true;
      }
    });
    
    var showStats = true;
    if (showStats) {
      var stats = new Stats();
      stats.setMode(0); // 0: fps, 1: ms
      stats.domElement.style.position = 'absolute';
      stats.domElement.style.left = (lControlPanelWidth - 100) + 'px';
      stats.domElement.style.top = '5px';
      stats.domElement.style.zIndex = '1';
      controlPanel.appendChild( stats.domElement );
      setInterval( function () {
        stats.begin();
        //.
        stats.end();
      }, 1000 / 60 ); 
    }

    this.model = new cls3dModel(this.scene, this.wireframe);

    var functionStartLabel = document.createElement('div');
    functionStartLabel.style.position = 'absolute';
    functionStartLabel.style.left = '10px';
    functionStartLabel.style.top = '10px';
    functionStartLabel.style.width = '510px';
    functionStartLabel.style.height = '90px';
    functionStartLabel.margin = '0px';
    functionStartLabel.style.margin = '0';
    functionStartLabel.style.padding = '0';
    functionStartLabel.style.border = '0';
    functionStartLabel.style.backgroundColor = 'transparent';
    functionStartLabel.style.color = '#cccccc';
    functionStartLabel.style.fontFamily = '"Courier New", Courier, monospace';
    functionStartLabel.style.fontSize = '14px';
    functionStartLabel.style.textAlign = 'left';
    functionStartLabel.innerHTML = 
      '<span style="color: #999999;">// This function is called for each vertex (100 * 100).</span><br />\n' +
      '<span style="color: #999999;">// You can enter your own formula and press submit.</span><br />\n' +
      'function <span style="color: #9999ff;">GetVertexZandColor</span>( <span style="color: #ff6666;">x</span>, <span style="color: #66ff66;">y</span>, TimeSeconds ) {<br />\n' +
      '&nbsp;&nbsp;var z = 0;<br />\n' +
      '&nbsp;&nbsp;var color = ' + this.model.defaultGraphColorText + ';';
    controlPanel.appendChild(functionStartLabel);

    this.formulaEdit = document.createElement('TEXTAREA');
    controlPanel.appendChild(this.formulaEdit);
    this.formulaEdit.title = 'Edit the formula, or enter your own code. Then press the Submit button.';
    this.formulaEdit.value = this.model.formula;
    this.formulaEdit.style.fontFamily = '"Courier New", Courier, monospace';
    this.formulaEdit.style.fontSize = '12px';
    this.formulaEdit.style.whiteSpace = 'nowrap';
    this.formulaEdit.style.overflow = 'auto';
    this.formulaEdit.setAttribute('wrap', 'off');
    this.formulaEdit.setAttribute('spellcheck', 'false');
    this.formulaEdit.style.whiteSpace = 'pre'; // otherwise it eats leading spaces
    this.formulaEdit.style.resize = 'none';
    this.formulaEdit.style.position = 'absolute';
    this.formulaEdit.style.left = '23px';
    this.formulaEdit.style.top = '100px';
    this.formulaEdit.style.width = (lControlPanelWidth - 42) + 'px';
    this.formulaEdit.style.height = '80px';
    this.formulaEdit.style.margin = '0px';
    this.formulaEdit.style.border = '1px solid black';
    this.formulaEdit.style.color = '#cccccc';
    this.formulaEdit.style.backgroundColor = '#222222';
    this.formulaEdit.style.paddingLeft = '4px';
    this.formulaEdit.addEventListener("focus", function() { lThis.controls.enabled = false; });
    this.formulaEdit.addEventListener("blur", function() { lThis.controls.enabled = true; });
    
    var functionEndLabel = document.createElement('div');
    functionEndLabel.style.position = 'absolute';
    functionEndLabel.style.left = '10px';
    functionEndLabel.style.top = '195px';
    functionEndLabel.style.width = '360px';
    functionEndLabel.style.height = '60px';
    functionEndLabel.margin = '0px';
    functionEndLabel.style.margin = '0';
    functionEndLabel.style.padding = '0';
    functionEndLabel.style.border = '0';
    functionEndLabel.style.backgroundColor = 'transparent';
    functionEndLabel.style.color = '#cccccc';
    functionEndLabel.style.fontFamily = '"Courier New", Courier, monospace';
    functionEndLabel.style.fontSize = '14px';
    functionEndLabel.style.textAlign = 'left';
    functionEndLabel.innerHTML = 
      '&nbsp;&nbsp;return { z: z, color: color };<br />\n' +
      '}';
    controlPanel.appendChild(functionEndLabel);

    var submitChangesButton = document.createElement('div');
    submitChangesButton.title = 'Click to submit the new formula.';
    submitChangesButton.style.fontFamily = 'Arial';
    submitChangesButton.style.fontSize = '18px';
    submitChangesButton.style.position = 'absolute';
    submitChangesButton.style.left = '20px';
    submitChangesButton.style.top = '236px';
    submitChangesButton.style.width = '160px';
    submitChangesButton.style.height = '26px';
    submitChangesButton.margin = '0px';
    submitChangesButton.style.border = '1px solid black';
    submitChangesButton.style.color = '#222222';
    submitChangesButton.style.backgroundColor = '#999999';
    submitChangesButton.style.paddingTop = '6px';
    submitChangesButton.style.textAlign = 'center';
    submitChangesButton.style.cursor = 'pointer';
    submitChangesButton.innerHTML = 'Submit';
    controlPanel.appendChild(submitChangesButton);
    submitChangesButton.addEventListener("click", function() {
      lThis.statusLabel.innerHTML = '';
      lThis.model.setGetY(lThis.formulaEdit.value);
    });
    
    this.statusLabel = document.createElement('div');
    this.statusLabel.style.fontFamily = 'Arial';
    this.statusLabel.style.position = 'absolute';
    this.statusLabel.style.left = '200px';
    this.statusLabel.style.top = '246px';
    this.statusLabel.style.width = '380px';
    this.statusLabel.style.height = '20px';
    this.statusLabel.margin = '0px';
    this.statusLabel.style.margin = '0';
    this.statusLabel.style.padding = '0';
    this.statusLabel.style.border = '0';
    this.statusLabel.style.backgroundColor = 'transparent';
    this.statusLabel.style.color = '#cc3333';
    this.statusLabel.style.fontSize = '14px';
    this.statusLabel.style.textAlign = 'left';
    this.statusLabel.innerHTML = '';
    controlPanel.appendChild(this.statusLabel);

    this.model.onCodeError = function() {
      lThis.statusLabel.innerHTML = (lThis.model.codeErrorMessage != '') ? lThis.model.codeErrorMessage : 'error';
    };
  }

  /**
   *  Semi private member variables
   */
  cls3dApp.prototype.model = null;
  cls3dApp.prototype.renderer = null;
  cls3dApp.prototype.scene = null;
  cls3dApp.prototype.camera = null;
  cls3dApp.prototype.controls = null;
  cls3dApp.prototype.controlCenter = null;
  cls3dApp.prototype.staticGeometry = null;
  cls3dApp.prototype.wireframe = false;
  cls3dApp.prototype.formulaEdit = null;
  cls3dApp.prototype.statusLabel = null;
  
  /**
   *  Public methods
   */

  cls3dApp.prototype.run = function()
  {
    this.renderThread();
  };
  
  var clock = new THREE.Clock();
  
  cls3dApp.prototype.renderThread = function ()
  {
    var lThis = this;
    var delta = clock.getDelta();
    this.controls.update(delta);
    if (this.model != null)
    {
      this.model.render(clock.getElapsedTime(), delta);
    }
    // Render the scene
    this.renderer.render(this.scene, this.camera);
    TWEEN.update();
    requestAnimationFrame(function() { lThis.renderThread(); });
  };

  return cls3dApp;
})();
