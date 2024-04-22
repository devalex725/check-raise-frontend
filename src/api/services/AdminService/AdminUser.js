import client from "../../client";
import AdminAuth from "../../AdminAuth";

export default {
  // 
  login: (email,password) => client.post("session/login",{json:{
    email: email,
    password: password,
    device_name:"web"
  }}),
  //
  logout:()=> AdminAuth.post("session/logout"),
  index:()=> AdminAuth.get("user/profile/show")
};