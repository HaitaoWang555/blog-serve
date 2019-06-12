'use strict';
/* eslint valid-jsdoc: "off" */
const { Service } = require('egg');

const _ = require('lodash');

class ArticlesService extends Service {
/**
 * @param {Egg.Context} ctx - egg Context
 */
  constructor(ctx) {
    super(ctx);
    this.ArticlesModel = ctx.model.Articles;
    this.ResponseCode = ctx.response.ResponseCode;
    this.ServerResponse = ctx.response.ServerResponse;
  }

  /**
   * 获取列表数据
   * @param {Number} query.page 默认第一页
   * @param {Number} query.pageSize 默认15条
   * @return {Object} 列表
   */
  async list(query) {
    const { count, rows } = await this.ArticlesModel.list('portal', query);
    const list = rows.map(row => {
      const item = row && row.toJSON();
      item.content = this.getSummary(item.content);
      return item;
    });

    const data = {
      items: list,
      total: count,
    };

    return data;
  }

  /**
   * 新增文章
   * @param {Object} params 参数集合
   * @return {Object} 成功或失败信息 添加的信息
   */
  async addOne(params) {

    const created = await this.ArticlesModel.addOne(params);

    return created;
  }

  /**
   * 更新文章
   * @param {Object} params 参数集合
   * @return {Object} 成功或失败信息 添加的信息
   */
  async update(params) {

    const data = await this.ArticlesModel.updateOneById(params);
    const update = data
      ? _.pickBy(data.toJSON(), (value, key) => {
        return [ 'id', 'title', 'content', 'status', 'allow_comment' ].find(item => key === item);
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

    const list = await this.ArticlesModel.getOneById(id);

    return list;
  }
  /**
   * 根据id删除列表中某一个
   * @param {uuid} id ID
   * @return {Object} 成功或失败信息
   */
  async delete(id) {

    return await this.ArticlesModel.removeOneById(id);
  }
  /**
   * 获取文章预览
   *
   * @return 截取的预览字符串
   */
  getSummary(content) {
    if (!content) return null;
    return content; // TODO
  }
}

module.exports = ArticlesService;
