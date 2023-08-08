// Because this is a single page application
// we detect a callback from Spotify by checking for the hash fragment
import { redirectToAuthCodeFlow, getAccessToken } from "./authCodeWithPkce";

const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID
const SPOTIFY_CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET

const code =  "AQDDZBpO_x8yeXvDsjKfSJJBt9Ze7HrRoOT2VpqrIUtqDgs6CL35ULNYgXalQtEN4AGgSnDrJW-mmui452qkcOEkdKo8HzdbbCKrPP6gKAs3E5uinkpAS0AHbq2saTtjGtsxji9ukxKPbPKwoK9SYB8ZdrV8a4cTm5-Mlr8h6STrpOl-spzY0H9DfOvgcY373Y6k-7BSMLb9QsjAE72Ic3RGqoHXbd5o3wDPRvQ3C7vRiop6iAiho4YDcPT5YBbvt3e8vnaTo5HnqKY1OSEO666g7gqbBJVF0Q"

// search setlist.fm for artist
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