import * as React from 'react';
import EventItem from './EventItem/EventItem';
import './EventList.css';
import {EventType} from '../../../Pages/Events';


function eventList(props:any){
  const events:Array<JSX.Element> = props.events.map((event:EventType)=>{
    return <EventItem
              key={event._id} 
              eventId={event._id} 
              price={event.price} 
              date={event.date} 
              title={event.title} 
              userId={props.authUserId}
              creatorId={event.creator._id}
              onDetail={props.onViewDetail}
              />
  });

  return (
    <ul className="event__list">
          {events}
        </ul>
  )
}

export default eventList;