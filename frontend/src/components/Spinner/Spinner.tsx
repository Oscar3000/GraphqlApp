import * as React from 'react';
import './Spinner.css';

function spinner(props:any){
  return (
    <div className="spinner">
      <div className="lds-ripple">
        <div></div>
        <div></div>
      </div>
    </div>
  );
}

export default spinner;