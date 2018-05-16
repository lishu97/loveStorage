import fetchData from '../common/api';
import {message} from 'antd';

export const UPDATE_BOX_LIST = 'UPDATE_BOX_LIST';

export function updateBoxList(data) {
    return {
        type: UPDATE_BOX_LIST,
        data
    };
}
export function fetchBoxList() {
    return function(dispatch) {
        fetchData('status', {
            page: 0,
            web: 1
        })
            .then(function(res) {
                dispatch(updateBoxList(res.data.data.status));
            });
    };
}

export function createBoxList(value) {
    return function(dispatch) {
        fetchData('createStatus', {
            statusContent: value,
            statusTime: new Date(),
            web: 1
        }, 'post').then(function(res) {
            if(res.data.data.code === 0) {
                dispatch(fetchBoxList());
                return message.success('新增成功');
            }
            return message.error(res.data.msg);
        });
    };
}

export function delBoxItem(id) {
    return function(dispatch) {
        fetchData('deleteStatus', {
            statusId: id,
            web: 1
        }, 'post')
            .then(function(res) {
                if(res.data.data.code === 0 ) {
                    dispatch(fetchBoxList());
                    return message.success('删除成功');
                }
                return message.error(res.data.msg);
            });
    };
}