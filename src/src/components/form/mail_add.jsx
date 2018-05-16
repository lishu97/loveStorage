import React from 'react';
import propTypes from 'prop-types';
import { Form, Input, Spin, Button, DatePicker, message } from 'antd';

import EditorItem from '../editor';
import REG from '../../../../enums/reg';
import moment from 'moment';

const FormItem = Form.Item;

class MailAddForm extends React.Component {
    constructor() {
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    render() {
        const { form, loading } = this.props;
        const { getFieldDecorator } = form;
        return (
            <Spin
                spinning={loading}
                tip="保存中"
            >
                <Form layout="vertical">
                    <FormItem label="收件人邮箱"
                        required={true}
                    >
                        {
                            getFieldDecorator('receiver', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入邮箱地址'
                                    },
                                    {
                                        validator: (rule, value, cb) => {
                                            REG.mailReg.test(value) ? cb() : cb('邮件地址不合法');
                                        }
                                    }
                                ],
                            })(
                                <Input type="text" />
                            )
                        }
                    </FormItem>
                    <FormItem label="标题"
                        required={true}
                    >
                        {
                            getFieldDecorator('title', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入邮件标题'
                                    }
                                ],
                            })(
                                <Input type="text" />
                            )
                        }
                    </FormItem>
                    <FormItem label="发送时间"
                    >
                        {
                            getFieldDecorator('sendTime', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择发送时间'
                                    }
                                ],
                            })(
                                <DatePicker
                                    format="YYYY-MM-DD HH:mm:00"
                                    showTime={{
                                        format: 'HH:mm'
                                    }}
                                    showToday={true}
                                    disabledDate={
                                        (cur) => {
                                            return cur && cur.diff(new moment(), 'days') < 0;    
                                        }
                                    }
                                    disabledTime={
                                        (cur) => {
                                            return {
                                                disabledHours: () => {
                                                    let result = [];
                                                    if(cur && cur.diff(new moment(), 'days') === 0) {
                                                        for(let i = 0; i < 24; i++) {
                                                            if(i < new moment().hours()) {
                                                                result.push(i);
                                                            }
                                                        }
                                                        return result;
                                                    }
                                                    return [];
                                                },
                                                disabledMinutes: () => {
                                                    let result = [];
                                                    if(cur && cur.diff(new moment(), 'days') === 0) {
                                                        for(let i = 0; i < 60; i++) {
                                                            if(i < new moment().minutes() + 5) {
                                                                result.push(i);
                                                            }
                                                        }
                                                        return result;
                                                    }
                                                    return [];
                                                }
                                            };    
                                        }
                                    }
                                    placeholder="Select Time"
                                />

                            )
                        }
                    </FormItem>
                    <FormItem label="内容">
                        {
                            getFieldDecorator('content', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请填写内容'
                                    }
                                ],
                            })(
                                <EditorItem />
                            )
                        }
                    </FormItem>
                    <FormItem>
                        <Button type="primary" onClick={this.handleSubmit}>保存</Button>
                    </FormItem>
                </Form>
            </Spin>
        );
    }
    handleSubmit() {
        const { onSubmit, form } = this.props;
        const { validateFields } = form;
        validateFields((err, values) => {
            if (err) {
                return;
            }
            values.sendTime = new moment(values.sendTime.format('YYYY-MM-DD HH:mm') + ':00');
            // 再次检查发送时间是否大于现在时间五分钟
            if(values.sendTime.diff(new moment(), 'minutes') < 5) {
                return message.error('邮件发送时间与现在的时间间隔必须大于五分钟哟！');
            }
            values.sendTime = values.sendTime.valueOf();
            onSubmit(values);
        });
    }
}

MailAddForm.propTypes = {
    loading: propTypes.bool,
    form: propTypes.object,
    onSubmit: propTypes.func,
};

export default Form.create()(MailAddForm);