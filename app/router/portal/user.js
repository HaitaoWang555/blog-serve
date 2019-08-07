'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;

  router.get('/user/', controller.portal.user.getUser);
  router.get('/userSession/', controller.portal.user.getUserSession);

  router.post('/user/logout', controller.portal.user.logout);
  router.post('/user/register', controller.portal.user.register);
  router.post('/user/login', controller.portal.user.login);

  router.patch('/user', controller.portal.user.updateUser);

};
