import client from "../client";

export default {
  // 
  // PlayerRegistration: (userData) => client.post("user/registration/player/create", {json: userData}),

  create: (userData) =>client.post('user/registration/player/create', {json:userData})
};