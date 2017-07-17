(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.coreapi = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BasicAuthentication = function () {
  function BasicAuthentication() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, BasicAuthentication);

    var username = options.username;
    var password = options.password;
    var hash = window.btoa(username + ':' + password);
    this.auth = 'Basic ' + hash;
  }

  _createClass(BasicAuthentication, [{
    key: 'authenticate',
    value: function authenticate(options) {
      options.headers['Authorization'] = this.auth;
      return options;
    }
  }]);

  return BasicAuthentication;
}();

module.exports = {
  BasicAuthentication: BasicAuthentication
};

},{}],2:[function(require,module,exports){
'use strict';

var basic = require('./basic');
var session = require('./session');
var token = require('./token');

module.exports = {
  BasicAuthentication: basic.BasicAuthentication,
  SessionAuthentication: session.SessionAuthentication,
  TokenAuthentication: token.TokenAuthentication
};

},{"./basic":1,"./session":3,"./token":4}],3:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var utils = require('../utils');

function trim(str) {
  return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}

function getCookie(cookieName, cookieString) {
  cookieString = cookieString || window.document.cookie;
  if (cookieString && cookieString !== '') {
    var cookies = cookieString.split(';');
    for (var i = 0; i < cookies.length; i++) {
      var cookie = trim(cookies[i]);
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, cookieName.length + 1) === cookieName + '=') {
        return decodeURIComponent(cookie.substring(cookieName.length + 1));
      }
    }
  }
  return null;
}

var SessionAuthentication = function () {
  function SessionAuthentication() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, SessionAuthentication);

    this.csrfToken = getCookie(options.csrfCookieName, options.cookieString);
    this.csrfHeaderName = options.csrfHeaderName;
  }

  _createClass(SessionAuthentication, [{
    key: 'authenticate',
    value: function authenticate(options) {
      options.credentials = 'same-origin';
      if (this.csrfToken && !utils.csrfSafeMethod(options.method)) {
        options.headers[this.csrfHeaderName] = this.csrfToken;
      }
      return options;
    }
  }]);

  return SessionAuthentication;
}();

module.exports = {
  SessionAuthentication: SessionAuthentication
};

},{"../utils":15}],4:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TokenAuthentication = function () {
  function TokenAuthentication() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, TokenAuthentication);

    this.token = options.token;
    this.scheme = options.scheme || 'Bearer';
  }

  _createClass(TokenAuthentication, [{
    key: 'authenticate',
    value: function authenticate(options) {
      options.headers['Authorization'] = this.scheme + ' ' + this.token;
      return options;
    }
  }]);

  return TokenAuthentication;
}();

module.exports = {
  TokenAuthentication: TokenAuthentication
};

},{}],5:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var document = require('./document');
var codecs = require('./codecs');
var errors = require('./errors');
var transports = require('./transports');
var utils = require('./utils');

function lookupLink(node, keys) {
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = keys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var key = _step.value;

      if (node instanceof document.Document) {
        node = node.content[key];
      } else {
        node = node[key];
      }
      if (node === undefined) {
        throw new errors.LinkLookupError('Invalid link lookup: ' + JSON.stringify(keys));
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  if (!(node instanceof document.Link)) {
    throw new errors.LinkLookupError('Invalid link lookup: ' + JSON.stringify(keys));
  }
  return node;
}

var Client = function () {
  function Client() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Client);

    var transportOptions = {
      auth: options.auth || null,
      headers: options.headers || {},
      requestCallback: options.requestCallback,
      responseCallback: options.responseCallback
    };

    this.decoders = options.decoders || [new codecs.CoreJSONCodec(), new codecs.JSONCodec(), new codecs.TextCodec()];
    this.transports = options.transports || [new transports.HTTPTransport(transportOptions)];
  }

  _createClass(Client, [{
    key: 'action',
    value: function action(document, keys) {
      var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var validate = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

      var link = lookupLink(document, keys);
      var transport = utils.determineTransport(this.transports, link.url);
      return transport.action(link, this.decoders, params, validate = validate);
    }
  }, {
    key: 'get',
    value: function get(url) {
      var link = new document.Link(url, 'get');
      var transport = utils.determineTransport(this.transports, url);
      return transport.action(link, this.decoders);
    }
  }]);

  return Client;
}();

module.exports = {
  Client: Client
};

},{"./codecs":7,"./document":10,"./errors":11,"./transports":14,"./utils":15}],6:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var document = require('../document');
var URL = require('url-parse');

function unescapeKey(key) {
  if (key.match(/__(type|meta)$/)) {
    return key.substring(1);
  }
  return key;
}

function getString(obj, key) {
  var value = obj[key];
  if (typeof value === 'string') {
    return value;
  }
  return '';
}

function getBoolean(obj, key) {
  var value = obj[key];
  if (typeof value === 'boolean') {
    return value;
  }
  return false;
}

function getObject(obj, key) {
  var value = obj[key];
  if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
    return value;
  }
  return {};
}

function getArray(obj, key) {
  var value = obj[key];
  if (value instanceof Array) {
    return value;
  }
  return [];
}

function getContent(data, baseUrl) {
  var excluded = ['_type', '_meta'];
  var content = {};
  for (var property in data) {
    if (data.hasOwnProperty(property) && !excluded.includes(property)) {
      var key = unescapeKey(property);
      var value = primitiveToNode(data[property], baseUrl);
      content[key] = value;
    }
  }
  return content;
}

function primitiveToNode(data, baseUrl) {
  var isObject = data instanceof Object && !(data instanceof Array);

  if (isObject && data._type === 'document') {
    // Document
    var meta = getObject(data, '_meta');
    var relativeUrl = getString(meta, 'url');
    var url = relativeUrl ? URL(relativeUrl, baseUrl).toString() : '';
    var title = getString(meta, 'title');
    var description = getString(meta, 'description');
    var content = getContent(data, url);
    return new document.Document(url, title, description, content);
  } else if (isObject && data._type === 'link') {
    // Link
    var _relativeUrl = getString(data, 'url');
    var _url = _relativeUrl ? URL(_relativeUrl, baseUrl).toString() : '';
    var method = getString(data, 'action') || 'get';
    var _title = getString(data, 'title');
    var _description = getString(data, 'description');
    var fieldsData = getArray(data, 'fields');
    var fields = [];
    for (var idx = 0, len = fieldsData.length; idx < len; idx++) {
      var value = fieldsData[idx];
      var name = getString(value, 'name');
      var required = getBoolean(value, 'required');
      var location = getString(value, 'location');
      var fieldDescription = getString(value, 'fieldDescription');
      var field = new document.Field(name, required, location, fieldDescription);
      fields.push(field);
    }
    return new document.Link(_url, method, 'application/json', fields, _title, _description);
  } else if (isObject) {
    // Object
    var _content = {};
    for (var key in data) {
      if (data.hasOwnProperty(key)) {
        _content[key] = primitiveToNode(data[key], baseUrl);
      }
    }
    return _content;
  } else if (data instanceof Array) {
    // Object
    var _content2 = [];
    for (var _idx = 0, _len = data.length; _idx < _len; _idx++) {
      _content2.push(primitiveToNode(data[_idx], baseUrl));
    }
    return _content2;
  }
  // Primitive
  return data;
}

var CoreJSONCodec = function () {
  function CoreJSONCodec() {
    _classCallCheck(this, CoreJSONCodec);

    this.mediaType = 'application/coreapi+json';
  }

  _createClass(CoreJSONCodec, [{
    key: 'decode',
    value: function decode(text) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var data = text;
      if (options.preloaded === undefined || !options.preloaded) {
        data = JSON.parse(text);
      }
      return primitiveToNode(data, options.url);
    }
  }]);

  return CoreJSONCodec;
}();

module.exports = {
  CoreJSONCodec: CoreJSONCodec
};

},{"../document":10,"url-parse":19}],7:[function(require,module,exports){
'use strict';

var corejson = require('./corejson');
var json = require('./json');
var text = require('./text');

module.exports = {
  CoreJSONCodec: corejson.CoreJSONCodec,
  JSONCodec: json.JSONCodec,
  TextCodec: text.TextCodec
};

},{"./corejson":6,"./json":8,"./text":9}],8:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var JSONCodec = function () {
  function JSONCodec() {
    _classCallCheck(this, JSONCodec);

    this.mediaType = 'application/json';
  }

  _createClass(JSONCodec, [{
    key: 'decode',
    value: function decode(text) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      return JSON.parse(text);
    }
  }]);

  return JSONCodec;
}();

module.exports = {
  JSONCodec: JSONCodec
};

},{}],9:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TextCodec = function () {
  function TextCodec() {
    _classCallCheck(this, TextCodec);

    this.mediaType = 'text/*';
  }

  _createClass(TextCodec, [{
    key: 'decode',
    value: function decode(text) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      return text;
    }
  }]);

  return TextCodec;
}();

module.exports = {
  TextCodec: TextCodec
};

},{}],10:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Document = function Document() {
  var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var title = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var description = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  var content = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  _classCallCheck(this, Document);

  this.url = url;
  this.title = title;
  this.description = description;
  this.content = content;
};

var Link = function Link(url, method) {
  var encoding = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'application/json';
  var fields = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
  var title = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : '';
  var description = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : '';

  _classCallCheck(this, Link);

  if (url === undefined) {
    throw new Error('url argument is required');
  }

  if (method === undefined) {
    throw new Error('method argument is required');
  }

  this.url = url;
  this.method = method;
  this.encoding = encoding;
  this.fields = fields;
  this.title = title;
  this.description = description;
};

var Field = function Field(name) {
  var required = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var location = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  var description = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';

  _classCallCheck(this, Field);

  if (name === undefined) {
    throw new Error('name argument is required');
  }

  this.name = name;
  this.required = required;
  this.location = location;
  this.description = description;
};

module.exports = {
  Document: Document,
  Link: Link,
  Field: Field
};

},{}],11:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ParameterError = function (_Error) {
  _inherits(ParameterError, _Error);

  function ParameterError(message) {
    _classCallCheck(this, ParameterError);

    var _this = _possibleConstructorReturn(this, (ParameterError.__proto__ || Object.getPrototypeOf(ParameterError)).call(this, message));

    _this.message = message;
    _this.name = 'ParameterError';
    return _this;
  }

  return ParameterError;
}(Error);

var LinkLookupError = function (_Error2) {
  _inherits(LinkLookupError, _Error2);

  function LinkLookupError(message) {
    _classCallCheck(this, LinkLookupError);

    var _this2 = _possibleConstructorReturn(this, (LinkLookupError.__proto__ || Object.getPrototypeOf(LinkLookupError)).call(this, message));

    _this2.message = message;
    _this2.name = 'LinkLookupError';
    return _this2;
  }

  return LinkLookupError;
}(Error);

var ErrorMessage = function (_Error3) {
  _inherits(ErrorMessage, _Error3);

  function ErrorMessage(message, content) {
    _classCallCheck(this, ErrorMessage);

    var _this3 = _possibleConstructorReturn(this, (ErrorMessage.__proto__ || Object.getPrototypeOf(ErrorMessage)).call(this, message));

    _this3.message = message;
    _this3.content = content;
    _this3.name = 'ErrorMessage';
    return _this3;
  }

  return ErrorMessage;
}(Error);

module.exports = {
  ParameterError: ParameterError,
  LinkLookupError: LinkLookupError,
  ErrorMessage: ErrorMessage
};

},{}],12:[function(require,module,exports){
'use strict';

var auth = require('./auth');
var client = require('./client');
var codecs = require('./codecs');
var document = require('./document');
var errors = require('./errors');
var transports = require('./transports');
var utils = require('./utils');

var coreapi = {
  Client: client.Client,
  Document: document.Document,
  Link: document.Link,
  auth: auth,
  codecs: codecs,
  errors: errors,
  transports: transports,
  utils: utils
};

module.exports = coreapi;

},{"./auth":2,"./client":5,"./codecs":7,"./document":10,"./errors":11,"./transports":14,"./utils":15}],13:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var fetch = require('isomorphic-fetch');
var errors = require('../errors');
var utils = require('../utils');
var URL = require('url-parse');
var urlTemplate = require('url-template');

var parseResponse = function parseResponse(response, decoders, responseCallback) {
  return response.text().then(function (text) {
    if (responseCallback) {
      responseCallback(response, text);
    }
    var contentType = response.headers.get('Content-Type');
    var decoder = utils.negotiateDecoder(decoders, contentType);
    var options = { url: response.url };
    return decoder.decode(text, options);
  });
};

var HTTPTransport = function () {
  function HTTPTransport() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, HTTPTransport);

    this.schemes = ['http', 'https'];
    this.auth = options.auth || null;
    this.headers = options.headers || {};
    this.fetch = options.fetch || fetch;
    this.FormData = options.FormData || window.FormData;
    this.requestCallback = options.requestCallback;
    this.responseCallback = options.responseCallback;
  }

  _createClass(HTTPTransport, [{
    key: 'buildRequest',
    value: function buildRequest(link, decoders) {
      var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var validate = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

      var fields = link.fields;
      var method = link.method.toUpperCase();
      var queryParams = {};
      var pathParams = {};
      var formParams = {};
      var fieldNames = [];
      var hasBody = false;

      for (var idx = 0, len = fields.length; idx < len; idx++) {
        var field = fields[idx];

        // Ensure any required fields are included
        if (!params.hasOwnProperty(field.name)) {
          if (field.required) {
            throw new errors.ParameterError('Missing required field: "' + field.name + '"');
          } else {
            continue;
          }
        }

        fieldNames.push(field.name);
        if (field.location === 'query') {
          queryParams[field.name] = params[field.name];
        } else if (field.location === 'path') {
          pathParams[field.name] = params[field.name];
        } else if (field.location === 'form') {
          formParams[field.name] = params[field.name];
          hasBody = true;
        } else if (field.location === 'body') {
          formParams = params[field.name];
          hasBody = true;
        }
      }

      // Check for any parameters that did not have a matching field
      // if @param validate is true, add the extra parameter to queryParams
      for (var property in params) {
        if (params.hasOwnProperty(property) && !fieldNames.includes(property) && validate) {
          throw new errors.ParameterError('Unknown parameter: "' + property + '"');
        } else if (!fieldNames.includes(property)) {
          fieldNames.push(property);
          queryParams[property] = params[property];
        }
      }

      var requestOptions = { method: method, headers: {} };

      Object.assign(requestOptions.headers, this.headers);

      if (hasBody) {
        if (link.encoding === 'application/json') {
          requestOptions.body = JSON.stringify(formParams);
          requestOptions.headers['Content-Type'] = 'application/json';
        } else if (link.encoding === 'multipart/form-data') {
          var form = new this.FormData();

          for (var paramKey in formParams) {
            form.append(paramKey, formParams[paramKey]);
          }
          requestOptions.body = form;
        } else if (link.encoding === 'application/x-www-form-urlencoded') {
          var formBody = [];
          for (var _paramKey in formParams) {
            var encodedKey = encodeURIComponent(_paramKey);
            var encodedValue = encodeURIComponent(formParams[_paramKey]);
            formBody.push(encodedKey + '=' + encodedValue);
          }
          formBody = formBody.join('&');

          requestOptions.body = formBody;
          requestOptions.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        }
      }

      if (this.auth) {
        requestOptions = this.auth.authenticate(requestOptions);
      }

      var parsedUrl = urlTemplate.parse(link.url);
      parsedUrl = parsedUrl.expand(pathParams);
      parsedUrl = new URL(parsedUrl);
      parsedUrl.set('query', queryParams);

      return {
        url: parsedUrl.toString(),
        options: requestOptions
      };
    }
  }, {
    key: 'action',
    value: function action(link, decoders) {
      var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var validate = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

      var responseCallback = this.responseCallback;
      var request = this.buildRequest(link, decoders, params, validate = validate);

      if (this.requestCallback) {
        this.requestCallback(request);
      }

      return this.fetch(request.url, request.options).then(function (response) {
        return parseResponse(response, decoders, responseCallback).then(function (data) {
          if (response.ok) {
            return data;
          } else {
            var title = response.status + ' ' + response.statusText;
            var error = new errors.ErrorMessage(title, data);
            return Promise.reject(error);
          }
        });
      });
    }
  }]);

  return HTTPTransport;
}();

