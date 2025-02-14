import attributeModel from '../../models/attribute/attributeModel.js';

export const createAttribute = (req, res) => {
   const { attribute_name, rows } = req.body;
  
     const attributeData = { attribute_name, rows };
    attributeModel.createAttribute(attributeData, (err, result) => {
      if (err) {
        res.status(500).json({ message: "Failed to create attribute", error: err });
        return;
      }
      res.status(201).json({ message: "Attribute created successfully", result });
    });
  };
  
  export const getAllAttributes = (req, res) => {
    attributeModel.getAllAttributes((err, attributes) => {
      if (err) {
        res.status(500).json({ message: "Failed to fetch attributes", error: err });
        return;
      }
      res.status(200).json(attributes);
    });
  };
  
  export const  getAttributeById = (req, res) => {
    const { id } = req.params;
  
    attributeModel.getAttributeById(id, (err, attribute) => {
      if (err) {
        res.status(500).json({ message: "Failed to fetch attribute", error: err });
        return;
      }
      res.status(200).json(attribute);
    });
  };
  
  export const  updateAttribute = (req, res) => {
    const { id } = req.params;
    const attributeData = req.body;
  
    attributeModel.updateAttribute(id, attributeData, (err, result) => {
      if (err) {
        res.status(500).json({ message: "Failed to update attribute", error: err });
        return;
      }
      res.status(200).json({ message: "Attribute updated successfully", result });
    });
  };
  
  export const  deleteAttribute = (req, res) => {
    const { id } = req.params;
  
    attributeModel.deleteAttribute(id, (err, result) => {
      if (err) {
        res.status(500).json({ message: "Failed to delete attribute", error: err });
        return;
      }
      res.status(200).json({ message: "Attribute deleted successfully", result });
    });
  };
  
  // Get cvalue dynamically when attribute_name is "item"
export const getItemAttributeValues = (req, res) => {
    attributeModel.getItemAttributeValues((err, data) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(200).json(data);
      }
    });
  };
