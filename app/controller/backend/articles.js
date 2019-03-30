
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
    const list = await this.ArticlesService.list(page, pageSize);
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

  /**
   * 新增文章
   */
  async addone() {
    const { ctx } = this;
    const params = ctx.request.body;
    const { title, content, status } = params;
    if (!title) {
      const response = this.ServerResponse.createByErrorMsg('请输入文章标题');
      ctx.body = response;
      return null;
    } else if (!content) {
      const response = this.ServerResponse.createByErrorMsg('文章内容不能为空');
      ctx.body = response;
      return null;
    } else if (!status) {
      const response = this.ServerResponse.createByErrorMsg('请选择文章状态');
      ctx.body = response;
      return null;
    }

    const created = await this.ArticlesService.addOne(params);

    const response = created
      ? this.ServerResponse.createBySuccessMsgAndData('添加成功', created)
      : this.ServerResponse.createByErrorMsg('添加失败');
    ctx.body = response;
  }

  /**
   * 更新文章
   */
  async update() {
    const { ctx } = this;
    const params = ctx.request.body;
    const { title, content, status } = params;
    if (!title) {
      const response = this.ServerResponse.createByErrorMsg('请输入文章标题');
      ctx.body = response;
      return null;
    } else if (!content) {
      const response = this.ServerResponse.createByErrorMsg('文章内容不能为空');
      ctx.body = response;
      return null;
    } else if (!status) {
      const response = this.ServerResponse.createByErrorMsg('请选择文章状态');
      ctx.body = response;
      return null;
    }
    const update = await this.ArticlesService.update(params);
    const response = update
      ? this.ServerResponse.createBySuccessMsgAndData('修改成功', update)
      : this.ServerResponse.createByErrorMsg('修改失败');
    ctx.body = response;
  }

  /**
   * 删除文章
   */
  async delete() {
    const { ctx } = this;
    const { id } = ctx.query;
    if (!id) {
      const response = this.ServerResponse.createByErrorMsg('无效ID');
      ctx.body = response;
      return null;
    }
    const isRemove = await this.ArticlesService.delete(id);
    if (isRemove === '1') {
      ctx.body = this.ServerResponse.createByErrorMsg('已删除或不存在');
      return;
    }
    const response = isRemove
      ? this.ServerResponse.createBySuccessMsg('删除成功')
      : this.ServerResponse.createByErrorMsg('删除失败');
    ctx.body = response;
  }

}


module.exports = ArticlesController;
