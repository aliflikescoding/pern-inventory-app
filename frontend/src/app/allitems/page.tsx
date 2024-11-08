"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { allItems } from "@/app/data.js";
import { PenLine, Box, Layers3, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import BarAllItemsOne from "@/components/bar-all-items-one";
import AllItemsDonutChart from "@/components/all-items-donut-chart";
import AvailDonutChart from "@/components/avail-donut-chart";
import BarItemPrice from "@/components/bar-item-price";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categories } from "../data";
import { Plus, Minus } from "lucide-react";

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

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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

const processDataBar2 = (items: Item[]) => {
  return items.map((item) => ({
    item_name: item.item_name,
    item_price: item.item_price,
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
  const barData2 = processDataBar2(allItems);
  const [price, setPrice] = useState(1);
  const [stock, setStock] = useState(1);

  const incrementPrice = () => {
    setPrice(price + 1);
  };

  const decrementPrice = () => {
    if (price > 0) {
      setPrice(price - 1);
    }
  };

  const incrementStock = () => {
    setStock(stock + 1);
  };

  const decrementStock = () => {
    if (stock > 0) {
      setStock(stock - 1);
    }
  };

  return (
    <div className="flex">
      <div className="p-5">
        <h1 className="text-5xl font-light">All items</h1>
        <div className="flex justify-around my-3">
          <BarItemPrice data={barData2} />
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
                  <Image
                    src={item.item_image_link}
                    alt={item.item_name}
                    width={64}
                    height={64}
                    className="object-cover rounded-md"
                  />
                </TableCell>
                <TableCell>
                  <div className="border-[1px] h-[25px]"></div>
                </TableCell>
                <TableCell className="mb-2 capitalize">
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
                    <Badge variant="destructive" className="whitespace-nowrap">
                      Not Available
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="border-[1px] h-[25px]"></div>
                </TableCell>
                <TableCell>
                  <div className="flex justify-center items-center">
                    <Link href="" className="hover:text-primary"></Link>
                    <Dialog>
                      <DialogTrigger asChild>
                        <PenLine className="hover:text-primary hover:scale-90 cursor-pointer" />
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Edit Item "<span className="capitalize">{item.item_name}</span>"</DialogTitle>
                          <DialogDescription>
                            Make changes to {item.item_name}. Click edit item when
                            you're done.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                          <Label htmlFor="name">Name</Label>
                          <Input
                            type="text"
                            id="name"
                            placeholder="Item Name"
                            value={item.item_name}
                          />
                        </div>
                        <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
                          <Label htmlFor="imageLink">Image Link</Label>
                          <Input
                            type="text"
                            id="imageLink"
                            placeholder="Image Link"
                            value={item.item_image_link}
                          />
                        </div>
                        <div className="grid w-full gap-1.5 mt-4">
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            placeholder="Type your message here."
                            id="description"
                            style={{ resize: "none" }}
                            value={item.item_desc}
                          />
                        </div>
                        <div className="flex flex-col space-y-1.5 mt-4">
                          <Label htmlFor="category">Item Category</Label>
                          <Select>
                            <SelectTrigger id="category">
                              <SelectValue placeholder="Select Item Category" />
                            </SelectTrigger>
                            <SelectContent position="popper">
                              {categories.map((category) => {
                                return (
                                  <SelectItem
                                    key={category.category_id}
                                    value={`${category.category_name}`}
                                  >
                                    {category.category_name}
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-3 gap-4 w-full max-w-sm items-center gap-1.5 mt-4">
                          <div>
                            <Label htmlFor="price">Item Price</Label>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={decrementPrice}
                                className="h-10 w-10"
                                aria-label="Decrease price"
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <Input
                                type="number"
                                id="price"
                                inputMode="numeric"
                                step="any"
                                className="no-arrows h-10 w-12 flex text-center"
                                value={item.item_price}
                                onChange={(e) =>
                                  setPrice(parseInt(e.target.value))
                                }
                              />
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={incrementPrice}
                                className="h-10 w-10"
                                aria-label="Increase price"
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="stock">Item Stock</Label>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={decrementStock}
                                className="h-10 w-10"
                                aria-label="Decrease stock"
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <Input
                                type="number"
                                id="stock"
                                inputMode="numeric"
                                step="any"
                                className="no-arrows h-10 w-12 flex text-center"
                                value={item.item_stock}
                                onChange={(e) =>
                                  setStock(parseInt(e.target.value))
                                }
                              />
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={incrementStock}
                                className="h-10 w-10"
                                aria-label="Increase stock"
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex flex-col">
                            <Label htmlFor="">Item Availability</Label>
                            <Switch checked={item.item_status} className="mt-3" />
                          </div>
                        </div>
                        <DialogFooter>
                          <div className="flex justify-center">
                            <Button className="mt-4">
                              <PenLine /> Edit Item
                            </Button>
                          </div>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <AlertDialog>
                      <AlertDialogTrigger>
                        <Trash className="transition-transform text-destructive transform hover:scale-95 ml-2" />
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure you want to delete{" "}
                            <span className="capitalize">{item.item_name}</span>{" "}
                            ?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete {item.item_name} and remove your data from
                            our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction className="bg-destructive hover:bg-chart-3">
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
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
