'use strict';
/* eslint valid-jsdoc: "off" */

const Service = require('egg').Service;

class CommentService extends Service {
  /**
  * @param {Egg.Context} ctx - egg Context
  */
  constructor(ctx) {
    super(ctx);
    this.CommentModel = ctx.model.Comment;
    this.UserModel = ctx.model.User;
    this.ServerResponse = ctx.response.ServerResponse;
  }


  /**
   * 获取评论内容
   * @param {Object} params 参数集合
   */
  async listWithUser(params) {

    const { count, rows } = await this.CommentModel.list(params);
    const list = rows.map(row => row && row.toJSON());
    console.time();
    const select = [];
    select.push('username', 'icon');
    const listWithUser = await Promise.all(list.map(async item => {
      const user_id = item.user_id;
      const userInfo = await this.UserModel.getUser(user_id, select);
      let replyUserInfo = {};
      if (item.reply_user_id) {
        const user_id = item.reply_user_id;
        replyUserInfo = await this.UserModel.getUser(user_id, select);
      }

      return { ...item, userInfo, replyUserInfo };
    }));
    console.timeEnd();
    const data = {
      items: listWithUser,
      total: count,
    };
    return data;
  }

  /**
   * 新增
   * @param {Object} params 参数集合
   * @return {Object} 成功或失败信息 添加的信息
   */
  async addOne(params) {
    const created = await this.CommentModel.addOne(params);
    let update = true;
    if (created && params.parent_id) {
      const obj = {};
      obj.is_have_leaf = true;
      obj.id = params.parent_id;
      update = await this.update(obj);
    }
    return update ? created : null;
  }

  /**
   * 更新
   * @param {Object} params 参数集合
   * @return {Object} 成功或失败信息 添加的信息
   */
  async update(params) {

    const data = await this.CommentModel.updateOneById(params);

    const update = data ? data.toJSON() : null;

    return update;
  }
  /**
   * 根据id获取列表中某一个
   * @param {uuid} id ID
   * @return {Object} 成功或失败信息 信息
   */
  async getOneById(id) {

    const list = await this.CommentModel.getOneById(id);

    return list;
  }
  /**
   * 根据id删除列表中某一个
   * @param {uuid} id ID
   * @return {Object} 成功或失败信息
   */
  async delete(id) {

    return await this.CommentModel.removeOneById(id);
  }

}

module.exports = CommentService;
