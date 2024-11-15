"use client";

// react imports
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
// zod imports
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
// shadcn ui components imports
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
// icon imports
import { Plus, Minus } from "lucide-react";
//category typescript interface
interface Category {
  category_id: number;
  category_name: string;
  category_image_link: string;
}

// form schema
const formSchema = z.object({
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
  category_id: z.number(), // Changed to number type for category_id
  item_price: z
    .number()
    .min(0.01, "item_price must be greater than 0")
    .max(999999.99, "item_price must be less than 1,000,000"),
  item_stock: z
    .number()
    .int("item_stock must be a whole number")
    .min(0, "item_stock cannot be negative")
    .max(999999, "item_stock must be less than 1,000,000"),
  item_status: z.boolean(),
});

const NewItem = () => {
  // form states
  const [formError, setFormError] = React.useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  // initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      item_name: "",
      item_image_link: "",
      item_desc: "",
      category_id: 0,
      item_price: 1,
      item_stock: 1,
      item_status: false,
    },
  });

  // ASYNC FUNCTIONS
  // add new item form
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Validate the form data
      const validatedData = formSchema.parse(values);

      // Handle the form submission
      const response = await fetch("/api/newItem", {
        method: "POST",
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

  if (error) return <div>Error: {error}</div>;
  if (!categories) return <div>Loading...</div>;

  return (
    <div className="flex justify-center items-center py-[10vh] text-foreground">
      <Card className="min-w-[350px]">
        <CardHeader className="text-foreground">
          <h1 className="capitalize text-2xl font-medium">Add New Item</h1>
        </CardHeader>
        <CardContent className="text-foreground">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                name="item_name"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Item name"
                        {...field}
                        className={fieldState.error ? "border-red-500" : ""}
                        aria-invalid={fieldState.invalid}
                        onBlur={() => {
                          field.onBlur();
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
                        className={fieldState.error ? "border-red-500" : ""}
                        aria-invalid={fieldState.invalid}
                        onBlur={() => {
                          field.onBlur();
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
                        {...field}
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
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category">
                            {
                              categories.find(
                                (cat) => cat.category_id === field.value
                              )?.category_name
                            }
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
                              const newValue = Math.max(0.01, field.value - 1);
                              field.onChange(newValue);
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
                              const value = parseFloat(e.target.value);
                              const newValue = isNaN(value) ? 0 : value;
                              field.onChange(newValue);
                              form.trigger("item_price");
                            }}
                            onBlur={() => {
                              field.onBlur();
                              form.trigger("item_price");
                            }}
                            aria-invalid={!!fieldState.error}
                            className={`w-20 text-center ${
                              fieldState.error ? "border-red-500" : ""
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
                              const newValue = Math.max(0, field.value - 1);
                              field.onChange(newValue);
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
                              const value = parseInt(e.target.value);
                              const newValue = isNaN(value) ? 0 : value;
                              field.onChange(newValue);
                              form.trigger("item_stock");
                            }}
                            onBlur={() => {
                              field.onBlur();
                              form.trigger("item_stock");
                            }}
                            aria-invalid={!!fieldState.error}
                            className={`w-20 text-center ${
                              fieldState.error ? "border-red-500" : ""
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
              <div className="flex justify-center">
                <Button
                  type="submit"
                  className="mt-4"
                  disabled={!form.formState.isValid}
                >
                  <Plus /> Create New Item
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewItem;
