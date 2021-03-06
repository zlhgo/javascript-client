const fetch = require('isomorphic-fetch')
const errors = require('../errors')
const utils = require('../utils')
const URL = require('url-parse')
const urlTemplate = require('url-template')

const parseResponse = (response, decoders, responseCallback) => {
  return response.text().then(text => {
    if (responseCallback) {
      responseCallback(response, text)
    }
    const contentType = response.headers.get('Content-Type')
    const decoder = utils.negotiateDecoder(decoders, contentType)
    const options = {url: response.url}
    return decoder.decode(text, options)
  })
}

class HTTPTransport {
  constructor (options = {}) {
    this.schemes = ['http', 'https']
    this.auth = options.auth || null
    this.headers = options.headers || {}
    this.fetch = options.fetch || fetch
    this.FormData = options.FormData || window.FormData
    this.requestCallback = options.requestCallback
    this.responseCallback = options.responseCallback
  }

  buildRequest (link, decoders, params = {}, validate = true) {
    const fields = link.fields
    const method = link.method.toUpperCase()
    let queryParams = {}
    let pathParams = {}
    let formParams = {}
    let fieldNames = []
    let hasBody = false

    for (let idx = 0, len = fields.length; idx < len; idx++) {
      const field = fields[idx]

      // Ensure any required fields are included
      if (!params.hasOwnProperty(field.name)) {
        if (field.required) {
          throw new errors.ParameterError(`Missing required field: "${field.name}"`)
        } else {
          continue
        }
      }

      fieldNames.push(field.name)
      if (field.location === 'query' && method === 'GET') {
        queryParams[field.name] = params[field.name]
      } else if (field.location === 'path') {
        pathParams[field.name] = params[field.name]
      } else if (field.location === 'form') {
        formParams[field.name] = params[field.name]
        hasBody = true
      } else if (field.location === 'body') {
        formParams = params[field.name]
        hasBody = true
      }
    }

    // Check for any parameters that did not have a matching field
    // if @param validate is true, add the extra parameter to Params
    for (var property in params) {
      if (params.hasOwnProperty(property) && !fieldNames.includes(property) && validate) {
        throw new errors.ParameterError(`Unknown parameter: "${property}"`)
      } else if (!fieldNames.includes(property)) {
        fieldNames.push(property)
        if (method === 'GET') {
          queryParams[property] = params[property]
        } else {
          formParams[property] = params[property]
          hasBody = true
        }
      }
    }

    let requestOptions = {method: method, headers: {}}

    Object.assign(requestOptions.headers, this.headers)

    if (hasBody) {
      if (link.encoding === 'application/json') {
        requestOptions.body = JSON.stringify(formParams)
        requestOptions.headers['Content-Type'] = 'application/json'
      } else if (link.encoding === 'multipart/form-data') {
        let form = new this.FormData()

        for (let paramKey in formParams) {
          form.append(paramKey, formParams[paramKey])
        }
        requestOptions.body = form
      } else if (link.encoding === 'application/x-www-form-urlencoded') {
        let formBody = []
        for (let paramKey in formParams) {
          const encodedKey = encodeURIComponent(paramKey)
          const encodedValue = encodeURIComponent(formParams[paramKey])
          formBody.push(encodedKey + '=' + encodedValue)
        }
        formBody = formBody.join('&')

        requestOptions.body = formBody
        requestOptions.headers['Content-Type'] = 'application/x-www-form-urlencoded'
      }
    }

    if (this.auth) {
      requestOptions = this.auth.authenticate(requestOptions)
    }

    let parsedUrl = urlTemplate.parse(link.url)
    parsedUrl = parsedUrl.expand(pathParams)
    parsedUrl = new URL(parsedUrl)

    // TODO: 如果要修改的字段也出现在queryParams参数中,会出现404未找到
    if (!['PUT'].includes(method)) {
      parsedUrl.set('query', queryParams)
    }

    return {
      url: parsedUrl.toString(),
      options: requestOptions
    }
  }

  action (link, decoders, params = {}, validate = true) {
    const responseCallback = this.responseCallback
    const request = this.buildRequest(link, decoders, params, validate)

    if (this.requestCallback) {
      this.requestCallback(request)
    }

    return this.fetch(request.url, request.options)
      .then(function (response) {
        return parseResponse(response, decoders, responseCallback)
          .then(function (data) {
            if (response.ok) {
              return data
            } else {
              const title = response.status + ' ' + response.statusText
              const error = new errors.ErrorMessage(title, data, response.status, response.statusText)
              return Promise.reject(error)
            }
          })
      })
  }
}

module.exports = {
  HTTPTransport: HTTPTransport
}
