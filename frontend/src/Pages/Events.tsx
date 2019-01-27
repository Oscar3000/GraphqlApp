import * as React from 'react';
import './Events.css';
import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import AuthContext from '../context/auth.context';

interface State{
  creating:boolean;
  events:Array<EventType>
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
  email:string
  password:string
  createdEvents:Array<EventType>
}

class Events extends React.Component<object,State>{

  private titleEl = React.createRef<HTMLInputElement>();
  private priceEl = React.createRef<HTMLInputElement>();
  private dateEl = React.createRef<HTMLInputElement>();
  private descriptionEl = React.createRef<HTMLTextAreaElement>();
  static contextType = AuthContext;

  constructor(props:object){
    super(props);
    this.state ={creating:false,events:[]};
  }

  componentDidMount(){
    this.fetchEvents();
  }
  
  startCreatingEventHandler =()=>{
    this.setState({creating:true});
  }

  CancelModalHandler =()=>{
    this.setState({creating:false});
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
      this.fetchEvents();
    })
    .catch(err=>{
      console.log(err);
    });

  }

  fetchEvents(){
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
      this.setState({events:events});
    })
    .catch(err=>{
      console.log(err);
    });
  }

  render(){
    const eventList:Array<JSX.Element> = this.state.events.map((event:EventType)=>{
      return <li className="events__list-item" key={event._id}>{event.title}</li>
    })
    return (
      <React.Fragment>
        {this.state.creating && (
          <React.Fragment>
            <Backdrop />
            <Modal title="Add Event" canConfirm canCancel onCancel={this.CancelModalHandler} onConfirm={this.ConfirmHandler}>
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
          </React.Fragment>
        )}
        {this.context.token && (<div className="events-control">
          <p>Share Your Own Events!</p>
          <button className="btn" onClick={this.startCreatingEventHandler}>Create Event</button>
        </div>
        )}
        <ul className="events__list">
          {this.state.events ? eventList : null}
        </ul>
      </React.Fragment>
    );
  }
}

export default Events;