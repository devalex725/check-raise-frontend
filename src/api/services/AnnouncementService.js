
import clientAuth from "../clientAuth";
export default {


    lateremove: (id) => clientAuth.delete(`player/tournament/lateremove/${id}`),

    lateupdate: (id, userdata) => clientAuth.post(`player/tournament/lateupdate/${id}`, { json: userdata }),
    getlaterbyroom: () => clientAuth.get(`user/tournament/getlaterbyroom`),
    update: (id, userData) => clientAuth.post(`user/tournament/getlaterbyroom/${id}`, { json: userData }),
    destroy: (id) => clientAuth.delete(`user/tournament/latedestroybyroom/${id}`),

    updatelatearrival: (id, userData) => clientAuth.post(`user/tournament/latepdatebyroom/${id}`, { json: userData }),
    getlatearrivalbyid: (id) => clientAuth.get(`user/tournament/getlatearrivalbyid/${id}`),

};