import React, { Component } from "react";
import * as SpotifyWebApi from "spotify-web-api-js";
import PersonalTaste from "./components/PersonalTaste";
import { ClickedTitleText } from "./components/TitleText";
import { SearchTitleText } from "./components/TitleText";
import ReactModal from "react-modal";
import { customStyles } from "./components/modalStyles";

var spotifyApi = new SpotifyWebApi();

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: "",
      showModal: false,
      artists: "",
      chosenArtist: "",
      chosenArtistOverallSound: {
        acousticness: 0,
        danceability: 0,
        energy: 0,
        instrumentalness: 0,
        loudness: 0,
        speechiness: 0,
        tempo: 0,
        valence: 0
      },
      topTracks: [],
      overallSound: {
        valence: 0,
        danceability: 0,
        energy: 0,
        instrumentalness: 0,
        speechiness: 0,
        acousticness: 0,
        loudness: 0,
        tempo: 0
      },
      artistAlbumTypes: {},
      recommendedTracks: [],
      range: "medium_term",
      weight: 0.5
    };
    this.onSearchChange = this.onSearchChange.bind(this);
    this.clickArtistProfile = this.clickArtistProfile.bind(this);
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.onRangeChange = this.onRangeChange.bind(this);
    this.onWeightChange = this.onWeightChange.bind(this);
  }

  componentDidMount() {
    spotifyApi.setAccessToken(this.props.token);
    spotifyApi.getMe(
      function(err, data) {
        this.setState({
          user: data
        });
      }.bind(this)
    );
  }

  onRangeChange(e) {
    this.setState({
      range: e.target.value
    });
  }

  onWeightChange(e) {
    this.setState({
      weight: e.target.value
    });
  }

  handleOpenModal() {
    this.setState({ showModal: true });
  }

  handleCloseModal() {
    this.setState({ showModal: false });
  }

  reset() {
    this.setState({
      artists: "",
      chosenArtist: "",
      chosenArtistOverallSound: {
        acousticness: 0,
        danceability: 0,
        energy: 0,
        instrumentalness: 0,
        loudness: 0,
        speechiness: 0,
        tempo: 0,
        valence: 0
      },
      topTracks: [],
      overallSound: {
        valence: 0,
        danceability: 0,
        energy: 0,
        instrumentalness: 0,
        speechiness: 0,
        acousticness: 0,
        loudness: 0,
        tempo: 0
      },
      artistAlbumTypes: {},
      recommendedTracks: []
    });
  }

  onSearchChange(e) {
    if (e.target.value) {
      spotifyApi.searchArtists(
        e.target.value,
        function(err, data) {
          let max = 20;
          if (data.artists) {
            max = data.artists.items.length;
          }
          for (var i = 0; i < data.artists.items.length; i++) {
            if (data.artists.items[i].followers.total < 1000) {
              max = i;
              break;
            }
          }
          this.setState({
            artists: data.artists.items.slice(0, max)
          });
        }.bind(this)
      );
    } else {
      this.setState({
        artists: ""
      });
    }
  }

  clickArtistProfile = artist => {
    this.setState({
      chosenArtist: artist
    });
    fetch(
      "/audio_features?artist=" +
        artist.uri +
        "&token=" +
        this.props.token +
        "&range=" +
        this.state.range +
        "&weight=" +
        this.state.weight
    ).then(response =>
      response.json().then(data => {
        console.log(data);
        this.setState({
          chosenArtistOverallSound: data["artist_audio_features"],
          overallSound: data["user_audio_features"],
          randomUserTracks: data["user_two_songs"],
          artistAlbumTypes: data["artist_album_types"],
          recommendedTracks: data["recommended_tracks"]
        });
      })
    );
  };

  render() {
    return (
      <div className="container mt-4 mb-4">
        {this.state.chosenArtist.name ? (
          <div>
            <ClickedTitleText
              artist={this.state.chosenArtist}
            ></ClickedTitleText>
            <PersonalTaste
              user={this.state.user}
              overallSound={this.state.overallSound}
              artist={this.state.chosenArtist}
              artistOverallSound={this.state.chosenArtistOverallSound}
              twoTracks={this.state.randomUserTracks}
              albumTypes={this.state.artistAlbumTypes}
              token={this.props.token}
              recommendedTracks={this.state.recommendedTracks}
            ></PersonalTaste>
            <button className="btn btn-warning" onClick={() => this.reset()}>
              Search another artist!
            </button>
          </div>
        ) : (
          <div>
            <SearchTitleText></SearchTitleText>
            <div className="row mt-4 mb-4">
              <div className="col-sm-3"></div>
              <div className="col-sm-6">
                <input
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="Search Artist"
                  onChange={this.onSearchChange}
                ></input>
              </div>
              <div className="col-sm-3 text-left">
                <button
                  className="btn btn-light"
                  onClick={() => this.handleOpenModal()}
                >
                  <i class="fa fa-cog fa-2x"></i>
                </button>
                <ReactModal isOpen={this.state.showModal} style={customStyles}>
                  <h6 className="text-center">
                    We use your listening history to calculate your preferred
                    sound.
                  </h6>
                  <h6 className="text-center">
                    Feel free to change the time period from which we collect
                    your listening habits:
                  </h6>
                  <div
                    className="btn-group d-block text-center mb-4"
                    role="group"
                  >
                    <button
                      type="button"
                      value="short_term"
                      className={
                        "btn " +
                        (this.state.range == "short_term"
                          ? "btn-dark"
                          : "btn-outline-dark")
                      }
                      onClick={this.onRangeChange}
                    >
                      Past 30 Days
                    </button>
                    <button
                      type="button"
                      value="medium_term"
                      className={
                        "btn " +
                        (this.state.range == "medium_term"
                          ? "btn-dark"
                          : "btn-outline-dark")
                      }
                      onClick={this.onRangeChange}
                    >
                      Past 6 Months
                    </button>
                    <button
                      type="button"
                      value="long_term"
                      className={
                        "btn " +
                        (this.state.range == "long_term"
                          ? "btn-dark"
                          : "btn-outline-dark")
                      }
                      onClick={this.onRangeChange}
                    >
                      Past Year
                    </button>
                  </div>
                  <h6 className="text-center">
                    We think it's important to factor how representative of the
                    artist's sound is in our recommendation algorithm.
                  </h6>
                  <h6 className="text-center">
                    Feel free to change the weighting of this representativeness
                    factor.
                  </h6>
                  <div className="d-block text-center">
                    <span className="mr-4 small">Not very representative</span>
                    <div className="btn-group" role="group">
                      <button
                        type="button"
                        value={0.1}
                        className={
                          "btn " +
                          (this.state.weight == 0.1
                            ? "btn-dark"
                            : "btn-outline-dark")
                        }
                        onClick={this.onWeightChange}
                      >
                        10%
                      </button>
                      <button
                        type="button"
                        value={0.3}
                        className={
                          "btn " +
                          (this.state.weight == 0.3
                            ? "btn-dark"
                            : "btn-outline-dark")
                        }
                        onClick={this.onWeightChange}
                      >
                        30%
                      </button>
                      <button
                        type="button"
                        value={0.5}
                        className={
                          "btn " +
                          (this.state.weight == 0.5
                            ? "btn-dark"
                            : "btn-outline-dark")
                        }
                        onClick={this.onWeightChange}
                      >
                        50%
                      </button>
                      <button
                        type="button"
                        value={0.7}
                        className={
                          "btn " +
                          (this.state.weight == 0.7
                            ? "btn-dark"
                            : "btn-outline-dark")
                        }
                        onClick={this.onWeightChange}
                      >
                        70%
                      </button>
                      <button
                        type="button"
                        value={0.9}
                        className={
                          "btn " +
                          (this.state.weight == 0.9
                            ? "btn-dark"
                            : "btn-outline-dark")
                        }
                        onClick={this.onWeightChange}
                      >
                        90%
                      </button>
                    </div>
                    <span className="ml-4 small">Very representative</span>
                  </div>
                  <div className="text-center mt-4">
                    <button
                      className="btn btn-primary "
                      onClick={this.handleCloseModal}
                    >
                      Close
                    </button>
                  </div>
                </ReactModal>
              </div>
            </div>
            {this.state.artists ? (
              this.state.artists.map(artist => (
                <button
                  type="button"
                  className="btn btn-lg btn-light mr-2 mt-2"
                  key={artist.id}
                  onClick={() => this.clickArtistProfile(artist)}
                >
                  {artist.name}
                </button>
              ))
            ) : (
              <div></div>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default Search;
