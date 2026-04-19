import Image from "next/image"

export const BottomBanner = () => {
  return (
    <>
      <div className="max-w-7xl mx-auto px-4 pt-16">
        <Image src="/images/bottomBanner.jpg" alt="Bottom Banner" width={1920} height={1080} className="object-cover w-full h-auto" />
      </div>
    </>
  )
}