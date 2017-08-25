class ParameterError extends Error {
  constructor (message) {
    super(message)
    this.message = message
    this.name = 'ParameterError'
  }
}

class LinkLookupError extends Error {
  constructor (message) {
    super(message)
    this.message = message
    this.name = 'LinkLookupError'
  }
}

class ErrorMessage extends Error {
  constructor (message, content, status, statusText) {
    super(message)
    this.message = message
    this.content = content
    this.status = status
    this.statusText = statusText
    this.name = 'ErrorMessage'
  }
}

module.exports = {
  ParameterError: ParameterError,
  LinkLookupError: LinkLookupError,
  ErrorMessage: ErrorMessage
}
