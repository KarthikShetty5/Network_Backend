import { Router, Response } from "express";
import Profile from "../model/Profile.model";
import Connect from "../model/Connection.model";

const router: Router = Router();

// POST /create-profile
router.post("/create", async (req:any, res:any) => {
  try {
    const { userId, name, instagram, phone, email, location } = req.body;

    // Validate required fields
    if (!userId || !name || !location?.longitude || !location?.latitude) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: userId, name, longitude, or latitude",
      });
    }

    // Check if a profile already exists for the userId
    const existingProfile = await Profile.findOne({ userId });
    if (existingProfile) {
      return res.status(400).json({
        success: false,
        message: "Profile already exists for this userId",
      });
    }

    // Create a new profile
    const newProfile = new Profile({
      userId,
      name,
      instagram,
      phone,
      email,
      location,
    });

    // Save the profile to the database
    const savedProfile = await newProfile.save();

    res.status(201).json({
      success: true,
      message: "Profile created successfully",
      data: savedProfile,
    }); 
  } catch (error:any) {
    console.error("Error creating profile:", error.message);
    res.status(500).json({
      success: false,
      message: "Error creating profile",
      error: error.message,
    });
  }
});

// GET /get-profile
router.get("/getprofile",async (req:any, res:any) => {
    try {
      const profile = await Profile.find();
      res.status(200).send({
        message: "Profile fetched successfully",
        success: true,
        data: profile,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "Error fetching Profile account",
        success: false,
        error,
      });
    }
  });

//SignUpUser
router.post("/signup", async (req:any, res:any) => {
    try {
      const { name, userId, phone, email, location, password } = req.body;
  
      // Validate required fields
      if (!userId || !name || !password || !location?.longitude || !location?.latitude) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields: userId, longitude, or latitude",
        });
      }
  
      // Check if a profile already exists for the userId
      const existingProfile = await Profile.findOne({ userId });
      if (existingProfile) {
        return res.status(400).json({
          success: false,
          message: "Profile already exists for this userId",
        });
      }
  
      // Create a new profile
      const newProfile = new Profile({
        userId,
        name,
        password,
        phone,
        email,
        location,
      });
  
      // Save the profile to the database
      const savedProfile = await newProfile.save();
  
      res.status(201).json({
        success: true,
        message: "Profile created successfully",
        data: savedProfile,
      }); 
    } catch (error:any) {
      console.error("Error creating profile:", error.message);
      res.status(500).json({
        success: false,
        message: "Error creating profile",
        error: error.message,
      });
    }
  });

//LoginUser
router.post("/login", async(req:any, res:any) => {
    const { phone, password } = req.body;
  
    try {  
      // Check if the phone and password are provided
      if (!phone || !password) {
        return res.status(400).json({
          success: false,
          message: "Phone number and password are required",
        });
      }
  
      // Find the user profile based on phone number
      const userProfile = await Profile.findOne({ phone });
      if (!userProfile) {
        return res.status(404).json({
          success: false,
          message: "No user found with this phone number",
        });
      }
      console.log(userProfile)
  
      // Compare the provided password with the hashed password in the database
      // const isPasswordValid = await bcrypt.compare(password, userProfile.password);
      if (!password) {
        return res.status(401).json({
          success: false,
          message: "Incorrect password",
        });
      }
  
      // Login successful
      res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
          userId: userProfile.userId,
          name: userProfile.name,
          phone: userProfile.phone,
          email: userProfile.email,
          location: userProfile.location,
        },
      });
    } catch (error:any) {
      console.error("Error during login:", error.message);
      res.status(500).json({
        success: false,
        message: "Error during login",
        error: error.message,
      });
    }
  });
  
// Route to update the location of a user
router.put("/update", async (req:any, res:any) => {
    const { userId, location } = req.body;

    // Validate the input
    if (!userId || !location) {
      return res.status(400).json({ message: "Invalid input. Please provide userId and valid location." });
    }
  
    try {
      // Find the user by userId and update the location
      const updatedProfile = await Profile.find({ userId });
      updatedProfile[0].location = location;
      const save  = await updatedProfile[0].save();

      if (!updatedProfile) {
        return res.status(404).json({ message: "User not found." });
      }

      res.status(200).json({
        message: "Location updated successfully.",
        profile: updatedProfile,
      });
    } catch (error) {
      console.error("Error updating location:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  });
  

export default router;