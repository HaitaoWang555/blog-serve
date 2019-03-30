'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, middleware } = app;
  const checkLogin = middleware.checkLogin({ checkAdmin: true });

  router.get('/manage/article/list',
    checkLogin, controller.backend.articles.list);

  router.get('/manage/article/getOne',
    checkLogin, controller.backend.articles.getOne);

  router.post('/manage/article/addone',
    checkLogin, controller.backend.articles.addone);

  router.post('/manage/article/update',
    checkLogin, controller.backend.articles.update);

  router.delete('/manage/article/delete',
    checkLogin, controller.backend.articles.delete);

};
