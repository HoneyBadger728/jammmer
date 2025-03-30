const clientId = "5ddac938cd6a41e28ee31fe9be4b32aa";
const redirectUri = "https://honeybadger728.github.io/jammmer/";
const scopes = [
  "playlist-modify-public",
  "playlist-modify-private",
  "user-read-private",
  "user-read-email",
];

export const getSpotifyAuthUrl = () => {
  const authUrl = new URL("https://accounts.spotify.com/authorize");
  authUrl.searchParams.append("client_id", clientId);
  authUrl.searchParams.append("response_type", "token");
  authUrl.searchParams.append("redirect_uri", redirectUri);
  authUrl.searchParams.append("scope", scopes.join(" "));

  return authUrl.toString();
};

export const getAccessToken = () => {
  let token = localStorage.getItem("spotify_access_token");

  if (!token) {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    token = hashParams.get("access_token");

    if (token) {
      localStorage.setItem("spotify_access_token", token);
      window.history.pushState({}, document.title, window.location.pathname); // Clears token from URL
    }
  }
  return token;
};
