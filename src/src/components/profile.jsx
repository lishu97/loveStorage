import React from 'react';
import propTypes from 'prop-types';

import {Card, Avatar} from 'antd';
class Profile extends React.Component {
    render() {
        const {userInfo, title, extra} = this.props;
        return (
            <Card
                title={title}
                hoverable={true}
                extra={extra ? extra : null}
            >
                <Avatar src={userInfo.avatar}/>
                <div>
                    <span>用户名：</span>
                    <span>{userInfo.username}</span>
                </div>
                <div>
                    <span>昵称：</span>
                    <span>{userInfo.nickname}</span>
                </div>
                <div>
                    <span>情侣ID：</span>
                    <span>{userInfo.loveId}</span>
                </div>
                <div>
                    <span>注册日期：</span>
                    <span>{userInfo.regTime}</span>
                </div>
            </Card>
        );
    }
}

Profile.propTypes = {
    userInfo: propTypes.object,
    title: propTypes.string,
    extra: propTypes.element
};
export default Profile;