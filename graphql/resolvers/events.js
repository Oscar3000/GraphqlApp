const Event = require('../../models/event');
const User = require('../../models/user');
const {transformedEvent} = require('./merge');


module.exports = {
  events: async ()=>{
    try {
      const events = await Event.find();
      return events.map(event => {
        return transformedEvent(event);
      });
    } catch (err) {
      console.log(err);
      throw err;
    };
  },
  createEvent: async (args,req)=>{
    if(!req.isAuth){
      throw new Error('Unauthenciated');
    }
    const event = new Event({
      title:args.eventInput.title,
      description:args.eventInput.description,
      price:args.eventInput.price,
      date: new Date(args.eventInput.date),
      creator:req.userId
    });
    let createdEvent;
    try {
      const res = await event.save();
      createdEvent = transformedEvent(res);
      const eventCreator = await User.findById(req.userId);

      if (!eventCreator) {
        throw new Error('User not found.');
      }

      eventCreator.createdEvents.push(event._id);
      await eventCreator.save();
      return createdEvent;
    }
    catch (err) {
      console.log(err);
      throw err;
    };
  }
}