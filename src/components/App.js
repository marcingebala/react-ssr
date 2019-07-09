import React from 'react';
import PropTypes from 'prop-types';

class App extends React.Component {
  static propTypes = {
    initialState: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this.state = { text: props.initialState.initialText };
  }

  onButtonClick(event) {
    event.preventDefault();

    this.setState({ text: 'changed in the browser21' });
  }

  render() {
    return (
      <div>
        <p>{this.state.text}</p>
        <button onClick={this.onButtonClick.bind(this)}>change text 5</button>
      </div>
    );
  }
}

export default App;
