/* eslint valid-jsdoc: "off" */

'use strict';
const Sequelize = require('sequelize');
const path = require('path');

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '26262sfe450_fsfgfda5a62';

  // add your middleware config here
  config.middleware = [];
  // post csrf 测试阶段使用
  config.security = {
    csrf: {
      enable: false,
    },
  };
  // sequelize config
  config.sequelize = {
    dialect: 'postgres',
    database: 'blog-serve',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 123456,
    operatorsAliases: Sequelize.Op,
    timezone: '+08:00', // 东八时区
  };
  config.redis = {
    client: {
      port: 6379, // Redis port
      host: '127.0.0.1', // Redis host
      password: '',
      db: 0,
    },
    agent: true,
  };

  config.sessionRedis = {
    key: 'EGG_SESSION',
    maxAge: 24 * 3600 * 1000,
    httpOnly: true,
    encrypt: false,
  };
  // error config
  config.onerror = {
    json(err, ctx) {
      const { code, httpStatusCode, original } = err;
      if (httpStatusCode) ctx.statusCode = httpStatusCode;
      ctx.body = {
        code,
        msg: original,
      };
    },
    html(err, ctx) {
      const { code, httpStatusCode } = err;
      if (httpStatusCode) ctx.statusCode = httpStatusCode;
      ctx.body = `<h3 style="color: red;">${err.original}</h3>`;
      ctx.code = code;
    },
  };
  config.cluster = {
    listen: {
      port: 7001,
      hostname: '127.0.0.1',
    },
  };
  const baseUrl = 'http://' + config.cluster.listen.hostname + ':' + config.cluster.listen.port; // http://127.0.0.1:7001/
  config.uploadArticle = {
    path: path.join(__dirname, '../app/public/upload/article'),
    url: baseUrl + '/public/upload/article/',
  };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
