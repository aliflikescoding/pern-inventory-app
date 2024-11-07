import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const NewCategory = () => {
  return (
    <div className="flex justify-center items-center py-[25vh] text-foreground">
      <Card className="min-w-[350px]">
        <CardHeader className="text-foreground">
          <h1 className="capitalize text-2xl font-medium">Add New Category</h1>
        </CardHeader>
        <CardContent className="text-foreground">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="name">Name</Label>
            <Input type="text" id="name" placeholder="Category Name" />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
            <Label htmlFor="imageLink">Image Link</Label>
            <Input type="text" id="imageLink" placeholder="Image Link" />
          </div>
          <div className="flex justify-center">
            <Button className="mt-4">
              <Plus /> Create New Category
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewCategory;
