'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;

  router.get('/article/list', controller.portal.articles.list);
  router.get('/archive/list', controller.portal.articles.archive);
  router.get('/article/getOne', controller.portal.articles.getOne);

};
