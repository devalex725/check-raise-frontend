
import clientAuth from "../clientAuth";
export default {
  index: () => clientAuth.get('user/premiumtournament/index'),
  store:(userData)=>clientAuth.post('user/premiumtournament/store',{ json: userData }),
  destroyPremiumTournament: (id) => clientAuth.delete(`user/premiumtournament/destroy/${id}`),
  editPreminumtournament: (id) => clientAuth.get(`user/premiumtournament/edit/${id}`),

  updatePreminumtournament: (id,userData) => clientAuth.put(`user/premiumtournament/update/${id}`, { json: userData }),

  getroomtournamets: () => clientAuth.get('user/premiumtournament/getroomtournamets'),
  getcredit: () => clientAuth.get('user/premiumtournament/getcredit'),
  getpremiumweekly: () => clientAuth.get(`user/premiumtournament/getPremiumweekly`),
  getuserCredit: () => clientAuth.get(`user/room/credit/transaction/index`),
};