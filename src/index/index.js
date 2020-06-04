'use strict'

import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'

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
    )
  }
}

class MyComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = { bool: true, value: 1000,opacity: 1.0 }
    this.myTextInput = React.createRef()
    this.handle = this.handleClick.bind(this)
  }

  handleClick (event) {
    // this.myTextInput.current.focus()
    this.setState({ bool: !this.state.bool })

    console.log(this.state.bool)
    this.inputChangedHandler();
  }

  inputChangedHandler () {
    this.setState({ value: this.state.bool ? 100 : 1000 })
  }

  componentDidMount() {
    this.timer = setInterval(function () {
      var opacity = this.state.opacity;
      opacity -= .05;
      if (opacity < 0.1) {
        opacity = 1.0;
      }
      this.setState({
        opacity: opacity
      });
    }.bind(this), 100);
  }
  render () {
    return (
      <div style={{opacity: this.state.opacity}}>
        <input type="text" ref={this.myTextInput} value={this.state.value}
               onChange={(event) => this.inputChangedHandler(event)}/>
        <input type="button" value="Focus the text input" onClick={this.handle}/>
      </div>
    )
  }
}

// export default function HookPage (props) {
//   const [count, setCount] = useState(0)
//   return (
//     <div>
//       <p>{count}</p>
//       <button onClick={() => setCount(count + 1)}>增加</button>
//     </div>
//   )
// }


class RepoList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      error: null,
      data: null
    };
  }

  componentDidMount() {
    this.props.promise.then(
      value => this.setState({loading: false, data: value}),
      error => this.setState({loading: false, error: error}));
  }

  render() {
    if (this.state.loading) {
      return <span>Loading...</span>;
    }
    else if (this.state.error !== null) {
      return <span>Error: {this.state.error.message}</span>;
    }
    else {
      var repos = this.state.data.items;
      var repoList = repos.map(function (repo, index) {
        return (
          <li key={index}><a href={repo.html_url}>{repo.name}</a> ({repo.stargazers_count} stars) <br/> {repo.description}</li>
        );
      });
      return (
        <main>
          <h1>Most Popular JavaScript Projects in Github</h1>
          <ol>{repoList}</ol>
        </main>
      );
    }
  }
}

//
ReactDOM.render(
  <div>
    <MyComponent/>
    <RepoList promise={$.getJSON('https://api.github.com/search/repositories?q=javascript&sort=stars')} />
    <Index>
      <span> Top one</span>
      <span> Top two</span>
      <div></div>
    </Index>
  </div>,
  document.getElementById('root')
)
