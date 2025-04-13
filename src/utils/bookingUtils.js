// Check for conflicts
function checkConflict(date, time, room, coach, inMemoryData) {
  // Check for exact conflicts (same time, same room or same coach)
  const exactConflict = inMemoryData.bookedSlots.some(slot => 
    slot.date === date && 
    slot.time === time && 
    (slot.room === room || slot.coach === coach)
  );
  
  if (exactConflict) {
    return {
      hasConflict: true,
      conflictDetails: {
        time: true,
        room: inMemoryData.bookedSlots.some(slot => 
          slot.date === date && slot.time === time && slot.room === room
        ),
        coach: inMemoryData.bookedSlots.some(slot => 
          slot.date === date && slot.time === time && slot.coach === coach
        )
      }
    };
  }
  
  return {
    hasConflict: false
  };
}

// Generate booking suggestions
function generateSuggestions(date, time, room, coach, conflict, inMemoryData) {
  // Generate alternative date (next day)
  const dateObj = new Date(date);
  dateObj.setDate(dateObj.getDate() + 1);
  const newDate = dateObj.toISOString().split('T')[0];
  
  // Generate alternative time (2 hours later)
  const [hours, minutes] = time.split(':');
  const timeObj = new Date();
  timeObj.setHours(parseInt(hours, 10) + 2);
  timeObj.setMinutes(parseInt(minutes, 10));
  const newTime = `${String(timeObj.getHours()).padStart(2, '0')}:${String(timeObj.getMinutes()).padStart(2, '0')}`;
  
  // Generate alternative room
  const rooms = ['Room A', 'Room B', 'Room C', 'Room D'];
  const availableRooms = rooms.filter(r => r !== room);
  const newRoom = availableRooms[0] || 'Room B';
  
  // Generate alternative coach
  const coaches = ['Coach X', 'Coach Y', 'Coach Z', 'Karthik'];
  const availableCoaches = coaches.filter(c => c !== coach);
  const newCoach = availableCoaches[0] || 'Coach Y';
  
  return {
    date: conflict.conflictDetails?.time ? newDate : date,
    time: conflict.conflictDetails?.time ? newTime : time,
    room: conflict.conflictDetails?.room ? newRoom : room,
    coach: conflict.conflictDetails?.coach ? newCoach : coach
  };
}

module.exports = {
  checkConflict,
  generateSuggestions
};
