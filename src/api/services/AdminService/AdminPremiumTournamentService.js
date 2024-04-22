import AdminAuth from "../../AdminAuth";

export default {
  index: () => AdminAuth.get(`admin/premium_tournaments/index`),
  show: (id) => AdminAuth.get(`admin/premium_tournaments/show/${id}`),
  update: (id, userData) => AdminAuth.put(`admin/premium_tournaments/update/${id}`, { json: userData }),
  destroy: (id) => AdminAuth.delete(`admin/premium_tournaments/delete/${id}`),
};