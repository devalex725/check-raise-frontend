// import client from '../client';
import AdminAuth from "../../AdminAuth";
export default {


  index: () => AdminAuth.get(`admin/user/players`),
  loginIn: (userData) => AdminAuth.post(`admin/user/loginuser`, { json: userData }),
  playerIndex: () => AdminAuth.get(`admin/player/index`),
  store: (id, userData) => AdminAuth.post(`admin/player/storebyrole/${id}`, { json: userData }),
  infoStatistics: (id) => AdminAuth.get(`admin/player/statistics/${id}`),
  saveexcel: (userId) => AdminAuth.get(`admin/player/saveexcel/${userId}`),
  updatesuspendstatus: (roomId,userId) => AdminAuth.post(`admin/player/updatesuspendstatus/${roomId}/${userId}`),
  playerStatistics: () => AdminAuth.get('admin/player/index'),
  show: (user_id) => AdminAuth.get(`admin/user/show/${user_id}`),
  destroy: (userId) => AdminAuth.delete(`admin/player/destroy/${userId}`),
  update: (user_id, userData) => AdminAuth.post(`admin/user/update/${user_id}`, { json: userData }),
  updateExpiry: (userData) => AdminAuth.post('admin/player/update_expiry', { json: userData }),
  updateFirstRegDate: (userData) => AdminAuth.post('admin/player/update_first_reg_date', { json: userData }),
};