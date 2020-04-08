import React from "react";
import Recommended from "./Recommended";

function albumTypes(albums, type) {
  let numAlbums;
  for (var i = 0; i < albums.length; i++) {
    if (albums[i].album_type == "album") {
      numAlbums = i + 1;
    }
  }
  if (type == "album") return numAlbums;
  return albums.length - numAlbums;
}

function noOfRecommendedAlbums(noOfAlbums) {
  return Math.trunc(noOfAlbums / 2);
}

function PersonalTaste(props) {
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
          {props.artist.name} has released{" "}
          <span className="text-primary">
            {albumTypes(props.artistAlbums, "album")} album(s)
          </span>{" "}
          and{" "}
          <span className="text-primary">
            {albumTypes(props.artistAlbums, "single")} single(s)
          </span>{" "}
          on Spotify. We calculated the audio features of {props.artist.name}
          {props.artist.name.slice(-1).toLowerCase() == "s" ? "'" : "'s"}{" "}
          overall sound.
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
                  {props.overallSound[audioFeature] && props.artistNoOfTracks
                    ? (
                        props.artistOverallSound[audioFeature] /
                        props.artistNoOfTracks
                      ).toFixed(3)
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
                    ? (props.overallSound[audioFeature] / 50).toFixed(3)
                    : "Loading..."}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <h3 className="col-6 align-self-center">
          <div>
            <img
              src={props.user.images[0].url}
              className="img-responsive rounded-circle mb-3 w-25"
            ></img>
          </div>
          We calculated the audio features of your overall music taste, based on
          your favorite songs like{" "}
          <span className="text-primary">{props.track1.name}</span> by{" "}
          <span className="text-secondary">{props.track1.artists[0].name}</span>{" "}
          and <span className="text-primary">{props.track2.name}</span> by{" "}
          <span className="text-secondary">{props.track2.artists[0].name}</span>
          .
        </h3>
      </div>
      <Recommended
        artist={props.artist}
        recommendedTracks={props.recommendedTracks}
        token={props.token}
        artistAlbums={props.artistAlbums}
        noOfRecommendedAlbums={noOfRecommendedAlbums(
          albumTypes(props.artistAlbums, "album")
        )}
      ></Recommended>
    </div>
  );
}

export default PersonalTaste;
