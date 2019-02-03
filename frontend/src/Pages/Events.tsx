import * as React from 'react';
import './Events.css';
import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import AuthContext from '../context/auth.context';
import EventList from '../components/Events/EventList/EventList';
import Spinner from '../components/Spinner/Spinner';

interface State{
  creating:boolean;
  isLoading:boolean;
  events:Array<EventType>;
  selectedEvent:any
}

export interface EventType{
  _id:string;
  title:string;
  date:string;
  description:string;
  price:number;
  creator:UserType;
}

export interface UserType{
  _id:string
  email?:string
  password?:string
  createdEvents?:Array<EventType>
}

class Events extends React.Component<object,State>{
  isActive =true;
  private titleEl = React.createRef<HTMLInputElement>();
  private priceEl = React.createRef<HTMLInputElement>();
  private dateEl = React.createRef<HTMLInputElement>();
  private descriptionEl = React.createRef<HTMLTextAreaElement>();
  static contextType = AuthContext;

  constructor(props:object){
    super(props);
    this.state ={creating:false,events:[],isLoading:false,selectedEvent:null};
  }

  componentDidMount(){
    this.fetchEvents();
  }
  
  startCreatingEventHandler =()=>{
    this.setState({creating:true});
  }

  CancelModalHandler =()=>{
    this.setState({creating:false,selectedEvent:null});
  }
  ConfirmHandler =()=>{
    this.setState({creating:false});
    const title = this.titleEl.current!.value;
    const price = this.priceEl.current!.value;
    const date = this.dateEl.current!.value;
    const description = this.descriptionEl.current!.value;

    if(title.trim().length ===0 || price.trim().length ===0 || date.trim().length ===0 || description.trim().length ===0){
      return ;
    }
    const event = {title,date,price: Number.parseFloat(price),description};
    console.log(event);

    let requestBody = {
        query:`
        mutation{
          createEvent(eventInput:{title:"${event.title}",date:"${event.date}",price:${event.price},description:"${event.description}"}){
            _id
            title
            description
            price
            date
          }
        }`
      };
      const token = this.context.token;
     
    fetch('http://localhost:4000/api',{
      method:'POST',
      body:JSON.stringify(requestBody),
      headers:{
        'Content-Type':'application/json',
        'Authorization':`Bearer ${token}`
      }
    }).then(res=>{
      if(res.status !== 200 && res.status !== 201){
        throw new Error("Failed!");
      }
      return res.json();
    }).then(resData=>{
      this.setState(prevState=>{
        const updatedEvents = [...prevState.events];
        updatedEvents.push({
          _id:resData.data.createEvent._id,
            title:resData.data.createEvent.title,
            description:resData.data.creatEvent.description,
            date:resData.data.createEvent.date,
            price:resData.data.createEvent.price,
            creator:{
              _id:this.context.userId
            }
        });
        return {events:updatedEvents};
      });
    })
    .catch(err=>{
      console.log(err);
    });

  }

  fetchEvents(){
    this.setState({isLoading:true});
    const requestBody ={
      query:`
        query{
          events{
            _id
            title
            description
            date
            price
            creator{
              _id
              email
            }
          }
        }
      `
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
      const events = resData.data.events;
      if(this.isActive){
        this.setState({events:events,isLoading:false});
      }
    })
    .catch(err=>{
      console.log(err);
      if(this.isActive) this.setState({isLoading:false});
    });
  }

  showDetailHandler = (eventId:string) =>{
      this.setState(prevState=>{
        const selectedEvent = prevState.events.find(event => event._id == eventId);
        return {selectedEvent:selectedEvent};
      })
  }

  bookEventHandler= ()=>{
    if(!this.context.token) {
      this.setState({selectedEvent:null});
      return;
    }
    const requestBody ={
      query:`
        mutation{
          bookEvent(eventId: "${this.state.selectedEvent._id}"){
            _id
            createdAt
            updatedAt
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
      console.log(resData);
      this.setState({selectedEvent:null});
    })
    .catch(err=>{
      console.log(err);
    });
  }

  componentWillUnmount(){
    this.isActive = false;
  }

  render(){

    return (
      <React.Fragment>
        {(this.state.creating || this.state.selectedEvent) && <Backdrop /> }
        {this.state.creating && (
            <Modal title="Add Event" canConfirm canCancel onCancel={this.CancelModalHandler} onConfirm={this.ConfirmHandler} confirmText="Confirm">
              <form>
                <div className="form-control">
                  <label htmlFor="title">Title</label>
                  <input type="text" id="title" ref={this.titleEl}/>
                </div>
                <div className="form-control">
                  <label htmlFor="price">Price</label>
                  <input type="number" id="price" ref={this.priceEl}/>
                </div>
                <div className="form-control">
                  <label htmlFor="date">Date</label>
                  <input type="datetime-local" id="date" ref={this.dateEl}/>
                </div>
                <div className="form-control">
                  <label htmlFor="description">Description</label>
                  <textarea rows={4} id="descritpion" ref={this.descriptionEl}/>
                </div>
              </form>
            </Modal>
        )}
        {this.state.selectedEvent && (
          <Modal title={this.state.selectedEvent.title}
              canConfirm 
              canCancel 
              onCancel={this.CancelModalHandler} 
              onConfirm={this.bookEventHandler}
              confirmText={this.context.token ? "Book":"Confirm"}>
            <h1>{this.state.selectedEvent.title}</h1>
            <h2>${this.state.selectedEvent.price} - {new Date(this.state.selectedEvent.date).toLocaleDateString()}</h2>
            <p>{this.state.selectedEvent.description}</p>
          </Modal>
        ) }
        {this.context.token && (<div className="events-control">
          <p>Share Your Own Events!</p>
          <button className="btn" onClick={this.startCreatingEventHandler}>Create Event</button>
        </div>
        )}
         {this.state.events && !this.state.isLoading ? <EventList events={this.state.events} authUserId={this.context.userId} onViewDetail={this.showDetailHandler}/> : <Spinner />}
      </React.Fragment>
    );
  }
}

export default Events;