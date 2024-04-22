import client from "../client";
import clientAuth from "../clientAuth";
export default {
  // room listing

  show: (id) => client.get(`room/show/${id}`),

  //manager registration
  create: (userData) =>
    client.post("user/registration/manager/create", { json: userData }),

  //listing room index
  index: () => clientAuth.get("user/room/index"),
  directorindex: () => clientAuth.get("user/director/getroom "),
  getAllRoom: (filters) => client.get("room/index", { searchParams: filters }),

  //create room

  store: (userData) => clientAuth.post("user/room/store", { json: userData }),
  //show room auth api
  user: (id) => clientAuth.get(`user/room/show/${id}`),

  //delet room auth api
  destroy: (id) => clientAuth.delete(`user/room/destroy/${id}`),

  update: (userData) => clientAuth.put("user/room/update", { json: userData }),
  updateStatus: (status) =>
    clientAuth.put("user/room/update_status", { json: { status } }),

  //player  list api
  player: () => clientAuth.get("user/room/player"),
  playerStatistics: () => clientAuth.get("user/player/index"),
  infoStatistics: (id) => clientAuth.get(`user/player/statistics/${id}`),

  //get City ByZipcode
  getCity: (code) => client.get(`common/common/zipcode?code=${code}`),

  getmodalcontent: (lang) =>
    client.get(
      `common/common/popup?popup_key=rm_registration&language=${lang}`
    ),

  roomStatistics: () => clientAuth.get("user/room/statistics"),
  tournamentList: () => clientAuth.get("user/room/tournamentList"),

  //common room
  common: (status) =>
    client.get("common/common/getrooms", { searchParams: { status } }),
};
