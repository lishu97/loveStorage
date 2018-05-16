import {UPDATE_USER_INFO, CLEAN_USER_INFO, UPDATE_LOVE_INFO} from '../actions/user';
const INIT_STATE = {
    userInfo: {},
    loveInfo: {}
};

export default function(state = INIT_STATE, action) {
    switch (action.type) {
    case UPDATE_LOVE_INFO:
        return Object.assign({}, state, {
            loveInfo: action.data
        });
    case UPDATE_USER_INFO:
        return Object.assign({}, state, {
            userInfo: action.data
        });
    case CLEAN_USER_INFO:
        return {
            userInfo: {}
        };
    default:
        return state;
    }
}