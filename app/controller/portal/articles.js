
'use strict';
const Controller = require('egg').Controller;

class ArticlesController extends Controller {
  /**
  * @param {Egg.Context} ctx - egg Context
  */
  constructor(ctx) {
    super(ctx);
    this.resquest = ctx.request;
    this.ArticlesService = ctx.service.articles;
    this.ResponseCode = ctx.response.ResponseCode;
    this.ServerResponse = ctx.response.ServerResponse;
  }

  /**
   * 获取文章列表
   */
  async list() {
    const { ctx } = this;
    const { page = 1, pageSize = 10 } = ctx.request.body;
    const query = {
      page, pageSize,
    };
    const list = await this.ArticlesService.list('portal', query);
    const response = this.ServerResponse.createBySuccessData(list);
    ctx.body = response;
  }

  /**
   * 获取某一篇文章
   */
  async getOne() {
    const { ctx } = this;
    const { id } = ctx.query;
    const list = await this.ArticlesService.getOneById(id);
    const response = list
      ? this.ServerResponse.createBySuccessData(list)
      : this.ServerResponse.createByErrorMsg('已删除或不存在');
    ctx.body = response;
  }

}


module.exports = ArticlesController;
