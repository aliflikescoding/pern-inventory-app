"use client";

//react imports
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
// next js imports
import Image from "next/image";
// zod
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
// shadCN UI imports
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
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
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
// custom components import
import BarItemPrice from "@/components/bar-item-price";
import AvailDonutChart from "@/components/avail-donut-chart";
import BarAllItemsOne from "@/components/bar-all-items-one";
// icon imports
import { PenLine, Box, Trash, Plus, Minus } from "lucide-react";

// form schema
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

// items typscript interface
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

// category typescript interface
interface Category {
  category_id: number;
  category_name: string;
  category_image_link: string;
}

// chart data processing functions
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

export default function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  /* FORM FUNCTIONS */
  // define forms
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
  // update the form with the current items
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
  // states
  const [formError, setFormError] = React.useState<string | null>(null);
  const [slug, setSlug] = useState<string | null>(null);
  const [categorizedItems, setCategorizedItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const barData1 = processDataBar1(categorizedItems);
  const dataPieAvail = getAvailabilitySummary(categorizedItems);
  const barData2 = processDataBar2(categorizedItems);

  // ASYNC FUNCTIONS
  // delete item function
  async function onDeleteSubmit(id: number) {
    try {
      const response = await fetch(`/api/deleteItem/${id}`, {
        method: "DELETE",
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
      alert("Failed to delete the category. Please try again.");
    }
  }

  // edit item function
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

  // filter dummy data category to get category name
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
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/categoryItem/${slug}`);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const result = await response.json();

        // Check if result is an array
        if (!Array.isArray(result)) {
          // If result is not an array but has a data property that is an array
          if (result.data && Array.isArray(result.data)) {
            setCategorizedItems(result.data);
          } else {
            // If we get an object or other non-array data, convert to array
            const itemsArray = result ? [result] : [];
            setCategorizedItems(itemsArray);
          }
        } else {
          // If result is already an array, use it directly
          setCategorizedItems(result);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch data");
        setCategorizedItems([]); // Set to empty array on error
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchData();
    }
  }, [slug]);

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
  }, []); // Add empty dependency array to prevent continuous re-fetching

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

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
