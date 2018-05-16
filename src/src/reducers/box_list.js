import {UPDATE_BOX_LIST} from '../actions/box_list';

const INIT_STATE = {
    list: []
};

export default function(state = INIT_STATE, action) {
    switch(action.type) {
    case UPDATE_BOX_LIST:
        return Object.assign({}, state, {
            list: action.data
        });
    default:
        return state;
    }
}