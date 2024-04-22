import client from '../client';
import clientAuth from "../clientAuth";
export default {
  // tournament listing 
  index: (rooms) => client.post(`tournament/index`, {
    json: {
      rooms: rooms,
    }
  }),
  table: (id) => client.get(`tournament/table/${id}`),
  show: (id) => client.get(`tournament/show/${id}`),
  
  getAdvertsing: () => client.get(`common/common/credits`),
  user: () => clientAuth.get('user/tournament/index'),
  store: (userData) => clientAuth.post('user/tournament/store', { json: userData }),

  update: (userData) => clientAuth.put('user/tournament/update', { json: userData }),
  director: () => clientAuth.get(`user/room/director`),
  directorUpdate: (userData) => clientAuth.post('user/room/director/update', { json: userData }),

  duplicate: (userData) => clientAuth.post('user/tournament/duplicate', { json: userData }),

  updateTournamentStatus: (userData) => clientAuth.post('user/tournament/updatestatus', { json: userData }),

  log: () => clientAuth.get(`user/tournament/log/index`),

  indexByAuth: (rooms) => clientAuth.post(`player/tournament/index`, {
    json: {
      rooms: rooms,
    }
  }),

  registration: (userData) => clientAuth.post('player/tournament/register', { json: userData }),
  cancelRegistration: (userData) => clientAuth.post('player/tournament/deregister', { json: userData }),
  cancelRegistrationFromWaiting: (userData) => clientAuth.post('player/tournament/deregisterfromwaiting', { json: userData }),

  // CheckIn Tournament

  checkInTournament: (id) => clientAuth.get(`user/tournament/checkin/index/${id}`),
  isCurrenttrnAnonymous: (slug,id) => clientAuth.get(`user/tournament/cuurentanonymous/${slug}/${id}`),
  getRegisterPlayer: (keyword, tournamentId) => clientAuth.get(`user/tournament/checkin/users?keyword=${keyword}&tournamentId=${tournamentId}`),
  RegisterPlayerById: (userData) => clientAuth.post('user/tournament/checkin/register', { json: userData }),
  updateexpiry: (userData) => clientAuth.post('user/tournament/checkin/updateexpiry', { json: userData }),

  updateIdCheck: (userData) => clientAuth.post('user/tournament/checkin/update_id_check', { json: userData }),

  cancleRegistrationById: (userData) => clientAuth.post('user/tournament/checkin/deregister', { json: userData }),

  checkInById: (userData) => clientAuth.post('user/tournament/checkin/checkin', { json: userData }),
  CancleCheckInById: (userData) => clientAuth.post('user/tournament/checkin/cancelcheckin', { json: userData }),

  plusReBuyById: (userData) => clientAuth.post('user/tournament/checkin/plusrebuy', { json: userData }),
  minusReBuyById: (userData) => clientAuth.post('user/tournament/checkin/minusrebuy', { json: userData }),

  updateMax_res_player: (userData) => clientAuth.post('user/tournament/checkin/updatecounts', { json: userData }),
  checkoutTournament: (userData) => clientAuth.post('user/tournament/checkin/checkout', { json: userData }),
  showByAuth: (id) => clientAuth.get(`player/tournament/show/${id}`),
  getCredits: () => clientAuth.get(`user/room/credit/transaction/index`),
  checkOrder: (data) => clientAuth.post(`user/room/credit/transaction/store`, { json: data }),
  set_premium: (data) => clientAuth.post(`user/tournament/set_premium`, { json: data }),

  storeDirector: (userData) => clientAuth.post('user/room/director/store', { json: userData }),
  destroyDirector: (id) => clientAuth.delete(`user/room/director/destroy/${id}`),

  loadtournament:(id) => clientAuth.get(`user/tournament/load_template/${id}`),
  destroy:(id) => clientAuth.delete(`user/tournament/destroy/${id}`),
  deleteFinished: (password) => clientAuth.delete('user/tournament/destroy_finished', {json: {password}}),

  templates: () => clientAuth.get(`user/tournament/templates`),
  createTemplate: (userData) => clientAuth.post(`user/tournament/templates`, { json: userData }),
  updateTemplate: (userData, id) => clientAuth.put(`user/tournament/templates/${id}`, { json: userData }),
  deleteTemplate: (id) => clientAuth.delete(`user/tournament/templates/${id}`),

  sendemail: (userData) => clientAuth.post('user/tournament/sendemail', { json: userData }),
  exportcsv: (id) => clientAuth.get(`user/tournament/exportcsv/${id}`),
  updatefreezestatus: (userData) => clientAuth.post('user/tournament/updatefreezestatus', { json: userData }),

  gettodaypremiumtournament: () => client.get('user/premiumtournament/gettodaypremiumtournament'),

  latearrival:(userData) => clientAuth.post('user/tournament/checkin/latearraival', { json: userData }),
  latearrivalremove:(id,playerid) => clientAuth.delete(`user/tournament/checkin/latearrivalremove/${id}/${playerid}`),
  
};