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


type Item = {
  category_name: string;
  total: number;
  color: string;
};

type AllItemsDonutProp = {
  data: Item[];
};

const AllItemsDonutChart: React.FC<AllItemsDonutProp> = ({ data }) => {
  const chartData = {
    labels: data.map(item => item.category_name),
    datasets: [
      {
        label: "Total Items In Category",
        data: data.map(item => item.total),
        backgroundColor: data.map(item => item.color),
        borderColor: 'rgba(0, 0, 0, 0)', 
        borderWidth: 5,
      }
    ]
  }


  return (
    <Card className="w-[350px]">
      <div className="w-full border-b-[1px] text-foreground px-3 py-1 capitalize">
        <h1 className="text-md font-medium">total items in each category</h1>
      </div>
      <div className="p-3">
        <Doughnut data={chartData}/>
      </div>
    </Card>
  );
}

export default AllItemsDonutChart;