import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';

import BoxList from '../components/box_list';
import Anniversary from '../components/anniversary';
import PlanList from '../components/plan_list';
import Profile from '../components/profile';
import BindLove from '../components/bind_love';

import {fetchUserInfo, bindLove, fetchLoveInfo, exit} from '../actions/user';
import {fetchBoxList, createBoxList, delBoxItem} from '../actions/box_list';
import {fetchPlanList, deletePlan, addPlan, changePlanStatus} from '../actions/plan';
import {fetchAnniversaryList, delAnniversary, addAnniversary} from '../actions/anniversary';


import { Layout, Menu, Icon, Avatar, Modal } from 'antd';
const { Content, Footer, Sider } = Layout;

function propMap(state) {
    return {
        loveInfo: state.user.loveInfo,
        user: state.user.userInfo,
        boxList: state.boxList.list,
        planList: state.plan.list,
        anniversaryList: state.anniversary.list
    };
}
class Index extends React.Component {
    constructor() {
        super();
        this.state = {
            curMenu: 'box'
        };
        this.handleClickMenu = this.handleClickMenu.bind(this);
        this.handleAddBoxItem = this.handleAddBoxItem.bind(this);
        this.handleDeleteBoxItem = this.handleDeleteBoxItem.bind(this);
        this.handleAddPlan = this.handleAddPlan.bind(this);
        this.handleDeletePlan = this.handleDeletePlan.bind(this);
        this.handleChangePlanStatus = this.handleChangePlanStatus.bind(this);
        this.handleAddAnniversary = this.handleAddAnniversary.bind(this);
        this.handleDeleteAnniversary = this.handleDeleteAnniversary.bind(this);
        this.handleBindLove = this.handleBindLove.bind(this);
    }
    componentDidMount() {
        const {dispatch} = this.props;
        dispatch(fetchUserInfo());
        dispatch(fetchBoxList());
    }
    render() {
        const {curMenu} = this.state;
        const {user, boxList, planList, anniversaryList, loveInfo} = this.props;
        const contentMap = {
            'box': <BoxList data={boxList} onSubmit={this.handleAddBoxItem} avatar={user.avatar} nick={user.nickname} onDelete={this.handleDeleteBoxItem}/>,
            'schedule': <PlanList data={planList} onSubmit={this.handleAddPlan} onDelete={this.handleDeletePlan} onChangePlan={this.handleChangePlanStatus}/>,
            'annniversary': <Anniversary data={anniversaryList} onSubmit={this.handleAddAnniversary} onDelete={this.handleDeleteAnniversary}/>,
            'personInfo': <Profile userInfo={user} title="个人信息"/>,
            'bind': <BindLove onSubmit={this.handleBindLove} showLove={parseInt(user.relationId) === 0 ? false : true} loveInfo={loveInfo}/>
        };
        return (
            <Layout>
                <Sider style={{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0 }}>
                    <Menu theme="dark" mode="inline" defaultSelectedKeys={['box']} onClick={this.handleClickMenu}>
                        <Menu.Item key="personInfo">
                            <Avatar src={user.avatar}/> 
                            <span>{user.nickname}</span>
                        </Menu.Item>
                        <Menu.Item key="box">
                            <Icon type="hdd" />
                            <span className="nav-text">存储盒</span>
                        </Menu.Item>
                        <Menu.Item key="schedule">
                            <Icon type="table" />
                            <span className="nav-text">计划书</span>
                        </Menu.Item>
                        <Menu.Item key="annniversary">
                            <Icon type="calendar" />
                            <span className="nav-text">纪念日</span>
                        </Menu.Item>
                        <Menu.Item key="bind">
                            <Icon type="heart" />
                            <span className="nav-text">{user.relationId === 0 ? '绑定情侣' : '情侣信息'}</span>
                        </Menu.Item>
                        <Menu.Item key="about">
                            <Icon type="cloud-o" />
                            <span className="nav-text">关于</span>
                        </Menu.Item>
                        <Menu.Item key="exit">
                            <Icon type="close-circle-o" />
                            <span className="nav-text">注销</span>
                        </Menu.Item>
                    </Menu>
                </Sider>
                <Layout style={{ marginLeft: 200, minHeight: '100vh'}}>
                    <Content style={{ padding: '5px', overflow: 'initial'}}>
                        {contentMap[curMenu]}
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>
                        LoveStorage Created by LiShu
                    </Footer>
                </Layout>
            </Layout>
        );
    }
    handleClickMenu(menu) {
        const {key} = menu;
        const {dispatch, user} = this.props;
        switch(key) {
        case 'box':
            this.setState({
                curMenu: key
            }, () => {
                dispatch(fetchBoxList());
            });
            break;
        case 'schedule':
            this.setState({
                curMenu: key
            }, () => {
                dispatch(fetchPlanList(user.relationId));
            });
            break;
        case 'annniversary':
            this.setState({
                curMenu: key
            }, () => {
                dispatch(fetchAnniversaryList(user.relationId));
            });
            break;
        case 'bind':
            if(parseInt(user.relationId) === 0) {
                return this.setState({
                    curMenu: key
                });
            }
            this.setState({
                curMenu: key
            }, () => {
                dispatch(fetchLoveInfo());
            });
            break;
        case 'exit':
            Modal.confirm({
                title: '注销',
                content: '你确定要退出登录吗?',
                onOk: () => { 
                    dispatch(exit());
                }
            });
            break;
        default:
            this.setState({
                curMenu: key
            });
        }
    }
    handleAddBoxItem(value) {
        const {dispatch} = this.props;
        dispatch(createBoxList(value));
    }
    handleDeleteBoxItem(id) {
        const {dispatch} = this.props;
        dispatch(delBoxItem(id));
    }
    handleAddPlan(values) {
        const {dispatch, user} = this.props;
        dispatch(addPlan(values, user.relationId));
    }
    handleDeletePlan(id) {
        const {dispatch, user} = this.props;
        dispatch(deletePlan(id, user.relationId));
    }
    handleChangePlanStatus(id, curStatus) {
        const {dispatch, user} = this.props;
        dispatch(changePlanStatus(user.relationId, id, curStatus ? 'todo' : 'finished'));
        
    }
    handleAddAnniversary(values) {
        const {dispatch, user} = this.props;
        dispatch(addAnniversary(values, user.relationId));
    }
    handleDeleteAnniversary(id) {
        const {dispatch, user} = this.props;
        dispatch(delAnniversary(user.relationId, id));
    }
    handleBindLove(id, opt) {
        const {dispatch, user} = this.props;
        dispatch(bindLove(user.loveId, id, opt));
    }
}
Index.propTypes = {
    user: propTypes.object,
    dispatch: propTypes.func,
    boxList: propTypes.array,
    planList: propTypes.array,
    anniversaryList: propTypes.array,
    loveInfo: propTypes.object
};

export default connect(propMap)(Index);