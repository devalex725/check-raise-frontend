
import AdminAuth from "../../AdminAuth";
export default {

  
  index: () => AdminAuth.get(`admin/tournament/index`),
  store: (userData) => AdminAuth.post('admin/tournament/store', { json: userData }),
  update: (userData) =>AdminAuth.put('admin/tournament/update', {json:userData}),
  show :(id)=> AdminAuth.get(`admin/tournament/show/${id}`),
  destroy: (id) => AdminAuth.delete(`admin/tournament/destroy/${id}`),
  
  updatestatus: (userData) => AdminAuth.post('admin/tournament/updatestatus', { json: userData }),
  gettemplates :()=> AdminAuth.get(`admin/tournament/gettemplates`),
  load_template :(id)=> AdminAuth.get(`admin/tournament/load_template/${id}`),
  save_template: (userData) => AdminAuth.post(`admin/tournament/save_template`, { json: userData }),

  
};