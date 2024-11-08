import React from "react";
import { Card } from "./ui/card";
import Image from "next/image";
import { Button } from "./ui/button";
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
import { PenLine, Trash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

// Define the props type
interface CategoryCardProps {
  name: string;
  link: string;
  imageLink: string,
}

const CategoryCard: React.FC<CategoryCardProps> = ({ name, link, imageLink }) => {
  return (
    <Card className="p-5 flex flex-col items-center">
      <Link href={`${link}`} className="relative">
        {/* Use relative positioning for the parent container */}
        <div className="bg-black absolute top-0 left-0 right-0 bottom-0 opacity-0 cursor-pointer hover:opacity-50 transition-opacity flex items-center justify-center">
          <p className="z-20 text-white">View Category Items</p>
        </div>
        <Image
          src={imageLink}
          width={300}
          height={300}
          alt="Category Image"
          className="object-cover"
        />
      </Link>
      <h1 className="text-2xl my-2 font-light">{name}</h1>
      <div className="flex gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="">
              <PenLine /> Edit Category
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                Edit Item "<span className="capitalize">{name}</span>"
              </DialogTitle>
              <DialogDescription>
                Make changes to {name}. Click edit category when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="name">Name</Label>
              <Input
                type="text"
                id="name"
                placeholder="Item Name"
                value={name}
              />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
              <Label htmlFor="imageLink">Image Link</Label>
              <Input
                type="text"
                id="imageLink"
                placeholder="Image Link"
                value={imageLink}
              />
            </div>
            <DialogFooter>
              <div className="flex justify-center">
                <Button className="mt-4">
                  <PenLine /> Edit Category
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <AlertDialog>
          <AlertDialogTrigger>
            <Button variant="destructive">
              <Trash /> Delete Category
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you absolutely sure you want to delete{" "}
                <span className="capitalize">{name}</span> ?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete{" "}
                {name} and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction className="bg-destructive hover:bg-chart-3 capitalize">
                Delete {name}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Card>
  );
};

export default CategoryCard;
