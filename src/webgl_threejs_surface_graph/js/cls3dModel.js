
// Tim Samshuijzen 2013

/**
 *  Class cls3dModel
 */
var cls3dModel = (function()
{
  /**
   *  Constructor
   *  @param String aContainerId Id of the container to append renderer to.
   */
  function cls3dModel(aScene, aWireframe)
  {
    /**
     *  Initialize "private" member variables
     */
    this.scene = aScene;
    this.wireframe = (aWireframe ? true : false);
    this.codeError = false;
    this.codeErrorMessage = '';
    
    var defaultGraphColor = this.wireframe ? 0x00ff00 : 0x009999;
    //this.defaultGraphColorText = this.wireframe ? "0x00ff00" : "0x009999";
    this.defaultGraphColorText = this.wireframe ? "{ r: 0, g: 1.0, b: 0 }" : "{ r: 0, g: 0.6, b: 0.6 }";
    

    
    //var graphMaterial = new THREE.MeshLambertMaterial( {
    var graphMaterial = new THREE.MeshPhongMaterial( {
      //color: defaultGraphColor,
      vertexColors: THREE.VertexColors, // THREE.FaceColors, (use this to enable color calculation)
      side: THREE.DoubleSide,
      shininess: 4,
      shading: THREE.FlatShading,
      wireframe: this.wireframe
      //transparent: (this.wireframe ? false : true),
      //opacity: (this.wireframe ? 1.0 : 1.0)
    } );

    this.graphMeshScale = 100;
    this.graphMeshMaxX = 100;
    this.graphMeshMaxZ = 100;
    this.graphMeshMaxXHalf = this.graphMeshMaxX / 2;
    this.graphMeshMaxZHalf = this.graphMeshMaxZ / 2;


    var graphGeometry = new THREE.Geometry();

    for (var lz = 0; lz < this.graphMeshMaxZ; lz++)
    {
      for (var lx = 0; lx < this.graphMeshMaxX; lx++)
      {
        graphGeometry.vertices.push( new THREE.Vector3( lx * this.graphMeshScale, 0, lz * this.graphMeshScale ) );
      }
    }
    
    var color;
    for (var lz = 1; lz < this.graphMeshMaxZ; lz++)
    {
      for (var lx = 1; lx < this.graphMeshMaxX; lx++)
      {
        var face = new THREE.Face3(
          (lx - 1) + ((lz - 1) * this.graphMeshMaxX), 
          lx + ((lz - 1) * this.graphMeshMaxX), 
          lx + (lz * this.graphMeshMaxX)
        );
        graphGeometry.faces.push( face );
        face.vertexColors[0] = new THREE.Color(defaultGraphColor);
        face.vertexColors[1] = new THREE.Color(defaultGraphColor);
        face.vertexColors[2] = new THREE.Color(defaultGraphColor);
      }
    }
    for (var lz = 1; lz < this.graphMeshMaxZ; lz++)
    {
      for (var lx = 1; lx < this.graphMeshMaxX; lx++)
      {
        var face = new THREE.Face3(
          (lx - 1) + ((lz - 1) * this.graphMeshMaxX), 
          lx + (lz * this.graphMeshMaxX),
          (lx - 1) + (lz * this.graphMeshMaxX) 
        );
        graphGeometry.faces.push( face );
        face.vertexColors[0] = new THREE.Color(defaultGraphColor);
        face.vertexColors[1] = new THREE.Color(defaultGraphColor);
        face.vertexColors[2] = new THREE.Color(defaultGraphColor);
      }
    }
    
    graphGeometry.computeBoundingSphere();
    graphGeometry.computeFaceNormals();
    graphGeometry.computeVertexNormals();
    
    //this.graphMesh = new THREE.Mesh(graphGeometry, new THREE.MeshPhongMaterial({ color: 0xccccaa, side: THREE.DoubleSide, shininess: 60, shading: THREE.FlatShading }));
    this.graphMesh = new THREE.Mesh( graphGeometry, graphMaterial );
    this.graphMesh.position.set(0, 0, 0);
    
    this.graphMesh.dynamic = true;
    this.graphMesh.needsUpdate = true;

    this.scene.add( this.graphMesh );

    this.onCodeError = null;
    
    /*
    other formula:
    z = Math.sin(TimeSeconds + (x / 8)) * Math.cos(TimeSeconds + (y / 8)) * 8;
    */
    this.formula = 
      'var distance = Math.sqrt(((x - 50) * (x - 50)) + ((y - 50) * (y - 50)));\n' +
      'z = (3.5 * Math.sin(((TimeSeconds * 0.5) - (distance * 0.09)) * Math.PI));\n' +
      '// color.r = ((z + 3.5) / 10.0);\n';
      //'color = ' + this.defaultGraphColorText + ';\n';

    this.getY = null;
    this.setGetY(this.formula);
  }

  /**
   *  Semi private member variables
   */
  cls3dModel.prototype.scene = null;
  cls3dModel.prototype.graphMesh = null;
  cls3dModel.prototype.graphMeshScale = 100;
  cls3dModel.prototype.graphMeshMaxX = 100;
  cls3dModel.prototype.graphMeshMaxZ = 100;
  cls3dModel.prototype.graphMeshMaxXHalf = 50;
  cls3dModel.prototype.graphMeshMaxZHalf = 50;
  cls3dModel.prototype.wireframe = false;
  cls3dModel.prototype.formula = '';
  cls3dModel.prototype.getY = null;
  cls3dModel.prototype.codeError = false;
  cls3dModel.prototype.codeErrorMessage = '';
  cls3dModel.prototype.onCodeError = null;
  cls3dModel.prototype.defaultGraphColorText = "{ r: 0, g: 0.6, b: 0.6 }";

  /**
   *  Public methods
   */

  cls3dModel.prototype.render = function(aElapsedTimeSeconds, aDelta)
  {
    if ((this.graphMesh != null) && (this.getY != null))
    {
      if (!this.codeError) {
        var lz, lx, lzx, lyo;
        var gm = this.graphMesh.geometry;
        try {
          for (lz = 0; lz < this.graphMeshMaxZ; lz++)
          {
            lzx = (lz * this.graphMeshMaxX);
            for (lx = 0; lx < this.graphMeshMaxX; lx++)
            {
              lyo = this.getY(lz, lx, aElapsedTimeSeconds);
              gm.vertices[lx + lzx].y = this.graphMeshScale * lyo.y;
              gm.vertices[lx + lzx].__mColor = lyo.c;
            }
          }
          var face;
          for (var fi = 0; fi < gm.faces.length; fi++)
          {
            face = gm.faces[fi];
            face.vertexColors[0].copy(gm.vertices[face.a].__mColor);
            face.vertexColors[1].copy(gm.vertices[face.b].__mColor);
            face.vertexColors[2].copy(gm.vertices[face.c].__mColor);
          }
        }
        catch(err)
        {
          this.codeError = true;
          this.codeErrorMessage = err.message;
          if (this.onCodeError) {
            this.onCodeError.call(this);
          }
        }

        gm.__dirtyNormals = true;
        gm.verticesNeedUpdate = true;
        gm.normalsNeedUpdate = true;
        gm.colorsNeedUpdate = true;
        gm.elementsNeedUpdate = true;
        gm.uvsNeedUpdate = true;
        gm.computeFaceNormals();
        gm.computeVertexNormals();
      }
    }
  };
  
  cls3dModel.prototype.setGetY = function(aScript)
  {
    try {
      // I know there is a discrepancy between the coordinate systems.
      // TODO: refactor the scene into a coherent x-y-z structure between Three.js and our presentation.
      
      var lFunction = new Function('x', 'y', 'TimeSeconds', 
        '    var z = 0;\n' + 
        '    var color = ' + this.defaultGraphColorText + ';\n' + 
        '    ' + aScript + '\n' + 
        '    return { y: z, c: color };\n'
      );
      
      if (typeof lFunction == "function") {
        this.getY = lFunction;
        this.codeError = false;
        this.codeErrorMessage = '';
      }
    }
    catch(err) {
      this.codeError = true;
      this.codeErrorMessage = err.message;
      if (this.onCodeError) {
        this.onCodeError.call(this);
      }
    }  
  };
  
  
  return cls3dModel;
})();
