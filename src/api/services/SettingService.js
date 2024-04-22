
import clientAuth from "../clientAuth";
export default {
    index: () => clientAuth.get(`user/room/settings/index`),
    siteSettings: () => clientAuth.get(`common/common/settings`),
    store :(userData) => clientAuth.post('user/room/settings/store', { json: userData })
}
