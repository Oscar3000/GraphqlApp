import * as React from 'react';
import './App.css';
import {BrowserRouter,Route,Redirect,Switch} from 'react-router-dom';
import AuthPage from './Pages/Auth';
import EventsPage from './Pages/Events';
import BookingsPage from './Pages/Bookings';
import MainNavigation from './components/Navigation/MainNavigation';
import AuthContext from './context/auth.context';

interface State{
  token:string;
  userId:string;
}

class App extends React.Component<object,State> {
  constructor(props:object){
    super(props);
    this.state ={token:'',userId:''}
  }
  login = (token:string,userId:string,tokenExpiration:number) =>{
    this.setState({token,userId});
  }
  logout = () =>{
    this.setState({token:'',userId:''});
  }
  public render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <AuthContext.Provider value={{token:this.state.token,userId:this.state.userId,login:this.login,logout:this.logout}}>
            <MainNavigation />
            <main className="main-content">
              <Switch>
                {this.state.token && <Redirect from="/" to="/events" exact />}
                {!this.state.token && <Redirect from="/bookings" to="/auth" exact />}
                {this.state.token && <Redirect from="/auth" to="/events" exact />}
                {!this.state.token && <Route path="/auth" component={AuthPage} />}
                <Route path="/events" component={EventsPage} />
                {this.state.token && <Route path="/bookings" component={BookingsPage} />}
                {!this.state.token && <Redirect to="/auth" exact />}
              </Switch>
            </main>
          </AuthContext.Provider>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
