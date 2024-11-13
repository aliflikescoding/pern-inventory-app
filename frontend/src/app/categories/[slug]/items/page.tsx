"use client";

import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { items, categories } from "@/app/data";
interface Item {
  item_id: number;
  item_name: string;
  item_desc: string;
  item_price: number;
  item_stock: number;
  item_status: boolean;
  item_image_link: string;
  category_id: number;
}
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import Image from "next/image";
import { PenLine, Box, Trash, Plus, Minus } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import BarItemPrice from "@/components/bar-item-price";
import AvailDonutChart from "@/components/avail-donut-chart";
import BarAllItemsOne from "@/components/bar-all-items-one";

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

export default function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      itemName: "",
      imageLink: "",
      itemDesc: "",
      price: 1,
      stock: 1,
      itemAvail: false,
    },
  });
  const [formError, setFormError] = React.useState<string | null>(null);
  const [slug, setSlug] = useState<string | null>(null);
  const [categorizedItems, setCategorizedItems] = useState<Item[]>([]);
  const dataPie = processDataPie(categorizedItems);
  const barData1 = processDataBar1(categorizedItems);
  const dataPieAvail = getAvailabilitySummary(categorizedItems);
  const barData2 = processDataBar2(categorizedItems);

  // Function to filter items by category_id
  function getItemsByCategory(category_id: number): Item[] {
    return items.filter((item) => item.category_id === category_id);
  }

  function getCategoryName(category_id: number): string | null {
    const category = categories.find((cat) => cat.category_id === category_id);
    return category ? category.category_name : null;
  }

  // Unwrap the Promise for params using React.use()
  const unwrappedParams = React.use(params);

  useEffect(() => {
    if (unwrappedParams?.slug) {
      setSlug(unwrappedParams.slug);
    }
  }, [unwrappedParams]);

  useEffect(() => {
    console.log(categorizedItems);
  }, [categorizedItems]);

  useEffect(() => {
    // Only filter items once the slug is set
    if (slug !== null) {
      const categoryId = parseInt(slug);
      const itemsByCategory = getItemsByCategory(categoryId);
      setCategorizedItems(itemsByCategory);
    }
  }, [slug]);

  async function onDeleteSubmit(id: number) {
    try {
      console.log(`Deleting the item: ${id}`);
    } catch (err) {
      console.error(err);
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Validate the form data
      const validatedData = formSchema.parse(values);

      // Handle the form submission
      console.log(validatedData);

      // Clear any previous errors
      setFormError(null);

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

  const updateFormWithItem = (item: Item) => {
    form.reset({
      itemName: item.item_name,
      imageLink: item.item_image_link,
      itemDesc: item.item_desc,
      price: item.item_price,
      stock: item.item_stock,
      itemAvail: item.item_status,
    });
  };

  return (
    <div>
      <h1 className="text-4xl capitalize font-light text-center">
        Items in {slug ? getCategoryName(parseInt(slug)) : "Unknown"}
      </h1>
      <div className="flex justify-around my-3">
        <BarItemPrice data={barData2} />
        <AvailDonutChart
          totalAvailable={dataPieAvail.totalAvailable}
          totalNotAvailable={dataPieAvail.totalNotAvailable}
        />
      </div>
      <div className="flex justify-around my-3">
          <BarAllItemsOne data={barData1} />
        </div>
      <Table>
        <TableBody>
          {categorizedItems.length > 0 ? (
            categorizedItems.map((item) => (
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
                  <div className="border-[1px] w-[1px] h-[25px]"></div>
                </TableCell>
                <TableCell className="mb-2 capitalize">
                  {item.item_name}
                </TableCell>
                <TableCell>
                  <div className="border-[1px] w-[1px] h-[25px]"></div>
                </TableCell>
                <TableCell className="mx-2 w-[250px] text-xs">
                  {item.item_desc}
                </TableCell>
                <TableCell>
                  <div className="border-[1px] w-[1px] h-[25px]"></div>
                </TableCell>
                <TableCell className="mx-2 text-center whitespace-nowrap text-md overflow-hidden text-ellipsis">
                  <p className="">Item Price</p>
                  <p>
                    <span className="text-gray-400 text-lg">$</span>{" "}
                    {item.item_price} USD
                  </p>
                </TableCell>
                <TableCell>
                  <div className="border-[1px] w-[1px] h-[25px]"></div>
                </TableCell>
                <TableCell className="mx-2 text-center whitespace-nowrap text-md overflow-hidden text-ellipsis">
                  <p className="mb-1">Stock</p>
                  <div className="flex items-center justify-center mb-1">
                    <Box className="text-gray-300 text-sm mr-2" />
                    <p>{item.item_stock}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="border-[1px] w-[1px] h-[25px]"></div>
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
                  <div className="border-[1px] w-[1px] h-[25px]"></div>
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
                      <DialogTrigger>
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
                                      onBlur={() => {
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
                                      onBlur={() => {
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
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                No items available in this category.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
