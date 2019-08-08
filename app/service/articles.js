'use strict';
/* eslint valid-jsdoc: "off" */
const { Service } = require('egg');

const _ = require('lodash');
const { MAX_PREVIEW_COUNT } = require('../common/public');

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
   *
   * @param {*} type 前台portal/后台backend
   * @param {*} query page pageSize
   */
  async list(type, query) {
    const { count, rows } = await this.ArticlesModel.list(type, query);
    const list = rows.map(row => {
      const item = row && row.toJSON();
      if (item.content) item.content = this.getSummary(item.content);
      return item;
    });

    const data = {
      items: list,
      total: count,
    };

    return data;
  }
  /**
   * 获取归档列表
   */
  async archive() {
    const rows = await this.ArticlesModel.archive();
    const data = [];
    const yearData = [];
    const list = rows.map(row => {
      const item = row && row.toJSON();
      const dateStr = item.update_content_time.slice(0, 7);
      if (!yearData.includes(dateStr)) {
        yearData.push(dateStr);
        const obj = {};
        obj.dateStr = dateStr;
        obj.articles = [];
        data.push(obj);
      }
      return item;
    });
    data.forEach(item => {
      list.forEach(i => {
        const dateStr = i.update_content_time.slice(0, 7);
        if (item.dateStr === dateStr) item.articles.push(i);
      });
    });
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
    if (list) { // 阅读数+1
      const params = {};
      params.id = id;
      params.hits = list.hits + 1;
      this.ArticlesModel.updateOneById(params);
    }
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
 * 截取预览内容
 * @param {*} content 文章内容
 */
  getSummary(content) {
    const maxLength = MAX_PREVIEW_COUNT;
    const index = content.slice(0, maxLength).lastIndexOf('</p>');
    const len = index > -1 ? index : maxLength;
    content = content.slice(0, len).concat('......</p>');
    return content;
  }
}

module.exports = ArticlesService;
