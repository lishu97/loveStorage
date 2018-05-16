import fetchData from '../common/api';
import {message} from 'antd';

export const UPDATE_ANNIVERSARY_LIST = 'UPDATE_ANNIVERSARY_LIST';

export function updateAnniversaryList(data) {
    return {
        type: UPDATE_ANNIVERSARY_LIST,
        data
    };
}

export function fetchAnniversaryList(relationId) {
    return function(dispatch) {
        fetchData('anniversary', {
            relationId
        }).then(function(res) {
            if(res.data.data.code === 0) {
                return dispatch(updateAnniversaryList(res.data.data.data));
            }
            message.error(res.data.msg);
        });
    };
}

export function addAnniversary(values, relationId) {
    return function(dispatch) {
        fetchData('createAnniversary', {
            anniversaryContent: values.detail,
            anniversaryTime: values.time.toDate(),
            relationId
        }, 'post')
            .then(function(res) {
                if(res.data.data.code === 0) {
                    dispatch(fetchAnniversaryList(relationId));
                    return message.success('新增纪念日成功');
                }
                return message.error(res.data.msg);
            });
    };
}

export function delAnniversary(relationId, id) {
    return function(dispatch) {
        fetchData('deleteAnniversary', {
            relationId,
            anniversaryId: id
        }, 'post')
            .then(function(res) {
                if(res.data.data.code === 0) {
                    dispatch(fetchAnniversaryList(relationId));
                    return message.success('删除纪念日成功');
                }
                return message.error(res.data.msg);
            });
    };
}