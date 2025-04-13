// In-memory storage for booked slots, holidays, and available options
const inMemoryData = {
  bookedSlots: [
    { date: '2025-04-15', time: '10:00', room: 'Room A', coach: 'Coach X' },
    { date: '2025-04-16', time: '14:00', room: 'Room B', coach: 'Coach Y' },
    { date: '2025-04-17', time: '09:00', room: 'Room A', coach: 'Karthik' }
  ],
  holidays: ['2025-12-25', '2025-01-01', '2025-04-14', '2025-01-15'],
  rooms: ['Room A', 'Room B', 'Room C', 'Room D'],
  coaches: ['Coach X', 'Coach Y', 'Coach Z', 'Karthik'],
  availableTimes: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00']
};

module.exports = inMemoryData;
