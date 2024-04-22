
import AdminAuth from "../../AdminAuth";
export default {
 getUsers:(type,page) => AdminAuth.get(`admin/user/index?type=${type}&page=${page}`),
 updateStatus:(id,postData) => AdminAuth.post(`admin/user/updatestatus/${id}`,{json:postData}),
 verifyUser:(id) => AdminAuth.get(`admin/user/verified/${id}`),
 loginuser:(userData) => AdminAuth.post(`admin/user/loginuser`,{json:userData}),
 destroy:(id) => AdminAuth.delete(`admin/user/destroy/${id}`),
 
};