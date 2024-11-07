"use-client";

import { Card } from "./ui/card";
import { Doughnut } from "react-chartjs-2";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,   
  Legend        
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);


type DataProp = {
  totalAvailable: number;
  totalNotAvailable: number;
};


const AvailDonutChart: React.FC<DataProp> = ({ totalAvailable, totalNotAvailable }) => {
  const chartData = {
    labels: ['Available', 'Not Available'],
    datasets: [
      {
        label: "Available Items",
        data: [totalAvailable, totalNotAvailable],
        backgroundColor: [
          '#6D28D9',
          '#ef4444',
        ],
        borderColor: 'rgba(0, 0, 0, 0)', 
        borderWidth: 5,
      }
    ]
  }


  return (
    <Card className="w-[350px]">
      <div className="w-full bg-card-foreground border-b-[1px] text-foreground px-3 py-1 capitalize">
        <h1 className="text-md font-semibold">Item Availability</h1>
      </div>
      <div className="p-3">
        <Doughnut data={chartData}/>
      </div>
    </Card>
  );
}

export default AvailDonutChart;