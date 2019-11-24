import React from "react"

import Autosuggest from 'react-autosuggest';

import Popover from 'react-bootstrap/Popover'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Button from 'react-bootstrap/Button'

import styles from './UserSearch.scss'


export default class UserSearch extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      suggestions: [],
      value: ''
    }
  }

  getSuggestions = value => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0 ? [] : this.props.users.filter(user =>
      user.name.toLowerCase().includes(inputValue)
    );
  };

  // When suggestion is clicked, Autosuggest needs to populate the input
  // based on the clicked suggestion. Teach Autosuggest how to calculate the
  // input value for every given suggestion.
  getSuggestionValue = suggestion => suggestion.name;

  selectionClicked = (name) => {
    this.props.selectedCallback(name)
  }

  renderSuggestion = suggestion => (
    <div className='userSearchEntry' onClick={() => this.selectionClicked(suggestion.name)}>
      {suggestion.name}
    </div>
  );

  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue
    });

    if (newValue == '') {
      this.props.clearCallback()
    }
  };

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value)
    });
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  render() {
    const { value, suggestions } = this.state;

    const inputProps = {
      placeholder: 'Enter a name',
      value,
      onChange: this.onChange
    };

    return (
      <div className='masterUserSearch'>
        <Autosuggest
          suggestions={this.state.suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={this.getSuggestionValue}
          renderSuggestion={this.renderSuggestion}
          inputProps={inputProps}
        />
      </div>
    )
  }
}
