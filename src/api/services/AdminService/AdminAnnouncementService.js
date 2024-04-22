
import AdminAuth from "../../AdminAuth";
export default {



    lateupdate: (id, userData) => AdminAuth.post(`admin/tournament/updatelatearrival/${id}`, { json: userData }),
    getlaterbyroom: () => AdminAuth.get('admin/tournament/getlatearrival'),

    destroy: (id) => AdminAuth.delete(`admin/tournament/destroylatearrival/${id}`),
    
    getlatearrivalbyid: (id) => AdminAuth.get(`admin/tournament/getlatearrivalbyid/${id}`),
};