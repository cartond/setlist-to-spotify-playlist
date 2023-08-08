// Because this is a single page application
// we detect a callback from Spotify by checking for the hash fragment
import { redirectToAuthCodeFlow, getAccessToken } from "./authCodeWithPkce";

const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID
const SPOTIFY_CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET
const SETLIST_FM_API_KEY = import.meta.env.VITE_SETLIST_FM_API_KEY
const SETLIST_API_URL = "https://api.setlist.fm/rest/1.0/"
const SPOTIFY_API_URL = "https://api.spotify.com/v1/"


/* 
    Search setlist.fm for artist
    Setlists: https://api.setlist.fm/docs/1.0/json_Setlists.html
    Setlist: https://api.setlist.fm/docs/1.0/json_Setlist.html
    This returns an _array_ of setlists, each one is a different version (user update) so maybe we need to sort and get latest by `lastUpdated`

    TODO: We could (in the background) search for the artist on Spotify and get the artist image
*/
async function searchSetlistFmByArtist(artist: string) {
    const result = await fetch(`${SETLIST_API_URL}search/setlists?artistName=${artist}`, {
        method: "GET", headers: { "x-api-key": SETLIST_FM_API_KEY }
    });

    return await result.json();
}
// search artist for concerts
// scrape song list from single concert
// attempt spotify auth
// create playlist
// add songs to playlist


async function attemptAuthentication() {
    if (!SPOTIFY_CLIENT_ID) {
        // In the real world this would be an API/library error,
        //   but for this demo let's just `alert` and stop further execution
        alert("Missing SPOTIFY_CLIENT_ID env variable")
        throw new Error("Missing SPOTIFY_CLIENT_ID env variable");
    }
    if (!SPOTIFY_CLIENT_SECRET) {
        // In the real world this would be an API/library error,
        //   but for this demo let's just `alert` and stop further execution
        alert("Missing SPOTIFY_CLIENT_SECRET env variable")
        throw new Error("Missing SPOTIFY_CLIENT_SECRET env variable");
    }

    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (!code) {
        redirectToAuthCodeFlow(SPOTIFY_CLIENT_ID);
    } else {
        const accessToken = await getAccessToken(SPOTIFY_CLIENT_ID, code);
        const profile = await fetchProfile(accessToken);
        populateUI(profile);
    }
}

async function fetchProfile(code: string): Promise<UserProfile> {
    const result = await fetch("https://api.spotify.com/v1/me", {
        method: "GET", headers: { Authorization: `Bearer ${code}` }
    });

    return await result.json();
}

function populateUI(profile: UserProfile) {
    debugger
    document.getElementById("displayName")!.innerText = profile.display_name;
    document.getElementById("avatar")!.setAttribute("src", profile.images[0].url)
    document.getElementById("id")!.innerText = profile.id;
    document.getElementById("email")!.innerText = profile.email;
}