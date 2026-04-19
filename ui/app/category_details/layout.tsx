import { Sidebar } from "@/components/Categories/category_sidebar"

export default function CategoryDetails_Layout ({children} : {children: React.ReactNode}){
  return (
    <div className="mt-[8rem] flex flex-row ">
      <Sidebar />
      {children}
    </div>
  )
}
