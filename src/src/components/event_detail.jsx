import React from 'react';
import propTypes from 'prop-types';

import {Card, Button, Icon} from 'antd';
import EventAdd from './form/event_add';
class EventDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editable: false 
        };
        this.handleClickEdit = this.handleClickEdit.bind(this);
    }
    render() {
        const {defaultValue, addEvent, loading, onEventSubmit} = this.props;
        const {editable} = this.state;
        const extra = (
            <Button type="primary" shape="circle" icon="edit" onClick={this.handleClickEdit}/>
        );
        const iconColor = defaultValue.level === 1 ? 'pink' : 'black';
        const detail = (
            <Card
                title={<span><Icon type="heart" style={{color: iconColor}}/>{defaultValue.title}</span>}
                extra={extra}
                bodyStyle={{width: '100%', height: '500px', overflow: 'auto'}}
                bordered={false}
            >
                <div dangerouslySetInnerHTML={{
                    __html: defaultValue.detail
                }} className="content-body"/> 
            </Card>
        );
        if(addEvent) {
            return <EventAdd defaultValue={{}} loading={false} onSubmit={onEventSubmit}/>;
        }
        return (
            <div>
                {editable ? <EventAdd defaultValue={defaultValue} loading={loading} onSubmit={onEventSubmit}/> : detail}
            </div>
        );
    }
    handleClickEdit() {
        this.setState({
            editable: true
        });
    }
}
EventDetail.propTypes = {
    addEvent: propTypes.bool,
    defaultValue: propTypes.object,
    loading: propTypes.bool,
    onEventSubmit: propTypes.func
};
export default EventDetail;