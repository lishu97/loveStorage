import {UPDATE_PLAN_LIST} from '../actions/plan';

const INIT_STATE = {
    list: []
};

export default function(state = INIT_STATE, action) {
    switch(action.type) {
    case UPDATE_PLAN_LIST:
        return Object.assign({}, state, {
            list: action.data
        });
    default:
        return state;
    }
}