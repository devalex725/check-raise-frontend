
import clientAuth from "../clientAuth";
export default {


  index: () => clientAuth.post(`player/tournament/index`),
  deregister: (userData) =>clientAuth.post('player/tournament/deregister', {json:userData}),
  register: (userData) =>clientAuth.post('player/tournament/register', {json:userData}),
  mytournament: () => clientAuth.get(`player/tournament/mytournament`),
};