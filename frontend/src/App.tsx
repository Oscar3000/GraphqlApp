import * as React from 'react';
import './App.css';
import {BrowserRouter,Route,Redirect,Switch} from 'react-router-dom';
import AuthPage from './Pages/Auth';
import EventsPage from './Pages/Events';
import BookingsPage from './Pages/Bookings';
import MainNavigation from './components/Navigation/MainNavigation';

class App extends React.Component {
  public render() {
    return (
      <BrowserRouter>
      <React.Fragment>
        <MainNavigation />
        <main className="main-content">
        <Switch>
          <Redirect from="/" to="/auth" exact />
          <Route path="/auth" component={AuthPage} />
          <Route path="/events" component={EventsPage} />
          <Route path="/bookings" component={BookingsPage} />
        </Switch>
        </main>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
