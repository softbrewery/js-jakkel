describe("Jakkel tests", function() {
  var jakkel = new Jakkel();

  beforeEach(function() {
    jakkel.flush();
  });

  describe("version property", function() {
    it("should be defined", function() {
      expect(jakkel.VERSION).toBeDefined();
    });
    it("should not be empty", function() {
      expect(jakkel.VERSION.length).not.toBeNull();
    });
  });
 
  describe("function roles", function() {
    it("should exist", function() {
      expect(jakkel.roles).toBeDefined();
    });
    it("should return an empty array if no roles have been added", function () {
      expect(jakkel.roles().length).toBe(0);
    });
  });

  describe("function addRole", function() {
    it("should exist", function() {
      expect(jakkel.addRole).toBeDefined();
    });
    it("should not allow bad name - null", function() {
      var result = jakkel.addRole( null, null );
      expect(result).toBe(false);
    });
    it("should not allow non-strings - object", function() {
      expect(jakkel.addRole( {}, null )).toBe(false);
    });
    it("should not allow non-strings - array", function() {
      expect(jakkel.addRole( [], null )).toBe(false);
    });
    it("should not allow non-strings - number", function() {
      expect(jakkel.addRole( 3.142, null)).toBe(false) ;
    });
    it("shouldn't allow a role to be added with self as parent", function() {
      expect(jakkel.addRole("bad", "bad")).toBe(false);
    });
    it("should allow a role to be added", function() {
      expect(jakkel.addRole("test", "testadmin")).toBe(true);
    });
    it("should allow another role to be added", function() {
      expect(jakkel.addRole("admin", "administrators")).toBe(true);
    });
  });

  describe("function resources", function() {
    it("should exist", function() {
      expect(jakkel.resources).toBeDefined();
    });
    it("should return an empty array if no resources have been added", function () {
      expect(jakkel.resources().length).toBe(0);
    });
  });

  describe("function resource", function() {
    it ("should exist", function() {
      expect(jakkel.resource).toBeDefined();
    });
    it("should return a previously added resource", function() {
      expect(jakkel.addResource("test", "*")).toBe(true);
      expect(jakkel.resource("test")).toEqual({"name":"test",actions:[{action:'*'}]});
    });
  });

  describe("function addResource", function() {
    it("should exist", function() {
      expect(jakkel.addResource).toBeDefined();
    });
    it("should not allow bad name - null", function() {
      var result = jakkel.addResource( null, null );
      expect(result).toBe(false);
    });
    it("should not allow bad name non-strings - object", function() {
      expect(jakkel.addResource( {}, null )).toBe(false);
    });
    it("should not allow bad name non-strings - number", function() {
      expect(jakkel.addResource( 3.142, null)).toBe(false) ;
    });
    it("should not allow bad name non-strings - empty array", function() {
      expect(jakkel.addResource( [], null )).toBe(false);
    });
    it("should not allow empty array for actions", function() {
      expect(jakkel.addResource( 'failtest', [] )).toBe(false);
    });
    it("should allow a resource to be add with no actions specifed, and get default", function() {
      expect(jakkel.addResource('test')).toBe(true);
      expect(jakkel.resource("test"))
        .toEqual({"name":"test",actions:[{action:'*'}]});
    });
    it("should not allow the same resource to be added twice", function () {
      expect(jakkel.addResource('testdouble')).toBe(true);
      expect(jakkel.addResource('testdouble')).toBe(false);
    });

    it("should allow a resource to be added with * action", function() {
      expect(jakkel.addResource("test-star", "*")).toBe(true);
      expect(jakkel.resource("test-star"))
        .toEqual({"name":"test-star",actions:[{action:'*'}]});
    });
    it("should allow a resource to be added with ['*'] action", function() {
      expect(jakkel.addResource("test-star-in-array", ['*'] )).toBe(true);
      expect(jakkel.resource("test-star-in-array"))
        .toEqual({"name":"test-star-in-array",actions:[{action:'*'}]});
    });
  });

  describe("function flush", function () {
    it("should exist", function() {
      expect(jakkel.flush).toBeDefined();
    });
    it("should clear added roles", function () {
      jakkel.addRole( 'test1', null );
      jakkel.flush();
      expect(jakkel.roles().length).toEqual(0);
    });
    it("should clear added resources", function () {
      jakkel.addResource( 'res1', '*' );
      jakkel.flush();
      expect(jakkel.resources().length).toEqual(0); 
    });
  });

  describe("function role", function() { 
    it("should exist", function() {
      expect(jakkel.role).toBeDefined();
  });
    it("should be able to retreive an added role", function () {
      expect(jakkel.addRole( 'test', null )).toBe( true );
      expect(jakkel.role( 'test' )).toEqual( {"name":"test"} );
    });
  });

});
