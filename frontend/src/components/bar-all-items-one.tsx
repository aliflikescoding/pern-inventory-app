"use client";

import { Card } from "./ui/card";
import { Bar } from 'react-chartjs-2';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,   
  Tooltip,   
  Legend        
} from 'chart.js';

ChartJS.register(
  CategoryScale,    
  LinearScale,      
  BarElement,       
  Title,            
  Tooltip,         
  Legend          
);


type Item = {
  item_name: string;
  item_stock: number;
};


type MixedArrayProps = {
  data: Item[];
};

const BarAllItemsOne: React.FC<MixedArrayProps> = ({ data }) => {
  const options = {
    plugins: {
      title: {
        display: true,
        text: "Items Stock"
      },
    },
    responsive: true,
    interaction: {
      intersect: false,
    },
  };

  return (
    <Card className="p-5 w-full h-full max-w-full max-h-full">
      <Bar
        className="mx-auto w-full h-full"
        options={options}
        data={{
          labels: data.map(item => item.item_name),
          datasets: [
            {
              label: 'Stock',
              data: data.map(item => item.item_stock), 
              backgroundColor: 'rgb(109, 40, 2017)', 
            },
          ],
        }}
      />
    </Card>
  );
}

export default BarAllItemsOne;
