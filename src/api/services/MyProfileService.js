import clientAuth from "../clientAuth";

export default {
  // 
  Show: () => clientAuth.get("user/profile/show"),
  update: (userData) => clientAuth.post("user/profile/update",{json:userData}),
};