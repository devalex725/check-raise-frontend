import client from "../client";
import clientAuth from "../clientAuth";

export default {
  //
  login: (email, password) =>
    client.post("session/login", {
      json: {
        email: email,
        password: password,
        device_name: "web",
      },
    }),
  //
  logout: () => clientAuth.post("session/logout"),
  index: () => clientAuth.get("user/profile/show"),
  forgotPassword: (email) =>
    client.post("session/forgot-password", { json: { email } }),
  resetPassword: (data) =>
    client.post("session/reset-password", { json: data }),
  info: () => client.get("common/common/pagesetting"),
  // https://api.checkraise.ch/api/tournament/getfilterdata?type=""&roomids=9983,9989&canton=BE,FR&dealertype=""
  roomids: (roomid) => client.get(`tournament/getfilterdata?roomids=${roomid}`),
  // filter:(roomid,cantons,types,dealer,from,to,minbuyin,maxbuyin,reentry,isshorthanded) => client.get(`tournament/getfilterdata?roomids=${roomid}&canton=${cantons}&type=${types}&dealertype=${dealer}&from=${from}&to=${to}&minbuyin=${minbuyin}&maxbuyin=${maxbuyin}&reentry=${reentry}&isshorthanded=${isshorthanded}`),
  filter: (searchParams) =>
    client.get("tournament/getfilterdata", { searchParams }),
};
