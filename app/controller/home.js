'use strict';

const Controller = require('egg').Controller;
const uuid = require('uuid/v4');
const path = require('path');
const fs = require('fs');
const awaitWriteStream = require('await-stream-ready').write;
const sendToWormhole = require('stream-wormhole');

class HomeController extends Controller {

  /**
  * @param {Egg.Context} ctx - egg Context
  */
  constructor(ctx) {
    super(ctx);
    this.resquest = ctx.request;
    this.ResponseCode = ctx.response.ResponseCode;
    this.ServerResponse = ctx.response.ServerResponse;
  }

  async index() {
    const { ctx } = this;
    ctx.body = 'hi, egg';
  }
  /**
 * 上传图片
 */
  async upload() {
    const { ctx, config } = this;
    const uid = uuid();
    const stream = await ctx.getFileStream();

    if (!stream.filename) return;

    const type = [ 'image/jpeg', 'image/png' ];
    if (!type.includes(stream.mime)) {
      const response = this.ServerResponse.createByErrorMsg(`不支持${stream.mime}格式`);
      ctx.body = response;
      return;
    }

    const filename = uid + path.extname(stream.filename).toLowerCase();

    const target = path.join(config.uploadArticle.path, filename);
    const writeStream = fs.createWriteStream(target);
    try {
      await awaitWriteStream(stream.pipe(writeStream));

      const data = config.uploadArticle.url + filename;
      const response = this.ServerResponse.createBySuccessData(data);
      ctx.body = response;

    } catch (err) {
      await sendToWormhole(stream);
      const response = this.ServerResponse.createByErrorMsg(`${stream.filename}上传失败`);
      ctx.body = response;
      throw err;
    }
  }
}

module.exports = HomeController;
