import * as React from 'react';
import './bookinglist.css';

function bookingList(this:any,props:any){
    return (
    <ul className="bookings_list">
        {props.bookings.map((booking:any)=>{
            return (<li key={booking._id} className="bookings_item">
             <div className="bookings_item_data">
             {booking.event.title} - {' '}
            {new Date(booking.event.date).toLocaleDateString()}
             </div>
             <div className="bookings_item_actions">
                 <button className="btn" onClick={props.OnDelete.bind(this,booking._id)}>Cancel</button>
             </div>
            </li>
            );
        })}
    </ul>
    );
};

export default bookingList;