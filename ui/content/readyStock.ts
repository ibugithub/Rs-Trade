export type ReadyStockProduct = {
  id: string;
  name: string;
  image: string;
  description: string;
  demoPrice: number;
};

// Existing catalog images are used ONLY for the static design preview.
// Replace these examples with owner-approved Ready Stock before publication.
// Actual prices, MOQ, quantities and contacts have not yet been supplied.
// Backend categories remain intact, but the public page has no categories.
export const readyStockProducts: ReadyStockProduct[] = [
  {
    id: 'trimmer',
    demoPrice: 1250,
    name: 'Multi-purpose Grooming Kit',
    image: '/images/trimmer.png',
    description: 'A grooming kit for everyday personal care.',
  },
  {
    id: 'speaker',
    demoPrice: 3500,
    name: 'Compact Smart Speaker',
    image: '/images/Smart Speaker with Alexa Voice.jpg',
    description: 'A compact speaker option for home or office.',
  },
  {
    id: 'headphones',
    demoPrice: 2200,
    name: 'Everyday Headphones',
    image: '/images/headphone.jpg',
    description: 'Headphones for music, calls and daily listening.',
  },
  {
    id: 'camera',
    demoPrice: 18500,
    name: 'Digital Camera',
    image: '/images/4K Digital Camera, 12-32mm and 45.jpg',
    description: 'A camera option for photos and video.',
  },
  {
    id: 'washer',
    demoPrice: 12000,
    name: 'Compact Washing Machine',
    image: '/images/Compact Pulsator Washer.jpg',
    description: 'A compact appliance option for smaller spaces.',
  },
  {
    id: 'fridge',
    demoPrice: 15500,
    name: 'Mini Refrigerator',
    image: '/images/Mini Fridge with Freezer for Bedroom.jpg',
    description: 'A compact refrigerator option for home or office.',
  },
];
