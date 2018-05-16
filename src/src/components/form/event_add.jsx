import React from 'react';
import propTypes from 'prop-types';

import { Form, Input, Spin, Button, Radio } from 'antd';
import {eventLevel} from '../../common/const';

import EditorItem from '../editor';


const RadioGroup = Radio.Group;
const FormItem = Form.Item;

class EventAdd extends React.Component {
    constructor() {
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    render() {
        const {form, loading, defaultValue} = this.props;
        const {getFieldDecorator} = form;
        return (
            <Spin
                spinning={loading}
                tip="保存中"
            >
                <Form layout="vertical">
                    <FormItem label="标题"
                        required={true}
                    >
                        {
                            getFieldDecorator('title', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入事件标题'
                                    }
                                ],
                                initialValue: defaultValue.title ? defaultValue.title : ''
                            })(
                                <Input type="text" />
                            )
                        }
                    </FormItem>
                    <FormItem label="类型"
                    >
                        {
                            getFieldDecorator('level', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择事件类型'
                                    }
                                ],
                                initialValue: defaultValue.level ? defaultValue.level.toString() : ''
                            })(
                                <RadioGroup>
                                    {Object.keys(eventLevel).map(function(key, index) {
                                        return <Radio value={key} key={index}>{eventLevel[key]}</Radio>;
                                    })}
                                </RadioGroup>
                            )
                        }
                    </FormItem>
                    <FormItem label="内容">
                        {
                            getFieldDecorator('detail', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请填写内容'
                                    }
                                ],
                                initialValue: defaultValue.detail ? defaultValue.detail : ''
                            })(
                                <EditorItem/>
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
        const { onSubmit, form, defaultValue} = this.props;
        const { validateFields } = form;
        validateFields((err, values) => {
            if (err) {
                return;
            }
            let edit;
            if(defaultValue.eventId) {
                edit = true;
                values.id = defaultValue.eventId;
            }
            onSubmit(values, edit);
        });
    }
}

EventAdd.propTypes = {
    loading: propTypes.bool,
    form: propTypes.object,
    onSubmit: propTypes.func,
    defaultValue: propTypes.object.isRequired,
};

export default Form.create()(EventAdd);