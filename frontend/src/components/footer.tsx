import React from "react";
import Link from "next/link";
import { Github, Linkedin, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <div className="flex items-center justify-center text-center p-4">
      <div>
        <p>
          Made by{" "}
          <Link href="https://github.com/aliflikescoding" target="_" className="hover:underline hover:text-primary">
            Aliflikescoding
          </Link>{" "}
          © 2024
        </p>
        <div className="flex gap-2 justify-center items-center mt-2">
          <div className="hover:text-primary">
            <Link href="https://github.com/aliflikescoding" target="_">
              <Github className="h-[1.5rem] w-[1.5rem]" />
            </Link>
          </div>
          <div className="hover:text-primary">
            <Link href="https://www.linkedin.com/in/alifwibowo/" target="_">
              <Linkedin className="h-[1.5rem] w-[1.5rem]" />
            </Link>
          </div>
          <div className="hover:text-primary">
            <Link href="https://x.com/AlifLikesCoding" target="_">
              <Twitter className="h-[1.5rem] w-[1.5rem]" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
