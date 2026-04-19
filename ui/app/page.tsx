import { Categories } from "@/components/Categories/categories";
import { Hero } from "@/components/Hero/hero";
import { TopCategory } from "@/components/Categories/topCategory";
import { TopBanner } from "@/components/banners/topBanner";
import { MidBanner1 } from "@/components/banners/midBanner1";
import { MidCategory1 } from "@/components/Categories/midCategory1";
import { MidBanner2 } from "@/components/banners/midBanner2";
import { MidCategory2 } from "@/components/Categories/midCategory2";
import { BottomBanner } from "@/components/banners/bottomBanner";
import { BottomCategory } from "@/components/Categories/bottomCategory";
import { BrandsDeal } from "@/components/Categories/brandsDeal";
import { Contact } from "@/components/contact_newsLetter/contact";
import { Footer } from "@/components/footer/footer";

export default function Page() {
  return (
    <div className="mt-[7.5rem] bg-gray-100">
      <Hero />
      <Categories />
      <TopBanner />
      <TopCategory />
      <MidBanner1 />
      <MidCategory1 />
      <MidBanner2 />
      <MidCategory2 />
      <BottomBanner />
      <BottomCategory />
      <BrandsDeal />
      <Contact />
      <Footer />
    </div>

  );
}
