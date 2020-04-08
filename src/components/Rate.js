import React, { Component } from "react";
import Ratings from "react-ratings-declarative";

class Rate extends Component {
  constructor() {
    super();
    this.state = {
      rating: 0
    };
    this.changeRating = this.changeRating.bind(this);
  }

  changeRating(newRating) {
    this.setState({
      rating: newRating
    });
  }

  render() {
    return (
      <Ratings
        rating={this.state.rating}
        widgetRatedColors="#ffdd00"
        widgetHoverColors="#ffdd00"
        widgetDimensions="30px"
        changeRating={this.changeRating}
      >
        <Ratings.Widget />
        <Ratings.Widget />
        <Ratings.Widget />
        <Ratings.Widget />
        <Ratings.Widget />
        <Ratings.Widget />
        <Ratings.Widget />
        <Ratings.Widget />
        <Ratings.Widget />
        <Ratings.Widget />
      </Ratings>
    );
  }
}

export default Rate;
