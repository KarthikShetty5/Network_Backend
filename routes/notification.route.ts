import Connection from "../model/Connection.model";
import { Router, Response } from "express";
import Notification from "../model/Notofication.model";

const router: Router = Router();

// Fetch all notifications for a user
router.post('/notification', async (req:any, res:any) => {
    const { userId } = req.body;
    try {
      const messages = await Notification.find({userId});
  
      res.json(messages);
    } catch (err:any) {
      res.status(500).json({ error: err.message });
    }
  });

// Accept Notification Route
router.post('/accept', async (req:any, res:any) => {
    const { connectId, userId, notificationId } = req.body;

    try {
      const notification = await Notification.findById(notificationId);
  
      if (!notification) {
        return res.status(404).json({ error: 'Notification not found' });
      }
  
      // Logic for accepting the notification (e.g., mark it as accepted, update statuses, etc.)
      notification.viewed = true; // Example: update status to 'accepted'
      let userConnection = await Connection.findOne({ userId });
      
      if (!userConnection) {
        userConnection = new Connection({ userId, userConnection: [] });
      }

      if (!userConnection.userConnection.includes(connectId)) {
        userConnection.userConnection.push(connectId);
      }
  
      // Save both connection documents
      await userConnection.save();
      await notification.save();
  
      return res.status(200).json({ message: 'Notification accepted', notification });
    } catch (error) {
      console.error('Error accepting notification:', error);
      return res.status(500).json({ error: 'Failed to accept notification' });
    }
  });
  
// Decline Notification Route
router.post('/decline', async (req:any, res:any) => {
    const { notificationId, userId } = req.body;

    try {
      const notification = await Notification.findById(notificationId);
  
      if (!notification) {
        return res.status(404).json({ error: 'Notification not found' });
      }
  
      // Logic for declining the notification (e.g., mark it as declined, update statuses, etc.)
      notification.viewed = true; // Example: update status to 'declined'  
      await notification.save();
  
      return res.status(200).json({ message: 'Notification declined', notification });
    } catch (error) {
      console.error('Error declining notification:', error);
      return res.status(500).json({ error: 'Failed to decline notification' });
    }
  });

export default router;