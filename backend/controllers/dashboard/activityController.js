import  Activity from "../../models/dashboard/activityModel.js";

export const getActivities = async (req, res) => {
  try {
    const activities = await Activity.getAll();
    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

