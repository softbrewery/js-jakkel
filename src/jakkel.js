
(function(window) {

  'use strict';

  /* 
   * Creat the Jakkel Object
   */
  var Jakkel = function() {
    this._config = {
      roles: [],
      resources: []
    };
  };

  /*
   * Current version.
   */
  Jakkel.prototype.VERSION = '0.0.2';

   /* Function:
    * Flush the config, used for testing. 
    */
   Jakkel.prototype.flush = function() {
     this._config.roles = [];
     this._config.resources = [];
   };

   /* Function:
    * Get roles
    * @return Array
    */
  Jakkel.prototype.roles = function() {
    return this._config.roles;
  };

   /* Function:
    * Get Role
    * @param roleName
    * @return Object
    */
  Jakkel.prototype.role = function(roleName) {
    var result = null;
    this._config.roles.forEach( function( role ) {
      if (role.role === roleName )
        result = role;
    }); 
    return result;
  };
  
  /* Function:
   * Add role
   * @param roleName string
   * @param parent string
   * @return true on success
   */
  Jakkel.prototype.addRole = function(roleName, parent) {
    if ( roleName === null || typeof roleName !== 'string' ||
         roleName.length === 0 || this.role(roleName)) {
      return false;
    }
    var new_role = {};
    new_role.role = roleName;
    if ( parent !== null ) {
      new_role.parent = parent;
    }
    this._config.roles.push(new_role);
    return true;
  };


  //##############################################################
  
  /**
   * Clear the contents of an Array
   */
  /* if (({}).hasOwnPropery.call([],'clear')) { */
  if (!Array.prototype.hasOwnProperty('clear')) {
    Array.prototype.clear = function() {
      while (this.length > 0) {
        this.pop();
      }
    }; 
  };

  //##############################################################

  /*
   * Export Jakkel for node.js and browsers
   */
  if ( typeof module === "object" && module && typeof module.exports === "object" && exports ) {
    module.exports = Jakkel;
  } 
  else if(window) {
    window.Jakkel = Jakkel;
    if ( typeof define === "function" && define.amd ) {
      define( "Jakkel", [], function () { return Jakkel; } );
    }
  }

})(this);
