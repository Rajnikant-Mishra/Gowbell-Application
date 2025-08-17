import Subitem from "../../models/configuration/subitemModel.js";

export const getAllSubitems = (req, res) => {
  Subitem.getAll((err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

export const getSubitemById = (req, res) => {
  Subitem.getById(req.params.id, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.length === 0)
      return res.status(404).json({ message: "Subitem not found" });
    res.json(result[0]);
  });
};

export const createSubitem = (req, res) => {
  Subitem.create(req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ message: "Subitem created", id: result.insertId });
  });
};

export const updateSubitem = (req, res) => {
  Subitem.update(req.params.id, req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Subitem updated" });
  });
};

export const deleteSubitem = (req, res) => {
  Subitem.delete(req.params.id, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Subitem deleted" });
  });
};

export const getSubitemsByItemId = (req, res) => {
  const itemId = req.params.item_id;

  Subitem.getSubitemsByItemId(itemId, (err, results) => {
    if (err) {
      console.error("DB error:", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    if (results.length === 0) {
      return res
        .status(404)
        .json({ message: "No subitems found for the given item_id" });
    }

    res.status(200).json(results);
  });
};

// export const getNameFromParentId = (req, res) => {
//   const { parent_id } = req.params;

//   Subitem.getNamesByParentId(parent_id, (err, results) => {
//     if (err) return res.status(500).json({ error: err.message });

//     if (results.length === 0) {
//       return res.status(404).json({ message: "No names found" });
//     }

//     // Return all names as an array
//     const names = results.map((row) => row.name);
//     res.json({ parent_id, names });
//   });
// };

// export const getParentNameFromItemId = (req, res) => {
//   const { item_id } = req.params;

//   Subitem.getParentNameByItemid(item_id, (err, results) => {
//     if (err) return res.status(500).json({ error: err.message });

//     if (results.length === 0) {
//       return res.status(404).json({ message: "No parent found" });
//     }

//     // Extract all parent names into an array
//     const parentNames = results
//       .map((row) => row.parent_name)
//       .filter((name) => name !== null);

//     res.json({ item_id, parentNames });
//   });
// };

export const getNames = (req, res) => {
  const { parent_id, item_id } = req.query;

  Subitem.getNames(parent_id, item_id, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (!results || results.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }

    if (parent_id) {
      const names = results.map((row) => row.name);
      return res.json({ parent_id, names });
    } else if (item_id) {
      const parentNames = results
        .filter((row) => row.parent_name !== null)
        .map((row) => ({
          parent_id: row.parent_id,
          parent_name: row.parent_name,
        }));
      return res.json({ item_id, parentNames });
    }
  });
};

