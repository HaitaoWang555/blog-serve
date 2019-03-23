'use strict';
/* eslint valid-jsdoc: "off" */

const Controller = require('egg').Controller;

class TestController extends Controller {
  /**
   * @param {Egg.Context} ctx - egg Context
   */
  constructor(ctx) {
    super(ctx);
    this.TestService = ctx.service.test;
    this.ResponseCode = ctx.response.ResponseCode;
    this.ServerResponse = ctx.response.ServerResponse;
  }

  /**
    * 测试错误处理函数
    * @Param {String} param 参数
  */
  async error() {
    const { ctx } = this;
    const { param } = ctx.query;
    const response = await this.TestService.error(param);
    ctx.body = response;
  }
  /**
    * 获取测试列表
   */
  async list() {
    const { ctx } = this;
    const list = await this.TestService.list();
    const response = this.ServerResponse.createBySuccessData(list);
    ctx.body = response;
  }
  /**
   * 新增
   */
  async addOne() {
    const { ctx } = this;
    const { name, priceInCent } = ctx.request.body;
    if (!name) {
      const response = this.ServerResponse.createByErrorMsg('请输入名字');
      ctx.body = response;
      return null;
    } else if (!priceInCent) {
      const response = this.ServerResponse.createByErrorMsg('请输入价格');
      ctx.body = response;
      return null;
    }
    const created = await this.TestService.addOne(name.trim(), priceInCent);

    const response = created
      ? this.ServerResponse.createBySuccessMsgAndData('添加成功', created)
      : this.ServerResponse.createByErrorMsg('添加失败');
    ctx.body = response;
  }
  /**
   * 修改
   */
  async updateOneById() {
    const { ctx } = this;
    const { id, name, priceInCent } = ctx.request.body;
    if (!id) {
      const response = this.ServerResponse.createByErrorMsg('无效ID');
      ctx.body = response;
      return null;
    }
    const update = await this.TestService.updateOneById(id, name, priceInCent);
    const response = update
      ? this.ServerResponse.createBySuccessMsgAndData('修改成功', update)
      : this.ServerResponse.createByErrorMsg('修改失败');
    ctx.body = response;
  }
  /**
   * 根据id获取列表中某一个
   */
  async getOne() {
    const { ctx } = this;
    const { id } = ctx.query;
    if (!id) {
      const response = this.ServerResponse.createByErrorMsg('无效ID');
      ctx.body = response;
      return null;
    }

    const list = await this.TestService.getOneById(id);
    const response = list
      ? this.ServerResponse.createBySuccessData(list)
      : this.ServerResponse.createByErrorMsg('已删除或不存在');
    ctx.body = response;
  }
  /**
   * 根据id删除列表中某一个
   */
  async removeOne() {
    const { ctx } = this;
    const { id } = ctx.query;
    if (!id) {
      const response = this.ServerResponse.createByErrorMsg('无效ID');
      ctx.body = response;
      return null;
    }
    const isRemove = await this.TestService.removeOneById(id);
    const response = isRemove
      ? this.ServerResponse.createBySuccessMsg('删除成功')
      : this.ServerResponse.createByErrorMsg('删除失败');
    ctx.body = response;
  }
}

module.exports = TestController;
