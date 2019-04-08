import * as React from 'react';
import './BookingsControls.css';

function bookingsControls(this:any,props:any) {
    return (
        <div className="bookings-control">
            <button className={props.activeType === 'list' ? 'active': ''} onClick={props.changeType.bind(this,'list')}>List</button>
            <button className={props.activeType === 'chart' ? 'active': ''} onClick={props.changeType.bind(this,'chart')}>Chart</button>
          </div>
    );
}

export default bookingsControls;