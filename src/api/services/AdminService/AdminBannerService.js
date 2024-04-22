
import AdminAuth from "../../AdminAuth";
export default {
  index: () => AdminAuth.get(`admin/banner/index`),
  show :(id)=> AdminAuth.get(`admin/banner/show/${id}`),
  update: (id, userData) =>AdminAuth.put(`admin/banner/update/${id}`, {json:userData}),
  destroy: (id) => AdminAuth.delete(`admin/banner/delete/${id}`),
};