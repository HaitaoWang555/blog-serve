'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, middleware } = app;
  const checkLogin = middleware.checkLoginPortal();

  router.get('/comment/list', controller.portal.comment.commentList);

  router.post('/comment/addone',
    checkLogin, controller.portal.comment.addone);

  router.post('/comment/update',
    checkLogin, controller.portal.comment.update);

  router.delete('/comment/delete',
    checkLogin, controller.portal.comment.delete);
};
