// pages/admin/notifications.js
import SharedNotifications from "../../../components/common/Notifications/Notification.jsx";
import { adminNotifications } from "../../../data/adminNotificationsData";

const AdminNotification = () => {
    return (
        <SharedNotifications
            notifications={adminNotifications}
            title="Admin Notifications"
        />
    );
}

export default AdminNotification;