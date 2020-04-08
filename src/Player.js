import React from "react";
import "./Player.css";

const Player = props => {
  return (
    <div className="App">
      <div className="container">
        <div className="row justify-content-center mt-2">
          <img
            className="now-playing-img"
            src={props.item.album.images[0].url}
          />
        </div>

        <div className="now-playing__name">{props.item.name}</div>
        <div className="now-playing__artist">{props.item.artists[0].name}</div>
        <div className="now-playing__status">
          {props.is_playing ? "Playing" : "Paused"}
        </div>
      </div>
    </div>
  );
};

export default Player;
