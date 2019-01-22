const User = require('../../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


module.exports = {
  createUser: async (args)=>{
    try {
      let user = await User.findOne({ email: args.userInput.email });

      if (user) {
        throw new Error('User Exists already.');
      }
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
      user = new User({
        email: args.userInput.email,
        password: hashedPassword
      });
      const result = await user.save();
      return { ...result._doc, password: null, _id: result.id };
    }
    catch (err) {
      throw err;
    };
  },
  login: async ({email, password}) =>{
    const user = await User.findOne({email:email});
    if(!user){
      throw new Error('User Does Not Exist!');
    }
    const isEqual = await bcrypt.compare(password,user.password);
    if(!isEqual){
      throw new Error('Password is incorrect!');
    }
    const token = jwt.sign({userId:user.id,email:user.email},'somesupersecretkey',{
      expiresIn:'1h'
    });

    return {userId:user.id,token:token,tokenExpiration:1};
  }
}