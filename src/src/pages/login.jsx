import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import { Card } from 'antd';

import SignUpForm from '../components/form/signup_form';
import LoginForm from '../components/form/login_form';

import { login, signUp } from '../actions/user';

function mapProps(state) {
    return {
        user: state.user
    };
}

class LoginPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            curTabKey: 'login'
        };
        this.handleTabChange = this.handleTabChange.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.handleSignUp = this.handleSignUp.bind(this);
    }
    render() {
        const tabContent = {
            login: <LoginForm logining={false} handleLogin={this.handleLogin}/>,
            signUp: <SignUpForm loading={false} handleSignUp={this.handleSignUp}/>
        };
        const tabList = [
            {
                key: 'login',
                tab: '登录'
            },
            {
                key: 'signUp',
                tab: '注册'
            }
        ];
        return (
            <div className="login-page">
                {/*<Particle/>*/}
                <div className="login-dig">
                    <Card tabList={tabList} onTabChange={this.handleTabChange} >
                        {tabContent[this.state.curTabKey]}
                    </Card>
                </div>
            </div>
        );
    }
    handleTabChange(key) {
        this.setState({
            curTabKey: key 
        });
    }
    handleLogin(values) {
        const {dispatch} = this.props;
        dispatch(login(values));
    }
    handleSignUp(values) {
        const {dispatch} = this.props;
        dispatch(signUp(values));
    }
}
LoginPage.propTypes = {
    user: propTypes.object,
    dispatch: propTypes.func
};
export default connect(mapProps)(LoginPage);



