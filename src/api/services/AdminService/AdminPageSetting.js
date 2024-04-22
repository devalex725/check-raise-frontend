// import client from '../client';
import AdminAuth from "../../AdminAuth";
export default {
  index: (filter) =>
    AdminAuth.get(`admin/page_setting/index`, { searchParams: filter }),
  show: (key) => AdminAuth.get(`admin/page_setting/show/${key}`),
  update: (userData) =>
    AdminAuth.put("admin/page_setting/update", { json: userData }),
};
