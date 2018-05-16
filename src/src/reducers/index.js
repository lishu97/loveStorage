import {combineReducers } from 'redux';

import user from './user';
import boxList from './box_list';
import plan from './plan';
import anniversary from './anniversary';
const appReducer = combineReducers({
    user,
    boxList,
    plan,
    anniversary
});

export default appReducer;