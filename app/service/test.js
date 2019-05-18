'use strict';
/* eslint valid-jsdoc: "off" */
const { Service } = require('egg');

const uuid = require('uuid/v4');
const _ = require('lodash');

class TestService extends Service {
/**
 * @param {Egg.Context} ctx - egg Context
 */
  constructor(ctx) {
    super(ctx);
    this.TestModel = ctx.model.Test;
    this.ResponseCode = ctx.response.ResponseCode;
    this.ServerResponse = ctx.response.ServerResponse;
  }
  /**
   * 错误处理函数
   * @param {STRING} param 参数
   */
  async error(param) {
    return param
      ? this.ServerResponse.createBySuccessMsgAndData('成功', param)
      : this.ServerResponse.createByErrorMsg('no param');
  }
  /**
   * 获取列表数据
   * @param {Object} query page pageSize
   * @return {Object} 列表
   */
  async list(query = { limit: 10, offset: 0 }) {
    const { limit, offset } = query;
    const products = await this.TestModel.list(limit, offset);

    return products;
  }
  /**
   * 添加
   * @param {String} name 名
   * @param {Integer} priceInCent 价格
   * @return {Object} 成功或失败信息 添加的信息
   */
  async addOne(name, priceInCent) {

    const toCreate = {
      name, priceInCent,
    };

    toCreate.id = uuid();
    const created = await this.TestModel.addOne(toCreate);

    return created;
  }
  /**
   * 修改
   * @param {uuid} id id
   * @param {String} name 名
   * @param {Integer} priceInCent 价格
   * @return {Object} 成功或失败信息 添加的信息
   */
  async updateOneById(id, name, priceInCent) {

    const toUpdate = {
      id, name, priceInCent,
    };

    const data = await this.TestModel.updateOneById(toUpdate);

    const update = data
      ? _.pickBy(data.toJSON(), (value, key) => {
        return [ 'id', 'name', 'priceInCent' ].find(item => key === item);
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

    const testList = await this.TestModel.getOneById(id);

    return testList;
  }
  /**
   * 根据id删除列表中某一个
   * @param {uuid} id ID
   * @return {Object} 成功或失败信息
   */
  async removeOneById(id) {

    return await this.TestModel.removeOneById(id);
  }
}

module.exports = TestService;
