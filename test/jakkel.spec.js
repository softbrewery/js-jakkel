describe("Jakkel", function() {

  var jakkel = new Jakkel; 

  beforeEach(function() {
    jakkel.flushRoles();
    jakkel.flushResources();
  });


  describe("version property", function() {
    it("should be defined", function() {
      expect(jakkel.VERSION).toBeDefined();
    });
    it("should not be empty", function() {
      expect(jakkel.VERSION).not.toBeNull();
    });
  });

  describe("roles() method", function() {
    it("should be defined", function() {
      expect(jakkel.roles).toBeDefined();
    });
    it("should return empty list by default", function() {
      expect(jakkel.roles.length).toEqual(0);
    });
  });

  describe("role() method", function() {
    it("should be defined", function() {
      expect(jakkel.role).toBeDefined();
    });
  });

  describe("addRole() method", function() {
    it("should be defined", function() {
      expect(jakkel.addRole).toBeDefined();
    });
    it("should be accept roles without parents", function() {
      expect(jakkel.addRole('anonymous')).toBe(true);
      expect(jakkel.roles().length).toEqual(1);
      expect(jakkel.role('anonymous')).toEqual({"role":"anonymous"});

      expect(jakkel.addRole('anonymous')).toBe(false);
      expect(jakkel.roles().length).toEqual(1);
      expect(jakkel.role('anonymous')).toEqual({"role":"anonymous"});

      expect(jakkel.addRole('admin')).toBe(true);
      expect(jakkel.roles().length).toEqual(2);
      expect(jakkel.role('admin')).toEqual({"role":"admin"});
    });
    it("should be accept roles with parents", function() {
      expect(jakkel.addRole('anonymous')).toBe(true);
      expect(jakkel.roles().length).toEqual(1);
      expect(jakkel.role('anonymous')).toEqual({"role":"anonymous"});

      expect(jakkel.addRole('user', 'anonymous')).toBe(true);
      expect(jakkel.roles().length).toEqual(2);
      expect(jakkel.role('user')).toEqual({"role":"user","parent":"anonymous"});

      expect(jakkel.addRole('admin', 'user')).toBe(true);
      expect(jakkel.roles().length).toEqual(3);
      expect(jakkel.role('admin')).toEqual({"role":"admin","parent":"user"});

      expect(jakkel.addRole('admin', 'user')).toBe(false);
      expect(jakkel.roles().length).toEqual(3);
      expect(jakkel.role('admin')).toEqual({"role":"admin","parent":"user"});

      var json = [
        {"role":"anonymous"},
        {"role":"user","parent":"anonymous"},
        {"role":"admin","parent":"user"}
      ];
      expect(jakkel.roles()).toEqual(json);
    });
  });

  describe("flushRoles() method", function() {
    it("should be defined", function() {
      expect(jakkel.flushRoles).toBeDefined();
    });
    it("should clear all roles", function() {
      expect(jakkel.roles().length).toEqual(0);
      jakkel.addRole('anonymous');
      jakkel.addRole('user','anonymous');
      jakkel.addRole('admin','user');
      expect(jakkel.roles().length).toEqual(3);
      jakkel.flushRoles();
      expect(jakkel.roles().length).toEqual(0);
    });
  });

  describe("resources() method", function() {
    it("should be defined", function() {
      expect(jakkel.resources).toBeDefined();
    });
    it("should return empty list by default", function() {
      expect(jakkel.resources.length).toEqual(0);
    });
  });

  describe("resource() method", function() {
    it("should be defined", function() {
      expect(jakkel.resource).toBeDefined();
    });
  });

  describe("addResources() method", function() {
    it("should be defined", function() {
      expect(jakkel.addResource).toBeDefined();
    });
    it("should accept actions as array", function() {
      expect(jakkel.addResource('products', ['list'])).toBe(true);
      expect(jakkel.resources().length).toEqual(1);
      expect(jakkel.resource('products')).toEqual({resource:'products',actions:{list:{}}});

      expect(jakkel.addResource('products', ['list'])).toBe(false);
      expect(jakkel.resources().length).toEqual(1);
      expect(jakkel.resource('products')).toEqual({resource:'products',actions:{list:{}}});

      expect(jakkel.addResource('products', ['detail'])).toBe(true);
      expect(jakkel.resources().length).toEqual(1);
      expect(jakkel.resource('products')).toEqual({resource:'products',actions:{list:{},detail:{}}});

      expect(jakkel.addResource('products', ['create', 'delete'])).toBe(true);
      expect(jakkel.resources().length).toEqual(1);
      expect(jakkel.resource('products')).toEqual({resource:'products',actions:{list:{},detail:{},create:{},delete:{}}});
    });
    it("should accept actions that are empty", function() {
      expect(jakkel.addResource('auth')).toBe(true);
      expect(jakkel.resources().length).toEqual(1);
      expect(jakkel.resource('auth')).toEqual({resource:'auth',actions:{'*':{}}});
    });
    it("should accept actions as string", function() {
      expect(jakkel.addResource('auth','login')).toBe(true);
      expect(jakkel.resources().length).toEqual(1);
      expect(jakkel.resource('auth')).toEqual({resource:'auth',actions:{'login':{}}});
    });
  });

  describe("flushResources() method", function() {
    it("should be defined", function() {
      expect(jakkel.flushResources).toBeDefined();
    });
    it("should clear all roles", function() {
      expect(jakkel.resources().length).toEqual(0);
      jakkel.addResource('auth');
      jakkel.addResource('products', ['create', 'delete']);
      expect(jakkel.resources().length).toEqual(2);
      jakkel.flushResources();
      expect(jakkel.resources().length).toEqual(0);
    });
  });

});