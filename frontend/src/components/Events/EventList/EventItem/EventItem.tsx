import * as React from 'react';
import './EventItem.css';
function eventItem(this:any,props:any){
  return (
    <li className="events__list-item" key={props.eventId}>
      <div>
        <h1>{props.title}</h1>
        <h2>${props.price} - {new Date(props.date).toLocaleDateString()}</h2>
      </div>
      <div>
       {props.userId === props.creatorId ? <p>You are the Owner of this event</p> : <button className="btn" onClick={props.onDetail.bind(this,props.eventId)}>View Details</button>}
      </div>
    </li>
  )
}

export default eventItem;