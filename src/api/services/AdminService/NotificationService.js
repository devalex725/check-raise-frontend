// import client from '../client';
import clientAuth from "../../AdminAuth";
export default {

//   store: (userData) =>client.post('common/contact/store', {json:userData}),
  index: () => clientAuth.get(`admin/notification/index`),
  update: (userData) =>clientAuth.put('admin/notification/update', {json:userData}),
  show :(id)=> clientAuth.get(`admin/notification/show/${id}`),
//   destroy: (id) => clientAuth.delete(`common/contact/delete/${id}`),

};