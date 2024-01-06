"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var express = require('express');
var _require = require('uuid'),
  uuidv4 = _require.v4,
  isUuid = _require.validate;
var dotenv = require('dotenv');
dotenv.config();
var app = express();
var port = process.env.PORT || 3000;

// In-memory database (simple array)
var users = [{
  id: uuidv4(),
  username: 'John Doe',
  age: 25,
  hobbies: ['Reading', 'Traveling']
}, {
  id: uuidv4(),
  username: 'Jane Doe',
  age: 30,
  hobbies: ['Cooking', 'Painting']
}];
app.use(express.json());

// GET all users
app.get('/api/users', function (req, res) {
  res.status(200).json(users);
});

// GET a single user by ID
app.get('/api/users/:id', function (req, res) {
  var userId = req.params.id;
  if (!isUuid(userId)) {
    return res.status(400).json({
      error: 'Invalid userId format'
    });
  }
  var user = users.find(function (u) {
    return u.id === userId;
  });
  if (user) {
    return res.status(200).json(user);
  } else {
    return res.status(404).json({
      error: 'User not found'
    });
  }
});

// POST a new user
app.post('/api/users', function (req, res) {
  var _req$body = req.body,
    username = _req$body.username,
    age = _req$body.age,
    hobbies = _req$body.hobbies;
  if (!username || !age) {
    return res.status(400).json({
      error: 'Username and age are required fields'
    });
  }
  var newUser = {
    id: uuidv4(),
    username: username,
    age: age,
    hobbies: hobbies || []
  };
  users.push(newUser);
  res.status(201).json(newUser);
});

// PUT/update an existing user
app.put('/api/users/:id', function (req, res) {
  var userId = req.params.id;
  if (!isUuid(userId)) {
    return res.status(400).json({
      error: 'Invalid userId format'
    });
  }
  var userIndex = users.findIndex(function (u) {
    return u.id === userId;
  });
  if (userIndex !== -1) {
    var _req$body2 = req.body,
      username = _req$body2.username,
      age = _req$body2.age,
      hobbies = _req$body2.hobbies;
    users[userIndex] = _objectSpread(_objectSpread({}, users[userIndex]), {}, {
      username: username,
      age: age,
      hobbies: hobbies || []
    });
    return res.status(200).json(users[userIndex]);
  } else {
    return res.status(404).json({
      error: 'User not found'
    });
  }
});

// DELETE a user by ID
app["delete"]('/api/users/:id', function (req, res) {
  var userId = req.params.id;
  if (!isUuid(userId)) {
    return res.status(400).json({
      error: 'Invalid userId format'
    });
  }
  var userIndex = users.findIndex(function (u) {
    return u.id === userId;
  });
  if (userIndex !== -1) {
    users.splice(userIndex, 1);
    return res.status(204).send();
  } else {
    return res.status(404).json({
      error: 'User not found'
    });
  }
});

// Handling non-existing endpoints
app.use(function (req, res) {
  res.status(404).json({
    error: 'Endpoint not found'
  });
});

// Handling server-side errors
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error'
  });
});
app.listen(port, function () {
  console.log("Server listening at http://localhost:".concat(port));
});
module.exports = app;