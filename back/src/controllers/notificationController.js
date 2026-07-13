import {
    getMyNotificationsService,
    markAllNotificationsReadService,
    markNotificationReadService,
} from "../services/notificationService.js";

const getMyNotifications = async (req, res) => {
    try {
        const result = await getMyNotificationsService(req.user.id);

        return res.status(200).json({
            message: result.notifications.length === 0 ? "No notifications yet" : "Notifications loaded successfully",
            unread_count: result.unreadCount,
            notifications: result.notifications,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to load notifications",
            error: error.message,
        });
    }
};

const markNotificationRead = async (req, res) => {
    try {
        const notificationId = Number(req.params.notificationId);

        if (!Number.isInteger(notificationId) || notificationId <= 0) {
            return res.status(400).json({
                message: "Invalid notification id",
            });
        }

        const result = await markNotificationReadService(req.user.id, notificationId);

        if (result.status === "not_found") {
            return res.status(404).json({
                message: result.message,
            });
        }

        return res.status(200).json({
            message: result.message,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to update notification",
            error: error.message,
        });
    }
};

const markAllNotificationsRead = async (req, res) => {
    try {
        const result = await markAllNotificationsReadService(req.user.id);

        return res.status(200).json({
            message: result.message,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to update notifications",
            error: error.message,
        });
    }
};

export {
    getMyNotifications,
    markAllNotificationsRead,
    markNotificationRead,
};
