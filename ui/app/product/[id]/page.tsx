import { ProductDetails } from "@/components/product/productDetails"

const productIds = [
  ...Array.from({ length: 36 }, (_, index) => `product${index + 1}`),
];

export function generateStaticParams() {
  return productIds.map((id) => ({ id }));
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  return (
    <div className="mt-[7.5rem] bg-gray-100">
      <ProductDetails productId={id} />
    </div>
  );
}
