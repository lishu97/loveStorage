import React from 'react';
import propTypes from 'prop-types';

import moment from 'moment';
import { List, Icon } from 'antd';

import AnniversaryForm from './form/anniversary_form';

class Anniversary extends React.Component {
    constructor(props) {
        super(props);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    render() {
        const {data} = this.props;
        return (
            <div className="anniversary">
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
                                        <span>{moment(item.anniversaryTime).format('YYYY-MM-DD')}</span>
                                        <Icon style={{cursor: 'pointer', marginLeft: '10px'}} type="delete" onClick={() => {this.handleDelete(item.anniversaryId);}}/>
                                    </div>
                                )}
                                description={item.anniversaryContent}
                            />
                        </List.Item>
                    )}
                />
            </div>
        );
    }
    handleDelete(id) {
        const {onDelete} = this.props;
        onDelete(id);
    }
    handleSubmit(values) {
        const {onSubmit} = this.props;
        onSubmit(values);
    }
}
Anniversary.propTypes = {
    data: propTypes.array,
    onSubmit: propTypes.func,
    onDelete: propTypes.func
};
export default Anniversary;