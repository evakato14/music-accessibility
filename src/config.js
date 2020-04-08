export const authEndpoint = "https://accounts.spotify.com/authorize";

// Replace with your app's client ID, redirect URI and desired scopes
export const clientId = CLIENT_ID;
export const redirectUri = "http://localhost:3000";
export const scopes = [
  "user-top-read",
  "user-read-currently-playing",
  "user-read-playback-state",
  "user-modify-playback-state"
];