module.exports = {
  HTTPTransport: HTTPTransport
};

},{"../errors":11,"../utils":15,"isomorphic-fetch":16,"url-parse":19,"url-template":20}],14:[function(require,module,exports){
'use strict';

var http = require('./http');

module.exports = {
  HTTPTransport: http.HTTPTransport
};

},{"./http":13}],15:[function(require,module,exports){
'use strict';

var URL = require('url-parse');

var determineTransport = function determineTransport(transports, url) {
  var parsedUrl = new URL(url);
  var scheme = parsedUrl.protocol.replace(':', '');

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = transports[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var transport = _step.value;

      if (transport.schemes.includes(scheme)) {
        return transport;
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  throw Error('Unsupported scheme in URL: ' + url);
};

var negotiateDecoder = function negotiateDecoder(decoders, contentType) {
  if (contentType === undefined || contentType === null) {
    return decoders[2];
  }

  var fullType = contentType.toLowerCase().split(';')[0].trim();
  var mainType = fullType.split('/')[0] + '/*';
  var wildcardType = '*/*';
  var acceptableTypes = [fullType, mainType, wildcardType];

  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = decoders[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var decoder = _step2.value;

      if (acceptableTypes.includes(decoder.mediaType)) {
        return decoder;
      }
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  throw Error('Unsupported media in Content-Type header: ' + contentType);
};

var csrfSafeMethod = function csrfSafeMethod(method) {
  // these HTTP methods do not require CSRF protection
  return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method)
  );
};

module.exports = {
  determineTransport: determineTransport,
  negotiateDecoder: negotiateDecoder,
  csrfSafeMethod: csrfSafeMethod
};

},{"url-parse":19}],16:[function(require,module,exports){
// the whatwg-fetch polyfill installs the fetch() function
// on the global object (window or self)
//
// Return that as the export for use in Webpack, Browserify etc.
require('whatwg-fetch');
module.exports = self.fetch.bind(self);

},{"whatwg-fetch":21}],17:[function(require,module,exports){
'use strict';

var has = Object.prototype.hasOwnProperty;

/**
 * Decode a URI encoded string.
 *
 * @param {String} input The URI encoded string.
 * @returns {String} The decoded string.
 * @api private
 */
function decode(input) {
  return decodeURIComponent(input.replace(/\+/g, ' '));
}

/**
 * Simple query string parser.
 *
 * @param {String} query The query string that needs to be parsed.
 * @returns {Object}
 * @api public
 */
function querystring(query) {
  var parser = /([^=?&]+)=?([^&]*)/g
    , result = {}
    , part;

  //
  // Little nifty parsing hack, leverage the fact that RegExp.exec increments
  // the lastIndex property so we can continue executing this loop until we've
  // parsed all results.
  //
  for (;
    part = parser.exec(query);
    result[decode(part[1])] = decode(part[2])
  );

  return result;
}

/**
 * Transform a query string to an object.
 *
 * @param {Object} obj Object that should be transformed.
 * @param {String} prefix Optional prefix.
 * @returns {String}
 * @api public
 */
function querystringify(obj, prefix) {
  prefix = prefix || '';

  var pairs = [];

  //
  // Optionally prefix with a '?' if needed
  //
  if ('string' !== typeof prefix) prefix = '?';

  for (var key in obj) {
    if (has.call(obj, key)) {
      pairs.push(encodeURIComponent(key) +'='+ encodeURIComponent(obj[key]));
    }
  }

  return pairs.length ? prefix + pairs.join('&') : '';
}

//
// Expose the module.
//
exports.stringify = querystringify;
exports.parse = querystring;

},{}],18:[function(require,module,exports){
'use strict';

/**
 * Check if we're required to add a port number.
 *
 * @see https://url.spec.whatwg.org/#default-port
 * @param {Number|String} port Port number we need to check
 * @param {String} protocol Protocol we need to check against.
 * @returns {Boolean} Is it a default port for the given protocol
 * @api private
 */
module.exports = function required(port, protocol) {
  protocol = protocol.split(':')[0];
  port = +port;

  if (!port) return false;

  switch (protocol) {
    case 'http':
    case 'ws':
    return port !== 80;

    case 'https':
    case 'wss':
    return port !== 443;

    case 'ftp':
    return port !== 21;

    case 'gopher':
    return port !== 70;

    case 'file':
    return false;
  }

  return port !== 0;
};

},{}],19:[function(require,module,exports){
(function (global){
'use strict';

var required = require('requires-port')
  , qs = require('querystringify')
  , protocolre = /^([a-z][a-z0-9.+-]*:)?(\/\/)?([\S\s]*)/i
  , slashes = /^[A-Za-z][A-Za-z0-9+-.]*:\/\//;

/**
 * These are the parse rules for the URL parser, it informs the parser
 * about:
 *
 * 0. The char it Needs to parse, if it's a string it should be done using
 *    indexOf, RegExp using exec and NaN means set as current value.
 * 1. The property we should set when parsing this value.
 * 2. Indication if it's backwards or forward parsing, when set as number it's
 *    the value of extra chars that should be split off.
 * 3. Inherit from location if non existing in the parser.
 * 4. `toLowerCase` the resulting value.
 */
var rules = [
  ['#', 'hash'],                        // Extract from the back.
  ['?', 'query'],                       // Extract from the back.
  ['/', 'pathname'],                    // Extract from the back.
  ['@', 'auth', 1],                     // Extract from the front.
  [NaN, 'host', undefined, 1, 1],       // Set left over value.
  [/:(\d+)$/, 'port', undefined, 1],    // RegExp the back.
  [NaN, 'hostname', undefined, 1, 1]    // Set left over.
];

/**
 * These properties should not be copied or inherited from. This is only needed
 * for all non blob URL's as a blob URL does not include a hash, only the
 * origin.
 *
 * @type {Object}
 * @private
 */
var ignore = { hash: 1, query: 1 };

/**
 * The location object differs when your code is loaded through a normal page,
 * Worker or through a worker using a blob. And with the blobble begins the
 * trouble as the location object will contain the URL of the blob, not the
 * location of the page where our code is loaded in. The actual origin is
 * encoded in the `pathname` so we can thankfully generate a good "default"
 * location from it so we can generate proper relative URL's again.
 *
 * @param {Object|String} loc Optional default location object.
 * @returns {Object} lolcation object.
 * @api public
 */
function lolcation(loc) {
  loc = loc || global.location || {};

  var finaldestination = {}
    , type = typeof loc
    , key;

  if ('blob:' === loc.protocol) {
    finaldestination = new URL(unescape(loc.pathname), {});
  } else if ('string' === type) {
    finaldestination = new URL(loc, {});
    for (key in ignore) delete finaldestination[key];
  } else if ('object' === type) {
    for (key in loc) {
      if (key in ignore) continue;
      finaldestination[key] = loc[key];
    }

    if (finaldestination.slashes === undefined) {
      finaldestination.slashes = slashes.test(loc.href);
    }
  }

  return finaldestination;
}

/**
 * @typedef ProtocolExtract
 * @type Object
 * @property {String} protocol Protocol matched in the URL, in lowercase.
 * @property {Boolean} slashes `true` if protocol is followed by "//", else `false`.
 * @property {String} rest Rest of the URL that is not part of the protocol.
 */

/**
 * Extract protocol information from a URL with/without double slash ("//").
 *
 * @param {String} address URL we want to extract from.
 * @return {ProtocolExtract} Extracted information.
 * @api private
 */
function extractProtocol(address) {
  var match = protocolre.exec(address);

  return {
    protocol: match[1] ? match[1].toLowerCase() : '',
    slashes: !!match[2],
    rest: match[3]
  };
}

/**
 * Resolve a relative URL pathname against a base URL pathname.
 *
 * @param {String} relative Pathname of the relative URL.
 * @param {String} base Pathname of the base URL.
 * @return {String} Resolved pathname.
 * @api private
 */
function resolve(relative, base) {
  var path = (base || '/').split('/').slice(0, -1).concat(relative.split('/'))
    , i = path.length
    , last = path[i - 1]
    , unshift = false
    , up = 0;

  while (i--) {
    if (path[i] === '.') {
      path.splice(i, 1);
    } else if (path[i] === '..') {
      path.splice(i, 1);
      up++;
    } else if (up) {
      if (i === 0) unshift = true;
      path.splice(i, 1);
      up--;
    }
  }

  if (unshift) path.unshift('');
  if (last === '.' || last === '..') path.push('');

  return path.join('/');
}

/**
 * The actual URL instance. Instead of returning an object we've opted-in to
 * create an actual constructor as it's much more memory efficient and
 * faster and it pleases my OCD.
 *
 * @constructor
 * @param {String} address URL we want to parse.
 * @param {Object|String} location Location defaults for relative paths.
 * @param {Boolean|Function} parser Parser for the query string.
 * @api public
 */
function URL(address, location, parser) {
  if (!(this instanceof URL)) {
    return new URL(address, location, parser);
  }

  var relative, extracted, parse, instruction, index, key
    , instructions = rules.slice()
    , type = typeof location
    , url = this
    , i = 0;

  //
  // The following if statements allows this module two have compatibility with
  // 2 different API:
  //
  // 1. Node.js's `url.parse` api which accepts a URL, boolean as arguments
  //    where the boolean indicates that the query string should also be parsed.
  //
  // 2. The `URL` interface of the browser which accepts a URL, object as
  //    arguments. The supplied object will be used as default values / fall-back
  //    for relative paths.
  //
  if ('object' !== type && 'string' !== type) {
    parser = location;
    location = null;
  }

  if (parser && 'function' !== typeof parser) parser = qs.parse;

  location = lolcation(location);

  //
  // Extract protocol information before running the instructions.
  //
  extracted = extractProtocol(address || '');
  relative = !extracted.protocol && !extracted.slashes;
  url.slashes = extracted.slashes || relative && location.slashes;
  url.protocol = extracted.protocol || location.protocol || '';
  address = extracted.rest;

  //
  // When the authority component is absent the URL starts with a path
  // component.
  //
  if (!extracted.slashes) instructions[2] = [/(.*)/, 'pathname'];

  for (; i < instructions.length; i++) {
    instruction = instructions[i];
    parse = instruction[0];
    key = instruction[1];

    if (parse !== parse) {
      url[key] = address;
    } else if ('string' === typeof parse) {
      if (~(index = address.indexOf(parse))) {
        if ('number' === typeof instruction[2]) {
          url[key] = address.slice(0, index);
          address = address.slice(index + instruction[2]);
        } else {
          url[key] = address.slice(index);
          address = address.slice(0, index);
        }
      }
    } else if ((index = parse.exec(address))) {
      url[key] = index[1];
      address = address.slice(0, index.index);
    }

    url[key] = url[key] || (
      relative && instruction[3] ? location[key] || '' : ''
    );

    //
    // Hostname, host and protocol should be lowercased so they can be used to
    // create a proper `origin`.
    //
    if (instruction[4]) url[key] = url[key].toLowerCase();
  }

  //
  // Also parse the supplied query string in to an object. If we're supplied
  // with a custom parser as function use that instead of the default build-in
  // parser.
  //
  if (parser) url.query = parser(url.query);

  //
  // If the URL is relative, resolve the pathname against the base URL.
  //
  if (
      relative
    && location.slashes
    && url.pathname.charAt(0) !== '/'
    && (url.pathname !== '' || location.pathname !== '')
  ) {
    url.pathname = resolve(url.pathname, location.pathname);
  }

  //
  // We should not add port numbers if they are already the default port number
  // for a given protocol. As the host also contains the port number we're going
  // override it with the hostname which contains no port number.
  //
  if (!required(url.port, url.protocol)) {
    url.host = url.hostname;
    url.port = '';
  }

  //
  // Parse down the `auth` for the username and password.
  //
  url.username = url.password = '';
  if (url.auth) {
    instruction = url.auth.split(':');
    url.username = instruction[0] || '';
    url.password = instruction[1] || '';
  }

  url.origin = url.protocol && url.host && url.protocol !== 'file:'
    ? url.protocol +'//'+ url.host
    : 'null';

  //
  // The href is just the compiled result.
  //
  url.href = url.toString();
}

/**
 * This is convenience method for changing properties in the URL instance to
 * insure that they all propagate correctly.
 *
 * @param {String} part          Property we need to adjust.
 * @param {Mixed} value          The newly assigned value.
 * @param {Boolean|Function} fn  When setting the query, it will be the function
 *                               used to parse the query.
 *                               When setting the protocol, double slash will be
 *                               removed from the final url if it is true.
 * @returns {URL}
 * @api public
 */
function set(part, value, fn) {
  var url = this;

  switch (part) {
    case 'query':
      if ('string' === typeof value && value.length) {
        value = (fn || qs.parse)(value);
      }

      url[part] = value;
      break;

    case 'port':
      url[part] = value;

      if (!required(value, url.protocol)) {
        url.host = url.hostname;
        url[part] = '';
      } else if (value) {
        url.host = url.hostname +':'+ value;
      }

      break;

    case 'hostname':
      url[part] = value;

      if (url.port) value += ':'+ url.port;
      url.host = value;
      break;

    case 'host':
      url[part] = value;

      if (/:\d+$/.test(value)) {
        value = value.split(':');
        url.port = value.pop();
        url.hostname = value.join(':');
      } else {
        url.hostname = value;
        url.port = '';
      }

      break;

    case 'protocol':
      url.protocol = value.toLowerCase();
      url.slashes = !fn;
      break;

    case 'pathname':
      url.pathname = value.length && value.charAt(0) !== '/' ? '/' + value : value;

      break;

    default:
      url[part] = value;
  }

  for (var i = 0; i < rules.length; i++) {
    var ins = rules[i];

    if (ins[4]) url[ins[1]] = url[ins[1]].toLowerCase();
  }

  url.origin = url.protocol && url.host && url.protocol !== 'file:'
    ? url.protocol +'//'+ url.host
    : 'null';

  url.href = url.toString();

  return url;
}

/**
 * Transform the properties back in to a valid and full URL string.
 *
 * @param {Function} stringify Optional query stringify function.
 * @returns {String}
 * @api public
 */
function toString(stringify) {
  if (!stringify || 'function' !== typeof stringify) stringify = qs.stringify;

  var query
    , url = this
    , protocol = url.protocol;

  if (protocol && protocol.charAt(protocol.length - 1) !== ':') protocol += ':';

  var result = protocol + (url.slashes ? '//' : '');

  if (url.username) {
    result += url.username;
    if (url.password) result += ':'+ url.password;
    result += '@';
  }

  result += url.host + url.pathname;

  query = 'object' === typeof url.query ? stringify(url.query) : url.query;
  if (query) result += '?' !== query.charAt(0) ? '?'+ query : query;

  if (url.hash) result += url.hash;

  return result;
}

URL.prototype = { set: set, toString: toString };

//
// Expose the URL parser and some additional properties that might be useful for
// others or testing.
//
URL.extractProtocol = extractProtocol;
URL.location = lolcation;
URL.qs = qs;

module.exports = URL;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"querystringify":17,"requires-port":18}],20:[function(require,module,exports){
(function (root, factory) {
    if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else {
        root.urltemplate = factory();
    }
}(this, function () {
  /**
   * @constructor
   */
  function UrlTemplate() {
  }

  /**
   * @private
   * @param {string} str
   * @return {string}
   */
  UrlTemplate.prototype.encodeReserved = function (str) {
    return str.split(/(%[0-9A-Fa-f]{2})/g).map(function (part) {
      if (!/%[0-9A-Fa-f]/.test(part)) {
        part = encodeURI(part).replace(/%5B/g, '[').replace(/%5D/g, ']');
      }
      return part;
    }).join('');
  };

  /**
   * @private
   * @param {string} str
   * @return {string}
   */
  UrlTemplate.prototype.encodeUnreserved = function (str) {
    return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
      return '%' + c.charCodeAt(0).toString(16).toUpperCase();
    });
  }

  /**
   * @private
   * @param {string} operator
   * @param {string} value
   * @param {string} key
   * @return {string}
   */
  UrlTemplate.prototype.encodeValue = function (operator, value, key) {
    value = (operator === '+' || operator === '#') ? this.encodeReserved(value) : this.encodeUnreserved(value);

    if (key) {
      return this.encodeUnreserved(key) + '=' + value;
    } else {
      return value;
    }
  };

  /**
   * @private
   * @param {*} value
   * @return {boolean}
   */
  UrlTemplate.prototype.isDefined = function (value) {
    return value !== undefined && value !== null;
  };

  /**
   * @private
   * @param {string}
   * @return {boolean}
   */
  UrlTemplate.prototype.isKeyOperator = function (operator) {
    return operator === ';' || operator === '&' || operator === '?';
  };

  /**
   * @private
   * @param {Object} context
   * @param {string} operator
   * @param {string} key
   * @param {string} modifier
   */
  UrlTemplate.prototype.getValues = function (context, operator, key, modifier) {
    var value = context[key],
        result = [];

    if (this.isDefined(value) && value !== '') {
      if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        value = value.toString();

        if (modifier && modifier !== '*') {
          value = value.substring(0, parseInt(modifier, 10));
        }

        result.push(this.encodeValue(operator, value, this.isKeyOperator(operator) ? key : null));
      } else {
        if (modifier === '*') {
          if (Array.isArray(value)) {
            value.filter(this.isDefined).forEach(function (value) {
              result.push(this.encodeValue(operator, value, this.isKeyOperator(operator) ? key : null));
            }, this);
          } else {
            Object.keys(value).forEach(function (k) {
              if (this.isDefined(value[k])) {
                result.push(this.encodeValue(operator, value[k], k));
              }
            }, this);
          }
        } else {
          var tmp = [];

          if (Array.isArray(value)) {
            value.filter(this.isDefined).forEach(function (value) {
              tmp.push(this.encodeValue(operator, value));
            }, this);
          } else {
            Object.keys(value).forEach(function (k) {
              if (this.isDefined(value[k])) {
                tmp.push(this.encodeUnreserved(k));
                tmp.push(this.encodeValue(operator, value[k].toString()));
              }
            }, this);
          }

          if (this.isKeyOperator(operator)) {
            result.push(this.encodeUnreserved(key) + '=' + tmp.join(','));
          } else if (tmp.length !== 0) {
            result.push(tmp.join(','));
          }
        }
      }
    } else {
      if (operator === ';') {
        if (this.isDefined(value)) {
          result.push(this.encodeUnreserved(key));
        }
      } else if (value === '' && (operator === '&' || operator === '?')) {
        result.push(this.encodeUnreserved(key) + '=');
      } else if (value === '') {
        result.push('');
      }
    }
    return result;
  };

  /**
   * @param {string} template
   * @return {function(Object):string}
   */
  UrlTemplate.prototype.parse = function (template) {
    var that = this;
    var operators = ['+', '#', '.', '/', ';', '?', '&'];

    return {
      expand: function (context) {
        return template.replace(/\{([^\{\}]+)\}|([^\{\}]+)/g, function (_, expression, literal) {
          if (expression) {
            var operator = null,
                values = [];

            if (operators.indexOf(expression.charAt(0)) !== -1) {
              operator = expression.charAt(0);
              expression = expression.substr(1);
            }

            expression.split(/,/g).forEach(function (variable) {
              var tmp = /([^:\*]*)(?::(\d+)|(\*))?/.exec(variable);
              values.push.apply(values, that.getValues(context, operator, tmp[1], tmp[2] || tmp[3]));
            });

            if (operator && operator !== '+') {
              var separator = ',';

              if (operator === '?') {
                separator = '&';
              } else if (operator !== '#') {
                separator = operator;
              }
              return (values.length !== 0 ? operator : '') + values.join(separator);
            } else {
              return values.join(',');
            }
          } else {
            return that.encodeReserved(literal);
          }
        });
      }
    };
  };

  return new UrlTemplate();
}));

},{}],21:[function(require,module,exports){
(function(self) {
  'use strict';

  if (self.fetch) {
    return
  }

  var support = {
    searchParams: 'URLSearchParams' in self,
    iterable: 'Symbol' in self && 'iterator' in Symbol,
    blob: 'FileReader' in self && 'Blob' in self && (function() {
      try {
        new Blob()
        return true
      } catch(e) {
        return false
      }
    })(),
    formData: 'FormData' in self,
    arrayBuffer: 'ArrayBuffer' in self
  }

  if (support.arrayBuffer) {
    var viewClasses = [
      '[object Int8Array]',
      '[object Uint8Array]',
      '[object Uint8ClampedArray]',
      '[object Int16Array]',
      '[object Uint16Array]',
      '[object Int32Array]',
      '[object Uint32Array]',
      '[object Float32Array]',
      '[object Float64Array]'
    ]

    var isDataView = function(obj) {
      return obj && DataView.prototype.isPrototypeOf(obj)
    }

    var isArrayBufferView = ArrayBuffer.isView || function(obj) {
      return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
    }
  }

  function normalizeName(name) {
    if (typeof name !== 'string') {
      name = String(name)
    }
    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
      throw new TypeError('Invalid character in header field name')
    }
    return name.toLowerCase()
  }

  function normalizeValue(value) {
    if (typeof value !== 'string') {
      value = String(value)
    }
    return value
  }

  // Build a destructive iterator for the value list
  function iteratorFor(items) {
    var iterator = {
      next: function() {
        var value = items.shift()
        return {done: value === undefined, value: value}
      }
    }

    if (support.iterable) {
      iterator[Symbol.iterator] = function() {
        return iterator
      }
    }

    return iterator
  }

  function Headers(headers) {
    this.map = {}

    if (headers instanceof Headers) {
      headers.forEach(function(value, name) {
        this.append(name, value)
      }, this)
    } else if (Array.isArray(headers)) {
      headers.forEach(function(header) {
        this.append(header[0], header[1])
      }, this)
    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function(name) {
        this.append(name, headers[name])
      }, this)
    }
  }

  Headers.prototype.append = function(name, value) {
    name = normalizeName(name)
    value = normalizeValue(value)
    var oldValue = this.map[name]
    this.map[name] = oldValue ? oldValue+','+value : value
  }

  Headers.prototype['delete'] = function(name) {
    delete this.map[normalizeName(name)]
  }

  Headers.prototype.get = function(name) {
    name = normalizeName(name)
    return this.has(name) ? this.map[name] : null
  }

  Headers.prototype.has = function(name) {
    return this.map.hasOwnProperty(normalizeName(name))
  }

  Headers.prototype.set = function(name, value) {
    this.map[normalizeName(name)] = normalizeValue(value)
  }

  Headers.prototype.forEach = function(callback, thisArg) {
    for (var name in this.map) {
      if (this.map.hasOwnProperty(name)) {
        callback.call(thisArg, this.map[name], name, this)
      }
    }
  }

  Headers.prototype.keys = function() {
    var items = []
    this.forEach(function(value, name) { items.push(name) })
    return iteratorFor(items)
  }

  Headers.prototype.values = function() {
    var items = []
    this.forEach(function(value) { items.push(value) })
    return iteratorFor(items)
  }

  Headers.prototype.entries = function() {
    var items = []
    this.forEach(function(value, name) { items.push([name, value]) })
    return iteratorFor(items)
  }

  if (support.iterable) {
    Headers.prototype[Symbol.iterator] = Headers.prototype.entries
  }

  function consumed(body) {
    if (body.bodyUsed) {
      return Promise.reject(new TypeError('Already read'))
    }
    body.bodyUsed = true
  }

  function fileReaderReady(reader) {
    return new Promise(function(resolve, reject) {
      reader.onload = function() {
        resolve(reader.result)
      }
      reader.onerror = function() {
        reject(reader.error)
      }
    })
  }

  function readBlobAsArrayBuffer(blob) {
    var reader = new FileReader()
    var promise = fileReaderReady(reader)
    reader.readAsArrayBuffer(blob)
    return promise
  }

  function readBlobAsText(blob) {
    var reader = new FileReader()
    var promise = fileReaderReady(reader)
    reader.readAsText(blob)
    return promise
  }

  function readArrayBufferAsText(buf) {
    var view = new Uint8Array(buf)
    var chars = new Array(view.length)

    for (var i = 0; i < view.length; i++) {
      chars[i] = String.fromCharCode(view[i])
    }
    return chars.join('')
  }

  function bufferClone(buf) {
    if (buf.slice) {
      return buf.slice(0)
    } else {
      var view = new Uint8Array(buf.byteLength)
      view.set(new Uint8Array(buf))
      return view.buffer
    }
  }

  function Body() {
    this.bodyUsed = false

    this._initBody = function(body) {
      this._bodyInit = body
      if (!body) {
        this._bodyText = ''
      } else if (typeof body === 'string') {
        this._bodyText = body
      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
        this._bodyBlob = body
      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
        this._bodyFormData = body
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this._bodyText = body.toString()
      } else if (support.arrayBuffer && support.blob && isDataView(body)) {
        this._bodyArrayBuffer = bufferClone(body.buffer)
        // IE 10-11 can't handle a DataView body.
        this._bodyInit = new Blob([this._bodyArrayBuffer])
      } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
        this._bodyArrayBuffer = bufferClone(body)
      } else {
        throw new Error('unsupported BodyInit type')
      }

      if (!this.headers.get('content-type')) {
        if (typeof body === 'string') {
          this.headers.set('content-type', 'text/plain;charset=UTF-8')
        } else if (this._bodyBlob && this._bodyBlob.type) {
          this.headers.set('content-type', this._bodyBlob.type)
        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8')
        }
      }
    }

    if (support.blob) {
      this.blob = function() {
        var rejected = consumed(this)
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return Promise.resolve(this._bodyBlob)
        } else if (this._bodyArrayBuffer) {
          return Promise.resolve(new Blob([this._bodyArrayBuffer]))
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as blob')
        } else {
          return Promise.resolve(new Blob([this._bodyText]))
        }
      }

      this.arrayBuffer = function() {
        if (this._bodyArrayBuffer) {
          return consumed(this) || Promise.resolve(this._bodyArrayBuffer)
        } else {
          return this.blob().then(readBlobAsArrayBuffer)
        }
      }
    }

    this.text = function() {
      var rejected = consumed(this)
      if (rejected) {
        return rejected
      }

      if (this._bodyBlob) {
        return readBlobAsText(this._bodyBlob)
      } else if (this._bodyArrayBuffer) {
        return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
      } else if (this._bodyFormData) {
        throw new Error('could not read FormData body as text')
      } else {
        return Promise.resolve(this._bodyText)
      }
    }

    if (support.formData) {
      this.formData = function() {
        return this.text().then(decode)
      }
    }

    this.json = function() {
      return this.text().then(JSON.parse)
    }

    return this
  }

  // HTTP methods whose capitalization should be normalized
  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']

  function normalizeMethod(method) {
    var upcased = method.toUpperCase()
    return (methods.indexOf(upcased) > -1) ? upcased : method
  }

  function Request(input, options) {
    options = options || {}
    var body = options.body

    if (input instanceof Request) {
      if (input.bodyUsed) {
        throw new TypeError('Already read')
      }
      this.url = input.url
      this.credentials = input.credentials
      if (!options.headers) {
        this.headers = new Headers(input.headers)
      }
      this.method = input.method
      this.mode = input.mode
      if (!body && input._bodyInit != null) {
        body = input._bodyInit
        input.bodyUsed = true
      }
    } else {
      this.url = String(input)
    }

    this.credentials = options.credentials || this.credentials || 'omit'
    if (options.headers || !this.headers) {
      this.headers = new Headers(options.headers)
    }
    this.method = normalizeMethod(options.method || this.method || 'GET')
    this.mode = options.mode || this.mode || null
    this.referrer = null

    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
      throw new TypeError('Body not allowed for GET or HEAD requests')
    }
    this._initBody(body)
  }

  Request.prototype.clone = function() {
    return new Request(this, { body: this._bodyInit })
  }

  function decode(body) {
    var form = new FormData()
    body.trim().split('&').forEach(function(bytes) {
      if (bytes) {
        var split = bytes.split('=')
        var name = split.shift().replace(/\+/g, ' ')
        var value = split.join('=').replace(/\+/g, ' ')
        form.append(decodeURIComponent(name), decodeURIComponent(value))
      }
    })
    return form
  }

  function parseHeaders(rawHeaders) {
    var headers = new Headers()
    rawHeaders.split(/\r?\n/).forEach(function(line) {
      var parts = line.split(':')
      var key = parts.shift().trim()
      if (key) {
        var value = parts.join(':').trim()
        headers.append(key, value)
      }
    })
    return headers
  }

  Body.call(Request.prototype)

  function Response(bodyInit, options) {
    if (!options) {
      options = {}
    }

    this.type = 'default'
    this.status = 'status' in options ? options.status : 200
    this.ok = this.status >= 200 && this.status < 300
    this.statusText = 'statusText' in options ? options.statusText : 'OK'
    this.headers = new Headers(options.headers)
    this.url = options.url || ''
    this._initBody(bodyInit)
  }

  Body.call(Response.prototype)

  Response.prototype.clone = function() {
    return new Response(this._bodyInit, {
      status: this.status,
      statusText: this.statusText,
      headers: new Headers(this.headers),
      url: this.url
    })
  }

  Response.error = function() {
    var response = new Response(null, {status: 0, statusText: ''})
    response.type = 'error'
    return response
  }

  var redirectStatuses = [301, 302, 303, 307, 308]

  Response.redirect = function(url, status) {
    if (redirectStatuses.indexOf(status) === -1) {
      throw new RangeError('Invalid status code')
    }

    return new Response(null, {status: status, headers: {location: url}})
  }

  self.Headers = Headers
  self.Request = Request
  self.Response = Response

  self.fetch = function(input, init) {
    return new Promise(function(resolve, reject) {
      var request = new Request(input, init)
      var xhr = new XMLHttpRequest()

      xhr.onload = function() {
        var options = {
          status: xhr.status,
          statusText: xhr.statusText,
          headers: parseHeaders(xhr.getAllResponseHeaders() || '')
        }
        options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL')
        var body = 'response' in xhr ? xhr.response : xhr.responseText
        resolve(new Response(body, options))
      }

      xhr.onerror = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.ontimeout = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.open(request.method, request.url, true)

      if (request.credentials === 'include') {
        xhr.withCredentials = true
      }

      if ('responseType' in xhr && support.blob) {
        xhr.responseType = 'blob'
      }

      request.headers.forEach(function(value, name) {
        xhr.setRequestHeader(name, value)
      })

      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
    })
  }
  self.fetch.polyfill = true
})(typeof self !== 'undefined' ? self : this);

},{}]},{},[12])(12)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvYXV0aC9iYXNpYy5qcyIsImxpYi9hdXRoL2luZGV4LmpzIiwibGliL2F1dGgvc2Vzc2lvbi5qcyIsImxpYi9hdXRoL3Rva2VuLmpzIiwibGliL2NsaWVudC5qcyIsImxpYi9jb2RlY3MvY29yZWpzb24uanMiLCJsaWIvY29kZWNzL2luZGV4LmpzIiwibGliL2NvZGVjcy9qc29uLmpzIiwibGliL2NvZGVjcy90ZXh0LmpzIiwibGliL2RvY3VtZW50LmpzIiwibGliL2Vycm9ycy5qcyIsImxpYi9pbmRleC5qcyIsImxpYi90cmFuc3BvcnRzL2h0dHAuanMiLCJsaWIvdHJhbnNwb3J0cy9pbmRleC5qcyIsImxpYi91dGlscy5qcyIsIm5vZGVfbW9kdWxlcy9pc29tb3JwaGljLWZldGNoL2ZldGNoLW5wbS1icm93c2VyaWZ5LmpzIiwibm9kZV9tb2R1bGVzL3F1ZXJ5c3RyaW5naWZ5L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3JlcXVpcmVzLXBvcnQvaW5kZXguanMiLCJub2RlX21vZHVsZXMvdXJsLXBhcnNlL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3VybC10ZW1wbGF0ZS9saWIvdXJsLXRlbXBsYXRlLmpzIiwibm9kZV9tb2R1bGVzL3doYXR3Zy1mZXRjaC9mZXRjaC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7OztJQ0FNLG1CO0FBQ0osaUNBQTJCO0FBQUEsUUFBZCxPQUFjLHVFQUFKLEVBQUk7O0FBQUE7O0FBQ3pCLFFBQU0sV0FBVyxRQUFRLFFBQXpCO0FBQ0EsUUFBTSxXQUFXLFFBQVEsUUFBekI7QUFDQSxRQUFNLE9BQU8sT0FBTyxJQUFQLENBQVksV0FBVyxHQUFYLEdBQWlCLFFBQTdCLENBQWI7QUFDQSxTQUFLLElBQUwsR0FBWSxXQUFXLElBQXZCO0FBQ0Q7Ozs7aUNBRWEsTyxFQUFTO0FBQ3JCLGNBQVEsT0FBUixDQUFnQixlQUFoQixJQUFt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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3ZaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImNsYXNzIEJhc2ljQXV0aGVudGljYXRpb24ge1xuICBjb25zdHJ1Y3RvciAob3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3QgdXNlcm5hbWUgPSBvcHRpb25zLnVzZXJuYW1lXG4gICAgY29uc3QgcGFzc3dvcmQgPSBvcHRpb25zLnBhc3N3b3JkXG4gICAgY29uc3QgaGFzaCA9IHdpbmRvdy5idG9hKHVzZXJuYW1lICsgJzonICsgcGFzc3dvcmQpXG4gICAgdGhpcy5hdXRoID0gJ0Jhc2ljICcgKyBoYXNoXG4gIH1cblxuICBhdXRoZW50aWNhdGUgKG9wdGlvbnMpIHtcbiAgICBvcHRpb25zLmhlYWRlcnNbJ0F1dGhvcml6YXRpb24nXSA9IHRoaXMuYXV0aFxuICAgIHJldHVybiBvcHRpb25zXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIEJhc2ljQXV0aGVudGljYXRpb246IEJhc2ljQXV0aGVudGljYXRpb25cbn1cbiIsImNvbnN0IGJhc2ljID0gcmVxdWlyZSgnLi9iYXNpYycpXG5jb25zdCBzZXNzaW9uID0gcmVxdWlyZSgnLi9zZXNzaW9uJylcbmNvbnN0IHRva2VuID0gcmVxdWlyZSgnLi90b2tlbicpXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBCYXNpY0F1dGhlbnRpY2F0aW9uOiBiYXNpYy5CYXNpY0F1dGhlbnRpY2F0aW9uLFxuICBTZXNzaW9uQXV0aGVudGljYXRpb246IHNlc3Npb24uU2Vzc2lvbkF1dGhlbnRpY2F0aW9uLFxuICBUb2tlbkF1dGhlbnRpY2F0aW9uOiB0b2tlbi5Ub2tlbkF1dGhlbnRpY2F0aW9uXG59XG4iLCJjb25zdCB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzJylcblxuZnVuY3Rpb24gdHJpbSAoc3RyKSB7XG4gIHJldHVybiBzdHIucmVwbGFjZSgvXlxcc1xccyovLCAnJykucmVwbGFjZSgvXFxzXFxzKiQvLCAnJylcbn1cblxuZnVuY3Rpb24gZ2V0Q29va2llIChjb29raWVOYW1lLCBjb29raWVTdHJpbmcpIHtcbiAgY29va2llU3RyaW5nID0gY29va2llU3RyaW5nIHx8IHdpbmRvdy5kb2N1bWVudC5jb29raWVcbiAgaWYgKGNvb2tpZVN0cmluZyAmJiBjb29raWVTdHJpbmcgIT09ICcnKSB7XG4gICAgY29uc3QgY29va2llcyA9IGNvb2tpZVN0cmluZy5zcGxpdCgnOycpXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb29raWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBjb29raWUgPSB0cmltKGNvb2tpZXNbaV0pXG4gICAgICAvLyBEb2VzIHRoaXMgY29va2llIHN0cmluZyBiZWdpbiB3aXRoIHRoZSBuYW1lIHdlIHdhbnQ/XG4gICAgICBpZiAoY29va2llLnN1YnN0cmluZygwLCBjb29raWVOYW1lLmxlbmd0aCArIDEpID09PSAoY29va2llTmFtZSArICc9JykpIHtcbiAgICAgICAgcmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudChjb29raWUuc3Vic3RyaW5nKGNvb2tpZU5hbWUubGVuZ3RoICsgMSkpXG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBudWxsXG59XG5cbmNsYXNzIFNlc3Npb25BdXRoZW50aWNhdGlvbiB7XG4gIGNvbnN0cnVjdG9yIChvcHRpb25zID0ge30pIHtcbiAgICB0aGlzLmNzcmZUb2tlbiA9IGdldENvb2tpZShvcHRpb25zLmNzcmZDb29raWVOYW1lLCBvcHRpb25zLmNvb2tpZVN0cmluZylcbiAgICB0aGlzLmNzcmZIZWFkZXJOYW1lID0gb3B0aW9ucy5jc3JmSGVhZGVyTmFtZVxuICB9XG5cbiAgYXV0aGVudGljYXRlIChvcHRpb25zKSB7XG4gICAgb3B0aW9ucy5jcmVkZW50aWFscyA9ICdzYW1lLW9yaWdpbidcbiAgICBpZiAodGhpcy5jc3JmVG9rZW4gJiYgIXV0aWxzLmNzcmZTYWZlTWV0aG9kKG9wdGlvbnMubWV0aG9kKSkge1xuICAgICAgb3B0aW9ucy5oZWFkZXJzW3RoaXMuY3NyZkhlYWRlck5hbWVdID0gdGhpcy5jc3JmVG9rZW5cbiAgICB9XG4gICAgcmV0dXJuIG9wdGlvbnNcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgU2Vzc2lvbkF1dGhlbnRpY2F0aW9uOiBTZXNzaW9uQXV0aGVudGljYXRpb25cbn1cbiIsImNsYXNzIFRva2VuQXV0aGVudGljYXRpb24ge1xuICBjb25zdHJ1Y3RvciAob3B0aW9ucyA9IHt9KSB7XG4gICAgdGhpcy50b2tlbiA9IG9wdGlvbnMudG9rZW5cbiAgICB0aGlzLnNjaGVtZSA9IG9wdGlvbnMuc2NoZW1lIHx8ICdCZWFyZXInXG4gIH1cblxuICBhdXRoZW50aWNhdGUgKG9wdGlvbnMpIHtcbiAgICBvcHRpb25zLmhlYWRlcnNbJ0F1dGhvcml6YXRpb24nXSA9IHRoaXMuc2NoZW1lICsgJyAnICsgdGhpcy50b2tlblxuICAgIHJldHVybiBvcHRpb25zXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIFRva2VuQXV0aGVudGljYXRpb246IFRva2VuQXV0aGVudGljYXRpb25cbn1cbiIsImNvbnN0IGRvY3VtZW50ID0gcmVxdWlyZSgnLi9kb2N1bWVudCcpXG5jb25zdCBjb2RlY3MgPSByZXF1aXJlKCcuL2NvZGVjcycpXG5jb25zdCBlcnJvcnMgPSByZXF1aXJlKCcuL2Vycm9ycycpXG5jb25zdCB0cmFuc3BvcnRzID0gcmVxdWlyZSgnLi90cmFuc3BvcnRzJylcbmNvbnN0IHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpXG5cbmZ1bmN0aW9uIGxvb2t1cExpbmsgKG5vZGUsIGtleXMpIHtcbiAgZm9yIChsZXQga2V5IG9mIGtleXMpIHtcbiAgICBpZiAobm9kZSBpbnN0YW5jZW9mIGRvY3VtZW50LkRvY3VtZW50KSB7XG4gICAgICBub2RlID0gbm9kZS5jb250ZW50W2tleV1cbiAgICB9IGVsc2Uge1xuICAgICAgbm9kZSA9IG5vZGVba2V5XVxuICAgIH1cbiAgICBpZiAobm9kZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgZXJyb3JzLkxpbmtMb29rdXBFcnJvcihgSW52YWxpZCBsaW5rIGxvb2t1cDogJHtKU09OLnN0cmluZ2lmeShrZXlzKX1gKVxuICAgIH1cbiAgfVxuICBpZiAoIShub2RlIGluc3RhbmNlb2YgZG9jdW1lbnQuTGluaykpIHtcbiAgICB0aHJvdyBuZXcgZXJyb3JzLkxpbmtMb29rdXBFcnJvcihgSW52YWxpZCBsaW5rIGxvb2t1cDogJHtKU09OLnN0cmluZ2lmeShrZXlzKX1gKVxuICB9XG4gIHJldHVybiBub2RlXG59XG5cbmNsYXNzIENsaWVudCB7XG4gIGNvbnN0cnVjdG9yIChvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCB0cmFuc3BvcnRPcHRpb25zID0ge1xuICAgICAgYXV0aDogb3B0aW9ucy5hdXRoIHx8IG51bGwsXG4gICAgICBoZWFkZXJzOiBvcHRpb25zLmhlYWRlcnMgfHwge30sXG4gICAgICByZXF1ZXN0Q2FsbGJhY2s6IG9wdGlvbnMucmVxdWVzdENhbGxiYWNrLFxuICAgICAgcmVzcG9uc2VDYWxsYmFjazogb3B0aW9ucy5yZXNwb25zZUNhbGxiYWNrXG4gICAgfVxuXG4gICAgdGhpcy5kZWNvZGVycyA9IG9wdGlvbnMuZGVjb2RlcnMgfHwgW25ldyBjb2RlY3MuQ29yZUpTT05Db2RlYygpLCBuZXcgY29kZWNzLkpTT05Db2RlYygpLCBuZXcgY29kZWNzLlRleHRDb2RlYygpXVxuICAgIHRoaXMudHJhbnNwb3J0cyA9IG9wdGlvbnMudHJhbnNwb3J0cyB8fCBbbmV3IHRyYW5zcG9ydHMuSFRUUFRyYW5zcG9ydCh0cmFuc3BvcnRPcHRpb25zKV1cbiAgfVxuXG4gIGFjdGlvbiAoZG9jdW1lbnQsIGtleXMsIHBhcmFtcyA9IHt9LCB2YWxpZGF0ZSA9IHRydWUpIHtcbiAgICBjb25zdCBsaW5rID0gbG9va3VwTGluayhkb2N1bWVudCwga2V5cylcbiAgICBjb25zdCB0cmFuc3BvcnQgPSB1dGlscy5kZXRlcm1pbmVUcmFuc3BvcnQodGhpcy50cmFuc3BvcnRzLCBsaW5rLnVybClcbiAgICByZXR1cm4gdHJhbnNwb3J0LmFjdGlvbihsaW5rLCB0aGlzLmRlY29kZXJzLCBwYXJhbXMsIHZhbGlkYXRlID0gdmFsaWRhdGUpXG4gIH1cblxuICBnZXQgKHVybCkge1xuICAgIGNvbnN0IGxpbmsgPSBuZXcgZG9jdW1lbnQuTGluayh1cmwsICdnZXQnKVxuICAgIGNvbnN0IHRyYW5zcG9ydCA9IHV0aWxzLmRldGVybWluZVRyYW5zcG9ydCh0aGlzLnRyYW5zcG9ydHMsIHVybClcbiAgICByZXR1cm4gdHJhbnNwb3J0LmFjdGlvbihsaW5rLCB0aGlzLmRlY29kZXJzKVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBDbGllbnQ6IENsaWVudFxufVxuIiwiY29uc3QgZG9jdW1lbnQgPSByZXF1aXJlKCcuLi9kb2N1bWVudCcpXG5jb25zdCBVUkwgPSByZXF1aXJlKCd1cmwtcGFyc2UnKVxuXG5mdW5jdGlvbiB1bmVzY2FwZUtleSAoa2V5KSB7XG4gIGlmIChrZXkubWF0Y2goL19fKHR5cGV8bWV0YSkkLykpIHtcbiAgICByZXR1cm4ga2V5LnN1YnN0cmluZygxKVxuICB9XG4gIHJldHVybiBrZXlcbn1cblxuZnVuY3Rpb24gZ2V0U3RyaW5nIChvYmosIGtleSkge1xuICBjb25zdCB2YWx1ZSA9IG9ialtrZXldXG4gIGlmICh0eXBlb2YgKHZhbHVlKSA9PT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gdmFsdWVcbiAgfVxuICByZXR1cm4gJydcbn1cblxuZnVuY3Rpb24gZ2V0Qm9vbGVhbiAob2JqLCBrZXkpIHtcbiAgY29uc3QgdmFsdWUgPSBvYmpba2V5XVxuICBpZiAodHlwZW9mICh2YWx1ZSkgPT09ICdib29sZWFuJykge1xuICAgIHJldHVybiB2YWx1ZVxuICB9XG4gIHJldHVybiBmYWxzZVxufVxuXG5mdW5jdGlvbiBnZXRPYmplY3QgKG9iaiwga2V5KSB7XG4gIGNvbnN0IHZhbHVlID0gb2JqW2tleV1cbiAgaWYgKHR5cGVvZiAodmFsdWUpID09PSAnb2JqZWN0Jykge1xuICAgIHJldHVybiB2YWx1ZVxuICB9XG4gIHJldHVybiB7fVxufVxuXG5mdW5jdGlvbiBnZXRBcnJheSAob2JqLCBrZXkpIHtcbiAgY29uc3QgdmFsdWUgPSBvYmpba2V5XVxuICBpZiAodmFsdWUgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgIHJldHVybiB2YWx1ZVxuICB9XG4gIHJldHVybiBbXVxufVxuXG5mdW5jdGlvbiBnZXRDb250ZW50IChkYXRhLCBiYXNlVXJsKSB7XG4gIGNvbnN0IGV4Y2x1ZGVkID0gWydfdHlwZScsICdfbWV0YSddXG4gIHZhciBjb250ZW50ID0ge31cbiAgZm9yICh2YXIgcHJvcGVydHkgaW4gZGF0YSkge1xuICAgIGlmIChkYXRhLmhhc093blByb3BlcnR5KHByb3BlcnR5KSAmJiAhZXhjbHVkZWQuaW5jbHVkZXMocHJvcGVydHkpKSB7XG4gICAgICBjb25zdCBrZXkgPSB1bmVzY2FwZUtleShwcm9wZXJ0eSlcbiAgICAgIGNvbnN0IHZhbHVlID0gcHJpbWl0aXZlVG9Ob2RlKGRhdGFbcHJvcGVydHldLCBiYXNlVXJsKVxuICAgICAgY29udGVudFtrZXldID0gdmFsdWVcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGNvbnRlbnRcbn1cblxuZnVuY3Rpb24gcHJpbWl0aXZlVG9Ob2RlIChkYXRhLCBiYXNlVXJsKSB7XG4gIGNvbnN0IGlzT2JqZWN0ID0gZGF0YSBpbnN0YW5jZW9mIE9iamVjdCAmJiAhKGRhdGEgaW5zdGFuY2VvZiBBcnJheSlcblxuICBpZiAoaXNPYmplY3QgJiYgZGF0YS5fdHlwZSA9PT0gJ2RvY3VtZW50Jykge1xuICAgIC8vIERvY3VtZW50XG4gICAgY29uc3QgbWV0YSA9IGdldE9iamVjdChkYXRhLCAnX21ldGEnKVxuICAgIGNvbnN0IHJlbGF0aXZlVXJsID0gZ2V0U3RyaW5nKG1ldGEsICd1cmwnKVxuICAgIGNvbnN0IHVybCA9IHJlbGF0aXZlVXJsID8gVVJMKHJlbGF0aXZlVXJsLCBiYXNlVXJsKS50b1N0cmluZygpIDogJydcbiAgICBjb25zdCB0aXRsZSA9IGdldFN0cmluZyhtZXRhLCAndGl0bGUnKVxuICAgIGNvbnN0IGRlc2NyaXB0aW9uID0gZ2V0U3RyaW5nKG1ldGEsICdkZXNjcmlwdGlvbicpXG4gICAgY29uc3QgY29udGVudCA9IGdldENvbnRlbnQoZGF0YSwgdXJsKVxuICAgIHJldHVybiBuZXcgZG9jdW1lbnQuRG9jdW1lbnQodXJsLCB0aXRsZSwgZGVzY3JpcHRpb24sIGNvbnRlbnQpXG4gIH0gZWxzZSBpZiAoaXNPYmplY3QgJiYgZGF0YS5fdHlwZSA9PT0gJ2xpbmsnKSB7XG4gICAgLy8gTGlua1xuICAgIGNvbnN0IHJlbGF0aXZlVXJsID0gZ2V0U3RyaW5nKGRhdGEsICd1cmwnKVxuICAgIGNvbnN0IHVybCA9IHJlbGF0aXZlVXJsID8gVVJMKHJlbGF0aXZlVXJsLCBiYXNlVXJsKS50b1N0cmluZygpIDogJydcbiAgICBjb25zdCBtZXRob2QgPSBnZXRTdHJpbmcoZGF0YSwgJ2FjdGlvbicpIHx8ICdnZXQnXG4gICAgY29uc3QgdGl0bGUgPSBnZXRTdHJpbmcoZGF0YSwgJ3RpdGxlJylcbiAgICBjb25zdCBkZXNjcmlwdGlvbiA9IGdldFN0cmluZyhkYXRhLCAnZGVzY3JpcHRpb24nKVxuICAgIGNvbnN0IGZpZWxkc0RhdGEgPSBnZXRBcnJheShkYXRhLCAnZmllbGRzJylcbiAgICB2YXIgZmllbGRzID0gW11cbiAgICBmb3IgKGxldCBpZHggPSAwLCBsZW4gPSBmaWVsZHNEYXRhLmxlbmd0aDsgaWR4IDwgbGVuOyBpZHgrKykge1xuICAgICAgbGV0IHZhbHVlID0gZmllbGRzRGF0YVtpZHhdXG4gICAgICBsZXQgbmFtZSA9IGdldFN0cmluZyh2YWx1ZSwgJ25hbWUnKVxuICAgICAgbGV0IHJlcXVpcmVkID0gZ2V0Qm9vbGVhbih2YWx1ZSwgJ3JlcXVpcmVkJylcbiAgICAgIGxldCBsb2NhdGlvbiA9IGdldFN0cmluZyh2YWx1ZSwgJ2xvY2F0aW9uJylcbiAgICAgIGxldCBmaWVsZERlc2NyaXB0aW9uID0gZ2V0U3RyaW5nKHZhbHVlLCAnZmllbGREZXNjcmlwdGlvbicpXG4gICAgICBsZXQgZmllbGQgPSBuZXcgZG9jdW1lbnQuRmllbGQobmFtZSwgcmVxdWlyZWQsIGxvY2F0aW9uLCBmaWVsZERlc2NyaXB0aW9uKVxuICAgICAgZmllbGRzLnB1c2goZmllbGQpXG4gICAgfVxuICAgIHJldHVybiBuZXcgZG9jdW1lbnQuTGluayh1cmwsIG1ldGhvZCwgJ2FwcGxpY2F0aW9uL2pzb24nLCBmaWVsZHMsIHRpdGxlLCBkZXNjcmlwdGlvbilcbiAgfSBlbHNlIGlmIChpc09iamVjdCkge1xuICAgIC8vIE9iamVjdFxuICAgIGxldCBjb250ZW50ID0ge31cbiAgICBmb3IgKGxldCBrZXkgaW4gZGF0YSkge1xuICAgICAgaWYgKGRhdGEuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICBjb250ZW50W2tleV0gPSBwcmltaXRpdmVUb05vZGUoZGF0YVtrZXldLCBiYXNlVXJsKVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gY29udGVudFxuICB9IGVsc2UgaWYgKGRhdGEgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgIC8vIE9iamVjdFxuICAgIGxldCBjb250ZW50ID0gW11cbiAgICBmb3IgKGxldCBpZHggPSAwLCBsZW4gPSBkYXRhLmxlbmd0aDsgaWR4IDwgbGVuOyBpZHgrKykge1xuICAgICAgY29udGVudC5wdXNoKHByaW1pdGl2ZVRvTm9kZShkYXRhW2lkeF0sIGJhc2VVcmwpKVxuICAgIH1cbiAgICByZXR1cm4gY29udGVudFxuICB9XG4gIC8vIFByaW1pdGl2ZVxuICByZXR1cm4gZGF0YVxufVxuXG5jbGFzcyBDb3JlSlNPTkNvZGVjIHtcbiAgY29uc3RydWN0b3IgKCkge1xuICAgIHRoaXMubWVkaWFUeXBlID0gJ2FwcGxpY2F0aW9uL2NvcmVhcGkranNvbidcbiAgfVxuXG4gIGRlY29kZSAodGV4dCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgbGV0IGRhdGEgPSB0ZXh0XG4gICAgaWYgKG9wdGlvbnMucHJlbG9hZGVkID09PSB1bmRlZmluZWQgfHwgIW9wdGlvbnMucHJlbG9hZGVkKSB7XG4gICAgICBkYXRhID0gSlNPTi5wYXJzZSh0ZXh0KVxuICAgIH1cbiAgICByZXR1cm4gcHJpbWl0aXZlVG9Ob2RlKGRhdGEsIG9wdGlvbnMudXJsKVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBDb3JlSlNPTkNvZGVjOiBDb3JlSlNPTkNvZGVjXG59XG4iLCJjb25zdCBjb3JlanNvbiA9IHJlcXVpcmUoJy4vY29yZWpzb24nKVxuY29uc3QganNvbiA9IHJlcXVpcmUoJy4vanNvbicpXG5jb25zdCB0ZXh0ID0gcmVxdWlyZSgnLi90ZXh0JylcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIENvcmVKU09OQ29kZWM6IGNvcmVqc29uLkNvcmVKU09OQ29kZWMsXG4gIEpTT05Db2RlYzoganNvbi5KU09OQ29kZWMsXG4gIFRleHRDb2RlYzogdGV4dC5UZXh0Q29kZWNcbn1cbiIsImNsYXNzIEpTT05Db2RlYyB7XG4gIGNvbnN0cnVjdG9yICgpIHtcbiAgICB0aGlzLm1lZGlhVHlwZSA9ICdhcHBsaWNhdGlvbi9qc29uJ1xuICB9XG5cbiAgZGVjb2RlICh0ZXh0LCBvcHRpb25zID0ge30pIHtcbiAgICByZXR1cm4gSlNPTi5wYXJzZSh0ZXh0KVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBKU09OQ29kZWM6IEpTT05Db2RlY1xufVxuIiwiY2xhc3MgVGV4dENvZGVjIHtcbiAgY29uc3RydWN0b3IgKCkge1xuICAgIHRoaXMubWVkaWFUeXBlID0gJ3RleHQvKidcbiAgfVxuXG4gIGRlY29kZSAodGV4dCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgcmV0dXJuIHRleHRcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgVGV4dENvZGVjOiBUZXh0Q29kZWNcbn1cbiIsImNsYXNzIERvY3VtZW50IHtcbiAgY29uc3RydWN0b3IgKHVybCA9ICcnLCB0aXRsZSA9ICcnLCBkZXNjcmlwdGlvbiA9ICcnLCBjb250ZW50ID0ge30pIHtcbiAgICB0aGlzLnVybCA9IHVybFxuICAgIHRoaXMudGl0bGUgPSB0aXRsZVxuICAgIHRoaXMuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvblxuICAgIHRoaXMuY29udGVudCA9IGNvbnRlbnRcbiAgfVxufVxuXG5jbGFzcyBMaW5rIHtcbiAgY29uc3RydWN0b3IgKHVybCwgbWV0aG9kLCBlbmNvZGluZyA9ICdhcHBsaWNhdGlvbi9qc29uJywgZmllbGRzID0gW10sIHRpdGxlID0gJycsIGRlc2NyaXB0aW9uID0gJycpIHtcbiAgICBpZiAodXJsID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcigndXJsIGFyZ3VtZW50IGlzIHJlcXVpcmVkJylcbiAgICB9XG5cbiAgICBpZiAobWV0aG9kID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignbWV0aG9kIGFyZ3VtZW50IGlzIHJlcXVpcmVkJylcbiAgICB9XG5cbiAgICB0aGlzLnVybCA9IHVybFxuICAgIHRoaXMubWV0aG9kID0gbWV0aG9kXG4gICAgdGhpcy5lbmNvZGluZyA9IGVuY29kaW5nXG4gICAgdGhpcy5maWVsZHMgPSBmaWVsZHNcbiAgICB0aGlzLnRpdGxlID0gdGl0bGVcbiAgICB0aGlzLmRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb25cbiAgfVxufVxuXG5jbGFzcyBGaWVsZCB7XG4gIGNvbnN0cnVjdG9yIChuYW1lLCByZXF1aXJlZCA9IGZhbHNlLCBsb2NhdGlvbiA9ICcnLCBkZXNjcmlwdGlvbiA9ICcnKSB7XG4gICAgaWYgKG5hbWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCduYW1lIGFyZ3VtZW50IGlzIHJlcXVpcmVkJylcbiAgICB9XG5cbiAgICB0aGlzLm5hbWUgPSBuYW1lXG4gICAgdGhpcy5yZXF1aXJlZCA9IHJlcXVpcmVkXG4gICAgdGhpcy5sb2NhdGlvbiA9IGxvY2F0aW9uXG4gICAgdGhpcy5kZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIERvY3VtZW50OiBEb2N1bWVudCxcbiAgTGluazogTGluayxcbiAgRmllbGQ6IEZpZWxkXG59XG4iLCJjbGFzcyBQYXJhbWV0ZXJFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgY29uc3RydWN0b3IgKG1lc3NhZ2UpIHtcbiAgICBzdXBlcihtZXNzYWdlKVxuICAgIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2VcbiAgICB0aGlzLm5hbWUgPSAnUGFyYW1ldGVyRXJyb3InXG4gIH1cbn1cblxuY2xhc3MgTGlua0xvb2t1cEVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICBjb25zdHJ1Y3RvciAobWVzc2FnZSkge1xuICAgIHN1cGVyKG1lc3NhZ2UpXG4gICAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZVxuICAgIHRoaXMubmFtZSA9ICdMaW5rTG9va3VwRXJyb3InXG4gIH1cbn1cblxuY2xhc3MgRXJyb3JNZXNzYWdlIGV4dGVuZHMgRXJyb3Ige1xuICBjb25zdHJ1Y3RvciAobWVzc2FnZSwgY29udGVudCkge1xuICAgIHN1cGVyKG1lc3NhZ2UpXG4gICAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZVxuICAgIHRoaXMuY29udGVudCA9IGNvbnRlbnRcbiAgICB0aGlzLm5hbWUgPSAnRXJyb3JNZXNzYWdlJ1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBQYXJhbWV0ZXJFcnJvcjogUGFyYW1ldGVyRXJyb3IsXG4gIExpbmtMb29rdXBFcnJvcjogTGlua0xvb2t1cEVycm9yLFxuICBFcnJvck1lc3NhZ2U6IEVycm9yTWVzc2FnZVxufVxuIiwiY29uc3QgYXV0aCA9IHJlcXVpcmUoJy4vYXV0aCcpXG5jb25zdCBjbGllbnQgPSByZXF1aXJlKCcuL2NsaWVudCcpXG5jb25zdCBjb2RlY3MgPSByZXF1aXJlKCcuL2NvZGVjcycpXG5jb25zdCBkb2N1bWVudCA9IHJlcXVpcmUoJy4vZG9jdW1lbnQnKVxuY29uc3QgZXJyb3JzID0gcmVxdWlyZSgnLi9lcnJvcnMnKVxuY29uc3QgdHJhbnNwb3J0cyA9IHJlcXVpcmUoJy4vdHJhbnNwb3J0cycpXG5jb25zdCB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKVxuXG5jb25zdCBjb3JlYXBpID0ge1xuICBDbGllbnQ6IGNsaWVudC5DbGllbnQsXG4gIERvY3VtZW50OiBkb2N1bWVudC5Eb2N1bWVudCxcbiAgTGluazogZG9jdW1lbnQuTGluayxcbiAgYXV0aDogYXV0aCxcbiAgY29kZWNzOiBjb2RlY3MsXG4gIGVycm9yczogZXJyb3JzLFxuICB0cmFuc3BvcnRzOiB0cmFuc3BvcnRzLFxuICB1dGlsczogdXRpbHNcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjb3JlYXBpXG4iLCJjb25zdCBmZXRjaCA9IHJlcXVpcmUoJ2lzb21vcnBoaWMtZmV0Y2gnKVxuY29uc3QgZXJyb3JzID0gcmVxdWlyZSgnLi4vZXJyb3JzJylcbmNvbnN0IHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbHMnKVxuY29uc3QgVVJMID0gcmVxdWlyZSgndXJsLXBhcnNlJylcbmNvbnN0IHVybFRlbXBsYXRlID0gcmVxdWlyZSgndXJsLXRlbXBsYXRlJylcblxuY29uc3QgcGFyc2VSZXNwb25zZSA9IChyZXNwb25zZSwgZGVjb2RlcnMsIHJlc3BvbnNlQ2FsbGJhY2spID0+IHtcbiAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKS50aGVuKHRleHQgPT4ge1xuICAgIGlmIChyZXNwb25zZUNhbGxiYWNrKSB7XG4gICAgICByZXNwb25zZUNhbGxiYWNrKHJlc3BvbnNlLCB0ZXh0KVxuICAgIH1cbiAgICBjb25zdCBjb250ZW50VHlwZSA9IHJlc3BvbnNlLmhlYWRlcnMuZ2V0KCdDb250ZW50LVR5cGUnKVxuICAgIGNvbnN0IGRlY29kZXIgPSB1dGlscy5uZWdvdGlhdGVEZWNvZGVyKGRlY29kZXJzLCBjb250ZW50VHlwZSlcbiAgICBjb25zdCBvcHRpb25zID0ge3VybDogcmVzcG9uc2UudXJsfVxuICAgIHJldHVybiBkZWNvZGVyLmRlY29kZSh0ZXh0LCBvcHRpb25zKVxuICB9KVxufVxuXG5jbGFzcyBIVFRQVHJhbnNwb3J0IHtcbiAgY29uc3RydWN0b3IgKG9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMuc2NoZW1lcyA9IFsnaHR0cCcsICdodHRwcyddXG4gICAgdGhpcy5hdXRoID0gb3B0aW9ucy5hdXRoIHx8IG51bGxcbiAgICB0aGlzLmhlYWRlcnMgPSBvcHRpb25zLmhlYWRlcnMgfHwge31cbiAgICB0aGlzLmZldGNoID0gb3B0aW9ucy5mZXRjaCB8fCBmZXRjaFxuICAgIHRoaXMuRm9ybURhdGEgPSBvcHRpb25zLkZvcm1EYXRhIHx8IHdpbmRvdy5Gb3JtRGF0YVxuICAgIHRoaXMucmVxdWVzdENhbGxiYWNrID0gb3B0aW9ucy5yZXF1ZXN0Q2FsbGJhY2tcbiAgICB0aGlzLnJlc3BvbnNlQ2FsbGJhY2sgPSBvcHRpb25zLnJlc3BvbnNlQ2FsbGJhY2tcbiAgfVxuXG4gIGJ1aWxkUmVxdWVzdCAobGluaywgZGVjb2RlcnMsIHBhcmFtcyA9IHt9LCB2YWxpZGF0ZSA9IHRydWUpIHtcbiAgICBjb25zdCBmaWVsZHMgPSBsaW5rLmZpZWxkc1xuICAgIGNvbnN0IG1ldGhvZCA9IGxpbmsubWV0aG9kLnRvVXBwZXJDYXNlKClcbiAgICBsZXQgcXVlcnlQYXJhbXMgPSB7fVxuICAgIGxldCBwYXRoUGFyYW1zID0ge31cbiAgICBsZXQgZm9ybVBhcmFtcyA9IHt9XG4gICAgbGV0IGZpZWxkTmFtZXMgPSBbXVxuICAgIGxldCBoYXNCb2R5ID0gZmFsc2VcblxuICAgIGZvciAobGV0IGlkeCA9IDAsIGxlbiA9IGZpZWxkcy5sZW5ndGg7IGlkeCA8IGxlbjsgaWR4KyspIHtcbiAgICAgIGNvbnN0IGZpZWxkID0gZmllbGRzW2lkeF1cblxuICAgICAgLy8gRW5zdXJlIGFueSByZXF1aXJlZCBmaWVsZHMgYXJlIGluY2x1ZGVkXG4gICAgICBpZiAoIXBhcmFtcy5oYXNPd25Qcm9wZXJ0eShmaWVsZC5uYW1lKSkge1xuICAgICAgICBpZiAoZmllbGQucmVxdWlyZWQpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgZXJyb3JzLlBhcmFtZXRlckVycm9yKGBNaXNzaW5nIHJlcXVpcmVkIGZpZWxkOiBcIiR7ZmllbGQubmFtZX1cImApXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBmaWVsZE5hbWVzLnB1c2goZmllbGQubmFtZSlcbiAgICAgIGlmIChmaWVsZC5sb2NhdGlvbiA9PT0gJ3F1ZXJ5Jykge1xuICAgICAgICBxdWVyeVBhcmFtc1tmaWVsZC5uYW1lXSA9IHBhcmFtc1tmaWVsZC5uYW1lXVxuICAgICAgfSBlbHNlIGlmIChmaWVsZC5sb2NhdGlvbiA9PT0gJ3BhdGgnKSB7XG4gICAgICAgIHBhdGhQYXJhbXNbZmllbGQubmFtZV0gPSBwYXJhbXNbZmllbGQubmFtZV1cbiAgICAgIH0gZWxzZSBpZiAoZmllbGQubG9jYXRpb24gPT09ICdmb3JtJykge1xuICAgICAgICBmb3JtUGFyYW1zW2ZpZWxkLm5hbWVdID0gcGFyYW1zW2ZpZWxkLm5hbWVdXG4gICAgICAgIGhhc0JvZHkgPSB0cnVlXG4gICAgICB9IGVsc2UgaWYgKGZpZWxkLmxvY2F0aW9uID09PSAnYm9keScpIHtcbiAgICAgICAgZm9ybVBhcmFtcyA9IHBhcmFtc1tmaWVsZC5uYW1lXVxuICAgICAgICBoYXNCb2R5ID0gdHJ1ZVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIENoZWNrIGZvciBhbnkgcGFyYW1ldGVycyB0aGF0IGRpZCBub3QgaGF2ZSBhIG1hdGNoaW5nIGZpZWxkXG4gICAgLy8gaWYgQHBhcmFtIHZhbGlkYXRlIGlzIHRydWUsIGFkZCB0aGUgZXh0cmEgcGFyYW1ldGVyIHRvIHF1ZXJ5UGFyYW1zXG4gICAgZm9yICh2YXIgcHJvcGVydHkgaW4gcGFyYW1zKSB7XG4gICAgICBpZiAocGFyYW1zLmhhc093blByb3BlcnR5KHByb3BlcnR5KSAmJiAhZmllbGROYW1lcy5pbmNsdWRlcyhwcm9wZXJ0eSkgJiYgdmFsaWRhdGUpIHtcbiAgICAgICAgdGhyb3cgbmV3IGVycm9ycy5QYXJhbWV0ZXJFcnJvcihgVW5rbm93biBwYXJhbWV0ZXI6IFwiJHtwcm9wZXJ0eX1cImApXG4gICAgICB9IGVsc2UgaWYgKCFmaWVsZE5hbWVzLmluY2x1ZGVzKHByb3BlcnR5KSkge1xuICAgICAgICBmaWVsZE5hbWVzLnB1c2gocHJvcGVydHkpXG4gICAgICAgIHF1ZXJ5UGFyYW1zW3Byb3BlcnR5XSA9IHBhcmFtc1twcm9wZXJ0eV1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgcmVxdWVzdE9wdGlvbnMgPSB7bWV0aG9kOiBtZXRob2QsIGhlYWRlcnM6IHt9fVxuXG4gICAgT2JqZWN0LmFzc2lnbihyZXF1ZXN0T3B0aW9ucy5oZWFkZXJzLCB0aGlzLmhlYWRlcnMpXG5cbiAgICBpZiAoaGFzQm9keSkge1xuICAgICAgaWYgKGxpbmsuZW5jb2RpbmcgPT09ICdhcHBsaWNhdGlvbi9qc29uJykge1xuICAgICAgICByZXF1ZXN0T3B0aW9ucy5ib2R5ID0gSlNPTi5zdHJpbmdpZnkoZm9ybVBhcmFtcylcbiAgICAgICAgcmVxdWVzdE9wdGlvbnMuaGVhZGVyc1snQ29udGVudC1UeXBlJ10gPSAnYXBwbGljYXRpb24vanNvbidcbiAgICAgIH0gZWxzZSBpZiAobGluay5lbmNvZGluZyA9PT0gJ211bHRpcGFydC9mb3JtLWRhdGEnKSB7XG4gICAgICAgIGxldCBmb3JtID0gbmV3IHRoaXMuRm9ybURhdGEoKVxuXG4gICAgICAgIGZvciAobGV0IHBhcmFtS2V5IGluIGZvcm1QYXJhbXMpIHtcbiAgICAgICAgICBmb3JtLmFwcGVuZChwYXJhbUtleSwgZm9ybVBhcmFtc1twYXJhbUtleV0pXG4gICAgICAgIH1cbiAgICAgICAgcmVxdWVzdE9wdGlvbnMuYm9keSA9IGZvcm1cbiAgICAgIH0gZWxzZSBpZiAobGluay5lbmNvZGluZyA9PT0gJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcpIHtcbiAgICAgICAgbGV0IGZvcm1Cb2R5ID0gW11cbiAgICAgICAgZm9yIChsZXQgcGFyYW1LZXkgaW4gZm9ybVBhcmFtcykge1xuICAgICAgICAgIGNvbnN0IGVuY29kZWRLZXkgPSBlbmNvZGVVUklDb21wb25lbnQocGFyYW1LZXkpXG4gICAgICAgICAgY29uc3QgZW5jb2RlZFZhbHVlID0gZW5jb2RlVVJJQ29tcG9uZW50KGZvcm1QYXJhbXNbcGFyYW1LZXldKVxuICAgICAgICAgIGZvcm1Cb2R5LnB1c2goZW5jb2RlZEtleSArICc9JyArIGVuY29kZWRWYWx1ZSlcbiAgICAgICAgfVxuICAgICAgICBmb3JtQm9keSA9IGZvcm1Cb2R5LmpvaW4oJyYnKVxuXG4gICAgICAgIHJlcXVlc3RPcHRpb25zLmJvZHkgPSBmb3JtQm9keVxuICAgICAgICByZXF1ZXN0T3B0aW9ucy5oZWFkZXJzWydDb250ZW50LVR5cGUnXSA9ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuYXV0aCkge1xuICAgICAgcmVxdWVzdE9wdGlvbnMgPSB0aGlzLmF1dGguYXV0aGVudGljYXRlKHJlcXVlc3RPcHRpb25zKVxuICAgIH1cblxuICAgIGxldCBwYXJzZWRVcmwgPSB1cmxUZW1wbGF0ZS5wYXJzZShsaW5rLnVybClcbiAgICBwYXJzZWRVcmwgPSBwYXJzZWRVcmwuZXhwYW5kKHBhdGhQYXJhbXMpXG4gICAgcGFyc2VkVXJsID0gbmV3IFVSTChwYXJzZWRVcmwpXG4gICAgcGFyc2VkVXJsLnNldCgncXVlcnknLCBxdWVyeVBhcmFtcylcblxuICAgIHJldHVybiB7XG4gICAgICB1cmw6IHBhcnNlZFVybC50b1N0cmluZygpLFxuICAgICAgb3B0aW9uczogcmVxdWVzdE9wdGlvbnNcbiAgICB9XG4gIH1cblxuICBhY3Rpb24gKGxpbmssIGRlY29kZXJzLCBwYXJhbXMgPSB7fSwgdmFsaWRhdGUgPSB0cnVlKSB7XG4gICAgY29uc3QgcmVzcG9uc2VDYWxsYmFjayA9IHRoaXMucmVzcG9uc2VDYWxsYmFja1xuICAgIGNvbnN0IHJlcXVlc3QgPSB0aGlzLmJ1aWxkUmVxdWVzdChsaW5rLCBkZWNvZGVycywgcGFyYW1zLCB2YWxpZGF0ZSA9IHZhbGlkYXRlKVxuXG4gICAgaWYgKHRoaXMucmVxdWVzdENhbGxiYWNrKSB7XG4gICAgICB0aGlzLnJlcXVlc3RDYWxsYmFjayhyZXF1ZXN0KVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmZldGNoKHJlcXVlc3QudXJsLCByZXF1ZXN0Lm9wdGlvbnMpXG4gICAgICAudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgcmV0dXJuIHBhcnNlUmVzcG9uc2UocmVzcG9uc2UsIGRlY29kZXJzLCByZXNwb25zZUNhbGxiYWNrKVxuICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICBpZiAocmVzcG9uc2Uub2spIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGRhdGFcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGNvbnN0IHRpdGxlID0gcmVzcG9uc2Uuc3RhdHVzICsgJyAnICsgcmVzcG9uc2Uuc3RhdHVzVGV4dFxuICAgICAgICAgICAgICBjb25zdCBlcnJvciA9IG5ldyBlcnJvcnMuRXJyb3JNZXNzYWdlKHRpdGxlLCBkYXRhKVxuICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyb3IpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgIH0pXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIEhUVFBUcmFuc3BvcnQ6IEhUVFBUcmFuc3BvcnRcbn1cbiIsImNvbnN0IGh0dHAgPSByZXF1aXJlKCcuL2h0dHAnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgSFRUUFRyYW5zcG9ydDogaHR0cC5IVFRQVHJhbnNwb3J0XG59XG4iLCJjb25zdCBVUkwgPSByZXF1aXJlKCd1cmwtcGFyc2UnKVxuXG5jb25zdCBkZXRlcm1pbmVUcmFuc3BvcnQgPSBmdW5jdGlvbiAodHJhbnNwb3J0cywgdXJsKSB7XG4gIGNvbnN0IHBhcnNlZFVybCA9IG5ldyBVUkwodXJsKVxuICBjb25zdCBzY2hlbWUgPSBwYXJzZWRVcmwucHJvdG9jb2wucmVwbGFjZSgnOicsICcnKVxuXG4gIGZvciAobGV0IHRyYW5zcG9ydCBvZiB0cmFuc3BvcnRzKSB7XG4gICAgaWYgKHRyYW5zcG9ydC5zY2hlbWVzLmluY2x1ZGVzKHNjaGVtZSkpIHtcbiAgICAgIHJldHVybiB0cmFuc3BvcnRcbiAgICB9XG4gIH1cblxuICB0aHJvdyBFcnJvcihgVW5zdXBwb3J0ZWQgc2NoZW1lIGluIFVSTDogJHt1cmx9YClcbn1cblxuY29uc3QgbmVnb3RpYXRlRGVjb2RlciA9IGZ1bmN0aW9uIChkZWNvZGVycywgY29udGVudFR5cGUpIHtcbiAgaWYgKGNvbnRlbnRUeXBlID09PSB1bmRlZmluZWQgfHwgY29udGVudFR5cGUgPT09IG51bGwpIHtcbiAgICByZXR1cm4gZGVjb2RlcnNbMl1cbiAgfVxuXG4gIGNvbnN0IGZ1bGxUeXBlID0gY29udGVudFR5cGUudG9Mb3dlckNhc2UoKS5zcGxpdCgnOycpWzBdLnRyaW0oKVxuICBjb25zdCBtYWluVHlwZSA9IGZ1bGxUeXBlLnNwbGl0KCcvJylbMF0gKyAnLyonXG4gIGNvbnN0IHdpbGRjYXJkVHlwZSA9ICcqLyonXG4gIGNvbnN0IGFjY2VwdGFibGVUeXBlcyA9IFtmdWxsVHlwZSwgbWFpblR5cGUsIHdpbGRjYXJkVHlwZV1cblxuICBmb3IgKGxldCBkZWNvZGVyIG9mIGRlY29kZXJzKSB7XG4gICAgaWYgKGFjY2VwdGFibGVUeXBlcy5pbmNsdWRlcyhkZWNvZGVyLm1lZGlhVHlwZSkpIHtcbiAgICAgIHJldHVybiBkZWNvZGVyXG4gICAgfVxuICB9XG5cbiAgdGhyb3cgRXJyb3IoYFVuc3VwcG9ydGVkIG1lZGlhIGluIENvbnRlbnQtVHlwZSBoZWFkZXI6ICR7Y29udGVudFR5cGV9YClcbn1cblxuY29uc3QgY3NyZlNhZmVNZXRob2QgPSBmdW5jdGlvbiAobWV0aG9kKSB7XG4gIC8vIHRoZXNlIEhUVFAgbWV0aG9kcyBkbyBub3QgcmVxdWlyZSBDU1JGIHByb3RlY3Rpb25cbiAgcmV0dXJuICgvXihHRVR8SEVBRHxPUFRJT05TfFRSQUNFKSQvLnRlc3QobWV0aG9kKSlcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGRldGVybWluZVRyYW5zcG9ydDogZGV0ZXJtaW5lVHJhbnNwb3J0LFxuICBuZWdvdGlhdGVEZWNvZGVyOiBuZWdvdGlhdGVEZWNvZGVyLFxuICBjc3JmU2FmZU1ldGhvZDogY3NyZlNhZmVNZXRob2Rcbn1cbiIsIi8vIHRoZSB3aGF0d2ctZmV0Y2ggcG9seWZpbGwgaW5zdGFsbHMgdGhlIGZldGNoKCkgZnVuY3Rpb25cbi8vIG9uIHRoZSBnbG9iYWwgb2JqZWN0ICh3aW5kb3cgb3Igc2VsZilcbi8vXG4vLyBSZXR1cm4gdGhhdCBhcyB0aGUgZXhwb3J0IGZvciB1c2UgaW4gV2VicGFjaywgQnJvd3NlcmlmeSBldGMuXG5yZXF1aXJlKCd3aGF0d2ctZmV0Y2gnKTtcbm1vZHVsZS5leHBvcnRzID0gc2VsZi5mZXRjaC5iaW5kKHNlbGYpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaGFzID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBEZWNvZGUgYSBVUkkgZW5jb2RlZCBzdHJpbmcuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGlucHV0IFRoZSBVUkkgZW5jb2RlZCBzdHJpbmcuXG4gKiBAcmV0dXJucyB7U3RyaW5nfSBUaGUgZGVjb2RlZCBzdHJpbmcuXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gZGVjb2RlKGlucHV0KSB7XG4gIHJldHVybiBkZWNvZGVVUklDb21wb25lbnQoaW5wdXQucmVwbGFjZSgvXFwrL2csICcgJykpO1xufVxuXG4vKipcbiAqIFNpbXBsZSBxdWVyeSBzdHJpbmcgcGFyc2VyLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBxdWVyeSBUaGUgcXVlcnkgc3RyaW5nIHRoYXQgbmVlZHMgdG8gYmUgcGFyc2VkLlxuICogQHJldHVybnMge09iamVjdH1cbiAqIEBhcGkgcHVibGljXG4gKi9cbmZ1bmN0aW9uIHF1ZXJ5c3RyaW5nKHF1ZXJ5KSB7XG4gIHZhciBwYXJzZXIgPSAvKFtePT8mXSspPT8oW14mXSopL2dcbiAgICAsIHJlc3VsdCA9IHt9XG4gICAgLCBwYXJ0O1xuXG4gIC8vXG4gIC8vIExpdHRsZSBuaWZ0eSBwYXJzaW5nIGhhY2ssIGxldmVyYWdlIHRoZSBmYWN0IHRoYXQgUmVnRXhwLmV4ZWMgaW5jcmVtZW50c1xuICAvLyB0aGUgbGFzdEluZGV4IHByb3BlcnR5IHNvIHdlIGNhbiBjb250aW51ZSBleGVjdXRpbmcgdGhpcyBsb29wIHVudGlsIHdlJ3ZlXG4gIC8vIHBhcnNlZCBhbGwgcmVzdWx0cy5cbiAgLy9cbiAgZm9yICg7XG4gICAgcGFydCA9IHBhcnNlci5leGVjKHF1ZXJ5KTtcbiAgICByZXN1bHRbZGVjb2RlKHBhcnRbMV0pXSA9IGRlY29kZShwYXJ0WzJdKVxuICApO1xuXG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogVHJhbnNmb3JtIGEgcXVlcnkgc3RyaW5nIHRvIGFuIG9iamVjdC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqIE9iamVjdCB0aGF0IHNob3VsZCBiZSB0cmFuc2Zvcm1lZC5cbiAqIEBwYXJhbSB7U3RyaW5nfSBwcmVmaXggT3B0aW9uYWwgcHJlZml4LlxuICogQHJldHVybnMge1N0cmluZ31cbiAqIEBhcGkgcHVibGljXG4gKi9cbmZ1bmN0aW9uIHF1ZXJ5c3RyaW5naWZ5KG9iaiwgcHJlZml4KSB7XG4gIHByZWZpeCA9IHByZWZpeCB8fCAnJztcblxuICB2YXIgcGFpcnMgPSBbXTtcblxuICAvL1xuICAvLyBPcHRpb25hbGx5IHByZWZpeCB3aXRoIGEgJz8nIGlmIG5lZWRlZFxuICAvL1xuICBpZiAoJ3N0cmluZycgIT09IHR5cGVvZiBwcmVmaXgpIHByZWZpeCA9ICc/JztcblxuICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgaWYgKGhhcy5jYWxsKG9iaiwga2V5KSkge1xuICAgICAgcGFpcnMucHVzaChlbmNvZGVVUklDb21wb25lbnQoa2V5KSArJz0nKyBlbmNvZGVVUklDb21wb25lbnQob2JqW2tleV0pKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcGFpcnMubGVuZ3RoID8gcHJlZml4ICsgcGFpcnMuam9pbignJicpIDogJyc7XG59XG5cbi8vXG4vLyBFeHBvc2UgdGhlIG1vZHVsZS5cbi8vXG5leHBvcnRzLnN0cmluZ2lmeSA9IHF1ZXJ5c3RyaW5naWZ5O1xuZXhwb3J0cy5wYXJzZSA9IHF1ZXJ5c3RyaW5nO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIENoZWNrIGlmIHdlJ3JlIHJlcXVpcmVkIHRvIGFkZCBhIHBvcnQgbnVtYmVyLlxuICpcbiAqIEBzZWUgaHR0cHM6Ly91cmwuc3BlYy53aGF0d2cub3JnLyNkZWZhdWx0LXBvcnRcbiAqIEBwYXJhbSB7TnVtYmVyfFN0cmluZ30gcG9ydCBQb3J0IG51bWJlciB3ZSBuZWVkIHRvIGNoZWNrXG4gKiBAcGFyYW0ge1N0cmluZ30gcHJvdG9jb2wgUHJvdG9jb2wgd2UgbmVlZCB0byBjaGVjayBhZ2FpbnN0LlxuICogQHJldHVybnMge0Jvb2xlYW59IElzIGl0IGEgZGVmYXVsdCBwb3J0IGZvciB0aGUgZ2l2ZW4gcHJvdG9jb2xcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHJlcXVpcmVkKHBvcnQsIHByb3RvY29sKSB7XG4gIHByb3RvY29sID0gcHJvdG9jb2wuc3BsaXQoJzonKVswXTtcbiAgcG9ydCA9ICtwb3J0O1xuXG4gIGlmICghcG9ydCkgcmV0dXJuIGZhbHNlO1xuXG4gIHN3aXRjaCAocHJvdG9jb2wpIHtcbiAgICBjYXNlICdodHRwJzpcbiAgICBjYXNlICd3cyc6XG4gICAgcmV0dXJuIHBvcnQgIT09IDgwO1xuXG4gICAgY2FzZSAnaHR0cHMnOlxuICAgIGNhc2UgJ3dzcyc6XG4gICAgcmV0dXJuIHBvcnQgIT09IDQ0MztcblxuICAgIGNhc2UgJ2Z0cCc6XG4gICAgcmV0dXJuIHBvcnQgIT09IDIxO1xuXG4gICAgY2FzZSAnZ29waGVyJzpcbiAgICByZXR1cm4gcG9ydCAhPT0gNzA7XG5cbiAgICBjYXNlICdmaWxlJzpcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gcG9ydCAhPT0gMDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciByZXF1aXJlZCA9IHJlcXVpcmUoJ3JlcXVpcmVzLXBvcnQnKVxuICAsIHFzID0gcmVxdWlyZSgncXVlcnlzdHJpbmdpZnknKVxuICAsIHByb3RvY29scmUgPSAvXihbYS16XVthLXowLTkuKy1dKjopPyhcXC9cXC8pPyhbXFxTXFxzXSopL2lcbiAgLCBzbGFzaGVzID0gL15bQS1aYS16XVtBLVphLXowLTkrLS5dKjpcXC9cXC8vO1xuXG4vKipcbiAqIFRoZXNlIGFyZSB0aGUgcGFyc2UgcnVsZXMgZm9yIHRoZSBVUkwgcGFyc2VyLCBpdCBpbmZvcm1zIHRoZSBwYXJzZXJcbiAqIGFib3V0OlxuICpcbiAqIDAuIFRoZSBjaGFyIGl0IE5lZWRzIHRvIHBhcnNlLCBpZiBpdCdzIGEgc3RyaW5nIGl0IHNob3VsZCBiZSBkb25lIHVzaW5nXG4gKiAgICBpbmRleE9mLCBSZWdFeHAgdXNpbmcgZXhlYyBhbmQgTmFOIG1lYW5zIHNldCBhcyBjdXJyZW50IHZhbHVlLlxuICogMS4gVGhlIHByb3BlcnR5IHdlIHNob3VsZCBzZXQgd2hlbiBwYXJzaW5nIHRoaXMgdmFsdWUuXG4gKiAyLiBJbmRpY2F0aW9uIGlmIGl0J3MgYmFja3dhcmRzIG9yIGZvcndhcmQgcGFyc2luZywgd2hlbiBzZXQgYXMgbnVtYmVyIGl0J3NcbiAqICAgIHRoZSB2YWx1ZSBvZiBleHRyYSBjaGFycyB0aGF0IHNob3VsZCBiZSBzcGxpdCBvZmYuXG4gKiAzLiBJbmhlcml0IGZyb20gbG9jYXRpb24gaWYgbm9uIGV4aXN0aW5nIGluIHRoZSBwYXJzZXIuXG4gKiA0LiBgdG9Mb3dlckNhc2VgIHRoZSByZXN1bHRpbmcgdmFsdWUuXG4gKi9cbnZhciBydWxlcyA9IFtcbiAgWycjJywgJ2hhc2gnXSwgICAgICAgICAgICAgICAgICAgICAgICAvLyBFeHRyYWN0IGZyb20gdGhlIGJhY2suXG4gIFsnPycsICdxdWVyeSddLCAgICAgICAgICAgICAgICAgICAgICAgLy8gRXh0cmFjdCBmcm9tIHRoZSBiYWNrLlxuICBbJy8nLCAncGF0aG5hbWUnXSwgICAgICAgICAgICAgICAgICAgIC8vIEV4dHJhY3QgZnJvbSB0aGUgYmFjay5cbiAgWydAJywgJ2F1dGgnLCAxXSwgICAgICAgICAgICAgICAgICAgICAvLyBFeHRyYWN0IGZyb20gdGhlIGZyb250LlxuICBbTmFOLCAnaG9zdCcsIHVuZGVmaW5lZCwgMSwgMV0sICAgICAgIC8vIFNldCBsZWZ0IG92ZXIgdmFsdWUuXG4gIFsvOihcXGQrKSQvLCAncG9ydCcsIHVuZGVmaW5lZCwgMV0sICAgIC8vIFJlZ0V4cCB0aGUgYmFjay5cbiAgW05hTiwgJ2hvc3RuYW1lJywgdW5kZWZpbmVkLCAxLCAxXSAgICAvLyBTZXQgbGVmdCBvdmVyLlxuXTtcblxuLyoqXG4gKiBUaGVzZSBwcm9wZXJ0aWVzIHNob3VsZCBub3QgYmUgY29waWVkIG9yIGluaGVyaXRlZCBmcm9tLiBUaGlzIGlzIG9ubHkgbmVlZGVkXG4gKiBmb3IgYWxsIG5vbiBibG9iIFVSTCdzIGFzIGEgYmxvYiBVUkwgZG9lcyBub3QgaW5jbHVkZSBhIGhhc2gsIG9ubHkgdGhlXG4gKiBvcmlnaW4uXG4gKlxuICogQHR5cGUge09iamVjdH1cbiAqIEBwcml2YXRlXG4gKi9cbnZhciBpZ25vcmUgPSB7IGhhc2g6IDEsIHF1ZXJ5OiAxIH07XG5cbi8qKlxuICogVGhlIGxvY2F0aW9uIG9iamVjdCBkaWZmZXJzIHdoZW4geW91ciBjb2RlIGlzIGxvYWRlZCB0aHJvdWdoIGEgbm9ybWFsIHBhZ2UsXG4gKiBXb3JrZXIgb3IgdGhyb3VnaCBhIHdvcmtlciB1c2luZyBhIGJsb2IuIEFuZCB3aXRoIHRoZSBibG9iYmxlIGJlZ2lucyB0aGVcbiAqIHRyb3VibGUgYXMgdGhlIGxvY2F0aW9uIG9iamVjdCB3aWxsIGNvbnRhaW4gdGhlIFVSTCBvZiB0aGUgYmxvYiwgbm90IHRoZVxuICogbG9jYXRpb24gb2YgdGhlIHBhZ2Ugd2hlcmUgb3VyIGNvZGUgaXMgbG9hZGVkIGluLiBUaGUgYWN0dWFsIG9yaWdpbiBpc1xuICogZW5jb2RlZCBpbiB0aGUgYHBhdGhuYW1lYCBzbyB3ZSBjYW4gdGhhbmtmdWxseSBnZW5lcmF0ZSBhIGdvb2QgXCJkZWZhdWx0XCJcbiAqIGxvY2F0aW9uIGZyb20gaXQgc28gd2UgY2FuIGdlbmVyYXRlIHByb3BlciByZWxhdGl2ZSBVUkwncyBhZ2Fpbi5cbiAqXG4gKiBAcGFyYW0ge09iamVjdHxTdHJpbmd9IGxvYyBPcHRpb25hbCBkZWZhdWx0IGxvY2F0aW9uIG9iamVjdC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IGxvbGNhdGlvbiBvYmplY3QuXG4gKiBAYXBpIHB1YmxpY1xuICovXG5mdW5jdGlvbiBsb2xjYXRpb24obG9jKSB7XG4gIGxvYyA9IGxvYyB8fCBnbG9iYWwubG9jYXRpb24gfHwge307XG5cbiAgdmFyIGZpbmFsZGVzdGluYXRpb24gPSB7fVxuICAgICwgdHlwZSA9IHR5cGVvZiBsb2NcbiAgICAsIGtleTtcblxuICBpZiAoJ2Jsb2I6JyA9PT0gbG9jLnByb3RvY29sKSB7XG4gICAgZmluYWxkZXN0aW5hdGlvbiA9IG5ldyBVUkwodW5lc2NhcGUobG9jLnBhdGhuYW1lKSwge30pO1xuICB9IGVsc2UgaWYgKCdzdHJpbmcnID09PSB0eXBlKSB7XG4gICAgZmluYWxkZXN0aW5hdGlvbiA9IG5ldyBVUkwobG9jLCB7fSk7XG4gICAgZm9yIChrZXkgaW4gaWdub3JlKSBkZWxldGUgZmluYWxkZXN0aW5hdGlvbltrZXldO1xuICB9IGVsc2UgaWYgKCdvYmplY3QnID09PSB0eXBlKSB7XG4gICAgZm9yIChrZXkgaW4gbG9jKSB7XG4gICAgICBpZiAoa2V5IGluIGlnbm9yZSkgY29udGludWU7XG4gICAgICBmaW5hbGRlc3RpbmF0aW9uW2tleV0gPSBsb2Nba2V5XTtcbiAgICB9XG5cbiAgICBpZiAoZmluYWxkZXN0aW5hdGlvbi5zbGFzaGVzID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGZpbmFsZGVzdGluYXRpb24uc2xhc2hlcyA9IHNsYXNoZXMudGVzdChsb2MuaHJlZik7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZpbmFsZGVzdGluYXRpb247XG59XG5cbi8qKlxuICogQHR5cGVkZWYgUHJvdG9jb2xFeHRyYWN0XG4gKiBAdHlwZSBPYmplY3RcbiAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBwcm90b2NvbCBQcm90b2NvbCBtYXRjaGVkIGluIHRoZSBVUkwsIGluIGxvd2VyY2FzZS5cbiAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gc2xhc2hlcyBgdHJ1ZWAgaWYgcHJvdG9jb2wgaXMgZm9sbG93ZWQgYnkgXCIvL1wiLCBlbHNlIGBmYWxzZWAuXG4gKiBAcHJvcGVydHkge1N0cmluZ30gcmVzdCBSZXN0IG9mIHRoZSBVUkwgdGhhdCBpcyBub3QgcGFydCBvZiB0aGUgcHJvdG9jb2wuXG4gKi9cblxuLyoqXG4gKiBFeHRyYWN0IHByb3RvY29sIGluZm9ybWF0aW9uIGZyb20gYSBVUkwgd2l0aC93aXRob3V0IGRvdWJsZSBzbGFzaCAoXCIvL1wiKS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gYWRkcmVzcyBVUkwgd2Ugd2FudCB0byBleHRyYWN0IGZyb20uXG4gKiBAcmV0dXJuIHtQcm90b2NvbEV4dHJhY3R9IEV4dHJhY3RlZCBpbmZvcm1hdGlvbi5cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBleHRyYWN0UHJvdG9jb2woYWRkcmVzcykge1xuICB2YXIgbWF0Y2ggPSBwcm90b2NvbHJlLmV4ZWMoYWRkcmVzcyk7XG5cbiAgcmV0dXJuIHtcbiAgICBwcm90b2NvbDogbWF0Y2hbMV0gPyBtYXRjaFsxXS50b0xvd2VyQ2FzZSgpIDogJycsXG4gICAgc2xhc2hlczogISFtYXRjaFsyXSxcbiAgICByZXN0OiBtYXRjaFszXVxuICB9O1xufVxuXG4vKipcbiAqIFJlc29sdmUgYSByZWxhdGl2ZSBVUkwgcGF0aG5hbWUgYWdhaW5zdCBhIGJhc2UgVVJMIHBhdGhuYW1lLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSByZWxhdGl2ZSBQYXRobmFtZSBvZiB0aGUgcmVsYXRpdmUgVVJMLlxuICogQHBhcmFtIHtTdHJpbmd9IGJhc2UgUGF0aG5hbWUgb2YgdGhlIGJhc2UgVVJMLlxuICogQHJldHVybiB7U3RyaW5nfSBSZXNvbHZlZCBwYXRobmFtZS5cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5mdW5jdGlvbiByZXNvbHZlKHJlbGF0aXZlLCBiYXNlKSB7XG4gIHZhciBwYXRoID0gKGJhc2UgfHwgJy8nKS5zcGxpdCgnLycpLnNsaWNlKDAsIC0xKS5jb25jYXQocmVsYXRpdmUuc3BsaXQoJy8nKSlcbiAgICAsIGkgPSBwYXRoLmxlbmd0aFxuICAgICwgbGFzdCA9IHBhdGhbaSAtIDFdXG4gICAgLCB1bnNoaWZ0ID0gZmFsc2VcbiAgICAsIHVwID0gMDtcblxuICB3aGlsZSAoaS0tKSB7XG4gICAgaWYgKHBhdGhbaV0gPT09ICcuJykge1xuICAgICAgcGF0aC5zcGxpY2UoaSwgMSk7XG4gICAgfSBlbHNlIGlmIChwYXRoW2ldID09PSAnLi4nKSB7XG4gICAgICBwYXRoLnNwbGljZShpLCAxKTtcbiAgICAgIHVwKys7XG4gICAgfSBlbHNlIGlmICh1cCkge1xuICAgICAgaWYgKGkgPT09IDApIHVuc2hpZnQgPSB0cnVlO1xuICAgICAgcGF0aC5zcGxpY2UoaSwgMSk7XG4gICAgICB1cC0tO1xuICAgIH1cbiAgfVxuXG4gIGlmICh1bnNoaWZ0KSBwYXRoLnVuc2hpZnQoJycpO1xuICBpZiAobGFzdCA9PT0gJy4nIHx8IGxhc3QgPT09ICcuLicpIHBhdGgucHVzaCgnJyk7XG5cbiAgcmV0dXJuIHBhdGguam9pbignLycpO1xufVxuXG4vKipcbiAqIFRoZSBhY3R1YWwgVVJMIGluc3RhbmNlLiBJbnN0ZWFkIG9mIHJldHVybmluZyBhbiBvYmplY3Qgd2UndmUgb3B0ZWQtaW4gdG9cbiAqIGNyZWF0ZSBhbiBhY3R1YWwgY29uc3RydWN0b3IgYXMgaXQncyBtdWNoIG1vcmUgbWVtb3J5IGVmZmljaWVudCBhbmRcbiAqIGZhc3RlciBhbmQgaXQgcGxlYXNlcyBteSBPQ0QuXG4gKlxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge1N0cmluZ30gYWRkcmVzcyBVUkwgd2Ugd2FudCB0byBwYXJzZS5cbiAqIEBwYXJhbSB7T2JqZWN0fFN0cmluZ30gbG9jYXRpb24gTG9jYXRpb24gZGVmYXVsdHMgZm9yIHJlbGF0aXZlIHBhdGhzLlxuICogQHBhcmFtIHtCb29sZWFufEZ1bmN0aW9ufSBwYXJzZXIgUGFyc2VyIGZvciB0aGUgcXVlcnkgc3RyaW5nLlxuICogQGFwaSBwdWJsaWNcbiAqL1xuZnVuY3Rpb24gVVJMKGFkZHJlc3MsIGxvY2F0aW9uLCBwYXJzZXIpIHtcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIFVSTCkpIHtcbiAgICByZXR1cm4gbmV3IFVSTChhZGRyZXNzLCBsb2NhdGlvbiwgcGFyc2VyKTtcbiAgfVxuXG4gIHZhciByZWxhdGl2ZSwgZXh0cmFjdGVkLCBwYXJzZSwgaW5zdHJ1Y3Rpb24sIGluZGV4LCBrZXlcbiAgICAsIGluc3RydWN0aW9ucyA9IHJ1bGVzLnNsaWNlKClcbiAgICAsIHR5cGUgPSB0eXBlb2YgbG9jYXRpb25cbiAgICAsIHVybCA9IHRoaXNcbiAgICAsIGkgPSAwO1xuXG4gIC8vXG4gIC8vIFRoZSBmb2xsb3dpbmcgaWYgc3RhdGVtZW50cyBhbGxvd3MgdGhpcyBtb2R1bGUgdHdvIGhhdmUgY29tcGF0aWJpbGl0eSB3aXRoXG4gIC8vIDIgZGlmZmVyZW50IEFQSTpcbiAgLy9cbiAgLy8gMS4gTm9kZS5qcydzIGB1cmwucGFyc2VgIGFwaSB3aGljaCBhY2NlcHRzIGEgVVJMLCBib29sZWFuIGFzIGFyZ3VtZW50c1xuICAvLyAgICB3aGVyZSB0aGUgYm9vbGVhbiBpbmRpY2F0ZXMgdGhhdCB0aGUgcXVlcnkgc3RyaW5nIHNob3VsZCBhbHNvIGJlIHBhcnNlZC5cbiAgLy9cbiAgLy8gMi4gVGhlIGBVUkxgIGludGVyZmFjZSBvZiB0aGUgYnJvd3NlciB3aGljaCBhY2NlcHRzIGEgVVJMLCBvYmplY3QgYXNcbiAgLy8gICAgYXJndW1lbnRzLiBUaGUgc3VwcGxpZWQgb2JqZWN0IHdpbGwgYmUgdXNlZCBhcyBkZWZhdWx0IHZhbHVlcyAvIGZhbGwtYmFja1xuICAvLyAgICBmb3IgcmVsYXRpdmUgcGF0aHMuXG4gIC8vXG4gIGlmICgnb2JqZWN0JyAhPT0gdHlwZSAmJiAnc3RyaW5nJyAhPT0gdHlwZSkge1xuICAgIHBhcnNlciA9IGxvY2F0aW9uO1xuICAgIGxvY2F0aW9uID0gbnVsbDtcbiAgfVxuXG4gIGlmIChwYXJzZXIgJiYgJ2Z1bmN0aW9uJyAhPT0gdHlwZW9mIHBhcnNlcikgcGFyc2VyID0gcXMucGFyc2U7XG5cbiAgbG9jYXRpb24gPSBsb2xjYXRpb24obG9jYXRpb24pO1xuXG4gIC8vXG4gIC8vIEV4dHJhY3QgcHJvdG9jb2wgaW5mb3JtYXRpb24gYmVmb3JlIHJ1bm5pbmcgdGhlIGluc3RydWN0aW9ucy5cbiAgLy9cbiAgZXh0cmFjdGVkID0gZXh0cmFjdFByb3RvY29sKGFkZHJlc3MgfHwgJycpO1xuICByZWxhdGl2ZSA9ICFleHRyYWN0ZWQucHJvdG9jb2wgJiYgIWV4dHJhY3RlZC5zbGFzaGVzO1xuICB1cmwuc2xhc2hlcyA9IGV4dHJhY3RlZC5zbGFzaGVzIHx8IHJlbGF0aXZlICYmIGxvY2F0aW9uLnNsYXNoZXM7XG4gIHVybC5wcm90b2NvbCA9IGV4dHJhY3RlZC5wcm90b2NvbCB8fCBsb2NhdGlvbi5wcm90b2NvbCB8fCAnJztcbiAgYWRkcmVzcyA9IGV4dHJhY3RlZC5yZXN0O1xuXG4gIC8vXG4gIC8vIFdoZW4gdGhlIGF1dGhvcml0eSBjb21wb25lbnQgaXMgYWJzZW50IHRoZSBVUkwgc3RhcnRzIHdpdGggYSBwYXRoXG4gIC8vIGNvbXBvbmVudC5cbiAgLy9cbiAgaWYgKCFleHRyYWN0ZWQuc2xhc2hlcykgaW5zdHJ1Y3Rpb25zWzJdID0gWy8oLiopLywgJ3BhdGhuYW1lJ107XG5cbiAgZm9yICg7IGkgPCBpbnN0cnVjdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICBpbnN0cnVjdGlvbiA9IGluc3RydWN0aW9uc1tpXTtcbiAgICBwYXJzZSA9IGluc3RydWN0aW9uWzBdO1xuICAgIGtleSA9IGluc3RydWN0aW9uWzFdO1xuXG4gICAgaWYgKHBhcnNlICE9PSBwYXJzZSkge1xuICAgICAgdXJsW2tleV0gPSBhZGRyZXNzO1xuICAgIH0gZWxzZSBpZiAoJ3N0cmluZycgPT09IHR5cGVvZiBwYXJzZSkge1xuICAgICAgaWYgKH4oaW5kZXggPSBhZGRyZXNzLmluZGV4T2YocGFyc2UpKSkge1xuICAgICAgICBpZiAoJ251bWJlcicgPT09IHR5cGVvZiBpbnN0cnVjdGlvblsyXSkge1xuICAgICAgICAgIHVybFtrZXldID0gYWRkcmVzcy5zbGljZSgwLCBpbmRleCk7XG4gICAgICAgICAgYWRkcmVzcyA9IGFkZHJlc3Muc2xpY2UoaW5kZXggKyBpbnN0cnVjdGlvblsyXSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdXJsW2tleV0gPSBhZGRyZXNzLnNsaWNlKGluZGV4KTtcbiAgICAgICAgICBhZGRyZXNzID0gYWRkcmVzcy5zbGljZSgwLCBpbmRleCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKChpbmRleCA9IHBhcnNlLmV4ZWMoYWRkcmVzcykpKSB7XG4gICAgICB1cmxba2V5XSA9IGluZGV4WzFdO1xuICAgICAgYWRkcmVzcyA9IGFkZHJlc3Muc2xpY2UoMCwgaW5kZXguaW5kZXgpO1xuICAgIH1cblxuICAgIHVybFtrZXldID0gdXJsW2tleV0gfHwgKFxuICAgICAgcmVsYXRpdmUgJiYgaW5zdHJ1Y3Rpb25bM10gPyBsb2NhdGlvbltrZXldIHx8ICcnIDogJydcbiAgICApO1xuXG4gICAgLy9cbiAgICAvLyBIb3N0bmFtZSwgaG9zdCBhbmQgcHJvdG9jb2wgc2hvdWxkIGJlIGxvd2VyY2FzZWQgc28gdGhleSBjYW4gYmUgdXNlZCB0b1xuICAgIC8vIGNyZWF0ZSBhIHByb3BlciBgb3JpZ2luYC5cbiAgICAvL1xuICAgIGlmIChpbnN0cnVjdGlvbls0XSkgdXJsW2tleV0gPSB1cmxba2V5XS50b0xvd2VyQ2FzZSgpO1xuICB9XG5cbiAgLy9cbiAgLy8gQWxzbyBwYXJzZSB0aGUgc3VwcGxpZWQgcXVlcnkgc3RyaW5nIGluIHRvIGFuIG9iamVjdC4gSWYgd2UncmUgc3VwcGxpZWRcbiAgLy8gd2l0aCBhIGN1c3RvbSBwYXJzZXIgYXMgZnVuY3Rpb24gdXNlIHRoYXQgaW5zdGVhZCBvZiB0aGUgZGVmYXVsdCBidWlsZC1pblxuICAvLyBwYXJzZXIuXG4gIC8vXG4gIGlmIChwYXJzZXIpIHVybC5xdWVyeSA9IHBhcnNlcih1cmwucXVlcnkpO1xuXG4gIC8vXG4gIC8vIElmIHRoZSBVUkwgaXMgcmVsYXRpdmUsIHJlc29sdmUgdGhlIHBhdGhuYW1lIGFnYWluc3QgdGhlIGJhc2UgVVJMLlxuICAvL1xuICBpZiAoXG4gICAgICByZWxhdGl2ZVxuICAgICYmIGxvY2F0aW9uLnNsYXNoZXNcbiAgICAmJiB1cmwucGF0aG5hbWUuY2hhckF0KDApICE9PSAnLydcbiAgICAmJiAodXJsLnBhdGhuYW1lICE9PSAnJyB8fCBsb2NhdGlvbi5wYXRobmFtZSAhPT0gJycpXG4gICkge1xuICAgIHVybC5wYXRobmFtZSA9IHJlc29sdmUodXJsLnBhdGhuYW1lLCBsb2NhdGlvbi5wYXRobmFtZSk7XG4gIH1cblxuICAvL1xuICAvLyBXZSBzaG91bGQgbm90IGFkZCBwb3J0IG51bWJlcnMgaWYgdGhleSBhcmUgYWxyZWFkeSB0aGUgZGVmYXVsdCBwb3J0IG51bWJlclxuICAvLyBmb3IgYSBnaXZlbiBwcm90b2NvbC4gQXMgdGhlIGhvc3QgYWxzbyBjb250YWlucyB0aGUgcG9ydCBudW1iZXIgd2UncmUgZ29pbmdcbiAgLy8gb3ZlcnJpZGUgaXQgd2l0aCB0aGUgaG9zdG5hbWUgd2hpY2ggY29udGFpbnMgbm8gcG9ydCBudW1iZXIuXG4gIC8vXG4gIGlmICghcmVxdWlyZWQodXJsLnBvcnQsIHVybC5wcm90b2NvbCkpIHtcbiAgICB1cmwuaG9zdCA9IHVybC5ob3N0bmFtZTtcbiAgICB1cmwucG9ydCA9ICcnO1xuICB9XG5cbiAgLy9cbiAgLy8gUGFyc2UgZG93biB0aGUgYGF1dGhgIGZvciB0aGUgdXNlcm5hbWUgYW5kIHBhc3N3b3JkLlxuICAvL1xuICB1cmwudXNlcm5hbWUgPSB1cmwucGFzc3dvcmQgPSAnJztcbiAgaWYgKHVybC5hdXRoKSB7XG4gICAgaW5zdHJ1Y3Rpb24gPSB1cmwuYXV0aC5zcGxpdCgnOicpO1xuICAgIHVybC51c2VybmFtZSA9IGluc3RydWN0aW9uWzBdIHx8ICcnO1xuICAgIHVybC5wYXNzd29yZCA9IGluc3RydWN0aW9uWzFdIHx8ICcnO1xuICB9XG5cbiAgdXJsLm9yaWdpbiA9IHVybC5wcm90b2NvbCAmJiB1cmwuaG9zdCAmJiB1cmwucHJvdG9jb2wgIT09ICdmaWxlOidcbiAgICA/IHVybC5wcm90b2NvbCArJy8vJysgdXJsLmhvc3RcbiAgICA6ICdudWxsJztcblxuICAvL1xuICAvLyBUaGUgaHJlZiBpcyBqdXN0IHRoZSBjb21waWxlZCByZXN1bHQuXG4gIC8vXG4gIHVybC5ocmVmID0gdXJsLnRvU3RyaW5nKCk7XG59XG5cbi8qKlxuICogVGhpcyBpcyBjb252ZW5pZW5jZSBtZXRob2QgZm9yIGNoYW5naW5nIHByb3BlcnRpZXMgaW4gdGhlIFVSTCBpbnN0YW5jZSB0b1xuICogaW5zdXJlIHRoYXQgdGhleSBhbGwgcHJvcGFnYXRlIGNvcnJlY3RseS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gcGFydCAgICAgICAgICBQcm9wZXJ0eSB3ZSBuZWVkIHRvIGFkanVzdC5cbiAqIEBwYXJhbSB7TWl4ZWR9IHZhbHVlICAgICAgICAgIFRoZSBuZXdseSBhc3NpZ25lZCB2YWx1ZS5cbiAqIEBwYXJhbSB7Qm9vbGVhbnxGdW5jdGlvbn0gZm4gIFdoZW4gc2V0dGluZyB0aGUgcXVlcnksIGl0IHdpbGwgYmUgdGhlIGZ1bmN0aW9uXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VkIHRvIHBhcnNlIHRoZSBxdWVyeS5cbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFdoZW4gc2V0dGluZyB0aGUgcHJvdG9jb2wsIGRvdWJsZSBzbGFzaCB3aWxsIGJlXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZW1vdmVkIGZyb20gdGhlIGZpbmFsIHVybCBpZiBpdCBpcyB0cnVlLlxuICogQHJldHVybnMge1VSTH1cbiAqIEBhcGkgcHVibGljXG4gKi9cbmZ1bmN0aW9uIHNldChwYXJ0LCB2YWx1ZSwgZm4pIHtcbiAgdmFyIHVybCA9IHRoaXM7XG5cbiAgc3dpdGNoIChwYXJ0KSB7XG4gICAgY2FzZSAncXVlcnknOlxuICAgICAgaWYgKCdzdHJpbmcnID09PSB0eXBlb2YgdmFsdWUgJiYgdmFsdWUubGVuZ3RoKSB7XG4gICAgICAgIHZhbHVlID0gKGZuIHx8IHFzLnBhcnNlKSh2YWx1ZSk7XG4gICAgICB9XG5cbiAgICAgIHVybFtwYXJ0XSA9IHZhbHVlO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlICdwb3J0JzpcbiAgICAgIHVybFtwYXJ0XSA9IHZhbHVlO1xuXG4gICAgICBpZiAoIXJlcXVpcmVkKHZhbHVlLCB1cmwucHJvdG9jb2wpKSB7XG4gICAgICAgIHVybC5ob3N0ID0gdXJsLmhvc3RuYW1lO1xuICAgICAgICB1cmxbcGFydF0gPSAnJztcbiAgICAgIH0gZWxzZSBpZiAodmFsdWUpIHtcbiAgICAgICAgdXJsLmhvc3QgPSB1cmwuaG9zdG5hbWUgKyc6JysgdmFsdWU7XG4gICAgICB9XG5cbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSAnaG9zdG5hbWUnOlxuICAgICAgdXJsW3BhcnRdID0gdmFsdWU7XG5cbiAgICAgIGlmICh1cmwucG9ydCkgdmFsdWUgKz0gJzonKyB1cmwucG9ydDtcbiAgICAgIHVybC5ob3N0ID0gdmFsdWU7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgJ2hvc3QnOlxuICAgICAgdXJsW3BhcnRdID0gdmFsdWU7XG5cbiAgICAgIGlmICgvOlxcZCskLy50ZXN0KHZhbHVlKSkge1xuICAgICAgICB2YWx1ZSA9IHZhbHVlLnNwbGl0KCc6Jyk7XG4gICAgICAgIHVybC5wb3J0ID0gdmFsdWUucG9wKCk7XG4gICAgICAgIHVybC5ob3N0bmFtZSA9IHZhbHVlLmpvaW4oJzonKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHVybC5ob3N0bmFtZSA9IHZhbHVlO1xuICAgICAgICB1cmwucG9ydCA9ICcnO1xuICAgICAgfVxuXG4gICAgICBicmVhaztcblxuICAgIGNhc2UgJ3Byb3RvY29sJzpcbiAgICAgIHVybC5wcm90b2NvbCA9IHZhbHVlLnRvTG93ZXJDYXNlKCk7XG4gICAgICB1cmwuc2xhc2hlcyA9ICFmbjtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSAncGF0aG5hbWUnOlxuICAgICAgdXJsLnBhdGhuYW1lID0gdmFsdWUubGVuZ3RoICYmIHZhbHVlLmNoYXJBdCgwKSAhPT0gJy8nID8gJy8nICsgdmFsdWUgOiB2YWx1ZTtcblxuICAgICAgYnJlYWs7XG5cbiAgICBkZWZhdWx0OlxuICAgICAgdXJsW3BhcnRdID0gdmFsdWU7XG4gIH1cblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHJ1bGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGlucyA9IHJ1bGVzW2ldO1xuXG4gICAgaWYgKGluc1s0XSkgdXJsW2luc1sxXV0gPSB1cmxbaW5zWzFdXS50b0xvd2VyQ2FzZSgpO1xuICB9XG5cbiAgdXJsLm9yaWdpbiA9IHVybC5wcm90b2NvbCAmJiB1cmwuaG9zdCAmJiB1cmwucHJvdG9jb2wgIT09ICdmaWxlOidcbiAgICA/IHVybC5wcm90b2NvbCArJy8vJysgdXJsLmhvc3RcbiAgICA6ICdudWxsJztcblxuICB1cmwuaHJlZiA9IHVybC50b1N0cmluZygpO1xuXG4gIHJldHVybiB1cmw7XG59XG5cbi8qKlxuICogVHJhbnNmb3JtIHRoZSBwcm9wZXJ0aWVzIGJhY2sgaW4gdG8gYSB2YWxpZCBhbmQgZnVsbCBVUkwgc3RyaW5nLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IHN0cmluZ2lmeSBPcHRpb25hbCBxdWVyeSBzdHJpbmdpZnkgZnVuY3Rpb24uXG4gKiBAcmV0dXJucyB7U3RyaW5nfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuZnVuY3Rpb24gdG9TdHJpbmcoc3RyaW5naWZ5KSB7XG4gIGlmICghc3RyaW5naWZ5IHx8ICdmdW5jdGlvbicgIT09IHR5cGVvZiBzdHJpbmdpZnkpIHN0cmluZ2lmeSA9IHFzLnN0cmluZ2lmeTtcblxuICB2YXIgcXVlcnlcbiAgICAsIHVybCA9IHRoaXNcbiAgICAsIHByb3RvY29sID0gdXJsLnByb3RvY29sO1xuXG4gIGlmIChwcm90b2NvbCAmJiBwcm90b2NvbC5jaGFyQXQocHJvdG9jb2wubGVuZ3RoIC0gMSkgIT09ICc6JykgcHJvdG9jb2wgKz0gJzonO1xuXG4gIHZhciByZXN1bHQgPSBwcm90b2NvbCArICh1cmwuc2xhc2hlcyA/ICcvLycgOiAnJyk7XG5cbiAgaWYgKHVybC51c2VybmFtZSkge1xuICAgIHJlc3VsdCArPSB1cmwudXNlcm5hbWU7XG4gICAgaWYgKHVybC5wYXNzd29yZCkgcmVzdWx0ICs9ICc6JysgdXJsLnBhc3N3b3JkO1xuICAgIHJlc3VsdCArPSAnQCc7XG4gIH1cblxuICByZXN1bHQgKz0gdXJsLmhvc3QgKyB1cmwucGF0aG5hbWU7XG5cbiAgcXVlcnkgPSAnb2JqZWN0JyA9PT0gdHlwZW9mIHVybC5xdWVyeSA/IHN0cmluZ2lmeSh1cmwucXVlcnkpIDogdXJsLnF1ZXJ5O1xuICBpZiAocXVlcnkpIHJlc3VsdCArPSAnPycgIT09IHF1ZXJ5LmNoYXJBdCgwKSA/ICc/JysgcXVlcnkgOiBxdWVyeTtcblxuICBpZiAodXJsLmhhc2gpIHJlc3VsdCArPSB1cmwuaGFzaDtcblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5VUkwucHJvdG90eXBlID0geyBzZXQ6IHNldCwgdG9TdHJpbmc6IHRvU3RyaW5nIH07XG5cbi8vXG4vLyBFeHBvc2UgdGhlIFVSTCBwYXJzZXIgYW5kIHNvbWUgYWRkaXRpb25hbCBwcm9wZXJ0aWVzIHRoYXQgbWlnaHQgYmUgdXNlZnVsIGZvclxuLy8gb3RoZXJzIG9yIHRlc3RpbmcuXG4vL1xuVVJMLmV4dHJhY3RQcm90b2NvbCA9IGV4dHJhY3RQcm90b2NvbDtcblVSTC5sb2NhdGlvbiA9IGxvbGNhdGlvbjtcblVSTC5xcyA9IHFzO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFVSTDtcbiIsIihmdW5jdGlvbiAocm9vdCwgZmFjdG9yeSkge1xuICAgIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICAgICAgZGVmaW5lKFtdLCBmYWN0b3J5KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByb290LnVybHRlbXBsYXRlID0gZmFjdG9yeSgpO1xuICAgIH1cbn0odGhpcywgZnVuY3Rpb24gKCkge1xuICAvKipcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqL1xuICBmdW5jdGlvbiBVcmxUZW1wbGF0ZSgpIHtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gc3RyXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIFVybFRlbXBsYXRlLnByb3RvdHlwZS5lbmNvZGVSZXNlcnZlZCA9IGZ1bmN0aW9uIChzdHIpIHtcbiAgICByZXR1cm4gc3RyLnNwbGl0KC8oJVswLTlBLUZhLWZdezJ9KS9nKS5tYXAoZnVuY3Rpb24gKHBhcnQpIHtcbiAgICAgIGlmICghLyVbMC05QS1GYS1mXS8udGVzdChwYXJ0KSkge1xuICAgICAgICBwYXJ0ID0gZW5jb2RlVVJJKHBhcnQpLnJlcGxhY2UoLyU1Qi9nLCAnWycpLnJlcGxhY2UoLyU1RC9nLCAnXScpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHBhcnQ7XG4gICAgfSkuam9pbignJyk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdHJcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgVXJsVGVtcGxhdGUucHJvdG90eXBlLmVuY29kZVVucmVzZXJ2ZWQgPSBmdW5jdGlvbiAoc3RyKSB7XG4gICAgcmV0dXJuIGVuY29kZVVSSUNvbXBvbmVudChzdHIpLnJlcGxhY2UoL1shJygpKl0vZywgZnVuY3Rpb24gKGMpIHtcbiAgICAgIHJldHVybiAnJScgKyBjLmNoYXJDb2RlQXQoMCkudG9TdHJpbmcoMTYpLnRvVXBwZXJDYXNlKCk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtzdHJpbmd9IG9wZXJhdG9yXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZVxuICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5XG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIFVybFRlbXBsYXRlLnByb3RvdHlwZS5lbmNvZGVWYWx1ZSA9IGZ1bmN0aW9uIChvcGVyYXRvciwgdmFsdWUsIGtleSkge1xuICAgIHZhbHVlID0gKG9wZXJhdG9yID09PSAnKycgfHwgb3BlcmF0b3IgPT09ICcjJykgPyB0aGlzLmVuY29kZVJlc2VydmVkKHZhbHVlKSA6IHRoaXMuZW5jb2RlVW5yZXNlcnZlZCh2YWx1ZSk7XG5cbiAgICBpZiAoa2V5KSB7XG4gICAgICByZXR1cm4gdGhpcy5lbmNvZGVVbnJlc2VydmVkKGtleSkgKyAnPScgKyB2YWx1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHsqfSB2YWx1ZVxuICAgKiBAcmV0dXJuIHtib29sZWFufVxuICAgKi9cbiAgVXJsVGVtcGxhdGUucHJvdG90eXBlLmlzRGVmaW5lZCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsO1xuICB9O1xuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge3N0cmluZ31cbiAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICovXG4gIFVybFRlbXBsYXRlLnByb3RvdHlwZS5pc0tleU9wZXJhdG9yID0gZnVuY3Rpb24gKG9wZXJhdG9yKSB7XG4gICAgcmV0dXJuIG9wZXJhdG9yID09PSAnOycgfHwgb3BlcmF0b3IgPT09ICcmJyB8fCBvcGVyYXRvciA9PT0gJz8nO1xuICB9O1xuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge09iamVjdH0gY29udGV4dFxuICAgKiBAcGFyYW0ge3N0cmluZ30gb3BlcmF0b3JcbiAgICogQHBhcmFtIHtzdHJpbmd9IGtleVxuICAgKiBAcGFyYW0ge3N0cmluZ30gbW9kaWZpZXJcbiAgICovXG4gIFVybFRlbXBsYXRlLnByb3RvdHlwZS5nZXRWYWx1ZXMgPSBmdW5jdGlvbiAoY29udGV4dCwgb3BlcmF0b3IsIGtleSwgbW9kaWZpZXIpIHtcbiAgICB2YXIgdmFsdWUgPSBjb250ZXh0W2tleV0sXG4gICAgICAgIHJlc3VsdCA9IFtdO1xuXG4gICAgaWYgKHRoaXMuaXNEZWZpbmVkKHZhbHVlKSAmJiB2YWx1ZSAhPT0gJycpIHtcbiAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnIHx8IHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgfHwgdHlwZW9mIHZhbHVlID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgdmFsdWUgPSB2YWx1ZS50b1N0cmluZygpO1xuXG4gICAgICAgIGlmIChtb2RpZmllciAmJiBtb2RpZmllciAhPT0gJyonKSB7XG4gICAgICAgICAgdmFsdWUgPSB2YWx1ZS5zdWJzdHJpbmcoMCwgcGFyc2VJbnQobW9kaWZpZXIsIDEwKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXN1bHQucHVzaCh0aGlzLmVuY29kZVZhbHVlKG9wZXJhdG9yLCB2YWx1ZSwgdGhpcy5pc0tleU9wZXJhdG9yKG9wZXJhdG9yKSA/IGtleSA6IG51bGwpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChtb2RpZmllciA9PT0gJyonKSB7XG4gICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgICAgICB2YWx1ZS5maWx0ZXIodGhpcy5pc0RlZmluZWQpLmZvckVhY2goZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHRoaXMuZW5jb2RlVmFsdWUob3BlcmF0b3IsIHZhbHVlLCB0aGlzLmlzS2V5T3BlcmF0b3Iob3BlcmF0b3IpID8ga2V5IDogbnVsbCkpO1xuICAgICAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKHZhbHVlKS5mb3JFYWNoKGZ1bmN0aW9uIChrKSB7XG4gICAgICAgICAgICAgIGlmICh0aGlzLmlzRGVmaW5lZCh2YWx1ZVtrXSkpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaCh0aGlzLmVuY29kZVZhbHVlKG9wZXJhdG9yLCB2YWx1ZVtrXSwgaykpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCB0aGlzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyIHRtcCA9IFtdO1xuXG4gICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgICAgICB2YWx1ZS5maWx0ZXIodGhpcy5pc0RlZmluZWQpLmZvckVhY2goZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgIHRtcC5wdXNoKHRoaXMuZW5jb2RlVmFsdWUob3BlcmF0b3IsIHZhbHVlKSk7XG4gICAgICAgICAgICB9LCB0aGlzKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgT2JqZWN0LmtleXModmFsdWUpLmZvckVhY2goZnVuY3Rpb24gKGspIHtcbiAgICAgICAgICAgICAgaWYgKHRoaXMuaXNEZWZpbmVkKHZhbHVlW2tdKSkge1xuICAgICAgICAgICAgICAgIHRtcC5wdXNoKHRoaXMuZW5jb2RlVW5yZXNlcnZlZChrKSk7XG4gICAgICAgICAgICAgICAgdG1wLnB1c2godGhpcy5lbmNvZGVWYWx1ZShvcGVyYXRvciwgdmFsdWVba10udG9TdHJpbmcoKSkpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCB0aGlzKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAodGhpcy5pc0tleU9wZXJhdG9yKG9wZXJhdG9yKSkge1xuICAgICAgICAgICAgcmVzdWx0LnB1c2godGhpcy5lbmNvZGVVbnJlc2VydmVkKGtleSkgKyAnPScgKyB0bXAuam9pbignLCcpKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHRtcC5sZW5ndGggIT09IDApIHtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKHRtcC5qb2luKCcsJykpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAob3BlcmF0b3IgPT09ICc7Jykge1xuICAgICAgICBpZiAodGhpcy5pc0RlZmluZWQodmFsdWUpKSB7XG4gICAgICAgICAgcmVzdWx0LnB1c2godGhpcy5lbmNvZGVVbnJlc2VydmVkKGtleSkpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHZhbHVlID09PSAnJyAmJiAob3BlcmF0b3IgPT09ICcmJyB8fCBvcGVyYXRvciA9PT0gJz8nKSkge1xuICAgICAgICByZXN1bHQucHVzaCh0aGlzLmVuY29kZVVucmVzZXJ2ZWQoa2V5KSArICc9Jyk7XG4gICAgICB9IGVsc2UgaWYgKHZhbHVlID09PSAnJykge1xuICAgICAgICByZXN1bHQucHVzaCgnJyk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0ZW1wbGF0ZVxuICAgKiBAcmV0dXJuIHtmdW5jdGlvbihPYmplY3QpOnN0cmluZ31cbiAgICovXG4gIFVybFRlbXBsYXRlLnByb3RvdHlwZS5wYXJzZSA9IGZ1bmN0aW9uICh0ZW1wbGF0ZSkge1xuICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICB2YXIgb3BlcmF0b3JzID0gWycrJywgJyMnLCAnLicsICcvJywgJzsnLCAnPycsICcmJ107XG5cbiAgICByZXR1cm4ge1xuICAgICAgZXhwYW5kOiBmdW5jdGlvbiAoY29udGV4dCkge1xuICAgICAgICByZXR1cm4gdGVtcGxhdGUucmVwbGFjZSgvXFx7KFteXFx7XFx9XSspXFx9fChbXlxce1xcfV0rKS9nLCBmdW5jdGlvbiAoXywgZXhwcmVzc2lvbiwgbGl0ZXJhbCkge1xuICAgICAgICAgIGlmIChleHByZXNzaW9uKSB7XG4gICAgICAgICAgICB2YXIgb3BlcmF0b3IgPSBudWxsLFxuICAgICAgICAgICAgICAgIHZhbHVlcyA9IFtdO1xuXG4gICAgICAgICAgICBpZiAob3BlcmF0b3JzLmluZGV4T2YoZXhwcmVzc2lvbi5jaGFyQXQoMCkpICE9PSAtMSkge1xuICAgICAgICAgICAgICBvcGVyYXRvciA9IGV4cHJlc3Npb24uY2hhckF0KDApO1xuICAgICAgICAgICAgICBleHByZXNzaW9uID0gZXhwcmVzc2lvbi5zdWJzdHIoMSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGV4cHJlc3Npb24uc3BsaXQoLywvZykuZm9yRWFjaChmdW5jdGlvbiAodmFyaWFibGUpIHtcbiAgICAgICAgICAgICAgdmFyIHRtcCA9IC8oW146XFwqXSopKD86OihcXGQrKXwoXFwqKSk/Ly5leGVjKHZhcmlhYmxlKTtcbiAgICAgICAgICAgICAgdmFsdWVzLnB1c2guYXBwbHkodmFsdWVzLCB0aGF0LmdldFZhbHVlcyhjb250ZXh0LCBvcGVyYXRvciwgdG1wWzFdLCB0bXBbMl0gfHwgdG1wWzNdKSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKG9wZXJhdG9yICYmIG9wZXJhdG9yICE9PSAnKycpIHtcbiAgICAgICAgICAgICAgdmFyIHNlcGFyYXRvciA9ICcsJztcblxuICAgICAgICAgICAgICBpZiAob3BlcmF0b3IgPT09ICc/Jykge1xuICAgICAgICAgICAgICAgIHNlcGFyYXRvciA9ICcmJztcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChvcGVyYXRvciAhPT0gJyMnKSB7XG4gICAgICAgICAgICAgICAgc2VwYXJhdG9yID0gb3BlcmF0b3I7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmV0dXJuICh2YWx1ZXMubGVuZ3RoICE9PSAwID8gb3BlcmF0b3IgOiAnJykgKyB2YWx1ZXMuam9pbihzZXBhcmF0b3IpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlcy5qb2luKCcsJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGF0LmVuY29kZVJlc2VydmVkKGxpdGVyYWwpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfTtcbiAgfTtcblxuICByZXR1cm4gbmV3IFVybFRlbXBsYXRlKCk7XG59KSk7XG4iLCIoZnVuY3Rpb24oc2VsZikge1xuICAndXNlIHN0cmljdCc7XG5cbiAgaWYgKHNlbGYuZmV0Y2gpIHtcbiAgICByZXR1cm5cbiAgfVxuXG4gIHZhciBzdXBwb3J0ID0ge1xuICAgIHNlYXJjaFBhcmFtczogJ1VSTFNlYXJjaFBhcmFtcycgaW4gc2VsZixcbiAgICBpdGVyYWJsZTogJ1N5bWJvbCcgaW4gc2VsZiAmJiAnaXRlcmF0b3InIGluIFN5bWJvbCxcbiAgICBibG9iOiAnRmlsZVJlYWRlcicgaW4gc2VsZiAmJiAnQmxvYicgaW4gc2VsZiAmJiAoZnVuY3Rpb24oKSB7XG4gICAgICB0cnkge1xuICAgICAgICBuZXcgQmxvYigpXG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG4gICAgfSkoKSxcbiAgICBmb3JtRGF0YTogJ0Zvcm1EYXRhJyBpbiBzZWxmLFxuICAgIGFycmF5QnVmZmVyOiAnQXJyYXlCdWZmZXInIGluIHNlbGZcbiAgfVxuXG4gIGlmIChzdXBwb3J0LmFycmF5QnVmZmVyKSB7XG4gICAgdmFyIHZpZXdDbGFzc2VzID0gW1xuICAgICAgJ1tvYmplY3QgSW50OEFycmF5XScsXG4gICAgICAnW29iamVjdCBVaW50OEFycmF5XScsXG4gICAgICAnW29iamVjdCBVaW50OENsYW1wZWRBcnJheV0nLFxuICAgICAgJ1tvYmplY3QgSW50MTZBcnJheV0nLFxuICAgICAgJ1tvYmplY3QgVWludDE2QXJyYXldJyxcbiAgICAgICdbb2JqZWN0IEludDMyQXJyYXldJyxcbiAgICAgICdbb2JqZWN0IFVpbnQzMkFycmF5XScsXG4gICAgICAnW29iamVjdCBGbG9hdDMyQXJyYXldJyxcbiAgICAgICdbb2JqZWN0IEZsb2F0NjRBcnJheV0nXG4gICAgXVxuXG4gICAgdmFyIGlzRGF0YVZpZXcgPSBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiBvYmogJiYgRGF0YVZpZXcucHJvdG90eXBlLmlzUHJvdG90eXBlT2Yob2JqKVxuICAgIH1cblxuICAgIHZhciBpc0FycmF5QnVmZmVyVmlldyA9IEFycmF5QnVmZmVyLmlzVmlldyB8fCBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiBvYmogJiYgdmlld0NsYXNzZXMuaW5kZXhPZihPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKSkgPiAtMVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIG5vcm1hbGl6ZU5hbWUobmFtZSkge1xuICAgIGlmICh0eXBlb2YgbmFtZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgIG5hbWUgPSBTdHJpbmcobmFtZSlcbiAgICB9XG4gICAgaWYgKC9bXmEtejAtOVxcLSMkJSYnKisuXFxeX2B8fl0vaS50ZXN0KG5hbWUpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbnZhbGlkIGNoYXJhY3RlciBpbiBoZWFkZXIgZmllbGQgbmFtZScpXG4gICAgfVxuICAgIHJldHVybiBuYW1lLnRvTG93ZXJDYXNlKClcbiAgfVxuXG4gIGZ1bmN0aW9uIG5vcm1hbGl6ZVZhbHVlKHZhbHVlKSB7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHZhbHVlID0gU3RyaW5nKHZhbHVlKVxuICAgIH1cbiAgICByZXR1cm4gdmFsdWVcbiAgfVxuXG4gIC8vIEJ1aWxkIGEgZGVzdHJ1Y3RpdmUgaXRlcmF0b3IgZm9yIHRoZSB2YWx1ZSBsaXN0XG4gIGZ1bmN0aW9uIGl0ZXJhdG9yRm9yKGl0ZW1zKSB7XG4gICAgdmFyIGl0ZXJhdG9yID0ge1xuICAgICAgbmV4dDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciB2YWx1ZSA9IGl0ZW1zLnNoaWZ0KClcbiAgICAgICAgcmV0dXJuIHtkb25lOiB2YWx1ZSA9PT0gdW5kZWZpbmVkLCB2YWx1ZTogdmFsdWV9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHN1cHBvcnQuaXRlcmFibGUpIHtcbiAgICAgIGl0ZXJhdG9yW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGl0ZXJhdG9yXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGl0ZXJhdG9yXG4gIH1cblxuICBmdW5jdGlvbiBIZWFkZXJzKGhlYWRlcnMpIHtcbiAgICB0aGlzLm1hcCA9IHt9XG5cbiAgICBpZiAoaGVhZGVycyBpbnN0YW5jZW9mIEhlYWRlcnMpIHtcbiAgICAgIGhlYWRlcnMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwgbmFtZSkge1xuICAgICAgICB0aGlzLmFwcGVuZChuYW1lLCB2YWx1ZSlcbiAgICAgIH0sIHRoaXMpXG4gICAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KGhlYWRlcnMpKSB7XG4gICAgICBoZWFkZXJzLmZvckVhY2goZnVuY3Rpb24oaGVhZGVyKSB7XG4gICAgICAgIHRoaXMuYXBwZW5kKGhlYWRlclswXSwgaGVhZGVyWzFdKVxuICAgICAgfSwgdGhpcylcbiAgICB9IGVsc2UgaWYgKGhlYWRlcnMpIHtcbiAgICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGhlYWRlcnMpLmZvckVhY2goZnVuY3Rpb24obmFtZSkge1xuICAgICAgICB0aGlzLmFwcGVuZChuYW1lLCBoZWFkZXJzW25hbWVdKVxuICAgICAgfSwgdGhpcylcbiAgICB9XG4gIH1cblxuICBIZWFkZXJzLnByb3RvdHlwZS5hcHBlbmQgPSBmdW5jdGlvbihuYW1lLCB2YWx1ZSkge1xuICAgIG5hbWUgPSBub3JtYWxpemVOYW1lKG5hbWUpXG4gICAgdmFsdWUgPSBub3JtYWxpemVWYWx1ZSh2YWx1ZSlcbiAgICB2YXIgb2xkVmFsdWUgPSB0aGlzLm1hcFtuYW1lXVxuICAgIHRoaXMubWFwW25hbWVdID0gb2xkVmFsdWUgPyBvbGRWYWx1ZSsnLCcrdmFsdWUgOiB2YWx1ZVxuICB9XG5cbiAgSGVhZGVycy5wcm90b3R5cGVbJ2RlbGV0ZSddID0gZnVuY3Rpb24obmFtZSkge1xuICAgIGRlbGV0ZSB0aGlzLm1hcFtub3JtYWxpemVOYW1lKG5hbWUpXVxuICB9XG5cbiAgSGVhZGVycy5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24obmFtZSkge1xuICAgIG5hbWUgPSBub3JtYWxpemVOYW1lKG5hbWUpXG4gICAgcmV0dXJuIHRoaXMuaGFzKG5hbWUpID8gdGhpcy5tYXBbbmFtZV0gOiBudWxsXG4gIH1cblxuICBIZWFkZXJzLnByb3RvdHlwZS5oYXMgPSBmdW5jdGlvbihuYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMubWFwLmhhc093blByb3BlcnR5KG5vcm1hbGl6ZU5hbWUobmFtZSkpXG4gIH1cblxuICBIZWFkZXJzLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbihuYW1lLCB2YWx1ZSkge1xuICAgIHRoaXMubWFwW25vcm1hbGl6ZU5hbWUobmFtZSldID0gbm9ybWFsaXplVmFsdWUodmFsdWUpXG4gIH1cblxuICBIZWFkZXJzLnByb3RvdHlwZS5mb3JFYWNoID0gZnVuY3Rpb24oY2FsbGJhY2ssIHRoaXNBcmcpIHtcbiAgICBmb3IgKHZhciBuYW1lIGluIHRoaXMubWFwKSB7XG4gICAgICBpZiAodGhpcy5tYXAuaGFzT3duUHJvcGVydHkobmFtZSkpIHtcbiAgICAgICAgY2FsbGJhY2suY2FsbCh0aGlzQXJnLCB0aGlzLm1hcFtuYW1lXSwgbmFtZSwgdGhpcylcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBIZWFkZXJzLnByb3RvdHlwZS5rZXlzID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGl0ZW1zID0gW11cbiAgICB0aGlzLmZvckVhY2goZnVuY3Rpb24odmFsdWUsIG5hbWUpIHsgaXRlbXMucHVzaChuYW1lKSB9KVxuICAgIHJldHVybiBpdGVyYXRvckZvcihpdGVtcylcbiAgfVxuXG4gIEhlYWRlcnMucHJvdG90eXBlLnZhbHVlcyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBpdGVtcyA9IFtdXG4gICAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlKSB7IGl0ZW1zLnB1c2godmFsdWUpIH0pXG4gICAgcmV0dXJuIGl0ZXJhdG9yRm9yKGl0ZW1zKVxuICB9XG5cbiAgSGVhZGVycy5wcm90b3R5cGUuZW50cmllcyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBpdGVtcyA9IFtdXG4gICAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlLCBuYW1lKSB7IGl0ZW1zLnB1c2goW25hbWUsIHZhbHVlXSkgfSlcbiAgICByZXR1cm4gaXRlcmF0b3JGb3IoaXRlbXMpXG4gIH1cblxuICBpZiAoc3VwcG9ydC5pdGVyYWJsZSkge1xuICAgIEhlYWRlcnMucHJvdG90eXBlW1N5bWJvbC5pdGVyYXRvcl0gPSBIZWFkZXJzLnByb3RvdHlwZS5lbnRyaWVzXG4gIH1cblxuICBmdW5jdGlvbiBjb25zdW1lZChib2R5KSB7XG4gICAgaWYgKGJvZHkuYm9keVVzZWQpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgVHlwZUVycm9yKCdBbHJlYWR5IHJlYWQnKSlcbiAgICB9XG4gICAgYm9keS5ib2R5VXNlZCA9IHRydWVcbiAgfVxuXG4gIGZ1bmN0aW9uIGZpbGVSZWFkZXJSZWFkeShyZWFkZXIpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICByZWFkZXIub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJlc29sdmUocmVhZGVyLnJlc3VsdClcbiAgICAgIH1cbiAgICAgIHJlYWRlci5vbmVycm9yID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJlamVjdChyZWFkZXIuZXJyb3IpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlYWRCbG9iQXNBcnJheUJ1ZmZlcihibG9iKSB7XG4gICAgdmFyIHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKClcbiAgICB2YXIgcHJvbWlzZSA9IGZpbGVSZWFkZXJSZWFkeShyZWFkZXIpXG4gICAgcmVhZGVyLnJlYWRBc0FycmF5QnVmZmVyKGJsb2IpXG4gICAgcmV0dXJuIHByb21pc2VcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlYWRCbG9iQXNUZXh0KGJsb2IpIHtcbiAgICB2YXIgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKVxuICAgIHZhciBwcm9taXNlID0gZmlsZVJlYWRlclJlYWR5KHJlYWRlcilcbiAgICByZWFkZXIucmVhZEFzVGV4dChibG9iKVxuICAgIHJldHVybiBwcm9taXNlXG4gIH1cblxuICBmdW5jdGlvbiByZWFkQXJyYXlCdWZmZXJBc1RleHQoYnVmKSB7XG4gICAgdmFyIHZpZXcgPSBuZXcgVWludDhBcnJheShidWYpXG4gICAgdmFyIGNoYXJzID0gbmV3IEFycmF5KHZpZXcubGVuZ3RoKVxuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2aWV3Lmxlbmd0aDsgaSsrKSB7XG4gICAgICBjaGFyc1tpXSA9IFN0cmluZy5mcm9tQ2hhckNvZGUodmlld1tpXSlcbiAgICB9XG4gICAgcmV0dXJuIGNoYXJzLmpvaW4oJycpXG4gIH1cblxuICBmdW5jdGlvbiBidWZmZXJDbG9uZShidWYpIHtcbiAgICBpZiAoYnVmLnNsaWNlKSB7XG4gICAgICByZXR1cm4gYnVmLnNsaWNlKDApXG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciB2aWV3ID0gbmV3IFVpbnQ4QXJyYXkoYnVmLmJ5dGVMZW5ndGgpXG4gICAgICB2aWV3LnNldChuZXcgVWludDhBcnJheShidWYpKVxuICAgICAgcmV0dXJuIHZpZXcuYnVmZmVyXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gQm9keSgpIHtcbiAgICB0aGlzLmJvZHlVc2VkID0gZmFsc2VcblxuICAgIHRoaXMuX2luaXRCb2R5ID0gZnVuY3Rpb24oYm9keSkge1xuICAgICAgdGhpcy5fYm9keUluaXQgPSBib2R5XG4gICAgICBpZiAoIWJvZHkpIHtcbiAgICAgICAgdGhpcy5fYm9keVRleHQgPSAnJ1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgYm9keSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgdGhpcy5fYm9keVRleHQgPSBib2R5XG4gICAgICB9IGVsc2UgaWYgKHN1cHBvcnQuYmxvYiAmJiBCbG9iLnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKGJvZHkpKSB7XG4gICAgICAgIHRoaXMuX2JvZHlCbG9iID0gYm9keVxuICAgICAgfSBlbHNlIGlmIChzdXBwb3J0LmZvcm1EYXRhICYmIEZvcm1EYXRhLnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKGJvZHkpKSB7XG4gICAgICAgIHRoaXMuX2JvZHlGb3JtRGF0YSA9IGJvZHlcbiAgICAgIH0gZWxzZSBpZiAoc3VwcG9ydC5zZWFyY2hQYXJhbXMgJiYgVVJMU2VhcmNoUGFyYW1zLnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKGJvZHkpKSB7XG4gICAgICAgIHRoaXMuX2JvZHlUZXh0ID0gYm9keS50b1N0cmluZygpXG4gICAgICB9IGVsc2UgaWYgKHN1cHBvcnQuYXJyYXlCdWZmZXIgJiYgc3VwcG9ydC5ibG9iICYmIGlzRGF0YVZpZXcoYm9keSkpIHtcbiAgICAgICAgdGhpcy5fYm9keUFycmF5QnVmZmVyID0gYnVmZmVyQ2xvbmUoYm9keS5idWZmZXIpXG4gICAgICAgIC8vIElFIDEwLTExIGNhbid0IGhhbmRsZSBhIERhdGFWaWV3IGJvZHkuXG4gICAgICAgIHRoaXMuX2JvZHlJbml0ID0gbmV3IEJsb2IoW3RoaXMuX2JvZHlBcnJheUJ1ZmZlcl0pXG4gICAgICB9IGVsc2UgaWYgKHN1cHBvcnQuYXJyYXlCdWZmZXIgJiYgKEFycmF5QnVmZmVyLnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKGJvZHkpIHx8IGlzQXJyYXlCdWZmZXJWaWV3KGJvZHkpKSkge1xuICAgICAgICB0aGlzLl9ib2R5QXJyYXlCdWZmZXIgPSBidWZmZXJDbG9uZShib2R5KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCd1bnN1cHBvcnRlZCBCb2R5SW5pdCB0eXBlJylcbiAgICAgIH1cblxuICAgICAgaWYgKCF0aGlzLmhlYWRlcnMuZ2V0KCdjb250ZW50LXR5cGUnKSkge1xuICAgICAgICBpZiAodHlwZW9mIGJvZHkgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgdGhpcy5oZWFkZXJzLnNldCgnY29udGVudC10eXBlJywgJ3RleHQvcGxhaW47Y2hhcnNldD1VVEYtOCcpXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5fYm9keUJsb2IgJiYgdGhpcy5fYm9keUJsb2IudHlwZSkge1xuICAgICAgICAgIHRoaXMuaGVhZGVycy5zZXQoJ2NvbnRlbnQtdHlwZScsIHRoaXMuX2JvZHlCbG9iLnR5cGUpXG4gICAgICAgIH0gZWxzZSBpZiAoc3VwcG9ydC5zZWFyY2hQYXJhbXMgJiYgVVJMU2VhcmNoUGFyYW1zLnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKGJvZHkpKSB7XG4gICAgICAgICAgdGhpcy5oZWFkZXJzLnNldCgnY29udGVudC10eXBlJywgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZDtjaGFyc2V0PVVURi04JylcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChzdXBwb3J0LmJsb2IpIHtcbiAgICAgIHRoaXMuYmxvYiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgcmVqZWN0ZWQgPSBjb25zdW1lZCh0aGlzKVxuICAgICAgICBpZiAocmVqZWN0ZWQpIHtcbiAgICAgICAgICByZXR1cm4gcmVqZWN0ZWRcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLl9ib2R5QmxvYikge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5fYm9keUJsb2IpXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5fYm9keUFycmF5QnVmZmVyKSB7XG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShuZXcgQmxvYihbdGhpcy5fYm9keUFycmF5QnVmZmVyXSkpXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5fYm9keUZvcm1EYXRhKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdjb3VsZCBub3QgcmVhZCBGb3JtRGF0YSBib2R5IGFzIGJsb2InKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUobmV3IEJsb2IoW3RoaXMuX2JvZHlUZXh0XSkpXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5hcnJheUJ1ZmZlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAodGhpcy5fYm9keUFycmF5QnVmZmVyKSB7XG4gICAgICAgICAgcmV0dXJuIGNvbnN1bWVkKHRoaXMpIHx8IFByb21pc2UucmVzb2x2ZSh0aGlzLl9ib2R5QXJyYXlCdWZmZXIpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuYmxvYigpLnRoZW4ocmVhZEJsb2JBc0FycmF5QnVmZmVyKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy50ZXh0ID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgcmVqZWN0ZWQgPSBjb25zdW1lZCh0aGlzKVxuICAgICAgaWYgKHJlamVjdGVkKSB7XG4gICAgICAgIHJldHVybiByZWplY3RlZFxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5fYm9keUJsb2IpIHtcbiAgICAgICAgcmV0dXJuIHJlYWRCbG9iQXNUZXh0KHRoaXMuX2JvZHlCbG9iKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLl9ib2R5QXJyYXlCdWZmZXIpIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShyZWFkQXJyYXlCdWZmZXJBc1RleHQodGhpcy5fYm9keUFycmF5QnVmZmVyKSlcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5fYm9keUZvcm1EYXRhKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignY291bGQgbm90IHJlYWQgRm9ybURhdGEgYm9keSBhcyB0ZXh0JylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5fYm9keVRleHQpXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHN1cHBvcnQuZm9ybURhdGEpIHtcbiAgICAgIHRoaXMuZm9ybURhdGEgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudGV4dCgpLnRoZW4oZGVjb2RlKVxuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuanNvbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMudGV4dCgpLnRoZW4oSlNPTi5wYXJzZSlcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgLy8gSFRUUCBtZXRob2RzIHdob3NlIGNhcGl0YWxpemF0aW9uIHNob3VsZCBiZSBub3JtYWxpemVkXG4gIHZhciBtZXRob2RzID0gWydERUxFVEUnLCAnR0VUJywgJ0hFQUQnLCAnT1BUSU9OUycsICdQT1NUJywgJ1BVVCddXG5cbiAgZnVuY3Rpb24gbm9ybWFsaXplTWV0aG9kKG1ldGhvZCkge1xuICAgIHZhciB1cGNhc2VkID0gbWV0aG9kLnRvVXBwZXJDYXNlKClcbiAgICByZXR1cm4gKG1ldGhvZHMuaW5kZXhPZih1cGNhc2VkKSA+IC0xKSA/IHVwY2FzZWQgOiBtZXRob2RcbiAgfVxuXG4gIGZ1bmN0aW9uIFJlcXVlc3QoaW5wdXQsIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fVxuICAgIHZhciBib2R5ID0gb3B0aW9ucy5ib2R5XG5cbiAgICBpZiAoaW5wdXQgaW5zdGFuY2VvZiBSZXF1ZXN0KSB7XG4gICAgICBpZiAoaW5wdXQuYm9keVVzZWQpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQWxyZWFkeSByZWFkJylcbiAgICAgIH1cbiAgICAgIHRoaXMudXJsID0gaW5wdXQudXJsXG4gICAgICB0aGlzLmNyZWRlbnRpYWxzID0gaW5wdXQuY3JlZGVudGlhbHNcbiAgICAgIGlmICghb3B0aW9ucy5oZWFkZXJzKSB7XG4gICAgICAgIHRoaXMuaGVhZGVycyA9IG5ldyBIZWFkZXJzKGlucHV0LmhlYWRlcnMpXG4gICAgICB9XG4gICAgICB0aGlzLm1ldGhvZCA9IGlucHV0Lm1ldGhvZFxuICAgICAgdGhpcy5tb2RlID0gaW5wdXQubW9kZVxuICAgICAgaWYgKCFib2R5ICYmIGlucHV0Ll9ib2R5SW5pdCAhPSBudWxsKSB7XG4gICAgICAgIGJvZHkgPSBpbnB1dC5fYm9keUluaXRcbiAgICAgICAgaW5wdXQuYm9keVVzZWQgPSB0cnVlXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudXJsID0gU3RyaW5nKGlucHV0KVxuICAgIH1cblxuICAgIHRoaXMuY3JlZGVudGlhbHMgPSBvcHRpb25zLmNyZWRlbnRpYWxzIHx8IHRoaXMuY3JlZGVudGlhbHMgfHwgJ29taXQnXG4gICAgaWYgKG9wdGlvbnMuaGVhZGVycyB8fCAhdGhpcy5oZWFkZXJzKSB7XG4gICAgICB0aGlzLmhlYWRlcnMgPSBuZXcgSGVhZGVycyhvcHRpb25zLmhlYWRlcnMpXG4gICAgfVxuICAgIHRoaXMubWV0aG9kID0gbm9ybWFsaXplTWV0aG9kKG9wdGlvbnMubWV0aG9kIHx8IHRoaXMubWV0aG9kIHx8ICdHRVQnKVxuICAgIHRoaXMubW9kZSA9IG9wdGlvbnMubW9kZSB8fCB0aGlzLm1vZGUgfHwgbnVsbFxuICAgIHRoaXMucmVmZXJyZXIgPSBudWxsXG5cbiAgICBpZiAoKHRoaXMubWV0aG9kID09PSAnR0VUJyB8fCB0aGlzLm1ldGhvZCA9PT0gJ0hFQUQnKSAmJiBib2R5KSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdCb2R5IG5vdCBhbGxvd2VkIGZvciBHRVQgb3IgSEVBRCByZXF1ZXN0cycpXG4gICAgfVxuICAgIHRoaXMuX2luaXRCb2R5KGJvZHkpXG4gIH1cblxuICBSZXF1ZXN0LnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBuZXcgUmVxdWVzdCh0aGlzLCB7IGJvZHk6IHRoaXMuX2JvZHlJbml0IH0pXG4gIH1cblxuICBmdW5jdGlvbiBkZWNvZGUoYm9keSkge1xuICAgIHZhciBmb3JtID0gbmV3IEZvcm1EYXRhKClcbiAgICBib2R5LnRyaW0oKS5zcGxpdCgnJicpLmZvckVhY2goZnVuY3Rpb24oYnl0ZXMpIHtcbiAgICAgIGlmIChieXRlcykge1xuICAgICAgICB2YXIgc3BsaXQgPSBieXRlcy5zcGxpdCgnPScpXG4gICAgICAgIHZhciBuYW1lID0gc3BsaXQuc2hpZnQoKS5yZXBsYWNlKC9cXCsvZywgJyAnKVxuICAgICAgICB2YXIgdmFsdWUgPSBzcGxpdC5qb2luKCc9JykucmVwbGFjZSgvXFwrL2csICcgJylcbiAgICAgICAgZm9ybS5hcHBlbmQoZGVjb2RlVVJJQ29tcG9uZW50KG5hbWUpLCBkZWNvZGVVUklDb21wb25lbnQodmFsdWUpKVxuICAgICAgfVxuICAgIH0pXG4gICAgcmV0dXJuIGZvcm1cbiAgfVxuXG4gIGZ1bmN0aW9uIHBhcnNlSGVhZGVycyhyYXdIZWFkZXJzKSB7XG4gICAgdmFyIGhlYWRlcnMgPSBuZXcgSGVhZGVycygpXG4gICAgcmF3SGVhZGVycy5zcGxpdCgvXFxyP1xcbi8pLmZvckVhY2goZnVuY3Rpb24obGluZSkge1xuICAgICAgdmFyIHBhcnRzID0gbGluZS5zcGxpdCgnOicpXG4gICAgICB2YXIga2V5ID0gcGFydHMuc2hpZnQoKS50cmltKClcbiAgICAgIGlmIChrZXkpIHtcbiAgICAgICAgdmFyIHZhbHVlID0gcGFydHMuam9pbignOicpLnRyaW0oKVxuICAgICAgICBoZWFkZXJzLmFwcGVuZChrZXksIHZhbHVlKVxuICAgICAgfVxuICAgIH0pXG4gICAgcmV0dXJuIGhlYWRlcnNcbiAgfVxuXG4gIEJvZHkuY2FsbChSZXF1ZXN0LnByb3RvdHlwZSlcblxuICBmdW5jdGlvbiBSZXNwb25zZShib2R5SW5pdCwgb3B0aW9ucykge1xuICAgIGlmICghb3B0aW9ucykge1xuICAgICAgb3B0aW9ucyA9IHt9XG4gICAgfVxuXG4gICAgdGhpcy50eXBlID0gJ2RlZmF1bHQnXG4gICAgdGhpcy5zdGF0dXMgPSAnc3RhdHVzJyBpbiBvcHRpb25zID8gb3B0aW9ucy5zdGF0dXMgOiAyMDBcbiAgICB0aGlzLm9rID0gdGhpcy5zdGF0dXMgPj0gMjAwICYmIHRoaXMuc3RhdHVzIDwgMzAwXG4gICAgdGhpcy5zdGF0dXNUZXh0ID0gJ3N0YXR1c1RleHQnIGluIG9wdGlvbnMgPyBvcHRpb25zLnN0YXR1c1RleHQgOiAnT0snXG4gICAgdGhpcy5oZWFkZXJzID0gbmV3IEhlYWRlcnMob3B0aW9ucy5oZWFkZXJzKVxuICAgIHRoaXMudXJsID0gb3B0aW9ucy51cmwgfHwgJydcbiAgICB0aGlzLl9pbml0Qm9keShib2R5SW5pdClcbiAgfVxuXG4gIEJvZHkuY2FsbChSZXNwb25zZS5wcm90b3R5cGUpXG5cbiAgUmVzcG9uc2UucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIG5ldyBSZXNwb25zZSh0aGlzLl9ib2R5SW5pdCwge1xuICAgICAgc3RhdHVzOiB0aGlzLnN0YXR1cyxcbiAgICAgIHN0YXR1c1RleHQ6IHRoaXMuc3RhdHVzVGV4dCxcbiAgICAgIGhlYWRlcnM6IG5ldyBIZWFkZXJzKHRoaXMuaGVhZGVycyksXG4gICAgICB1cmw6IHRoaXMudXJsXG4gICAgfSlcbiAgfVxuXG4gIFJlc3BvbnNlLmVycm9yID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHJlc3BvbnNlID0gbmV3IFJlc3BvbnNlKG51bGwsIHtzdGF0dXM6IDAsIHN0YXR1c1RleHQ6ICcnfSlcbiAgICByZXNwb25zZS50eXBlID0gJ2Vycm9yJ1xuICAgIHJldHVybiByZXNwb25zZVxuICB9XG5cbiAgdmFyIHJlZGlyZWN0U3RhdHVzZXMgPSBbMzAxLCAzMDIsIDMwMywgMzA3LCAzMDhdXG5cbiAgUmVzcG9uc2UucmVkaXJlY3QgPSBmdW5jdGlvbih1cmwsIHN0YXR1cykge1xuICAgIGlmIChyZWRpcmVjdFN0YXR1c2VzLmluZGV4T2Yoc3RhdHVzKSA9PT0gLTEpIHtcbiAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdJbnZhbGlkIHN0YXR1cyBjb2RlJylcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFJlc3BvbnNlKG51bGwsIHtzdGF0dXM6IHN0YXR1cywgaGVhZGVyczoge2xvY2F0aW9uOiB1cmx9fSlcbiAgfVxuXG4gIHNlbGYuSGVhZGVycyA9IEhlYWRlcnNcbiAgc2VsZi5SZXF1ZXN0ID0gUmVxdWVzdFxuICBzZWxmLlJlc3BvbnNlID0gUmVzcG9uc2VcblxuICBzZWxmLmZldGNoID0gZnVuY3Rpb24oaW5wdXQsIGluaXQpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICB2YXIgcmVxdWVzdCA9IG5ldyBSZXF1ZXN0KGlucHV0LCBpbml0KVxuICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpXG5cbiAgICAgIHhoci5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICAgICAgc3RhdHVzOiB4aHIuc3RhdHVzLFxuICAgICAgICAgIHN0YXR1c1RleHQ6IHhoci5zdGF0dXNUZXh0LFxuICAgICAgICAgIGhlYWRlcnM6IHBhcnNlSGVhZGVycyh4aHIuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKCkgfHwgJycpXG4gICAgICAgIH1cbiAgICAgICAgb3B0aW9ucy51cmwgPSAncmVzcG9uc2VVUkwnIGluIHhociA/IHhoci5yZXNwb25zZVVSTCA6IG9wdGlvbnMuaGVhZGVycy5nZXQoJ1gtUmVxdWVzdC1VUkwnKVxuICAgICAgICB2YXIgYm9keSA9ICdyZXNwb25zZScgaW4geGhyID8geGhyLnJlc3BvbnNlIDogeGhyLnJlc3BvbnNlVGV4dFxuICAgICAgICByZXNvbHZlKG5ldyBSZXNwb25zZShib2R5LCBvcHRpb25zKSlcbiAgICAgIH1cblxuICAgICAgeGhyLm9uZXJyb3IgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmVqZWN0KG5ldyBUeXBlRXJyb3IoJ05ldHdvcmsgcmVxdWVzdCBmYWlsZWQnKSlcbiAgICAgIH1cblxuICAgICAgeGhyLm9udGltZW91dCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZWplY3QobmV3IFR5cGVFcnJvcignTmV0d29yayByZXF1ZXN0IGZhaWxlZCcpKVxuICAgICAgfVxuXG4gICAgICB4aHIub3BlbihyZXF1ZXN0Lm1ldGhvZCwgcmVxdWVzdC51cmwsIHRydWUpXG5cbiAgICAgIGlmIChyZXF1ZXN0LmNyZWRlbnRpYWxzID09PSAnaW5jbHVkZScpIHtcbiAgICAgICAgeGhyLndpdGhDcmVkZW50aWFscyA9IHRydWVcbiAgICAgIH1cblxuICAgICAgaWYgKCdyZXNwb25zZVR5cGUnIGluIHhociAmJiBzdXBwb3J0LmJsb2IpIHtcbiAgICAgICAgeGhyLnJlc3BvbnNlVHlwZSA9ICdibG9iJ1xuICAgICAgfVxuXG4gICAgICByZXF1ZXN0LmhlYWRlcnMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwgbmFtZSkge1xuICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihuYW1lLCB2YWx1ZSlcbiAgICAgIH0pXG5cbiAgICAgIHhoci5zZW5kKHR5cGVvZiByZXF1ZXN0Ll9ib2R5SW5pdCA9PT0gJ3VuZGVmaW5lZCcgPyBudWxsIDogcmVxdWVzdC5fYm9keUluaXQpXG4gICAgfSlcbiAgfVxuICBzZWxmLmZldGNoLnBvbHlmaWxsID0gdHJ1ZVxufSkodHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnID8gc2VsZiA6IHRoaXMpO1xuIl19
