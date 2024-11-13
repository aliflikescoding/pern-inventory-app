"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
const formSchema = z.object({
  categoryName: z
    .string()
    .min(1, "Category name is required")
    .max(50, "Category name must be less than 50 characters"),
  imageLink: z
    .string()
    .url("Must be a valid URL")
    .min(1, "Image link is required"),
});

const NewCategory = () => {
  const [formError, setFormError] = React.useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoryName: "",
      imageLink: "",
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
    <div className="flex justify-center items-center py-[25vh] text-foreground">
      <Card className="min-w-[350px]">
        <CardHeader className="text-foreground">
          <h1 className="capitalize text-2xl font-medium">Add New Category</h1>
        </CardHeader>
        <CardContent className="text-foreground">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="categoryName"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Category Name"
                        {...field}
                        className={fieldState.error ? "border-red-500" : ""}
                        aria-invalid={fieldState.invalid}
                        onBlur={(ellipsis) => {
                          field.onBlur();
                          // Trigger validation on blur
                          form.trigger("categoryName");
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
                  <FormItem className="mt-2">
                    <FormLabel>Image Link</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Image Link"
                        {...field}
                        className={fieldState.error ? "border-red-500" : ""}
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
              <div className="flex justify-center">
                <Button
                  type="submit"
                  className="mt-4"
                  disabled={!form.formState.isValid}
                >
                  <Plus /> Create New Category
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewCategory;
