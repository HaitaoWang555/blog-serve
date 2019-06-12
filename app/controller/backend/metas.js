
'use strict';
const Controller = require('egg').Controller;
const uuid = require('uuid/v4');

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
   * 获取分类或标签
   */
  async list() {
    const { ctx } = this;
    const { query } = ctx;
    const list = await this.MetasService.list(query);
    const response = this.ServerResponse.createBySuccessData(list);
    ctx.body = response;
  }

  /**
   * 新增分类或标签
   */
  async addone() {
    const { ctx } = this;
    const params = ctx.request.body;
    const { name, type } = params;
    if (!name) {
      const response = this.ServerResponse.createByErrorMsg('请输入名字');
      ctx.body = response;
      return null;
    } else if (!type) {
      const response = this.ServerResponse.createByErrorMsg('请选择类型');
      ctx.body = response;
      return null;
    }
    params.id = uuid();

    const created = await this.MetasService.addOne(params);

    const response = created
      ? this.ServerResponse.createBySuccessMsgAndData('添加成功', created)
      : this.ServerResponse.createByErrorMsg('添加失败');
    ctx.body = response;
  }

  /**
   * 更新分类或标签
   */
  async update() {
    const { ctx } = this;
    const params = ctx.request.body;
    const { name } = params;
    if (!name) {
      const response = this.ServerResponse.createByErrorMsg('请输入名字');
      ctx.body = response;
      return null;
    }
    const update = await this.MetasService.update(params);
    const response = update
      ? this.ServerResponse.createBySuccessMsgAndData('修改成功', update)
      : this.ServerResponse.createByErrorMsg('修改失败');
    ctx.body = response;
  }

  /**
   * 删除分类或标签
   */
  async delete() {
    const { ctx } = this;
    const { id } = ctx.query;
    if (!id) {
      const response = this.ServerResponse.createByErrorMsg('无效ID');
      ctx.body = response;
      return null;
    }
    const isRemove = await this.MetasService.delete(id);
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


module.exports = MetasController;
