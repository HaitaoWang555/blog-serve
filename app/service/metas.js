'use strict';
/* eslint valid-jsdoc: "off" */

const uuid = require('uuid/v4');
const _ = require('lodash');

const Service = require('egg').Service;

class MetasService extends Service {
  /**
  * @param {Egg.Context} ctx - egg Context
  */
  constructor(ctx) {
    super(ctx);
    this.MetasModel = ctx.model.Metas;
    this.ServerResponse = ctx.response.ServerResponse;
  }

  /**
   * 获取分类或标签
   * @param {STRING} type TAG or CATEGORY
   */
  async list(type) {

    const list = await this.MetasModel.list(type);

    return list;
  }

  /**
   * 新增分类或标签
   * @param {Object} params 参数集合
   * @return {Object} 成功或失败信息 添加的信息
   */
  async addOne(params) {

    params.id = uuid();
    const created = await this.MetasModel.addOne(params);

    return created;
  }

  /**
   * 更新分类或标签
   * @param {Object} params 参数集合
   * @return {Object} 成功或失败信息 添加的信息
   */
  async update(params) {

    const data = await this.MetasModel.updateOneById(params);

    const update = data
      ? _.pickBy(data.toJSON(), (value, key) => {
        return [ 'id', 'name', 'type' ].find(item => key === item);
      })
      : null;

    return update;
  }
  /**
   * 根据id获取列表中某一个
   * @param {uuid} id ID
   * @return {Object} 成功或失败信息 信息
   */
  async getOneById(id) {

    const list = await this.MetasModel.getOneById(id);

    return list;
  }
  /**
   * 根据id删除列表中某一个
   * @param {uuid} id ID
   * @return {Object} 成功或失败信息
   */
  async delete(id) {

    return await this.MetasModel.removeOneById(id);
  }

}

module.exports = MetasService;
