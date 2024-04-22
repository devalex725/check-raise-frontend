
import AdminAuth from "../../AdminAuth";
export default {

  
  index: () => AdminAuth.get(`common/contact/index`),
  update: (userData) =>AdminAuth.put('common/contact/update', {json:userData}),
  show :(id)=> AdminAuth.get(`common/contact/show/${id}`),
  destroy: (id) => AdminAuth.delete(`common/contact/delete/${id}`),

};