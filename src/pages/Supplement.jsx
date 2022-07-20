import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Search from "../components/Search/Search";
import Header from "../components/Header/Header";
import Navigation from "../components/Navigation/Navigation";
import SupplementList from "../components/Supplement/SupplementList";
import SupplementCategorList from "../components/Supplement/SupplementCategorList";

class Supplement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filterField: "",
      showInStockOnly: false,
    };

    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.handleTextClear = this.handleTextClear.bind(this);
  }

  handleTextChange(value) {
    this.setState({
      filterField: value,
    });
  }

  handleTextClear() {
    this.setState({
      filterField: '',
    });
  }

  handleCheckboxChange(checked) {
    this.setState({
      showInStockOnly: checked,
    });
  }
  render() {
  


  return (
    <div
      className="supplement"
    >
        <Header back="3" />
        <section >
          <div className="container">
            <Navigation />
            <Search
              filterField={this.state.filterField}
              showInStockOnly={this.state.showInStockOnly}
              handleTextChange={this.handleTextChange}
              handleCheckboxChange={this.handleCheckboxChange}
              handleTextClear={this.handleTextClear}
            />
            <div className="filter">
              <button className="filter__item">Breackfast</button>
              <button className="filter__item">Lunch</button>
              <button className="filter__item">Dinner</button>
              <button className="filter__item">Drinks</button>
            </div>

            {(this.props.activeCatalog || this.state.filterField.length > 0)? (
              <SupplementList
                openModalModifiers={this.props.openModalModifiers}
                products={this.props.activeCatalog.products ? this.props.activeCatalog.products : 0}
                filterField={this.state.filterField}
                showInStockOnly={this.state.showInStockOnly}
              />
            ) : (
              <SupplementCategorList />
            )}
          </div>
        </section>
        </div>
    );
  }
}
export default Supplement;
