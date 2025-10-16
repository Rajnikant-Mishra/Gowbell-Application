import { City } from "../../models/Region/City.js";
import { logActivity } from "../../models/dashboard/activityModel.js";

// export const createCity = (req, res) => {
//   const { name, country_id, state_id, district_id, status } = req.body;
//   // const created_by = req.user?.id; // Assuming the user ID is stored in `req.user` after authentication
//   const created_by = req.user.id;
//   if (!created_by) {
//     return res.status(401).json({ error: "Unauthorized: User ID is required" });
//   }

//   // Check for duplicate city before creating
//   City.create(name, country_id, state_id, district_id, status, created_by, (err, result) => {
//     if (err) {
//       if (err.message === 'City already exists') {
//         return res.status(400).json({ error: 'City already exists in this district.' });
//       }
//       return res.status(500).json({ error: err.message });
//     }
//     res.status(201).json({ message: 'City created', cityId: result.insertId });
//   });
// };

export const createCity = (req, res) => {
  const { name, country_id, state_id, district_id, status } = req.body;
  const userId = req.user?.id || "system";
  const userName = req.user?.name || "System";

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized: User ID is required" });
  }

  City.create(
    name,
    country_id,
    state_id,
    district_id,
    status,
    userId,
    (err, result) => {
      if (err) {
        if (err.message === "City already exists") {
          return res
            .status(400)
            .json({ error: "City already exists in this district." });
        }
        return res.status(500).json({ error: err.message });
      }

      // ✅ Activity log
      try {
        logActivity({
          user_id: userId,
          user_name: userName,
          activity: `City "${name}" has been created`,
          data: {
            cityId: result.insertId,
            name,
            country_id,
            state_id,
            district_id,
            status,
          },
          ip_address: req.ip || req.socket?.remoteAddress || null,
        });
      } catch (logErr) {
        console.error("Activity Log Error:", logErr.message);
      }

      res
        .status(201)
        .json({ message: "City created", cityId: result.insertId });
    }
  );
};

export const getAll = (req, res) => {
  City.getAllcities((err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(results);
  });
};

// Controller function to handle API request
export const getAllCities = (req, res) => {
  let { page = 1, limit = 10, search = "" } = req.query;
  page = parseInt(page, 10);
  limit = parseInt(limit, 10);

  if (isNaN(page) || page < 1) page = 1;
  if (isNaN(limit) || limit < 1) limit = 10;
  search = search ? search.trim() : "";

  City.getAll(page, limit, search, (err, data) => {
    if (err) return res.status(500).json({ error: err.message });

    res.status(200).json(data);
  });
};

export const getCityById = (req, res) => {
  const { id } = req.params;
  City.getById(id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0)
      return res.status(404).json({ message: "City not found" });
    res.status(200).json(result[0]);
  });
};

// export const updateCity = (req, res) => {
//   const { id } = req.params;
//   const { name, country_id, state_id, district_id, status } = req.body;

//   // Check for undefined or invalid values
//   if (!name || !country_id || !state_id || !district_id || !status) {
//     return res.status(400).json({ error: "All fields are required" });
//   }

//   // Check for duplicate city before updating
//   City.update(
//     id,
//     name,
//     country_id,
//     state_id,
//     district_id,
//     status,
//     (err, result) => {
//       if (err) {
//         if (err.message === "City already exists") {
//           return res
//             .status(400)
//             .json({ error: "City already exists in this district." });
//         }
//         return res.status(500).json({ error: err.message });
//       }
//       res.status(200).json({ message: "City updated" });
//     }
//   );
// };

export const updateCity = (req, res) => {
  const { id } = req.params;
  const { name, country_id, state_id, district_id, status } = req.body;
  const userId = req.user?.id || "system";
  const userName = req.user?.name || "System";

  if (!name || !country_id || !state_id || !district_id || !status) {
    return res.status(400).json({ error: "All fields are required" });
  }

    City.update(
      id,
      name,
      country_id,
      state_id,
      district_id,
      status,
      (err, result) => {
        if (err) {
          if (err.message === "City already exists") {
            return res
              .status(400)
              .json({ error: "City already exists in this district." });
          }
          return res.status(500).json({ error: err.message });
        }

        // ✅ Activity log
        try {
          logActivity({
            user_id: userId,
            user_name: userName,
            activity: `City "${name}" has been updated`,
            data: { cityId: id, updatedFields: req.body },
            ip_address: req.ip || req.socket?.remoteAddress || null,
          });
        } catch (logErr) {
          console.error("Activity Log Error:", logErr.message);
        }

        res.status(200).json({ message: "City updated" });
      }
    );
};

// export const deleteCity = (req, res) => {
//   const { id } = req.params;
//   City.delete(id, (err, result) => {
//     if (err) return res.status(500).json({ error: err.message });
//     res.status(200).json({ message: "City deleted" });
//   });
// };

export const deleteCity = (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id || "system";
  const userName = req.user?.name || "System";

  // Fetch city for logging
  City.getById(id, (fetchErr, existing) => {
    if (fetchErr) return res.status(500).json({ error: fetchErr.message });
    if (!existing || existing.length === 0)
      return res.status(404).json({ error: "City not found" });

    City.delete(id, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      // ✅ Activity log
      try {
        logActivity({
          user_id: userId,
          user_name: userName,
          activity: `City "${existing[0].name}" has been deleted`,
          data: { cityId: id },
          ip_address: req.ip || req.socket?.remoteAddress || null,
        });
      } catch (logErr) {
        console.error("Activity Log Error:", logErr.message);
      }

      res.status(200).json({ message: "City deleted" });
    });
  });
};