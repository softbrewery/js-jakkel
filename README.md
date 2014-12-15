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

### Api
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

#### role(name)
Returns a role of the currently defined roles list. 
- The `name` argument is of type String. 
- Return type is a Role object.

```javascript
var role = acl.role('admin');
```

#### addRole(name, parent)
Adds a role the the list of roles.
- The `name` argument is of type String. 
- The `parent` argument is optional and of type String. 
- Returns true is succeeded.

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

#### resource(name)
Returns a resource of the currently defined resources list. 
- The `name` argument is of type String. 
- Return type is a Resource object.

```javascript
var resource = acl.resource('products');
```

#### addResource(name, actions)
Adds a resources the the list of resources. Actions are optional but can be used to have more control.
- The `name` argument is of type String. 
- The `actions` argument is optional and of type String or Array. 
- Returns true is succeeded.

```javascript
// equivalents
acl.addResource('profile');
acl.addResource('profile', '*');
acl.addResource('profile', ['*']);
```
```javascript
acl.addResource('products', ['list','detail','edit','delete','update']);
```

### Development
---
### Todo's
---
### License
---
MIT
