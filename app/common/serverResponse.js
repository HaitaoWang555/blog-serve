'use strict';

const { SUCCESS, ERROR } = require('./responseCode');

module.exports = class ServerResponse {
  constructor(statusCode, msg, data) {
    this.statusCode = statusCode;
    this.message = msg;
    this.data = data;
  }

  isSuccess() {
    return this.statusCode === SUCCESS;
  }

  getStatusCode() {
    return this.statusCode;
  }

  getData() {
    return this.data;
  }

  getMsg() {
    return this.message;
  }

  static createBySuccess() {
    return new ServerResponse(SUCCESS);
  }

  static createBySuccessMsg(msg) {
    return new ServerResponse(SUCCESS, msg, null);
  }

  static createBySuccessData(data) {
    return new ServerResponse(SUCCESS, null, data);
  }

  static createBySuccessMsgAndData(msg, data) {
    return new ServerResponse(SUCCESS, msg, data);
  }

  static createByError() {
    return new ServerResponse(ERROR, 'error', null);
  }

  static createByErrorMsg(errorMsg) {
    return new ServerResponse(ERROR, errorMsg, null);
  }

  static createByErrorCodeMsg(errorCode, errorMsg) {
    return new ServerResponse(errorCode, errorMsg, null);
  }
};
