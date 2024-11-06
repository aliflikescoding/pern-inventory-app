"use client"; // This ensures that the code runs only on the client-side in Next.js

import { Card } from "./ui/card";
import { Bar } from 'react-chartjs-2';

// Import necessary Chart.js components
import {
  Chart as ChartJS,
  CategoryScale,   // For the 'category' axis (x-axis)
  LinearScale,     // For the 'linear' axis (y-axis)
  BarElement,      // For rendering bars in the chart
  Title,           // For adding a title to the chart
  Tooltip,         // For enabling tooltips
  Legend           // For displaying the legend
} from 'chart.js';

// Register the necessary components for Chart.js
ChartJS.register(
  CategoryScale,    // For 'category' scale (x-axis)
  LinearScale,      // For 'linear' scale (y-axis)
  BarElement,       // For rendering bars
  Title,            // For chart title
  Tooltip,          // For tooltips
  Legend            // For displaying legend
);

// Define the shape of each item in the array
type Item = {
  item_name: string;
  item_stock: number;
};

// Update MixedArrayProps to expect an array of Item objects
type MixedArrayProps = {
  data: Item[];  // Expecting an array of objects with item_name and item_stock
};

// Updated options with white text color for title, axes, and legend
const options = {
  plugins: {
    title: {
      display: false,
    },
    tooltip: {
      titleColor: 'white', // Tooltip title color
      bodyColor: 'white', // Tooltip body color
    },
    legend: {
      labels: {
        color: 'white', // Set legend text color to white
      },
    },
  },
  scales: {
    x: {
      ticks: {
        color: 'white', // Set x-axis tick color to white
      },
    },
    y: {
      ticks: {
        color: 'white', // Set y-axis tick color to white
      },
    },
  },
  responsive: true,
  interaction: {
    intersect: false,
  },
};

const BarAllItemsOne: React.FC<MixedArrayProps> = ({ data }) => {
  return (
    <Card className="p-5">
      <h1 className="text-4xl font-light mb-3">Stock Of Each Item</h1>
      <Bar
        className="max-h-[300px]"
        options={options}
        data={{
          labels: data.map(item => item.item_name), // 'item_name' for the chart labels (x-axis)
          datasets: [
            {
              label: 'Stock',                           // Label for the data
              data: data.map(item => item.item_stock),  // 'item_stock' for the chart data (y-axis)
              backgroundColor: 'rgb(109, 40, 2017)',       // Bar color (can use CSS variable or color code)
            },
          ],
        }}
      />
    </Card>
  );
}

export default BarAllItemsOne;
