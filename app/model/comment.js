'use strict';

// 属性(文章评论) Model
/* eslint valid-jsdoc: "off" */
/**
 * @param {Egg.Application} app - egg application
 */

const { PAGE_SIZE } = require('../common/public');

module.exports = app => {

  const { UUID, STRING, INTEGER, BOOLEAN } = app.Sequelize;

  const comment = app.model.define('comment', {
    id: { type: UUID, primaryKey: true },
    user_id: { type: UUID, allowNull: false },
    article_id: { type: UUID, allowNull: false },
    parent_id: { type: UUID },
    reply_user_id: { type: UUID },
    up: { type: INTEGER }, // 赞同
    down: { type: INTEGER }, // 反对
    is_have_leaf: { type: BOOLEAN, allowNull: false, defaultValue: false },
    content: { type: STRING(1000), allowNull: false },
  });
  comment.sync()
    .catch(e => {
      app.logger.error('error syncing sequelize model', {
        error: e,
        model: 'comment',
      });
    });

  comment.list = async query => {
    const { pagesize, page, sortBy = 'created_at,asc', parent_id, article_id } = query;

    const sequelizeQuery = {};
    sequelizeQuery.where = {};

    sequelizeQuery.order = [
      [ 'up', 'desc' ],
      [ 'down', 'asc' ],
      sortBy.split(','),
    ];

    sequelizeQuery.limit = Number(pagesize || PAGE_SIZE);
    sequelizeQuery.offset = Number(page - 1 || 0) * Number(pagesize || PAGE_SIZE);

    sequelizeQuery.where.article_id = article_id;
    if (parent_id) {
      sequelizeQuery.where.parent_id = parent_id;
    } else {
      sequelizeQuery.where.parent_id = null;
    }

    return await comment
      .findAndCountAll(sequelizeQuery);
  };

  comment.addOne = async toCreate => {
    return await comment
      .create(toCreate)
      .catch(e => {
        app.logger.error(e);
      });
  };
  comment.updateOneById = async toUpdate => {

    const [ updateCount, [ updateRow ]] = await comment.update(toUpdate, {
      where: { id: toUpdate.id },
      individualHooks: true,
    });

    return updateCount > 0 ? updateRow : null;
  };

  comment.getOneById = async id => {
    return await comment
      .findOne({
        where: {
          id,
        },
      });
  };

  comment.removeOneById = async id => {
    const ids = id.split(',');
    const item = await comment.destroy({ where: { id: ids } });
    if (!item) return '1';
    return item;
  };

  return comment;
};
