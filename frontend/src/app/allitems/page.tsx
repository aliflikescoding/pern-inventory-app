"use client";

// react imports
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
// next js imports
import Image from "next/image";
// zod imports
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
// ShadCN UI imports
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
import { Badge } from "@/components/ui/badge";
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
// custom components imports
import BarAllItemsOne from "@/components/bar-all-items-one";
import AllItemsDonutChart from "@/components/all-items-donut-chart";
import AvailDonutChart from "@/components/avail-donut-chart";
import BarItemPrice from "@/components/bar-item-price";
// icon imports
import { PenLine, Box, Layers3, Trash, Plus, Minus } from "lucide-react";

// Form Schema
const formSchema = z.object({
  item_id: z.number().optional(), // Optional for new items, required for edits
  item_name: z
    .string()
    .min(1, "Item name is required")
    .max(50, "Item name must be less than 50 characters"),
  item_image_link: z
    .string()
    .url("Must be a valid URL")
    .min(1, "Image link is required"),
  item_desc: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters"),
  category_id: z.number(),
  item_price: z
    .number()
    .min(0.01, "Price must be greater than 0")
    .max(999999.99, "Price must be less than 1,000,000"),
  item_stock: z
    .number()
    .int("Stock must be a whole number")
    .min(0, "Stock cannot be negative")
    .max(999999, "Stock must be less than 1,000,000"),
  item_status: z.boolean(),
  password: z.string().min(1, "Password is required"),
});

// Data interfaces
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

interface Category {
  category_id: number;
  category_name: string;
  category_image_link: string;
}

const verifyPassword = async (inputPassword: string) => {
  const response = await fetch("/api/verifyPassword", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password: inputPassword }),
  });

  const data = await response.json();
  return data.isValid;
};

// Data processing functions
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

const getAvailabilitySummary = (items: Item[]) => {
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
  /* STATES */
  // data states
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [allItems, setAllItems] = useState<Item[]>([]);
  const dataPie = processDataPie(allItems);
  const barData1 = processDataBar1(allItems);
  const dataPieAvail = getAvailabilitySummary(allItems);
  const barData2 = processDataBar2(allItems);
  // form error state
  const [formError, setFormError] = React.useState<string | null>(null);

  // FORM
  // make inital form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      item_id: undefined,
      item_name: "",
      item_image_link: "",
      item_desc: "",
      category_id: 0,
      item_price: 1,
      item_stock: 1,
      item_status: false,
      password: "",
    },
  });

  // update forms with items
  const updateFormWithItem = (item: Item) => {
    form.reset({
      item_id: item.item_id,
      item_name: item.item_name,
      item_image_link: item.item_image_link,
      item_desc: item.item_desc,
      category_id: item.category_id,
      item_price: item.item_price,
      item_stock: item.item_stock,
      item_status: item.item_status,
      password: "",
    });
  };

  // ASYNC FUNCTIONS
  // edit item
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const validatedData = formSchema.parse(values);

      const isValidPassword = await verifyPassword(validatedData.password);
      if (!isValidPassword) {
        setFormError("Incorrect password");
        return;
      }

      const response = await fetch(`api/editItem/${validatedData.item_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validatedData),
      });

      const data = await response.json();

      if (response.ok) {
        setFormError(null);
        form.reset();
        alert("Category created successfully!");
        window.location.reload();
      } else {
        throw new Error(data.message || "Failed to create category");
      }
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

  // delete item
  async function onDeleteSubmit(id: number, password: string) {
    try {
      const isValidPassword = await verifyPassword(password);
      if (!isValidPassword) {
        alert("Incorrect password");
        return;
      }

      const response = await fetch(`/api/deleteItem/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        window.location.reload();
      } else {
        console.error(`Failed to delete item ${id}:`, data.error);
        alert(data.error);
      }
    } catch (err) {
      console.error("An error occurred while deleting the item:", err);
      alert("Failed to delete the item. Please try again.");
    }
  }

  useEffect(() => {
    async function getCategories() {
      try {
        const res = await fetch("/api/category", {
          // Add cache settings if needed
          next: { revalidate: 60 }, // Cache for 60 seconds
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Failed to fetch categories");
      }
    }

    getCategories();
  }, []);

  useEffect(() => {
    async function getAllItems() {
      try {
        const res = await fetch("/api/allItems", {
          // Add cache settings if needed
          next: { revalidate: 60 }, // Cache for 60 seconds
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        setAllItems(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Failed to fetch categories");
      }
    }

    getAllItems();
  }, []);

  useEffect(() => {
    console.log(allItems);
  }, [allItems]);

  if (error) return <div>Error: {error}</div>;
  if (!categories) return <div>Loading...</div>;

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
                    <Dialog
                      onOpenChange={(open) => {
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
                              name="password"
                              render={({ field, fieldState }) => (
                                <FormItem>
                                  <FormLabel>Admin Password</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="password"
                                      placeholder="Enter admin password"
                                      {...field}
                                      className={
                                        fieldState.error ? "border-red-500" : ""
                                      }
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="item_name"
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
                                      onBlur={() => {
                                        field.onBlur();
                                        // Trigger validation on blur
                                        form.trigger("item_name");
                                      }}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="item_image_link"
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
                                      onBlur={() => {
                                        field.onBlur();
                                        // Trigger validation on blur
                                        form.trigger("item_image_link");
                                      }}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="item_desc"
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
                                        form.trigger("item_desc");
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
                              name="category_id"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Category</FormLabel>
                                  <Select
                                    onValueChange={(value) =>
                                      field.onChange(Number(value))
                                    }
                                    defaultValue={field.value?.toString()}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select a category">
                                          {categories.find(
                                            (cat) =>
                                              cat.category_id === field.value
                                          )?.category_name ||
                                            "Select a category"}
                                        </SelectValue>
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {categories.map((category) => (
                                        <SelectItem
                                          key={category.category_id}
                                          value={category.category_id.toString()}
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
                                name="item_price"
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
                                            form.trigger("item_price");
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
                                            form.trigger("item_price");
                                          }}
                                          onBlur={() => {
                                            field.onBlur();
                                            form.trigger("item_price");
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
                                            form.trigger("item_price");
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
                                name="item_stock"
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
                                            form.trigger("item_stock");
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
                                            form.trigger("item_stock");
                                          }}
                                          onBlur={() => {
                                            field.onBlur();
                                            form.trigger("item_stock");
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
                                            form.trigger("item_stock");
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
                                name="item_status"
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
                              <p>
                                This action cannot be undone. This will
                                permanently delete {item.item_name} and remove
                                your data from our servers.
                              </p>
                              <div className="mt-4">
                                <Input
                                  type="password"
                                  placeholder="Enter admin password"
                                  id={`delete-password-${item.item_id}`}
                                  className="mb-4"
                                />
                              </div>
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => {
                                const passwordInput = document.getElementById(
                                  `delete-password-${item.item_id}`
                                ) as HTMLInputElement;
                                onDeleteSubmit(
                                  item.item_id,
                                  passwordInput.value
                                );
                              }}
                              className="bg-red-500 hover:bg-red-600"
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
