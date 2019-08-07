
'use strict';
const Controller = require('egg').Controller;

class UserController extends Controller {
  /**
  * @param {Egg.Context} ctx - egg Context
  */
  constructor(ctx) {
    super(ctx);
    this.resquest = ctx.request;
    this.UserService = ctx.service.user;
    this.session = ctx.session;
    this.ResponseCode = ctx.response.ResponseCode;
    this.ServerResponse = ctx.response.ServerResponse;
  }

  /**
   * 注册
   */
  async register() {
    const { ctx } = this;
    const { username, password } = ctx.request.body;
    const response = await this.UserService.createUserWithUnPw(username, password);

    this.ctx.body = response;
  }
  /**
   * 登录
   */
  async login() {
    const { username, password } = this.ctx.request.body;
    const response = await this.UserService.loginWithUnPw(username, password);

    if (response.isSuccess()) {
      this.session.currentUser = response.getData();
    }

    this.ctx.body = response;
  }
  /**
   * 登出
   */
  async logout() {
    this.ctx.session = null;
    this.ctx.body = this.ServerResponse.createBySuccessMsg('已成功退出');
  }
  async getUser() {

    let response;
    const user = this.session.currentUser;
    if (!user) response = this.ServerResponse.createByErrorCodeMsg(this.ResponseCode.NEED_LOGIN, '登录失效');
    else response = await this.UserService.getUserInfo(user.id);

    this.ctx.body = response
      ? this.ServerResponse.createBySuccessData(response)
      : this.ServerResponse.createByErrorMsg('获取失败');

  }

  /**
   * 获取用户信息
   */
  async getUserSession() {
    let response;
    const user = this.session.currentUser;
    if (!user) response = this.ServerResponse.createByErrorMsg('用户未登录，无法获取用户信息');
    else response = this.ServerResponse.createBySuccessMsgAndData('用户已登录', user);
    this.ctx.body = response;
  }
  /**
   * 修改用户信息
   */
  async updateUser() {
    const userInfo = this.ctx.request.body;
    const user = this.session.currentUser;
    const response = await this.UserService.updateUser(userInfo.userId, user);

    this.session.currentUser = response.getData();
    if (response) {
      this.ctx.body = this.ServerResponse.createByErrorMsg('更新失败');
    } else {
      this.ctx.body = this.ServerResponse.createBySuccessMsg('更新成功');
    }
  }
}


module.exports = UserController;
