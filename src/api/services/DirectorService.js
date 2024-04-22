
import clientAuth from "../clientAuth";
export default {

    index: () => clientAuth.get(`user/director/index`),
    store: (userData) => clientAuth.post('user/director/store', { json: userData }),
    update: (userData) => clientAuth.put('user/director/update', { json: userData }),
    destroyDirector: (id) => clientAuth.delete(`user/director/destroy/${id}`),
    updatetournamentstatus: (id) => clientAuth.get(`user/director/updatetournamentstatus/${id}`),
    archivetournament: (id) => clientAuth.get(`user/director/archivetournament/${id}`),
    sendemail: (userData) => clientAuth.post('user/director/sendemail', { json: userData }),
    exportcsv: (id) => clientAuth.get(`user/director/exportcsv/${id}`),
    templates: () => clientAuth.get(`user/director/templates`),
    show: (id) => clientAuth.get(`user/director/show/${id}`),
    loadtournament:(id) => clientAuth.get(`user/director/load_template/${id}`),
    save_template: (userData) => clientAuth.post(`user/director/save_template`, { json: userData })
}