import axios from 'axios';

const urlMap = {
    signUp: '/api/sign_up',
    signIn: '/api/sign_in',
    exit: '/api/user/exit',
    loverInfo: '/api/lover_info',
    updateRelation: '/api/update_relation',
    userInfo: '/api/user/info',
    
    status: '/api/status',
    createStatus: '/api/create_status',
    deleteStatus: '/api/delete_status',

    plan: '/api/plan',
    createPlan: '/api/create_plan',
    updatePlan: '/api/update_plan',
    deletePlan: '/api/delete_plan',
    
    anniversary: '/api/anniversary',
    createAnniversary: '/api/create_anniversary',
    deleteAnniversary: '/api/delete_anniversary'    
};

export default function(url, data, method) {
    switch(method) {
    case 'get':
        return axios.get(urlMap[url], {
            params: data
        });
    case 'post':
        return axios.post(urlMap[url], data);
    default:
        return axios.get(urlMap[url], {
            params: data
        });
    }
}