'use strict';

// 属性(分类和标签) Model
/* eslint valid-jsdoc: "off" */
/**
 * @param {Egg.Application} app - egg application
 */

module.exports = app => {

  const { UUID, STRING } = app.Sequelize;

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

  metas.list = async type => {
    if (type) {
      return await metas
        .findAll({
          where: {
            type,
          },
        });
    }
    return await metas
      .findAll();
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
    const item = await metas.getOneById(id);
    if (!item) return '1';
    return item.destroy();
  };

  return metas;
};
