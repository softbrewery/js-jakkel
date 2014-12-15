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



### Development
---
### Todo's
---
### License
---
MIT
