// Users and usage, stored in Firebase (Firestore). Sign-in is handled by Firebase Authentication.
import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

const usingEmulator = Boolean(process.env.FIREBASE_AUTH_EMULATOR_HOST);

// FIREBASE_SERVICE_ACCOUNT holds the JSON of a service account key (keep it secret!).
function serviceAccount() {
  try {
    return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } catch {
    throw new Error(
      "FIREBASE_SERVICE_ACCOUNT is not valid JSON. Open the downloaded key file in Notepad, " +
      "copy ALL of it (from the first { to the last }) and paste it again in Render > Environment.",
    );
  }
}

const firebaseApp = process.env.FIREBASE_SERVICE_ACCOUNT
  ? initializeApp({ credential: cert(serviceAccount()) })
  : initializeApp({ projectId: process.env.GCLOUD_PROJECT || "demo-atma" });

export const firebaseReady = Boolean(process.env.FIREBASE_SERVICE_ACCOUNT) || usingEmulator;
export const firebaseEmulator = usingEmulator;

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const users = db.collection("users");
const usage = db.collection("usage");

const today = () => new Date().toISOString().slice(0, 10);

/** Checks a Firebase ID token sent by the browser; returns { uid, email } or null. */
export async function verifyToken(idToken) {
  try {
    const decoded = await auth.verifyIdToken(idToken);
    return { uid: decoded.uid, email: decoded.email ?? "" };
  } catch {
    return null;
  }
}

/** Returns the user's record, creating it on first sign-in. */
export async function getOrCreateUser(uid, email) {
  const ref = users.doc(uid);
  const snap = await ref.get();
  if (!snap.exists) {
    const fresh = { email, premium: false, stripeCustomerId: null, createdAt: FieldValue.serverTimestamp() };
    await ref.set(fresh);
    return { id: uid, ...fresh };
  }
  return { id: uid, ...snap.data() };
}

export async function questionsUsedToday(uid) {
  const snap = await usage.doc(`${uid}_${today()}`).get();
  return snap.exists ? snap.data().count : 0;
}

export function recordQuestion(uid) {
  return usage.doc(`${uid}_${today()}`).set(
    { uid, day: today(), count: FieldValue.increment(1) },
    { merge: true },
  );
}

export function setPremium(uid, premium, stripeCustomerId) {
  const data = { premium: Boolean(premium) };
  if (stripeCustomerId) data.stripeCustomerId = stripeCustomerId;
  return users.doc(uid).set(data, { merge: true });
}

export async function setPremiumByCustomer(stripeCustomerId, premium) {
  const found = await users.where("stripeCustomerId", "==", stripeCustomerId).get();
  await Promise.all(found.docs.map((d) => d.ref.update({ premium: Boolean(premium) })));
}
