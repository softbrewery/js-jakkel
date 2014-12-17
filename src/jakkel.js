
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
   * Get resources
   * @return Array
   */
  Jakkel.prototype.resources = function () {
    return this._config.resources;
  };

   /* Function:
    * Get Role
    * @param roleName
    * @return Object
    */
  Jakkel.prototype.role = function(roleName) {
    var result = null;
    this._config.roles.forEach( function( role ) {
      if (role.name === roleName )
        result = role;
    }); 
    return result;
  };

  /* Function:
   * Get resource
   * @param resourceName
   * @return Object
   */
  Jakkel.prototype.resource = function(resourceName) {
    var result = null;
    this._config.resources.forEach( function( resource ) {
      if ( resource.name === resourceName )
        result = resource;
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
         roleName.length === 0 || this.role(roleName) ) {
      return false;
    }
    if ( parent !== null && parent === roleName ) {
      return false; /* can't be your own parent */
    }

    var new_role = {};
    new_role.name = roleName;
    if ( parent !== null ) {
      new_role.parent = parent;
    }
    this._config.roles.push(new_role);
    return true;
  };

  /* Function:
   * Add a resource
   * @param resourceName
   * @return true on success 
   */
  Jakkel.prototype.addResource = function(resourceName, opActions) {
      if ( resourceName === null || typeof resourceName !== 'string' ||
           resourceName.length === 0 || this.resource(resourceName) ) {
            //console.log("bailing resourceName parameter error");
            return false;
      }
      if ( arguments.length > 1 ) {
        if ( ! ( opActions.constructor === Array ||
                 opActions.constructor === String ) ) {
          //console.log("opAction unacceptable type (" + typeof opAction +")");
          return false; 
        }
        if ( ( opActions.constructor === Array ) && opActions.length === 0 ) {
          //console.log("opAction.length:" + opActions.length);
          return false; /* array should contain something */
        }
      }

      var actions_to_add = [];
      //console.log("typeof opActions", typeof opActions);
      if ( !opActions ) {
        //console.log("setting default array");
        actions_to_add.push( "*" );
      } else { 
        if ( typeof opActions === String || typeof opActions === 'string' ) {
          actions_to_add.push( opActions );
        } else if ( opActions.constructor === Array ) {
          actions_to_add = opActions;
        } else { 
          console.log("bailing - not an array", typeof opActions);
          return false;
        }
      }

      var new_resource = {};
      new_resource.name = resourceName;
      new_resource.actions = []; 
      actions_to_add.forEach( function( action_name ) {
        var new_action = { action: action_name };
        new_resource.actions.push(new_action);
      });

      this._config.resources.push(new_resource);
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
  }

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

})(this)
