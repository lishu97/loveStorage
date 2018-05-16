import {UPDATE_ANNIVERSARY_LIST} from '../actions/anniversary';

const INIT_STATE = {
    list: []
};

export default function(state = INIT_STATE, action) {
    switch(action.type) {
    case UPDATE_ANNIVERSARY_LIST:
        return Object.assign({}, state, {
            list: action.data
        });
    default:
        return state;
    }
}