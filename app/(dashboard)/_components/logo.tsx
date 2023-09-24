import Image from 'next/image'
import React from 'react'

export default function Logo() {
  return (
    <Image
    src={"/logo.svg"}
    alt='logo'
    width={130}
    height={130}
    />
      
  )
}
