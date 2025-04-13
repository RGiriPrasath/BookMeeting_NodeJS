const express = require('express');
const router = express.Router();

// Import data (this would typically come from a data layer or service)
const inMemoryData = require('../data/mockData');

// Import utility functions
const { checkConflict, generateSuggestions } = require('../utils/bookingUtils');

// Root route - health check
router.get('/', (req, res) => {
  res.send('Server is running ✅');
});

// Get all booked slots
router.get('/bookedSlots', (req, res) => {
  res.json(inMemoryData.bookedSlots);
});

// Get all holidays
router.get('/holidays', (req, res) => {
  res.json(inMemoryData.holidays);
});

// Check availability and book if possible
router.post('/checkAvailability', (req, res) => {
  const { date, time, room, coach } = req.body;
  console.log('Received booking request:', req.body);
  
  // Check if date is a holiday
  if (inMemoryData.holidays.includes(date)) {
    return res.json({ 
      message: 'Selected date is a holiday, please choose another date.' 
    });
  }
  
  // Check for booking conflicts
  const conflict = checkConflict(date, time, room, coach, inMemoryData);
  
  if (!conflict.hasConflict) {
    // Store the new booking in memory
    inMemoryData.bookedSlots.push({ date, time, room, coach });
    console.log('Booking confirmed:', { date, time, room, coach });
    return res.json({ 
      message: 'No conflicts, your booking is confirmed!' 
    });
  }
  
  // Generate suggestions for conflicting bookings
  const suggestions = generateSuggestions(date, time, room, coach, conflict, inMemoryData);
  console.log('Conflict detected, suggesting alternatives:', suggestions);
  
  return res.json({ 
    message: 'Conflict detected, here are some suggestions.', 
    suggestions 
  });
});

module.exports = router;
