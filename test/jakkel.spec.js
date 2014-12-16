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

  describe("function flush", function () {
    it("should exist", function() {
      expect(jakkel.flush).toBeDefined();
    });
    it("should clear added roles", function () {
      jakkel.addRole( 'test1', null );
      jakkel.flush();
      expect(jakkel.roles().length).toEqual(0);
    });
    xit("should clear added resources", function () {
      /* expect(jakkel.resources().length).toEqual(0); */
    });
  });

  describe("function role", function() { 
    it("should exist", function() {
      expect(jakkel.role).toBeDefined();
  });
    it("should be able to retreive an added role", function () {
      expect(jakkel.addRole( 'test', null )).toBe( true );
      expect(jakkel.role( 'test' )).toEqual( {"role":"test"} );
    });
  });

});
