'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;

  router.get('/manage/user/', controller.backend.user.getUser);
  router.get('/manage/userSession/', controller.backend.user.getUserSession);

  router.post('/manage/user/logout', controller.backend.user.logout);
  router.post('/manage/user/register', controller.backend.user.register);
  router.post('/manage/user/login', controller.backend.user.login);

  router.patch('/manage/user', controller.backend.user.updateUser);

};
