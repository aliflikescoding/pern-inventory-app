"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { allItems } from "@/app/data.js";
import { PenLine, Box, Layers3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import BarAllItemsOne from "@/components/bar-all-items-one";
import AllItemsDonutChart from "@/components/all-items-donut-chart";
import AvailDonutChart from "@/components/avail-donut-chart";

interface Item {
  item_id: number;
  item_name: string;
  item_desc: string;
  item_price: number;
  item_stock: number;
  item_status: boolean;
  item_image_link: string;
  category_id: number;
  category_name: string;
}

interface ProcessedItem {
  id: number;
  category_name: string;
  total: number;
}

const processDataPie = (items: Item[]): ProcessedItem[] => {
  // Initialize an empty object to store the aggregated data
  const categoryCount: {
    [key: string]: { id: number; category_name: string; total: number };
  } = {};

  // Loop through all items and group them by category
  items.forEach((item) => {
    const { category_name } = item;
    if (!categoryCount[category_name]) {
      // If category doesn't exist, create it and set total to 1
      categoryCount[category_name] = {
        id: Object.keys(categoryCount).length,
        category_name,
        total: 1,
      };
    } else {
      // Otherwise, just increment the total count
      categoryCount[category_name].total += 1;
    }
  });

  // Bright colors object
  const colors = {
    brightColors: [
      "#1E90FF", // Dodger Blue
      "#0000FF", // Blue
      "#4682B4", // Steel Blue
      "#6A5ACD", // Slate Blue
      "#8A2BE2", // Blue Violet
      "#FF00FF", // Magenta
      "#8B008B", // Dark Magenta
      "#DDA0DD", // Plum
      "#FF1493", // Deep Pink
      "#FF69B4", // Hot Pink
    ],
  };

  // Convert the aggregated object into an array
  const result = Object.values(categoryCount);

  // Return both the processed data and the brightColors as a new property in the object array
  return result.map((item, index) => ({
    ...item,
    color: colors.brightColors[index % colors.brightColors.length], // Assign a color based on the index
  }));
};

const processDataBar1 = (items: Item[]) => {
  return items.map((item) => ({
    item_name: item.item_name,
    item_stock: item.item_stock,
  }));
};

const getAvailabilitySummary = (items: typeof allItems) => {
  const summary = items.reduce(
    (acc, item) => {
      if (item.item_status) {
        acc.totalAvailable += 1;
      } else {
        acc.totalNotAvailable += 1;
      }
      return acc;
    },
    { totalAvailable: 0, totalNotAvailable: 0 }
  );

  return summary;
};

const Items = () => {
  const dataPie = processDataPie(allItems);
  const barData1 = processDataBar1(allItems);
  const dataPieAvail = getAvailabilitySummary(allItems);

  return (
    <div className="flex">
      <div className="p-5">
        <h1 className="text-5xl font-light">All items</h1>
        <div className="flex justify-around my-3">
          <AvailDonutChart
            totalAvailable={dataPieAvail.totalAvailable}
            totalNotAvailable={dataPieAvail.totalNotAvailable}
          />
        </div>
        <div className="flex justify-around my-3">
          <AllItemsDonutChart data={dataPie} />
          <BarAllItemsOne data={barData1} />
        </div>
        <Table className="max-w-full">
          <TableHeader>
            <TableRow>{/* Table Headings */}</TableRow>
          </TableHeader>
          <TableBody>
            {allItems.map((item) => (
              <TableRow key={item.item_id}>
                <TableCell className="mx-2">
                  <img
                    src={item.item_image_link}
                    alt={item.item_name}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                </TableCell>
                <TableCell>
                  <div className="border-[1px] h-[25px]"></div>
                </TableCell>
                <TableCell className="mx-2 capitalize">
                  {item.item_name}
                </TableCell>
                <TableCell>
                  <div className="border-[1px] h-[25px]"></div>
                </TableCell>
                <TableCell className="mx-2 text-center whitespace-nowrap text-md overflow-hidden text-ellipsis">
                  <p className="mb-1">Category</p>
                  <div className="flex items-center justify-center">
                    <Layers3 className="text-gray-300 text-sm mr-2" />
                    <p>{item.category_name}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="border-[1px] h-[25px]"></div>
                </TableCell>
                <TableCell className="mx-2 w-[250px] text-xs">
                  {item.item_desc}
                </TableCell>
                <TableCell>
                  <div className="border-[1px] h-[25px]"></div>
                </TableCell>
                <TableCell className="mx-2 text-center whitespace-nowrap text-md overflow-hidden text-ellipsis">
                  <p className="">Item Price</p>
                  <p>
                    <span className="text-gray-400 text-lg">$</span>{" "}
                    {item.item_price} USD
                  </p>
                </TableCell>
                <TableCell>
                  <div className="border-[1px] h-[25px]"></div>
                </TableCell>
                <TableCell className="mx-2 text-center whitespace-nowrap text-md overflow-hidden text-ellipsis">
                  <p className="mb-1">Stock</p>
                  <div className="flex items-center justify-center mb-1">
                    <Box className="text-gray-300 text-sm mr-2" />
                    <p>{item.item_stock}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="border-[1px] h-[25px]"></div>
                </TableCell>
                <TableCell className="mx-2">
                  {item.item_status ? (
                    <Badge>Available</Badge>
                  ) : (
                    <Badge variant="destructive">Not Available</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="border-[1px] h-[25px]"></div>
                </TableCell>
                <TableCell>
                  <Link href="" className="hover:text-primary">
                    <PenLine className="transition-transform transform hover:scale-95" />
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Items;
