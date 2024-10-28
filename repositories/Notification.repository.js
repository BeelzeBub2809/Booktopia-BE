const { Notification } = require('../models');

async function getNotificationById(notificationId) {
    try {
        const notification = await Notification.findById(notificationId);
        if (!notification) {
            throw new Error('Notification not found');
        }
        return notification;
    } catch (error) {
        throw new Error('Error fetching notification: ' + error.message);
    }
}

async function getUserNotifications(userId) {
    try {
        const notifications = await Notification
            .find({ userId: userId })
            .exec();
        if (!notifications) {
            throw new Error('Notification not found');
        }
        return notifications;
    } catch (error) {
        throw new Error('Error fetching notification: ' + error.message);
    }
}

async function createNotification(notificationData) {
    try {
        const notification = new Notification(notificationData);
        await notification.save();
        return notification;
    } catch (error) {
        throw new Error('Error creating notification: ' + error.message);
    }
}

const NotificationRepository = {
    getNotificationById,
    getUserNotifications,
    createNotification
};

module.exports = NotificationRepository;