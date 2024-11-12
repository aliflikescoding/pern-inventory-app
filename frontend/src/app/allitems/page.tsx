"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { allItems } from "@/app/data.js";
import { PenLine, Box, Layers3, Trash, Plus, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import BarAllItemsOne from "@/components/bar-all-items-one";
import AllItemsDonutChart from "@/components/all-items-donut-chart";
import AvailDonutChart from "@/components/avail-donut-chart";
import BarItemPrice from "@/components/bar-item-price";
import { Input } from "@/components/ui/input";
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

// Form Schema
const formSchema = z.object({
  itemName: z
    .string()
    .min(1, "Item name is required")
    .max(50, "Item name must be less than 50 characters"),
  imageLink: z
    .string()
    .url("Must be a valid URL")
    .min(1, "Image link is required"),
  itemDesc: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters"),
  itemCategory: z.string().min(1, "Category is required"),
  price: z
    .number()
    .min(0.01, "Price must be greater than 0")
    .max(999999.99, "Price must be less than 1,000,000"),
  stock: z
    .number()
    .int("Stock must be a whole number")
    .min(0, "Stock cannot be negative")
    .max(999999, "Stock must be less than 1,000,000"),
  itemAvail: z.boolean(),
});

// Rest of your interface definitions and data processing functions remain the same
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
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const dataPie = processDataPie(allItems);
  const barData1 = processDataBar1(allItems);
  const dataPieAvail = getAvailabilitySummary(allItems);
  const barData2 = processDataBar2(allItems);
  const [formError, setFormError] = React.useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      itemName: "",
      imageLink: "",
      itemDesc: "",
      itemCategory: "",
      price: 1,
      stock: 1,
      itemAvail: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Validate the form data
      const validatedData = formSchema.parse(values);

      // Handle the form submission
      console.log(validatedData);

      // Clear any previous errors
      setFormError(null);

      // Close the dialog
      setIsDialogOpen(false);

      // Reset form
      form.reset();
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle Zod validation errors
        const errorMessages = error.errors.map((err) => err.message).join(", ");
        setFormError(errorMessages);
      } else {
        // Handle other errors
        setFormError("An unexpected error occurred");
      }
    }
  }

  async function onDeleteSubmit(id: number) {
    try {
      console.log(`Deleting the item: ${id}`);
    } catch (err) {
      console.error(err);
    }
  }

  const updateFormWithItem = (item: Item) => {
    form.reset({
      itemName: item.item_name,
      imageLink: item.item_image_link,
      itemDesc: item.item_desc,
      itemCategory: item.category_name,
      price: item.item_price,
      stock: item.item_stock,
      itemAvail: item.item_status,
    });
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
                    <Dialog
                      
                      onOpenChange={(open) => {
                        setIsDialogOpen(open);
                        if (open) {
                          updateFormWithItem(item);
                        }
                      }}
                    >
                      <DialogTrigger asChild>
                        <PenLine className="hover:text-primary hover:scale-90 cursor-pointer" />
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>
                            Edit Item &quot;
                            <span className="capitalize">{item.item_name}</span>
                            &quot;
                          </DialogTitle>
                          <DialogDescription>
                            Make changes to {item.item_name}. Click edit item
                            when you&apos;re done.
                          </DialogDescription>
                        </DialogHeader>
                        <Form {...form}>
                          <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-4"
                          >
                            {formError && (
                              <div className="text-red-500 text-sm p-2 bg-red-50 rounded">
                                {formError}
                              </div>
                            )}
                            {form.formState.errors.root && (
                              <div className="text-red-500 text-sm p-2 bg-red-50 rounded">
                                {form.formState.errors.root.message}
                              </div>
                            )}

                            <FormField
                              control={form.control}
                              name="itemName"
                              render={({ field, fieldState }) => (
                                <FormItem>
                                  <FormLabel>Name</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Item name"
                                      {...field}
                                      className={
                                        fieldState.error ? "border-red-500" : ""
                                      }
                                      aria-invalid={fieldState.invalid}
                                      onBlur={(e) => {
                                        field.onBlur();
                                        // Trigger validation on blur
                                        form.trigger("itemName");
                                      }}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="imageLink"
                              render={({ field, fieldState }) => (
                                <FormItem>
                                  <FormLabel>Image Link</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Image Link"
                                      {...field}
                                      className={
                                        fieldState.error ? "border-red-500" : ""
                                      }
                                      aria-invalid={fieldState.invalid}
                                      onBlur={(e) => {
                                        field.onBlur();
                                        // Trigger validation on blur
                                        form.trigger("imageLink");
                                      }}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="itemDesc"
                              render={({ field, fieldState }) => (
                                <FormItem>
                                  <FormLabel>Description</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      {...field} // Move this to the beginning
                                      placeholder="Type your description here."
                                      className={`resize-none ${
                                        fieldState.error ? "border-red-500" : ""
                                      }`}
                                      aria-invalid={!!fieldState.error}
                                      onBlur={() => {
                                        field.onBlur();
                                        form.trigger("itemDesc");
                                      }}
                                    />
                                  </FormControl>
                                  {/* Add a min height to prevent layout shift */}
                                  <FormMessage className="min-h-[20px]" />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="itemCategory"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Category</FormLabel>
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select a category" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {categories.map((category) => (
                                        <SelectItem
                                          key={category.category_id}
                                          value={category.category_name}
                                        >
                                          {category.category_name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <div className="flex gap-3">
                              <FormField
                                control={form.control}
                                name="price"
                                render={({ field, fieldState }) => (
                                  <FormItem>
                                    <FormLabel>Price</FormLabel>
                                    <FormControl>
                                      <div className="flex items-center gap-2">
                                        <Button
                                          type="button"
                                          variant="outline"
                                          size="icon"
                                          onClick={() => {
                                            const newValue = Math.max(
                                              0.01,
                                              field.value - 1
                                            );
                                            field.onChange(newValue);
                                            // Trigger validation after changing value
                                            form.trigger("price");
                                          }}
                                          className="h-10 w-10"
                                        >
                                          <Minus className="h-4 w-4" />
                                        </Button>
                                        <Input
                                          {...field}
                                          type="number"
                                          step="0.01"
                                          onChange={(e) => {
                                            const value = parseFloat(
                                              e.target.value
                                            );
                                            const newValue = isNaN(value)
                                              ? 0
                                              : value;
                                            field.onChange(newValue);
                                            // Trigger validation after changing value
                                            form.trigger("price");
                                          }}
                                          onBlur={() => {
                                            field.onBlur();
                                            form.trigger("price");
                                          }}
                                          aria-invalid={!!fieldState.error}
                                          className={`w-20 text-center ${
                                            fieldState.error
                                              ? "border-red-500"
                                              : ""
                                          }`}
                                        />
                                        <Button
                                          type="button"
                                          variant="outline"
                                          size="icon"
                                          onClick={() => {
                                            const newValue = Math.min(
                                              999999.99,
                                              field.value + 1
                                            );
                                            field.onChange(newValue);
                                            // Trigger validation after changing value
                                            form.trigger("price");
                                          }}
                                          className="h-10 w-10"
                                        >
                                          <Plus className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </FormControl>
                                    <FormMessage className="min-h-[20px]" />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="stock"
                                render={({ field, fieldState }) => (
                                  <FormItem>
                                    <FormLabel>Stock</FormLabel>
                                    <FormControl>
                                      <div className="flex items-center gap-2">
                                        <Button
                                          type="button"
                                          variant="outline"
                                          size="icon"
                                          onClick={() => {
                                            const newValue = Math.max(
                                              0,
                                              field.value - 1
                                            );
                                            field.onChange(newValue);
                                            // Trigger validation after changing value
                                            form.trigger("stock");
                                          }}
                                          className="h-10 w-10"
                                        >
                                          <Minus className="h-4 w-4" />
                                        </Button>
                                        <Input
                                          {...field}
                                          type="number"
                                          step="1"
                                          onChange={(e) => {
                                            const value = parseInt(
                                              e.target.value
                                            );
                                            const newValue = isNaN(value)
                                              ? 0
                                              : value;
                                            field.onChange(newValue);
                                            // Trigger validation after changing value
                                            form.trigger("stock");
                                          }}
                                          onBlur={() => {
                                            field.onBlur();
                                            form.trigger("stock");
                                          }}
                                          aria-invalid={!!fieldState.error}
                                          className={`w-20 text-center ${
                                            fieldState.error
                                              ? "border-red-500"
                                              : ""
                                          }`}
                                        />
                                        <Button
                                          type="button"
                                          variant="outline"
                                          size="icon"
                                          onClick={() => {
                                            const newValue = Math.min(
                                              999999,
                                              field.value + 1
                                            );
                                            field.onChange(newValue);
                                            // Trigger validation after changing value
                                            form.trigger("stock");
                                          }}
                                          className="h-10 w-10"
                                        >
                                          <Plus className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </FormControl>
                                    <FormMessage className="min-h-[20px]" />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="itemAvail"
                                render={({ field }) => (
                                  <FormItem className="flex flex-col">
                                    <FormLabel>Availability</FormLabel>
                                    <FormControl>
                                      <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <DialogFooter>
                              <Button
                                type="submit"
                                className="mt-4"
                                disabled={!form.formState.isValid}
                              >
                                <PenLine className="mr-2" /> Edit Item
                              </Button>
                            </DialogFooter>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>
                    <AlertDialog>
                      <AlertDialogTrigger>
                        <Trash className="transition-transform text-destructive transform hover:scale-95 ml-2" />
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            onDeleteSubmit(item.item_id);
                          }}
                        >
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you absolutely sure you want to delete{" "}
                              <span className="capitalize">
                                {item.item_name}
                              </span>
                              ?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete {item.item_name} and remove
                              your data from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-destructive hover:bg-chart-3"
                              type="submit"
                            >
                              Continue
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </form>
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
