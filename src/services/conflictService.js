const { conflictRules, suggestionStrategies } = require('../config/rules');
const inMemoryData = require('../data/mockData');

/**
 * Detects conflicts for a booking request
 * @param {Object} booking - The booking request
 * @returns {Object} Conflict information
 */
function detectConflicts(booking) {
  const conflicts = [];
  
  // Check for holiday conflicts
  if (inMemoryData.holidays.includes(booking.date)) {
    return {
      hasConflict: true,
      conflictType: 'holiday',
      conflicts: [{ type: 'holiday', message: 'Selected date is a holiday' }]
    };
  }
  
  // Check all rules against all existing bookings
  for (const rule of conflictRules) {
    for (const existingBooking of inMemoryData.bookedSlots) {
      if (rule.check(booking, existingBooking, inMemoryData.bookedSlots)) {
        conflicts.push({
          type: rule.conflictType,
          rule: rule.id,
          description: rule.description,
          conflictingBooking: existingBooking
        });
        break; // Found a conflict for this rule, move to next rule
      }
    }
  }
  
  return {
    hasConflict: conflicts.length > 0,
    conflicts
  };
}

/**
 * Generates suggestions based on detected conflicts
 * @param {Object} booking - The original booking request
 * @param {Object} conflictResult - The conflict detection result
 * @returns {Array} Array of booking suggestions
 */
function generateSuggestions(booking, conflictResult) {
  if (!conflictResult.hasConflict) {
    return [];
  }
  
  if (conflictResult.conflictType === 'holiday') {
    // For holidays, suggest the next non-holiday date
    let dateObj = new Date(booking.date);
    let newDate;
    
    do {
      dateObj.setDate(dateObj.getDate() + 1);
      newDate = dateObj.toISOString().split('T')[0];
    } while (inMemoryData.holidays.includes(newDate));
    
    return [{ ...booking, date: newDate }];
  }
  
  const suggestions = [];
  const availableOptions = {
    rooms: inMemoryData.rooms || ['Room A', 'Room B', 'Room C', 'Room D'],
    coaches: inMemoryData.coaches || ['Coach X', 'Coach Y', 'Coach Z', 'Karthik'],
    times: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00']
  };
  
  // Get unique conflict types
  const conflictTypes = [...new Set(conflictResult.conflicts.map(c => c.type))];
  
  // Generate suggestions for each conflict type
  for (const type of conflictTypes) {
    const strategies = suggestionStrategies[type] || [];
    
    for (const strategy of strategies) {
      const suggestion = strategy.generate(booking, conflictResult, availableOptions);
      
      // Check if this suggestion would also have conflicts
      const suggestionConflicts = detectConflicts(suggestion);
      
      if (!suggestionConflicts.hasConflict) {
        suggestions.push({
          ...suggestion,
          reason: strategy.description
        });
      }
    }
  }
  
  // If no valid suggestions were found, add some fallback suggestions
  if (suggestions.length === 0) {
    // Fallback: suggest next day
    const dateObj = new Date(booking.date);
    dateObj.setDate(dateObj.getDate() + 1);
    const newDate = dateObj.toISOString().split('T')[0];
    
    suggestions.push({
      ...booking,
      date: newDate,
      reason: 'Fallback: Try the next day'
    });
  }
  
  return suggestions;
}

module.exports = {
  detectConflicts,
  generateSuggestions
};
