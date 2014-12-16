 //var Jakkel = require('../src/jakkel.js');
//var should = require('should');

describe("Jakkel tests", function() {
  var jakkel = new Jakkel;

  beforeEach(function() {
    jakkel.flush();
  });

  describe("version property", function() {
    it("should be defined", function() {
      expect(jakkel.VERSION).to.be.a('string');
    });
    it("should not be empty", function() {
      expect(jakkel.VERSION.length()).to.be.greaterThan(4)
    });
  });
    /*
    describe("roles() method", function() {
        it("should be define", function() {
            jakkel.should.have.
    */
});
