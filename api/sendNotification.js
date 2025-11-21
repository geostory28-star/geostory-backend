import admin from "../lib/firebaseAdmin.js";

export default async function handler(req, res) {
    const { userId, title, body } = req.body;

    const snapshot = await admin.database()
        .ref("notificationTokens/" + userId)
        .once("value");

    if (!snapshot.exists()) {
        return res.json({ error: "No token stored for user" });
    }

    const token = snapshot.val().token;

    await admin.messaging().send({
        token,
        notification: { title, body }
    });

    res.json({ success: true });
}
