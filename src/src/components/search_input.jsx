import React from 'react';
import propTypes from 'prop-types';

import fetchData from '../common/api';
import { Select, message } from 'antd';

const Option = Select.Option;

class SearchInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        };
        this.handleChange = this.handleChange.bind(this);
    }
    componentDidMount() {
        fetchData('searchMate', {
        }).then((res) => {
            this.setState({
                data: res.data.data ? res.data.data : []
            });
        }).catch(function (err) {
            message.error(err.message);
        });
    }
    render() {
        const options = this.state.data.map(d => <Option value={d.userId.toString()} key={d.userId}>{d.nick}</Option>);
        return (
            <Select
                onChange={this.handleChange}
                showSearch
                style={{ width: 200 }}
                placeholder="Select a person"
                optionFilterProp="children"
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
                {options}
            </Select>
        );
    }
    handleChange(value) {
        const {onChange} = this.props;
        onChange(value);
    }
}
SearchInput.propTypes = {
    value: propTypes.string,
    onChange: propTypes.func
};

export default SearchInput;
