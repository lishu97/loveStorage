// 计划书组件
import React from 'react';
import propTypes from 'prop-types';

import { List, Icon } from 'antd';

import moment from 'moment';
import AnniversaryForm from './form/anniversary_form';


class PlanList extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleChangePlan = this.handleChangePlan.bind(this);
    }
    render() {
        const {data} = this.props;
        return (
            <div>
                <AnniversaryForm onSubmit={this.handleSubmit}/>
                <List
                    itemLayout="horizontal"
                    dataSource={data}
                    renderItem={item => (
                        <List.Item
                        >
                            <List.Item.Meta
                                title={(
                                    <div>
                                        {item.planStatus ? <Icon type="check" style={{cursor: 'pointer'}} onClick={() => {this.handleChangePlan(item.planId, item.planStatus);}}/> : <Icon type="clock-circle-o" style={{cursor: 'pointer'}} onClick={() => {this.handleChangePlan(item.planId, item.planStatus);}}/>}
                                        <span style={{marginLeft: '10px'}}>{moment(item.planTime).format('YYYY-MM-DD')}</span>
                                        <Icon style={{marginLeft: '10px', cursor: 'pointer'}}  type="delete" onClick={() => {this.handleDelete(item.planId);}}/>
                                    </div>
                                )}
                                description={item.planContent}
                            />
                        </List.Item>
                    )}
                />
            </div>
        );
    }
    handleSubmit(values) {
        const {onSubmit} = this.props;
        onSubmit(values);
    }
    handleDelete(id) {
        const {onDelete} = this.props;
        onDelete(id);
    }
    handleChangePlan(id, curStatus) {
        const {onChangePlan} = this.props;
        onChangePlan(id, curStatus);
    }
}

PlanList.propTypes = {
    data: propTypes.array,
    onSubmit: propTypes.func,
    onDelete: propTypes.func,
    onChangePlan: propTypes.func
};

export default PlanList;