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
    this.MetasModel = ctx.model.Metas;
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

    const list = await Promise.all(rows.map(async item => {
      if (item.content) item.content = this.getSummary(item.content);

      const newItem = this.initMetas(item);

      return newItem;
    }));

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
   * @param {String} type portal 前台
   * @return {Object} 成功或失败信息 信息
   */
  async getOneById(id, type) {

    const list = await this.ArticlesModel.getOneById(id);
    if (list && type === 'portal') { // 阅读数+1
      const params = {};
      params.id = id;
      params.hits = list.hits + 1;
      this.ArticlesModel.updateOneById(params);
    }
    const newList = this.initMetas(list);
    return newList;
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
    const length = content.length;
    const maxLength = MAX_PREVIEW_COUNT;

    if (length > maxLength) {
      const index = content.slice(0, maxLength).lastIndexOf('</p>');
      const len = index > -1 ? index : maxLength;
      content = content.slice(0, len).concat('......</p>');
    }
    return content;
  }
  /**
   * 更新文章评论数量
   * @param {String} id 文章id
   */
  async updateOneCommentCountById(id) {
    const article = await this.ArticlesModel.getOneById(id);
    if (article) {
      const params = {};
      params.id = id;
      params.comment_count = article.comment_count + 1;
      this.ArticlesModel.updateOneById(params);
    }
  }
  /**
   * 获取标签 分类名称
   * @param {Object} item 文章信息
   */
  async initMetas(item) {
    if (item.category) {
      const category = await this.MetasModel.getOneById(item.category);
      if (category) item.category = category.name;
    }

    if (item.tags && item.tags.length > 0) {
      const newTags = await Promise.all(item.tags.map(async i => {
        const tags = await this.MetasModel.getOneById(i);
        if (tags) return tags.name;
      }));
      item.tags = newTags;
    }
    return item;
  }
}

module.exports = ArticlesService;
