
'use strict';
const Controller = require('egg').Controller;

class MetasController extends Controller {
  /**
  * @param {Egg.Context} ctx - egg Context
  */
  constructor(ctx) {
    super(ctx);
    this.resquest = ctx.request;
    this.MetasService = ctx.service.metas;
    this.ResponseCode = ctx.response.ResponseCode;
    this.ServerResponse = ctx.response.ServerResponse;
  }

  /**
   * 获取分类
   */
  async categoryList() {
    const { ctx } = this;
    const type = 'CATEGORY';
    const list = await this.MetasService.list(type);
    const response = this.ServerResponse.createBySuccessData(list);
    ctx.body = response;
  }
  /**
   * 获取标签
   */
  async tagList() {
    const { ctx } = this;
    const type = 'TAG';
    const list = await this.MetasService.list(type);
    const response = this.ServerResponse.createBySuccessData(list);
    ctx.body = response;
  }

}


module.exports = MetasController;
