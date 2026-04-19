import Link from 'next/link';

export const AddToCart = () => {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Add to cart</h1>
      <p className="text-gray-600 mb-6">Added to cart.</p>
      <div className="bg-white shadow-md rounded-lg p-6">

        <Link href="/checkout">
          <p className="text-gray-500">proceed to checkout.</p>
        </Link>

        <Link href="/cart">
          <p className="text-gray-500">Go to Cart.</p>
        </Link>
      </div>
    </div>
  );
}