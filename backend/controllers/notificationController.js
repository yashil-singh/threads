import Notification from "../database/models/notifications.js";

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipientId: req.user._id,
    }).sort({
      createdAt: -1,
    });

    res.success({ data: notifications });
  } catch (error) {
    res.error({ status: 500, error });
  }
};

export const readAllNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    await Notification.updateMany(
      { recipientId: userId, read: false },
      { $set: { read: true } }
    );

    res.success({ message: "All notifications marked as read." });
  } catch (error) {
    res.error({ status: 505, error });
  }
};
