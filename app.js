const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');
const graphQlSchema = require('./graphql/schema/index');
const graphQlResolvers = require('./graphql/resolvers/index');
const isAuth = require('./middleware/is-auth');

const app = express();


app.use(bodyParser.json());

app.use(isAuth);

app.use('/api',graphqlHttp({
  schema:graphQlSchema,
  rootValue:graphQlResolvers,
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



