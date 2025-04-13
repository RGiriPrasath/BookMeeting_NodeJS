const inMemoryData = require('../data/mockData');
const conflictService = require('../services/conflictService');
const logger = require('../utils/logger');

// Get all booked slots
async function getBookedSlots(req, res, next) {
  try {
    logger.info('Fetching all booked slots');
    res.json(inMemoryData.bookedSlots);
  } catch (error) {
    next(error);
  }
}

// Get all holidays
async function getHolidays(req, res, next) {
  try {
    logger.info('Fetching all holidays');
    res.json(inMemoryData.holidays);
  } catch (error) {
    next(error);
  }
}

// Check availability and process booking
async function checkAvailability(req, res, next) {
  try {
    const booking = req.body;
    logger.info('Received booking request', booking);
    
    // Validate required fields
    if (!booking.date || !booking.time || !booking.room || !booking.coach) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields'
      });
    }
    
    // Detect conflicts
    const conflictResult = conflictService.detectConflicts(booking);
    
    if (!conflictResult.hasConflict) {
      // Store the new booking in memory
      inMemoryData.bookedSlots.push(booking);
      logger.info('Booking confirmed', booking);
      return res.json({ 
        status: 'success',
        message: 'No conflicts, your booking is confirmed!' 
      });
    }
    
    // Generate suggestions
    const suggestions = conflictService.generateSuggestions(booking, conflictResult);
    logger.info('Conflict detected, suggesting alternatives', { 
      conflicts: conflictResult.conflicts,
      suggestions 
    });
    
    return res.json({ 
      status: 'warning',
      message: 'Conflict detected, here are some suggestions.',
      conflicts: conflictResult.conflicts,
      suggestions 
    });
  } catch (error) {
    logger.error('Error in checkAvailability', { error: error.message });
    next(error);
  }
}

module.exports = {
  getBookedSlots,
  getHolidays,
  checkAvailability
};