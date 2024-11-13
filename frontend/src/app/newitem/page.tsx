"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { categories } from "../data";
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

const NewItem = () => {
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
                name="itemName"
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
                        className={fieldState.error ? "border-red-500" : ""}
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
              <FormField
                control={form.control}
                name="itemCategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={form.watch("itemCategory")} // Dynamically watch the value
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
                              const newValue = Math.max(0.01, field.value - 1);
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
                              const value = parseFloat(e.target.value);
                              const newValue = isNaN(value) ? 0 : value;
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
                              const newValue = Math.max(0, field.value - 1);
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
                              const value = parseInt(e.target.value);
                              const newValue = isNaN(value) ? 0 : value;
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
