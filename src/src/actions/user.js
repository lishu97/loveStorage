import fetchData from '../common/api';
import {message} from 'antd';
import {browserHistory} from 'react-router';

export const UPDATE_USER_INFO = 'UPDATE_USER_INFO';
export const CLEAN_USER_INFO = 'CLEAN_USER_INFO';
export const UPDATE_LOVE_INFO = 'UPDATE_LOVE_INFO';

export function updateLoveInfo(data) {
    return {
        type: UPDATE_LOVE_INFO,
        data
    };
}
export function updateUserInfo(data) {
    return {
        type: UPDATE_USER_INFO,
        data
    };
}
export function cleanUserInfo() {
    return {
        type: CLEAN_USER_INFO
    };
}

export function fetchLoveInfo() {
    return function(dispatch) {
        fetchData('loverInfo', {
            web: 1
        })
            .then(function(res) {
                if(res.data.data.code === 0) {
                    return dispatch(updateLoveInfo(res.data.data.lover));
                }
                return message.error(res.data.msg);
            });
    };
}
export function signUp(data) {
    return function(dispatch) {
        fetchData('signUp', data, 'post')
            .then(function(res) {
                if(res.data.data.code === 0) {
                    dispatch(updateUserInfo(res.data.data));
                    return browserHistory.push('/');
                }
                return message.error(res.data.msg);
            }).catch(function(err) {
                message.error(err.message);
            });
    };
}
export function login(data) {
    return function(dispatch) {
        fetchData('signIn', data, 'post')
            .then(function(res) {
                if(res.data.data.code === 0) {
                    dispatch(updateUserInfo(res.data.data));
                    return browserHistory.push('/');
                }
                return message.error(res.data.msg);
            });
    };
}
export function fetchUserInfo() {
    return function(dispatch) {
        fetchData('userInfo')
            .then(function(res) {
                dispatch(updateUserInfo(res.data.data));
            }).catch(function(err) {
                message.error(err.message);
            });
    };
}

export function bindLove(myLoveId, loveId, opt) {
    return function(dispatch) {
        fetchData('updateRelation', {
            loveId1: myLoveId,
            loveId2: loveId,
            operation: opt
        }, 'post')
            .then(function(res) {
                if(res.data.data.code === 0) {
                    dispatch(fetchUserInfo());
                    dispatch(fetchLoveInfo());
                    return opt === 'start' ? message.success('绑定成功') : message.success('解除成功');
                }
                return message.error(res.data.msg);
            });
    };
}

export function exit() {
    return function() {
        fetchData('exit')
            .then(function(res) {
                if(res.data.data.code === 0) {
                    message.success('注销成功');
                    browserHistory.push('/login');
                }
            });
    };
}



