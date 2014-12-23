describe("Jakkel tests", function() {
  var jakkel = new Jakkel();

  beforeEach(function() {
    jakkel.flush();
  });

  describe("version property", function() {
    it("should be defined", function() {
      expect(jakkel._VERSION).toBeDefined();
    });
    it("should not be empty", function() {
      expect(jakkel._VERSION.length).not.toBeNull();
    });
  });
 
  describe("version function", function() {
    it("should be defined", function() {
      expect(jakkel.version).toBeDefined();
      expect(jakkel.version()).toEqual(jakkel._VERSION);
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
    /* internals have changed slightly - need to revisit this test */
    xit("should return a previously added resource", function() {
      expect(jakkel.addResource("test", "*")).toBe(true);
      expect(jakkel.resource("test")).name.toEqual("test");
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
    it("should not allow object for actions", function() {
      expect(jakkel.addResource( 'failtest', {} )).toBe(false);
    });
    it("should allow a resource to be added with no actions specifed, and get default", function() {
      expect(jakkel.addResource('test')).toBe(true);
      expect(jakkel.resource("test"))
        .toEqual({"name":"test",actions:[{action:'*',allow:[],deny:[]}]});
    });
    it("should not allow the same resource to be added twice", function () {
      expect(jakkel.addResource('test-double')).toBe(true);
      expect(jakkel.addResource('test-double')).toBe(false);
    });

    /* internals have changed slightly - need to revisit this test */
    xit("should allow a resource to be added with * action", function() {
      expect(jakkel.addResource("test-star", "*")).toBe(true);
      expect(jakkel.resource("test-star"))
        .toEqual({"name":"test-star",actions:[{action:'*'}]});
    });
    /* internals have changed slightly - need to revisit this test */
    xit("should allow a resource to be added with ['*'] action", function() {
      expect(jakkel.addResource("test-star-in-array", ['*'] )).toBe(true);
      expect(jakkel.resource("test-star-in-array"))
        .toEqual({"name":"test-star-in-array",actions:[{action:'*'}]});
    });
    /* internals have changed slightly - need to revisit this test */
    xit("should allow a resource to be added with multiple actions", function() {
      multi_actions = ['list', 'detail', 'edit', 'delete', 'update'];
      expect(jakkel.addResource('products', multi_actions )).toBe(true);
      resource = jakkel.resource('products');
      expect(resource).toEqual({ name:'products', 
                                 actions:[{ action : 'list' }, 
                                          { action : 'detail' }, 
                                          { action : 'edit' }, 
                                          { action : 'delete' }, 
                                          { action : 'update' }] });
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

  describe("array helper function 'contains' ", function () {
    it("array should have a helper called contains", function () {
      expect( [].contains ).toBeDefined();
    });
    it("should be possible to find a string", function() {
      var test_array = [ "super", "smashing", "great" ];
      expect(test_array.contains("super")).toEqual(true);
      expect(test_array.contains("smashing")).toEqual(true);
      expect(test_array.contains("bar")).toEqual(false);
    });
  });

  
  describe("private function _findAction", function () {
    it("should exist", function () {
      expect(jakkel._findAction).toBeDefined();
    });
    it("should reject bad arguments", function() {
      expect(jakkel._findAction( [], [] )).toEqual(null);
    });
    it("should be able to find an action in a resource", function () {
      jakkel.addResource('products', ['list', 'detail', 'edit'] );
      res = jakkel.resource('products');
      expect(jakkel._findAction(res, "list")).toEqual({action:'list',allow:[],deny:[]});
    });
  });

  describe("private function _getActionsNames", function () {
    it("should exist", function() {
        expect(jakkel._getActionsNames).toBeDefined();
    });
    it("should return an array - default contains '*'", function() {
      jakkel.addResource("test");
      expect(jakkel._getActionsNames(jakkel.resource("test"))).toEqual(["*"]);
    });
    it("should return an array - thing1 and thing2 ", function() {
      jakkel.addResource("test", [ "thing1", "thing2" ]);
      expect(jakkel._getActionsNames(jakkel.resource("test"))).toEqual([ "thing1", "thing2" ]);
    });
  });

  describe("private function _opActionsForAllowDeny", function () {
    it("should exist", function() {
      expect(jakkel._opActionsForAllowDeny).toBeDefined();
    });
    it("should create an array with one entry '*' given no argument", function() {
      expect(jakkel._opActionsForAllowDeny()).toEqual(["*"]);
    });
    it("should create an array with one entry 'test' given 'test' as argument", function() {
      expect(jakkel._opActionsForAllowDeny("test")).toEqual(["test"]);
    });
    it("should create an array with two entries 'test', 'string' given  ['test', 'string'] as argument", function() {
      expect(jakkel._opActionsForAllowDeny(["test","string"])).toEqual(["test","string"]);
    });
  });

  describe("function allow", function() {
    it("should exist", function() {
      expect(jakkel.allow).toBeDefined();
    });
    it("should not work if resource or role hasn't been created", function() {
      expect(jakkel.allow("user","login")).toEqual( false ); 
    });
    it("should not work if resource hasn't been created", function() {
      jakkel.addRole("user");
      expect(jakkel.allow("user","login")).toEqual( false ); 
    });
    it("should not work if role hasn't been created", function() {
      jakkel.addResource("config");
      expect(jakkel.allow("admin","config")).toEqual( false ); 
    });
    it("should allow a role for a resource (no action specified)", function() {
      jakkel.addRole("user");
      jakkel.addResource("login");
      expect(jakkel.allow("user","login")).toBe( true );
    });    
    it("should allow a role for a resource (no action specified)", function() {
      jakkel.addRole("user");
      jakkel.addResource("login");
      expect(jakkel.allow("user","login")).toBe( true );
    });    
    it("should allow a role for a resource (action '*' specified)", function() {
      jakkel.addRole("user");
      jakkel.addResource("login");
      expect(jakkel.allow("user","login",'*')).toBe( true );
    });    
    it("should allow a role for a resource (action ['*'] specified)", function() {
      jakkel.addRole("user");
      jakkel.addResource("login");
      expect(jakkel.allow("user","login",'*')).toBe( true );
    });    
    it("should allow a role for a resource with one non" +
        " '*' action (action ['*'] specified)", function() {
      jakkel.addRole("user");
      jakkel.addResource("login", "open");
      expect(jakkel.allow("user","login",'*')).toBe( true );
      expect(jakkel.isAllowed("user", "login", "open")).toBe(true);
    });    
    it("should allow all roles for a resource with more than one non" +
        " '*' action (action ['*'] specified)", function() {
      jakkel.clearLast();
      expect(jakkel.addRole("user")).toBe(true);
      expect(jakkel.addResource("login", [ "open", "close" ])).toBe(true);
      expect(jakkel.allow("user","login",'*')).toBe( true );
      expect(jakkel.isAllowed("user", "login", "open")).toEqual(true);
      console.log(jakkel.getLastError());
      console.log(jakkel._explanation);
      expect(jakkel.isAllowed("user", "login", "close")).toEqual(true);
      console.log(jakkel.getLastError());
      console.log(jakkel._explanation);
    });    
    it("should allow one role for a resource with more than one non" +
        " '*' action specified)", function() {
      jakkel.addRole("user");
      jakkel.addResource("login", [ "open", "close" ]);
      expect(jakkel.allow("user","login","open")).toBe( true );
    });    
    it("should allow more than one role for a resource with more than one non" +
        " '*' action specified)", function() {
      jakkel.addRole("user");
      jakkel.addResource("login", [ "open", "close" ]);
      expect(jakkel.allow("user","login","open")).toBe( true );
    });    
  });


  describe("function deny", function() {
    it("should exist", function() {
      expect(jakkel.deny).toBeDefined();
    });
    it("should not work if resource or role hasn't been created", function() {
      expect(jakkel.deny("user","login")).toEqual( false ); 
    });
    it("should not work if resource hasn't been created", function() {
      jakkel.addRole("user");
      expect(jakkel.deny("user","login")).toEqual( false ); 
    });
    it("should not work if role hasn't been created", function() {
      jakkel.addResource("config");
      expect(jakkel.deny("admin","config")).toEqual( false ); 
    });
    it("should deny a role for a resource (no action specified)", function() {
      jakkel.addRole("user");
      jakkel.addResource("login");
      expect(jakkel.deny("user","login")).toBe( true );
    });    
    it("should deny a role for a resource (no action specified)", function() {
      jakkel.addRole("user");
      jakkel.addResource("login");
      expect(jakkel.deny("user","login")).toBe( true );
    });    
    it("should deny a role for a resource (action '*' specified)", function() {
      jakkel.addRole("user");
      jakkel.addResource("login");
      expect(jakkel.deny("user","login",'*')).toBe( true );
    });    
    it("should deny a role for a resource (action ['*'] specified)", function() {
      jakkel.addRole("user");
      jakkel.addResource("login");
      expect(jakkel.deny("user","login",'*')).toBe( true );
    });    
    it("should deny a role for a resource with one non" +
        " '*' action (action ['*'] specified)", function() {
      jakkel.addRole("user");
      jakkel.addResource("login", "open");
      expect(jakkel.deny("user","login",'*')).toBe( true );
    });    
    it("should deny all roles for a resource with more than one non" +
        " '*' action (action ['*'] specified)", function() {
      jakkel.addRole("user");
      jakkel.addResource("login", [ "open", "close" ]);
      expect(jakkel.deny("user","login",'*')).toBe( true );
      expect(jakkel.isAllowed("user", "login", "open")).toBe( false );
      expect(jakkel.isAllowed("user", "login", "close")).toBe( false );
    });    
    it("should deny one role for a resource with more than one non" +
        " '*' action specified)", function() {
      jakkel.addRole("user");
      jakkel.addResource("login", [ "open", "close" ]);
      expect(jakkel.deny("user","login","open")).toBe( true );
      expect(jakkel.isAllowed("user", "login", "open")).toBe( false );
    });    
    it("should deny more than one role for a resource with more than one non" +
        " '*' action specified)", function() {
      jakkel.addRole("user");
      jakkel.addResource("login", [ "open", "close" ]);
      expect(jakkel.deny("user","login","open")).toBe( true );
      expect(jakkel.isAllowed("user", "login", "open")).toBe( false );
    });    
  });
  describe("function isAllowed", function() {
    it("should exist", function() {
      expect(jakkel.deny).toBeDefined();
    });
    it("should reject bad arguments", function() {
      expect(jakkel.isAllowed("foo", "bar" )).toBe(false);
      jakkel.addRole("foo");
      expect(jakkel.isAllowed("foo", "bar" )).toBe(false);
      expect(jakkel.isAllowed([], "bar" )).toBe(false);
      expect(jakkel.isAllowed(["foo", "bar"], "bar" )).toBe(false);
    });
    it("should return true for an allowed resource", function() {
      jakkel.addRole("user");
      jakkel.addResource("login");
      jakkel.allow("user","login");
      jakkel._last_error = null;
      expect(jakkel.isAllowed("user", "login")).toBe( true );
      console.log( jakkel.getExplanation() );
    });
    it("should return true for an allowed resource action, 1 role",  function() {
      jakkel.addRole("user");
      jakkel.addResource("auth", [ "login", "logout" ]);
      jakkel.allow("user", "auth",  "login");
      expect(jakkel.isAllowed("user", "auth", "login")).toBe( true );
      //console.log( jakkel.explanation );
    });
    xit("should return true for an allowed resource action, 2 roles - depends on order :(",  function() {
      jakkel.addRole("user");
      jakkel.addRole("admin");
      jakkel.addResource("auth", [ "login", "logout" ]);
      jakkel.allow("user", "auth",  "login");
      jakkel.allow("admin", "auth", "logout");
      expect(jakkel.isAllowed(["admin","user"], "auth", "login")).toBe( true );
      //console.log( jakkel.explanation );
    });
    it("should return true for an allowed resource action of a parent ",  function() {
      jakkel.addRole("user");
      jakkel.addRole("admin", "user");
      jakkel.addResource("auth", [ "login", "logout" ]);
      jakkel.allow("user", "auth",  "login");
      //jakkel.allow("admin", "auth", "logout");
      expect(jakkel.isAllowed("admin", "auth", "login")).toBe( true );
      //console.log( jakkel.explanation );
    });
    it("should return true for a general resource of a parent ",  function() {
      jakkel.addRole("user");
      jakkel.addRole("admin", "user");
      jakkel.addResource("auth");
      jakkel.allow("user", "auth");
      //jakkel.allow("admin", "auth", "logout");
      expect(jakkel.isAllowed("admin", "auth")).toBe( true );
      //console.log( jakkel.explanation );
    });
    it("should return true for a general resource of a parent's parent ",  function() {
      jakkel.addRole("user");
      jakkel.addRole("admin", "user");
      jakkel.addRole("god", "admin" );
      jakkel.addResource("auth");
      jakkel.allow("user", "auth");
      //jakkel.allow("admin", "auth", "logout");
      expect(jakkel.isAllowed("god", "auth")).toBe( true );
      //console.log( jakkel.explanation );
    });

    /* Here be Dragons! 
     * For development we allow the default action returned for unmatched isAllowed
     * queries to be changed
     */
    it("should support developer use with different default", function() {
      jakkel._default = true;
      jakkel.addRole("user");
      jakkel.addResource("auth");
      expect(jakkel.isAllowed("user", "auth", "*" )).toBe(jakkel._default);
      console.log(jakkel.getExplanation());
      jakkel._default = false;
      expect(jakkel.isAllowed("user", "auth", "*" )).toBe(jakkel._default);
      console.log(jakkel.getExplanation());
    });
    /* More Dragons!
     * Normal behaviour is for a deny to over-ride an allow - however in some
     * cases, notably when checking if a role is allowed access to any of a resource's
     * actions (when the query is a "*") we offer inverted logic
     */
    it("should support developer use with expanding wildcards", function() {
      jakkel._expand_wildcard_in_isallowed = false;
      jakkel.addRole("user");
      jakkel.addResource("auth", ["login", "logout"]);
      jakkel.deny("user", "auth", "login" );
      jakkel.allow("user", "auth", "logout" );
      expect(jakkel.isAllowed("user", "auth", "*" )).toBe(false);
      console.log(jakkel.getExplanation());
      jakkel._expand_wildcard_in_isallowed = true;
      expect(jakkel.isAllowed("user", "auth", "*" )).toBe(true);
      console.log(jakkel.getExplanation());
      delete jakkel._expand_wildcard_in_isallowed;
    });
  });

  describe("function ifAllowed", function() {
    it("should exist", function () {
      expect(jakkel.ifAllowed).toBeDefined();
    });
    xit("should be able to take three argument", function () {
      expect(jakkel.ifAllowed("test", "test", null ));
    });
    xit("should be able to take four argument, no actions ", function () {
      expect(jakkel.ifAllowed("test", "test", null, null));
    });
    xit("should be able to take four argument, no denied function ", function () {
      expect(jakkel.ifAllowed("test", "test", "test", null));
    });
    xit("should be able to take five argument", function () {
      expect(jakkel.ifAllowed("test", "test", "test", null, null));
    });
  });

  describe("strict true checks", function() {
    config = { strict: true };
    strict = new Jakkel( config );
    it("should be turned on using config at creation", function() {
      expect(strict._strict).toBe(true);
    });
    strict.flush();
    it("should prevent duplicate names for roles and resources", function() {
      strict.addRole("foo");
      strict.addResource("bar");
      expect(strict.addRole("bar")).toBe(false);
      expect(strict.addResource("foo")).toBe(false);
    });
    strict.flush();
    it("should prevent allowing default ('*') on resource with ('*') as an action ", function() {
      strict.addRole("foo");
      strict.addResource("buz", "bing");
      expect(strict.allow("foo", "buz")).toBe(false);
    });
  });

  describe("private function _setLastError", function() {
    it("should exist", function() {
      expect(jakkel._setLastError).toBeDefined();
    });
    it("should set the value of _last_error when called (and _log_errors is true)", function() {
      var test_string = "testing last error";
      jakkel._log_errors = true;
      jakkel._setLastError(test_string);
      expect(jakkel._last_error).toEqual(test_string);
    });
    it("should not set the value of _last_error when called (and _log_errors is false)", function() {
      var test_string = "testing last error";
      jakkel._last_error = "";
      jakkel._log_errors = false;
      jakkel._setLastError(test_string);
      expect(jakkel._last_error).toEqual("");
    });
  });

  describe("function getLastError", function() {
    it("should exist", function() {
      expect(jakkel.getLastError).toBeDefined();
    });
    it("should report 'not available' if these is no error", function() {
      jakkel._last_error = "";
      expect(jakkel.getLastError()).toEqual("not available");
    });
  });
});

