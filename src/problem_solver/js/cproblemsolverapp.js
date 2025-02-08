// Copyright 2012 Tim Samshuijzen.

include("cdom.js");
include("capp.js");
include("cpanel.js");
include("ctabmenupanel.js");
include("cmainpagepanel.js");
include("cviewworldpanel.js");
include("cviewchangespanel.js");
include("cviewevaluatepanel.js");
include("cviewmultiversepanel.js");
//include("cviewhelppanel.js");
include("cmodel.js");
include("cfilepresets.js");
include("clsModalPanel.js");
include("cscrollboxpanel.js");
include("ciframepanel.js");
include("ctextlineeditpanel.js");
include("clsFileLoadPanel.js");


/*

Strategy:
We strive for more possibilities, less possible events due to rules.
More voluntaries, less expectations.
  
  var a = [765765, 76768, 344];
  var b = a.choose(1,2)
  
-------------------------------

*/

/**
  * Class cProblemSolverApp
  */
// Instance class constructor:
function cProblemSolverApp(aContainer) {
  // Call the base constructor:
  cApp.call(this, aContainer);

  this.resourcesLoaded = false;
  
  this.screen = new cScreen(this, (aContainer ? aContainer : document.body));
  this.screen.loadImages([
    {id: cProblemSolverApp.cImageProblemSolver, src: 'img/problemsolver.png'},
    {id: cProblemSolverApp.cImageViewWorldImage, src: 'img/view_world.png'},
    {id: cProblemSolverApp.cImageViewChangesImage, src: 'img/view_changes.png'},
    {id: cProblemSolverApp.cImageViewEvaluateImage, src: 'img/view_evaluate.png'},
    {id: cProblemSolverApp.cImageViewMultiverseImage, src: 'img/view_multiverse.png'},
    {id: cProblemSolverApp.cImageWorld, src: 'img/world.png'},
    {id: cProblemSolverApp.cImageChanges, src: 'img/changes.png'},
    {id: cProblemSolverApp.cImageEvaluate, src: 'img/evaluate.png'},
    {id: cProblemSolverApp.cImageAgent, src: 'img/agent.png'},
    {id: cProblemSolverApp.cImageMultiverse, src: 'img/multiverse.png'},
    {id: cProblemSolverApp.cImageQuestion, src: 'img/question.png'},
    {id: cProblemSolverApp.cImageClose, src: 'img/close.png'},
    {id: cProblemSolverApp.cImageRefresh, src: 'img/refresh.png'},
    {id: cProblemSolverApp.cImageAdd, src: 'img/add.png'},
    {id: cProblemSolverApp.cImageDelete, src: 'img/delete.png'},
    {id: cProblemSolverApp.cImageUp, src: 'img/up.png'},
    {id: cProblemSolverApp.cImageDown, src: 'img/down.png'},
    {id: cProblemSolverApp.cFutureAxis, src: 'img/futureaxis.png'},
    {id: cProblemSolverApp.cOptionsAxis, src: 'img/optionsaxis.png'},
    {id: cProblemSolverApp.cExpand, src: 'img/expand.png'}
  ]);
  
  this.actionSandboxIFrame_Initialized = false;
  this.evaluationSandboxIFrame_Initialized = false;
  
  this.screen.waitForResources(this, function() {
    this.resourcesLoaded = true;
    this.screen.setup();

    var lThis = this;

    this.actionSandboxIFrame = new cIFramePanel({
      align: eAlign.eNone,
      visible: false,
      width: 128,
      height: 128,
      backgroundColor: 'transparent',
      border: 1,
      borderColor: '#000000',
      iFrameHTML: '',
      supportScroll: false
    });
    this.screen.panel.panels.push(this.actionSandboxIFrame);
    Model.initActionSandbox(this.actionSandboxIFrame, 
      function() {
        lThis.actionSandboxIFrame_Initialized = true;
        lThis.updateSandboxInitialized();
      }
    );
    this.evaluationSandboxIFrame = new cIFramePanel({
      align: eAlign.eNone,
      visible: false,
      width: 128,
      height: 128,
      backgroundColor: 'transparent',
      border: 1,
      borderColor: '#000000',
      iFrameHTML: '',
      supportScroll: false
    });
    this.screen.panel.panels.push(this.evaluationSandboxIFrame);
    Model.initEvaluationSandbox(this.evaluationSandboxIFrame, 
      function() {
        lThis.evaluationSandboxIFrame_Initialized = true;
        lThis.updateSandboxInitialized();
      }
    );
    
    // Build screens:
    
    this.screenPanel = new cPanel({
      align: eAlign.eClient,
      backgroundColor: 'transparent'
    });
    this.screen.panel.panels.push(this.screenPanel);
    
    this.panelTopMenu = new cPanel({
      align: eAlign.eTop,
      height: 60,
      backgroundColor: '#333333'
    });
    this.screenPanel.panels.push(this.panelTopMenu);

    this.panelTopMenuLogo = new cPanel({
      align: eAlign.eLeft,
      width: 192,
      margin: 6,
      backgroundColor: 'transparent',
      image: this.screen.getImageClone(cProblemSolverApp.cImageProblemSolver),
      imageStretch: true,
      onClick: function() {
        lThis.panelTabMenu.closeMenus();
      }
    });
    this.panelTopMenu.panels.push(this.panelTopMenuLogo);
    
    this.panelTopMenuFile = new cPanel({
      align: eAlign.eLeft,
      shape: cPanel.cShapeRoundRect,
      width: 172,
      marginLeft: 16, 
      marginTop: 8,
      marginBottom: 8,
      //paddingLeft: 16,
      paddingTop: 2,
      border: 1,
      borderColor: '#262626',
      borderRadius: 16,
      backgroundColor: '#262626', 
      color: '#ffffff',
      fontSize: 30,
      //fontBold: true,
      textAlign: eTextAlign.eCenter,
      innerHTML: 'EXAMPLES',
      onClick: function() {
        var lModalPanel = new clsModalPanel({
          onClick: function() {
            setTimeout(function() {
              lThis.screen.panel.removePanel(lModalPanel);
            }, 10);
          }
        });
        lThis.screen.panel.appendPanel(lModalPanel);
        lModalPanel.fileDialogPanel = new cPanel({
          align: eAlign.eCenterVertical,
          shape: cPanel.cShapeRoundRect,
          width: 720,
          //height: 200,
          marginLeft: 100,
          marginTop: 100,
          marginRight: 100,
          marginBottom: 100,
          border: 1,
          borderColor: '#262626',
          borderRadius: 16,
          backgroundColor: '#262626', 
          color: '#ffffff',
          fontSize: 36,
          onClick: function() {
            this.stopBubble = true;
          }
        });
        lModalPanel.contentPanel.panels.push(lModalPanel.fileDialogPanel);
        lModalPanel.fileDialogPanel.headerPanel = new cPanel({
          align: eAlign.eTop,
          height: 50,
          paddingLeft: 20,
          backgroundColor: '#444444', 
          color: '#eeeeee',
          fontSize: 36,
          innerHTML: 'Open an example project'
        });
        lModalPanel.fileDialogPanel.panels.push(lModalPanel.fileDialogPanel.headerPanel);
        
        lModalPanel.fileDialogPanel.bottomPanel = new cPanel({
          align: eAlign.eBottom,
          height: 70,
          paddingLeft: 20,
          backgroundColor: '#444444'
        });
        lModalPanel.fileDialogPanel.panels.push(lModalPanel.fileDialogPanel.bottomPanel);

        lModalPanel.fileDialogPanel.bottomPanel.cancelButton = new cPanel({
          align: eAlign.eCenterVertical,
          shape: cPanel.cShapeRoundRect,
          width: 200,
          marginTop: 10,
          marginBottom: 10,
          padding: 2,
          backgroundColor: '#262626',
          border: 1,
          borderColor: '#262626',
          borderRadius: 16,
          color: '#eeeeee',
          fontSize: 36,
          textAlign: eTextAlign.eCenter,
          innerHTML: 'CANCEL',
          onClick: function() {
            this.stopBubble = true;
            setTimeout(function() {
              lThis.screen.panel.removePanel(lModalPanel);
            }, 10);
          }
        });
        lModalPanel.fileDialogPanel.bottomPanel.panels.push(lModalPanel.fileDialogPanel.bottomPanel.cancelButton);

        lModalPanel.fileDialogPanel.contentScrollPanel = new cScrollboxPanel({
          align: eAlign.eClient,
          panelBoxRoundedBorder: false,
          marginLeft: 10,
          marginRight: 10,
          paddingTop: 20,
          paddingBottom: 20,
          backgroundColor: 'transparent',
          boxBackgroundColor: '#262626', //'#ffffff', //  '#96ceb4',
          scrollBarHandleColor: '#666666',
          autoHideScrollbar: true
        });
        lModalPanel.fileDialogPanel.panels.push(lModalPanel.fileDialogPanel.contentScrollPanel);
        
        for (var li = 0, lc = cFilePresets.presets.length; li < lc; li++) {
          var lPresetPanel = new cPanel({
            align: eAlign.eTop,
            height: 70,
            marginBottom: 4,
            backgroundColor: 'transparent',
            onClick: function() {
              // TODO: we should call app's loadFile function (still have to make that too)
              this.stopBubble = true;
              var lPresetIndex = this.presetIndex;
              setTimeout(function() {
                lThis.screen.panel.removePanel(lModalPanel);
                var lFilePreset = cFilePresets.presets[lPresetIndex];
                // load file
                Model.loadFile(lFilePreset);
                lThis.viewWorldPanel.reloadWorld();
                lThis.viewChangesPanel.reloadWorld();
                lThis.viewEvaluatePanel.reloadWorld();
                lThis.viewMultiversePanel.resetMultiverse();
                lThis.panelTabMenu.selectTabIndex(0);
              }, 10);
            }
          });
          lModalPanel.fileDialogPanel.contentScrollPanel.panelBox.panels.push(lPresetPanel);
          lPresetPanel.presetIndex = li;
          
          
          var lHTMLContainerPanel = new cPanel({
            align: eAlign.eLeft,
            width: 70,
            marginRight: 4,
            backgroundColor: '#444444'
          });
          lPresetPanel.panels.push(lHTMLContainerPanel);
          if (cFilePresets.presets[li].html != '') {
            var lHTMLDoc = '<!DOCTYPE html>\n' + '<html>\n' + '<head>\n' + '<style>\n' + 'body {\n' + '  margin: 0px;\n' + '  border: 0px;\n' + '  padding: 0px;\n' + '  background-color: #ffffff;\n' + '  font-family: Calibri, Arial, helvetica, sans-serif;\n' + '  -moz-user-select: -moz-none;\n' + '  -khtml-user-select: none;\n' + '  -webkit-user-select: none;\n' + '  -ms-user-select: none;\n' + '  user-select: none;\n' + '}\n' + cFilePresets.presets[li].project.css + '\n' + '</style>\n' + '</head>\n' + '<body>' + cFilePresets.presets[li].project.html + '\n' + '</body>\n' + '</html>';
            var lPresetHTMLPanel = new cIFramePanel({
              align: eAlign.eClient,
              iFrameHTML : lHTMLDoc,
              supportScroll : false,
              zoom : 0.2 // 0.25
            });
            lHTMLContainerPanel.panels.push(lPresetHTMLPanel);

            var lHTMLOverlayPanel = new cPanel({
              align: eAlign.eClient,
              backgroundColor: 'transparant',
              onClick: function() {
                // TODO: we should call app's loadFile function (still have to make that too)
                this.stopBubble = true;
                var lPresetIndex = this.presetIndex;
                setTimeout(function() {
                  lThis.screen.panel.removePanel(lModalPanel);
                  var lFilePreset = cFilePresets.presets[lPresetIndex];
                  // load file
                  Model.loadFile(lFilePreset);
                  lThis.viewWorldPanel.reloadWorld();
                  lThis.viewChangesPanel.reloadWorld();
                  lThis.viewEvaluatePanel.reloadWorld();
                  lThis.viewMultiversePanel.resetMultiverse();
                  lThis.panelTabMenu.selectTabIndex(0);
                }, 10);
              }
            });
            lHTMLContainerPanel.panels.push(lHTMLOverlayPanel);
            lHTMLOverlayPanel.presetIndex = li;
          }

          var lPresetLabelPanel = new cPanel({
            align: eAlign.eClient,
            paddingLeft: 8,
            paddingRight: 8,
            paddingTop: 20,
            backgroundColor: '#444444',
            color: '#eeeeee',
            fontSize: 24,
            textAlign: eTextAlign.eLeft,
            innerHTML: cLib.textToHTML(cFilePresets.presets[li].project.name)
          });
          lPresetPanel.panels.push(lPresetLabelPanel);
          
        };


        lModalPanel.contentPanel.rerender();
      }
    });
    this.panelTopMenu.panels.push(this.panelTopMenuFile);


    this.panelTopMenuClear = new cPanel({
      align: eAlign.eLeft,
      shape: cPanel.cShapeRoundRect,
      width: 118,
      marginLeft: 8, 
      marginTop: 8,
      marginBottom: 8,
      paddingTop: 2,
      border: 1,
      borderColor: '#262626',
      borderRadius: 16,
      backgroundColor: '#262626', 
      color: '#ffffff',
      fontSize: 30,
      //fontBold: true,
      textAlign: eTextAlign.eCenter,
      innerHTML: 'CLEAR',
      onClick: function() {
        this.stopBubble = true;
        var lModalPanel = new clsModalPanel({
          onClick: function() {
            setTimeout(function() {
              lThis.screen.panel.removePanel(lModalPanel);
            }, 10);
          }
        });
        lThis.screen.panel.appendPanel(lModalPanel);
        lModalPanel.clearPanel = new cPanel({
          align: eAlign.eCenter, //eAlign.eCenterVertical,
          shape: cPanel.cShapeRoundRect,
          width: 640,
          height: 300,
          //marginLeft: 100,
          //marginTop: 100,
          //marginRight: 100,
          //marginBottom: 100,
          border: 1,
          borderColor: '#262626',
          borderRadius: 16,
          backgroundColor: '#262626', 
          onClick: function() {
            this.stopBubble = true;
          }
        });
        lModalPanel.contentPanel.panels.push(lModalPanel.clearPanel);
        lModalPanel.clearPanel.headerPanel = new cPanel({
          align: eAlign.eTop,
          height: 50,
          paddingLeft: 20,
          backgroundColor: '#444444', 
          color: '#eeeeee',
          fontSize: 36,
          innerHTML: 'Clear project'
        });
        lModalPanel.clearPanel.panels.push(lModalPanel.clearPanel.headerPanel);
        
        lModalPanel.clearPanel.bottomPanel = new cPanel({
          align: eAlign.eBottom,
          height: 70,
          paddingLeft: 20,
          backgroundColor: '#444444'
        });
        lModalPanel.clearPanel.panels.push(lModalPanel.clearPanel.bottomPanel);

        lModalPanel.clearPanel.bottomPanel.buttonPanel = new cPanel({
          align: eAlign.eCenterVertical,
          width: 420,
          backgroundColor: 'transparent'
        });
        lModalPanel.clearPanel.bottomPanel.panels.push(lModalPanel.clearPanel.bottomPanel.buttonPanel);

        lModalPanel.clearPanel.bottomPanel.buttonPanel.okButton = new cPanel({
          align: eAlign.eLeft,
          shape: cPanel.cShapeRoundRect,
          width: 200,
          marginTop: 10,
          marginBottom: 10,
          padding: 2,
          backgroundColor: '#262626',
          border: 1,
          borderColor: '#262626',
          borderRadius: 16,
          color: '#eeeeee',
          fontSize: 36,
          textAlign: eTextAlign.eCenter,
          innerHTML: 'OK',
          onClick: function() {
            this.stopBubble = true;
            lThis.screen.panel.removePanel(lModalPanel);
            setTimeout(function() {
              // load file
              Model.ClearAll();
              lThis.viewWorldPanel.reloadWorld();
              lThis.viewChangesPanel.reloadWorld();
              lThis.viewEvaluatePanel.reloadWorld();
              lThis.viewMultiversePanel.resetMultiverse();
              lThis.panelTabMenu.selectTabIndex(0);
            }, 10);
          }
        });
        lModalPanel.clearPanel.bottomPanel.buttonPanel.panels.push(lModalPanel.clearPanel.bottomPanel.buttonPanel.okButton);

        lModalPanel.clearPanel.bottomPanel.buttonPanel.cancelButton = new cPanel({
          align: eAlign.eLeft,
          shape: cPanel.cShapeRoundRect,
          width: 200,
          marginLeft: 20,
          marginTop: 10,
          marginBottom: 10,
          padding: 2,
          backgroundColor: '#262626',
          border: 1,
          borderColor: '#262626',
          borderRadius: 16,
          color: '#eeeeee',
          fontSize: 36,
          textAlign: eTextAlign.eCenter,
          innerHTML: 'CANCEL',
          onClick: function() {
            this.stopBubble = true;
            setTimeout(function() {
              lThis.screen.panel.removePanel(lModalPanel);
            }, 10);
          }
        });
        lModalPanel.clearPanel.bottomPanel.buttonPanel.panels.push(lModalPanel.clearPanel.bottomPanel.buttonPanel.cancelButton);

        lModalPanel.clearPanel.messagePanel = new cPanel({
          align: eAlign.eClient,
          padding: 20,
          backgroundColor: '#262626',
          color: '#eeeeee',
          fontSize: 32,
          innerHTML: 
            'Would you like to start with a new empty project?<br />\n' +
            '<span style="font-size: 20px;">All contents in "world", "changes" and "evaluate" will be cleared.</span>'
        });
        lModalPanel.clearPanel.panels.push(lModalPanel.clearPanel.messagePanel);

        lModalPanel.contentPanel.rerender();
      }
    });
    this.panelTopMenu.panels.push(this.panelTopMenuClear);

    this.panelTopMenuSaveAs = new cPanel({
      align: eAlign.eLeft,
      shape: cPanel.cShapeRoundRect,
      width: 110,
      marginLeft: 8, 
      marginTop: 8,
      marginBottom: 8,
      paddingTop: 2,
      border: 1,
      borderColor: '#262626',
      borderRadius: 16,
      backgroundColor: '#262626', 
      color: '#ffffff',
      fontSize: 30,
      //fontBold: true,
      textAlign: eTextAlign.eCenter,
      innerHTML: 'SAVE',
      onClick: function() {
        this.stopBubble = true;
        var lModalPanel = new clsModalPanel({
          onClick: function() {
            setTimeout(function() {
              lThis.screen.panel.removePanel(lModalPanel);
            }, 10);
          }
        });
        lThis.screen.panel.appendPanel(lModalPanel);

        var lDownloadAttributeSupported = ("download" in document.createElement("a"));
        if (lDownloadAttributeSupported) {
          lModalPanel.windowPanel = new cPanel({
            align: eAlign.eCenter, //eAlign.eCenterVertical,
            shape: cPanel.cShapeRoundRect,
            width: 640,
            height: 480,
            //marginLeft: 100,
            //marginTop: 100,
            //marginRight: 100,
            //marginBottom: 100,
            border: 1,
            borderColor: '#262626',
            borderRadius: 16,
            backgroundColor: '#262626', 
            onClick: function() {
              this.stopBubble = true;
            }
          });
          lModalPanel.contentPanel.panels.push(lModalPanel.windowPanel);

          lModalPanel.windowPanel.headerPanel = new cPanel({
            align: eAlign.eTop,
            height: 50,
            paddingLeft: 20,
            backgroundColor: '#444444', 
            color: '#eeeeee',
            fontSize: 36,
            innerHTML: 'Download project to your PC'
          });
          lModalPanel.windowPanel.panels.push(lModalPanel.windowPanel.headerPanel);
          
          lModalPanel.windowPanel.bottomPanel = new cPanel({
            align: eAlign.eBottom,
            height: 70,
            paddingLeft: 20,
            backgroundColor: '#444444'
          });
          lModalPanel.windowPanel.panels.push(lModalPanel.windowPanel.bottomPanel);

          lModalPanel.windowPanel.bottomPanel.buttonPanel = new cPanel({
            align: eAlign.eCenterVertical,
            width: 420,
            backgroundColor: 'transparent'
          });
          lModalPanel.windowPanel.bottomPanel.panels.push(lModalPanel.windowPanel.bottomPanel.buttonPanel);

          lModalPanel.windowPanel.bottomPanel.buttonPanel.okButton = new cPanel({
            align: eAlign.eLeft,
            shape: cPanel.cShapeRoundRect,
            width: 200,
            marginTop: 10,
            marginBottom: 10,
            padding: 2,
            backgroundColor: '#262626',
            border: 1,
            borderColor: '#262626',
            borderRadius: 16,
            color: '#eeeeee',
            fontSize: 36,
            textAlign: eTextAlign.eCenter,
            innerHTML: 'OK',
            onClick: function() {
              var lFileName = lModalPanel.windowPanel.clientPanel.fileNamePanel.inputPanel.getValue();
              if (lFileName != '') {
                this.stopBubble = true;
                lThis.screen.panel.removePanel(lModalPanel);
                setTimeout(function() {
                  // save file
                  var download = function(aFilename, aContent) {
                    var a = document.createElement('a');
                    a.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(aContent));
                    a.setAttribute('download', aFilename);
                    a.click();
                  };
                  var lFileName = lModalPanel.windowPanel.clientPanel.fileNamePanel.inputPanel.getValue();
                  download(
                    (lFileName ? lFileName : ''),
                    Model.generateFileContent(lModalPanel.windowPanel.clientPanel.projectPanel.inputPanel.getValue())
                  );
                }, 10);
              }
            }
          });
          lModalPanel.windowPanel.bottomPanel.buttonPanel.panels.push(lModalPanel.windowPanel.bottomPanel.buttonPanel.okButton);

          lModalPanel.windowPanel.bottomPanel.buttonPanel.cancelButton = new cPanel({
            align: eAlign.eLeft,
            shape: cPanel.cShapeRoundRect,
            width: 200,
            marginLeft: 20,
            marginTop: 10,
            marginBottom: 10,
            padding: 2,
            backgroundColor: '#262626',
            border: 1,
            borderColor: '#262626',
            borderRadius: 16,
            color: '#eeeeee',
            fontSize: 36,
            textAlign: eTextAlign.eCenter,
            innerHTML: 'CANCEL',
            onClick: function() {
              this.stopBubble = true;
              setTimeout(function() {
                lThis.screen.panel.removePanel(lModalPanel);
              }, 10);
            }
          });
          lModalPanel.windowPanel.bottomPanel.buttonPanel.panels.push(lModalPanel.windowPanel.bottomPanel.buttonPanel.cancelButton);

          lModalPanel.windowPanel.clientPanel = new cPanel({
            align: eAlign.eClient,
            paddingTop: 20,
            backgroundColor: 'transparent'
          });
          lModalPanel.windowPanel.panels.push(lModalPanel.windowPanel.clientPanel);

          lModalPanel.windowPanel.clientPanel.topMessageLabelPanel = new cPanel({
            align: eAlign.eTop,
            height: 120,
            paddingLeft: 20,
            paddingRight: 20,
            backgroundColor: 'transparent',
            color: '#eeeeee',
            fontSize: 26,
            innerHTML: 
              'Enter your project\'s name and the file name you want to save the project to.\n' +
              'The project will be downloaded to your "downloads" folder when you press OK.'
          });
          lModalPanel.windowPanel.clientPanel.panels.push(lModalPanel.windowPanel.clientPanel.topMessageLabelPanel);


          lModalPanel.windowPanel.clientPanel.projectPanel = new cPanel({
            align: eAlign.eTop,
            height: 80,
            backgroundColor: 'transparent'
          });
          lModalPanel.windowPanel.clientPanel.panels.push(lModalPanel.windowPanel.clientPanel.projectPanel);

          lModalPanel.windowPanel.clientPanel.projectPanel.labelPanel = new cPanel({
            align: eAlign.eLeft,
            width: 280,
            padding: 20,
            backgroundColor: 'transparent',
            color: '#eeeeee',
            fontSize: 32,
            textAlign: eTextAlign.eRight,
            innerHTML: 'Project name:'
          });
          lModalPanel.windowPanel.clientPanel.projectPanel.panels.push(lModalPanel.windowPanel.clientPanel.projectPanel.labelPanel);

          lModalPanel.windowPanel.clientPanel.projectPanel.inputPanel = new cTextLineEditPanel({
            align: eAlign.eClient,
            marginTop: 15,
            marginBottom: 15,
            marginRight: 30,
            backgroundColor: '#eeeeee',
            color: '#111111',
            fontSize: 32,
            value: 'My project'
          });
          lModalPanel.windowPanel.clientPanel.projectPanel.panels.push(lModalPanel.windowPanel.clientPanel.projectPanel.inputPanel);

          lModalPanel.windowPanel.clientPanel.fileNamePanel = new cPanel({
            align: eAlign.eTop,
            height: 80,
            backgroundColor: 'transparent'
          });
          lModalPanel.windowPanel.clientPanel.panels.push(lModalPanel.windowPanel.clientPanel.fileNamePanel);

          lModalPanel.windowPanel.clientPanel.fileNamePanel.labelPanel = new cPanel({
            align: eAlign.eLeft,
            width: 280,
            padding: 20,
            backgroundColor: 'transparent',
            color: '#eeeeee',
            fontSize: 32,
            textAlign: eTextAlign.eRight,
            innerHTML: 'Project file name:'
          });
          lModalPanel.windowPanel.clientPanel.fileNamePanel.panels.push(lModalPanel.windowPanel.clientPanel.fileNamePanel.labelPanel);

          lModalPanel.windowPanel.clientPanel.fileNamePanel.inputPanel = new cTextLineEditPanel({
            align: eAlign.eClient,
            marginTop: 15,
            marginBottom: 15,
            marginRight: 30,
            backgroundColor: '#eeeeee',
            color: '#111111',
            fontSize: 32,
            value: 'myproject.psp'
          });
          lModalPanel.windowPanel.clientPanel.fileNamePanel.panels.push(lModalPanel.windowPanel.clientPanel.fileNamePanel.inputPanel);


        } else {


          lModalPanel.windowPanel = new cPanel({
            align: eAlign.eCenter, //eAlign.eCenterVertical,
            shape: cPanel.cShapeRoundRect,
            width: 700,
            height: 360,
            //marginLeft: 100,
            //marginTop: 100,
            //marginRight: 100,
            //marginBottom: 100,
            border: 1,
            borderColor: '#262626',
            borderRadius: 16,
            backgroundColor: '#262626', 
            onClick: function() {
              this.stopBubble = true;
            }
          });
          lModalPanel.contentPanel.panels.push(lModalPanel.windowPanel);

          lModalPanel.windowPanel.headerPanel = new cPanel({
            align: eAlign.eTop,
            height: 50,
            paddingLeft: 20,
            backgroundColor: '#444444', 
            color: '#eeeeee',
            fontSize: 36,
            innerHTML: 'Save project as...&nbsp&nbsp&nbsp;<span style="font-size: 28px; color: #cc9999;">not supported in your browser</span>'
          });
          lModalPanel.windowPanel.panels.push(lModalPanel.windowPanel.headerPanel);
          
          lModalPanel.windowPanel.bottomPanel = new cPanel({
            align: eAlign.eBottom,
            height: 70,
            paddingLeft: 20,
            backgroundColor: '#444444'
          });
          lModalPanel.windowPanel.panels.push(lModalPanel.windowPanel.bottomPanel);

          lModalPanel.windowPanel.bottomPanel.buttonPanel = new cPanel({
            align: eAlign.eCenterVertical,
            width: 420,
            backgroundColor: 'transparent'
          });
          lModalPanel.windowPanel.bottomPanel.panels.push(lModalPanel.windowPanel.bottomPanel.buttonPanel);

          lModalPanel.windowPanel.bottomPanel.buttonPanel.okButton = new cPanel({
            align: eAlign.eCenterVertical,
            shape: cPanel.cShapeRoundRect,
            width: 200,
            marginTop: 10,
            marginBottom: 10,
            padding: 2,
            backgroundColor: '#262626',
            border: 1,
            borderColor: '#262626',
            borderRadius: 16,
            color: '#eeeeee',
            fontSize: 36,
            textAlign: eTextAlign.eCenter,
            innerHTML: 'OK',
            onClick: function() {
              this.stopBubble = true;
              lThis.screen.panel.removePanel(lModalPanel);
            }
          });
          lModalPanel.windowPanel.bottomPanel.buttonPanel.panels.push(lModalPanel.windowPanel.bottomPanel.buttonPanel.okButton);

          lModalPanel.windowPanel.clientPanel = new cPanel({
            align: eAlign.eClient,
            paddingTop: 10,
            backgroundColor: 'transparent'
          });
          lModalPanel.windowPanel.panels.push(lModalPanel.windowPanel.clientPanel);

          lModalPanel.windowPanel.clientPanel.messagePanel = new cPanel({
            align: eAlign.eClient,
            padding: 20,
            backgroundColor: 'transparent',
            color: '#eeeeee',
            fontSize: 28,
            innerHTML: 
              'Sorry, your browser does not support Problem Solver\'s method for downloading files to your PC.<br /><br />\n' +
              'Examples of browsers that support downloading files are Chrome, Firefox and Opera.'
          });
          lModalPanel.windowPanel.clientPanel.panels.push(lModalPanel.windowPanel.clientPanel.messagePanel);
        }

        lModalPanel.contentPanel.rerender();
      }
    });
    this.panelTopMenu.panels.push(this.panelTopMenuSaveAs);





    this.panelTopMenuLoad = new cPanel({
      align: eAlign.eLeft,
      shape: cPanel.cShapeRoundRect,
      width: 120,
      marginLeft: 8, 
      marginTop: 8,
      marginBottom: 8,
      paddingTop: 2,
      border: 1,
      borderColor: '#262626',
      borderRadius: 16,
      backgroundColor: '#262626', 
      color: '#ffffff',
      fontSize: 30,
      //fontBold: true,
      textAlign: eTextAlign.eCenter,
      innerHTML: 'OPEN',
      onClick: function() {
        this.stopBubble = true;
        var lModalPanel = new clsModalPanel({
          onClick: function() {
            setTimeout(function() {
              lThis.screen.panel.removePanel(lModalPanel);
            }, 10);
          }
        });
        lThis.screen.panel.appendPanel(lModalPanel);

        var lLoadSupported = (window.File && window.FileReader && window.FileList && window.Blob);
        if (lLoadSupported) {
          lModalPanel.windowPanel = new cPanel({
            align: eAlign.eCenter, //eAlign.eCenterVertical,
            shape: cPanel.cShapeRoundRect,
            width: 700,
            height: 480,
            //marginLeft: 100,
            //marginTop: 100,
            //marginRight: 100,
            //marginBottom: 100,
            border: 1,
            borderColor: '#262626',
            borderRadius: 16,
            backgroundColor: '#262626', 
            onClick: function() {
              this.stopBubble = true;
            }
          });
          lModalPanel.contentPanel.panels.push(lModalPanel.windowPanel);

          lModalPanel.windowPanel.headerPanel = new cPanel({
            align: eAlign.eTop,
            height: 50,
            paddingLeft: 20,
            backgroundColor: '#444444', 
            color: '#eeeeee',
            fontSize: 36,
            innerHTML: 'Load Problem Solver project from disk'
          });
          lModalPanel.windowPanel.panels.push(lModalPanel.windowPanel.headerPanel);
          
          lModalPanel.windowPanel.bottomPanel = new cPanel({
            align: eAlign.eBottom,
            height: 70,
            paddingLeft: 20,
            backgroundColor: '#444444'
          });
          lModalPanel.windowPanel.panels.push(lModalPanel.windowPanel.bottomPanel);

          lModalPanel.windowPanel.bottomPanel.buttonPanel = new cPanel({
            align: eAlign.eCenterVertical,
            width: 420,
            backgroundColor: 'transparent'
          });
          lModalPanel.windowPanel.bottomPanel.panels.push(lModalPanel.windowPanel.bottomPanel.buttonPanel);

          lModalPanel.windowPanel.bottomPanel.buttonPanel.okButton = new cPanel({
            align: eAlign.eLeft,
            shape: cPanel.cShapeRoundRect,
            width: 200,
            marginTop: 10,
            marginBottom: 10,
            padding: 2,
            backgroundColor: '#999999', // '#262626',
            border: 1,
            borderColor: '#999999', // '#262626',
            borderRadius: 16,
            color: '#eeeeee',
            fontSize: 36,
            textAlign: eTextAlign.eCenter,
            innerHTML: 'OK',
            onClick: function() {
              this.stopBubble = true;
              if (lModalPanel.windowPanel.clientPanel.fileLoadPanel.fileAsObject !== null) {
                lThis.screen.panel.removePanel(lModalPanel);
                setTimeout(function() {
                  // load file
                  Model.loadFile(lModalPanel.windowPanel.clientPanel.fileLoadPanel.fileAsObject);
                  lThis.viewWorldPanel.reloadWorld();
                  lThis.viewChangesPanel.reloadWorld();
                  lThis.viewEvaluatePanel.reloadWorld();
                  lThis.viewMultiversePanel.resetMultiverse();
                  lThis.panelTabMenu.selectTabIndex(0);
                }, 10);
              }
            }
          });
          lModalPanel.windowPanel.bottomPanel.buttonPanel.panels.push(lModalPanel.windowPanel.bottomPanel.buttonPanel.okButton);

          lModalPanel.windowPanel.bottomPanel.buttonPanel.cancelButton = new cPanel({
            align: eAlign.eLeft,
            shape: cPanel.cShapeRoundRect,
            width: 200,
            marginLeft: 20,
            marginTop: 10,
            marginBottom: 10,
            padding: 2,
            backgroundColor: '#262626',
            border: 1,
            borderColor: '#262626',
            borderRadius: 16,
            color: '#eeeeee',
            fontSize: 36,
            textAlign: eTextAlign.eCenter,
            innerHTML: 'CANCEL',
            onClick: function() {
              this.stopBubble = true;
              setTimeout(function() {
                lThis.screen.panel.removePanel(lModalPanel);
              }, 10);
            }
          });
          lModalPanel.windowPanel.bottomPanel.buttonPanel.panels.push(lModalPanel.windowPanel.bottomPanel.buttonPanel.cancelButton);

          lModalPanel.windowPanel.clientPanel = new cPanel({
            align: eAlign.eClient,
            paddingTop: 20,
            backgroundColor: 'transparent'
          });
          lModalPanel.windowPanel.panels.push(lModalPanel.windowPanel.clientPanel);

          lModalPanel.windowPanel.clientPanel.topMessageLabelPanel = new cPanel({
            align: eAlign.eTop,
            height: 100,
            paddingLeft: 20,
            paddingRight: 20,
            backgroundColor: 'transparent',
            color: '#eeeeee',
            fontSize: 26,
            innerHTML: 
              'Select a Problem Solver project file that you want to import.\n' +
              'The project file will be imported into Problem Solver when you press OK.'
          });
          lModalPanel.windowPanel.clientPanel.panels.push(lModalPanel.windowPanel.clientPanel.topMessageLabelPanel);

          lModalPanel.windowPanel.clientPanel.fileLoadPanel = new clsFileLoadPanel({
            align: eAlign.eTop,
            height: 80,
            paddingLeft: 40,
            paddingTop: 20,
            backgroundColor: 'transparent',
            color: '#eeeeee',
            fontSize: 32,
            onSelectFile: function(aSuccess) {
              var lImported = false;
              if (aSuccess) {
                if ((lModalPanel.windowPanel.clientPanel.fileLoadPanel.fileLoaded) && 
                    (lModalPanel.windowPanel.clientPanel.fileLoadPanel.fileContent != '')) {
                  var lFile = null;
                  try {
                    lFile = eval('(' + lModalPanel.windowPanel.clientPanel.fileLoadPanel.fileContent + ')');
                  } catch (e) {
                    //ErrorMessage = e.message ? e.message : e;
                    lFile = null;
                  }
                  if (lFile && (lFile.application) && (lFile.application.name === "ProblemSolver") && (lFile.project)) {
                    lModalPanel.windowPanel.clientPanel.fileLoadPanel.fileAsObject = lFile;
                    lModalPanel.windowPanel.clientPanel.projectNamePanel.valuePanel.setInnerHTML(lFile.project.name ? lFile.project.name : '');
                    lImported = true;
                  }
                }
              }
              if (lImported) {
                lModalPanel.windowPanel.bottomPanel.buttonPanel.okButton.setBackgroundColor('#262626');
                lModalPanel.windowPanel.bottomPanel.buttonPanel.okButton.setBorderColor('#262626');
                lModalPanel.windowPanel.clientPanel.statusMessageLabelPanel.setInnerHTML(
                  '<span style="color: #66ee66;">Successfully recognized file as a Problem Solver project.\n' +
                  'Click OK to import file into Problem Solver.</span>'
                );
              } else {
                lModalPanel.windowPanel.clientPanel.fileLoadPanel.fileAsObject = null;
                lModalPanel.windowPanel.clientPanel.projectNamePanel.valuePanel.setInnerHTML('');
                lModalPanel.windowPanel.clientPanel.fileLoadPanel.fileLoaded = false;
                lModalPanel.windowPanel.clientPanel.fileLoadPanel.fileContent = '';
                lModalPanel.windowPanel.bottomPanel.buttonPanel.okButton.setBackgroundColor('#999999');
                lModalPanel.windowPanel.bottomPanel.buttonPanel.okButton.setBorderColor('#999999');
                lModalPanel.windowPanel.clientPanel.statusMessageLabelPanel.setInnerHTML(
                  '<span style="color: #ee6666;">Error: Failed to read file as an Problem Solver project.\n' +
                  'Please select a file that was created with Problem Solver.</span>'
                );
              }
            }
          });
          lModalPanel.windowPanel.clientPanel.fileLoadPanel.fileAsObject = null;
          lModalPanel.windowPanel.clientPanel.panels.push(lModalPanel.windowPanel.clientPanel.fileLoadPanel);

          lModalPanel.windowPanel.clientPanel.projectNamePanel = new cPanel({
            align: eAlign.eTop,
            height: 70,
            backgroundColor: 'transparent'
          });
          lModalPanel.windowPanel.clientPanel.panels.push(lModalPanel.windowPanel.clientPanel.projectNamePanel);

          lModalPanel.windowPanel.clientPanel.projectNamePanel.labelPanel = new cPanel({
            align: eAlign.eLeft,
            width: 280,
            padding: 15,
            backgroundColor: 'transparent',
            color: '#eeeeee',
            fontSize: 32,
            textAlign: eTextAlign.eRight,
            innerHTML: 'Project name:'
          });
          lModalPanel.windowPanel.clientPanel.projectNamePanel.panels.push(lModalPanel.windowPanel.clientPanel.projectNamePanel.labelPanel);

          lModalPanel.windowPanel.clientPanel.projectNamePanel.valuePanel = new cPanel({
            align: eAlign.eClient,
            padding: 15,
            backgroundColor: 'transparent',
            color: '#eeeeee',
            fontSize: 32,
            innerHTML: ''
          });
          lModalPanel.windowPanel.clientPanel.projectNamePanel.panels.push(lModalPanel.windowPanel.clientPanel.projectNamePanel.valuePanel);

          lModalPanel.windowPanel.clientPanel.statusMessageLabelPanel = new cPanel({
            align: eAlign.eBottom,
            height: 80,
            paddingLeft: 20,
            paddingRight: 20,
            backgroundColor: 'transparent',
            color: '#eeeeee',
            fontSize: 26,
            innerHTML: ''
          });
          lModalPanel.windowPanel.clientPanel.panels.push(lModalPanel.windowPanel.clientPanel.statusMessageLabelPanel);



        } else {


          lModalPanel.windowPanel = new cPanel({
            align: eAlign.eCenter, //eAlign.eCenterVertical,
            shape: cPanel.cShapeRoundRect,
            width: 700,
            height: 360,
            //marginLeft: 100,
            //marginTop: 100,
            //marginRight: 100,
            //marginBottom: 100,
            border: 1,
            borderColor: '#262626',
            borderRadius: 16,
            backgroundColor: '#262626', 
            onClick: function() {
              this.stopBubble = true;
            }
          });
          lModalPanel.contentPanel.panels.push(lModalPanel.windowPanel);

          lModalPanel.windowPanel.headerPanel = new cPanel({
            align: eAlign.eTop,
            height: 50,
            paddingLeft: 20,
            backgroundColor: '#444444', 
            color: '#eeeeee',
            fontSize: 36,
            innerHTML: 'Load project from disk&nbsp&nbsp&nbsp;<span style="font-size: 28px; color: #cc9999;">not supported</span>'
          });
          lModalPanel.windowPanel.panels.push(lModalPanel.windowPanel.headerPanel);
          
          lModalPanel.windowPanel.bottomPanel = new cPanel({
            align: eAlign.eBottom,
            height: 70,
            paddingLeft: 20,
            backgroundColor: '#444444'
          });
          lModalPanel.windowPanel.panels.push(lModalPanel.windowPanel.bottomPanel);

          lModalPanel.windowPanel.bottomPanel.buttonPanel = new cPanel({
            align: eAlign.eCenterVertical,
            width: 420,
            backgroundColor: 'transparent'
          });
          lModalPanel.windowPanel.bottomPanel.panels.push(lModalPanel.windowPanel.bottomPanel.buttonPanel);

          lModalPanel.windowPanel.bottomPanel.buttonPanel.okButton = new cPanel({
            align: eAlign.eCenterVertical,
            shape: cPanel.cShapeRoundRect,
            width: 200,
            marginTop: 10,
            marginBottom: 10,
            padding: 2,
            backgroundColor: '#262626',
            border: 1,
            borderColor: '#262626',
            borderRadius: 16,
            color: '#eeeeee',
            fontSize: 36,
            textAlign: eTextAlign.eCenter,
            innerHTML: 'OK',
            onClick: function() {
              this.stopBubble = true;
              lThis.screen.panel.removePanel(lModalPanel);
            }
          });
          lModalPanel.windowPanel.bottomPanel.buttonPanel.panels.push(lModalPanel.windowPanel.bottomPanel.buttonPanel.okButton);

          lModalPanel.windowPanel.clientPanel = new cPanel({
            align: eAlign.eClient,
            paddingTop: 10,
            backgroundColor: 'transparent'
          });
          lModalPanel.windowPanel.panels.push(lModalPanel.windowPanel.clientPanel);

          lModalPanel.windowPanel.clientPanel.messagePanel = new cPanel({
            align: eAlign.eClient,
            padding: 20,
            backgroundColor: 'transparent',
            color: '#eeeeee',
            fontSize: 28,
            innerHTML: 
              'Sorry, your browser does not support Problem Solver\'s method for loading files from your PC.<br /><br />\n' +
              'Consider updating your browser to the newest version (or trying another browser).'
          });
          lModalPanel.windowPanel.clientPanel.panels.push(lModalPanel.windowPanel.clientPanel.messagePanel);
        }

        lModalPanel.contentPanel.rerender();
      }
    });
    this.panelTopMenu.panels.push(this.panelTopMenuLoad);





    this.panelTopMenuLogoBetaAndCopyright = new cPanel({
      align: eAlign.eRight,
      width: 200,
      marginTop: 6,
      marginRight: 12,
      backgroundColor: 'transparent',
      color: '#ffffff',
      fontSize: 18,
      textAlign: eTextAlign.eRight,
      innerHTML: 
        '<i>v0.01 Beta</i><br />\n' +
        '&copy; 2014 Complexity.zone'
    });
    this.panelTopMenu.panels.push(this.panelTopMenuLogoBetaAndCopyright);


    this.panelTopMenuAbout = new cPanel({
      align: eAlign.eRight,
      shape: cPanel.cShapeRoundRect,
      width: 120,
      marginRight: 8, 
      marginTop: 8,
      marginBottom: 8,
      paddingTop: 2,
      border: 1,
      borderColor: '#262626',
      borderRadius: 16,
      backgroundColor: '#262626', 
      color: '#ffffff',
      fontSize: 30,
      //fontBold: true,
      textAlign: eTextAlign.eCenter,
      innerHTML: 'ABOUT',
      onClick: function() {
        this.stopBubble = true;
        var lModalPanel = new clsModalPanel({
          onClick: function() {
            setTimeout(function() {
              lThis.screen.panel.removePanel(lModalPanel);
            }, 10);
          }
        });
        lThis.screen.panel.appendPanel(lModalPanel);
        lModalPanel.dialogPanel = new cPanel({
          align: eAlign.eCenterVertical,
          shape: cPanel.cShapeRoundRect,
          width: 800,
          //height: 550,
          //marginLeft: 100,
          marginTop: 80,
          //marginRight: 100,
          marginBottom: 80,
          border: 1,
          borderColor: '#262626',
          borderRadius: 16,
          backgroundColor: '#262626', 
          onClick: function() {
            this.stopBubble = true;
          }
        });
        lModalPanel.contentPanel.panels.push(lModalPanel.dialogPanel);
        lModalPanel.dialogPanel.headerPanel = new cPanel({
          align: eAlign.eTop,
          height: 50,
          paddingLeft: 20,
          backgroundColor: '#444444', 
          color: '#eeeeee',
          fontSize: 36,
          innerHTML: 'About Problem Solver'
        });
        lModalPanel.dialogPanel.panels.push(lModalPanel.dialogPanel.headerPanel);
        
        lModalPanel.dialogPanel.bottomPanel = new cPanel({
          align: eAlign.eBottom,
          height: 70,
          paddingLeft: 20,
          backgroundColor: '#444444'
        });
        lModalPanel.dialogPanel.panels.push(lModalPanel.dialogPanel.bottomPanel);

        lModalPanel.dialogPanel.bottomPanel.buttonPanel = new cPanel({
          align: eAlign.eCenterVertical,
          width: 420,
          backgroundColor: 'transparent'
        });
        lModalPanel.dialogPanel.bottomPanel.panels.push(lModalPanel.dialogPanel.bottomPanel.buttonPanel);

        lModalPanel.dialogPanel.bottomPanel.buttonPanel.closeButton = new cPanel({
          align: eAlign.eCenterVertical,
          shape: cPanel.cShapeRoundRect,
          width: 200,
          marginLeft: 10,
          marginTop: 10,
          marginBottom: 10,
          padding: 2,
          backgroundColor: '#262626',
          border: 1,
          borderColor: '#262626',
          borderRadius: 16,
          color: '#eeeeee',
          fontSize: 36,
          textAlign: eTextAlign.eCenter,
          innerHTML: 'CLOSE',
          onClick: function() {
            this.stopBubble = true;
            setTimeout(function() {
              lThis.screen.panel.removePanel(lModalPanel);
            }, 10);
          }
        });
        lModalPanel.dialogPanel.bottomPanel.buttonPanel.panels.push(lModalPanel.dialogPanel.bottomPanel.buttonPanel.closeButton);

        lModalPanel.dialogPanel.contentScrollPanel = new cScrollboxPanel({
          align: eAlign.eClient,
          panelBoxRoundedBorder: false,
          marginLeft: 10,
          marginRight: 10,
          paddingTop: 20,
          paddingBottom: 20,
          backgroundColor: 'transparent',
          boxBackgroundColor: '#262626', //'#ffffff', //  '#96ceb4',
          scrollBarHandleColor: '#666666',
          autoHideScrollbar: true
        });
        lModalPanel.dialogPanel.panels.push(lModalPanel.dialogPanel.contentScrollPanel);

        lModalPanel.dialogPanel.messagePanel = new cPanel({
          align: eAlign.eTop,
          height: 600,
          padding: 20,
          backgroundColor: '#262626',
          color: '#eeeeee',
          fontSize: 18,
          innerHTML: 
            '<span style="font-style: italic;">A solution looking for a problem</span><br />\n' +
            '<br />\n' +
            'Problem Solver is the result of experimenting with JavaScript and a history of personal interest in AI and CS.\n' +
            'Problem Solver is an online programmable "game tree viewer", a web application for those who are looking for a tool to analyse puzzles, problems and algorithms.\n' +
            'Many simple puzzles (see the puzzles in the "examples" menu) can be modelled in Problem Solver, and it\'s solutions (goals) can simply be discovered in the "multiverse viewer".\n' +
            'However, when modelling complex problems or puzzles, you will find that the multiverse (game tree) grows too fast, with no solution in sight.\n' +
            'Therefore, Problem Solver is not necessarily intended for solving large complex problems, but merely a tool for gaining understanding and appreciation for the nature\n' +
            'and complexity of a problem of interest.\n' +
            'Problem Solver works best on a modern desktop PC or laptop with a large screen resolution.<br />\n' +
            'Please note that Problem Solver is still in the beta-phase of development.<br />\n' +
            '<br />\n' +
            'Feedback and comments are appreciated.<br />\n' +
            '<br />\n' +
            'Tim Samshuijzen<br />\n' +
            '<a href="mailto:timsamshuijzen@gmail.com" style="color: #cccccc; text-decoration: none;">timsamshuijzen@gmail.com</a><br />\n' +
            '<a href="http://complexity.zone/" target="_blank" style="color: #cccccc; text-decoration: none;">complexity.zone</a><br />\n' +
            '<br />\n'

        });
        lModalPanel.dialogPanel.contentScrollPanel.panelBox.panels.push(lModalPanel.dialogPanel.messagePanel);

        lModalPanel.contentPanel.rerender();

      }
    });
    this.panelTopMenu.panels.push(this.panelTopMenuAbout);    



    /*
    nice colors:
    #fffee9 : nice off-white
    #ffeead : shade of beige
    #E6E2AF : shade of beige
    #B3B088 : shade of beige
    #52A75B : green
    */
    
    
    this.panelTabMenu = new cTabMenuPanel({
      align: eAlign.eClient,
      color: '#ffffff',
      backgroundColor: '#262626',
      border: 0,
      padding: 0,
      panelHTML: 'Welcome',
      closeImage: this.screen.getImageClone(cProblemSolverApp.cImageClose),
      tabs: [
        {id: 'world', backgroundColor: '#98D47E', image: this.screen.getImageClone(cProblemSolverApp.cImageWorld)}, //#b4da81
        {id: 'changes', backgroundColor: '#96ceb4', image: this.screen.getImageClone(cProblemSolverApp.cImageChanges)}, //#96ceb4
        {id: 'evaluate', backgroundColor: '#FFAE3C', image: this.screen.getImageClone(cProblemSolverApp.cImageEvaluate)}, //#96ceb4
        //{id: 'agent', backgroundColor: '#96ceb4', image: this.screen.getImageClone(cProblemSolverApp.cImageAgent)}, //#96ceb4
        {id: 'multiverse', backgroundColor: '#777777', image: this.screen.getImageClone(cProblemSolverApp.cImageMultiverse)} //#BD8D46 //#ffcc5c
        //{id: 'future', backgroundColor: '#96ceb4', image: this.screen.getImageClone(cProblemSolverApp.cImageF)},
        //{id: 'past', backgroundColor: '#ffcc5c', image: this.screen.getImageClone(cProblemSolverApp.cImageP)},
        //{id: 'advise', backgroundColor: '#000000', color: '#ffffff', caption: 'Advise'},
        //{id: 'system', backgroundColor: '#ff6f69', image: this.screen.getImageClone(cProblemSolverApp.cImageS)},
        //{id: 'help', backgroundColor: '#555434', image: this.screen.getImageClone(cProblemSolverApp.cImageQuestion)}
      ]
    });
    this.screenPanel.panels.push(this.panelTabMenu);
    
    this.mainPagePanel = new cMainPagePanel({
      align: eAlign.eClient,
      backgroundColor: 'transparent',
      screen: this.screen,
      viewWorldImageId: cProblemSolverApp.cImageViewWorldImage,
      viewChangesImageId: cProblemSolverApp.cImageViewChangesImage,
      viewEvaluateImageId: cProblemSolverApp.cImageViewEvaluateImage,
      viewMultiverseImageId: cProblemSolverApp.cImageViewMultiverseImage,
      onWorldClick: function() {
        this.panelTabMenu.selectTabIndex(0);
      },
      onWorldClick_This: this,
      onChangesClick: function() {
        this.panelTabMenu.selectTabIndex(1);
      },
      onChangesClick_This: this,
      onEvaluateClick: function() {
        this.panelTabMenu.selectTabIndex(2);
      },
      onEvaluateClick_This: this,
      onMultiverseClick: function() {
        this.panelTabMenu.selectTabIndex(3);
      },
      onMultiverseClick_This: this
    });
    this.panelTabMenu.rootClientPanel.panels.push(this.mainPagePanel);

    this.viewWorldPanel = new cViewWorldPanel({
      align: eAlign.eClient,
      backgroundColor: 'transparent',
      screen: this.screen,
      closeImage: cProblemSolverApp.cImageClose,
      refreshImage: cProblemSolverApp.cImageRefresh,
      addImage: cProblemSolverApp.cImageAdd,
      deleteImage: cProblemSolverApp.cImageDelete,
      upImage: cProblemSolverApp.cImageUp,
      downImage: cProblemSolverApp.cImageDown
    });
    this.panelTabMenu.getPanelById('world').panels.push(this.viewWorldPanel);
    
    this.viewChangesPanel = new cViewChangesPanel({
      align: eAlign.eClient,
      backgroundColor: 'transparent',
      screen: this.screen,
      closeImage: cProblemSolverApp.cImageClose,
      refreshImage: cProblemSolverApp.cImageRefresh,
      addImage: cProblemSolverApp.cImageAdd,
      deleteImage: cProblemSolverApp.cImageDelete,
      upImage: cProblemSolverApp.cImageUp,
      downImage: cProblemSolverApp.cImageDown
    });
    this.panelTabMenu.getPanelById('changes').panels.push(this.viewChangesPanel);
    
    this.viewEvaluatePanel = new cViewEvaluatePanel({
      align: eAlign.eClient,
      backgroundColor: 'transparent',
      screen: this.screen,
      closeImage: cProblemSolverApp.cImageClose,
      refreshImage: cProblemSolverApp.cImageRefresh,
      addImage: cProblemSolverApp.cImageAdd,
      deleteImage: cProblemSolverApp.cImageDelete,
      upImage: cProblemSolverApp.cImageUp,
      downImage: cProblemSolverApp.cImageDown
    });
    this.panelTabMenu.getPanelById('evaluate').panels.push(this.viewEvaluatePanel);

    this.viewMultiversePanel = new cViewMultiversePanel({
      align: eAlign.eClient,
      backgroundColor: 'transparent',
      screen: this.screen,
      closeImage: cProblemSolverApp.cImageClose,
      refreshImage: cProblemSolverApp.cImageRefresh,
      addImage: cProblemSolverApp.cImageAdd,
      deleteImage: cProblemSolverApp.cImageDelete,
      upImage: cProblemSolverApp.cImageUp,
      downImage: cProblemSolverApp.cImageDown,
      futureAxisImage: cProblemSolverApp.cFutureAxis,
      optionsAxisImage: cProblemSolverApp.cOptionsAxis,
      expandImage: cProblemSolverApp.cExpand,
      changesImage: cProblemSolverApp.cImageChanges,
      evaluateImage: cProblemSolverApp.cImageEvaluate
    });
    var lMultiverseTab = this.panelTabMenu.getPanelById('multiverse');
    lMultiverseTab.panels.push(this.viewMultiversePanel);
    lMultiverseTab.onVisible = this.viewMultiversePanel.onVisible;
    lMultiverseTab.onVisibleCallee = this.viewMultiversePanel;
    lMultiverseTab.onInvisible = this.viewMultiversePanel.onInvisible;
    lMultiverseTab.onInvisibleCallee = this.viewMultiversePanel;

    /*
    // System
    
    this.panelTabMenu_System = new cPanel({
      align: eAlign.eClient,
      backgroundColor: 'transparent',
      innerHTML: 'system'
    });
    this.panelTabMenu.getPanelById('system').panels.push(this.panelTabMenu_System);
    */
    
    /*
    // Help
    
    this.viewHelpPanel = new cViewHelpPanel({
      align: eAlign.eClient,
      backgroundColor: 'transparent',
      screen: this.screen
    });
    this.panelTabMenu.getPanelById('help').panels.push(this.viewHelpPanel);
    */
    
    
    this.screen.onResize();
  });
}
// Class inheritance setup:
cProblemSolverApp.deriveFrom(cApp);
// Static class constructor:
(function() {
  cProblemSolverApp.cImageProblemSolver = 1;
  cProblemSolverApp.cImageViewWorldImage = 2;
  cProblemSolverApp.cImageViewChangesImage = 3;
  cProblemSolverApp.cImageViewEvaluateImage = 4;
  cProblemSolverApp.cImageViewMultiverseImage = 5;
  cProblemSolverApp.cImageWorld = 6;
  cProblemSolverApp.cImageChanges = 7;
  cProblemSolverApp.cImageEvaluate = 8;
  cProblemSolverApp.cImageAgent = 9;
  cProblemSolverApp.cImageMultiverse = 10;
  cProblemSolverApp.cImageQuestion = 11;
  cProblemSolverApp.cImageClose = 12;
  cProblemSolverApp.cImageRefresh = 13;
  cProblemSolverApp.cImageAdd = 14;
  cProblemSolverApp.cImageDelete = 15;
  cProblemSolverApp.cImageUp = 16;
  cProblemSolverApp.cImageDown = 17;
  cProblemSolverApp.cFutureAxis = 18;
  cProblemSolverApp.cOptionsAxis = 19;
  cProblemSolverApp.cExpand = 20;
  
  cProblemSolverApp.prototype.resourcesLoaded = false;
  cProblemSolverApp.prototype.actionSandboxIFrame = null;
  cProblemSolverApp.prototype.actionSandboxIFrame_Initialized = false;
  cProblemSolverApp.prototype.evaluationSandboxIFrame = null;
  cProblemSolverApp.prototype.evaluationSandboxIFrame_Initialized = false;
  cProblemSolverApp.prototype.screenPanel = null;
  cProblemSolverApp.prototype.panelTopMenu = null;
  cProblemSolverApp.prototype.panelTopMenuLogo = null;
  cProblemSolverApp.prototype.panelTopMenuFile = null;
  cProblemSolverApp.prototype.panelTopMenuClear = null;
  cProblemSolverApp.prototype.panelTopMenuAbout = null;
  cProblemSolverApp.prototype.panelTopMenuLogoBetaAndCopyright = null;
  cProblemSolverApp.prototype.panelTabMenu = null;

  cProblemSolverApp.prototype.mainPagePanel = null;
  
  cProblemSolverApp.prototype.viewWorldPanel = null;
  cProblemSolverApp.prototype.viewChangesPanel = null;
  cProblemSolverApp.prototype.viewEvaluatePanel = null;
  cProblemSolverApp.prototype.viewMultiversePanel = null;
  //cProblemSolverApp.prototype.viewHelpPanel = null;

  //cProblemSolverApp.prototype.panelTabMenu_System = null;
  
  cProblemSolverApp.prototype.onResize = function() {
  };

  cProblemSolverApp.prototype.onPostResize = function() {
  };

  cProblemSolverApp.prototype.onMouseDown = function() {
    if (this.resourcesLoaded) {
      //this.panelBottom.element.innerHTML = 'x:' + this.screen.mouseX + ', y:' + this.screen.mouseY + ', ' + (this.screen.mouseDown ? 'down' : 'up');
    }
  };
  cProblemSolverApp.prototype.onMouseMove = function() {
    if (this.resourcesLoaded) {
      //this.panelBottom.element.innerHTML = 'x:' + this.screen.mouseX + ', y:' + this.screen.mouseY + ', ' + (this.screen.mouseDown ? 'down' : 'up');
    }
  };
  cProblemSolverApp.prototype.onMouseUp = function() {
    if (this.resourcesLoaded) {
      //this.panelBottom.element.innerHTML = 'x:' + this.screen.mouseX + ', y:' + this.screen.mouseY + ', ' + (this.screen.mouseDown ? 'down' : 'up');
    }
  };
  
  cProblemSolverApp.prototype.updateSandboxInitialized = function() {
    if (this.actionSandboxIFrame_Initialized && this.evaluationSandboxIFrame_Initialized) {
      if (cFilePresets.presets.length > 0) {
        Model.loadFile(cFilePresets.presets[0]); // cFilePresets.presets.length - 1]); // 0
        this.viewWorldPanel.reloadWorld();
        this.viewChangesPanel.reloadWorld();
        this.viewEvaluatePanel.reloadWorld();
      }
    }
  };
    
})();
