import React from 'react';
import propTypes from 'prop-types';

import { List } from 'antd';
import moment from 'moment';

class MailList extends React.Component {
    render() {
        const {mailList} = this.props;
        return (
            <List
                itemLayout="horizontal"
                dataSource={mailList}
                renderItem={item => (
                    <List.Item>
                        <List.Item.Meta
                            title={<span>{item.title}</span>}
                            description={(
                                <span>sendTo: {item.receiver} at {moment(parseInt(item.sendTime)).format('YYYY-MM-DD HH:mm:ss')}</span>
                            )}
                        />
                    </List.Item>
                )}
            />

        );
    }
}

MailList.propTypes = {
    mailList: propTypes.array
};

export default MailList;