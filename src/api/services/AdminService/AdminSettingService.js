
import AdminAuth from "../../AdminAuth";
export default {

  // Admin API

  adminIndex: () => AdminAuth.get('admin/credit/index'),

  SettingIndex: () => AdminAuth.get('admin/setting/index'),
  update: (id, userData) => AdminAuth.put(`admin/credit/update/${id}`, { json: userData }),
  Settingupdate: (id, userData) => AdminAuth.put(`admin/setting/update/${id}`, { json: userData }),
  rollingtimeupdate:(id, slug ,userData) => AdminAuth.put(`admin/setting/update/rollingtime/${id}/${slug}`, { json: userData }),
  defaultbanner:(id, slug) => AdminAuth.put(`admin/setting/update/defaultbanner/${id}/${slug}`),
  actionbanner:(id, slug) => AdminAuth.put(`admin/setting/update/bannerposition/${id}/${slug}`),
  updateBannerInterval:(slug ,userData) => AdminAuth.put(`admin/setting/update/banner_interval/${slug}`, { json: userData }),
};