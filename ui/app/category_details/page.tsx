import { Suspense } from "react"
import { CategoryDetails } from "@/components/Categories/category_details"

export default function CategoryDetails_page () {
  return (
    <div className="flex justify-center w-full">
      <Suspense fallback={<div className="p-6">Loading products...</div>}>
        <CategoryDetails />
      </Suspense>
    </div>
  )
}
