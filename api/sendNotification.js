import admin from "../lib/firebaseAdmin.js";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Only POST allowed" });
    }

    const { type, fromUid, fromName, fromAvatar, toUid } = req.body;

    if (!toUid) {
      return res.status(400).json({ error: "Missing toUid" });
    }

    // FIXED PATH: Fetch token from "tokens/" instead of "notificationTokens/"
    const snap = await admin
      .database()
      .ref("tokens/" + toUid)
      .once("value");

    if (!snap.exists()) {
      return res.json({ error: "No FCM token found for this user" });
    }

    const token = snap.val().token;

    // Build notification
    let title = "";
    let body = "";

    if (type === "follow") {
      title = "New Follower!";
      body = `${fromName} started following you`;
    } else {
      title = "Notification";
      body = "You have a new update";
    }

    await admin.messaging().send({
      token,
      notification: {
        title,
        body,
        icon: fromAvatar || "/icon.png",
      },
      data: {
        type: type || "general",
        fromUid: fromUid || "",
      },
    });

    return res.json({ success: true });
  } catch (err) {
    console.error("Error sending notification:", err);
    return res.status(500).json({ error: err.message });
  }
}
