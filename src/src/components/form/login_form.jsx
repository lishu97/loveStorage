import React from 'react';
import propTypes from 'prop-types';

import { Form, Input, Spin, Button } from 'antd';

const FormItem = Form.Item;

class LoginForm extends React.Component {
    constructor() {
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    render() {
        const {form, logining} = this.props;
        const {getFieldDecorator} = form;
        return (
            <Spin
                spinning={logining}
                tip="登录中...."
            >
                <Form layout="vertical">
                    <FormItem label="帐号"
                        required={true}
                    >
                        {
                            getFieldDecorator('username', {
                                rules: [
                                    {
                                        required: true,
                                        pattern: /^[a-zA-Z0-9_]{3,15}$/,
                                        message: '帐号格式错误'
                                    }
                                ]
                            })(
                                <Input type="text" placeholder="3-15位字母、数字或下划线"/>
                            )
                        }
                    </FormItem>
                    <FormItem label="密码">
                        {
                            getFieldDecorator('password', {
                                rules: [
                                    {
                                        required: true,
                                        pattern: /^.{3,15}$/,
                                        message: '密码格式错误'
                                    }
                                ]
                            })(
                                <Input type="password" placeholder="3-15位字符"/>
                            )
                        }
                    </FormItem>
                    <FormItem>
                        <Button type="primary" onClick={this.handleSubmit}>登录</Button>
                    </FormItem>
                </Form>
            </Spin>
        );
    }
    handleSubmit() {
        const { handleLogin, form } = this.props;
        const { validateFields } = form;
        validateFields((err, values) => {
            if (err) {
                return;
            }
            handleLogin(values);
        });
    }
}

LoginForm.propTypes = {
    logining: propTypes.bool,
    form: propTypes.object,
    handleLogin: propTypes.func
};

export default Form.create()(LoginForm);