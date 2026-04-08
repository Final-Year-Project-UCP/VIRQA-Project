import Notification from "../models/notification.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

// @desc    Get user's notifications
// @route   GET /api/v1/user/notifications (or candidate/notifications, or employee/notifications)
const getNotifications = asyncHandler(async (req, res) => {
    const notifications = await Notification.find({ recipient: req.user._id })
        .sort({ createdAt: -1 })
        .limit(30); // Last 30 alerts

    return res.status(200).json(
        new ApiResponse(200, notifications, "Notifications fetched successfully")
    );
});

// @desc    Mark a notification as read
// @route   PATCH /api/v1/user/notifications/:id
const markAsRead = asyncHandler(async (req, res) => {
    const notificationId = req.params.id;
    const notification = await Notification.findOneAndUpdate(
        { _id: notificationId, recipient: req.user._id },
        { isRead: true },
        { new: true }
    );

    if (!notification) {
        throw new ApiError(404, "Notification not found");
    }

    return res.status(200).json(
        new ApiResponse(200, notification, "Notification marked as read")
    );
});

// @desc    Mark all as read
// @route   PATCH /api/v1/user/notifications/mark-all-read
const markAllRead = asyncHandler(async (req, res) => {
    await Notification.updateMany(
        { recipient: req.user._id, isRead: false },
        { isRead: true }
    );

    return res.status(200).json(
        new ApiResponse(200, {}, "All notifications marked as read")
    );
});

// @desc    Delete notification
const deleteNotification = asyncHandler(async (req, res) => {
    const notificationId = req.params.id;
    await Notification.findOneAndDelete({ _id: notificationId, recipient: req.user._id });

    return res.status(200).json(
        new ApiResponse(200, {}, "Notification deleted")
    );
});

export {
    getNotifications,
    markAsRead,
    markAllRead,
    deleteNotification
};
