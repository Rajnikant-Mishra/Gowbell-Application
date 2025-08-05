import Consignment from "../../models/Consignment/consignmentModel.js";



export const createConsignment = (req, res) => {
  const data = req.body;

  // Auto-generate created_by from logged-in user
  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: "Unauthorized: User ID not found" });
  }
  data.created_by = req.user.id; // Set created_by from logged-in user

  // Ensure date is valid or set to NULL
  data.date = data.date || null;
  data.delivery_date = data.delivery_date || null;
  data.postal_delivery_date = data.postal_delivery_date || null;

  // Validate date formats
  const isValidDate = (date) => !date || !isNaN(new Date(date).getTime());
  if (
    !isValidDate(data.date) ||
    !isValidDate(data.delivery_date) ||
    !isValidDate(data.postal_delivery_date)
  ) {
    return res.status(400).json({ error: "Invalid date format" });
  }

  // Insert into database
  Consignment.create(data, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res
      .status(201)
      .json({ message: "Consignment created successfully", results });
  });
};

export const getAllConsignments = (req, res) => {
  Consignment.findAll((err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(results);
  });
};


//paginate with serch get all
export const getAllConsignmentspaginate = (req, res) => {
  const { page = 1, limit = 10, search = "" } = req.query;

  Consignment.findAllWithPagination(parseInt(page), parseInt(limit), search, (err, data) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(data);
  });
};


export const getConsignmentById = (req, res) => {
  const { id } = req.params;
  Consignment.findById(id, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!results.length)
      return res.status(404).json({ message: "Consignment not found" });
    res.status(200).json(results[0]);
  });
};

export const updateConsignment = (req, res) => {
  const { id } = req.params;
  const data = req.body;

  // Ensure date is valid or set to NULL
  data.date = data.date || null;
  data.delivery_date = data.delivery_date || null;
  data.postal_delivery_date = data.postal_delivery_date || null;

  // Validate date formats
  const isValidDate = (date) => !date || !isNaN(new Date(date).getTime());

  if (
    !isValidDate(data.date) ||
    !isValidDate(data.delivery_date) ||
    !isValidDate(data.postal_delivery_date)
  ) {
    return res.status(400).json({ error: "Invalid date format" });
  }

  Consignment.update(id, data, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: "Consignment updated successfully" });
  });
};

export const deleteConsignment = (req, res) => {
  const { id } = req.params;
  Consignment.delete(id, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: "Consignment deleted successfully" });
  });
};
