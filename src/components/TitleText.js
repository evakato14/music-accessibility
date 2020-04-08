import React from "react";

export function ClickedTitleText(props) {
  return (
    <h1 className="display-4">
      I want to get into{" "}
      <span className="text-success">
        {props.artist.name}
        {props.artist.name.slice(-1).toLowerCase() === "s" ? "'" : "'s"}
      </span>{" "}
      music...
    </h1>
  );
}

export function SearchTitleText() {
  return (
    <h1 className="display-4">
      I want to get into{" "}
      <span className="text-danger">[insert artist here]'s</span> music...
    </h1>
  );
}
