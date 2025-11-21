import admin from "../lib/firebaseAdmin.js";

export default async function handler(req, res) {
    const { userId, token } = req.body;

    if (!userId || !token)
        return res.status(400).json({ error: "Missing userId or token" });

    await admin.database()
        .ref("notificationTokens/" + userId)
        .set({ token });

    res.json({ success: true });
}
