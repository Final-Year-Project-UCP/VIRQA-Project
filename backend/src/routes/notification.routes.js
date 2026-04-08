import { Router } from "express";
import { verifyJwt } from "../middlewares/authMiddleware.js";
import {
    getNotifications,
    markAsRead,
    markAllRead,
    deleteNotification
} from "../controllers/notification.controller.js";

const notificationRouter = Router();

// Secure all notification routes
notificationRouter.use(verifyJwt);

notificationRouter.get("/", getNotifications);
notificationRouter.patch("/mark-all-read", markAllRead);
notificationRouter.patch("/:id", markAsRead);
notificationRouter.delete("/:id", deleteNotification);

export default notificationRouter;
