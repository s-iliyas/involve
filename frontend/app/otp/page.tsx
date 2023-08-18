import Image from 'next/image'
import React from 'react'
import OTPForm from './form'

const OTPComponent = () => {
  return (
    <div className="flex flex-row pt-16 justify-center">
    <div className="pt-14 flex  items-center flex-col space-y-4 ">
      <OTPForm />
    </div>
    <div className="lg:block hidden scroll-mx-2">
      <Image
        height={1000}
        width={1000}
        src={"/images/otp.svg"}
        alt="otp image"
      />
    </div>
  </div>
  )
}

export default OTPComponent