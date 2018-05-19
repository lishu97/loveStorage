import React from 'react';
import propTypes from 'prop-types';

import { Input, Button, Modal } from 'antd';

import Profile from './profile';
class BindLove extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    render() {
        const { value } = this.state;
        const {showLove, loveInfo, relationInfo} = this.props;
        return (
            <div className='bindLove'>
                {showLove ? <Profile userInfo={loveInfo} relationInfo={relationInfo} isShowLoveId={false} title="情侣信息" extra={<Button onClick={() => this.handleSubmit('stop')}>解除情侣</Button>}/> : (
                    <div className='loverInfo'>
                        <div>
                            <span>请输入对方的情侣ID</span>
                            <span>tip: 情侣ID可在个人信息中查看</span>
                        </div>
                        <Input value={value} onChange={this.handleChange} />
                        <Button type="primary" onClick={() => this.handleSubmit('start')}>确认</Button>
                    </div>
                )}
            </div>
        );
    }
    handleChange(e) {
        this.setState({
            value: e.target.value
        });
    }
    handleSubmit(opt) {
        const { onSubmit, loveInfo } = this.props;
        const { value } = this.state;
        switch(opt) {
        case 'start':
            Modal.confirm({
                title: '绑定情侣',
                content: '你确定要绑定吗?',
                onOk: () => {
                    onSubmit(value, opt);
                }
            });
            break;
        case 'stop':
            Modal.confirm({
                title: '解除情侣',
                content: '你确定要解除吗?',
                onOk: () => {
                    onSubmit(loveInfo.loveId, opt);
                }
            });
        }
    }
}
BindLove.propTypes = {
    onSubmit: propTypes.func,
    showLove: propTypes.bool,
    loveInfo: propTypes.object,
    relationInfo: propTypes.object
};
export default BindLove;