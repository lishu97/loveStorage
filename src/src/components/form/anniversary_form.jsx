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
        const {form} = this.props;
        const {getFieldDecorator} = form;
        return (
            <Form layout="inline">
                <FormItem label="时间"
                    required={true}
                >
                    {
                        getFieldDecorator('time', {
                            rules: [
                                {
                                    required: true,
                                    message: '请选择时间'
                                }
                            ],
                        })(
                            <DatePicker/>
                        )
                    }
                </FormItem>
                <FormItem label="内容"
                >
                    {
                        getFieldDecorator('detail', {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入内容'
                                }
                            ],
                        })(
                            <Input/>
                        )
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
    onSubmit: propTypes.func
};

export default Form.create()(AnniversaryForm);