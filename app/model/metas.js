'use strict';

// 属性(分类和标签) Model
/* eslint valid-jsdoc: "off" */
/**
 * @param {Egg.Application} app - egg application
 */

const { PAGE_SIZE } = require('../common/public');

module.exports = app => {

  const { UUID, STRING, Op } = app.Sequelize;

  const metas = app.model.define('metas', {
    id: { type: UUID, primaryKey: true },
    name: { type: STRING(64), allowNull: false },
    type: { type: STRING(64), allowNull: false },
    color: { type: STRING(64), defaultValue: 'primary' },
    textColor: { type: STRING(64), defaultValue: 'white' },
  });
  metas.sync()
    .catch(e => {
      app.logger.error('error syncing sequelize model', {
        error: e,
        model: 'metas',
      });
    });

  metas.list = async query => {
    const { pagesize, page, type, name, sortBy = 'updated_at,desc', list } = query;

    const sequelizeQuery = {};
    sequelizeQuery.where = {};

    sequelizeQuery.order = [ sortBy.split(',') ];

    if (list !== 'all') {
      sequelizeQuery.limit = Number(pagesize || PAGE_SIZE);
      sequelizeQuery.offset = Number(page - 1 || 0) * Number(pagesize || PAGE_SIZE);
    }

    if (type) sequelizeQuery.where.type = type;
    if (name) sequelizeQuery.where.name = { [Op.like]: `%${name}%` };

    return await metas
      .findAndCountAll(sequelizeQuery);
  };

  metas.addOne = async toCreate => {
    return await metas
      .create(toCreate)
      .catch(e => {
        app.logger.error(e);
      });
  };
  metas.updateOneById = async toUpdate => {

    const [ updateCount, [ updateRow ]] = await metas.update(toUpdate, {
      where: { id: toUpdate.id },
      individualHooks: true,
    });

    return updateCount > 0 ? updateRow : null;
  };

  metas.getOneById = async id => {
    return await metas
      .findOne({
        where: {
          id,
        },
      });
  };

  metas.removeOneById = async id => {
    const ids = id.split(',');
    const item = await metas.destroy({ where: { id: ids } });
    if (!item) return '1';
    return item;
  };

  return metas;
};
