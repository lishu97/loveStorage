import React from 'react';
import propTypes from 'prop-types';

import { Form, Input, Spin, Button} from 'antd';

import AvatarUpload from '../avatar_upload';

const FormItem = Form.Item;
class signUpForm extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    render() {
        const { loading, form} = this.props;
        const {getFieldDecorator, getFieldValue} = form;
        return (
            <Spin spinning={loading} tip="注册中">
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
                                <Input type="password"  placeholder="3-15位字符"/>
                            )
                        }
                    </FormItem>
                    <FormItem label="重复密码">
                        {
                            getFieldDecorator('repasswd', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请再次输入密码'
                                    },
                                    {
                                        validator: (rule, repasswd, cb) => {
                                            repasswd === getFieldValue('password') ? cb() : cb('两次输入密码不一致');
                                        }
                                    }
                                ]
                            })(
                                <Input type="password" placeholder='与密码相同'/>
                            )
                        }
                    </FormItem>
                    <FormItem label="昵称">
                        {
                            getFieldDecorator('nickname', {
                                rules: [
                                    {
                                        required: true,
                                        min: 3,
                                        max: 15,
                                        message: '昵称格式错误'
                                    }
                                ]
                            })(
                                <Input type="text" placeholder='3-15个字符或汉字'/>
                            )
                        }
                    </FormItem>
                    <FormItem label="头像">
                        {
                            getFieldDecorator('avatar')(
                                <AvatarUpload
                                    action='/api//upload_avatar'
                                />
                            )
                        }
                    </FormItem>
                    <FormItem wrapperCol={{span: 20}}>
                        <Button type="primary" onClick={this.handleSubmit}>注册</Button>
                    </FormItem>
                </Form>
            </Spin>
        );
    }
    handleSubmit() {
        const { handleSignUp, form } = this.props;
        const { validateFields } = form;
        validateFields((err, values) => {
            if (err) {
                return;
            }
            handleSignUp(values);
        });
    }
}

signUpForm.propTypes = {
    loading: propTypes.bool,
    form: propTypes.object,
    handleSignUp: propTypes.func
};

export default Form.create()(signUpForm);