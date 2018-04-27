////////////////////////////////////////////////////////////////////////////////
// Exercise:
//
// Implement a radio group form control with the API found in <App>.
//
// - Clicking a <RadioOption> should update the value of <RadioGroup>
// - The selected <RadioOption> should pass the correct value to its <RadioIcon>
// - The `defaultValue` should be set on first render
//
// Hints to get started:
//
// - <RadioGroup> will need some state
// - It then needs to pass that state to the <RadioOption>s so they know
//   whether or not they are active
//
// Got extra time?
//
// - Implement an `onChange` prop that communicates the <RadioGroup>'s state
//   back to the parent so it can use it to render
// - Implement keyboard controls on the <RadioGroup>
//   - Hint: Use tabIndex="0" on the <RadioOption>s so the keyboard will work
//   - Enter and space bar should select the option
//   - Arrow right, arrow down should select the next option
//   - Arrow left, arrow up should select the previous option
////////////////////////////////////////////////////////////////////////////////
import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

class RadioGroup extends React.Component {
  static propTypes = {
    defaultValue: PropTypes.string,
    onChange: PropTypes.func
  };

  state = { value: this.props.defaultValue, focusIndex: undefined };

  _changeFocus = false;

  componentDidUpdate() {
    this._changeFocus = false;
  }

  render() {
    const length = React.Children.toArray(this.props.children).length;

    return (
      <div>
        {React.Children.map(this.props.children, (child, index) =>
          React.cloneElement(child, {
            _isSelected: this.state.value === child.props.value,
            _makeFocused:
              this._changeFocus && index === this.state.focusIndex,
            _onSelect: () => {
              this.setState({ value: child.props.value }, () => {
                if (this.props.onChange) {
                  this.props.onChange(this.state.value);
                }
              });
            },
            _onSelectPrev: () => {
              this._changeFocus = true;

              this.setState({
                focusIndex: (index === 0 ? length : index) - 1
              });
            },
            _onSelectNext: () => {
              this._changeFocus = true;

              this.setState({
                focusIndex: index === length - 1 ? 0 : index + 1
              });
            }
          })
        )}
      </div>
    );
  }
}

class RadioOption extends React.Component {
  static propTypes = {
    value: PropTypes.string,
    _isSelected: PropTypes.bool,
    _onSelect: PropTypes.func,
    _onSelectPrev: PropTypes.func,
    _onSelectNext: PropTypes.func
  };

  handleKeyDown = event => {
    if (event.key === "Enter" || event.key === " ") {
      this.props._onSelect();
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      this.props._onSelectPrev();
    } else if (
      event.key === "ArrowDown" ||
      event.key === "ArrowRight"
    ) {
      this.props._onSelectNext();
    }
  };

  componentDidUpdate() {
    if (this.props._makeFocused) this.node.focus();
  }

  render() {
    return (
      <div
        onClick={this.props._onSelect}
        tabIndex="0"
        onKeyDown={this.handleKeyDown}
        ref={node => (this.node = node)}
      >
        <RadioIcon isSelected={this.props._isSelected} />{" "}
        {this.props.children}
      </div>
    );
  }
}

class RadioIcon extends React.Component {
  static propTypes = {
    isSelected: PropTypes.bool.isRequired
  };

  render() {
    return (
      <div
        style={{
          borderColor: "#ccc",
          borderWidth: 3,
          borderStyle: this.props.isSelected ? "inset" : "outset",
          height: 16,
          width: 16,
          display: "inline-block",
          cursor: "pointer",
          background: this.props.isSelected ? "rgba(0, 0, 0, 0.05)" : ""
        }}
      />
    );
  }
}

class App extends React.Component {
  state = { radioValue: "fm", inputValue: "" };

  render() {
    return (
      <div>
        <h1>♬ It's about time that we all turned off the radio ♫</h1>

        <p>The {this.state.radioValue} is playing.</p>

        <RadioGroup
          defaultValue={this.state.radioValue}
          onChange={value => this.setState({ radioValue: value })}
        >
          <RadioOption value="am">AM</RadioOption>
          <RadioOption value="fm">FM</RadioOption>
          <RadioOption value="tape">Tape</RadioOption>
          <RadioOption value="aux">Aux</RadioOption>
        </RadioGroup>

        <p>The input value is: {this.state.inputValue}</p>

        <input
          type="text"
          onChange={event =>
            this.setState({ inputValue: event.target.value })
          }
        />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app"));
