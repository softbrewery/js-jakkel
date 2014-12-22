
(function(window) {

  'use strict';

  /* 
   * Creat the Jakkel Object
   */
  var Jakkel = function( opOptions ) {
    this._strict = false;
    this._last_error = "";
    this._log_errors = true;
    this.explanation = "";
    this._explain = true;
    if ( opOptions ) {
      if ( opOptions.strict === true ) {
        this._strict = true;
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
    if ( this._strict === true && this.resource(roleName) !== null ) {
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
      if ( this._strict === true && this.role(resourceName) !== null ) {
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
      this._last_error = "unexpected type for optional argument";
      return null;
    }
    return actions;
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
    var actions_to_allow = [];
    var found_role = this.role(roleName);
    var found_resource = this.resource(resourceName);
    if ( ( found_role === null || found_resource === null) ) {
      this._last_error = "unknown role/resource";
      return false;
    }
    actions_to_allow = this._opActionsForAllowDeny( opActions );
    if (!actions_to_allow) {
      return false;
    }     
    if ( this._strict === true ) {
      if ( actions_to_allow.contains("*") && 
           !this._getActionsNames( found_resource ).contains("*") ) {
        this._last_error = "tried to use * for resource without *";
        return false;
      }
    } 
    if ( !this._strict || this._strict === false ) {
      if ( actions_to_allow === [ "*" ] ) {
        actions_to_allow = this._getActionsNames( found_resource );
      }
    }

    var _this = this; /* make this available as _this in the foreach scope */
    actions_to_allow.forEach( function( new_allowed ) {
      var found_action = _this._findAction( found_resource, new_allowed );
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
   * @return true on success
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
    actions_to_deny = this._opActionsForAllowDeny( opActions );
    if (!actions_to_deny) {
      return false;
    }     
    if ( this._strict === true ) {
      if ( actions_to_deny === ["*"] && 
           !this._getActionsNames( found_resource ).contains("*") ) {
        this._last_error = "tried to use * for resource without *";
        return false;
      }
    } 
    if ( !this._strict || this._strict === false ) {
      if ( actions_to_deny === [ "*" ] ) {
        actions_to_deny = this._getActionsNames( found_resource );
      }
    }

    var _this = this; /* make this available as _this in the foreach scope */
    actions_to_deny.forEach( function( new_denied ) {
      var found_action = _this._findAction( found_resource, new_denied );
      if ( found_action ) {
        if ( !found_action.deny ) {
          found_action.deny = [ found_role.name ];
        } else { 
          found_action.deny.push(found_role.name);
        }
      }
      else
      {
        _this._last_error = "didn't find an action";
      }
    });
    return true;
  };

  /* Function:
   * _isAllowed private implementation - no parameter checking
   * @param role - a role object
   *        resource - a resource object
   *        actions - array of actions to check
   * @return "deny", "allow", "default"
   */
  Jakkel.prototype._isAllowed = function( role, resource, actions ) {
    var result="default";
    var actions_to_check = null;
    var wild_card = false;

    // console.log("_isAllowed called", role, resource, actions);

    if ( this._expand_wildcard_in_allow_query && actions === ["*"] ) {
      actions_to_check = this._getActionNames(resource);
      console.log("wildcard expansion for actions", actions_to_check );
      wild_card = true;
    } else { 
      actions_to_check = actions;
    }
    var _this = this;
    //console.log("resource actions", resource.actions );
    resource.actions.forEach( function( action ) {
      //console.log("checking action ", action );
      //console.log("atc ", actions_to_check);
      //console.log("action.action ", action.action);
      if ( actions_to_check.contains( action.action )) {
        //console.log( action.action, "is in", actions_to_check );
        /* if we have not expanded a wild card then allow is overriden by
         * deny, so check allow first */
        if ( wild_card === false ) {
          //console.log("wildcard false");
          if ( action.allow && action.allow.contains( role.name )) {
            //console.log("action.allow.contains role.name");
            if ( _this._explain === true ) { 
              _this.explanation = "allowed " + role.name + 
                                 " for action " + action.action;
            }
            result = "allow";
          }
        }
        if (action.deny && action.deny.contains( role.name )) {
          //console.log("action.deny.contains role.name");
          if ( _this._explain ) { 
            _this.explanation = "denied " + role.name + 
                               " for action " + action.action;
          }
          result = "denied";
        } 
        /* if we have expanded a wild card then deny is overriden by allow
         * so check allow after deny */
        if ( wild_card === true ) {
          //console.log("wildcard false");
          if (action.allow && action.allow.contains( role.name )) {
            //console.log("action.allow.contains role.name");
            if ( _this._explain ) { 
              _this.explanation = "allowed " + role.name + 
                                 " for action " + action.action;
              //console.log(_this.explanation);
            }
            result = "allow";
          }
        }
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
   * @return 
   */
  Jakkel.prototype.isAllowed = function( roleNames, resourceName, opActions ) {
    var result;
    var ret_val;
    var actions = [];
    var roles = null;
    var found_role = null;
    var found_resource = this.resource(resourceName);
    if ( found_resource === null ) {
      this._last_error = "unknown resource";
      return false;
    }
    if (roleNames.constructor === Array && roleNames.length < 1 ) { 
      this._last_error = "isAllowed - no roles specified";
      return false;
    }
    if ( typeof roleNames === String || typeof roleNames === 'string') {
      roles = [ roleNames ];
    } else {
      roles = roleNames;
    }
    //console.log( roles );
    
    actions = this._opActionsForAllowDeny( opActions );
    //console.log( actions );
    if (actions.length === 0) {
      this._last_error = "isAllowed - zero length actions - return false";
      return false;
    }     
    /* each role can have different parentage so do each in turn */
    var _this = this; /* make this available as _this for forEach */
    roles.forEach( function( roleName ) {
      found_role = _this.role( roleName );
      //console.log( found_role, "is found role" ); 
      ret_val = _this._isAllowed( found_role, found_resource, actions);
      //console.log(_this.explanation);
      if ( ret_val === "allow" ) {
        //console.log( "isAllowed allow" );
        result = true;
      } else if ( ret_val === "deny" ) {
        //console.log( "isAllowed deny" );
        result = false;
      } else if ( ret_val === "default" && this._default ) {
        //console.log( "isAllowed using default", this._default === true ? 'true' : 'false' );
        result = this._default;
      } else {
        //console.log( "isAllow returning false" );
        result = false;
      }  
    });
    return result; 
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
