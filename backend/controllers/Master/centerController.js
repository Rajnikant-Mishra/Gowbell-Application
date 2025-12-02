import Center from "../../models/Master/centerModel.js";

export const getCenters = (req, res) => {
  Center.getAll((err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

// Controller
export const getCentersAll = (req, res) => {
  // Get query parameters with defaults
  const { page = 1, limit = 10, search = "" } = req.query;

  // Call the model
  Center.getCenterAll(page, limit, search, (err, result) => {
    if (err) return res.status(500).json({ error: err.message || err });

    res.json(result);
  });
};

export const getCenterById = (req, res) => {
  Center.getById(req.params.id, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.length === 0)
      return res.status(404).json({ message: "Center not found" });
    res.json(result[0]);
  });
};

export const createCenter = (req, res) => {
  const { center_name, address } = req.body;

  if (!center_name || center_name.trim() === "") {
    return res.status(400).json({ message: "Center name is required" });
  }

  Center.create({ center_name, address }, (err, createdCenter) => {
    if (err) {
      if (err.duplicate) {
        return res
          .status(400)
          .json({ message: "This Center name already exists!" });
      }
      return res.status(500).json({ message: "Database error", error: err });
    }

    res.status(201).json({
      message: "Center created successfully",
      center: createdCenter,
    });
  });
};

export const updateCenter = (req, res) => {
  const { id } = req.params;
  const { center_name, center_code, address } = req.body;

  if (!center_name || center_name.trim() === "") {
    return res.status(400).json({ message: "Center name is required" });
  }

  Center.update(id, { center_name, center_code, address }, (err, result) => {
    if (err) {
      if (err.notFound) {
        return res.status(404).json({ message: "Center not found" });
      }
      return res.status(500).json({ message: "Database error", error: err });
    }

    res.status(200).json(result);
  });
};

export const deleteCenter = (req, res) => {
  Center.delete(req.params.id, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Center deleted" });
  });
};
