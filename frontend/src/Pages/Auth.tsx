import * as React from 'react';
import AuthContext from '../context/auth.context';
import './Auth.css';

interface State{
  isLogin:boolean;
}
class AuthPage extends React.Component<object,State> {
  constructor(props:object){
    super(props);
    this.state ={isLogin:true}
  }
  private emailEl = React.createRef<HTMLInputElement>();
  private passwordEl = React.createRef<HTMLInputElement>();
  static contextType = AuthContext;

  switchModeHandler = () =>{
    this.setState(prevState=>{
      return {isLogin: !prevState.isLogin};
    })
  }

  SubmitHandler =(event:any)=>{
    event.preventDefault();
    const email = this.emailEl.current!.value;
    const password = this.passwordEl.current!.value;
    if(email.trim().length === 0 || password.trim().length === 0){
      return;
    }
    let requestBody = {
      query:`
      query Login($email: String!, $password: String!){
        login(email:$email,password: $password){
          tokenExpiration
          token
          userId
        }
      }
      `,
      variables:{
        email:email,
        password:password
      }
    };
    
    if(!this.state.isLogin){
      
      requestBody = {
        query:`
        mutation CreateUser($email: String!, $password: String!){
          createUser(userInput:{email:$email,password: $password}){
            _id
            email
          }
        }`,
        variables:{
          email:email,
          password:password
        }
      };
    }
     
    fetch('http://localhost:4000/api',{
      method:'POST',
      body:JSON.stringify(requestBody),
      headers:{
        'Content-Type':'application/json'
      }
    }).then(res=>{
      if(res.status !== 200 && res.status !== 201){
        throw new Error("Failed!");
      }
      return res.json();
    }).then(resData=>{
      if(resData.data.login.token){
        this.context.login(resData.data.login.token,resData.data.login.userId,resData.data.login.tokenExpiration);
      }
    })
    .catch(err=>{
      console.log(err);
    });
  }

  render() {
    return (
      <form className="auth-form" onSubmit={this.SubmitHandler}>
        <div className="form-control">
           <label htmlFor="email">Email</label> 
           <input type="email" id="email" ref={this.emailEl}/>
        </div>
        <div className="form-control">
           <label htmlFor="password">Password</label> 
           <input type="password" id="password" ref={this.passwordEl}/>
        </div>
        <div className="form-actions">
            <button type="sumbit">Submit</button>
            <button type="button"onClick={this.switchModeHandler}>Switch to {this.state.isLogin ? "Sign Up":"Login"}</button>
        </div>
      </form>
    );
  }
}

export default AuthPage;