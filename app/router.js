'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);

  require('./router/backend/user')(app);
  require('./router/portal/user')(app);
  require('./router/portal/comment')(app);
  require('./router/backend/metas')(app);
  require('./router/portal/metas')(app);
  require('./router/backend/articles')(app);
  require('./router/portal/articles')(app);

};
