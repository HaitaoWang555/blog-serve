'use strict';

// 文章 Model
/* eslint valid-jsdoc: "off" */
/**
 * @param {Egg.Application} app - egg application
 */

const { PAGE_SIZE } = require('../common/public');

module.exports = app => {

  const { UUID, STRING, BOOLEAN, TEXT, INTEGER, ARRAY, DATE, Op } = app.Sequelize;

  const articles = app.model.define('articles', {
    id: { type: UUID, primaryKey: true },
    title: { type: STRING(64), allowNull: false },
    content: { type: TEXT, allowNull: false },
    tags: { type: ARRAY(app.Sequelize.STRING(64)) },
    category: { type: STRING(64) },
    status: { type: STRING(64), allowNull: false },
    hits: { type: INTEGER, default: 0 },
    allow_comment: { type: BOOLEAN, allowNull: false, defaultValue: true },
    update_content_time: { type: DATE, allowNull: false, defaultValue: new Date() },
  });
  articles.sync()
    .catch(e => {
      app.logger.error('error syncing sequelize model', {
        error: e,
        model: 'articles',
      });
    });

  articles.list = async (type, query) => {
    const { pagesize, page, sortBy = 'update_content_time,desc', title, status, tags, category } = query;
    const sequelizeQuery = {};
    sequelizeQuery.where = {};

    if (type !== 'portal') sequelizeQuery.attributes = { exclude: [ 'content' ] };
    sequelizeQuery.order = [ sortBy.split(',') ];
    sequelizeQuery.limit = Number(pagesize || PAGE_SIZE);
    sequelizeQuery.offset = Number(page - 1 || 0) * Number(pagesize || PAGE_SIZE);

    if (title) sequelizeQuery.where.title = { [Op.like]: `%${title}%` };
    if (status) sequelizeQuery.where.status = status;
    if (tags) sequelizeQuery.where.tags = { [Op.contains]: tags.split(',') };
    if (category) sequelizeQuery.where.category = { [Op.like]: `%${category}%` };
    return await articles
      .findAndCountAll(sequelizeQuery);
  };

  articles.getAllWithType = async (type, name) => {
    const sequelizeQuery = {};
    sequelizeQuery.where = {};
    sequelizeQuery.where.status = 'publish';
    sequelizeQuery.attributes = { exclude: [ 'content', 'update_content_time', 'updated_at', 'created_at', 'allow_comment' ] };
    switch (type) {
      case 'tag':
        sequelizeQuery.where.tags = { [Op.contains]: name.split(',') };
        sequelizeQuery.attributes.exclude.push('category');
        break;
      case 'category':
        sequelizeQuery.where.category = { [Op.like]: `%${name}%` };
        sequelizeQuery.attributes.exclude.push('tags');
        break;
      default:
        break;
    }
    return await articles
      .findAll(sequelizeQuery);
  };

  articles.archive = async () => {
    const sequelizeQuery = {};
    const sortBy = 'update_content_time,desc';
    sequelizeQuery.where = {};
    sequelizeQuery.where.status = 'publish';
    sequelizeQuery.order = [ sortBy.split(',') ];
    sequelizeQuery.attributes = { exclude: [ 'content', 'allow_comment', 'tags', 'category' ] };
    return await articles
      .findAll(sequelizeQuery);
  };

  articles.addOne = async toCreate => {
    toCreate.update_content_time = new Date();
    return await articles
      .create(toCreate)
      .catch(e => {
        app.logger.error(e);
      });
  };
  articles.updateOneById = async toUpdate => {
    if (toUpdate.isUpdateContent) toUpdate.update_content_time = new Date(); // 更新文章内容
    const [ updateCount, [ updateRow ]] = await articles.update(toUpdate, {
      where: { id: toUpdate.id },
      individualHooks: true,
    });

    return updateCount > 0 ? updateRow : null;
  };

  articles.getOneById = async id => {
    return await articles
      .findOne({
        where: {
          id,
        },
      });
  };

  articles.removeOneById = async id => {
    const ids = id.split(',');
    // TODO: 只有管理员可以删除,其它角色更改status
    const item = await articles.destroy({ where: { id: ids } });
    if (!item) return '1';
    return item;
  };

  return articles;
};
