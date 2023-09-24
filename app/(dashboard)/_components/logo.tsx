import Image from 'next/image'
import React from 'react'

export default function Logo() {
  return (
    <Image
    src={"/vercel.svg"}
    alt='logo'
    width={130}
    height={130}
    />
      
  )
}
