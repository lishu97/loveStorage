import fetchData from '../common/api';

export const GET_RELATION_INFO = 'GET_RELATION_INFO';

export function updateRelationInfo(data) {
    return {
        type: GET_RELATION_INFO,
        data
    };
}
export function fetchRelationInfo() {
    return function(dispatch) {
        fetchData('relationInfo', {
            web: 1
        })
            .then(function(res) {
                dispatch(updateRelationInfo(res.data.data.relationInfo));
            });
    };
}