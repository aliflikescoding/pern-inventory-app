import React from "react";
import { ModeToggle } from "@/components/mode-toggle";
import { AddButton } from "./add-button";
import Link from "next/link";

const NavBar = () => {
  return (
    <div className="flex justify-between items-center py-4">
      <div>
        <Link href="/">
          <h1 className="uppercase text-5xl font-tiltNeon text-foreground">
            IN<span className="text-primary">.V</span>
          </h1>
        </Link>
      </div>
      <div className="flex gap-5">
        <Link className="hover:underline text-xl font-light" href="/allitems">
          All Items
        </Link>
        <Link className="hover:underline text-xl font-light" href="/categories">
          Categories
        </Link>
      </div>
      <div>
        <AddButton />
        <span className="ml-2">
          <ModeToggle />
        </span>
      </div>
    </div>
  );
};

export default NavBar;
