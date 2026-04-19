import Image from "next/image"

export const MidBanner2 = () => {
  return (
    <>
      <div className="max-w-7xl mx-auto px-4 pt-16">
        <Image src="/images/midBanner2.jpg" alt="Mid Banner 2" width={1920} height={1080} className="object-cover w-full h-auto" />
      </div>
    </>
  )
}