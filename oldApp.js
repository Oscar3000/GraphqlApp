const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Event = require('./models/event');
const User = require('./models/user');

const app = express();


app.use(bodyParser.json());


const user = userId =>{
  return User.findById(userId)
        .then(user=>{
          return {...user._doc,
            _id:user.id,
            createdEvents: events.bind(this,user._doc.createdEvents)
          };
        })
        .catch(err=> {
          throw err
        });
}

const events = eventIds => {
  return Event.find({ _id: { $in: eventIds } })
    .then(events => {
      return events.map(event => {
        return { 
          ...event._doc, 
          _id: event.id, 
          creator: user.bind(this, event.creator) };
      });
    })
    .catch(err => {
      throw err;
    });
}

app.use('/api',graphqlHttp({
  schema:buildSchema(
    `
    type Event{
      _id:ID!
      title:String!
      description:String!
      price:Float!
      date: String!
      creator:User!
    }

    type User{
      _id:ID!
      email:String!
      password:String
      createdEvents:[Event!]
    }

    input EventInput{
      title:String!
      description:String!
      price:Float!
      date:String!
    }

    input UserInput{
      email:String!
      password:String!
    }

     type RootQuery{
       events:[Event!]!
     }

     type RootMutation{
       createEvent(eventInput:EventInput):  Event
       createUser(userInput:UserInput): User
     }
     schema {
       query:RootQuery
       mutation:RootMutation
     }
    `),
  rootValue:{
    events:()=>{
      return Event.find()
           .then(events=>{
             return events.map(event=>{
               return {
                 ...event._doc,
                _id:event._doc._id.toString(),
                creator:user.bind(this,event._doc.creator)
              };
             });
           })
           .catch(err=>{
             console.log(err);
             throw err;
           });
    },
    createEvent:(args)=>{
      const event = new Event({
        title:args.eventInput.title,
        description:args.eventInput.description,
        price:args.eventInput.price,
        date: new Date(args.eventInput.date),
        creator:'5c333c8e36b14f270c01a123'
      });
      let createdEvent;
      return event.save()
          .then(res=>{
            createdEvent = {...res._doc,_id:res.id,creator:user.bind(this,res._doc.creator)};
            return User.findById('5c333c8e36b14f270c01a123');
          })
          .then(user=>{
            if(!user){
              throw new Error('User not found.');
            }
            user.createdEvents.push(event._id);
            return user.save();
          })
          .then(res=>{
            return createdEvent;
          })
          .catch(err=>{
            console.log(err);
            throw err;
          });
    },
    createUser:(args)=>{
      return User.findOne({email:args.userInput.email})
          .then(user=>{
            if(user){
              throw new Error('User Exists already.');
            }
            return bcrypt.hash(args.userInput.password,12);
          }).then(hashedPassword=>{
              const user = new User({
                email:args.userInput.email,
                password:hashedPassword
              });
              return user.save();
            })
            .then(result=>{
              return {...result._doc,password:null,_id:result.id};
            })
            .catch(err=>{
              throw err;
            });
    }
  },
  graphiql:true
}));
const port = process.env.PORT || 3000;

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-vl9ed.mongodb.net/${process.env.MONGODB}?retryWrites=true`)
  .then(()=>{

    app.listen(port,()=>{
      console.log(`Application started on Port ${port}`);
    });
  })
  .catch(err=>{
    console.log(err);
  })



