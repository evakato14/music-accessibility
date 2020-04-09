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
            <h1 className="display-4 mt-3" style={{ color: "#2FB8C3" }}>
              Music Accessibility
            </h1>
            <p>Eva Kato</p>
            <a
              className="btn btn--loginApp-link mt-1"
              href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
                "%20"
              )}&response_type=token&show_dialog=true`}
            >
              <button type="button" className="btn btn-outline-dark">
                Try it out!
              </button>
            </a>
            <div className="container w-75 mt-3 mb-5">
              <h4 className="text-danger">
                To-Do: Rating system with machine learning, album
                recommendations
              </h4>
              <h5 className="mt-4" style={{ color: "#2F6EC3" }}>
                Have you ever gotten an artist recommendation from a friend?
                Ever wondered where to start when exploring an artist's
                extensive discography?
              </h5>
              <h6>
                The goal of my recommendation algorithm is to create a more
                targeted approach to enjoying a new artist. Instead of being
                introduced to an artist with random or popular songs, listeners
                will have the greatest chance of enjoying an artist with a
                data-driven recommendation algorithm to find the most accessible
                songs and albums.
              </h6>
              <h5 className="mt-4" style={{ color: "#2F6EC3" }}>
                What makes a song accessible?
              </h5>
              <h6>
                Listeners who are unfamiliar with a song should enjoy it within
                their first few attempts. Accessible songs have sounds that are
                somewhat similar to the music a listener already enjoys. For
                example, if a person typically listens to mainstream pop, an
                accessible song for that person will sound somewhat similar to
                mainstream pop.
              </h6>
              <h6>
                However, if someone wants to become familiar with an artist’s
                music, it is also important that the recommended songs represent
                the overall sound of the artist.
              </h6>
              <h6>
                Therefore, accessible songs have a good combination of both
                similarity to listener's taste and representativeness of given
                artist. Still, the weight of representativeness can be changed
                to the user's preferences (there is a feature in settings),
                depending on how important that is to the user.
              </h6>
              <h5 className="mt-4" style={{ color: "#2F6EC3" }}>
                How is "similarity" calculated?
              </h5>
              <h6>
                Spotify audio data contains variables to describe a song’s
                sound. The variables used for this analysis include:
              </h6>
              <table class="table table-sm">
                <thead>
                  <tr>
                    <th scope="col">Audio Feature</th>
                    <th scope="col">Definition</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">Valence</th>
                    <td>the positivity/negativity of a song’s sound</td>
                  </tr>
                  <tr>
                    <th scope="row">Danceability</th>
                    <td>
                      the extent to which a song is suitable for dancing based
                      on its rhythm and tempo
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Energy</th>
                    <td>the intensity of a song’s sound</td>
                  </tr>
                  <tr>
                    <th scope="row">Instrumentalness</th>
                    <td>the likelihood that a track contains no vocals</td>
                  </tr>
                  <tr>
                    <th scope="row">Tempo</th>
                    <td>the estimated beats per minute of a song</td>
                  </tr>
                  <tr>
                    <th scope="row">Loudness</th>
                    <td>the loudness of a song, measured in decibels</td>
                  </tr>
                  <tr>
                    <th scope="row">Speechiness</th>
                    <td>the extent to which a song contains spoken words</td>
                  </tr>
                  <tr>
                    <th scope="row">Acousticness</th>
                    <td>the likelihood that a song is acoustic</td>
                  </tr>
                </tbody>
              </table>
              <h6>
                The most similar songs will have the smallest distance between
                their respective audio features.
              </h6>
              <h5 className="mt-4" style={{ color: "#2F6EC3" }}>
                What artists can be searched?
              </h5>
              <h6>
                Any artists on Spotify with at least 1000 followers are
                included.
              </h6>
              <h5 className="mt-4" style={{ color: "#2F6EC3" }}>
                What albums and songs are accounted for in the recommendation
                algorithm?
              </h5>
              <h6>
                The albums and songs that are included must be a certain
                popularity compared its own artist. This rules out extra
                material that doesn't make sense for a new listener to start
                with, such as live albums, demos, compilations, commentary, etc.
                as well as less important and "nonessential" albums to an
                artist. (Bjork stans - No, Vulnicura isn't included. Don't come
                at me.)
              </h6>
            </div>
            <div className="mb-5">
              <a href="https://github.com/evakato14/music-accessibility">
                Web Interface Code
              </a>
              <a
                className="d-block"
                href="https://github.com/evakato14/music-accessibility-api"
              >
                Python API Code
              </a>
            </div>
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
