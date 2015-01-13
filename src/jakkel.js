
(function(window) {

  'use strict';

  /* 
   * Creat the Jakkel Object
   */
  var Jakkel = function( opOptions ) {
    this._config = {
      options: [],
      roles: [],
      resources: []
    };
    this._config.options["strict"] = false;
    this._last_error = "";
    this._log_errors = true;
    this.explanation = "";
    this._explain = true;
    this._default = false;
    this._expand_wildcard_in_isallowed = false;
    if ( opOptions ) {
      if ( opOptions.strict === true ) {
        this._config.options["strict"] = true;
      }
    }
    this._strict = this._config.options["strict"];
  };

  /*
   * Current version.
   */
  Jakkel.prototype._VERSION = '0.0.2';

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
     return this._VERSION;
   };

   Jakkel.prototype._setLastError = function( msg ) {
     if ( this._log_errors )
     {
       if ( typeof msg === 'string' || typeof msg === String )
         this._last_error = msg;
     }
   };
   Jakkel.prototype.getLastError = function() {
     if (this._last_error) {
       return this._last_error;
     } else {
       return "not available";
     }
   };

   Jakkel.prototype.clearLast = function() {
     delete this._last_error; 
     delete this._explanation;
   };

   Jakkel.prototype._setExplanation = function ( msg ) {
     if ( this._explain ) {
       this._explanation = msg;
     }
   };

   Jakkel.prototype.getExplanation = function () {
     if (this._explanation) {
       return this._explanation;
     } else {
       return "no explanation";
     }
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
      this._setLastError("argument type");
      return false;
    }
    if ( this._strict === true && this.resource(roleName) !== null ) {
      this._setLastError("strict disallows shared names");
      return false;
    }  
    if ( parent !== null && parent === roleName ) {
      //barring accidents with contraceptives and time-machines
      this._setLastError("role can not be own parent"); 
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
        var msg = "argument type or reuse ";
        if ( resourceName === null ) {
          msg = msg + " resourceName === null";
        } else if ( typeof resourceName !== 'string' ) {
          msg = msg + "typeof resourceName !== 'string'";
        } else if ( typeof resourceName.length === 0 ) {
          msg = msg + "resourceName.length === 0";
        } else if ( this.resource(resourceName) ) {
          msg = msg + "this.resource(" + resourceName + ") returned" + 
                                            this.resource( resourceName );
        } else {
          msg = msg + "unexpected failure";
        }
        this._setLastError( msg );
        return false;
      }
      if ( this._strict === true && this.role(resourceName) !== null ) {
        this._setLastError("strict disallows shared names");
        return false;
      }  
      if ( arguments.length > 1 ) {
        if ( ! ( opActions.constructor === Array ||
                 opActions.constructor === String ) ) {
          this._setLastError("opActions argument type");
          return false; 
        }
        if ( ( opActions.constructor === Array ) && opActions.length === 0 ) {
          this._setLastError("opActions zero length");
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
          return false;
        }
      }

      var new_resource = {};
      new_resource.name = resourceName;
      new_resource.actions = []; 
      actions_to_add.forEach( function( action_name ) {
        var new_action = { action: action_name, allow: [], deny: [] };
        new_resource.actions.push(new_action);
      });

      this._config.resources.push(new_resource);
      return true;
  };
  /* Function:
   * _findAction 
   * @param resource_rec, resource object as return by resource function
   *        action_name, name of action we're interested in
   * @return action record - { name: allow: [], deny [] }
   */
  Jakkel.prototype._findAction = function( resource_rec, action_name ) {
    if ( resource_rec.constructor === Array || 
         action_name.constructor === Array ) {
      return null;
    }
    if ( !(typeof resource_rec === Object || 
            typeof resource_rec === 'object') ) {
      return null;
    }
    if ( !(typeof action_name !== 'string' || 
          typeof action_name !== String) ) {
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
      this._setLastError("bad paramater to internal function");
      return null;
    }
    var actions_names = [];
    resource_rec.actions.forEach( function ( action ) {
      actions_names.push( action.action );
    });
    return actions_names;
  };

  /* Function:
   * _opActionsForAllowDeny
   * @param opActions
   * @return array 
   */
  Jakkel.prototype._opActionsForAllowDeny = function( opActions ) {
    var actions = [];
    if ( !opActions ) {
      actions = [ "*" ];
    } else if ( typeof opActions === 'string' || 
                typeof opActions === String ) {
      actions.push( opActions );
    } else if ( opActions.constructor === Array ) {
      actions = opActions;
    } else { /* unexpect type for opActions */
      this._setLastError("unexpected type for optional argument");
      return null;
    }
    return actions;
  };

  /* Function:
   * _updateAction
   * @param access_type - string
   * @param roleName role which is going to be updated 
   * @param resourceName name of resource to which has role
   * @param opActions - actions for resource which role is to be allowed
   *                    can be ommitted for 'all', a string for a single
   *                    action, or an array for multiple actions.
   * @return true on success
   */
  Jakkel.prototype._updateAction = function( accessType, roleName, 
                                             resourceName, opActions) {
    var actions_to_update = [];
    var found_role = this.role(roleName);
    var found_resource = this.resource(resourceName);
    if ( accessType !== "allow" && accessType !== "deny" ) {
      this._setLastError("unexpected accessType:", accessType );
      return false;
    }
    if ( found_role === null || found_resource === null) {
      var msg = "";
      if ( found_role === null && found_resource !== null) {
        msg = "unknown role " + roleName;
      } else if ( found_role !== null && found_resource === null) {
        msg = "unknown resource " + resourceName;
      } else {
        msg = "unknown role/resource";
      }
      msg = msg + " during " + accessType;
      this._setLastError(msg);
      return false;
    }
    actions_to_update = this._opActionsForAllowDeny( opActions );
    if (actions_to_update === null) {
      return false;
    }

    if ( typeof this._strict === 'boolean' && this._strict === true ) {
      if ( actions_to_update.contains("*") && 
           !this._getActionsNames( found_resource ).contains("*") ) {
        this._setLastError("tried to use * for resource without *");
        return false;
      }
    } 
    if ( !this._strict ) {
      if ( actions_to_update.contains("*") ) {
        actions_to_update = this._getActionsNames( found_resource );
      }
    }

    var _this = this; /* make this available as _this in the foreach scope */
    actions_to_update.forEach( function( to_update ) {
      var found_action = _this._findAction( found_resource, to_update );
      if ( found_action ) {
          found_action[accessType].push(found_role.name);
      }
    });
    return true;
  };


  /* Function:
   * allow
   * @param roleName role which is going to be allowed access to resource 
   * @param resourceName name of resource to which role with be allowed
   * @param opActions - actions for resource which role is to be allowed
   *                    can be ommitted for 'all', a string for a single
   *                    action, or an array for multiple actions.
   * @return true on success
   */
  Jakkel.prototype.allow = function(roleName, resourceName, opActions) {
    return this._updateAction( "allow", roleName, resourceName, opActions);
  };


  /* Function:
   * deny 
   * @param roleName role which is going to be denied access to resource 
   * @param resourceName name of resource to which role with be denied
   * @param opActions - actions for resource which role is to be denied
   *                    can be ommitted for 'all', a string for a single
   *                    action, or an array for multiple actions.
   * @return true on success
   */
  Jakkel.prototype.deny = function(roleName, resourceName, opActions) {
    return this._updateAction( "deny", roleName, resourceName, opActions);
  };

  /* Function:
   * convienience function, does an action have allow or deny for a role
   * @param action - the action we're checking
   * @param allowOrDeny - string, what we're checking for
   * @param roleName - role which we're checking the allow or deny list for
   * @return true if action has an allow xor deny for given role.
   */
  Jakkel.prototype._actionHas = function( action, allowOrDeny, roleName ) {
    return action[allowOrDeny].contains(roleName);
  };

  /* Function:
   * _isAllowed private implementation - no parameter checking - recurses.
   * @param role - a role object
   *        resource - a resource object
   *        actions - array of actions to check
   * @return "deny", "allow", "default"
   */
  Jakkel.prototype._isAllowed = function( role, resource, actions ) {
    var result="default";
    var actions_to_check = null;
    var wild_card = false;

    if ( this._expand_wildcard_in_isallowed && actions.contains("*") ) {
      wild_card = true;
      actions_to_check = this._getActionsNames(resource);
    } else { 
      actions_to_check = actions;
    }
    var _this = this;
    if (wild_card) {
      /* if we have not expanded a wild card then allow is overriden by
       * deny, so check allow first */
      var first_check="deny";
      var second_check="allow";
    } else { 
      var first_check="allow";
      var second_check="deny";
    }
    resource.actions.forEach( function( action ) {
      if ( actions_to_check.contains( action.action )) {
        if ( _this._actionHas(action, first_check, role.name )) {
          result = first_check;
        }
        if ( _this._actionHas(action, second_check, role.name )) {
          result = second_check;
        }
        _this._setExplanation( result + " " + role.name + 
                              " for action " + action.action );
      }
    });    
    while ( result === "default" && role.parent ) {
      var parent_role = this.role(role.parent);
      result = this._isAllowed( parent_role, resource, actions );
    }
    return result;
  };


  /* Function:
   * isAllowed
   * @param roleName
   *        resourceName
   *        actions
   * @return true (allowed) or false (denied)
   */
  Jakkel.prototype.isAllowed = function( roleNames, resourceName, opActions ) {
    var result;
    var ret_val;
    var actions = [];
    var roles = null;
    var found_role = null;
    var found_resource = this.resource(resourceName);
    if ( found_resource === null ) {
      this._setLastError("unknown resource");
      return false;
    }
    if (roleNames.constructor === Array && roleNames.length < 1 ) { 
      this._setLastError("isAllowed - no roles specified");
      return false;
    }
    if ( typeof roleNames === String || typeof roleNames === 'string') {
      roles = [ roleNames ];
    } else {
      roles = roleNames;
    }
    
    actions = this._opActionsForAllowDeny( opActions );
    if (actions.length === 0) {
      this._setLastError("isAllowed - zero length actions - return false");
      return false;
    }     
    /* each role can have different parentage so do each in turn */
    var _this = this; /* make this available as _this for forEach */
    roles.forEach( function( roleName ) {
      found_role = _this.role( roleName );
      ret_val = _this._isAllowed( found_role, found_resource, actions);
      if ( ret_val === "allow" ) {
        result = true;
      } else if ( ret_val === "deny" ) {
        result = false;
      } else if ( ret_val === "default" && 
                  typeof _this._default === 'boolean' ) {
        _this._setExplanation("isAllowed found nothing for " + roleName + 
          " access to " + actions + " on " + found_resource.name + 
          " and used default " + _this._default );
        result = _this._default;
      } else {
        result = false;
      }  
    });
    return result; 
  }; 

  /* Function:
   * ifAllowed - like is allowed, but calls functions...
   * @param roleName
   * @param resourceName
   * @param actions
   * @param allowedFunction
   * @param deniedFunction
   * @return 
   */

  //##############################################################
  Jakkel.prototype.ifAllowed = function( roleNames, resourceName, 
                       opActions, allowedFunction, opDeniedFunction ) { 
    var actual_function = null;
    var actual_opActions = null;
    var actual_denied = null;
    var allowed_result = null;
    if ( arguments.length === 3 ) {
      actual_function = opActions;
    } else if ( arguments.length === 4 ) {     
      /* with four arguments we have one of two possibilities */
      /* roleName, resourceName, allowedFunction, deniedFunction */
      if ( typeof opActions === 'function' ) {
        actual_function = opActions;
        actual_denied = allowedFunction;
      } else if ( opActions.constructor === 'Array' || 
                  typeof opActions === String ||
                  typeof opActions === 'string' ) {
      /* roleName, resourceName, actions allowedFunction */
        actual_opActions = opActions;
        actual_function = allowedFunction;
      }
    } else if ( arguments.length === 5 ) {
        actual_opActions = opActions;
        actual_function = allowedFunction;
        actual_denied = opDeniedFunction;
    } else {
      return;
    }
    /* always call so that developer can see explanation even if we 
     * don't have a meaningful function to call 
     */
    allowed_result = 
          this.isAllowed( roleNames, resourceName, actual_opActions); 
    if (typeof actual_function === 'function' ) {
      if ( allowed_result ) {
        return actual_function();
      } else {
        if ( typeof actual_denied === 'function' ) {
          return actual_denied();
        }
      }
    }
  };

  /* Function:
   * Generate JSON description of present config
   * @return JSON stringification of present config
   */
  Jakkel.prototype.config = function() {
    return JSON.stringify( this._config, null, 4 );
  };

  /* Function:
   * Import a JSON string as new config
   * @param
   * @return 
   */
  Jakkel.prototype.setConfig = function( newConfig ) {
    var success = true;
    try {
      var that = JSON.parse( newConfig );
      if ( that.options !== undefined && 
           that.roles !== undefined && that.resources !== undefined ) {
        this.options = that.options;
        this.roles = that.roles;
        this.resources = that.resources;
      }
      else
      {
        if (!that.options) {
          throw "options missing";
        }
        if (!that.roles) {
          throw "roles missing";
        }
        if (!that.resources) {
          throw "resources missing";
        }
      }
    }
    catch(err) {
      success = false
    }
    return success;
  }; 
  /**
   * Clear the contents of an Array
   */
  if (!Array.prototype.hasOwnProperty('clear')) {
    Array.prototype.clear = function() {
      while (this.length > 0) {
        this.pop();
      }
    }; 
  }
  if (!Array.prototype.hasOwnProperty('contains')) {
    Array.prototype.contains = function( to_find ) {
      if ( this.indexOf(to_find ) > -1 ) {
        return true;
      } else {
        return false;
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

})(this);
