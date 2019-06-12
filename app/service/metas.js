'use strict';
/* eslint valid-jsdoc: "off" */

const _ = require('lodash');

const Service = require('egg').Service;

class MetasService extends Service {
  /**
  * @param {Egg.Context} ctx - egg Context
  */
  constructor(ctx) {
    super(ctx);
    this.MetasModel = ctx.model.Metas;
    this.Articles = ctx.model.Articles;
    this.ServerResponse = ctx.response.ServerResponse;
  }

  /**
   * 获取分类或标签
   * @param {Object} query.type TAG or CATEGORY
   * @param {Object} query.pagesize
   * @param {Object} query.page
   */
  async list(query) {

    const { count, rows } = await this.MetasModel.list(query);
    const list = rows.map(row => row && row.toJSON());

    const data = {
      items: list,
      total: count,
    };
    return data;
  }
  /**
   * 获取分类或标签 及文章
   * @param {Object} query.type TAG or CATEGORY
   * @param {Object} query.pagesize
   * @param {Object} query.page
   */
  async listWithArticles(type) {

    let list = await this.MetasModel.list(type);
    list = list.map(row => row && row.toJSON());
    console.time();
    const listWithArticles = await Promise.all(list.map(async item => {
      const type = item.type;
      let arttcles = await this.Articles.getAllWithType(type, item.name);
      arttcles = arttcles.map(row => row && row.toJSON());

      return { ...item, arttcles };
    }));
    console.timeEnd();
    return listWithArticles;
  }

  /**
   * 新增分类或标签
   * @param {Object} params 参数集合
   * @return {Object} 成功或失败信息 添加的信息
   */
  async addOne(params) {

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

    const update = data ? data.toJSON() : null

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
