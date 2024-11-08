import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="py-[25vh]">
      <div className="flex justify-center items-center flex-col">
        <h1 className="uppercase text-9xl font-tiltNeon text-foreground">
          IN<span className="text-primary">.V</span>
        </h1>
        <p className="max-w-[550px] text-center my-5">
          IN.V is a user-friendly inventory management app that streamlines
          tracking and organizing stock. It offers real-time updates, easy
          categorization, and comprehensive reporting to help businesses
          maintain optimal inventory levels and improve efficiency.
        </p>
        <div className="max-w-[500px] flex gap-2 flex-wrap">
          <Link href="/categories">
            <Button>Categories</Button>
          </Link>
          <Link href="/allitems">
            <Button>All Items</Button>
          </Link>
          <Link href="/newcategory">
            <Button>New Category</Button>
          </Link>
          <Link href="/newitem">
            <Button>New Item</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
