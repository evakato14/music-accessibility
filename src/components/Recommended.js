import React, { Component } from "react";
import * as SpotifyWebApi from "spotify-web-api-js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faStar as farFaStar } from "@fortawesome/free-regular-svg-icons";
import Rate from "./Rate";
import ReactModal from "react-modal";
import { customStyles } from "./modalStyles";

var spotifyApi = new SpotifyWebApi();
library.add(farFaStar);

class PersonalTaste extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      modalTrack: ""
    };

    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }
  componentDidMount() {
    spotifyApi.setAccessToken(this.props.token);
  }

  play(albumUri, trackUri) {
    console.log(albumUri, trackUri);
    spotifyApi.play(
      { context_uri: albumUri, offset: { uri: trackUri } },
      function(err, data) {
        console.log(data);
      }
    );
  }

  handleOpenModal = trackName => {
    this.setState({ showModal: true, modalTrack: trackName });
  };

  handleCloseModal() {
    this.setState({ showModal: false });
  }

  render() {
    return (
      <div className="container">
        <div className="row mt-4">
          <h3 className="col-6 align-self-center">
            Here are the <span className="text-primary">top 10 songs</span> we
            recommend for you to get into {this.props.artist.name}
            {this.props.artist.name.slice(-1).toLowerCase() == "s"
              ? "'"
              : "'s"}{" "}
            music.
          </h3>
          <table className="table col-6">
            <tbody>
              {this.props.recommendedTracks ? (
                this.props.recommendedTracks.map((track, i) => (
                  <tr>
                    <th
                      scope="row"
                      style={{ width: "5%" }}
                      className="align-self-center"
                    >
                      <h6 className="mt-2">{i + 1}</h6>
                    </th>
                    <td style={{ width: "10%" }} className="align-self-center">
                      <img
                        src={track.album_art}
                        style={{ width: "125%" }}
                      ></img>
                    </td>
                    <td style={{ width: "75%" }} className="text-left">
                      <h6 className="mt-2">
                        <strong>{track.title}</strong>
                      </h6>
                    </td>
                    <td style={{ width: "5%" }} className="text-right">
                      <a
                        className="btn btn-sm"
                        onClick={() =>
                          this.play(
                            "spotify:album:" + track.album_id,
                            "spotify:track:" + track.track_id
                          )
                        }
                      >
                        <i className="fa fa-play-circle fa-2x"></i>
                      </a>
                    </td>
                    <td style={{ width: "5%" }} className="text-right">
                      <a
                        className="btn btn-sm"
                        onClick={() => this.handleOpenModal(track.title)}
                      >
                        <FontAwesomeIcon
                          icon={farFaStar}
                          size="lg"
                          className="mt-1"
                        />
                      </a>
                    </td>
                  </tr>
                ))
              ) : (
                <div></div>
              )}
            </tbody>
            <ReactModal isOpen={this.state.showModal} style={customStyles}>
              <div className="text-center">
                <h3>
                  Rate{" "}
                  <span className="text-primary">
                    "{this.state.modalTrack}"
                  </span>
                </h3>
                <h5>1 star (least enjoyment) to 10 stars (most enjoyment)</h5>
                <p>
                  Rating songs helps our recommendation algorithm become
                  smarter.
                </p>
              </div>
              <div className="row mt-4">
                <div className="col text-center">
                  <Rate></Rate>
                </div>
              </div>
              <div className="row mt-4">
                <div className="col text-center">
                  <button
                    className="btn btn-primary "
                    onClick={this.handleCloseModal}
                  >
                    Save
                  </button>
                </div>
              </div>
            </ReactModal>
          </table>
        </div>
        <div className="row mt-3 mb-3 ">
          <div className="col-1"></div>
          <h3 className="col-10">
            Here are the <span className="text-primary">top album(s)</span> we
            recommend for you to get into {this.props.artist.name}
            {this.props.artist.name.slice(-1).toLowerCase() == "s"
              ? "'"
              : "'s"}{" "}
            music.
          </h3>
        </div>
        <div className="row justify-content-center">
          <h3 className="text-danger display-4">Coming soon!</h3>
        </div>
      </div>
    );
  }
}

export default PersonalTaste;
