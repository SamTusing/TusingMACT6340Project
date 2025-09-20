import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config(); // loads your .env file

async function getRefreshToken() {
  const { OAuth2 } = google.auth;

  const oAuth2Client = new OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "https://developers.google.com/oauthplayground" // redirect URI
  );

  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://mail.google.com/"],
  });

  console.log("Authorize this app by visiting this url:", authUrl);
}

getRefreshToken();
