import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';

import {Card, Icon, Row, Col} from 'antd';
import {updateCurTime} from '../actions/events';
import moment from 'moment';

import {dateFomatOnlyMonth, dateFomatOnlyYear, weeksName} from '../common/const';
/**
 * 
 * @param {object} time moment对象
 * @param {array} events 事件数组
 */
function buildDayList(time, events) {
    let result = [];
    let year = time.format(dateFomatOnlyYear);
    let month = time.format(dateFomatOnlyMonth);
    let weeks = new Date(year, month - 1, 1).getDay();
    let days = new Date(year, month, 0).getDate();
    for(let i = 0 ; i < 42; i++) {
        result[i] = {
            hasEvents: false,
            day: 0
        };
        // 先判断当前循环的i值是否大于第一天所在的位置
        if(i < weeks) {
            result[i].day = -1;
            continue;
        }
        if(i >= weeks + days) {
            result[i].day = -1;
            continue;
        }
        // 遍历事件数组判断这一天是否有事件
        let curDay = new moment(time).set('date', i - weeks + 1);
        for(let event  of events) {
            let eventTime = new moment(parseInt(event.time));
            if(eventTime.month() === curDay.month() && eventTime.dayOfYear() === curDay.dayOfYear()) {
                result[i].hasEvents = true;
                break;
            }
        }
        result[i].day = i - weeks + 1;
        let curTime = new moment();
        result[i].isCur = curTime.month() === curDay.month() && curTime.dayOfYear() === curDay.dayOfYear();
    }
    return result;
}
function propsMap(state) {
    return {
        events: state.events.events,
        curTime: state.events.curTime
    };
}
/**
 * 日历组件
 */
class Calendar extends React.Component {
    constructor(props) {
        super(props);
        this.handleMonth = this.handleMonth.bind(this);
        this.handleSelectDate = this.handleSelectDate.bind(this);
    }
    render() {
        const {curTime, events} = this.props;
        let dayList;
        dayList = buildDayList(curTime, events);
        // 重组日期数组 一行为一个子数组
        let renderDayList = [];
        for(let i = 0; i < 6; i++) {
            renderDayList.push(dayList.slice(i * 7, i * 7 + 7));
        }
        let title = (
            <Row type="flex" justify="space-around">
                <Col><Icon type="left" style={{cursor: 'pointer'}} onClick={() => {this.handleMonth('dec');}}/></Col>
                <Col>
                    <span>{`${curTime.format(dateFomatOnlyYear)}/${curTime.format(dateFomatOnlyMonth)}`}</span>
                </Col>
                <Col><Icon type="right" style={{cursor: 'pointer'}} onClick={() => {this.handleMonth('add');}}/></Col>
            </Row>
        );
        return (
            <div>
                <Card
                    title={title}
                >
                    <Row type="flex" justify="space-around">
                        {weeksName.map(function(day, index) {
                            return <Col key={index} span={3}  className="text-center"><span className="day-cell">{day}</span></Col>; 
                        })} 
                    </Row>
                    {renderDayList.map((dayRow, index) => {
                        return (
                            <Row key={index} type="flex" justify="space-around" style={{marginBottom: '5px'}}>
                                {
                                    dayRow.map((day, index) => {
                                        return (
                                            <Col key={index} span={3}  className="text-center">
                                                <span className={`day-cell ${day.hasEvents ? 'circle-day' : ''} ${day.isCur ? 'cur-day' : ''}`} onClick={() => {this.handleSelectDate(day.day);}}>{day.day > 0 ? day.day : ''}</span>
                                            </Col>
                                        );
                                    })
                                }
                            </Row>
                        );
                    })}
                </Card>
            </div>
        );
    }
    handleMonth(type) {
        const {curTime, dispatch} = this.props;
        let newTime;
        switch(type) {
        case 'add':
            newTime = new moment(curTime).add(1, 'M');
            break;
        case 'dec':
            newTime = new moment(curTime).subtract(1, 'M');
            break;
        }
        dispatch(updateCurTime(newTime));
    }
    handleSelectDate(day) {
        const {curTime, dispatch} = this.props;
        if(day < 0) {
            return;
        }
        dispatch(updateCurTime(new moment(curTime).set('date', day)));
    }
}
Calendar.propTypes = {
    events: propTypes.array,
    curTime: propTypes.object,
    dispatch: propTypes.func
};
export default connect(propsMap)(Calendar);