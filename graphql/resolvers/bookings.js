const Event = require('../../models/event');
const Booking = require('../../models/booking');
const {transformedBooking, transformedEvent} = require('./merge');

module.exports = {
  bookings:async (args,req)=>{
    if(!req.isAuth){
      throw new Error('Unauthenticated!');
    }
    try{
      const bookings = await Booking.find();
      return bookings.map(booking =>{
        return transformedBooking(booking);
      })
    }catch(err){
      console.log(err);
      throw err;
    }
  },
  bookEvent: async (args,req)=>{
    if(!req.isAuth){
      throw new Error('Unauthenticated!');
    }
    try{
    const event = await Event.findOne({_id:args.eventId});

    if (!event) {
      throw new Error('Event Does Not Exist.');
    }
    const booking = new Booking({
      user:req.userId,
      event:event
    });
    const result = await booking.save();
      return transformedBooking(result);
    }catch(err){
      throw err;
    }
  },
  cancelBookng: async (args,req) =>{
    if(!req.isAuth){
      throw new Error('Unauthenticated!');
    }
    try{
      const booking = await Booking.findById(args.bookingId).populate('event');
      if(!booking){
        throw new Error('You haven\'t booked this event');
      }
      const event = transformedEvent(booking.event);
      await Booking.deleteOne({_id:args.bookingId});
      return event;
    }catch(err){
      throw err;
    }
  }
}