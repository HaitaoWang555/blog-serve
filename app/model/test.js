'use strict';

module.exports = app => {
  const { UUID, STRING, INTEGER } = app.Sequelize;

  const TestList = app.model.define('testList', {
    id: { type: UUID, primaryKey: true },
    name: { type: STRING },
    priceInCent: { type: INTEGER, min: 0 },
  });
  TestList.sync()
    .catch(e => {
      app.logger.error('error syncing sequelize model', {
        error: e,
        model: 'TestList',
      });
    });

  TestList.list = async (limit, offset) => {
    return await TestList
      .findAll({
        limit,
        offset,
      });
  };

  TestList.addOne = async toCreate => {
    return await TestList
      .create(toCreate)
      .catch(e => {
        app.logger.error(e);
      });
  };
  TestList.updateOneById = async toUpdate => {

    const [ updateCount, [ updateRow ]] = await TestList.update(toUpdate, {
      where: { id: toUpdate.id },
      individualHooks: true,
    });

    return updateCount > 0 ? updateRow : null;
  };

  TestList.getOneById = async id => {
    return await TestList
      .findOne({
        where: {
          id,
        },
      });
  };

  TestList.removeOneById = async id => {
    const item = await TestList.getOneById(id);
    if (!item) return null;
    return item.destroy();
  };

  return TestList;
};
