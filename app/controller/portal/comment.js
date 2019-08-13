
'use strict';
const Controller = require('egg').Controller;
const uuid = require('uuid/v4');

class CommentController extends Controller {
  /**
  * @param {Egg.Context} ctx - egg Context
  */
  constructor(ctx) {
    super(ctx);
    this.resquest = ctx.request;
    this.CommentService = ctx.service.comment;
    this.ResponseCode = ctx.response.ResponseCode;
    this.ServerResponse = ctx.response.ServerResponse;
  }

  /**
   * 评论列表
   */
  async commentList() {
    const { ctx } = this;
    const query = ctx.query;

    const list = await this.CommentService.listWithUser(query);
    const response = this.ServerResponse.createBySuccessData(list);
    ctx.body = response;
  }

  /**
   * 新增
   */
  async addone() {
    const { ctx } = this;
    const params = ctx.request.body;
    const { user_id, content } = params;
    if (!user_id) {
      const response = this.ServerResponse.createByErrorMsg('请先登录');
      ctx.body = response;
      return null;
    } else if (!content) {
      const response = this.ServerResponse.createByErrorMsg('请输入评论内容');
      ctx.body = response;
      return null;
    }
    params.id = uuid();

    const created = await this.CommentService.addOne(params);

    const response = created
      ? this.ServerResponse.createBySuccessMsgAndData('添加成功', created)
      : this.ServerResponse.createByErrorMsg('添加失败');
    ctx.body = response;
  }

  /**
   * 更新
   */
  async update() {
    const { ctx } = this;
    const params = ctx.request.body;

    const update = await this.CommentService.update(params);
    const response = update
      ? this.ServerResponse.createBySuccessMsgAndData('修改成功', update)
      : this.ServerResponse.createByErrorMsg('修改失败');
    ctx.body = response;
  }

  /**
   * 删除
   */
  async delete() {
    const { ctx } = this;
    const { id } = ctx.query;
    if (!id) {
      const response = this.ServerResponse.createByErrorMsg('无效ID');
      ctx.body = response;
      return null;
    }
    const isRemove = await this.CommentService.delete(id);
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


module.exports = CommentController;
