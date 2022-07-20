import React, { Component } from "react";
import "./Search.css";
import SearchSvg from "../../static/images/svg/search1.svg";

class Search extends Component {
  constructor(props) {
    super(props);

    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
  }

  handleTextChange(e) {
    this.props.handleTextChange(e.target.value);
  }

  handleCheckboxChange(e) {
    this.props.handleCheckboxChange(e.target.checked);
  }
  render() {
    return (
      <div className="search-block">
        <form className="search">
          <img className="search__svg" src={SearchSvg} />
          <input
            type="text"
            placeholder="Search products by name or ID"
            value={this.props.filterField}
            onChange={this.handleTextChange}
            className="search__input"
            ref={(elem) => {
              this.textInput = elem;
            }}
          />
        </form>
        {this.textInput && this.textInput.value.length > 0 && (
          <div onClick={this.props.handleTextClear} className="search-cancel">
            Cancel
          </div>
        )}
      </div>
    );
  }
}

export default Search;
