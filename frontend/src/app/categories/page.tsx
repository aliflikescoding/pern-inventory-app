"use client";

// react imports
import React from "react";
import { useForm } from "react-hook-form";
// next js imports
import Image from "next/image";
import Link from "next/link";
// zod imports
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
// shadcn ui imports
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
// custom components import
import CategoryTotalCard from "@/components/category-total-card";
// icon imports
import { PenLine, Trash } from "lucide-react";
// data imports
import { categories } from "@/app/data.js";

// form schema
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

// category interface
interface Category {
  category_id: number;
  category_name: string;
  category_image_link: string;
}

export default function Categories() {
  // form error state
  const [formError, setFormError] = React.useState<string | null>(null);

  // FORM FUNCTIONS
  // initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoryName: "",
      imageLink: "",
    },
  });

  // set form to data
  const updateFormWithCategory = (category: Category) => {
    form.reset({
      categoryName: category.category_name,
      imageLink: category.category_image_link,
    });
  };

  // ASYNC FUNCTIONS
  // edit categories
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

  // delete form
  async function onDeleteSubmit(id: number) {
    try {
      console.log(`Deleting the item: ${id}`);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div>
      <div className="p-5">
        <h1 className="text-5xl font-light">Categories</h1>
        <div className="my-5">
          <CategoryTotalCard name={`Categories`} total={categories.length} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {categories.map((category) => {
            // Add return statement or use an implicit return with parentheses
            return (
              <Card
                key={category.category_id}
                className="p-5 flex flex-col items-center"
              >
                <Link
                  href={`/categories/${category.category_id}/items`}
                  className="relative"
                >
                  {/* Use relative positioning for the parent container */}
                  <div className="bg-black absolute top-0 left-0 right-0 bottom-0 opacity-0 cursor-pointer hover:opacity-50 transition-opacity flex items-center justify-center">
                    <p className="z-20 text-white">View Category Items</p>
                  </div>
                  <Image
                    src={category.category_image_link}
                    width={300}
                    height={300}
                    alt="Category Image"
                    className="object-cover"
                  />
                </Link>
                <h1 className="text-2xl my-2 font-light">
                  {category.category_name}
                </h1>
                <div className="flex gap-2">
                  <Dialog
                    onOpenChange={(open) => {
                      if (open) {
                        updateFormWithCategory(category);
                      }
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button className="">
                        <PenLine /> Edit Category
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>
                          Edit Item &quot;
                          <span className="capitalize">
                            {category.category_name}
                          </span>
                          &quot;
                        </DialogTitle>
                        <DialogDescription>
                          Make changes to {category.category_name}. Click edit
                          category when you&apos;re done.
                        </DialogDescription>
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
                      </DialogHeader>
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
                                    className={
                                      fieldState.error ? "border-red-500" : ""
                                    }
                                    aria-invalid={fieldState.invalid}
                                    onBlur={() => {
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
                          <DialogFooter>
                            <div className="flex justify-center">
                              <Button
                                type="submit"
                                className="mt-4"
                                disabled={!form.formState.isValid}
                              >
                                <PenLine className="mr-2" /> Edit Item
                              </Button>
                            </div>
                          </DialogFooter>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">
                        <Trash /> Delete Category
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          onDeleteSubmit(category.category_id);
                        }}
                      >
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure you want to delete{" "}
                            <span className="capitalize">
                              {category.category_name}
                            </span>{" "}
                            ?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            <p className="text-xl my-2">
                              This action cannot be undone. This will
                              permanently delete {category.category_name} and
                              all of {category.category_name}&apos; items.
                            </p>
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-destructive hover:bg-chart-3 capitalize"
                            type="submit"
                          >
                            Delete {category.category_name}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </form>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
