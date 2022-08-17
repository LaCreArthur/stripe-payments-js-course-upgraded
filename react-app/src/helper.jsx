import { auth } from "./firebase";

const API =
  // local host for DEV
  "http://localhost:3333";
// firebase functions emulator
// "http://localhost:5001/YOUR-FIREBASE-PROJECT-ID/us-central1/app";
// Firebase Functions URL for PROF
// "https://us-central1-YOUR-FIREBASE-PROJECT-ID.cloudfunctions.net/app";

export async function fecthFromAPI(endpointURL, opts) {
  const { method, body } = { method: "POST", body: null, ...opts };

  const user = auth.currentUser;
  const token = user && (await user.getIdToken());

  const res = await fetch(`${API}/${endpointURL}`, {
    method,
    ...(body && { body: JSON.stringify(body) }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
}
