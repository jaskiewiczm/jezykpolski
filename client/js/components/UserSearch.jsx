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
      user.name.toLowerCase().slice(0, inputLength) === inputValue
    );
  };

  // When suggestion is clicked, Autosuggest needs to populate the input
  // based on the clicked suggestion. Teach Autosuggest how to calculate the
  // input value for every given suggestion.
  getSuggestionValue = suggestion => suggestion.name;

  selectionClicked = (name) => {
    this.overlay.hide()
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

  searchPopover = (userId, homeworkId) => {
    const {value, suggestions} = this.state
    const inputProps = {
      placeholder: 'Enter a name',
      value,
      onChange: this.onChange
    };

    var that = this
    return (<Popover id="popover-basic">
        <Popover.Content>
          <Autosuggest
            suggestions={this.state.suggestions}
            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
            getSuggestionValue={this.getSuggestionValue}
            renderSuggestion={this.renderSuggestion}
            inputProps={inputProps}
          />
        </Popover.Content>
      </Popover>)
  }

  clearSearch = () => {
    this.props.clearCallback()
  }

  render() {
    const { value, suggestions } = this.state;

        //<OverlayTrigger trigger="click" placement="left" overlay={this.searchPopover()} ref={(ref) => this.overlay = ref}>
        //  <Button>Search</Button>
        //</OverlayTrigger>

    //<Button onClick={this.clearSearch}>Clear</Button>

    const inputProps = {
      placeholder: 'Enter a name',
      value,
      onChange: this.onChange
    };

    return (
      <div class='masterUserSearch'>
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
