'use strict';

// 文章 Model

module.exports = app => {

  const { UUID, STRING, BOOLEAN, TEXT } = app.Sequelize;

  const articles = app.model.define('articles', {
    id: { type: UUID, primaryKey: true },
    title: { type: STRING(64), allowNull: false },
    content: { type: TEXT, allowNull: false },
    tags: { type: STRING },
    category: { type: STRING },
    status: { type: STRING, allowNull: false },
    allow_comment: { type: BOOLEAN, allowNull: false, defaultValue: true },
  });
  articles.sync()
    .catch(e => {
      app.logger.error('error syncing sequelize model', {
        error: e,
        model: 'articles',
      });
    });

  articles.list = async (limit, offset) => {
    return await articles
      .findAll({
        limit,
        offset,
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
    const item = await articles.getOneById(id);
    if (!item) return null;
    return item.destroy();
  };

  return articles;
};
