import React, { useState } from "react";
import Recommended from "./Recommended";
import Popover from "react-popover";
import "./Popover.css";

function PersonalTaste(props) {
  let [albumPopoverOpen, toggleAlbumPopover] = useState(false);
  let [singlePopoverOpen, toggleSinglePopover] = useState(false);

  return (
    <div className="container mb-5 mt-4">
      <div className="row">
        <h3 className="col-5 align-self-center pb-5">
          <div>
            <img
              src={props.artist.images[0].url}
              className="img-responsive rounded-circle mb-3"
              style={{ width: "31%" }}
            ></img>
          </div>
          {props.albumTypes.albums ? (
            <div>
              Using{" "}
              <Popover
                isOpen={albumPopoverOpen}
                className="Popover-body Popover-tipShape"
                body={
                  <div className="container">
                    {props.albumTypes.albums.length < 5 ? (
                      props.albumTypes.albums.map(album => (
                        <div className="mt-2 mb-2">
                          <img
                            src={album.album_art}
                            style={{ width: "8%" }}
                          ></img>
                          <span className="h5 ml-2">{album.title}</span>
                        </div>
                      ))
                    ) : (
                      <div className="row">
                        {props.albumTypes.albums.map(album => (
                          <div className="col-6 mt-1 mb-1">
                            <img
                              src={album.album_art}
                              style={{ width: "10%" }}
                            ></img>
                            <span className="h5 ml-2">{album.title}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                }
                place="right"
                onOuterAction={toggleAlbumPopover}
              >
                <btn
                  className="btn btn-light btn-lg"
                  onClick={() => toggleAlbumPopover(!albumPopoverOpen)}
                >
                  <span className="text-primary h5">
                    {props.albumTypes.albums.length}{" "}
                    {props.albumTypes.albums.length == 1 ? "album" : "albums"}
                  </span>
                </btn>
              </Popover>{" "}
              and{" "}
              <Popover
                isOpen={singlePopoverOpen}
                className="Popover-body Popover-tipShape"
                body={
                  <div className="container">
                    {props.albumTypes.singles.length < 5 ? (
                      props.albumTypes.singles.map(single => (
                        <div className="mt-2 mb-2">
                          <img
                            src={single.album_art}
                            style={{ width: "8%" }}
                          ></img>
                          <span className="h5 ml-2">{single.title}</span>
                        </div>
                      ))
                    ) : (
                      <div className="row ">
                        {props.albumTypes.singles.map(single => (
                          <div className="col-6 mt-1 mb-1">
                            <img
                              src={single.album_art}
                              style={{ width: "10%" }}
                            ></img>
                            <span className="h5 ml-2">{single.title}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                }
                place="right"
                onOuterAction={toggleSinglePopover}
              >
                <btn
                  className="btn btn-light btn-lg"
                  onClick={() => toggleSinglePopover(!singlePopoverOpen)}
                >
                  <span className="text-primary h5">
                    {props.albumTypes.singles.length}{" "}
                    {props.albumTypes.singles.length == 1
                      ? "single"
                      : "singles"}
                  </span>
                </btn>
              </Popover>{" "}
              on Spotify, here are the audio features of {props.artist.name}
              {props.artist.name.slice(-1).toLowerCase() == "s"
                ? "'"
                : "'s"}{" "}
              overall sound.
            </div>
          ) : (
            "Loading..."
          )}
        </h3>
        <table className="table table-borderless col-7">
          <thead>
            <tr>
              <th scope="col">Feature</th>
              <th scope="col">Value</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(props.artistOverallSound).map(audioFeature => (
              <tr>
                <td className="text-info">{audioFeature}</td>
                <td>
                  {props.overallSound[audioFeature]
                    ? props.artistOverallSound[audioFeature].toFixed(3)
                    : "Loading..."}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="row">
        <table className="table table-borderless col-6">
          <thead>
            <tr>
              <th scope="col">Feature</th>
              <th scope="col">Value</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(props.overallSound).map(audioFeature => (
              <tr>
                <td className="text-info">{audioFeature}</td>
                <td>
                  {props.overallSound[audioFeature]
                    ? props.overallSound[audioFeature].toFixed(3)
                    : "Loading..."}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <h3 className="col-6 align-self-center">
          <div>
            {props.user.images ? (
              <img
                src={props.user.images[0].url}
                className="img-responsive rounded-circle mb-3 w-25"
              ></img>
            ) : (
              ""
            )}
          </div>
          We calculated the audio features of your overall music taste, based on
          your favorite songs like{" "}
          {props.twoTracks ? (
            <div>
              <span className="text-primary">{props.twoTracks[0].name}</span> by{" "}
              <span className="text-secondary">
                {props.twoTracks[0].artists[0].name}
              </span>{" "}
              and{" "}
              <span className="text-primary">{props.twoTracks[1].name}</span> by{" "}
              <span className="text-secondary">
                {props.twoTracks[1].artists[0].name}
              </span>
              .
            </div>
          ) : (
            <div></div>
          )}
        </h3>
      </div>
      <Recommended
        artist={props.artist}
        recommendedTracks={props.recommendedTracks}
        token={props.token}
        artistAlbums={props.artistAlbums}
        noOfRecommendedAlbums={1}
      ></Recommended>
    </div>
  );
}

export default PersonalTaste;
