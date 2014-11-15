
(function(window) {

  'use strict';

  /* 
   * Creat the Jakkel Object
   */
  var Jakkel = function() {
    this.config = {
      roles: [],
      resources: []
    };
  };

  /*
   * Current version.
   */
  Jakkel.prototype.VERSION = '0.0.2';

  /* 
   * Get roles
   */
  Jakkel.prototype.roles = function() {
    return this.config.roles;
  };

  /* 
   * Get role
   */
  Jakkel.prototype.role = function(role) {
    var roles = this.config.roles;
    for(var i=0; i<roles.length; i++) {
      if(roles[i].role === role)
        return roles[i];
    }
    return null;
  };

  /*
   * Add Role
   */
  Jakkel.prototype.addRole = function(role, parent) {

    // exit if role is empty
    if(role === null)
      return false;

    // exit if role already exists
    if(this.role(role))
      return false;

    // create object
    var newRole = {'role': role};

    // add parent, if exists
    if(parent)
      newRole.parent = parent;

    this.config.roles.push(newRole);

    return true;
  };
  
  /*
   * Flush roles
   */
  Jakkel.prototype.flushRoles = function() {
    this.config.roles.clear();
  };

  /*
   * Get resources
   */
  Jakkel.prototype.resources = function() {
    return this.config.resources;
  };

  /*
   * Get resource
   */
  Jakkel.prototype.resource = function(resource) {
    var resources = this.config.resources;
    for(var i=0; i<resources.length; i++) {
      if(resources[i].resource === resource)
        return resources[i];
    }
    return null;
  };

  /*
   * Add Role
   */
  Jakkel.prototype.addResource = function(resource, actions) {
    actions = actions || ['*'];

    // exit if resource is empty
    if(resource === null)
      return false;

    if(typeof actions === 'string')
      actions = [actions];

    // get the resource if exists
    var newResource = this.resource(resource);

    // else create a new one
    if(newResource === null) {
      newResource = {resource: resource, actions: {}};
      this.config.resources.push(newResource);
    }

    var dirty = false;
    for(var i=0; i<actions.length; i++) {
      if(!newResource.actions.hasOwnProperty(actions[i])) {
        newResource.actions[actions[i]] = {};
        dirty = true;
      }
    }

    return dirty;
  };

  /*
   * Flush all resources
   */
  Jakkel.prototype.flushResources = function() {
    this.config.resources.clear();
  };

  //##############################################################
  
  Array.prototype.clear = function() {
    while (this.length > 0) {
      this.pop();
    }
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
