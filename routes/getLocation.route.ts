import Connection from "../model/Connection.model";
import { Router, Response } from "express";
import Profile from "../model/Profile.model";
import * as geolib from "geolib";
import Notification from "../model/Notofication.model";

const router: Router = Router();

// Fetch all nearby users
router.post("/getAll", async (req:any, res:any) => {
    try {
      const { latitude, longitude } = req.body;
  
      // Validate input
      if (!latitude || !longitude) {
        return res.status(400).json({
          success: false,
          message: "Latitude and longitude are required.",
        });
      }
  
      const currentPosition = {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      };
  
      // Fetch all profiles from the database
      const allUsers = await Profile.find();
  
      // Filter nearby users within 2 meters
      const nearbyUsers = allUsers.filter((user: { location: { latitude: string; longitude: string; }; name: any; }) => {
        if (
          user.location &&
          user.location.latitude &&
          user.location.longitude
        ) {
          const userLocation = {
            latitude: parseFloat(user.location.latitude),
            longitude: parseFloat(user.location.longitude),
          };
  
          const distance = geolib.getPreciseDistance(currentPosition, userLocation);
  
          console.log(`Distance to ${user.name}: ${distance} meters`); // Debugging
  
          return distance <= 20; // Users within 2 meters
        }
        return false; // Exclude users without valid location
      });
  
      res.status(200).json({
        success: true,
        message: "Nearby users retrieved successfully.",
        data: nearbyUsers,
      });
    } catch (error:any) {
      console.error("Error fetching nearby users:", error.message);
      res.status(500).json({
        success: false,
        message: "Error fetching nearby users.",
        error: error.message,
      });
    }
  });

// Connect two users
router.post('/connect', async (req:any, res:any) => {
    const { userId, connectId } = req.body;
    console.log(req.body)
    // Ensure both userId and connectId are provided
    if (!userId || !connectId) {
      return res.status(400).json({ message: 'userId and connectId are required' });
    }
  
    try {
      // Find or create a connection document for the user
      let userConnection = await Connection.findOne({ userId });
      let connector = await Connection.findOne({ userId: connectId });

      if (userConnection && userConnection.userConnection.includes(connectId)) {
        return res.status(200).json({ message: 'Already connected' });
      }      
      
      if (!userConnection) {
        userConnection = new Connection({ userId, userConnection: [] });
      }


      if (!connector || !connector.userConnection || !connector?.userConnection?.includes(userId)) {
        const profile = await Profile.find({userId})
        // Create a new notification for the connected user
        const newNotification = new Notification({
            userId: connectId,
            message: `${profile[0].name} has requested to connect with you.`,
            viewed: false,
            connectId:userId,
            tag:'Accept'
        });
        // Save the new notification
        await newNotification.save();
      }
    
      // Add connectId to the user's userConnection array if not already added
      if (!userConnection.userConnection.includes(connectId)) {
        userConnection.userConnection.push(connectId);
      }
  
      // Save both connection documents
      await userConnection.save();
  
      // Return a success message
      res.status(200).json({
        message: 'Successfully connected users',
        userId,
        connectedTo: connectId,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while connecting users' });
    }
  });

// Get all connections for a user
router.post("/getconnections", async (req: any, res: any) => {
    const { userId } = req.body;
  
    try {
      // Find the connection for the provided userId
      const connections = await Connection.findOne({ userId });
  
      if (!connections || !connections.userConnection || connections.userConnection.length === 0) {
        return res.status(200).json({
          success: false,
          message: "No connections found for this userId",
          data:[]
        });
      }
  
      // Fetch profiles for all connected userIds
      const connectedProfiles = await Profile.find({
        userId: { $in: connections.userConnection },
      });
  
      res.status(200).send({
        message: "Connections fetched successfully",
        success: true,
        data: connectedProfiles,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Error fetching connection profiles",
        success: false,
        error,
      });
    }
  });

export default router;