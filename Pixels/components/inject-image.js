const axios = require('../lib/axios');
const { noConnection } = require('./error');

module.exports.injectImage = function(id) {
  return axios.get(`https://unsplash-xd-endpoint.herokuapp.com/data-bit/?id=${id}`)
  .then((res) => res.data)
  .catch((error) =>{ noConnection() })
}
