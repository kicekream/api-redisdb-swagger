const {promisify} = require('util');

exports.getAllHases = (redisClient, callback) => {
    redisClient.keys('*', (err, keys) => {
      if (err) {
        console.error(`Error retrieving redis hash '${hash}'`);
        callback(err);
      } else {
          
        const arrayOfPromises = keys.map(k => {
            return new Promise((resolve, reject) => {
                redisClient.hgetall(k, (err, user) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(user)
                    }
                })
            })
        });
        Promise.all(arrayOfPromises).then(users => {
            callback(null, users);
        }).catch(err => {
            console.log('errr getting users', err);
            callback(err);
        });
      }
    });
  };

exports.getHash = (redisClient, hash, callback) => {
  redisClient.hgetall(hash, (err, reply) => {
    if (err) {
      console.error(`Error retrieving redis hash '${hash}'`);
      callback(err);
    } else {
      callback(null, reply);
    }
  });
};

exports.setHash = (redisClient, hash, kvpairs, callback) => {
  redisClient.hmset(hash, kvpairs, (err, reply) => {
    if (err) {
      console.error(
        `Error storing redis hash '${hash}': ${JSON.stringify(kvpairs)}`
      );
      callback(err);
    } else {
      callback(null, reply);
    }
  });
};

exports.removeItem = (redisClient, key, callback) => {
  redisClient.del(key, callback);
};

/*
{
    'key1': '{ttttttt: 'dsdsd}',
    user1: {
        username: 'user1',
        password: 'dfsdfs'
    },
    book1: {

    }
}
*/
