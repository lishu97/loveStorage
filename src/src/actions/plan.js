import fetchData from '../common/api';
import {message} from 'antd';

export const UPDATE_PLAN_LIST = 'UPDATE_PLAN_LIST';

export function updatePlanList(data) {
    return {
        type: UPDATE_PLAN_LIST,
        data
    };
}

export function changePlanStatus(relationId, planId, operation) {
    return function(dispatch) {
        fetchData('updatePlan', {
            relationId,
            planId,
            operation
        }, 'post')
            .then(function(res) {
                if(res.data.data.code === 0) {
                    message.success('更新状态成功');
                    return dispatch(fetchPlanList(relationId));
                }
                return message.error(res.data.msg);
            });
    };
}
export function fetchPlanList(relationId) {
    return function(dispatch) {
        fetchData('plan', {
            relationId
        }).then(function(res) {
            if(res.data.data.code === 0) {
                return dispatch(updatePlanList(res.data.data.data));
            }
            return message.error('请先绑定情侣再使用此功能,否则将无法使用');
        });
    };
}

export function deletePlan(planId, relationId) {
    return function(dispatch) {
        fetchData('deletePlan', {
            planId,
            relationId
        }, 'post')
            .then(function(res) {
                if(res.data.data.code === 0) {
                    dispatch(fetchPlanList(relationId));
                    return message.success('删除成功');
                }
                return message.error(res.data.msg);
            });      
    };
}

export function addPlan(values, relationId) {
    return function(dispatch) {
        fetchData('createPlan', {
            planContent: values.detail,
            planTime: values.time.toDate(),
            relationId
        }, 'post')
            .then(function(res) {
                if(res.data.data.code === 0) {
                    dispatch(fetchPlanList(relationId));
                    return message.success('新增计划成功');
                }
                if(res.data.msg === '不存在relationId=0的relation') {
                    return message.error('请先绑定情侣再使用此功能,否则将无法使用');
                }
                return message.error(res.data.msg);
            });        
    };
}