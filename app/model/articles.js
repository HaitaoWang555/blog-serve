'use strict';

// 文章 Model
/* eslint valid-jsdoc: "off" */
/**
 * @param {Egg.Application} app - egg application
 */

const { PAGE_SIZE } = require('../common/public');

module.exports = app => {

  const { UUID, STRING, BOOLEAN, TEXT, ARRAY, Op } = app.Sequelize;

  const articles = app.model.define('articles', {
    id: { type: UUID, primaryKey: true },
    title: { type: STRING(64), allowNull: false },
    content: { type: TEXT, allowNull: false },
    tags: { type: ARRAY(app.Sequelize.STRING(64)) },
    category: { type: STRING(64) },
    status: { type: STRING(64), allowNull: false },
    allow_comment: { type: BOOLEAN, allowNull: false, defaultValue: true },
  });
  articles.sync()
    .catch(e => {
      app.logger.error('error syncing sequelize model', {
        error: e,
        model: 'articles',
      });
    });

  articles.list = async (type, query) => {
    const { pagesize, page, sortBy = 'updated_at,desc', title, status, tags, category } = query;
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
    return await articles
      .findAll({
        where: { [type]: { [Op.like]: `%${name}%` } }, // TODO
        attributes: { exclude: [ 'content' ] },
      });
  };

  articles.addOne = async toCreate => {
    return await articles
      .create(toCreate)
      .catch(e => {
        app.logger.error(e);
      });
  };
  articles.updateOneById = async toUpdate => {

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
