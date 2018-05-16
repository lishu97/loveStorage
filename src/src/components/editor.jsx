import React from 'react';
import propTypes from 'prop-types';

import LzEditor from 'react-lz-editor';

class EditorItem extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleImgChange = this.handleImgChange.bind(this);
        this.state = {
            imgList: []
        };
    }
    render() {
        const { value } = this.props;
        const { imgList } = this.state;        
        return (
            <LzEditor importContent={value} cbReceiver={this.handleChange} audio={false} video={false}
                uploadProps={{
                    action: '/api/upload/avatar',
                    accept: 'image/*',
                    showUploadList: true,
                    name: 'img',
                    onChange: this.handleImgChange,
                    fileList: imgList,
                    listType: 'picture'
                }}
            />
        );
    }
    handleImgChange(info) {
        let fileList = info.fileList;
        fileList = fileList.map((file) => {
            if (file.response) {
                file.url = file.response.data.path;
            }
            return file;
        });

        this.setState({
            imgList: fileList
        });
    }
    handleChange(value) {
        const { onChange } = this.props;
        onChange(value);
        // 手动清空之前已经上传过的图片
        this.setState({
            imgList: []
        });      
    }
}

EditorItem.propTypes = {
    value: propTypes.string,
    onChange: propTypes.func
};

export default EditorItem;