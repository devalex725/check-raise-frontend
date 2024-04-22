import client from '../client';

export default {
  store: (userData) => client.post('common/contact/store', { json: userData }),
};