'use strict';
/* eslint valid-jsdoc: "off" */
const { Service } = require('egg');

class TestService extends Service {
  /**
   * @param {Egg.Context} ctx - egg Context
   */
  constructor(ctx) {
    super(ctx);
    this.UserModel = ctx.model.User;
    this.ResponseCode = ctx.response.ResponseCode;
    this.ServerResponse = ctx.response.ServerResponse;
  }

  async createUserWithUnPw(username, password) {
    const user = await this.UserModel.createUserWithUnPw(username,
      password);

    if (!user) return this.ServerResponse.createByErrorMsg('注册失败');
    return this.ServerResponse.createBySuccessMsgAndData('注册成功', user);
  }

  async loginWithUnPw(username, password) {
    const user = await this.UserModel.loginWithUnPw(username, password); // TODO: 得到用户列表

    if (!user) this.ServerResponse.createByErrorMsg('账户不存在');

    return this.ServerResponse.createBySuccessMsgAndData('登录成功', user);
  }

  async getUserInfo(userId) {
    const select = [ 'id' ];
    select.push('phoneNumber', 'email', 'phoneNumber', 'username', 'role', 'icon');
    const user = await this.UserModel.getUser(userId, select);
    return user;
  }

  async updateUser(userId, user) {
    const r = await this.UserModel.updateUser(userId, user);
    return r;
  }
}

module.exports = TestService;
