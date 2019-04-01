'use strict';

// 属性(分类和标签) Model
/* eslint valid-jsdoc: "off" */
/**
 * @param {Egg.Application} app - egg application
 */

module.exports = app => {

  const { UUID } = app.Sequelize;

  const middles = app.model.define('middles', {
    id: { type: UUID, primaryKey: true },
    a_id: { type: UUID, allowNull: false },
    m_id: { type: UUID, allowNull: false },
  });

  middles.sync()
    .catch(e => {
      app.logger.error('error syncing sequelize model', {
        error: e,
        model: 'middles',
      });
    });

  middles.list = async () => {
    return await middles
      .findAll();
  };

  middles.addOne = async toCreate => {
    return await middles
      .create(toCreate)
      .catch(e => {
        app.logger.error(e);
      });
  };
  middles.updateOneById = async toUpdate => {

    const [ updateCount, [ updateRow ]] = await middles.update(toUpdate, {
      where: { id: toUpdate.id },
      individualHooks: true,
    });

    return updateCount > 0 ? updateRow : null;
  };

  middles.getOneById = async id => {
    return await middles
      .findOne({
        where: {
          id,
        },
      });
  };

  middles.removeOneById = async id => {
    const item = await middles.getOneById(id);
    if (!item) return '1';
    return item.destroy();
  };

  return middles;
};
