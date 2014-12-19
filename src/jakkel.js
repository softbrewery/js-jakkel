
(function(window) {

  'use strict';

  /* 
   * Creat the Jakkel Object
   */
  var Jakkel = function( opOptions ) {
    this._strict = false;
    this._last_error = "";
    this._log_errors = true;
    if ( opOptions ) {
      if ( opOptions.strict === true ) {
        this.strict = true;
      }
    }
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
    * version
    * @return version string
    */
   Jakkel.prototype.version = function() {
     return this.VERSION;
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
      this._last_error = "argument type";
      return false;
    }
    if ( this._strict === true && resource(roleName) !== null ) {
      this._last_error = "strict disallows shared names";
      return false;
    }  
    if ( parent !== null && parent === roleName ) {
      this._last_error = "role can not be own parent";
      return false; 
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
        this._last_error = "argument type or reuse";
        return false;
      }
      if ( this.strict === true && role(resourceName) !== null ) {
        this._last_error = "strict disallows shared names";
        return false;
      }  
      if ( arguments.length > 1 ) {
        if ( ! ( opActions.constructor === Array ||
                 opActions.constructor === String ) ) {
          this._last_error = "opActions argument type";
          return false; 
        }
        if ( ( opActions.constructor === Array ) && opActions.length === 0 ) {
          this._last_error = "opActions zero length";
          return false; /* array should contain something */
        }
      }

      var actions_to_add = [];
      if ( !opActions ) {
        actions_to_add.push( "*" );
      } else { 
        if ( typeof opActions === String || typeof opActions === 'string' ) {
          actions_to_add.push( opActions );
        } else if ( opActions.constructor === Array ) {
          actions_to_add = opActions;
        } else { 
          //console.log("bailing - not an array", typeof opActions);
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
  /* Function:
   * <desc>
   * @param
   * @return 
   */
  Jakkel.prototype._findAction = function( resource_rec, action_name ) {
    if ( !(typeof resource_rec === Object || 
            typeof resource_rec === 'object') ) {
      //console.log("unexpected type, res is ", typeof resource_rec );
      return null;
    }
    /*
    else { 
      console.log(JSON.stringify(resource_rec));
    } */
    if ( !(typeof action_name !== 'string' || 
          typeof action_name !== String) ) {
      //console.log("unexpected type, action_name is", typeof action_name );
      return null;
    }

    var found_action = null;
    resource_rec.actions.forEach( function ( action ) {
      if (action.action === action_name) {
        found_action = action;
      }
    });
    return found_action;
  };
/* Function:
 * _getActionNames
 * @param resource record
 * @return Array of action names
 */
  Jakkel.prototype._getActionsNames = function( resource_rec ) {
    if ( !(typeof resource_rec === Object || 
            typeof resource_rec === 'object') ) {
      this._last_error = "bad paramater to internal function";
      return null;
    }
    var actions_names = [];
    resource_rec.actions.forEach( function ( action ) {
      actions_names.push( action.action );
    });
    return actions_names;
  };

  /* Function:
   * allow
   * @param roleName role which is going to be allowed access to resource 
   * @param resourceName name of resource to which role with be allowed
   * @param opActions - actions for resource which role is to be allowed
   *                    can be ommitted for 'all', a string for a single
   *                    action, or an array for multiple actions.
   * @return 
   */
  Jakkel.prototype.allow = function(roleName, resourceName, opActions) {
    var actions_to_allow = [];
    var found_role = this.role(roleName);
    var found_resource = this.resource(resourceName);
    if ( ( found_role === null || found_resource === null) ) {
      this._last_error = "unknown role/resource";
      return false;
    }
    if ( !opActions ) {
      actions_to_allow = [ "*" ];
    } else if ( typeof opActions === 'string' || 
                typeof opActions === String ) {
      actions_to_allow.push( opActions );
    } else if ( opActions.constructor === Array ) {
      actions_to_allow = opActions;
    } else { /* unexpect type for opActions */
      this._last_error = "unexpected type for optional argument";
      return false;
    }
    var current_resource_actions = this._getActionsNames( found_resource );
    if ( this._strict === true ) {
      if ( actions_to_allow === ["*"] && 
           !current_resource_actions.contains("*") ) {
        this._last_error = "tried to use * for resource without *";
        console.log(this._last_error);
        return false;
      }
    } else {
      if ( actions_to_allow === [ "*" ] ) {
        actions_to_allow = current_resource_actions;
      }
    }

    var found_action = null; 
    var _this = this; /* make this available as _this in the foreach scope */
    actions_to_allow.forEach( function( new_allowed ) {
      found_action = _this._findAction( found_resource, new_allowed );
      if ( found_action ) {
        if ( !found_action.allow ) {
          found_action.allow = [ found_role.name ];
        } else { 
          found_action.allow.push(found_role.name);
        }
      }
    });
    return true;
  };


  /* Function:
   * deny 
   * @param roleName role which is going to be denied access to resource 
   * @param resourceName name of resource to which role with be denied
   * @param opActions - actions for resource which role is to be denied
   *                    can be ommitted for 'all', a string for a single
   *                    action, or an array for multiple actions.
   * @return 
   */
  Jakkel.prototype.deny = function(roleName, resourceName, opActions) {
    var actions_to_deny = [];
    var found_role = this.role(roleName);
    var found_resource = this.resource(resourceName);
    if ( ( found_role === null || found_resource === null) ) {
      //console.log("couldn' find role or resource");
      this._last_error = "unknown role/resource";
      return false;
    }
    if ( !opActions ) {
      actions_to_deny = [ "*" ];
    } else if ( typeof opActions === 'string' || 
                typeof opActions === String ) {
      actions_to_deny.push( opAction );
    } else if ( opActions.constructor === Array ) {
      //console.log("its an Array , going to use it");
      actions_to_deny = opActions;
    } else { /* unexpect type for opActions */
      this._last_error = "unexpected type for optional argument";
      return false;
    }
    var current_resource_actions = this._getResourceActions( found_resource );
    if ( this._strict === true ) {
      if ( actions_to_deny === ["*"] && 
           !current_resource_actions.contains("*") ) {
        this._last_error = "tried to use * for resource without *";
        return false;
      }
    } else {
      if ( actions_to_deny === [ "*" ] ) {
        actions_to_deny = current_resource_actions;
      }
    }

    var found_action = null; 
    var _this = this; /* make this available as _this in the foreach scope */
    actions_to_allow.forEach( function( new_allowed ) {
      found_action = _this._findAction( found_resource, new_allowed );
      if ( found_action ) {
        if ( !found_action.deny ) {
          found_action.deny = [ found_role.name ];
        } else { 
          found_action.deny.push(found_role.name);
        }
      }
    });
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
  if (!Array.prototype.hasOwnProperty('contains')) {
    Array.prototype.contains = function( to_find ) {
      var i;
      for ( i = 0; i < this.length; i += 1 ) {
        if ( this[i] === to_find ) {
          return true;
        }
      }
      return false;
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

})(this);
