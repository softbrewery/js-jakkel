[![Build Status](https://travis-ci.org/softbrewery/js-jakkel.svg)](https://travis-ci.org/softbrewery/js-jakkel)
[![Bower Version](http://img.shields.io/bower/v/js-jakkel.svg)](https://www.npmjs.org/package/js-jakkel)
[![NPM Version](http://img.shields.io/npm/v/js-jakkel.svg)](https://www.npmjs.org/package/js-jakkel)

JS-Jakkel - JavaScript ACL Implementation
======================================

JS-Jakkel is a JavaScript ACL implementation inspired by the Zend Framework. Its goal is to provide a consitent implemtation towards Node.js and Angular.js.

### Installation
---
```sh
$ bower install --save js-jakkel
```
```sh
$ npm install --save js-jakkel
```

### How to use
---
Jakkel works with Roles and Resources.
```javascript
// Create a jakkel instance
var acl = new Jakkel;

// Define some roles (that inherit each other)
acl.addRole('anonymous');
acl.addRole('user', 'anonymous');
acl.addRole('admin', 'user');

// Define some resources & actions
acl.addResource('products', ['view', 'add', 'update', 'delete']);
acl.addResource('comments', ['view', 'add', 'update', 'delete']);

// Set the permissions
acl.allow('anonymous', 'products', ['view']);
acl.allow('user', 'comments', ['view', 'add']);
acl.allow('admin', 'products', ['add', 'update', 'delete']);
acl.allow('admin', 'comments', ['update', 'delete']);

// Test permissions
if(acl.isAllowed('user', 'products', ['view'])) {
    // render products...
};

// Test permissions
acl.ifAllowed('admin', 'comments', ['delete'], function() {
    // show comment delete button
});

```

### Api
---
```javascript
var acl = new Jakkel;
```

#### VERSION
Returns the library version of JS-Jakkel
```javascript
var version = acl.VERSION;
```

#### roles()
Returns the list of currently defined roles. 
- Return type is an Array of Role objects.

```javascript
var roles = acl.roles();
```

#### role(roleName)
Returns a role of the currently defined roles list. 
- The `name` argument is of type String. 
- Return type is a Role object.

```javascript
var role = acl.role('admin');
```

#### addRole(roleName, parent)
Adds a role the the list of roles.
- The `name` argument is of type String. 
- The `parent` argument is optional and of type String. 
- Returns true if succeeded.

```javascript
acl.addRole('user');
acl.addRole('admin', 'user');
```

#### resources()
Returns the list of currently defined resources. 
- Return type is an Array of Resource objects.

```javascript
var resources = acl.resources();
```

#### resource(resourceName)
Returns a resource of the currently defined resources list. 
- The `resourceName` argument is of type String. 
- Return type is a Resource object.

```javascript
var resource = acl.resource('products');
```

#### addResource(resourceName, actions)
Adds a resources the the list of resources. Actions are optional but can be used to have more control.
- The `resourceName` argument is of type String. 
- The `actions` argument is optional and of type String or Array. 
- Returns true if succeeded.

```javascript
// equivalents
acl.addResource('profile');
acl.addResource('profile', '*');
acl.addResource('profile', ['*']);
```
```javascript
acl.addResource('products', ['list', 'detail', 'edit', 'delete', 'update']);
```

#### allow(roleName, resourceName, actions)
Adds permission for a role to a resource
- The `roleName` argument is of type String. 
- The `resourceName` argument is of type String.
- The `actions` argument is optional and of type String or Array.
- Returns true if succeeded.

```javascript
acl.allow('anonymous', 'products', 'list');
acl.allow('user', 'products', ['detail', 'comments']);
acl.allow('admin', 'products', ['add', 'delete', 'update']);
```
```javascript
// equivalents
acl.allow('user', 'profile');
acl.allow('user', 'profile', '*');
acl.allow('user', 'profile', ['*']);
```

#### deny(roleName, resourceName, actions)
Deny a resource for a role
- The `roleName` argument is of type String. 
- The `resourceName` argument is of type String.
- The `actions` argument is optional and of type String or Array.
- Returns true if succeeded.

```javascript
// user inherits from anonymous
acl.addRole('anonymous');
acl.addRole('user', 'anonymous');

// anonymous can login, user can logout
acl.allow('anonymous', 'auth', ['login','signup']);
acl.allow('user', 'auth', ['logout']);

// user can't acces login or signup
acl.deny('user', 'auth', ['login','signup']);
```

#### isAllowed(roleName, resourceName, actions)
Returns true or false depending if the permission is found.
- The `roleName` argument is of type String or Array of Strings.
- The `resourceName` argument is of type String.
- The `actions` argument is optional and of type Array or String.
- Return true or false.

```javascript
// equivalent
var state = acl.isAllowed('user', 'products', 'list');
var state = acl.isAllowed('user', 'products', ['list']);
```
```javascript
var state = acl.isAllowed('admin', 'products', ['list','detail']);
```
```javascript
// equivalent
var state = acl.isAllowed('anonymous', 'auth');
var state = acl.isAllowed('anonymous', 'auth', '*');
var state = acl.isAllowed('anonymous', 'auth', ['*']);
```
```javascript
// Array of roles
var state = acl.isAllowed(['user','admin'], 'products', ['list','detail']);
```

#### ifAllowed(roleName, resourceName, actions, onTrue, onFalse)
Executes the callback `onTrue` method if the role is allowed to the resource, otherwise callback `onFalse` is called.
- The `roleName` argument is of type String or Array of Strings.
- The `resourceName` argument is of type String.
- The `actions` argument is optional and of type Array or String.
- The `onTrue`argument is of type Function (callback)
- The `onFalse` argument is optional and of type Function (callback)

```javascript
acl.ifAllowed('user', 'products', 'list', function() {
    // do something if allowed
});
```
```javascript
acl.ifAllowed('user', 'products', 'list',
    function() {
        // do something if allowed
    },
    function() {
        // do something if not allowed
    }
);
```
```javascript
// Array of roles
acl.ifAllowed(['user','admin'], 'products', 'list', function() {
    // do something if allowed
});
```

#### config()
Return the Jakkel config
- Returns the config as Json
```javascript
var config = acl.config();

// example contents of config variable
{
    "roles": [
        { "name": "anonymous" },
        { "name": "user", "parent": "anonymous" },
        { "name": "admin", "parent": "user" }
    ],
    "resources": [
        { 
            "name": "auth", 
            "actions": [
                { "action": "login", "allow": ["anonymous"], "deny": ["user"] },
                { "action": "signup", "allow": ["anonymous"], "deny": ["user"] },
                { "action": "logout", "allow": ["user"] }
            ] 
        },
        { 
            "name": "products", 
            "actions": [
                { "action": "list", "allow": ["user"] },
                { "action": "detail", "allow": ["user"] },
                { "action": "add", "allow": ["admin"] }
            ] 
        },
        { 
            "name": "profile", 
            "actions": [
                { "action": "*", "allow": ["user"] }
            ] 
        }
    ]
}
```

#### setConfig(config)
Set the Jakkel configuration from a json object.
- The `config` argument is of type Json.
- Returns true if succeeded and the config is validated
```javascript
// equivalents
var config = {...};

acl.setConfig(config);
```

### Contributing
---
Found a typo or a bug? Send a pull request.

### Todo
---
- Add Options (strict,...)
- Add Strict mode
- Validate everything instrict mode
- Prevent roles and actions with the same name in strict mode
- Prevent roles parents that don't exist

### License
---
The MIT License (MIT)

Copyright (c) 2014 SoftBrewery

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
