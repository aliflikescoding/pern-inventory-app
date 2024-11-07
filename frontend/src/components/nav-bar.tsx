import React from 'react'
import { ModeToggle } from "@/components/mode-toggle";
import { AddButton } from './add-button';

const NavBar = () => {
  return (
    <div className='flex justify-between items-center py-4'>
      <div>
        <h1 className='uppercase text-5xl font-tiltNeon text-foreground'>IN<span className='text-primary'>.V</span></h1>
      </div>
      <div>
        <AddButton />
        <span className='ml-2'><ModeToggle/></span>
      </div>
    </div>
  )
}

export default NavBar