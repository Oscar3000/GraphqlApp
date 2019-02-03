import * as React from 'react';
import AuthContext from '../context/auth.context';
import Spinner from '../components/Spinner/Spinner';

interface State{
  isLoading:boolean;
  bookings:Array<BookingType>
}

interface BookingType{
  _id:string;
  createdAt:string;
  event:EventType;
}

interface EventType{
  _id:string;
  date:string;
  title:string;
}
class Bookings extends React.Component<object,State>{
  static contextType = AuthContext;
  constructor(props:any){
    super(props);
    this.state={isLoading:false,bookings:[]};
  }
  componentDidMount(){
    this.fetchBookings();
  }

  fetchBookings =()=>{
    this.setState({isLoading:true});
    const requestBody ={
      query:`
      query{
        bookings{
          _id
          createdAt
          event{
            _id
            title
            date
          }
        }
      }
      `
    }
    fetch('http://localhost:4000/api',{
      method:'POST',
      body:JSON.stringify(requestBody),
      headers:{
        'Content-Type':'application/json',
        'Authorization':`Bearer ${this.context.token}`
      }
    }).then(res=>{
      if(res.status !== 200 && res.status !== 201){
        throw new Error("Failed!");
      }
      return res.json();
    }).then(resData=>{
      const bookings = resData.data.bookings;
      this.setState({bookings:bookings,isLoading:false});
    })
    .catch(err=>{
      console.log(err);
      this.setState({isLoading:false});
    });
  }

  render(){
    let bookings = null;
    if(this.state.bookings){
      bookings = this.state.bookings.map(booking=>{
        return <li key={booking._id}>{booking.event.title} -{new Date(booking.event.date).toLocaleDateString()}</li>
      })
    }
    return (
      <React.Fragment>
        {this.state.isLoading ? <Spinner /> : (
          <ul>
            {bookings}
          </ul>
        )}
      </React.Fragment>
    );
  }
}

export default Bookings;