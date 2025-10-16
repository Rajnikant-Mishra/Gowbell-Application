import { getAllActivities } from "../../models/dashboard/activityModel.js";

// export const fetchActivities = (req, res) => {
//   getAllActivities((err, activities) => {
//     if (err) {
//       return res.status(500).json({ error: "Failed to fetch activities" });
//     }
//     res.status(200).json(activities);
//   });
// };

export const fetchActivities = (req, res) => {
  const { session_id, search, page, limit } = req.query;

  getAllActivities(
    {
      session_id,
      search,
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
    },
    (err, data) => {
      if (err) {
        console.error("Fetch Activities Error:", err);
        return res.status(500).json({ error: "Failed to fetch activities" });
      }
      res.status(200).json(data);
    }
  );
};
