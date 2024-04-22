
import AdminAuth from "../../AdminAuth";
export default {

    // Admin API

    adminIndex: () => AdminAuth.get('admin/transaction/index'),
    destroy: (id) => AdminAuth.delete(`admin/transaction/destroy/${id}`),
   
    edit: (id) => AdminAuth.get(`admin/transaction/edit/${id}`),
    update: (id,userData) => AdminAuth.put(`admin/transaction/update/${id}`, { json: userData }),
};