// pages/candidate/notifications.js
import { motion } from 'framer-motion';
import SharedNotifications from '../../../components/common/Notifications/Notification';

let CandidateNotificationsPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } }}
      exit={{ opacity: 0, y: -15, transition: { duration: 0.2, ease: 'easeIn' } }}
    >
      <SharedNotifications />
    </motion.div>
  );
}
export default CandidateNotificationsPage