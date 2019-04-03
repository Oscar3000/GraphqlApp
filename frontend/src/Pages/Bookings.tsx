import * as React from 'react';
import BookingList from '../components/Bookings/BookingList/bookinglist';
import Spinner from '../components/Spinner/Spinner';
import AuthContext from '../context/auth.context';
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

  onDeleteHandler =(bookingId:string) =>{
    this.setState({isLoading:true});
    const requestBody ={
      query:`
      mutation CancelBookng($id: ID!){
        cancelBookng(bookingId: $id){
          _id
          title
        }
      }
      `,
      variables:{
        id:bookingId
      }
    };
    fetch('http://localhost:4000/api',{
      method:'POST',
      body:JSON.stringify(requestBody),
      headers:{
        'Content-Type':'application/json',
        'Authorization':`Bearer ${this.context.token}`
      }
    }).then(res=>{
      if(res.status !== 200){
        throw new Error('Failed to delete booking');
      }
      return res.json();
    }).then(resData=>{
      this.setState(prevState=>{
      const updatedBookings = prevState.bookings.filter((booking:BookingType)=> booking._id !== bookingId);
       return {bookings: updatedBookings, isLoading:false};
      });
    }).catch(err=>{
      console.log(err);
      this.setState({isLoading:false});
    })
  }

  render(){
    return (
      <React.Fragment>
        {this.state.isLoading ? <Spinner /> : (
          <BookingList bookings={this.state.bookings} OnDelete={this.onDeleteHandler}/>
        )}
      </React.Fragment>
    );
  }
}

export default Bookings;