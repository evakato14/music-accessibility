import React, { Component } from "react";
import * as SpotifyWebApi from "spotify-web-api-js";
import PersonalTaste from "./components/PersonalTaste";
import { ClickedTitleText } from "./components/TitleText";
import { SearchTitleText } from "./components/TitleText";

var spotifyApi = new SpotifyWebApi();
const audioFeatures = [
  "valence",
  "danceability",
  "energy",
  "instrumentalness",
  "speechiness",
  "acousticness",
  "loudness",
  "tempo"
];

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: "",
      artists: "",
      chosenArtist: "",
      chosenArtistAlbums: [],
      chosenArtistOverallSound: {
        valence: 0,
        danceability: 0,
        energy: 0,
        instrumentalness: 0,
        speechiness: 0,
        acousticness: 0,
        loudness: 0,
        tempo: 0
      },
      artistAllTracks: [],
      artistTracksRanked: {},
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
      randomTrack1: "",
      randomTrack2: ""
    };
    this.onSearchChange = this.onSearchChange.bind(this);
    this.clickArtistProfile = this.clickArtistProfile.bind(this);
    this.audioFeaturesApi = this.audioFeaturesApi.bind(this);
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

  componentDidUpdate(prevProps, prevState) {
    if (prevState.chosenArtistAlbums !== this.state.chosenArtistAlbums) {
      this.setState({
        artistAllTracks: []
      });
      this.getAudioFeatures(this.state.chosenArtistAlbums);
    }
    if (prevState.artistAllTracks !== this.state.artistAllTracks) {
      let trackIds = this.state.artistAllTracks.map(({ id }) => id);
      this.audioFeaturesApi(
        trackIds,
        Math.trunc(trackIds.length / 100) * 100,
        true
      );
    }
  }

  randomTwoSongs() {
    let a = Math.floor(Math.random() * 50);
    let b = a;
    while (a === b) {
      b = Math.floor(Math.random() * 50);
    }
    return [a, b];
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

  audioFeaturesApi = (trackIds, loopNum, firstCall) => {
    if (firstCall) {
      this.setState({
        chosenArtistOverallSound: {}
      });
    }
    spotifyApi.getAudioFeaturesForTracks(
      trackIds.slice(loopNum),
      function(err, data) {
        if (err) {
          console.log(err);
        } else {
          audioFeatures.forEach(audioFeature => {
            let audioFeatureTotal = 0;
            data["audio_features"].forEach(track => {
              if (track) {
                audioFeatureTotal += track[audioFeature];
              }
            });
            this.setState(prevState => ({
              chosenArtistOverallSound: {
                ...prevState.chosenArtistOverallSound,
                [audioFeature]: audioFeatureTotal
              }
            }));
          });
        }
      }.bind(this)
    );
    if (loopNum > 0) {
      this.audioFeaturesApi(trackIds, loopNum - 100, false);
    }
  };

  getAudioFeatures(allAlbums) {
    allAlbums.forEach(album => {
      spotifyApi.getAlbumTracks(
        album.id,
        { limit: 50 },
        function(err, tracksOfAlbum) {
          if (tracksOfAlbum) {
            let newTracksOfAlbum = tracksOfAlbum.items.map(function(el) {
              let track = Object.assign({}, el);
              track.albumUri = album.uri;
              track.image = album.images[0].url;
              return track;
            });
            this.setState({
              artistAllTracks: [
                ...this.state.artistAllTracks,
                ...newTracksOfAlbum
              ]
            });
          }
        }.bind(this)
      );
    });
  }

  getArtistAlbums(artistId, offset) {
    let allAlbums = this.state.chosenArtistAlbums.slice();
    spotifyApi.getArtistAlbums(
      artistId,
      {
        include_groups: "album,single",
        limit: 50,
        country: "US",
        offset: offset
      },
      function(err, data) {
        allAlbums.push(data.items[0]);
        for (var i = 1; i < data.items.length; i++) {
          if (data.items[i].name !== data.items[i - 1].name) {
            allAlbums.push(data.items[i]);
          }
        }
        this.setState({
          chosenArtistAlbums: allAlbums
        });
        if (data.items.length === 50) {
          this.getArtistAlbums(artistId, offset + 50);
        }
      }.bind(this)
    );
  }

  clickArtistProfile = artist => {
    const twoSongs = this.randomTwoSongs();
    this.setState({
      chosenArtist: artist
    });
    fetch("/audio_features?artist=" + artist.uri).then(response =>
      response.json().then(data => {
        console.log(data);
      })
    );

    spotifyApi.getMyTopTracks(
      { limit: 50, time_range: "medium_term" },
      function(err, data) {
        data.items.forEach(track =>
          spotifyApi.getAudioFeaturesForTrack(
            track.id,
            function(err, data) {
              if (err) {
                console.log(err);
              } else {
                audioFeatures.forEach(audioFeature =>
                  this.setState(prevState => ({
                    overallSound: {
                      ...prevState.overallSound,
                      [audioFeature]:
                        this.state.overallSound[audioFeature] +
                        data[audioFeature]
                    }
                  }))
                );
              }
            }.bind(this)
          )
        );
        this.setState({
          topTracks: data.items,
          randomTrack1: data.items[twoSongs[0]],
          randomTrack2: data.items[twoSongs[1]]
        });
      }.bind(this)
    );
  };

  render() {
    return (
      <div className="container mt-4">
        {this.state.chosenArtist.name ? (
          <div>
            <ClickedTitleText
              artist={this.state.chosenArtist}
            ></ClickedTitleText>
            {this.state.randomTrack1 && this.state.randomTrack2 ? (
              <PersonalTaste
                user={this.state.user}
                track1={this.state.randomTrack1}
                track2={this.state.randomTrack2}
                overallSound={this.state.overallSound}
                artist={this.state.chosenArtist}
                artistAlbums={this.state.chosenArtistAlbums}
                artistOverallSound={this.state.chosenArtistOverallSound}
                artistNoOfTracks={this.state.artistAllTracks.length}
                recommendedTracks={this.state.artistAllTracks.slice(0, 10)}
                token={this.props.token}
              ></PersonalTaste>
            ) : (
              ""
            )}
          </div>
        ) : (
          <div>
            <SearchTitleText></SearchTitleText>
            <div className="row mt-4 mb-4">
              <div className="col-sm-3"></div>
              <div className="col-sm-6">
                <input
                  type="email"
                  className="form-control form-control-lg"
                  placeholder="Search Artist"
                  onChange={this.onSearchChange}
                ></input>
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
