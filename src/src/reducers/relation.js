import {GET_RELATION_INFO} from '../actions/relation';

const INIT_STATE = {
    relationInfo: {}
};

export default function(state = INIT_STATE, action) {
    switch(action.type) {
    case GET_RELATION_INFO:
        return Object.assign({}, state, {
            relationInfo: action.data
        });
    default:
        return state;
    }
}