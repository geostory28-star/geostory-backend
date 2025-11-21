import admin from "../lib/firebaseAdmin.js";

export default async function handler(req, res) {
  try {
    const { type, fromUid, fromName, fromAvatar, toUid } = req.body;

    if (!toUid) {
      return res.status(400).json({ error: "Missing toUid" });
    }

    // Get the receiver's stored token
    const snap = await admin
      .database()
      .ref("notificationTokens/" + toUid)
      .once("value");

    if (!snap.exists()) {
      return res.json({ error: "No FCM token found for this user" });
    }

    const token = snap.val().token;

    // Create a proper notification message
    let title = "";
    let body = "";

    if (type === "follow") {
      title = "New Follower!";
      body = `${fromName} started following you`;
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
