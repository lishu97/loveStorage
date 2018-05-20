import React from 'react';

import {Card} from 'antd';
class About extends React.Component {
    render() {
        return (
            <Card
                title="关于"
                hoverable={true}
                className="about"
            >
                <p>这是一个基于React和Node.js的情感记录系统，希望能帮你记录自己的情感历程。</p>
                <p>欢迎用户通过邮件反馈意见和建议！</p>
                <p>管理员邮箱：770383385@qq.com</p>
                <p>github地址：
                    <a href="https://github.com/lishu97/loveStorage" 
                        target="_blank"
                        rel="nofollow me noopener noreferrer">
                        https://github.com/lishu97/loveStorage
                    </a>    
                </p>
            </Card>
        );
    }
}

export default About;