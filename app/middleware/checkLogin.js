'use strict';

module.exports = () => {

  return async function checkLogin(ctx, next) {
    // TODO: user
    await next();
  };
};
