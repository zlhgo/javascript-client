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
      return transport.action(link, this.decoders, params, validate);
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

  function ErrorMessage(message, content, status, statusText) {
    _classCallCheck(this, ErrorMessage);

    var _this3 = _possibleConstructorReturn(this, (ErrorMessage.__proto__ || Object.getPrototypeOf(ErrorMessage)).call(this, message));

    _this3.message = message;
    _this3.content = content;
    _this3.status = status;
    _this3.statusText = statusText;
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
        if (field.location === 'query' && method === 'GET') {
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
      // if @param validate is true, add the extra parameter to Params
      for (var property in params) {
        if (params.hasOwnProperty(property) && !fieldNames.includes(property) && validate) {
          throw new errors.ParameterError('Unknown parameter: "' + property + '"');
        } else if (!fieldNames.includes(property)) {
          fieldNames.push(property);
          if (method === 'GET') {
            queryParams[property] = params[property];
          } else {
            formParams[property] = params[property];
            hasBody = true;
          }
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

      // TODO: 如果要修改的字段也出现在queryParams参数中,会出现404未找到
      if (!['PUT'].includes(method)) {
        parsedUrl.set('query', queryParams);
      }

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
      var request = this.buildRequest(link, decoders, params, validate);

      if (this.requestCallback) {
        this.requestCallback(request);
      }

      return this.fetch(request.url, request.options).then(function (response) {
        return parseResponse(response, decoders, responseCallback).then(function (data) {
          if (response.ok) {
            return data;
          } else {
            var title = response.status + ' ' + response.statusText;
            var error = new errors.ErrorMessage(title, data, response.status, response.statusText);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvYXV0aC9iYXNpYy5qcyIsImxpYi9hdXRoL2luZGV4LmpzIiwibGliL2F1dGgvc2Vzc2lvbi5qcyIsImxpYi9hdXRoL3Rva2VuLmpzIiwibGliL2NsaWVudC5qcyIsImxpYi9jb2RlY3MvY29yZWpzb24uanMiLCJsaWIvY29kZWNzL2luZGV4LmpzIiwibGliL2NvZGVjcy9qc29uLmpzIiwibGliL2NvZGVjcy90ZXh0LmpzIiwibGliL2RvY3VtZW50LmpzIiwibGliL2Vycm9ycy5qcyIsImxpYi9pbmRleC5qcyIsImxpYi90cmFuc3BvcnRzL2h0dHAuanMiLCJsaWIvdHJhbnNwb3J0cy9pbmRleC5qcyIsImxpYi91dGlscy5qcyIsIm5vZGVfbW9kdWxlcy9pc29tb3JwaGljLWZldGNoL2ZldGNoLW5wbS1icm93c2VyaWZ5LmpzIiwibm9kZV9tb2R1bGVzL3F1ZXJ5c3RyaW5naWZ5L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3JlcXVpcmVzLXBvcnQvaW5kZXguanMiLCJub2RlX21vZHVsZXMvdXJsLXBhcnNlL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3VybC10ZW1wbGF0ZS9saWIvdXJsLXRlbXBsYXRlLmpzIiwibm9kZV9tb2R1bGVzL3doYXR3Zy1mZXRjaC9mZXRjaC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7OztJQ0FNLG1CO0FBQ0osaUNBQTJCO0FBQUEsUUFBZCxPQUFjLHVFQUFKLEVBQUk7O0FBQUE7O0FBQ3pCLFFBQU0sV0FBVyxRQUFRLFFBQXpCO0FBQ0EsUUFBTSxXQUFXLFFBQVEsUUFBekI7QUFDQSxRQUFNLE9BQU8sT0FBTyxJQUFQLENBQVksV0FBVyxHQUFYLEdBQWlCLFFBQTdCLENBQWI7QUFDQSxTQUFLLElBQUwsR0FBWSxXQUFXLElBQXZCO0FBQ0Q7Ozs7aUNBRWEsTyxFQUFTO0FBQ3JCLGNBQVEsT0FBUixDQUFnQixlQUFoQixJQUFt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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3ZaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImNsYXNzIEJhc2ljQXV0aGVudGljYXRpb24ge1xuICBjb25zdHJ1Y3RvciAob3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3QgdXNlcm5hbWUgPSBvcHRpb25zLnVzZXJuYW1lXG4gICAgY29uc3QgcGFzc3dvcmQgPSBvcHRpb25zLnBhc3N3b3JkXG4gICAgY29uc3QgaGFzaCA9IHdpbmRvdy5idG9hKHVzZXJuYW1lICsgJzonICsgcGFzc3dvcmQpXG4gICAgdGhpcy5hdXRoID0gJ0Jhc2ljICcgKyBoYXNoXG4gIH1cblxuICBhdXRoZW50aWNhdGUgKG9wdGlvbnMpIHtcbiAgICBvcHRpb25zLmhlYWRlcnNbJ0F1dGhvcml6YXRpb24nXSA9IHRoaXMuYXV0aFxuICAgIHJldHVybiBvcHRpb25zXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIEJhc2ljQXV0aGVudGljYXRpb246IEJhc2ljQXV0aGVudGljYXRpb25cbn1cbiIsImNvbnN0IGJhc2ljID0gcmVxdWlyZSgnLi9iYXNpYycpXG5jb25zdCBzZXNzaW9uID0gcmVxdWlyZSgnLi9zZXNzaW9uJylcbmNvbnN0IHRva2VuID0gcmVxdWlyZSgnLi90b2tlbicpXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBCYXNpY0F1dGhlbnRpY2F0aW9uOiBiYXNpYy5CYXNpY0F1dGhlbnRpY2F0aW9uLFxuICBTZXNzaW9uQXV0aGVudGljYXRpb246IHNlc3Npb24uU2Vzc2lvbkF1dGhlbnRpY2F0aW9uLFxuICBUb2tlbkF1dGhlbnRpY2F0aW9uOiB0b2tlbi5Ub2tlbkF1dGhlbnRpY2F0aW9uXG59XG4iLCJjb25zdCB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzJylcblxuZnVuY3Rpb24gdHJpbSAoc3RyKSB7XG4gIHJldHVybiBzdHIucmVwbGFjZSgvXlxcc1xccyovLCAnJykucmVwbGFjZSgvXFxzXFxzKiQvLCAnJylcbn1cblxuZnVuY3Rpb24gZ2V0Q29va2llIChjb29raWVOYW1lLCBjb29raWVTdHJpbmcpIHtcbiAgY29va2llU3RyaW5nID0gY29va2llU3RyaW5nIHx8IHdpbmRvdy5kb2N1bWVudC5jb29raWVcbiAgaWYgKGNvb2tpZVN0cmluZyAmJiBjb29raWVTdHJpbmcgIT09ICcnKSB7XG4gICAgY29uc3QgY29va2llcyA9IGNvb2tpZVN0cmluZy5zcGxpdCgnOycpXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb29raWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBjb29raWUgPSB0cmltKGNvb2tpZXNbaV0pXG4gICAgICAvLyBEb2VzIHRoaXMgY29va2llIHN0cmluZyBiZWdpbiB3aXRoIHRoZSBuYW1lIHdlIHdhbnQ/XG4gICAgICBpZiAoY29va2llLnN1YnN0cmluZygwLCBjb29raWVOYW1lLmxlbmd0aCArIDEpID09PSAoY29va2llTmFtZSArICc9JykpIHtcbiAgICAgICAgcmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudChjb29raWUuc3Vic3RyaW5nKGNvb2tpZU5hbWUubGVuZ3RoICsgMSkpXG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBudWxsXG59XG5cbmNsYXNzIFNlc3Npb25BdXRoZW50aWNhdGlvbiB7XG4gIGNvbnN0cnVjdG9yIChvcHRpb25zID0ge30pIHtcbiAgICB0aGlzLmNzcmZUb2tlbiA9IGdldENvb2tpZShvcHRpb25zLmNzcmZDb29raWVOYW1lLCBvcHRpb25zLmNvb2tpZVN0cmluZylcbiAgICB0aGlzLmNzcmZIZWFkZXJOYW1lID0gb3B0aW9ucy5jc3JmSGVhZGVyTmFtZVxuICB9XG5cbiAgYXV0aGVudGljYXRlIChvcHRpb25zKSB7XG4gICAgb3B0aW9ucy5jcmVkZW50aWFscyA9ICdzYW1lLW9yaWdpbidcbiAgICBpZiAodGhpcy5jc3JmVG9rZW4gJiYgIXV0aWxzLmNzcmZTYWZlTWV0aG9kKG9wdGlvbnMubWV0aG9kKSkge1xuICAgICAgb3B0aW9ucy5oZWFkZXJzW3RoaXMuY3NyZkhlYWRlck5hbWVdID0gdGhpcy5jc3JmVG9rZW5cbiAgICB9XG4gICAgcmV0dXJuIG9wdGlvbnNcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgU2Vzc2lvbkF1dGhlbnRpY2F0aW9uOiBTZXNzaW9uQXV0aGVudGljYXRpb25cbn1cbiIsImNsYXNzIFRva2VuQXV0aGVudGljYXRpb24ge1xuICBjb25zdHJ1Y3RvciAob3B0aW9ucyA9IHt9KSB7XG4gICAgdGhpcy50b2tlbiA9IG9wdGlvbnMudG9rZW5cbiAgICB0aGlzLnNjaGVtZSA9IG9wdGlvbnMuc2NoZW1lIHx8ICdCZWFyZXInXG4gIH1cblxuICBhdXRoZW50aWNhdGUgKG9wdGlvbnMpIHtcbiAgICBvcHRpb25zLmhlYWRlcnNbJ0F1dGhvcml6YXRpb24nXSA9IHRoaXMuc2NoZW1lICsgJyAnICsgdGhpcy50b2tlblxuICAgIHJldHVybiBvcHRpb25zXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIFRva2VuQXV0aGVudGljYXRpb246IFRva2VuQXV0aGVudGljYXRpb25cbn1cbiIsImNvbnN0IGRvY3VtZW50ID0gcmVxdWlyZSgnLi9kb2N1bWVudCcpXG5jb25zdCBjb2RlY3MgPSByZXF1aXJlKCcuL2NvZGVjcycpXG5jb25zdCBlcnJvcnMgPSByZXF1aXJlKCcuL2Vycm9ycycpXG5jb25zdCB0cmFuc3BvcnRzID0gcmVxdWlyZSgnLi90cmFuc3BvcnRzJylcbmNvbnN0IHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpXG5cbmZ1bmN0aW9uIGxvb2t1cExpbmsgKG5vZGUsIGtleXMpIHtcbiAgZm9yIChsZXQga2V5IG9mIGtleXMpIHtcbiAgICBpZiAobm9kZSBpbnN0YW5jZW9mIGRvY3VtZW50LkRvY3VtZW50KSB7XG4gICAgICBub2RlID0gbm9kZS5jb250ZW50W2tleV1cbiAgICB9IGVsc2Uge1xuICAgICAgbm9kZSA9IG5vZGVba2V5XVxuICAgIH1cbiAgICBpZiAobm9kZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgZXJyb3JzLkxpbmtMb29rdXBFcnJvcihgSW52YWxpZCBsaW5rIGxvb2t1cDogJHtKU09OLnN0cmluZ2lmeShrZXlzKX1gKVxuICAgIH1cbiAgfVxuICBpZiAoIShub2RlIGluc3RhbmNlb2YgZG9jdW1lbnQuTGluaykpIHtcbiAgICB0aHJvdyBuZXcgZXJyb3JzLkxpbmtMb29rdXBFcnJvcihgSW52YWxpZCBsaW5rIGxvb2t1cDogJHtKU09OLnN0cmluZ2lmeShrZXlzKX1gKVxuICB9XG4gIHJldHVybiBub2RlXG59XG5cbmNsYXNzIENsaWVudCB7XG4gIGNvbnN0cnVjdG9yIChvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCB0cmFuc3BvcnRPcHRpb25zID0ge1xuICAgICAgYXV0aDogb3B0aW9ucy5hdXRoIHx8IG51bGwsXG4gICAgICBoZWFkZXJzOiBvcHRpb25zLmhlYWRlcnMgfHwge30sXG4gICAgICByZXF1ZXN0Q2FsbGJhY2s6IG9wdGlvbnMucmVxdWVzdENhbGxiYWNrLFxuICAgICAgcmVzcG9uc2VDYWxsYmFjazogb3B0aW9ucy5yZXNwb25zZUNhbGxiYWNrXG4gICAgfVxuXG4gICAgdGhpcy5kZWNvZGVycyA9IG9wdGlvbnMuZGVjb2RlcnMgfHwgW25ldyBjb2RlY3MuQ29yZUpTT05Db2RlYygpLCBuZXcgY29kZWNzLkpTT05Db2RlYygpLCBuZXcgY29kZWNzLlRleHRDb2RlYygpXVxuICAgIHRoaXMudHJhbnNwb3J0cyA9IG9wdGlvbnMudHJhbnNwb3J0cyB8fCBbbmV3IHRyYW5zcG9ydHMuSFRUUFRyYW5zcG9ydCh0cmFuc3BvcnRPcHRpb25zKV1cbiAgfVxuXG4gIGFjdGlvbiAoZG9jdW1lbnQsIGtleXMsIHBhcmFtcyA9IHt9LCB2YWxpZGF0ZSA9IHRydWUpIHtcbiAgICBjb25zdCBsaW5rID0gbG9va3VwTGluayhkb2N1bWVudCwga2V5cylcbiAgICBjb25zdCB0cmFuc3BvcnQgPSB1dGlscy5kZXRlcm1pbmVUcmFuc3BvcnQodGhpcy50cmFuc3BvcnRzLCBsaW5rLnVybClcbiAgICByZXR1cm4gdHJhbnNwb3J0LmFjdGlvbihsaW5rLCB0aGlzLmRlY29kZXJzLCBwYXJhbXMsIHZhbGlkYXRlKVxuICB9XG5cbiAgZ2V0ICh1cmwpIHtcbiAgICBjb25zdCBsaW5rID0gbmV3IGRvY3VtZW50LkxpbmsodXJsLCAnZ2V0JylcbiAgICBjb25zdCB0cmFuc3BvcnQgPSB1dGlscy5kZXRlcm1pbmVUcmFuc3BvcnQodGhpcy50cmFuc3BvcnRzLCB1cmwpXG4gICAgcmV0dXJuIHRyYW5zcG9ydC5hY3Rpb24obGluaywgdGhpcy5kZWNvZGVycylcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgQ2xpZW50OiBDbGllbnRcbn1cbiIsImNvbnN0IGRvY3VtZW50ID0gcmVxdWlyZSgnLi4vZG9jdW1lbnQnKVxuY29uc3QgVVJMID0gcmVxdWlyZSgndXJsLXBhcnNlJylcblxuZnVuY3Rpb24gdW5lc2NhcGVLZXkgKGtleSkge1xuICBpZiAoa2V5Lm1hdGNoKC9fXyh0eXBlfG1ldGEpJC8pKSB7XG4gICAgcmV0dXJuIGtleS5zdWJzdHJpbmcoMSlcbiAgfVxuICByZXR1cm4ga2V5XG59XG5cbmZ1bmN0aW9uIGdldFN0cmluZyAob2JqLCBrZXkpIHtcbiAgY29uc3QgdmFsdWUgPSBvYmpba2V5XVxuICBpZiAodHlwZW9mICh2YWx1ZSkgPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHZhbHVlXG4gIH1cbiAgcmV0dXJuICcnXG59XG5cbmZ1bmN0aW9uIGdldEJvb2xlYW4gKG9iaiwga2V5KSB7XG4gIGNvbnN0IHZhbHVlID0gb2JqW2tleV1cbiAgaWYgKHR5cGVvZiAodmFsdWUpID09PSAnYm9vbGVhbicpIHtcbiAgICByZXR1cm4gdmFsdWVcbiAgfVxuICByZXR1cm4gZmFsc2Vcbn1cblxuZnVuY3Rpb24gZ2V0T2JqZWN0IChvYmosIGtleSkge1xuICBjb25zdCB2YWx1ZSA9IG9ialtrZXldXG4gIGlmICh0eXBlb2YgKHZhbHVlKSA9PT0gJ29iamVjdCcpIHtcbiAgICByZXR1cm4gdmFsdWVcbiAgfVxuICByZXR1cm4ge31cbn1cblxuZnVuY3Rpb24gZ2V0QXJyYXkgKG9iaiwga2V5KSB7XG4gIGNvbnN0IHZhbHVlID0gb2JqW2tleV1cbiAgaWYgKHZhbHVlIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICByZXR1cm4gdmFsdWVcbiAgfVxuICByZXR1cm4gW11cbn1cblxuZnVuY3Rpb24gZ2V0Q29udGVudCAoZGF0YSwgYmFzZVVybCkge1xuICBjb25zdCBleGNsdWRlZCA9IFsnX3R5cGUnLCAnX21ldGEnXVxuICB2YXIgY29udGVudCA9IHt9XG4gIGZvciAodmFyIHByb3BlcnR5IGluIGRhdGEpIHtcbiAgICBpZiAoZGF0YS5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkgJiYgIWV4Y2x1ZGVkLmluY2x1ZGVzKHByb3BlcnR5KSkge1xuICAgICAgY29uc3Qga2V5ID0gdW5lc2NhcGVLZXkocHJvcGVydHkpXG4gICAgICBjb25zdCB2YWx1ZSA9IHByaW1pdGl2ZVRvTm9kZShkYXRhW3Byb3BlcnR5XSwgYmFzZVVybClcbiAgICAgIGNvbnRlbnRba2V5XSA9IHZhbHVlXG4gICAgfVxuICB9XG4gIHJldHVybiBjb250ZW50XG59XG5cbmZ1bmN0aW9uIHByaW1pdGl2ZVRvTm9kZSAoZGF0YSwgYmFzZVVybCkge1xuICBjb25zdCBpc09iamVjdCA9IGRhdGEgaW5zdGFuY2VvZiBPYmplY3QgJiYgIShkYXRhIGluc3RhbmNlb2YgQXJyYXkpXG5cbiAgaWYgKGlzT2JqZWN0ICYmIGRhdGEuX3R5cGUgPT09ICdkb2N1bWVudCcpIHtcbiAgICAvLyBEb2N1bWVudFxuICAgIGNvbnN0IG1ldGEgPSBnZXRPYmplY3QoZGF0YSwgJ19tZXRhJylcbiAgICBjb25zdCByZWxhdGl2ZVVybCA9IGdldFN0cmluZyhtZXRhLCAndXJsJylcbiAgICBjb25zdCB1cmwgPSByZWxhdGl2ZVVybCA/IFVSTChyZWxhdGl2ZVVybCwgYmFzZVVybCkudG9TdHJpbmcoKSA6ICcnXG4gICAgY29uc3QgdGl0bGUgPSBnZXRTdHJpbmcobWV0YSwgJ3RpdGxlJylcbiAgICBjb25zdCBkZXNjcmlwdGlvbiA9IGdldFN0cmluZyhtZXRhLCAnZGVzY3JpcHRpb24nKVxuICAgIGNvbnN0IGNvbnRlbnQgPSBnZXRDb250ZW50KGRhdGEsIHVybClcbiAgICByZXR1cm4gbmV3IGRvY3VtZW50LkRvY3VtZW50KHVybCwgdGl0bGUsIGRlc2NyaXB0aW9uLCBjb250ZW50KVxuICB9IGVsc2UgaWYgKGlzT2JqZWN0ICYmIGRhdGEuX3R5cGUgPT09ICdsaW5rJykge1xuICAgIC8vIExpbmtcbiAgICBjb25zdCByZWxhdGl2ZVVybCA9IGdldFN0cmluZyhkYXRhLCAndXJsJylcbiAgICBjb25zdCB1cmwgPSByZWxhdGl2ZVVybCA/IFVSTChyZWxhdGl2ZVVybCwgYmFzZVVybCkudG9TdHJpbmcoKSA6ICcnXG4gICAgY29uc3QgbWV0aG9kID0gZ2V0U3RyaW5nKGRhdGEsICdhY3Rpb24nKSB8fCAnZ2V0J1xuICAgIGNvbnN0IHRpdGxlID0gZ2V0U3RyaW5nKGRhdGEsICd0aXRsZScpXG4gICAgY29uc3QgZGVzY3JpcHRpb24gPSBnZXRTdHJpbmcoZGF0YSwgJ2Rlc2NyaXB0aW9uJylcbiAgICBjb25zdCBmaWVsZHNEYXRhID0gZ2V0QXJyYXkoZGF0YSwgJ2ZpZWxkcycpXG4gICAgdmFyIGZpZWxkcyA9IFtdXG4gICAgZm9yIChsZXQgaWR4ID0gMCwgbGVuID0gZmllbGRzRGF0YS5sZW5ndGg7IGlkeCA8IGxlbjsgaWR4KyspIHtcbiAgICAgIGxldCB2YWx1ZSA9IGZpZWxkc0RhdGFbaWR4XVxuICAgICAgbGV0IG5hbWUgPSBnZXRTdHJpbmcodmFsdWUsICduYW1lJylcbiAgICAgIGxldCByZXF1aXJlZCA9IGdldEJvb2xlYW4odmFsdWUsICdyZXF1aXJlZCcpXG4gICAgICBsZXQgbG9jYXRpb24gPSBnZXRTdHJpbmcodmFsdWUsICdsb2NhdGlvbicpXG4gICAgICBsZXQgZmllbGREZXNjcmlwdGlvbiA9IGdldFN0cmluZyh2YWx1ZSwgJ2ZpZWxkRGVzY3JpcHRpb24nKVxuICAgICAgbGV0IGZpZWxkID0gbmV3IGRvY3VtZW50LkZpZWxkKG5hbWUsIHJlcXVpcmVkLCBsb2NhdGlvbiwgZmllbGREZXNjcmlwdGlvbilcbiAgICAgIGZpZWxkcy5wdXNoKGZpZWxkKVxuICAgIH1cbiAgICByZXR1cm4gbmV3IGRvY3VtZW50LkxpbmsodXJsLCBtZXRob2QsICdhcHBsaWNhdGlvbi9qc29uJywgZmllbGRzLCB0aXRsZSwgZGVzY3JpcHRpb24pXG4gIH0gZWxzZSBpZiAoaXNPYmplY3QpIHtcbiAgICAvLyBPYmplY3RcbiAgICBsZXQgY29udGVudCA9IHt9XG4gICAgZm9yIChsZXQga2V5IGluIGRhdGEpIHtcbiAgICAgIGlmIChkYXRhLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgY29udGVudFtrZXldID0gcHJpbWl0aXZlVG9Ob2RlKGRhdGFba2V5XSwgYmFzZVVybClcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNvbnRlbnRcbiAgfSBlbHNlIGlmIChkYXRhIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAvLyBPYmplY3RcbiAgICBsZXQgY29udGVudCA9IFtdXG4gICAgZm9yIChsZXQgaWR4ID0gMCwgbGVuID0gZGF0YS5sZW5ndGg7IGlkeCA8IGxlbjsgaWR4KyspIHtcbiAgICAgIGNvbnRlbnQucHVzaChwcmltaXRpdmVUb05vZGUoZGF0YVtpZHhdLCBiYXNlVXJsKSlcbiAgICB9XG4gICAgcmV0dXJuIGNvbnRlbnRcbiAgfVxuICAvLyBQcmltaXRpdmVcbiAgcmV0dXJuIGRhdGFcbn1cblxuY2xhc3MgQ29yZUpTT05Db2RlYyB7XG4gIGNvbnN0cnVjdG9yICgpIHtcbiAgICB0aGlzLm1lZGlhVHlwZSA9ICdhcHBsaWNhdGlvbi9jb3JlYXBpK2pzb24nXG4gIH1cblxuICBkZWNvZGUgKHRleHQsIG9wdGlvbnMgPSB7fSkge1xuICAgIGxldCBkYXRhID0gdGV4dFxuICAgIGlmIChvcHRpb25zLnByZWxvYWRlZCA9PT0gdW5kZWZpbmVkIHx8ICFvcHRpb25zLnByZWxvYWRlZCkge1xuICAgICAgZGF0YSA9IEpTT04ucGFyc2UodGV4dClcbiAgICB9XG4gICAgcmV0dXJuIHByaW1pdGl2ZVRvTm9kZShkYXRhLCBvcHRpb25zLnVybClcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgQ29yZUpTT05Db2RlYzogQ29yZUpTT05Db2RlY1xufVxuIiwiY29uc3QgY29yZWpzb24gPSByZXF1aXJlKCcuL2NvcmVqc29uJylcbmNvbnN0IGpzb24gPSByZXF1aXJlKCcuL2pzb24nKVxuY29uc3QgdGV4dCA9IHJlcXVpcmUoJy4vdGV4dCcpXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBDb3JlSlNPTkNvZGVjOiBjb3JlanNvbi5Db3JlSlNPTkNvZGVjLFxuICBKU09OQ29kZWM6IGpzb24uSlNPTkNvZGVjLFxuICBUZXh0Q29kZWM6IHRleHQuVGV4dENvZGVjXG59XG4iLCJjbGFzcyBKU09OQ29kZWMge1xuICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgdGhpcy5tZWRpYVR5cGUgPSAnYXBwbGljYXRpb24vanNvbidcbiAgfVxuXG4gIGRlY29kZSAodGV4dCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgcmV0dXJuIEpTT04ucGFyc2UodGV4dClcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgSlNPTkNvZGVjOiBKU09OQ29kZWNcbn1cbiIsImNsYXNzIFRleHRDb2RlYyB7XG4gIGNvbnN0cnVjdG9yICgpIHtcbiAgICB0aGlzLm1lZGlhVHlwZSA9ICd0ZXh0LyonXG4gIH1cblxuICBkZWNvZGUgKHRleHQsIG9wdGlvbnMgPSB7fSkge1xuICAgIHJldHVybiB0ZXh0XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIFRleHRDb2RlYzogVGV4dENvZGVjXG59XG4iLCJjbGFzcyBEb2N1bWVudCB7XG4gIGNvbnN0cnVjdG9yICh1cmwgPSAnJywgdGl0bGUgPSAnJywgZGVzY3JpcHRpb24gPSAnJywgY29udGVudCA9IHt9KSB7XG4gICAgdGhpcy51cmwgPSB1cmxcbiAgICB0aGlzLnRpdGxlID0gdGl0bGVcbiAgICB0aGlzLmRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb25cbiAgICB0aGlzLmNvbnRlbnQgPSBjb250ZW50XG4gIH1cbn1cblxuY2xhc3MgTGluayB7XG4gIGNvbnN0cnVjdG9yICh1cmwsIG1ldGhvZCwgZW5jb2RpbmcgPSAnYXBwbGljYXRpb24vanNvbicsIGZpZWxkcyA9IFtdLCB0aXRsZSA9ICcnLCBkZXNjcmlwdGlvbiA9ICcnKSB7XG4gICAgaWYgKHVybCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ3VybCBhcmd1bWVudCBpcyByZXF1aXJlZCcpXG4gICAgfVxuXG4gICAgaWYgKG1ldGhvZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ21ldGhvZCBhcmd1bWVudCBpcyByZXF1aXJlZCcpXG4gICAgfVxuXG4gICAgdGhpcy51cmwgPSB1cmxcbiAgICB0aGlzLm1ldGhvZCA9IG1ldGhvZFxuICAgIHRoaXMuZW5jb2RpbmcgPSBlbmNvZGluZ1xuICAgIHRoaXMuZmllbGRzID0gZmllbGRzXG4gICAgdGhpcy50aXRsZSA9IHRpdGxlXG4gICAgdGhpcy5kZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uXG4gIH1cbn1cblxuY2xhc3MgRmllbGQge1xuICBjb25zdHJ1Y3RvciAobmFtZSwgcmVxdWlyZWQgPSBmYWxzZSwgbG9jYXRpb24gPSAnJywgZGVzY3JpcHRpb24gPSAnJykge1xuICAgIGlmIChuYW1lID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignbmFtZSBhcmd1bWVudCBpcyByZXF1aXJlZCcpXG4gICAgfVxuXG4gICAgdGhpcy5uYW1lID0gbmFtZVxuICAgIHRoaXMucmVxdWlyZWQgPSByZXF1aXJlZFxuICAgIHRoaXMubG9jYXRpb24gPSBsb2NhdGlvblxuICAgIHRoaXMuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvblxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBEb2N1bWVudDogRG9jdW1lbnQsXG4gIExpbms6IExpbmssXG4gIEZpZWxkOiBGaWVsZFxufVxuIiwiY2xhc3MgUGFyYW1ldGVyRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIGNvbnN0cnVjdG9yIChtZXNzYWdlKSB7XG4gICAgc3VwZXIobWVzc2FnZSlcbiAgICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlXG4gICAgdGhpcy5uYW1lID0gJ1BhcmFtZXRlckVycm9yJ1xuICB9XG59XG5cbmNsYXNzIExpbmtMb29rdXBFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgY29uc3RydWN0b3IgKG1lc3NhZ2UpIHtcbiAgICBzdXBlcihtZXNzYWdlKVxuICAgIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2VcbiAgICB0aGlzLm5hbWUgPSAnTGlua0xvb2t1cEVycm9yJ1xuICB9XG59XG5cbmNsYXNzIEVycm9yTWVzc2FnZSBleHRlbmRzIEVycm9yIHtcbiAgY29uc3RydWN0b3IgKG1lc3NhZ2UsIGNvbnRlbnQsIHN0YXR1cywgc3RhdHVzVGV4dCkge1xuICAgIHN1cGVyKG1lc3NhZ2UpXG4gICAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZVxuICAgIHRoaXMuY29udGVudCA9IGNvbnRlbnRcbiAgICB0aGlzLnN0YXR1cyA9IHN0YXR1c1xuICAgIHRoaXMuc3RhdHVzVGV4dCA9IHN0YXR1c1RleHRcbiAgICB0aGlzLm5hbWUgPSAnRXJyb3JNZXNzYWdlJ1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBQYXJhbWV0ZXJFcnJvcjogUGFyYW1ldGVyRXJyb3IsXG4gIExpbmtMb29rdXBFcnJvcjogTGlua0xvb2t1cEVycm9yLFxuICBFcnJvck1lc3NhZ2U6IEVycm9yTWVzc2FnZVxufVxuIiwiY29uc3QgYXV0aCA9IHJlcXVpcmUoJy4vYXV0aCcpXG5jb25zdCBjbGllbnQgPSByZXF1aXJlKCcuL2NsaWVudCcpXG5jb25zdCBjb2RlY3MgPSByZXF1aXJlKCcuL2NvZGVjcycpXG5jb25zdCBkb2N1bWVudCA9IHJlcXVpcmUoJy4vZG9jdW1lbnQnKVxuY29uc3QgZXJyb3JzID0gcmVxdWlyZSgnLi9lcnJvcnMnKVxuY29uc3QgdHJhbnNwb3J0cyA9IHJlcXVpcmUoJy4vdHJhbnNwb3J0cycpXG5jb25zdCB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKVxuXG5jb25zdCBjb3JlYXBpID0ge1xuICBDbGllbnQ6IGNsaWVudC5DbGllbnQsXG4gIERvY3VtZW50OiBkb2N1bWVudC5Eb2N1bWVudCxcbiAgTGluazogZG9jdW1lbnQuTGluayxcbiAgYXV0aDogYXV0aCxcbiAgY29kZWNzOiBjb2RlY3MsXG4gIGVycm9yczogZXJyb3JzLFxuICB0cmFuc3BvcnRzOiB0cmFuc3BvcnRzLFxuICB1dGlsczogdXRpbHNcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjb3JlYXBpXG4iLCJjb25zdCBmZXRjaCA9IHJlcXVpcmUoJ2lzb21vcnBoaWMtZmV0Y2gnKVxuY29uc3QgZXJyb3JzID0gcmVxdWlyZSgnLi4vZXJyb3JzJylcbmNvbnN0IHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbHMnKVxuY29uc3QgVVJMID0gcmVxdWlyZSgndXJsLXBhcnNlJylcbmNvbnN0IHVybFRlbXBsYXRlID0gcmVxdWlyZSgndXJsLXRlbXBsYXRlJylcblxuY29uc3QgcGFyc2VSZXNwb25zZSA9IChyZXNwb25zZSwgZGVjb2RlcnMsIHJlc3BvbnNlQ2FsbGJhY2spID0+IHtcbiAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKS50aGVuKHRleHQgPT4ge1xuICAgIGlmIChyZXNwb25zZUNhbGxiYWNrKSB7XG4gICAgICByZXNwb25zZUNhbGxiYWNrKHJlc3BvbnNlLCB0ZXh0KVxuICAgIH1cbiAgICBjb25zdCBjb250ZW50VHlwZSA9IHJlc3BvbnNlLmhlYWRlcnMuZ2V0KCdDb250ZW50LVR5cGUnKVxuICAgIGNvbnN0IGRlY29kZXIgPSB1dGlscy5uZWdvdGlhdGVEZWNvZGVyKGRlY29kZXJzLCBjb250ZW50VHlwZSlcbiAgICBjb25zdCBvcHRpb25zID0ge3VybDogcmVzcG9uc2UudXJsfVxuICAgIHJldHVybiBkZWNvZGVyLmRlY29kZSh0ZXh0LCBvcHRpb25zKVxuICB9KVxufVxuXG5jbGFzcyBIVFRQVHJhbnNwb3J0IHtcbiAgY29uc3RydWN0b3IgKG9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMuc2NoZW1lcyA9IFsnaHR0cCcsICdodHRwcyddXG4gICAgdGhpcy5hdXRoID0gb3B0aW9ucy5hdXRoIHx8IG51bGxcbiAgICB0aGlzLmhlYWRlcnMgPSBvcHRpb25zLmhlYWRlcnMgfHwge31cbiAgICB0aGlzLmZldGNoID0gb3B0aW9ucy5mZXRjaCB8fCBmZXRjaFxuICAgIHRoaXMuRm9ybURhdGEgPSBvcHRpb25zLkZvcm1EYXRhIHx8IHdpbmRvdy5Gb3JtRGF0YVxuICAgIHRoaXMucmVxdWVzdENhbGxiYWNrID0gb3B0aW9ucy5yZXF1ZXN0Q2FsbGJhY2tcbiAgICB0aGlzLnJlc3BvbnNlQ2FsbGJhY2sgPSBvcHRpb25zLnJlc3BvbnNlQ2FsbGJhY2tcbiAgfVxuXG4gIGJ1aWxkUmVxdWVzdCAobGluaywgZGVjb2RlcnMsIHBhcmFtcyA9IHt9LCB2YWxpZGF0ZSA9IHRydWUpIHtcbiAgICBjb25zdCBmaWVsZHMgPSBsaW5rLmZpZWxkc1xuICAgIGNvbnN0IG1ldGhvZCA9IGxpbmsubWV0aG9kLnRvVXBwZXJDYXNlKClcbiAgICBsZXQgcXVlcnlQYXJhbXMgPSB7fVxuICAgIGxldCBwYXRoUGFyYW1zID0ge31cbiAgICBsZXQgZm9ybVBhcmFtcyA9IHt9XG4gICAgbGV0IGZpZWxkTmFtZXMgPSBbXVxuICAgIGxldCBoYXNCb2R5ID0gZmFsc2VcblxuICAgIGZvciAobGV0IGlkeCA9IDAsIGxlbiA9IGZpZWxkcy5sZW5ndGg7IGlkeCA8IGxlbjsgaWR4KyspIHtcbiAgICAgIGNvbnN0IGZpZWxkID0gZmllbGRzW2lkeF1cblxuICAgICAgLy8gRW5zdXJlIGFueSByZXF1aXJlZCBmaWVsZHMgYXJlIGluY2x1ZGVkXG4gICAgICBpZiAoIXBhcmFtcy5oYXNPd25Qcm9wZXJ0eShmaWVsZC5uYW1lKSkge1xuICAgICAgICBpZiAoZmllbGQucmVxdWlyZWQpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgZXJyb3JzLlBhcmFtZXRlckVycm9yKGBNaXNzaW5nIHJlcXVpcmVkIGZpZWxkOiBcIiR7ZmllbGQubmFtZX1cImApXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBmaWVsZE5hbWVzLnB1c2goZmllbGQubmFtZSlcbiAgICAgIGlmIChmaWVsZC5sb2NhdGlvbiA9PT0gJ3F1ZXJ5JyAmJiBtZXRob2QgPT09ICdHRVQnKSB7XG4gICAgICAgIHF1ZXJ5UGFyYW1zW2ZpZWxkLm5hbWVdID0gcGFyYW1zW2ZpZWxkLm5hbWVdXG4gICAgICB9IGVsc2UgaWYgKGZpZWxkLmxvY2F0aW9uID09PSAncGF0aCcpIHtcbiAgICAgICAgcGF0aFBhcmFtc1tmaWVsZC5uYW1lXSA9IHBhcmFtc1tmaWVsZC5uYW1lXVxuICAgICAgfSBlbHNlIGlmIChmaWVsZC5sb2NhdGlvbiA9PT0gJ2Zvcm0nKSB7XG4gICAgICAgIGZvcm1QYXJhbXNbZmllbGQubmFtZV0gPSBwYXJhbXNbZmllbGQubmFtZV1cbiAgICAgICAgaGFzQm9keSA9IHRydWVcbiAgICAgIH0gZWxzZSBpZiAoZmllbGQubG9jYXRpb24gPT09ICdib2R5Jykge1xuICAgICAgICBmb3JtUGFyYW1zID0gcGFyYW1zW2ZpZWxkLm5hbWVdXG4gICAgICAgIGhhc0JvZHkgPSB0cnVlXG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gQ2hlY2sgZm9yIGFueSBwYXJhbWV0ZXJzIHRoYXQgZGlkIG5vdCBoYXZlIGEgbWF0Y2hpbmcgZmllbGRcbiAgICAvLyBpZiBAcGFyYW0gdmFsaWRhdGUgaXMgdHJ1ZSwgYWRkIHRoZSBleHRyYSBwYXJhbWV0ZXIgdG8gUGFyYW1zXG4gICAgZm9yICh2YXIgcHJvcGVydHkgaW4gcGFyYW1zKSB7XG4gICAgICBpZiAocGFyYW1zLmhhc093blByb3BlcnR5KHByb3BlcnR5KSAmJiAhZmllbGROYW1lcy5pbmNsdWRlcyhwcm9wZXJ0eSkgJiYgdmFsaWRhdGUpIHtcbiAgICAgICAgdGhyb3cgbmV3IGVycm9ycy5QYXJhbWV0ZXJFcnJvcihgVW5rbm93biBwYXJhbWV0ZXI6IFwiJHtwcm9wZXJ0eX1cImApXG4gICAgICB9IGVsc2UgaWYgKCFmaWVsZE5hbWVzLmluY2x1ZGVzKHByb3BlcnR5KSkge1xuICAgICAgICBmaWVsZE5hbWVzLnB1c2gocHJvcGVydHkpXG4gICAgICAgIGlmIChtZXRob2QgPT09ICdHRVQnKSB7XG4gICAgICAgICAgcXVlcnlQYXJhbXNbcHJvcGVydHldID0gcGFyYW1zW3Byb3BlcnR5XVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZvcm1QYXJhbXNbcHJvcGVydHldID0gcGFyYW1zW3Byb3BlcnR5XVxuICAgICAgICAgIGhhc0JvZHkgPSB0cnVlXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgcmVxdWVzdE9wdGlvbnMgPSB7bWV0aG9kOiBtZXRob2QsIGhlYWRlcnM6IHt9fVxuXG4gICAgT2JqZWN0LmFzc2lnbihyZXF1ZXN0T3B0aW9ucy5oZWFkZXJzLCB0aGlzLmhlYWRlcnMpXG5cbiAgICBpZiAoaGFzQm9keSkge1xuICAgICAgaWYgKGxpbmsuZW5jb2RpbmcgPT09ICdhcHBsaWNhdGlvbi9qc29uJykge1xuICAgICAgICByZXF1ZXN0T3B0aW9ucy5ib2R5ID0gSlNPTi5zdHJpbmdpZnkoZm9ybVBhcmFtcylcbiAgICAgICAgcmVxdWVzdE9wdGlvbnMuaGVhZGVyc1snQ29udGVudC1UeXBlJ10gPSAnYXBwbGljYXRpb24vanNvbidcbiAgICAgIH0gZWxzZSBpZiAobGluay5lbmNvZGluZyA9PT0gJ211bHRpcGFydC9mb3JtLWRhdGEnKSB7XG4gICAgICAgIGxldCBmb3JtID0gbmV3IHRoaXMuRm9ybURhdGEoKVxuXG4gICAgICAgIGZvciAobGV0IHBhcmFtS2V5IGluIGZvcm1QYXJhbXMpIHtcbiAgICAgICAgICBmb3JtLmFwcGVuZChwYXJhbUtleSwgZm9ybVBhcmFtc1twYXJhbUtleV0pXG4gICAgICAgIH1cbiAgICAgICAgcmVxdWVzdE9wdGlvbnMuYm9keSA9IGZvcm1cbiAgICAgIH0gZWxzZSBpZiAobGluay5lbmNvZGluZyA9PT0gJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcpIHtcbiAgICAgICAgbGV0IGZvcm1Cb2R5ID0gW11cbiAgICAgICAgZm9yIChsZXQgcGFyYW1LZXkgaW4gZm9ybVBhcmFtcykge1xuICAgICAgICAgIGNvbnN0IGVuY29kZWRLZXkgPSBlbmNvZGVVUklDb21wb25lbnQocGFyYW1LZXkpXG4gICAgICAgICAgY29uc3QgZW5jb2RlZFZhbHVlID0gZW5jb2RlVVJJQ29tcG9uZW50KGZvcm1QYXJhbXNbcGFyYW1LZXldKVxuICAgICAgICAgIGZvcm1Cb2R5LnB1c2goZW5jb2RlZEtleSArICc9JyArIGVuY29kZWRWYWx1ZSlcbiAgICAgICAgfVxuICAgICAgICBmb3JtQm9keSA9IGZvcm1Cb2R5LmpvaW4oJyYnKVxuXG4gICAgICAgIHJlcXVlc3RPcHRpb25zLmJvZHkgPSBmb3JtQm9keVxuICAgICAgICByZXF1ZXN0T3B0aW9ucy5oZWFkZXJzWydDb250ZW50LVR5cGUnXSA9ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuYXV0aCkge1xuICAgICAgcmVxdWVzdE9wdGlvbnMgPSB0aGlzLmF1dGguYXV0aGVudGljYXRlKHJlcXVlc3RPcHRpb25zKVxuICAgIH1cblxuICAgIGxldCBwYXJzZWRVcmwgPSB1cmxUZW1wbGF0ZS5wYXJzZShsaW5rLnVybClcbiAgICBwYXJzZWRVcmwgPSBwYXJzZWRVcmwuZXhwYW5kKHBhdGhQYXJhbXMpXG4gICAgcGFyc2VkVXJsID0gbmV3IFVSTChwYXJzZWRVcmwpXG5cbiAgICAvLyBUT0RPOiDlpoLmnpzopoHkv67mlLnnmoTlrZfmrrXkuZ/lh7rnjrDlnKhxdWVyeVBhcmFtc+WPguaVsOS4rSzkvJrlh7rnjrA0MDTmnKrmib7liLBcbiAgICBpZiAoIVsnUFVUJ10uaW5jbHVkZXMobWV0aG9kKSkge1xuICAgICAgcGFyc2VkVXJsLnNldCgncXVlcnknLCBxdWVyeVBhcmFtcylcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgdXJsOiBwYXJzZWRVcmwudG9TdHJpbmcoKSxcbiAgICAgIG9wdGlvbnM6IHJlcXVlc3RPcHRpb25zXG4gICAgfVxuICB9XG5cbiAgYWN0aW9uIChsaW5rLCBkZWNvZGVycywgcGFyYW1zID0ge30sIHZhbGlkYXRlID0gdHJ1ZSkge1xuICAgIGNvbnN0IHJlc3BvbnNlQ2FsbGJhY2sgPSB0aGlzLnJlc3BvbnNlQ2FsbGJhY2tcbiAgICBjb25zdCByZXF1ZXN0ID0gdGhpcy5idWlsZFJlcXVlc3QobGluaywgZGVjb2RlcnMsIHBhcmFtcywgdmFsaWRhdGUpXG5cbiAgICBpZiAodGhpcy5yZXF1ZXN0Q2FsbGJhY2spIHtcbiAgICAgIHRoaXMucmVxdWVzdENhbGxiYWNrKHJlcXVlc3QpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuZmV0Y2gocmVxdWVzdC51cmwsIHJlcXVlc3Qub3B0aW9ucylcbiAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICByZXR1cm4gcGFyc2VSZXNwb25zZShyZXNwb25zZSwgZGVjb2RlcnMsIHJlc3BvbnNlQ2FsbGJhY2spXG4gICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5vaykge1xuICAgICAgICAgICAgICByZXR1cm4gZGF0YVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgY29uc3QgdGl0bGUgPSByZXNwb25zZS5zdGF0dXMgKyAnICcgKyByZXNwb25zZS5zdGF0dXNUZXh0XG4gICAgICAgICAgICAgIGNvbnN0IGVycm9yID0gbmV3IGVycm9ycy5FcnJvck1lc3NhZ2UodGl0bGUsIGRhdGEsIHJlc3BvbnNlLnN0YXR1cywgcmVzcG9uc2Uuc3RhdHVzVGV4dClcbiAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KGVycm9yKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICB9KVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBIVFRQVHJhbnNwb3J0OiBIVFRQVHJhbnNwb3J0XG59XG4iLCJjb25zdCBodHRwID0gcmVxdWlyZSgnLi9odHRwJylcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIEhUVFBUcmFuc3BvcnQ6IGh0dHAuSFRUUFRyYW5zcG9ydFxufVxuIiwiY29uc3QgVVJMID0gcmVxdWlyZSgndXJsLXBhcnNlJylcblxuY29uc3QgZGV0ZXJtaW5lVHJhbnNwb3J0ID0gZnVuY3Rpb24gKHRyYW5zcG9ydHMsIHVybCkge1xuICBjb25zdCBwYXJzZWRVcmwgPSBuZXcgVVJMKHVybClcbiAgY29uc3Qgc2NoZW1lID0gcGFyc2VkVXJsLnByb3RvY29sLnJlcGxhY2UoJzonLCAnJylcblxuICBmb3IgKGxldCB0cmFuc3BvcnQgb2YgdHJhbnNwb3J0cykge1xuICAgIGlmICh0cmFuc3BvcnQuc2NoZW1lcy5pbmNsdWRlcyhzY2hlbWUpKSB7XG4gICAgICByZXR1cm4gdHJhbnNwb3J0XG4gICAgfVxuICB9XG5cbiAgdGhyb3cgRXJyb3IoYFVuc3VwcG9ydGVkIHNjaGVtZSBpbiBVUkw6ICR7dXJsfWApXG59XG5cbmNvbnN0IG5lZ290aWF0ZURlY29kZXIgPSBmdW5jdGlvbiAoZGVjb2RlcnMsIGNvbnRlbnRUeXBlKSB7XG4gIGlmIChjb250ZW50VHlwZSA9PT0gdW5kZWZpbmVkIHx8IGNvbnRlbnRUeXBlID09PSBudWxsKSB7XG4gICAgcmV0dXJuIGRlY29kZXJzWzJdXG4gIH1cblxuICBjb25zdCBmdWxsVHlwZSA9IGNvbnRlbnRUeXBlLnRvTG93ZXJDYXNlKCkuc3BsaXQoJzsnKVswXS50cmltKClcbiAgY29uc3QgbWFpblR5cGUgPSBmdWxsVHlwZS5zcGxpdCgnLycpWzBdICsgJy8qJ1xuICBjb25zdCB3aWxkY2FyZFR5cGUgPSAnKi8qJ1xuICBjb25zdCBhY2NlcHRhYmxlVHlwZXMgPSBbZnVsbFR5cGUsIG1haW5UeXBlLCB3aWxkY2FyZFR5cGVdXG5cbiAgZm9yIChsZXQgZGVjb2RlciBvZiBkZWNvZGVycykge1xuICAgIGlmIChhY2NlcHRhYmxlVHlwZXMuaW5jbHVkZXMoZGVjb2Rlci5tZWRpYVR5cGUpKSB7XG4gICAgICByZXR1cm4gZGVjb2RlclxuICAgIH1cbiAgfVxuXG4gIHRocm93IEVycm9yKGBVbnN1cHBvcnRlZCBtZWRpYSBpbiBDb250ZW50LVR5cGUgaGVhZGVyOiAke2NvbnRlbnRUeXBlfWApXG59XG5cbmNvbnN0IGNzcmZTYWZlTWV0aG9kID0gZnVuY3Rpb24gKG1ldGhvZCkge1xuICAvLyB0aGVzZSBIVFRQIG1ldGhvZHMgZG8gbm90IHJlcXVpcmUgQ1NSRiBwcm90ZWN0aW9uXG4gIHJldHVybiAoL14oR0VUfEhFQUR8T1BUSU9OU3xUUkFDRSkkLy50ZXN0KG1ldGhvZCkpXG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBkZXRlcm1pbmVUcmFuc3BvcnQ6IGRldGVybWluZVRyYW5zcG9ydCxcbiAgbmVnb3RpYXRlRGVjb2RlcjogbmVnb3RpYXRlRGVjb2RlcixcbiAgY3NyZlNhZmVNZXRob2Q6IGNzcmZTYWZlTWV0aG9kXG59XG4iLCIvLyB0aGUgd2hhdHdnLWZldGNoIHBvbHlmaWxsIGluc3RhbGxzIHRoZSBmZXRjaCgpIGZ1bmN0aW9uXG4vLyBvbiB0aGUgZ2xvYmFsIG9iamVjdCAod2luZG93IG9yIHNlbGYpXG4vL1xuLy8gUmV0dXJuIHRoYXQgYXMgdGhlIGV4cG9ydCBmb3IgdXNlIGluIFdlYnBhY2ssIEJyb3dzZXJpZnkgZXRjLlxucmVxdWlyZSgnd2hhdHdnLWZldGNoJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHNlbGYuZmV0Y2guYmluZChzZWxmKTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGhhcyA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogRGVjb2RlIGEgVVJJIGVuY29kZWQgc3RyaW5nLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBpbnB1dCBUaGUgVVJJIGVuY29kZWQgc3RyaW5nLlxuICogQHJldHVybnMge1N0cmluZ30gVGhlIGRlY29kZWQgc3RyaW5nLlxuICogQGFwaSBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIGRlY29kZShpbnB1dCkge1xuICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KGlucHV0LnJlcGxhY2UoL1xcKy9nLCAnICcpKTtcbn1cblxuLyoqXG4gKiBTaW1wbGUgcXVlcnkgc3RyaW5nIHBhcnNlci5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gcXVlcnkgVGhlIHF1ZXJ5IHN0cmluZyB0aGF0IG5lZWRzIHRvIGJlIHBhcnNlZC5cbiAqIEByZXR1cm5zIHtPYmplY3R9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5mdW5jdGlvbiBxdWVyeXN0cmluZyhxdWVyeSkge1xuICB2YXIgcGFyc2VyID0gLyhbXj0/Jl0rKT0/KFteJl0qKS9nXG4gICAgLCByZXN1bHQgPSB7fVxuICAgICwgcGFydDtcblxuICAvL1xuICAvLyBMaXR0bGUgbmlmdHkgcGFyc2luZyBoYWNrLCBsZXZlcmFnZSB0aGUgZmFjdCB0aGF0IFJlZ0V4cC5leGVjIGluY3JlbWVudHNcbiAgLy8gdGhlIGxhc3RJbmRleCBwcm9wZXJ0eSBzbyB3ZSBjYW4gY29udGludWUgZXhlY3V0aW5nIHRoaXMgbG9vcCB1bnRpbCB3ZSd2ZVxuICAvLyBwYXJzZWQgYWxsIHJlc3VsdHMuXG4gIC8vXG4gIGZvciAoO1xuICAgIHBhcnQgPSBwYXJzZXIuZXhlYyhxdWVyeSk7XG4gICAgcmVzdWx0W2RlY29kZShwYXJ0WzFdKV0gPSBkZWNvZGUocGFydFsyXSlcbiAgKTtcblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIFRyYW5zZm9ybSBhIHF1ZXJ5IHN0cmluZyB0byBhbiBvYmplY3QuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9iaiBPYmplY3QgdGhhdCBzaG91bGQgYmUgdHJhbnNmb3JtZWQuXG4gKiBAcGFyYW0ge1N0cmluZ30gcHJlZml4IE9wdGlvbmFsIHByZWZpeC5cbiAqIEByZXR1cm5zIHtTdHJpbmd9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5mdW5jdGlvbiBxdWVyeXN0cmluZ2lmeShvYmosIHByZWZpeCkge1xuICBwcmVmaXggPSBwcmVmaXggfHwgJyc7XG5cbiAgdmFyIHBhaXJzID0gW107XG5cbiAgLy9cbiAgLy8gT3B0aW9uYWxseSBwcmVmaXggd2l0aCBhICc/JyBpZiBuZWVkZWRcbiAgLy9cbiAgaWYgKCdzdHJpbmcnICE9PSB0eXBlb2YgcHJlZml4KSBwcmVmaXggPSAnPyc7XG5cbiAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgIGlmIChoYXMuY2FsbChvYmosIGtleSkpIHtcbiAgICAgIHBhaXJzLnB1c2goZW5jb2RlVVJJQ29tcG9uZW50KGtleSkgKyc9JysgZW5jb2RlVVJJQ29tcG9uZW50KG9ialtrZXldKSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHBhaXJzLmxlbmd0aCA/IHByZWZpeCArIHBhaXJzLmpvaW4oJyYnKSA6ICcnO1xufVxuXG4vL1xuLy8gRXhwb3NlIHRoZSBtb2R1bGUuXG4vL1xuZXhwb3J0cy5zdHJpbmdpZnkgPSBxdWVyeXN0cmluZ2lmeTtcbmV4cG9ydHMucGFyc2UgPSBxdWVyeXN0cmluZztcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBDaGVjayBpZiB3ZSdyZSByZXF1aXJlZCB0byBhZGQgYSBwb3J0IG51bWJlci5cbiAqXG4gKiBAc2VlIGh0dHBzOi8vdXJsLnNwZWMud2hhdHdnLm9yZy8jZGVmYXVsdC1wb3J0XG4gKiBAcGFyYW0ge051bWJlcnxTdHJpbmd9IHBvcnQgUG9ydCBudW1iZXIgd2UgbmVlZCB0byBjaGVja1xuICogQHBhcmFtIHtTdHJpbmd9IHByb3RvY29sIFByb3RvY29sIHdlIG5lZWQgdG8gY2hlY2sgYWdhaW5zdC5cbiAqIEByZXR1cm5zIHtCb29sZWFufSBJcyBpdCBhIGRlZmF1bHQgcG9ydCBmb3IgdGhlIGdpdmVuIHByb3RvY29sXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiByZXF1aXJlZChwb3J0LCBwcm90b2NvbCkge1xuICBwcm90b2NvbCA9IHByb3RvY29sLnNwbGl0KCc6JylbMF07XG4gIHBvcnQgPSArcG9ydDtcblxuICBpZiAoIXBvcnQpIHJldHVybiBmYWxzZTtcblxuICBzd2l0Y2ggKHByb3RvY29sKSB7XG4gICAgY2FzZSAnaHR0cCc6XG4gICAgY2FzZSAnd3MnOlxuICAgIHJldHVybiBwb3J0ICE9PSA4MDtcblxuICAgIGNhc2UgJ2h0dHBzJzpcbiAgICBjYXNlICd3c3MnOlxuICAgIHJldHVybiBwb3J0ICE9PSA0NDM7XG5cbiAgICBjYXNlICdmdHAnOlxuICAgIHJldHVybiBwb3J0ICE9PSAyMTtcblxuICAgIGNhc2UgJ2dvcGhlcic6XG4gICAgcmV0dXJuIHBvcnQgIT09IDcwO1xuXG4gICAgY2FzZSAnZmlsZSc6XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHBvcnQgIT09IDA7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgcmVxdWlyZWQgPSByZXF1aXJlKCdyZXF1aXJlcy1wb3J0JylcbiAgLCBxcyA9IHJlcXVpcmUoJ3F1ZXJ5c3RyaW5naWZ5JylcbiAgLCBwcm90b2NvbHJlID0gL14oW2Etel1bYS16MC05ListXSo6KT8oXFwvXFwvKT8oW1xcU1xcc10qKS9pXG4gICwgc2xhc2hlcyA9IC9eW0EtWmEtel1bQS1aYS16MC05Ky0uXSo6XFwvXFwvLztcblxuLyoqXG4gKiBUaGVzZSBhcmUgdGhlIHBhcnNlIHJ1bGVzIGZvciB0aGUgVVJMIHBhcnNlciwgaXQgaW5mb3JtcyB0aGUgcGFyc2VyXG4gKiBhYm91dDpcbiAqXG4gKiAwLiBUaGUgY2hhciBpdCBOZWVkcyB0byBwYXJzZSwgaWYgaXQncyBhIHN0cmluZyBpdCBzaG91bGQgYmUgZG9uZSB1c2luZ1xuICogICAgaW5kZXhPZiwgUmVnRXhwIHVzaW5nIGV4ZWMgYW5kIE5hTiBtZWFucyBzZXQgYXMgY3VycmVudCB2YWx1ZS5cbiAqIDEuIFRoZSBwcm9wZXJ0eSB3ZSBzaG91bGQgc2V0IHdoZW4gcGFyc2luZyB0aGlzIHZhbHVlLlxuICogMi4gSW5kaWNhdGlvbiBpZiBpdCdzIGJhY2t3YXJkcyBvciBmb3J3YXJkIHBhcnNpbmcsIHdoZW4gc2V0IGFzIG51bWJlciBpdCdzXG4gKiAgICB0aGUgdmFsdWUgb2YgZXh0cmEgY2hhcnMgdGhhdCBzaG91bGQgYmUgc3BsaXQgb2ZmLlxuICogMy4gSW5oZXJpdCBmcm9tIGxvY2F0aW9uIGlmIG5vbiBleGlzdGluZyBpbiB0aGUgcGFyc2VyLlxuICogNC4gYHRvTG93ZXJDYXNlYCB0aGUgcmVzdWx0aW5nIHZhbHVlLlxuICovXG52YXIgcnVsZXMgPSBbXG4gIFsnIycsICdoYXNoJ10sICAgICAgICAgICAgICAgICAgICAgICAgLy8gRXh0cmFjdCBmcm9tIHRoZSBiYWNrLlxuICBbJz8nLCAncXVlcnknXSwgICAgICAgICAgICAgICAgICAgICAgIC8vIEV4dHJhY3QgZnJvbSB0aGUgYmFjay5cbiAgWycvJywgJ3BhdGhuYW1lJ10sICAgICAgICAgICAgICAgICAgICAvLyBFeHRyYWN0IGZyb20gdGhlIGJhY2suXG4gIFsnQCcsICdhdXRoJywgMV0sICAgICAgICAgICAgICAgICAgICAgLy8gRXh0cmFjdCBmcm9tIHRoZSBmcm9udC5cbiAgW05hTiwgJ2hvc3QnLCB1bmRlZmluZWQsIDEsIDFdLCAgICAgICAvLyBTZXQgbGVmdCBvdmVyIHZhbHVlLlxuICBbLzooXFxkKykkLywgJ3BvcnQnLCB1bmRlZmluZWQsIDFdLCAgICAvLyBSZWdFeHAgdGhlIGJhY2suXG4gIFtOYU4sICdob3N0bmFtZScsIHVuZGVmaW5lZCwgMSwgMV0gICAgLy8gU2V0IGxlZnQgb3Zlci5cbl07XG5cbi8qKlxuICogVGhlc2UgcHJvcGVydGllcyBzaG91bGQgbm90IGJlIGNvcGllZCBvciBpbmhlcml0ZWQgZnJvbS4gVGhpcyBpcyBvbmx5IG5lZWRlZFxuICogZm9yIGFsbCBub24gYmxvYiBVUkwncyBhcyBhIGJsb2IgVVJMIGRvZXMgbm90IGluY2x1ZGUgYSBoYXNoLCBvbmx5IHRoZVxuICogb3JpZ2luLlxuICpcbiAqIEB0eXBlIHtPYmplY3R9XG4gKiBAcHJpdmF0ZVxuICovXG52YXIgaWdub3JlID0geyBoYXNoOiAxLCBxdWVyeTogMSB9O1xuXG4vKipcbiAqIFRoZSBsb2NhdGlvbiBvYmplY3QgZGlmZmVycyB3aGVuIHlvdXIgY29kZSBpcyBsb2FkZWQgdGhyb3VnaCBhIG5vcm1hbCBwYWdlLFxuICogV29ya2VyIG9yIHRocm91Z2ggYSB3b3JrZXIgdXNpbmcgYSBibG9iLiBBbmQgd2l0aCB0aGUgYmxvYmJsZSBiZWdpbnMgdGhlXG4gKiB0cm91YmxlIGFzIHRoZSBsb2NhdGlvbiBvYmplY3Qgd2lsbCBjb250YWluIHRoZSBVUkwgb2YgdGhlIGJsb2IsIG5vdCB0aGVcbiAqIGxvY2F0aW9uIG9mIHRoZSBwYWdlIHdoZXJlIG91ciBjb2RlIGlzIGxvYWRlZCBpbi4gVGhlIGFjdHVhbCBvcmlnaW4gaXNcbiAqIGVuY29kZWQgaW4gdGhlIGBwYXRobmFtZWAgc28gd2UgY2FuIHRoYW5rZnVsbHkgZ2VuZXJhdGUgYSBnb29kIFwiZGVmYXVsdFwiXG4gKiBsb2NhdGlvbiBmcm9tIGl0IHNvIHdlIGNhbiBnZW5lcmF0ZSBwcm9wZXIgcmVsYXRpdmUgVVJMJ3MgYWdhaW4uXG4gKlxuICogQHBhcmFtIHtPYmplY3R8U3RyaW5nfSBsb2MgT3B0aW9uYWwgZGVmYXVsdCBsb2NhdGlvbiBvYmplY3QuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBsb2xjYXRpb24gb2JqZWN0LlxuICogQGFwaSBwdWJsaWNcbiAqL1xuZnVuY3Rpb24gbG9sY2F0aW9uKGxvYykge1xuICBsb2MgPSBsb2MgfHwgZ2xvYmFsLmxvY2F0aW9uIHx8IHt9O1xuXG4gIHZhciBmaW5hbGRlc3RpbmF0aW9uID0ge31cbiAgICAsIHR5cGUgPSB0eXBlb2YgbG9jXG4gICAgLCBrZXk7XG5cbiAgaWYgKCdibG9iOicgPT09IGxvYy5wcm90b2NvbCkge1xuICAgIGZpbmFsZGVzdGluYXRpb24gPSBuZXcgVVJMKHVuZXNjYXBlKGxvYy5wYXRobmFtZSksIHt9KTtcbiAgfSBlbHNlIGlmICgnc3RyaW5nJyA9PT0gdHlwZSkge1xuICAgIGZpbmFsZGVzdGluYXRpb24gPSBuZXcgVVJMKGxvYywge30pO1xuICAgIGZvciAoa2V5IGluIGlnbm9yZSkgZGVsZXRlIGZpbmFsZGVzdGluYXRpb25ba2V5XTtcbiAgfSBlbHNlIGlmICgnb2JqZWN0JyA9PT0gdHlwZSkge1xuICAgIGZvciAoa2V5IGluIGxvYykge1xuICAgICAgaWYgKGtleSBpbiBpZ25vcmUpIGNvbnRpbnVlO1xuICAgICAgZmluYWxkZXN0aW5hdGlvbltrZXldID0gbG9jW2tleV07XG4gICAgfVxuXG4gICAgaWYgKGZpbmFsZGVzdGluYXRpb24uc2xhc2hlcyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBmaW5hbGRlc3RpbmF0aW9uLnNsYXNoZXMgPSBzbGFzaGVzLnRlc3QobG9jLmhyZWYpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmaW5hbGRlc3RpbmF0aW9uO1xufVxuXG4vKipcbiAqIEB0eXBlZGVmIFByb3RvY29sRXh0cmFjdFxuICogQHR5cGUgT2JqZWN0XG4gKiBAcHJvcGVydHkge1N0cmluZ30gcHJvdG9jb2wgUHJvdG9jb2wgbWF0Y2hlZCBpbiB0aGUgVVJMLCBpbiBsb3dlcmNhc2UuXG4gKiBAcHJvcGVydHkge0Jvb2xlYW59IHNsYXNoZXMgYHRydWVgIGlmIHByb3RvY29sIGlzIGZvbGxvd2VkIGJ5IFwiLy9cIiwgZWxzZSBgZmFsc2VgLlxuICogQHByb3BlcnR5IHtTdHJpbmd9IHJlc3QgUmVzdCBvZiB0aGUgVVJMIHRoYXQgaXMgbm90IHBhcnQgb2YgdGhlIHByb3RvY29sLlxuICovXG5cbi8qKlxuICogRXh0cmFjdCBwcm90b2NvbCBpbmZvcm1hdGlvbiBmcm9tIGEgVVJMIHdpdGgvd2l0aG91dCBkb3VibGUgc2xhc2ggKFwiLy9cIikuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGFkZHJlc3MgVVJMIHdlIHdhbnQgdG8gZXh0cmFjdCBmcm9tLlxuICogQHJldHVybiB7UHJvdG9jb2xFeHRyYWN0fSBFeHRyYWN0ZWQgaW5mb3JtYXRpb24uXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gZXh0cmFjdFByb3RvY29sKGFkZHJlc3MpIHtcbiAgdmFyIG1hdGNoID0gcHJvdG9jb2xyZS5leGVjKGFkZHJlc3MpO1xuXG4gIHJldHVybiB7XG4gICAgcHJvdG9jb2w6IG1hdGNoWzFdID8gbWF0Y2hbMV0udG9Mb3dlckNhc2UoKSA6ICcnLFxuICAgIHNsYXNoZXM6ICEhbWF0Y2hbMl0sXG4gICAgcmVzdDogbWF0Y2hbM11cbiAgfTtcbn1cblxuLyoqXG4gKiBSZXNvbHZlIGEgcmVsYXRpdmUgVVJMIHBhdGhuYW1lIGFnYWluc3QgYSBiYXNlIFVSTCBwYXRobmFtZS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gcmVsYXRpdmUgUGF0aG5hbWUgb2YgdGhlIHJlbGF0aXZlIFVSTC5cbiAqIEBwYXJhbSB7U3RyaW5nfSBiYXNlIFBhdGhuYW1lIG9mIHRoZSBiYXNlIFVSTC5cbiAqIEByZXR1cm4ge1N0cmluZ30gUmVzb2x2ZWQgcGF0aG5hbWUuXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gcmVzb2x2ZShyZWxhdGl2ZSwgYmFzZSkge1xuICB2YXIgcGF0aCA9IChiYXNlIHx8ICcvJykuc3BsaXQoJy8nKS5zbGljZSgwLCAtMSkuY29uY2F0KHJlbGF0aXZlLnNwbGl0KCcvJykpXG4gICAgLCBpID0gcGF0aC5sZW5ndGhcbiAgICAsIGxhc3QgPSBwYXRoW2kgLSAxXVxuICAgICwgdW5zaGlmdCA9IGZhbHNlXG4gICAgLCB1cCA9IDA7XG5cbiAgd2hpbGUgKGktLSkge1xuICAgIGlmIChwYXRoW2ldID09PSAnLicpIHtcbiAgICAgIHBhdGguc3BsaWNlKGksIDEpO1xuICAgIH0gZWxzZSBpZiAocGF0aFtpXSA9PT0gJy4uJykge1xuICAgICAgcGF0aC5zcGxpY2UoaSwgMSk7XG4gICAgICB1cCsrO1xuICAgIH0gZWxzZSBpZiAodXApIHtcbiAgICAgIGlmIChpID09PSAwKSB1bnNoaWZ0ID0gdHJ1ZTtcbiAgICAgIHBhdGguc3BsaWNlKGksIDEpO1xuICAgICAgdXAtLTtcbiAgICB9XG4gIH1cblxuICBpZiAodW5zaGlmdCkgcGF0aC51bnNoaWZ0KCcnKTtcbiAgaWYgKGxhc3QgPT09ICcuJyB8fCBsYXN0ID09PSAnLi4nKSBwYXRoLnB1c2goJycpO1xuXG4gIHJldHVybiBwYXRoLmpvaW4oJy8nKTtcbn1cblxuLyoqXG4gKiBUaGUgYWN0dWFsIFVSTCBpbnN0YW5jZS4gSW5zdGVhZCBvZiByZXR1cm5pbmcgYW4gb2JqZWN0IHdlJ3ZlIG9wdGVkLWluIHRvXG4gKiBjcmVhdGUgYW4gYWN0dWFsIGNvbnN0cnVjdG9yIGFzIGl0J3MgbXVjaCBtb3JlIG1lbW9yeSBlZmZpY2llbnQgYW5kXG4gKiBmYXN0ZXIgYW5kIGl0IHBsZWFzZXMgbXkgT0NELlxuICpcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtTdHJpbmd9IGFkZHJlc3MgVVJMIHdlIHdhbnQgdG8gcGFyc2UuXG4gKiBAcGFyYW0ge09iamVjdHxTdHJpbmd9IGxvY2F0aW9uIExvY2F0aW9uIGRlZmF1bHRzIGZvciByZWxhdGl2ZSBwYXRocy5cbiAqIEBwYXJhbSB7Qm9vbGVhbnxGdW5jdGlvbn0gcGFyc2VyIFBhcnNlciBmb3IgdGhlIHF1ZXJ5IHN0cmluZy5cbiAqIEBhcGkgcHVibGljXG4gKi9cbmZ1bmN0aW9uIFVSTChhZGRyZXNzLCBsb2NhdGlvbiwgcGFyc2VyKSB7XG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBVUkwpKSB7XG4gICAgcmV0dXJuIG5ldyBVUkwoYWRkcmVzcywgbG9jYXRpb24sIHBhcnNlcik7XG4gIH1cblxuICB2YXIgcmVsYXRpdmUsIGV4dHJhY3RlZCwgcGFyc2UsIGluc3RydWN0aW9uLCBpbmRleCwga2V5XG4gICAgLCBpbnN0cnVjdGlvbnMgPSBydWxlcy5zbGljZSgpXG4gICAgLCB0eXBlID0gdHlwZW9mIGxvY2F0aW9uXG4gICAgLCB1cmwgPSB0aGlzXG4gICAgLCBpID0gMDtcblxuICAvL1xuICAvLyBUaGUgZm9sbG93aW5nIGlmIHN0YXRlbWVudHMgYWxsb3dzIHRoaXMgbW9kdWxlIHR3byBoYXZlIGNvbXBhdGliaWxpdHkgd2l0aFxuICAvLyAyIGRpZmZlcmVudCBBUEk6XG4gIC8vXG4gIC8vIDEuIE5vZGUuanMncyBgdXJsLnBhcnNlYCBhcGkgd2hpY2ggYWNjZXB0cyBhIFVSTCwgYm9vbGVhbiBhcyBhcmd1bWVudHNcbiAgLy8gICAgd2hlcmUgdGhlIGJvb2xlYW4gaW5kaWNhdGVzIHRoYXQgdGhlIHF1ZXJ5IHN0cmluZyBzaG91bGQgYWxzbyBiZSBwYXJzZWQuXG4gIC8vXG4gIC8vIDIuIFRoZSBgVVJMYCBpbnRlcmZhY2Ugb2YgdGhlIGJyb3dzZXIgd2hpY2ggYWNjZXB0cyBhIFVSTCwgb2JqZWN0IGFzXG4gIC8vICAgIGFyZ3VtZW50cy4gVGhlIHN1cHBsaWVkIG9iamVjdCB3aWxsIGJlIHVzZWQgYXMgZGVmYXVsdCB2YWx1ZXMgLyBmYWxsLWJhY2tcbiAgLy8gICAgZm9yIHJlbGF0aXZlIHBhdGhzLlxuICAvL1xuICBpZiAoJ29iamVjdCcgIT09IHR5cGUgJiYgJ3N0cmluZycgIT09IHR5cGUpIHtcbiAgICBwYXJzZXIgPSBsb2NhdGlvbjtcbiAgICBsb2NhdGlvbiA9IG51bGw7XG4gIH1cblxuICBpZiAocGFyc2VyICYmICdmdW5jdGlvbicgIT09IHR5cGVvZiBwYXJzZXIpIHBhcnNlciA9IHFzLnBhcnNlO1xuXG4gIGxvY2F0aW9uID0gbG9sY2F0aW9uKGxvY2F0aW9uKTtcblxuICAvL1xuICAvLyBFeHRyYWN0IHByb3RvY29sIGluZm9ybWF0aW9uIGJlZm9yZSBydW5uaW5nIHRoZSBpbnN0cnVjdGlvbnMuXG4gIC8vXG4gIGV4dHJhY3RlZCA9IGV4dHJhY3RQcm90b2NvbChhZGRyZXNzIHx8ICcnKTtcbiAgcmVsYXRpdmUgPSAhZXh0cmFjdGVkLnByb3RvY29sICYmICFleHRyYWN0ZWQuc2xhc2hlcztcbiAgdXJsLnNsYXNoZXMgPSBleHRyYWN0ZWQuc2xhc2hlcyB8fCByZWxhdGl2ZSAmJiBsb2NhdGlvbi5zbGFzaGVzO1xuICB1cmwucHJvdG9jb2wgPSBleHRyYWN0ZWQucHJvdG9jb2wgfHwgbG9jYXRpb24ucHJvdG9jb2wgfHwgJyc7XG4gIGFkZHJlc3MgPSBleHRyYWN0ZWQucmVzdDtcblxuICAvL1xuICAvLyBXaGVuIHRoZSBhdXRob3JpdHkgY29tcG9uZW50IGlzIGFic2VudCB0aGUgVVJMIHN0YXJ0cyB3aXRoIGEgcGF0aFxuICAvLyBjb21wb25lbnQuXG4gIC8vXG4gIGlmICghZXh0cmFjdGVkLnNsYXNoZXMpIGluc3RydWN0aW9uc1syXSA9IFsvKC4qKS8sICdwYXRobmFtZSddO1xuXG4gIGZvciAoOyBpIDwgaW5zdHJ1Y3Rpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgaW5zdHJ1Y3Rpb24gPSBpbnN0cnVjdGlvbnNbaV07XG4gICAgcGFyc2UgPSBpbnN0cnVjdGlvblswXTtcbiAgICBrZXkgPSBpbnN0cnVjdGlvblsxXTtcblxuICAgIGlmIChwYXJzZSAhPT0gcGFyc2UpIHtcbiAgICAgIHVybFtrZXldID0gYWRkcmVzcztcbiAgICB9IGVsc2UgaWYgKCdzdHJpbmcnID09PSB0eXBlb2YgcGFyc2UpIHtcbiAgICAgIGlmICh+KGluZGV4ID0gYWRkcmVzcy5pbmRleE9mKHBhcnNlKSkpIHtcbiAgICAgICAgaWYgKCdudW1iZXInID09PSB0eXBlb2YgaW5zdHJ1Y3Rpb25bMl0pIHtcbiAgICAgICAgICB1cmxba2V5XSA9IGFkZHJlc3Muc2xpY2UoMCwgaW5kZXgpO1xuICAgICAgICAgIGFkZHJlc3MgPSBhZGRyZXNzLnNsaWNlKGluZGV4ICsgaW5zdHJ1Y3Rpb25bMl0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHVybFtrZXldID0gYWRkcmVzcy5zbGljZShpbmRleCk7XG4gICAgICAgICAgYWRkcmVzcyA9IGFkZHJlc3Muc2xpY2UoMCwgaW5kZXgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICgoaW5kZXggPSBwYXJzZS5leGVjKGFkZHJlc3MpKSkge1xuICAgICAgdXJsW2tleV0gPSBpbmRleFsxXTtcbiAgICAgIGFkZHJlc3MgPSBhZGRyZXNzLnNsaWNlKDAsIGluZGV4LmluZGV4KTtcbiAgICB9XG5cbiAgICB1cmxba2V5XSA9IHVybFtrZXldIHx8IChcbiAgICAgIHJlbGF0aXZlICYmIGluc3RydWN0aW9uWzNdID8gbG9jYXRpb25ba2V5XSB8fCAnJyA6ICcnXG4gICAgKTtcblxuICAgIC8vXG4gICAgLy8gSG9zdG5hbWUsIGhvc3QgYW5kIHByb3RvY29sIHNob3VsZCBiZSBsb3dlcmNhc2VkIHNvIHRoZXkgY2FuIGJlIHVzZWQgdG9cbiAgICAvLyBjcmVhdGUgYSBwcm9wZXIgYG9yaWdpbmAuXG4gICAgLy9cbiAgICBpZiAoaW5zdHJ1Y3Rpb25bNF0pIHVybFtrZXldID0gdXJsW2tleV0udG9Mb3dlckNhc2UoKTtcbiAgfVxuXG4gIC8vXG4gIC8vIEFsc28gcGFyc2UgdGhlIHN1cHBsaWVkIHF1ZXJ5IHN0cmluZyBpbiB0byBhbiBvYmplY3QuIElmIHdlJ3JlIHN1cHBsaWVkXG4gIC8vIHdpdGggYSBjdXN0b20gcGFyc2VyIGFzIGZ1bmN0aW9uIHVzZSB0aGF0IGluc3RlYWQgb2YgdGhlIGRlZmF1bHQgYnVpbGQtaW5cbiAgLy8gcGFyc2VyLlxuICAvL1xuICBpZiAocGFyc2VyKSB1cmwucXVlcnkgPSBwYXJzZXIodXJsLnF1ZXJ5KTtcblxuICAvL1xuICAvLyBJZiB0aGUgVVJMIGlzIHJlbGF0aXZlLCByZXNvbHZlIHRoZSBwYXRobmFtZSBhZ2FpbnN0IHRoZSBiYXNlIFVSTC5cbiAgLy9cbiAgaWYgKFxuICAgICAgcmVsYXRpdmVcbiAgICAmJiBsb2NhdGlvbi5zbGFzaGVzXG4gICAgJiYgdXJsLnBhdGhuYW1lLmNoYXJBdCgwKSAhPT0gJy8nXG4gICAgJiYgKHVybC5wYXRobmFtZSAhPT0gJycgfHwgbG9jYXRpb24ucGF0aG5hbWUgIT09ICcnKVxuICApIHtcbiAgICB1cmwucGF0aG5hbWUgPSByZXNvbHZlKHVybC5wYXRobmFtZSwgbG9jYXRpb24ucGF0aG5hbWUpO1xuICB9XG5cbiAgLy9cbiAgLy8gV2Ugc2hvdWxkIG5vdCBhZGQgcG9ydCBudW1iZXJzIGlmIHRoZXkgYXJlIGFscmVhZHkgdGhlIGRlZmF1bHQgcG9ydCBudW1iZXJcbiAgLy8gZm9yIGEgZ2l2ZW4gcHJvdG9jb2wuIEFzIHRoZSBob3N0IGFsc28gY29udGFpbnMgdGhlIHBvcnQgbnVtYmVyIHdlJ3JlIGdvaW5nXG4gIC8vIG92ZXJyaWRlIGl0IHdpdGggdGhlIGhvc3RuYW1lIHdoaWNoIGNvbnRhaW5zIG5vIHBvcnQgbnVtYmVyLlxuICAvL1xuICBpZiAoIXJlcXVpcmVkKHVybC5wb3J0LCB1cmwucHJvdG9jb2wpKSB7XG4gICAgdXJsLmhvc3QgPSB1cmwuaG9zdG5hbWU7XG4gICAgdXJsLnBvcnQgPSAnJztcbiAgfVxuXG4gIC8vXG4gIC8vIFBhcnNlIGRvd24gdGhlIGBhdXRoYCBmb3IgdGhlIHVzZXJuYW1lIGFuZCBwYXNzd29yZC5cbiAgLy9cbiAgdXJsLnVzZXJuYW1lID0gdXJsLnBhc3N3b3JkID0gJyc7XG4gIGlmICh1cmwuYXV0aCkge1xuICAgIGluc3RydWN0aW9uID0gdXJsLmF1dGguc3BsaXQoJzonKTtcbiAgICB1cmwudXNlcm5hbWUgPSBpbnN0cnVjdGlvblswXSB8fCAnJztcbiAgICB1cmwucGFzc3dvcmQgPSBpbnN0cnVjdGlvblsxXSB8fCAnJztcbiAgfVxuXG4gIHVybC5vcmlnaW4gPSB1cmwucHJvdG9jb2wgJiYgdXJsLmhvc3QgJiYgdXJsLnByb3RvY29sICE9PSAnZmlsZTonXG4gICAgPyB1cmwucHJvdG9jb2wgKycvLycrIHVybC5ob3N0XG4gICAgOiAnbnVsbCc7XG5cbiAgLy9cbiAgLy8gVGhlIGhyZWYgaXMganVzdCB0aGUgY29tcGlsZWQgcmVzdWx0LlxuICAvL1xuICB1cmwuaHJlZiA9IHVybC50b1N0cmluZygpO1xufVxuXG4vKipcbiAqIFRoaXMgaXMgY29udmVuaWVuY2UgbWV0aG9kIGZvciBjaGFuZ2luZyBwcm9wZXJ0aWVzIGluIHRoZSBVUkwgaW5zdGFuY2UgdG9cbiAqIGluc3VyZSB0aGF0IHRoZXkgYWxsIHByb3BhZ2F0ZSBjb3JyZWN0bHkuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHBhcnQgICAgICAgICAgUHJvcGVydHkgd2UgbmVlZCB0byBhZGp1c3QuXG4gKiBAcGFyYW0ge01peGVkfSB2YWx1ZSAgICAgICAgICBUaGUgbmV3bHkgYXNzaWduZWQgdmFsdWUuXG4gKiBAcGFyYW0ge0Jvb2xlYW58RnVuY3Rpb259IGZuICBXaGVuIHNldHRpbmcgdGhlIHF1ZXJ5LCBpdCB3aWxsIGJlIHRoZSBmdW5jdGlvblxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlZCB0byBwYXJzZSB0aGUgcXVlcnkuXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBXaGVuIHNldHRpbmcgdGhlIHByb3RvY29sLCBkb3VibGUgc2xhc2ggd2lsbCBiZVxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVtb3ZlZCBmcm9tIHRoZSBmaW5hbCB1cmwgaWYgaXQgaXMgdHJ1ZS5cbiAqIEByZXR1cm5zIHtVUkx9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5mdW5jdGlvbiBzZXQocGFydCwgdmFsdWUsIGZuKSB7XG4gIHZhciB1cmwgPSB0aGlzO1xuXG4gIHN3aXRjaCAocGFydCkge1xuICAgIGNhc2UgJ3F1ZXJ5JzpcbiAgICAgIGlmICgnc3RyaW5nJyA9PT0gdHlwZW9mIHZhbHVlICYmIHZhbHVlLmxlbmd0aCkge1xuICAgICAgICB2YWx1ZSA9IChmbiB8fCBxcy5wYXJzZSkodmFsdWUpO1xuICAgICAgfVxuXG4gICAgICB1cmxbcGFydF0gPSB2YWx1ZTtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSAncG9ydCc6XG4gICAgICB1cmxbcGFydF0gPSB2YWx1ZTtcblxuICAgICAgaWYgKCFyZXF1aXJlZCh2YWx1ZSwgdXJsLnByb3RvY29sKSkge1xuICAgICAgICB1cmwuaG9zdCA9IHVybC5ob3N0bmFtZTtcbiAgICAgICAgdXJsW3BhcnRdID0gJyc7XG4gICAgICB9IGVsc2UgaWYgKHZhbHVlKSB7XG4gICAgICAgIHVybC5ob3N0ID0gdXJsLmhvc3RuYW1lICsnOicrIHZhbHVlO1xuICAgICAgfVxuXG4gICAgICBicmVhaztcblxuICAgIGNhc2UgJ2hvc3RuYW1lJzpcbiAgICAgIHVybFtwYXJ0XSA9IHZhbHVlO1xuXG4gICAgICBpZiAodXJsLnBvcnQpIHZhbHVlICs9ICc6JysgdXJsLnBvcnQ7XG4gICAgICB1cmwuaG9zdCA9IHZhbHVlO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlICdob3N0JzpcbiAgICAgIHVybFtwYXJ0XSA9IHZhbHVlO1xuXG4gICAgICBpZiAoLzpcXGQrJC8udGVzdCh2YWx1ZSkpIHtcbiAgICAgICAgdmFsdWUgPSB2YWx1ZS5zcGxpdCgnOicpO1xuICAgICAgICB1cmwucG9ydCA9IHZhbHVlLnBvcCgpO1xuICAgICAgICB1cmwuaG9zdG5hbWUgPSB2YWx1ZS5qb2luKCc6Jyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB1cmwuaG9zdG5hbWUgPSB2YWx1ZTtcbiAgICAgICAgdXJsLnBvcnQgPSAnJztcbiAgICAgIH1cblxuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlICdwcm90b2NvbCc6XG4gICAgICB1cmwucHJvdG9jb2wgPSB2YWx1ZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgdXJsLnNsYXNoZXMgPSAhZm47XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgJ3BhdGhuYW1lJzpcbiAgICAgIHVybC5wYXRobmFtZSA9IHZhbHVlLmxlbmd0aCAmJiB2YWx1ZS5jaGFyQXQoMCkgIT09ICcvJyA/ICcvJyArIHZhbHVlIDogdmFsdWU7XG5cbiAgICAgIGJyZWFrO1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIHVybFtwYXJ0XSA9IHZhbHVlO1xuICB9XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBydWxlcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBpbnMgPSBydWxlc1tpXTtcblxuICAgIGlmIChpbnNbNF0pIHVybFtpbnNbMV1dID0gdXJsW2luc1sxXV0udG9Mb3dlckNhc2UoKTtcbiAgfVxuXG4gIHVybC5vcmlnaW4gPSB1cmwucHJvdG9jb2wgJiYgdXJsLmhvc3QgJiYgdXJsLnByb3RvY29sICE9PSAnZmlsZTonXG4gICAgPyB1cmwucHJvdG9jb2wgKycvLycrIHVybC5ob3N0XG4gICAgOiAnbnVsbCc7XG5cbiAgdXJsLmhyZWYgPSB1cmwudG9TdHJpbmcoKTtcblxuICByZXR1cm4gdXJsO1xufVxuXG4vKipcbiAqIFRyYW5zZm9ybSB0aGUgcHJvcGVydGllcyBiYWNrIGluIHRvIGEgdmFsaWQgYW5kIGZ1bGwgVVJMIHN0cmluZy5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBzdHJpbmdpZnkgT3B0aW9uYWwgcXVlcnkgc3RyaW5naWZ5IGZ1bmN0aW9uLlxuICogQHJldHVybnMge1N0cmluZ31cbiAqIEBhcGkgcHVibGljXG4gKi9cbmZ1bmN0aW9uIHRvU3RyaW5nKHN0cmluZ2lmeSkge1xuICBpZiAoIXN0cmluZ2lmeSB8fCAnZnVuY3Rpb24nICE9PSB0eXBlb2Ygc3RyaW5naWZ5KSBzdHJpbmdpZnkgPSBxcy5zdHJpbmdpZnk7XG5cbiAgdmFyIHF1ZXJ5XG4gICAgLCB1cmwgPSB0aGlzXG4gICAgLCBwcm90b2NvbCA9IHVybC5wcm90b2NvbDtcblxuICBpZiAocHJvdG9jb2wgJiYgcHJvdG9jb2wuY2hhckF0KHByb3RvY29sLmxlbmd0aCAtIDEpICE9PSAnOicpIHByb3RvY29sICs9ICc6JztcblxuICB2YXIgcmVzdWx0ID0gcHJvdG9jb2wgKyAodXJsLnNsYXNoZXMgPyAnLy8nIDogJycpO1xuXG4gIGlmICh1cmwudXNlcm5hbWUpIHtcbiAgICByZXN1bHQgKz0gdXJsLnVzZXJuYW1lO1xuICAgIGlmICh1cmwucGFzc3dvcmQpIHJlc3VsdCArPSAnOicrIHVybC5wYXNzd29yZDtcbiAgICByZXN1bHQgKz0gJ0AnO1xuICB9XG5cbiAgcmVzdWx0ICs9IHVybC5ob3N0ICsgdXJsLnBhdGhuYW1lO1xuXG4gIHF1ZXJ5ID0gJ29iamVjdCcgPT09IHR5cGVvZiB1cmwucXVlcnkgPyBzdHJpbmdpZnkodXJsLnF1ZXJ5KSA6IHVybC5xdWVyeTtcbiAgaWYgKHF1ZXJ5KSByZXN1bHQgKz0gJz8nICE9PSBxdWVyeS5jaGFyQXQoMCkgPyAnPycrIHF1ZXJ5IDogcXVlcnk7XG5cbiAgaWYgKHVybC5oYXNoKSByZXN1bHQgKz0gdXJsLmhhc2g7XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuVVJMLnByb3RvdHlwZSA9IHsgc2V0OiBzZXQsIHRvU3RyaW5nOiB0b1N0cmluZyB9O1xuXG4vL1xuLy8gRXhwb3NlIHRoZSBVUkwgcGFyc2VyIGFuZCBzb21lIGFkZGl0aW9uYWwgcHJvcGVydGllcyB0aGF0IG1pZ2h0IGJlIHVzZWZ1bCBmb3Jcbi8vIG90aGVycyBvciB0ZXN0aW5nLlxuLy9cblVSTC5leHRyYWN0UHJvdG9jb2wgPSBleHRyYWN0UHJvdG9jb2w7XG5VUkwubG9jYXRpb24gPSBsb2xjYXRpb247XG5VUkwucXMgPSBxcztcblxubW9kdWxlLmV4cG9ydHMgPSBVUkw7XG4iLCIoZnVuY3Rpb24gKHJvb3QsIGZhY3RvcnkpIHtcbiAgICBpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIGRlZmluZShbXSwgZmFjdG9yeSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcm9vdC51cmx0ZW1wbGF0ZSA9IGZhY3RvcnkoKTtcbiAgICB9XG59KHRoaXMsIGZ1bmN0aW9uICgpIHtcbiAgLyoqXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKi9cbiAgZnVuY3Rpb24gVXJsVGVtcGxhdGUoKSB7XG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtzdHJpbmd9IHN0clxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBVcmxUZW1wbGF0ZS5wcm90b3R5cGUuZW5jb2RlUmVzZXJ2ZWQgPSBmdW5jdGlvbiAoc3RyKSB7XG4gICAgcmV0dXJuIHN0ci5zcGxpdCgvKCVbMC05QS1GYS1mXXsyfSkvZykubWFwKGZ1bmN0aW9uIChwYXJ0KSB7XG4gICAgICBpZiAoIS8lWzAtOUEtRmEtZl0vLnRlc3QocGFydCkpIHtcbiAgICAgICAgcGFydCA9IGVuY29kZVVSSShwYXJ0KS5yZXBsYWNlKC8lNUIvZywgJ1snKS5yZXBsYWNlKC8lNUQvZywgJ10nKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBwYXJ0O1xuICAgIH0pLmpvaW4oJycpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gc3RyXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIFVybFRlbXBsYXRlLnByb3RvdHlwZS5lbmNvZGVVbnJlc2VydmVkID0gZnVuY3Rpb24gKHN0cikge1xuICAgIHJldHVybiBlbmNvZGVVUklDb21wb25lbnQoc3RyKS5yZXBsYWNlKC9bIScoKSpdL2csIGZ1bmN0aW9uIChjKSB7XG4gICAgICByZXR1cm4gJyUnICsgYy5jaGFyQ29kZUF0KDApLnRvU3RyaW5nKDE2KS50b1VwcGVyQ2FzZSgpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBvcGVyYXRvclxuICAgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWVcbiAgICogQHBhcmFtIHtzdHJpbmd9IGtleVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBVcmxUZW1wbGF0ZS5wcm90b3R5cGUuZW5jb2RlVmFsdWUgPSBmdW5jdGlvbiAob3BlcmF0b3IsIHZhbHVlLCBrZXkpIHtcbiAgICB2YWx1ZSA9IChvcGVyYXRvciA9PT0gJysnIHx8IG9wZXJhdG9yID09PSAnIycpID8gdGhpcy5lbmNvZGVSZXNlcnZlZCh2YWx1ZSkgOiB0aGlzLmVuY29kZVVucmVzZXJ2ZWQodmFsdWUpO1xuXG4gICAgaWYgKGtleSkge1xuICAgICAgcmV0dXJuIHRoaXMuZW5jb2RlVW5yZXNlcnZlZChrZXkpICsgJz0nICsgdmFsdWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICovXG4gIFVybFRlbXBsYXRlLnByb3RvdHlwZS5pc0RlZmluZWQgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbDtcbiAgfTtcblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtzdHJpbmd9XG4gICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAqL1xuICBVcmxUZW1wbGF0ZS5wcm90b3R5cGUuaXNLZXlPcGVyYXRvciA9IGZ1bmN0aW9uIChvcGVyYXRvcikge1xuICAgIHJldHVybiBvcGVyYXRvciA9PT0gJzsnIHx8IG9wZXJhdG9yID09PSAnJicgfHwgb3BlcmF0b3IgPT09ICc/JztcbiAgfTtcblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtPYmplY3R9IGNvbnRleHRcbiAgICogQHBhcmFtIHtzdHJpbmd9IG9wZXJhdG9yXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBrZXlcbiAgICogQHBhcmFtIHtzdHJpbmd9IG1vZGlmaWVyXG4gICAqL1xuICBVcmxUZW1wbGF0ZS5wcm90b3R5cGUuZ2V0VmFsdWVzID0gZnVuY3Rpb24gKGNvbnRleHQsIG9wZXJhdG9yLCBrZXksIG1vZGlmaWVyKSB7XG4gICAgdmFyIHZhbHVlID0gY29udGV4dFtrZXldLFxuICAgICAgICByZXN1bHQgPSBbXTtcblxuICAgIGlmICh0aGlzLmlzRGVmaW5lZCh2YWx1ZSkgJiYgdmFsdWUgIT09ICcnKSB7XG4gICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyB8fCB0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInIHx8IHR5cGVvZiB2YWx1ZSA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgIHZhbHVlID0gdmFsdWUudG9TdHJpbmcoKTtcblxuICAgICAgICBpZiAobW9kaWZpZXIgJiYgbW9kaWZpZXIgIT09ICcqJykge1xuICAgICAgICAgIHZhbHVlID0gdmFsdWUuc3Vic3RyaW5nKDAsIHBhcnNlSW50KG1vZGlmaWVyLCAxMCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzdWx0LnB1c2godGhpcy5lbmNvZGVWYWx1ZShvcGVyYXRvciwgdmFsdWUsIHRoaXMuaXNLZXlPcGVyYXRvcihvcGVyYXRvcikgPyBrZXkgOiBudWxsKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAobW9kaWZpZXIgPT09ICcqJykge1xuICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgICAgICAgdmFsdWUuZmlsdGVyKHRoaXMuaXNEZWZpbmVkKS5mb3JFYWNoKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICByZXN1bHQucHVzaCh0aGlzLmVuY29kZVZhbHVlKG9wZXJhdG9yLCB2YWx1ZSwgdGhpcy5pc0tleU9wZXJhdG9yKG9wZXJhdG9yKSA/IGtleSA6IG51bGwpKTtcbiAgICAgICAgICAgIH0sIHRoaXMpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBPYmplY3Qua2V5cyh2YWx1ZSkuZm9yRWFjaChmdW5jdGlvbiAoaykge1xuICAgICAgICAgICAgICBpZiAodGhpcy5pc0RlZmluZWQodmFsdWVba10pKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2godGhpcy5lbmNvZGVWYWx1ZShvcGVyYXRvciwgdmFsdWVba10sIGspKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhciB0bXAgPSBbXTtcblxuICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgICAgICAgdmFsdWUuZmlsdGVyKHRoaXMuaXNEZWZpbmVkKS5mb3JFYWNoKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICB0bXAucHVzaCh0aGlzLmVuY29kZVZhbHVlKG9wZXJhdG9yLCB2YWx1ZSkpO1xuICAgICAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKHZhbHVlKS5mb3JFYWNoKGZ1bmN0aW9uIChrKSB7XG4gICAgICAgICAgICAgIGlmICh0aGlzLmlzRGVmaW5lZCh2YWx1ZVtrXSkpIHtcbiAgICAgICAgICAgICAgICB0bXAucHVzaCh0aGlzLmVuY29kZVVucmVzZXJ2ZWQoaykpO1xuICAgICAgICAgICAgICAgIHRtcC5wdXNoKHRoaXMuZW5jb2RlVmFsdWUob3BlcmF0b3IsIHZhbHVlW2tdLnRvU3RyaW5nKCkpKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHRoaXMuaXNLZXlPcGVyYXRvcihvcGVyYXRvcikpIHtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKHRoaXMuZW5jb2RlVW5yZXNlcnZlZChrZXkpICsgJz0nICsgdG1wLmpvaW4oJywnKSk7XG4gICAgICAgICAgfSBlbHNlIGlmICh0bXAubGVuZ3RoICE9PSAwKSB7XG4gICAgICAgICAgICByZXN1bHQucHVzaCh0bXAuam9pbignLCcpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKG9wZXJhdG9yID09PSAnOycpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNEZWZpbmVkKHZhbHVlKSkge1xuICAgICAgICAgIHJlc3VsdC5wdXNoKHRoaXMuZW5jb2RlVW5yZXNlcnZlZChrZXkpKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh2YWx1ZSA9PT0gJycgJiYgKG9wZXJhdG9yID09PSAnJicgfHwgb3BlcmF0b3IgPT09ICc/JykpIHtcbiAgICAgICAgcmVzdWx0LnB1c2godGhpcy5lbmNvZGVVbnJlc2VydmVkKGtleSkgKyAnPScpO1xuICAgICAgfSBlbHNlIGlmICh2YWx1ZSA9PT0gJycpIHtcbiAgICAgICAgcmVzdWx0LnB1c2goJycpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGVtcGxhdGVcbiAgICogQHJldHVybiB7ZnVuY3Rpb24oT2JqZWN0KTpzdHJpbmd9XG4gICAqL1xuICBVcmxUZW1wbGF0ZS5wcm90b3R5cGUucGFyc2UgPSBmdW5jdGlvbiAodGVtcGxhdGUpIHtcbiAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgdmFyIG9wZXJhdG9ycyA9IFsnKycsICcjJywgJy4nLCAnLycsICc7JywgJz8nLCAnJiddO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGV4cGFuZDogZnVuY3Rpb24gKGNvbnRleHQpIHtcbiAgICAgICAgcmV0dXJuIHRlbXBsYXRlLnJlcGxhY2UoL1xceyhbXlxce1xcfV0rKVxcfXwoW15cXHtcXH1dKykvZywgZnVuY3Rpb24gKF8sIGV4cHJlc3Npb24sIGxpdGVyYWwpIHtcbiAgICAgICAgICBpZiAoZXhwcmVzc2lvbikge1xuICAgICAgICAgICAgdmFyIG9wZXJhdG9yID0gbnVsbCxcbiAgICAgICAgICAgICAgICB2YWx1ZXMgPSBbXTtcblxuICAgICAgICAgICAgaWYgKG9wZXJhdG9ycy5pbmRleE9mKGV4cHJlc3Npb24uY2hhckF0KDApKSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgb3BlcmF0b3IgPSBleHByZXNzaW9uLmNoYXJBdCgwKTtcbiAgICAgICAgICAgICAgZXhwcmVzc2lvbiA9IGV4cHJlc3Npb24uc3Vic3RyKDEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBleHByZXNzaW9uLnNwbGl0KC8sL2cpLmZvckVhY2goZnVuY3Rpb24gKHZhcmlhYmxlKSB7XG4gICAgICAgICAgICAgIHZhciB0bXAgPSAvKFteOlxcKl0qKSg/OjooXFxkKyl8KFxcKikpPy8uZXhlYyh2YXJpYWJsZSk7XG4gICAgICAgICAgICAgIHZhbHVlcy5wdXNoLmFwcGx5KHZhbHVlcywgdGhhdC5nZXRWYWx1ZXMoY29udGV4dCwgb3BlcmF0b3IsIHRtcFsxXSwgdG1wWzJdIHx8IHRtcFszXSkpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmIChvcGVyYXRvciAmJiBvcGVyYXRvciAhPT0gJysnKSB7XG4gICAgICAgICAgICAgIHZhciBzZXBhcmF0b3IgPSAnLCc7XG5cbiAgICAgICAgICAgICAgaWYgKG9wZXJhdG9yID09PSAnPycpIHtcbiAgICAgICAgICAgICAgICBzZXBhcmF0b3IgPSAnJic7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAob3BlcmF0b3IgIT09ICcjJykge1xuICAgICAgICAgICAgICAgIHNlcGFyYXRvciA9IG9wZXJhdG9yO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiAodmFsdWVzLmxlbmd0aCAhPT0gMCA/IG9wZXJhdG9yIDogJycpICsgdmFsdWVzLmpvaW4oc2VwYXJhdG9yKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiB2YWx1ZXMuam9pbignLCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhhdC5lbmNvZGVSZXNlcnZlZChsaXRlcmFsKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH07XG4gIH07XG5cbiAgcmV0dXJuIG5ldyBVcmxUZW1wbGF0ZSgpO1xufSkpO1xuIiwiKGZ1bmN0aW9uKHNlbGYpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGlmIChzZWxmLmZldGNoKSB7XG4gICAgcmV0dXJuXG4gIH1cblxuICB2YXIgc3VwcG9ydCA9IHtcbiAgICBzZWFyY2hQYXJhbXM6ICdVUkxTZWFyY2hQYXJhbXMnIGluIHNlbGYsXG4gICAgaXRlcmFibGU6ICdTeW1ib2wnIGluIHNlbGYgJiYgJ2l0ZXJhdG9yJyBpbiBTeW1ib2wsXG4gICAgYmxvYjogJ0ZpbGVSZWFkZXInIGluIHNlbGYgJiYgJ0Jsb2InIGluIHNlbGYgJiYgKGZ1bmN0aW9uKCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgbmV3IEJsb2IoKVxuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuICAgIH0pKCksXG4gICAgZm9ybURhdGE6ICdGb3JtRGF0YScgaW4gc2VsZixcbiAgICBhcnJheUJ1ZmZlcjogJ0FycmF5QnVmZmVyJyBpbiBzZWxmXG4gIH1cblxuICBpZiAoc3VwcG9ydC5hcnJheUJ1ZmZlcikge1xuICAgIHZhciB2aWV3Q2xhc3NlcyA9IFtcbiAgICAgICdbb2JqZWN0IEludDhBcnJheV0nLFxuICAgICAgJ1tvYmplY3QgVWludDhBcnJheV0nLFxuICAgICAgJ1tvYmplY3QgVWludDhDbGFtcGVkQXJyYXldJyxcbiAgICAgICdbb2JqZWN0IEludDE2QXJyYXldJyxcbiAgICAgICdbb2JqZWN0IFVpbnQxNkFycmF5XScsXG4gICAgICAnW29iamVjdCBJbnQzMkFycmF5XScsXG4gICAgICAnW29iamVjdCBVaW50MzJBcnJheV0nLFxuICAgICAgJ1tvYmplY3QgRmxvYXQzMkFycmF5XScsXG4gICAgICAnW29iamVjdCBGbG9hdDY0QXJyYXldJ1xuICAgIF1cblxuICAgIHZhciBpc0RhdGFWaWV3ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gb2JqICYmIERhdGFWaWV3LnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKG9iailcbiAgICB9XG5cbiAgICB2YXIgaXNBcnJheUJ1ZmZlclZpZXcgPSBBcnJheUJ1ZmZlci5pc1ZpZXcgfHwgZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gb2JqICYmIHZpZXdDbGFzc2VzLmluZGV4T2YoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iaikpID4gLTFcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBub3JtYWxpemVOYW1lKG5hbWUpIHtcbiAgICBpZiAodHlwZW9mIG5hbWUgIT09ICdzdHJpbmcnKSB7XG4gICAgICBuYW1lID0gU3RyaW5nKG5hbWUpXG4gICAgfVxuICAgIGlmICgvW15hLXowLTlcXC0jJCUmJyorLlxcXl9gfH5dL2kudGVzdChuYW1lKSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignSW52YWxpZCBjaGFyYWN0ZXIgaW4gaGVhZGVyIGZpZWxkIG5hbWUnKVxuICAgIH1cbiAgICByZXR1cm4gbmFtZS50b0xvd2VyQ2FzZSgpXG4gIH1cblxuICBmdW5jdGlvbiBub3JtYWxpemVWYWx1ZSh2YWx1ZSkge1xuICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICdzdHJpbmcnKSB7XG4gICAgICB2YWx1ZSA9IFN0cmluZyh2YWx1ZSlcbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlXG4gIH1cblxuICAvLyBCdWlsZCBhIGRlc3RydWN0aXZlIGl0ZXJhdG9yIGZvciB0aGUgdmFsdWUgbGlzdFxuICBmdW5jdGlvbiBpdGVyYXRvckZvcihpdGVtcykge1xuICAgIHZhciBpdGVyYXRvciA9IHtcbiAgICAgIG5leHQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgdmFsdWUgPSBpdGVtcy5zaGlmdCgpXG4gICAgICAgIHJldHVybiB7ZG9uZTogdmFsdWUgPT09IHVuZGVmaW5lZCwgdmFsdWU6IHZhbHVlfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChzdXBwb3J0Lml0ZXJhYmxlKSB7XG4gICAgICBpdGVyYXRvcltTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBpdGVyYXRvclxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBpdGVyYXRvclxuICB9XG5cbiAgZnVuY3Rpb24gSGVhZGVycyhoZWFkZXJzKSB7XG4gICAgdGhpcy5tYXAgPSB7fVxuXG4gICAgaWYgKGhlYWRlcnMgaW5zdGFuY2VvZiBIZWFkZXJzKSB7XG4gICAgICBoZWFkZXJzLmZvckVhY2goZnVuY3Rpb24odmFsdWUsIG5hbWUpIHtcbiAgICAgICAgdGhpcy5hcHBlbmQobmFtZSwgdmFsdWUpXG4gICAgICB9LCB0aGlzKVxuICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShoZWFkZXJzKSkge1xuICAgICAgaGVhZGVycy5mb3JFYWNoKGZ1bmN0aW9uKGhlYWRlcikge1xuICAgICAgICB0aGlzLmFwcGVuZChoZWFkZXJbMF0sIGhlYWRlclsxXSlcbiAgICAgIH0sIHRoaXMpXG4gICAgfSBlbHNlIGlmIChoZWFkZXJzKSB7XG4gICAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhoZWFkZXJzKS5mb3JFYWNoKGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgICAgdGhpcy5hcHBlbmQobmFtZSwgaGVhZGVyc1tuYW1lXSlcbiAgICAgIH0sIHRoaXMpXG4gICAgfVxuICB9XG5cbiAgSGVhZGVycy5wcm90b3R5cGUuYXBwZW5kID0gZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcbiAgICBuYW1lID0gbm9ybWFsaXplTmFtZShuYW1lKVxuICAgIHZhbHVlID0gbm9ybWFsaXplVmFsdWUodmFsdWUpXG4gICAgdmFyIG9sZFZhbHVlID0gdGhpcy5tYXBbbmFtZV1cbiAgICB0aGlzLm1hcFtuYW1lXSA9IG9sZFZhbHVlID8gb2xkVmFsdWUrJywnK3ZhbHVlIDogdmFsdWVcbiAgfVxuXG4gIEhlYWRlcnMucHJvdG90eXBlWydkZWxldGUnXSA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICBkZWxldGUgdGhpcy5tYXBbbm9ybWFsaXplTmFtZShuYW1lKV1cbiAgfVxuXG4gIEhlYWRlcnMucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICBuYW1lID0gbm9ybWFsaXplTmFtZShuYW1lKVxuICAgIHJldHVybiB0aGlzLmhhcyhuYW1lKSA/IHRoaXMubWFwW25hbWVdIDogbnVsbFxuICB9XG5cbiAgSGVhZGVycy5wcm90b3R5cGUuaGFzID0gZnVuY3Rpb24obmFtZSkge1xuICAgIHJldHVybiB0aGlzLm1hcC5oYXNPd25Qcm9wZXJ0eShub3JtYWxpemVOYW1lKG5hbWUpKVxuICB9XG5cbiAgSGVhZGVycy5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcbiAgICB0aGlzLm1hcFtub3JtYWxpemVOYW1lKG5hbWUpXSA9IG5vcm1hbGl6ZVZhbHVlKHZhbHVlKVxuICB9XG5cbiAgSGVhZGVycy5wcm90b3R5cGUuZm9yRWFjaCA9IGZ1bmN0aW9uKGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gICAgZm9yICh2YXIgbmFtZSBpbiB0aGlzLm1hcCkge1xuICAgICAgaWYgKHRoaXMubWFwLmhhc093blByb3BlcnR5KG5hbWUpKSB7XG4gICAgICAgIGNhbGxiYWNrLmNhbGwodGhpc0FyZywgdGhpcy5tYXBbbmFtZV0sIG5hbWUsIHRoaXMpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgSGVhZGVycy5wcm90b3R5cGUua2V5cyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBpdGVtcyA9IFtdXG4gICAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlLCBuYW1lKSB7IGl0ZW1zLnB1c2gobmFtZSkgfSlcbiAgICByZXR1cm4gaXRlcmF0b3JGb3IoaXRlbXMpXG4gIH1cblxuICBIZWFkZXJzLnByb3RvdHlwZS52YWx1ZXMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgaXRlbXMgPSBbXVxuICAgIHRoaXMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSkgeyBpdGVtcy5wdXNoKHZhbHVlKSB9KVxuICAgIHJldHVybiBpdGVyYXRvckZvcihpdGVtcylcbiAgfVxuXG4gIEhlYWRlcnMucHJvdG90eXBlLmVudHJpZXMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgaXRlbXMgPSBbXVxuICAgIHRoaXMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwgbmFtZSkgeyBpdGVtcy5wdXNoKFtuYW1lLCB2YWx1ZV0pIH0pXG4gICAgcmV0dXJuIGl0ZXJhdG9yRm9yKGl0ZW1zKVxuICB9XG5cbiAgaWYgKHN1cHBvcnQuaXRlcmFibGUpIHtcbiAgICBIZWFkZXJzLnByb3RvdHlwZVtTeW1ib2wuaXRlcmF0b3JdID0gSGVhZGVycy5wcm90b3R5cGUuZW50cmllc1xuICB9XG5cbiAgZnVuY3Rpb24gY29uc3VtZWQoYm9keSkge1xuICAgIGlmIChib2R5LmJvZHlVc2VkKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFR5cGVFcnJvcignQWxyZWFkeSByZWFkJykpXG4gICAgfVxuICAgIGJvZHkuYm9keVVzZWQgPSB0cnVlXG4gIH1cblxuICBmdW5jdGlvbiBmaWxlUmVhZGVyUmVhZHkocmVhZGVyKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgcmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXNvbHZlKHJlYWRlci5yZXN1bHQpXG4gICAgICB9XG4gICAgICByZWFkZXIub25lcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZWplY3QocmVhZGVyLmVycm9yKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBmdW5jdGlvbiByZWFkQmxvYkFzQXJyYXlCdWZmZXIoYmxvYikge1xuICAgIHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpXG4gICAgdmFyIHByb21pc2UgPSBmaWxlUmVhZGVyUmVhZHkocmVhZGVyKVxuICAgIHJlYWRlci5yZWFkQXNBcnJheUJ1ZmZlcihibG9iKVxuICAgIHJldHVybiBwcm9taXNlXG4gIH1cblxuICBmdW5jdGlvbiByZWFkQmxvYkFzVGV4dChibG9iKSB7XG4gICAgdmFyIHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKClcbiAgICB2YXIgcHJvbWlzZSA9IGZpbGVSZWFkZXJSZWFkeShyZWFkZXIpXG4gICAgcmVhZGVyLnJlYWRBc1RleHQoYmxvYilcbiAgICByZXR1cm4gcHJvbWlzZVxuICB9XG5cbiAgZnVuY3Rpb24gcmVhZEFycmF5QnVmZmVyQXNUZXh0KGJ1Zikge1xuICAgIHZhciB2aWV3ID0gbmV3IFVpbnQ4QXJyYXkoYnVmKVxuICAgIHZhciBjaGFycyA9IG5ldyBBcnJheSh2aWV3Lmxlbmd0aClcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmlldy5sZW5ndGg7IGkrKykge1xuICAgICAgY2hhcnNbaV0gPSBTdHJpbmcuZnJvbUNoYXJDb2RlKHZpZXdbaV0pXG4gICAgfVxuICAgIHJldHVybiBjaGFycy5qb2luKCcnKVxuICB9XG5cbiAgZnVuY3Rpb24gYnVmZmVyQ2xvbmUoYnVmKSB7XG4gICAgaWYgKGJ1Zi5zbGljZSkge1xuICAgICAgcmV0dXJuIGJ1Zi5zbGljZSgwKVxuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgdmlldyA9IG5ldyBVaW50OEFycmF5KGJ1Zi5ieXRlTGVuZ3RoKVxuICAgICAgdmlldy5zZXQobmV3IFVpbnQ4QXJyYXkoYnVmKSlcbiAgICAgIHJldHVybiB2aWV3LmJ1ZmZlclxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIEJvZHkoKSB7XG4gICAgdGhpcy5ib2R5VXNlZCA9IGZhbHNlXG5cbiAgICB0aGlzLl9pbml0Qm9keSA9IGZ1bmN0aW9uKGJvZHkpIHtcbiAgICAgIHRoaXMuX2JvZHlJbml0ID0gYm9keVxuICAgICAgaWYgKCFib2R5KSB7XG4gICAgICAgIHRoaXMuX2JvZHlUZXh0ID0gJydcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGJvZHkgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHRoaXMuX2JvZHlUZXh0ID0gYm9keVxuICAgICAgfSBlbHNlIGlmIChzdXBwb3J0LmJsb2IgJiYgQmxvYi5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihib2R5KSkge1xuICAgICAgICB0aGlzLl9ib2R5QmxvYiA9IGJvZHlcbiAgICAgIH0gZWxzZSBpZiAoc3VwcG9ydC5mb3JtRGF0YSAmJiBGb3JtRGF0YS5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihib2R5KSkge1xuICAgICAgICB0aGlzLl9ib2R5Rm9ybURhdGEgPSBib2R5XG4gICAgICB9IGVsc2UgaWYgKHN1cHBvcnQuc2VhcmNoUGFyYW1zICYmIFVSTFNlYXJjaFBhcmFtcy5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihib2R5KSkge1xuICAgICAgICB0aGlzLl9ib2R5VGV4dCA9IGJvZHkudG9TdHJpbmcoKVxuICAgICAgfSBlbHNlIGlmIChzdXBwb3J0LmFycmF5QnVmZmVyICYmIHN1cHBvcnQuYmxvYiAmJiBpc0RhdGFWaWV3KGJvZHkpKSB7XG4gICAgICAgIHRoaXMuX2JvZHlBcnJheUJ1ZmZlciA9IGJ1ZmZlckNsb25lKGJvZHkuYnVmZmVyKVxuICAgICAgICAvLyBJRSAxMC0xMSBjYW4ndCBoYW5kbGUgYSBEYXRhVmlldyBib2R5LlxuICAgICAgICB0aGlzLl9ib2R5SW5pdCA9IG5ldyBCbG9iKFt0aGlzLl9ib2R5QXJyYXlCdWZmZXJdKVxuICAgICAgfSBlbHNlIGlmIChzdXBwb3J0LmFycmF5QnVmZmVyICYmIChBcnJheUJ1ZmZlci5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihib2R5KSB8fCBpc0FycmF5QnVmZmVyVmlldyhib2R5KSkpIHtcbiAgICAgICAgdGhpcy5fYm9keUFycmF5QnVmZmVyID0gYnVmZmVyQ2xvbmUoYm9keSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcigndW5zdXBwb3J0ZWQgQm9keUluaXQgdHlwZScpXG4gICAgICB9XG5cbiAgICAgIGlmICghdGhpcy5oZWFkZXJzLmdldCgnY29udGVudC10eXBlJykpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBib2R5ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgIHRoaXMuaGVhZGVycy5zZXQoJ2NvbnRlbnQtdHlwZScsICd0ZXh0L3BsYWluO2NoYXJzZXQ9VVRGLTgnKVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX2JvZHlCbG9iICYmIHRoaXMuX2JvZHlCbG9iLnR5cGUpIHtcbiAgICAgICAgICB0aGlzLmhlYWRlcnMuc2V0KCdjb250ZW50LXR5cGUnLCB0aGlzLl9ib2R5QmxvYi50eXBlKVxuICAgICAgICB9IGVsc2UgaWYgKHN1cHBvcnQuc2VhcmNoUGFyYW1zICYmIFVSTFNlYXJjaFBhcmFtcy5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihib2R5KSkge1xuICAgICAgICAgIHRoaXMuaGVhZGVycy5zZXQoJ2NvbnRlbnQtdHlwZScsICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQ7Y2hhcnNldD1VVEYtOCcpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoc3VwcG9ydC5ibG9iKSB7XG4gICAgICB0aGlzLmJsb2IgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHJlamVjdGVkID0gY29uc3VtZWQodGhpcylcbiAgICAgICAgaWYgKHJlamVjdGVkKSB7XG4gICAgICAgICAgcmV0dXJuIHJlamVjdGVkXG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5fYm9keUJsb2IpIHtcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMuX2JvZHlCbG9iKVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX2JvZHlBcnJheUJ1ZmZlcikge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUobmV3IEJsb2IoW3RoaXMuX2JvZHlBcnJheUJ1ZmZlcl0pKVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX2JvZHlGb3JtRGF0YSkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignY291bGQgbm90IHJlYWQgRm9ybURhdGEgYm9keSBhcyBibG9iJylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG5ldyBCbG9iKFt0aGlzLl9ib2R5VGV4dF0pKVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMuYXJyYXlCdWZmZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKHRoaXMuX2JvZHlBcnJheUJ1ZmZlcikge1xuICAgICAgICAgIHJldHVybiBjb25zdW1lZCh0aGlzKSB8fCBQcm9taXNlLnJlc29sdmUodGhpcy5fYm9keUFycmF5QnVmZmVyKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB0aGlzLmJsb2IoKS50aGVuKHJlYWRCbG9iQXNBcnJheUJ1ZmZlcilcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMudGV4dCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHJlamVjdGVkID0gY29uc3VtZWQodGhpcylcbiAgICAgIGlmIChyZWplY3RlZCkge1xuICAgICAgICByZXR1cm4gcmVqZWN0ZWRcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuX2JvZHlCbG9iKSB7XG4gICAgICAgIHJldHVybiByZWFkQmxvYkFzVGV4dCh0aGlzLl9ib2R5QmxvYilcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5fYm9keUFycmF5QnVmZmVyKSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUocmVhZEFycmF5QnVmZmVyQXNUZXh0KHRoaXMuX2JvZHlBcnJheUJ1ZmZlcikpXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuX2JvZHlGb3JtRGF0YSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2NvdWxkIG5vdCByZWFkIEZvcm1EYXRhIGJvZHkgYXMgdGV4dCcpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMuX2JvZHlUZXh0KVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChzdXBwb3J0LmZvcm1EYXRhKSB7XG4gICAgICB0aGlzLmZvcm1EYXRhID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRleHQoKS50aGVuKGRlY29kZSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmpzb24gPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLnRleHQoKS50aGVuKEpTT04ucGFyc2UpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIC8vIEhUVFAgbWV0aG9kcyB3aG9zZSBjYXBpdGFsaXphdGlvbiBzaG91bGQgYmUgbm9ybWFsaXplZFxuICB2YXIgbWV0aG9kcyA9IFsnREVMRVRFJywgJ0dFVCcsICdIRUFEJywgJ09QVElPTlMnLCAnUE9TVCcsICdQVVQnXVxuXG4gIGZ1bmN0aW9uIG5vcm1hbGl6ZU1ldGhvZChtZXRob2QpIHtcbiAgICB2YXIgdXBjYXNlZCA9IG1ldGhvZC50b1VwcGVyQ2FzZSgpXG4gICAgcmV0dXJuIChtZXRob2RzLmluZGV4T2YodXBjYXNlZCkgPiAtMSkgPyB1cGNhc2VkIDogbWV0aG9kXG4gIH1cblxuICBmdW5jdGlvbiBSZXF1ZXN0KGlucHV0LCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge31cbiAgICB2YXIgYm9keSA9IG9wdGlvbnMuYm9keVxuXG4gICAgaWYgKGlucHV0IGluc3RhbmNlb2YgUmVxdWVzdCkge1xuICAgICAgaWYgKGlucHV0LmJvZHlVc2VkKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FscmVhZHkgcmVhZCcpXG4gICAgICB9XG4gICAgICB0aGlzLnVybCA9IGlucHV0LnVybFxuICAgICAgdGhpcy5jcmVkZW50aWFscyA9IGlucHV0LmNyZWRlbnRpYWxzXG4gICAgICBpZiAoIW9wdGlvbnMuaGVhZGVycykge1xuICAgICAgICB0aGlzLmhlYWRlcnMgPSBuZXcgSGVhZGVycyhpbnB1dC5oZWFkZXJzKVxuICAgICAgfVxuICAgICAgdGhpcy5tZXRob2QgPSBpbnB1dC5tZXRob2RcbiAgICAgIHRoaXMubW9kZSA9IGlucHV0Lm1vZGVcbiAgICAgIGlmICghYm9keSAmJiBpbnB1dC5fYm9keUluaXQgIT0gbnVsbCkge1xuICAgICAgICBib2R5ID0gaW5wdXQuX2JvZHlJbml0XG4gICAgICAgIGlucHV0LmJvZHlVc2VkID0gdHJ1ZVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnVybCA9IFN0cmluZyhpbnB1dClcbiAgICB9XG5cbiAgICB0aGlzLmNyZWRlbnRpYWxzID0gb3B0aW9ucy5jcmVkZW50aWFscyB8fCB0aGlzLmNyZWRlbnRpYWxzIHx8ICdvbWl0J1xuICAgIGlmIChvcHRpb25zLmhlYWRlcnMgfHwgIXRoaXMuaGVhZGVycykge1xuICAgICAgdGhpcy5oZWFkZXJzID0gbmV3IEhlYWRlcnMob3B0aW9ucy5oZWFkZXJzKVxuICAgIH1cbiAgICB0aGlzLm1ldGhvZCA9IG5vcm1hbGl6ZU1ldGhvZChvcHRpb25zLm1ldGhvZCB8fCB0aGlzLm1ldGhvZCB8fCAnR0VUJylcbiAgICB0aGlzLm1vZGUgPSBvcHRpb25zLm1vZGUgfHwgdGhpcy5tb2RlIHx8IG51bGxcbiAgICB0aGlzLnJlZmVycmVyID0gbnVsbFxuXG4gICAgaWYgKCh0aGlzLm1ldGhvZCA9PT0gJ0dFVCcgfHwgdGhpcy5tZXRob2QgPT09ICdIRUFEJykgJiYgYm9keSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQm9keSBub3QgYWxsb3dlZCBmb3IgR0VUIG9yIEhFQUQgcmVxdWVzdHMnKVxuICAgIH1cbiAgICB0aGlzLl9pbml0Qm9keShib2R5KVxuICB9XG5cbiAgUmVxdWVzdC5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gbmV3IFJlcXVlc3QodGhpcywgeyBib2R5OiB0aGlzLl9ib2R5SW5pdCB9KVxuICB9XG5cbiAgZnVuY3Rpb24gZGVjb2RlKGJvZHkpIHtcbiAgICB2YXIgZm9ybSA9IG5ldyBGb3JtRGF0YSgpXG4gICAgYm9keS50cmltKCkuc3BsaXQoJyYnKS5mb3JFYWNoKGZ1bmN0aW9uKGJ5dGVzKSB7XG4gICAgICBpZiAoYnl0ZXMpIHtcbiAgICAgICAgdmFyIHNwbGl0ID0gYnl0ZXMuc3BsaXQoJz0nKVxuICAgICAgICB2YXIgbmFtZSA9IHNwbGl0LnNoaWZ0KCkucmVwbGFjZSgvXFwrL2csICcgJylcbiAgICAgICAgdmFyIHZhbHVlID0gc3BsaXQuam9pbignPScpLnJlcGxhY2UoL1xcKy9nLCAnICcpXG4gICAgICAgIGZvcm0uYXBwZW5kKGRlY29kZVVSSUNvbXBvbmVudChuYW1lKSwgZGVjb2RlVVJJQ29tcG9uZW50KHZhbHVlKSlcbiAgICAgIH1cbiAgICB9KVxuICAgIHJldHVybiBmb3JtXG4gIH1cblxuICBmdW5jdGlvbiBwYXJzZUhlYWRlcnMocmF3SGVhZGVycykge1xuICAgIHZhciBoZWFkZXJzID0gbmV3IEhlYWRlcnMoKVxuICAgIHJhd0hlYWRlcnMuc3BsaXQoL1xccj9cXG4vKS5mb3JFYWNoKGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgIHZhciBwYXJ0cyA9IGxpbmUuc3BsaXQoJzonKVxuICAgICAgdmFyIGtleSA9IHBhcnRzLnNoaWZ0KCkudHJpbSgpXG4gICAgICBpZiAoa2V5KSB7XG4gICAgICAgIHZhciB2YWx1ZSA9IHBhcnRzLmpvaW4oJzonKS50cmltKClcbiAgICAgICAgaGVhZGVycy5hcHBlbmQoa2V5LCB2YWx1ZSlcbiAgICAgIH1cbiAgICB9KVxuICAgIHJldHVybiBoZWFkZXJzXG4gIH1cblxuICBCb2R5LmNhbGwoUmVxdWVzdC5wcm90b3R5cGUpXG5cbiAgZnVuY3Rpb24gUmVzcG9uc2UoYm9keUluaXQsIG9wdGlvbnMpIHtcbiAgICBpZiAoIW9wdGlvbnMpIHtcbiAgICAgIG9wdGlvbnMgPSB7fVxuICAgIH1cblxuICAgIHRoaXMudHlwZSA9ICdkZWZhdWx0J1xuICAgIHRoaXMuc3RhdHVzID0gJ3N0YXR1cycgaW4gb3B0aW9ucyA/IG9wdGlvbnMuc3RhdHVzIDogMjAwXG4gICAgdGhpcy5vayA9IHRoaXMuc3RhdHVzID49IDIwMCAmJiB0aGlzLnN0YXR1cyA8IDMwMFxuICAgIHRoaXMuc3RhdHVzVGV4dCA9ICdzdGF0dXNUZXh0JyBpbiBvcHRpb25zID8gb3B0aW9ucy5zdGF0dXNUZXh0IDogJ09LJ1xuICAgIHRoaXMuaGVhZGVycyA9IG5ldyBIZWFkZXJzKG9wdGlvbnMuaGVhZGVycylcbiAgICB0aGlzLnVybCA9IG9wdGlvbnMudXJsIHx8ICcnXG4gICAgdGhpcy5faW5pdEJvZHkoYm9keUluaXQpXG4gIH1cblxuICBCb2R5LmNhbGwoUmVzcG9uc2UucHJvdG90eXBlKVxuXG4gIFJlc3BvbnNlLnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBuZXcgUmVzcG9uc2UodGhpcy5fYm9keUluaXQsIHtcbiAgICAgIHN0YXR1czogdGhpcy5zdGF0dXMsXG4gICAgICBzdGF0dXNUZXh0OiB0aGlzLnN0YXR1c1RleHQsXG4gICAgICBoZWFkZXJzOiBuZXcgSGVhZGVycyh0aGlzLmhlYWRlcnMpLFxuICAgICAgdXJsOiB0aGlzLnVybFxuICAgIH0pXG4gIH1cblxuICBSZXNwb25zZS5lcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciByZXNwb25zZSA9IG5ldyBSZXNwb25zZShudWxsLCB7c3RhdHVzOiAwLCBzdGF0dXNUZXh0OiAnJ30pXG4gICAgcmVzcG9uc2UudHlwZSA9ICdlcnJvcidcbiAgICByZXR1cm4gcmVzcG9uc2VcbiAgfVxuXG4gIHZhciByZWRpcmVjdFN0YXR1c2VzID0gWzMwMSwgMzAyLCAzMDMsIDMwNywgMzA4XVxuXG4gIFJlc3BvbnNlLnJlZGlyZWN0ID0gZnVuY3Rpb24odXJsLCBzdGF0dXMpIHtcbiAgICBpZiAocmVkaXJlY3RTdGF0dXNlcy5pbmRleE9mKHN0YXR1cykgPT09IC0xKSB7XG4gICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignSW52YWxpZCBzdGF0dXMgY29kZScpXG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBSZXNwb25zZShudWxsLCB7c3RhdHVzOiBzdGF0dXMsIGhlYWRlcnM6IHtsb2NhdGlvbjogdXJsfX0pXG4gIH1cblxuICBzZWxmLkhlYWRlcnMgPSBIZWFkZXJzXG4gIHNlbGYuUmVxdWVzdCA9IFJlcXVlc3RcbiAgc2VsZi5SZXNwb25zZSA9IFJlc3BvbnNlXG5cbiAgc2VsZi5mZXRjaCA9IGZ1bmN0aW9uKGlucHV0LCBpbml0KSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgdmFyIHJlcXVlc3QgPSBuZXcgUmVxdWVzdChpbnB1dCwgaW5pdClcbiAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKVxuXG4gICAgICB4aHIub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgICAgIHN0YXR1czogeGhyLnN0YXR1cyxcbiAgICAgICAgICBzdGF0dXNUZXh0OiB4aHIuc3RhdHVzVGV4dCxcbiAgICAgICAgICBoZWFkZXJzOiBwYXJzZUhlYWRlcnMoeGhyLmdldEFsbFJlc3BvbnNlSGVhZGVycygpIHx8ICcnKVxuICAgICAgICB9XG4gICAgICAgIG9wdGlvbnMudXJsID0gJ3Jlc3BvbnNlVVJMJyBpbiB4aHIgPyB4aHIucmVzcG9uc2VVUkwgOiBvcHRpb25zLmhlYWRlcnMuZ2V0KCdYLVJlcXVlc3QtVVJMJylcbiAgICAgICAgdmFyIGJvZHkgPSAncmVzcG9uc2UnIGluIHhociA/IHhoci5yZXNwb25zZSA6IHhoci5yZXNwb25zZVRleHRcbiAgICAgICAgcmVzb2x2ZShuZXcgUmVzcG9uc2UoYm9keSwgb3B0aW9ucykpXG4gICAgICB9XG5cbiAgICAgIHhoci5vbmVycm9yID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJlamVjdChuZXcgVHlwZUVycm9yKCdOZXR3b3JrIHJlcXVlc3QgZmFpbGVkJykpXG4gICAgICB9XG5cbiAgICAgIHhoci5vbnRpbWVvdXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmVqZWN0KG5ldyBUeXBlRXJyb3IoJ05ldHdvcmsgcmVxdWVzdCBmYWlsZWQnKSlcbiAgICAgIH1cblxuICAgICAgeGhyLm9wZW4ocmVxdWVzdC5tZXRob2QsIHJlcXVlc3QudXJsLCB0cnVlKVxuXG4gICAgICBpZiAocmVxdWVzdC5jcmVkZW50aWFscyA9PT0gJ2luY2x1ZGUnKSB7XG4gICAgICAgIHhoci53aXRoQ3JlZGVudGlhbHMgPSB0cnVlXG4gICAgICB9XG5cbiAgICAgIGlmICgncmVzcG9uc2VUeXBlJyBpbiB4aHIgJiYgc3VwcG9ydC5ibG9iKSB7XG4gICAgICAgIHhoci5yZXNwb25zZVR5cGUgPSAnYmxvYidcbiAgICAgIH1cblxuICAgICAgcmVxdWVzdC5oZWFkZXJzLmZvckVhY2goZnVuY3Rpb24odmFsdWUsIG5hbWUpIHtcbiAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIobmFtZSwgdmFsdWUpXG4gICAgICB9KVxuXG4gICAgICB4aHIuc2VuZCh0eXBlb2YgcmVxdWVzdC5fYm9keUluaXQgPT09ICd1bmRlZmluZWQnID8gbnVsbCA6IHJlcXVlc3QuX2JvZHlJbml0KVxuICAgIH0pXG4gIH1cbiAgc2VsZi5mZXRjaC5wb2x5ZmlsbCA9IHRydWVcbn0pKHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJyA/IHNlbGYgOiB0aGlzKTtcbiJdfQ==
