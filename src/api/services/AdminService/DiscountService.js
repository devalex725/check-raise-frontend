
import AdminAuth from "../../AdminAuth";
export default {

    // Admin API

    adminIndex: () => AdminAuth.get('admin/discount/index'),
    destroy: (id) => AdminAuth.delete(`admin/discount/destroy/${id}`),
    insert: (userData) => AdminAuth.post(`admin/discount/store`, { json: userData }),
    edit: (id) => AdminAuth.get(`admin/discount/edit/${id}`),
    update: (id,userData) => AdminAuth.put(`admin/discount/update/${id}`, { json: userData }),
};