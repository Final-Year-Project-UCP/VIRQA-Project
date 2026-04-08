import Notification from "../models/notification.model.js";

/**
 * Global utility to create a notification and emit it to the user in real-time.
 * @param {Object} app - The Express app instance (used to get 'io').
 * @param {Object} options - { recipientId, senderId, title, message, type, data }
 */
export const createNotification = async (app, {
    recipientId,
    senderId = null,
    title,
    message,
    type = "system",
    data = {}
}) => {
    try {
        // 1. Save to Database
        const notification = await Notification.create({
            recipient: recipientId,
            sender: senderId,
            title,
            message,
            type,
            data
        });

        // 2. Emit via Socket.io to the recipient's private room
        const io = app.get("io");
        if (io) {
            io.to(recipientId.toString()).emit("new_notification", notification);
            console.log(`Real-time notification emitted to user ${recipientId}`);
        }

        return notification;
    } catch (error) {
        console.error("Error creating notification:", error);
        return null;
    }
};
