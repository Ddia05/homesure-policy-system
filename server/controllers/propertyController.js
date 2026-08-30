const { validationResult } = require('express-validator');
const propertyService = require('../services/propertyService');

const create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const property = await propertyService.createProperty(req.user.userId, req.body);
    res.status(201).json({
      success: true,
      message: 'Property created successfully',
      property
    });
  } catch (error) {
    console.error('Create Property Error:', error);
    if (error.message === 'Customer profile not found for this user') {
      return res.status(404).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getAll = async (req, res) => {
  try {
    const properties = await propertyService.getPropertiesByCustomer(req.user.userId);
    res.status(200).json({
      success: true,
      properties
    });
  } catch (error) {
    console.error('Get Properties Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getOne = async (req, res) => {
  try {
    const propertyId = req.params.id;
    const property = await propertyService.getPropertyByIdAndCustomer(propertyId, req.user.userId);
    res.status(200).json({
      success: true,
      property
    });
  } catch (error) {
    console.error('Get Property Error:', error);
    if (error.message.includes('not found')) {
      return res.status(404).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const update = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const propertyId = req.params.id;
    const property = await propertyService.updateProperty(propertyId, req.user.userId, req.body);
    res.status(200).json({
      success: true,
      message: 'Property updated successfully',
      property
    });
  } catch (error) {
    console.error('Update Property Error:', error);
    if (error.message.includes('not found')) {
      return res.status(404).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const remove = async (req, res) => {
  try {
    const propertyId = req.params.id;
    const result = await propertyService.deleteProperty(propertyId, req.user.userId);
    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Delete Property Error:', error);
    if (error.message.includes('not found')) {
      return res.status(404).json({ success: false, message: error.message });
    }
    if (error.message.includes('Cannot delete property')) {
      return res.status(400).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
  create,
  getAll,
  getOne,
  update,
  remove
};
