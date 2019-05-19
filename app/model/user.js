'use strict';

const { ROLE_ADMAIN, ROLE_CUSTOMER } = require('../common/role');

const crypto = require('crypto');
const { pbkdf2, randomBytes } = crypto;
const { promisify } = require('util');
const uuid = require('uuid/v4');

const pbkdf2P = promisify(pbkdf2);
const randomBytesP = promisify(randomBytes);

async function genEncryptedPassword(rawPassword, salt) {
  if (!salt) salt = await randomBytesP(32);
  const encrypted = await pbkdf2P(rawPassword, salt.toString('base64'), 10000,
    128, 'sha512');
  return {
    encrypted: encrypted.toString('base64'),
    salt: salt.toString('base64'),
  };
}

module.exports = app => {

  const { Sequelize } = app;
  const { STRING, UUID, INTEGER, TEXT, Op } = Sequelize;

  const user = app.model.define('user',
    {
      id: {
        type: UUID,
        primaryKey: true,
      },
      username: {
        type: TEXT,
      },
      password: {
        type: STRING(256),
      },
      salt: {
        type: STRING(64),
      },
      phoneNumber: {
        type: STRING(32),
      },
      role: {
        type: INTEGER,
        allowNull: false,
        defaultValue: ROLE_CUSTOMER,
      },
      icon: {
        type: TEXT,
      },
      email: {
        type: STRING(64),
      },
    }, {
      indexes: [
        {
          fields: [ 'username' ],
          unique: true,
        },
        {
          fields: [ 'phoneNumber' ],
        },
      ],
    });

  user.sync()
    .catch(e => {
      app.logger.error('error syncing sequelize model', {
        error: e,
        model: 'user',
      });
    });

  user.createUserWithUnPw = async (username, password) => {
    const { salt, encrypted } = await genEncryptedPassword(password);
    let created = await user.create({
      id: uuid(),
      username,
      role: ROLE_ADMAIN, // TODO: 正式删除
      password: encrypted,
      salt,
    }, {
      raw: true,
    });
    created = created.toJSON();
    delete created.password;
    delete created.salt;
    return created;
  };

  user.loginWithUnPw = async (username, password) => {
    const [ found ] = await user.findAll({
      attributes: [ 'id', 'password', 'salt', 'role' ],
      where: {
        username: {
          [Op.eq]: username,
        },
      },
    });

    if (!found) return null;

    const foundPassword = found.password;

    const { encrypted: reEncryptedPassword } = await genEncryptedPassword(password, found.salt);

    if (foundPassword !== reEncryptedPassword) return null;
    const data = found.toJSON();
    delete data.password;
    delete data.salt;
    return data;
  };

  user.getUser = async (userId, select) => {
    const [ found ] = await user.findAll({
      attributes: select,
      where: {
        id: {
          [Op.eq]: userId,
        },
      },
    });

    return found ? found.toJSON() : null;
  };

  user.updateUser = async (userId, user) => {
    const result = await user.update(user, {
      where: {
        id: {
          [Op.eq]: userId,
        },
      },
    });
    return result;
  };

  return user;
};
