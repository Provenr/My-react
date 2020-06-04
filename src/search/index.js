import React from 'react'
import ReactDOM from 'react-dom'
import '../style/search.less'
import '../style/iconfont.less'
import provenr from '../image/provenr.jpeg'

class Search extends React.Component {
  render () {
    return <div className="container">
      <img src={provenr} alt=""/>
      <div className="iconfont icon-weixinzhifu"></div>
      <div className="search-text">CleanWebpackPlugin 使用</div>
    </div>
  }
}

class Index extends React.Component {
  render () {
    return (
      <ol>
        {
          React.Children.map(this.props.children, function (child) {
            return <li>{child}</li>
          })
        }
      </ol>
    );
  }
}

ReactDOM.render(
  <Search/>,
  document.getElementById('root')
)
