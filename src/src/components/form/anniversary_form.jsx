import React from 'react';
import propTypes from 'prop-types';

import { Form, Input, Button, DatePicker } from 'antd';

const FormItem = Form.Item;

class AnniversaryForm extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    render() {
        const {form, type} = this.props;
        const {getFieldDecorator} = form;
        let title;
        if(type === 'plan') {
            title = '计划';
        } else if(type === 'anniversary') {
            title = '纪念';
        }
        return (
            <Form layout="inline">
                <FormItem label={title + '日期'}
                    required={true}
                >
                    {
                        getFieldDecorator('time', {
                            rules: [
                                {
                                    required: true,
                                    message: '请选择日期'
                                }
                            ],
                        })(
                            <DatePicker placeholder="选择日期"/>
                        )
                    }
                </FormItem>
                <FormItem label={title + '内容'}>
                    {
                        getFieldDecorator('detail', {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入内容'
                                }
                            ]
                        })(<Input placeholder={type === 'plan' ? '做点什么...' : '有意义的一天...'}/>)
                    }
                </FormItem>
                <FormItem>
                    <Button type="primary" onClick={this.handleSubmit}>保存</Button>
                </FormItem>
            </Form>
        );
    }
    handleSubmit() {
        const {onSubmit, form} = this.props;
        const {validateFields} = form;
        validateFields((errs, values) => {
            if(!errs) {
                onSubmit(values);
            }
        });
    }
}
AnniversaryForm.propTypes = {
    form: propTypes.object,
    onSubmit: propTypes.func,
    type: propTypes.string
};

export default Form.create()(AnniversaryForm);