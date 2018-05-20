import React from 'react';
import propTypes from 'prop-types';

import { List, Avatar, Input, Icon, Button } from 'antd';


const {TextArea} = Input;

class BoxList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: ''
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }
    render() {
        const {data, avatar, nick} = this.props;
        const {text} = this.state;
        return (
            <div className="box">
                <TextArea value={text} placeholder="记录此时此刻的想法..." onChange={(e) => {this.setState({text: e.target.value});}}/>
                <Button type="primary" onClick={this.handleSubmit}>保存</Button>
                <List
                    itemLayout="horizontal"
                    dataSource={data}
                    renderItem={item => (
                        <List.Item>
                            <List.Item.Meta
                                title={(
                                    <div>
                                        <div style={{ float: 'left' }}>
                                            <Avatar src={avatar} />
                                        </div>
                                        <div style={{ paddingLeft: '50px' }}>
                                            <span className="nickname">{nick}</span>
                                            <span className="statustime">{item.statusTime}</span>
                                            <Icon style={{cursor: 'pointer', marginLeft: '10px'}} type="delete" onClick={() => {this.handleDelete(item.statusId);}}/>
                                        </div>
                                    </div>
                                )}
                                description={item.statusContent}
                            />
                        </List.Item>
                    )}
                />
            </div>
        );
    }
    handleSubmit() {
        const {text} = this.state;
        const {onSubmit} = this.props;
        onSubmit(text);
    }
    handleDelete(id) {
        const {onDelete} = this.props;
        onDelete(id);
    }
}

BoxList.propTypes = {
    data: propTypes.array,
    onSubmit: propTypes.func,
    avatar: propTypes.string,
    nick: propTypes.string,
    onDelete: propTypes.func
};

export default BoxList;