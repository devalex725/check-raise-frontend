import client from '../client';
import clientAuth from "../clientAuth";
export default {
  index: () => clientAuth.get('user/banner/index'),
  store: (userData) => clientAuth.post('user/banner/store', { json: userData }),
  destroyBanner: (id) => clientAuth.delete(`user/banner/destroy/${id}`),
  todayBanner: (id) => client.get(`user/banner/gettodaybanner/${id}`),
  editBanner: (id) => clientAuth.get(`user/banner/edit/${id}`),
  getcredit: (id) => clientAuth.get(`user/banner/getcredit`),
  updateBanner: (id,userData) => clientAuth.put(`user/banner/update/${id}`, { json: userData }),
  getbannerweekly: () => clientAuth.get(`user/banner/getbannerweekly`),
  getuserCredit: () => clientAuth.get(`user/room/credit/transaction/index`),
};