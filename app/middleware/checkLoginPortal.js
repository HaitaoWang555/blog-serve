'use strict';

module.exports = () => {

  return async function checkLogin(ctx, next) {
    const user = ctx.session.currentUser;
    if (!user) {
      ctx.body = ctx.response.ServerResponse.createByErrorCodeMsg(ctx.response.ResponseCode.NEED_LOGIN, '用户未登录');
      return ctx.body;
    }
    await next();
  };
};
