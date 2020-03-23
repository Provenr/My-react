'use strict'

import React from 'react';
import ReactDOM from 'react-dom';
import './style/search.less';
import './style/iconfont.less';
import provenr from './image/provenr.jpeg'

class Search extends React.Component {
    render() {
        return <div className="container">
            <img src={ provenr } alt=""/>
            <div className="iconfont icon-weixinzhifu"></div>
            <div className="search-text">Search Text</div>
        </div>;
    }
}

ReactDOM.render(
    <Search />,
    document.getElementById('root')
)
