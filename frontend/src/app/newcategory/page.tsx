"use client";

// react imports
import React from "react";
import { useForm } from "react-hook-form";
// zod imports
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
// shadcn UI imports
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
// icon imports
import { Plus } from "lucide-react";

// form schema
const formSchema = z.object({
  category_name: z
    .string()
    .min(1, "Category name is required")
    .max(50, "Category name must be less than 50 characters"),
  category_image_link: z
    .string()
    .url("Must be a valid URL")
    .min(1, "Image link is required"),
});

const NewCategory = () => {
  // form error state
  const [formError, setFormError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // FORM FUNCTIONS
  // set form to form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category_name: "",
      category_image_link: "",
    },
  });

  // ASYNC FUNCTIONS
  // add new category
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const validatedData = formSchema.parse(values);

      const response = await fetch("/api/categories", {
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
        const errorMessages = error.errors.map((err) => err.message).join(", ");
        setFormError(errorMessages);
      } else {
        setFormError(
          error instanceof Error
            ? error.message
            : "An unexpected error occurred"
        );
      }
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
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
                name="category_name"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Category Name"
                        {...field}
                        className={fieldState.error ? "border-red-500" : ""}
                        aria-invalid={fieldState.invalid}
                        onBlur={() => {
                          field.onBlur();
                          // Trigger validation on blur
                          form.trigger("category_name");
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category_image_link"
                render={({ field, fieldState }) => (
                  <FormItem className="mt-2">
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
                          form.trigger("category_image_link");
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
                  disabled={!form.formState.isValid || isSubmitting}
                >
                  {isSubmitting ? (
                    <>Loading...</>
                  ) : (
                    <>
                      <Plus /> Create New Category
                    </>
                  )}
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
