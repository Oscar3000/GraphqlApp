import * as React from 'react';
import { Bar as BarChart } from 'react-chartjs';
const BOOKINGS_BUCKETS:object ={
    Cheap:{
        min:0,
        max:100
    },
    Normal:{
        min:100,
        max:200
    },
    Expensive:{
        min:200,
        max:100000000
    }
};

function bookingChart(props:any) {
    const chartData={
        labels:new Array<string>(),
        dataset: new Array<object>()
    };
    for(const bucket in BOOKINGS_BUCKETS){
        const filteredBookingsCount = props.bookings.reduce((prev:number,current:any)=>{
            if(current.event.price > BOOKINGS_BUCKETS[bucket].min 
                && current.event.price < BOOKINGS_BUCKETS[bucket].max){
                return prev+1;
            }else{
                return prev;
            }
        },0); 
        chartData.labels.push(bucket);
        chartData.dataset.push({
            //label: bucket,
            fillColor: "rgba(220,220,220,0.5)",
            strokeColor: "rgba(220,220,220,0.8)",
            highlightFill: "rgba(220,220,220,0.75)",
            highlightStroke: "rgba(220,220,220,1)",
            data: [filteredBookingsCount]
        })
    }
   
    return (<div style={{textAlign:'center'}}>
                <BarChart data={chartData} />
            </div>);
}

export default bookingChart;