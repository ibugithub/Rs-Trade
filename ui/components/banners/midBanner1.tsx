import Image from "next/image";

const items = [
  {
    title: "Wireless headphones",
    subtitle: "Starting at $49",
    link: "#",
    image: "/images/headphone.png",
    bg: "bg-gray-100",
  },
  {
    title: "Grooming",
    subtitle: "Starting at $49",
    link: "#",
    image: "/images/trimmer.png",
    bg: "bg-gray-200",
  },
  {
    title: "Video games",
    subtitle: "Starting at $49",
    link: "#",
    image: "/images/games.png",
    bg: "bg-yellow-100",
  },
];

export const MidBanner1 = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 pt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
      {items.map((item, idx) => (
        <div key={idx} className={`${item.bg} p-6 flex justify-between items-center`}>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{item.title}</h2>
            <p className="text-sm text-gray-600 mt-1">{item.subtitle}</p>
            <a href={item.link} className="text-blue-600 font-semibold text-sm mt-2 inline-block">
              Shop now
            </a>
          </div>
          <div className="relative w-28 h-28 md:w-36 md:h-36">
            <Image src={item.image} alt={item.title} fill className="object-contain" />
          </div>
        </div>
      ))}
    </div>
  );
};
