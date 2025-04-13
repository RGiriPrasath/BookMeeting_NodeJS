// Configuration for conflict rules and suggestion strategies
module.exports = {
  // Conflict detection rules
  conflictRules: [
    {
      id: 'same-time-room',
      description: 'Same time and room conflict',
      check: (booking, existingBooking) => 
        booking.date === existingBooking.date && 
        booking.time === existingBooking.time && 
        booking.room === existingBooking.room,
      conflictType: 'room'
    },
    {
      id: 'same-time-coach',
      description: 'Same time and coach conflict',
      check: (booking, existingBooking) => 
        booking.date === existingBooking.date && 
        booking.time === existingBooking.time && 
        booking.coach === existingBooking.coach,
      conflictType: 'coach'
    },
    // You can easily add more rules here without changing the core logic
    {
      id: 'coach-consecutive-bookings',
      description: 'Coach has too many consecutive bookings',
      check: (booking, existingBooking, allBookings) => {
        // Example of a more complex rule that considers all bookings
        // Count how many bookings this coach has on the same day
        const sameCoachSameDayBookings = allBookings.filter(b => 
          b.date === booking.date && b.coach === booking.coach
        );
        return sameCoachSameDayBookings.length >= 3;
      },
      conflictType: 'coach-availability'
    }
  ],
  
  // Suggestion strategies for different conflict types
  suggestionStrategies: {
    'room': [
      {
        id: 'alternative-room',
        description: 'Suggest an alternative room',
        generate: (booking, conflict, availableOptions) => {
          const availableRooms = availableOptions.rooms.filter(r => r !== booking.room);
          return availableRooms.length > 0 ? 
            { ...booking, room: availableRooms[0] } : 
            booking;
        }
      }
    ],
    'coach': [
      {
        id: 'alternative-coach',
        description: 'Suggest an alternative coach',
        generate: (booking, conflict, availableOptions) => {
          const availableCoaches = availableOptions.coaches.filter(c => c !== booking.coach);
          return availableCoaches.length > 0 ? 
            { ...booking, coach: availableCoaches[0] } : 
            booking;
        }
      }
    ],
    'time': [
      {
        id: 'later-time',
        description: 'Suggest a later time slot',
        generate: (booking, conflict, availableOptions) => {
          const [hours, minutes] = booking.time.split(':');
          const timeObj = new Date();
          timeObj.setHours(parseInt(hours, 10) + 2);
          timeObj.setMinutes(parseInt(minutes, 10));
          const newTime = `${String(timeObj.getHours()).padStart(2, '0')}:${String(timeObj.getMinutes()).padStart(2, '0')}`;
          return { ...booking, time: newTime };
        }
      }
    ],
    'date': [
      {
        id: 'next-day',
        description: 'Suggest the next day',
        generate: (booking, conflict, availableOptions) => {
          const dateObj = new Date(booking.date);
          dateObj.setDate(dateObj.getDate() + 1);
          const newDate = dateObj.toISOString().split('T')[0];
          return { ...booking, date: newDate };
        }
      }
    ],
    'coach-availability': [
      {
        id: 'different-day',
        description: 'Suggest a different day for this coach',
        generate: (booking, conflict, availableOptions) => {
          const dateObj = new Date(booking.date);
          dateObj.setDate(dateObj.getDate() + 2); // Skip to day after tomorrow
          const newDate = dateObj.toISOString().split('T')[0];
          return { ...booking, date: newDate };
        }
      }
    ]
    // Add more strategies for different conflict types
  }
};
