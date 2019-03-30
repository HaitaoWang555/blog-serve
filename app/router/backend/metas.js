'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, middleware } = app;
  const checkLogin = middleware.checkLogin({ checkAdmin: true });

  router.get('/manage/metas/list',
    checkLogin, controller.backend.metas.list);

  router.post('/manage/metas/addone',
    checkLogin, controller.backend.metas.addone);

  router.post('/manage/metas/update',
    checkLogin, controller.backend.metas.update);

  router.delete('/manage/metas/delete',
    checkLogin, controller.backend.metas.delete);

};
