/**
 * @author qiao / https://github.com/qiao
 * @author mrdoob / http://mrdoob.com
 * @author alteredq / http://alteredqualia.com/
 * @author WestLangley / http://github.com/WestLangley
 */

THREE.navigateControl = function ( object, domElement, center ) {

  this.object = object;
  this.domElement = ( domElement !== undefined ) ? domElement : document;
  if (this.domElement !== document) {
    this.domElement.focus();
  }
  // API

  this.enabled = true;

  this.center = center ? center : new THREE.Vector3();

  this.userZoom = true;
  this.userZoomSpeed = 2.0;

  this.userRotate = true;
  this.userRotateSpeed = 1.0;

  this.userPan = true;
  this.userPanSpeed = 100.0;

  this.autoRotate = false;
  this.autoRotateSpeed = 2.0; // 30 seconds per round when fps is 60

  this.minPolarAngle = 0; // radians
  this.maxPolarAngle = Math.PI; // radians

  this.minDistance = 0;
  this.maxDistance = Infinity;

  this.keys = { LEFT: 37, UP: 38, RIGHT: 39, BOTTOM: 40 };

  // internals

  var scope = this;

  var EPS = 0.000001;
  var PIXELS_PER_ROUND = 1800;

  var rotateStart = new THREE.Vector2();
  var rotateEnd = new THREE.Vector2();
  var rotateDelta = new THREE.Vector2();

  var zoomStart = new THREE.Vector2();
  var zoomEnd = new THREE.Vector2();
  var zoomDelta = new THREE.Vector2();

  var phiDelta = 0;
  var thetaDelta = 0;
  var scale = 1;

  var lastPosition = new THREE.Vector3();

  var STATE = { NONE: -1, ROTATE: 0, ZOOM: 1, PAN: 2 };
  var state = STATE.NONE;
  
  var moveForward = false;
  var moveBackward = false;
  var turnLeft = false;
  var turnRight = false;
  var moveUp = false;
  var moveDown = false;
  var moveLeft = false;
  var moveRight = false;

  // events

  var changeEvent = { type: 'change' };


  this.rotateLeft = function ( angle ) {

    if ( angle === undefined ) {

      angle = getAutoRotationAngle();

    }

    thetaDelta -= angle;

  };

  this.rotateRight = function ( angle ) {

    if ( angle === undefined ) {

      angle = getAutoRotationAngle();

    }

    thetaDelta += angle;

  };

  this.rotateUp = function ( angle ) {

    if ( angle === undefined ) {

      angle = getAutoRotationAngle();

    }

    phiDelta -= angle;

  };

  this.rotateDown = function ( angle ) {

    if ( angle === undefined ) {

      angle = getAutoRotationAngle();

    }

    phiDelta += angle;

  };

  this.zoomIn = function ( zoomScale ) {

    if ( zoomScale === undefined ) {

      zoomScale = getZoomScale();

    }

    scale /= zoomScale;

  };

  this.zoomOut = function ( zoomScale ) {

    if ( zoomScale === undefined ) {

      zoomScale = getZoomScale();

    }

    scale *= zoomScale;

  };

  this.pan = function ( distance ) {

    distance.transformDirection( this.object.matrix );
    distance.multiplyScalar( scope.userPanSpeed );

    this.object.position.add( distance );
    this.center.add( distance );

  };

  this.update = function () {

    if (moveForward ) {
      var vec = new THREE.Vector3((this.center.x - this.object.position.x), 0, (this.center.z - this.object.position.z));
      vec.normalize();
      vec.multiplyScalar(200);
      this.object.position.add(vec);
      this.center.add(vec);
    }
    if (moveBackward ) {
      var vec = new THREE.Vector3((this.center.x - this.object.position.x), 0, (this.center.z - this.object.position.z));
      vec.normalize();
      vec.multiplyScalar(-200);
      this.object.position.add(vec);
      this.center.add(vec);
    }
    if (turnLeft ) {
      this.rotateRight(Math.PI / 80);
    }
    if (turnRight ) {
      this.rotateLeft(Math.PI / 80);
    }
    if (moveUp) {
      var vec = new THREE.Vector3(0, 100, 0);
      this.object.position.add(vec);
      this.center.add(vec);
    }
    if (moveDown) {
      var vec = new THREE.Vector3(0, -100, 0);
      this.object.position.add(vec);
      this.center.add(vec);
    }
    if (moveLeft) {
      this.pan(new THREE.Vector3(-100, 0, 0));
    }
    if (moveRight) {
      this.pan(new THREE.Vector3(100, 0, 0));
    }

    var position = this.object.position;
    var offset = position.clone().sub( this.center );

    // angle from z-axis around y-axis

    var theta = Math.atan2( offset.x, offset.z );

    // angle from y-axis

    var phi = Math.atan2( Math.sqrt( offset.x * offset.x + offset.z * offset.z ), offset.y );

    if ( this.autoRotate ) {

      this.rotateLeft( getAutoRotationAngle() );

    }

    theta += thetaDelta;
    phi += phiDelta;

    // restrict phi to be between desired limits
    phi = Math.max( this.minPolarAngle, Math.min( this.maxPolarAngle, phi ) );

    // restrict phi to be betwee EPS and PI-EPS
    phi = Math.max( EPS, Math.min( Math.PI - EPS, phi ) );

    var radius = offset.length() * scale;

    // restrict radius to be between desired limits
    radius = Math.max( this.minDistance, Math.min( this.maxDistance, radius ) );

    offset.x = radius * Math.sin( phi ) * Math.sin( theta );
    offset.y = radius * Math.cos( phi );
    offset.z = radius * Math.sin( phi ) * Math.cos( theta );

    position.copy( this.center ).add( offset );

    this.object.lookAt( this.center );

    thetaDelta = 0;
    phiDelta = 0;
    scale = 1;

    if ( lastPosition.distanceTo( this.object.position ) > 0 ) {

      this.dispatchEvent( changeEvent );

      lastPosition.copy( this.object.position );

    }

  };


  function getAutoRotationAngle() {

    return 2 * Math.PI / 60 / 60 * scope.autoRotateSpeed;

  }

  function getZoomScale() {

    return Math.pow( 0.95, scope.userZoomSpeed );

  }

  function onMouseDown( event ) {

    if ( scope.enabled === false ) return;
    if ( scope.userRotate === false ) return;

    event.preventDefault();

    if ( event.button === 0 ) {

      state = STATE.ROTATE;

      rotateStart.set( event.clientX, event.clientY );

    } else if ( event.button === 1 ) {

      state = STATE.ZOOM;

      zoomStart.set( event.clientX, event.clientY );

    } else if ( event.button === 2 ) {

      state = STATE.PAN;

    }

    document.addEventListener( 'mousemove', onMouseMove, false );
    document.addEventListener( 'mouseup', onMouseUp, false );

  }

  function onMouseMove( event ) {

    if ( scope.enabled === false ) return;

    event.preventDefault();

    if ( state === STATE.ROTATE ) {

      rotateEnd.set( event.clientX, event.clientY );
      rotateDelta.subVectors( rotateEnd, rotateStart );

      scope.rotateLeft( 2 * Math.PI * rotateDelta.x / PIXELS_PER_ROUND * scope.userRotateSpeed );
      scope.rotateUp( 2 * Math.PI * rotateDelta.y / PIXELS_PER_ROUND * scope.userRotateSpeed );

      rotateStart.copy( rotateEnd );

    } else if ( state === STATE.ZOOM ) {

      zoomEnd.set( event.clientX, event.clientY );
      zoomDelta.subVectors( zoomEnd, zoomStart );

      if ( zoomDelta.y > 0 ) {

        scope.zoomIn();

      } else {

        scope.zoomOut();

      }

      zoomStart.copy( zoomEnd );

    } else if ( state === STATE.PAN ) {

      var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
      var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

      scope.pan( new THREE.Vector3( - movementX, movementY, 0 ) );

    }

  }

  function onMouseUp( event ) {

    if ( scope.enabled === false ) return;
    if ( scope.userRotate === false ) return;

    document.removeEventListener( 'mousemove', onMouseMove, false );
    document.removeEventListener( 'mouseup', onMouseUp, false );

    state = STATE.NONE;

  }

  function onMouseWheel( event ) {

    if ( scope.enabled === false ) return;
    if ( scope.userZoom === false ) return;

    var delta = 0;

    if ( event.wheelDelta ) { // WebKit / Opera / Explorer 9

      delta = event.wheelDelta;

    } else if ( event.detail ) { // Firefox

      delta = - event.detail;

    }

    if ( delta > 0 ) {

      scope.zoomOut();

    } else {

      scope.zoomIn();

    }

  }

  function onKeyDown( event ) {

    if ( scope.enabled === false ) return;
    if ( scope.userPan === false ) return;

    switch ( event.keyCode ) {
      case 38: /*up*/
      case 87: /*W*/ moveForward = true; break;
      case 37: /*left*/
      case 65: /*A*/ turnLeft = true; break;
      case 40: /*down*/
      case 83: /*S*/ moveBackward = true; break;
      case 39: /*right*/
      case 68: /*D*/ turnRight = true; break;
      case 82: /*R*/ moveUp = true; break;
      case 70: /*F*/ moveDown = true; break;
      case 90: /*Z*/ moveLeft = true; break;
      case 88: /*X*/ moveRight = true; break;
    }
  }
  function onKeyUp( event ) {
    switch ( event.keyCode ) {
      case 38: /*up*/
      case 87: /*W*/ moveForward = false; break;
      case 37: /*left*/
      case 65: /*A*/ turnLeft = false; break;
      case 40: /*down*/
      case 83: /*S*/ moveBackward = false; break;
      case 39: /*right*/
      case 68: /*D*/ turnRight = false; break;
      case 82: /*R*/ moveUp = false; break;
      case 70: /*F*/ moveDown = false; break;
      case 90: /*Z*/ moveLeft = false; break;
      case 88: /*X*/ moveRight = false; break;
    }
  }
  this.domElement.addEventListener( 'contextmenu', function ( event ) { event.preventDefault(); }, false );
  this.domElement.addEventListener( 'mousedown', onMouseDown, false );
  this.domElement.addEventListener( 'mousewheel', onMouseWheel, false );
  this.domElement.addEventListener( 'DOMMouseScroll', onMouseWheel, false ); // firefox
  window.addEventListener( 'keydown', onKeyDown, false );
  window.addEventListener( 'keyup', onKeyUp, false );

};

THREE.navigateControl.prototype = Object.create( THREE.EventDispatcher.prototype );
