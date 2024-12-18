"use client";

import { Card } from "./ui/card";
import { Bar } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

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
  item_price: number;
};

type MixedArrayProps = {
  data: Item[];
};

const BarItemPrice: React.FC<MixedArrayProps> = ({ data }) => {
  const options = {
    plugins: {
      title: {
        display: false,
      },
    },
    responsive: true,
    interaction: {
      intersect: false,
    },
  };

  return (
    <Card className="">
      <div className="w-full border-b-[1px] text-foreground px-3 py-1 capitalize">
        <h1 className="text-md font-medium">Price Of Items</h1>
      </div>
      <div className="h-[350px] p-2">
        <Bar
          className="mx-auto w-full h-full"
          options={options}
          data={{
            labels: data.map((item) => item.item_name),
            datasets: [
              {
                label: "Stock",
                data: data.map((item) => item.item_price),
                backgroundColor: "rgb(109, 40, 217)",
              },
            ],
          }}
        />
      </div>
    </Card>
  );
};

export default BarItemPrice;
