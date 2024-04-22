// import client from '../client';
import AdminAuth from "../../AdminAuth";
export default {

  // Admin API

  adminIndex: () =>AdminAuth.get('admin/room/index'),

  adminUpdateRoomStatus: (status) =>AdminAuth.post('admin/room/status', {json:status}),

  adminShowById: (id) => AdminAuth.get(`admin/room/show/${id}`),

  adminUpdateRoom: (userData) =>AdminAuth.put('admin/room/update', {json:userData}),

  adminDestroy: (id) => AdminAuth.delete(`admin/room/destroy/${id}`),

  updateStatus: (userData) =>AdminAuth.post('admin/room/status', {json:userData}),

  getstatisticsbyroomid:(id) => AdminAuth.get(`admin/tournament/getstatisticsbyroomid/${id}`),

  gettournamentlistbyroomId:(id) => AdminAuth.get(`admin/tournament/gettournamentlistbyroomId/${id}`)


};