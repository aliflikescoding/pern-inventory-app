import React from 'react'
import { ModeToggle } from "@/components/node-toggle";

const NavBar = () => {
  return (
    <div className='flex justify-between items-center py-4'>
      <div>
        <h1 className='uppercase text-5xl font-tiltNeon text-foreground'>IN<span className='text-primary'>.V</span></h1>
      </div>
      <div>
        <ModeToggle />
      </div>
    </div>
  )
}

export default NavBar