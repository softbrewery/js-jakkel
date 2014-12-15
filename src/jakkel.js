
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


  //##############################################################
  
  /**
   * Clear the contents of an Array
   */
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
