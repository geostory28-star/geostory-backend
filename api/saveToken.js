import admin from "../lib/firebaseAdmin.js";

export default async function handler(req, res) {
    try {
        if (req.method !== "POST") {
            return res.status(405).json({ error: "Only POST allowed" });
        }

        const { userId, token } = req.body;

        if (!userId || !token) {
            return res.status(400).json({ error: "Missing userId or token" });
        }

        // FIXED: Save token into "tokens/" not "notificationTokens/"
        await admin
            .database()
            .ref("tokens/" + userId)
            .set({ token });

        return res.json({ success: true });

    } catch (err) {
        console.error("saveToken error:", err);
        return res.status(500).json({ error: err.message });
    }
}
