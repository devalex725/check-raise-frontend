import AdminAuth from "../../AdminAuth";
export default {
  index: () => AdminAuth.get(`admin/emaillog/index`),
  show: (id) => AdminAuth.get(`admin/emaillog/show/${id}`),
  setting: () => AdminAuth.get("admin/emaillog/setting"),
  updateSetting: (json) => AdminAuth.put("admin/emaillog/setting", { json }),
};
