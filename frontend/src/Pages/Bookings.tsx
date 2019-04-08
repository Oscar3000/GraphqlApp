import * as React from 'react';
import BookingChart from '../components/Bookings/BookingChart/BookingChart';
import BookingList from '../components/Bookings/BookingList/bookinglist';
import BookingsControls from '../components/Bookings/BookingsControls/BookingsControls';
import Spinner from '../components/Spinner/Spinner';
import AuthContext from '../context/auth.context';
interface State{
  isLoading:boolean;
  bookings:Array<BookingType>;
  outputType:string;
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
    this.state={isLoading:false,bookings:[],outputType:'list'};
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
            price
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

  changeOutputTypeHandler =(outputType:string)=>{
    if(outputType === 'list'){
      this.setState({outputType:'list'});
    }else{
      this.setState({outputType:'chart'});
    }
  }

  render(){
    let content = <Spinner />;
    if(!this.state.isLoading){
      content = (
        <React.Fragment>
          <BookingsControls changeType={this.changeOutputTypeHandler} activeType={this.state.outputType}/>
          <div>
            {this.state.outputType === 'list' ? <BookingList bookings={this.state.bookings} OnDelete={this.onDeleteHandler} /> :
          <BookingChart bookings={this.state.bookings} /> }
          </div>
        </React.Fragment>
      );
    } 
    return (
      <React.Fragment>
        {content}
      </React.Fragment>
    );
  }
}

export default Bookings;