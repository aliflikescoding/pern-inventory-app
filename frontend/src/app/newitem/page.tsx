"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categories } from "../data";

const NewItem = () => {
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
    <div className="flex justify-center items-center py-[10vh] text-foreground">
      <Card className="min-w-[350px]">
        <CardHeader className="text-foreground">
          <h1 className="capitalize text-2xl font-medium">Add New Item</h1>
        </CardHeader>
        <CardContent className="text-foreground">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="name">Name</Label>
            <Input type="text" id="name" placeholder="Item Name" />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
            <Label htmlFor="imageLink">Image Link</Label>
            <Input type="text" id="imageLink" placeholder="Image Link" />
          </div>
          <div className="grid w-full gap-1.5 mt-4">
            <Label htmlFor="description">Description</Label>
            <Textarea
              placeholder="Type your message here."
              id="description"
              style={{ resize: "none" }}
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
                  className="no-arrows h-10 w-10 flex text-center"
                  value={price}
                  onChange={(e) => setPrice(parseInt(e.target.value))}
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
                  className="no-arrows h-10 w-10 flex text-center"
                  value={stock}
                  onChange={(e) => setStock(parseInt(e.target.value))}
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
              <Switch className="mt-3" />
            </div>
          </div>
          <div className="flex justify-center">
            <Button className="mt-4">
              <Plus /> Create New Item
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewItem;
