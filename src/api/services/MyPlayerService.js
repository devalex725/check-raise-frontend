import client from "../client";
import clientAuth from "../clientAuth";
export default {
  //listing room index
  index: () => clientAuth.get("user/myplayer/index"),
  totalCount: () => clientAuth.get("user/myplayer/count"),
  store: (userData) =>
    clientAuth.post("user/myplayer/store", { json: userData }),
  infoStatistics: (id) => clientAuth.get(`user/player/statistics/${id}`),
  updatesuspendstatus: (userid) =>
    clientAuth.get(`user/myplayer/updatesuspendstatus/${userid}`),
  saveexcel: (userid) => clientAuth.get(`user/myplayer/saveexcel/${userid}`),
};
