import React, { Component } from "react";
import * as $ from "jquery";
import { authEndpoint, clientId, redirectUri, scopes } from "./config";
import hash from "./hash";
import Player from "./Player";
import Search from "./Search";
import "./App.css";

class App extends Component {
  constructor() {
    super();
    this.state = {
      token: null,
      item: {
        album: {
          images: [{ url: "" }]
        },
        name: "",
        artists: [{ name: "" }],
        duration_ms: 0
      },
      is_playing: "Paused",
      progress_ms: 0
    };
    this.getCurrentlyPlaying = this.getCurrentlyPlaying.bind(this);
  }
  componentDidMount() {
    // Set token
    let _token = hash.access_token;

    if (_token) {
      // Set token
      this.setState({
        token: _token
      });
      //this.getCurrentlyPlaying(_token);
    }
  }

  componentDidUpdate() {
    //this.getCurrentlyPlaying(this.state.token);
  }

  getCurrentlyPlaying(token) {
    // Make a call using the token
    $.ajax({
      url: "https://api.spotify.com/v1/me/player",
      type: "GET",
      beforeSend: xhr => {
        xhr.setRequestHeader("Authorization", "Bearer " + token);
      },
      success: data => {
        this.setState({
          item: data.item,
          is_playing: data.is_playing,
          progress_ms: data.progress_ms
        });
      }
    });
  }

  render() {
    return (
      <div className="App">
        {!this.state.token && (
          <div className="container">
            <h1 className="mt-5 text-primary">Music Accessibility</h1>
            <h4 className="mt-3">A project by Eva Kato</h4>
            <a
              className="btn btn--loginApp-link mt-2"
              href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
                "%20"
              )}&response_type=token&show_dialog=true`}
            >
              <button type="button" className="btn btn-primary">
                Try it out!
              </button>
            </a>
          </div>
        )}
        {this.state.token && (
          //<Player
          //item={this.state.item}
          //is_playing={this.state.is_playing}
          //progress_ms={this.progress_ms}
          //token={this.state.token}
          ///>
          <Search token={this.state.token}></Search>
        )}
      </div>
    );
  }
}

export default App;
