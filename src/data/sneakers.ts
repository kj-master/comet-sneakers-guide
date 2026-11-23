import aeresDriftwoodImg from '../assets/images/aeres_driftwood_1795258637763.jpg';
import aeresZiroImg from '../assets/images/aeres_ziro_1795258637488.jpg';
import aeresSohraImg from '../assets/images/aeres_sohra_1795258637813.jpg';
import aeresNubraImg from '../assets/images/aeres_nubra_1795258637601.jpg';
import aeresHukumImg from '../assets/images/aeres_hukum_1795258637682.jpg';
import apexMirageImg from '../assets/images/apex_mirage_1795258637568.jpg';
import apexHotrodImg from '../assets/images/apex_hotrod_1795258637844.jpg';
import apexArgoImg from '../assets/images/apex_argo_1795258637977.jpg';

export type ProductStyle = 'neutral' | 'colour' | 'stretch';

export interface Product {
  id: string;
  family: 'X Lows' | 'Aeon V2' | 'Aeres' | 'Apex';
  model: string;
  colour: string;
  price: number;
  style: ProductStyle;
  url: string;
  img: string;
}

export const PRODUCTS: Product[] = [
  {
    id: 'xl-chestnut',
    family: 'X Lows',
    model: 'Chestnut',
    colour: 'Brown Black',
    price: 4299,
    style: 'neutral',
    url: 'https://www.wearcomet.com/products/x-lows-chestnut',
    img: 'https://www.wearcomet.com/cdn/shop/files/Lateral_22f541ef-ea81-49b6-ad60-cb3335b871df.jpg?v=1791527660&width=800',
  },
  {
    id: 'xl-cortado',
    family: 'X Lows',
    model: 'Cortado',
    colour: 'Cream Canvas',
    price: 4299,
    style: 'neutral',
    url: 'https://www.wearcomet.com/products/x-lows-cortado',
    img: 'https://www.wearcomet.com/cdn/shop/files/New_Lateral.jpg?v=1791555070&width=800',
  },
  {
    id: 'xl-snow',
    family: 'X Lows',
    model: 'Snow',
    colour: 'Blue Grey',
    price: 4299,
    style: 'neutral',
    url: 'https://www.wearcomet.com/products/x-lows-snow',
    img: 'https://www.wearcomet.com/cdn/shop/files/lateral_d8af82d1-5221-4215-af5a-d2019465ca99_1.jpg?v=1776171588&width=800',
  },
  {
    id: 'aeon-sourbomb',
    family: 'Aeon V2',
    model: 'Sourbomb',
    colour: 'Delta2 Neon Green',
    price: 4499,
    style: 'colour',
    url: 'https://www.wearcomet.com/products/aeon-v2-sourbomb',
    img: 'https://www.wearcomet.com/cdn/shop/files/1_1_ae659e86-2fdf-46e3-bf9c-50068d3dbd91.jpg?v=1794799272&width=800',
  },
  {
    id: 'xl-frostbite',
    family: 'X Lows',
    model: 'Frostbite',
    colour: 'White Denim',
    price: 5299,
    style: 'neutral',
    url: 'https://www.wearcomet.com/products/x-lows-frostbite',
    img: 'https://www.wearcomet.com/cdn/shop/files/Lateral_3b0282c3-4f00-4410-9500-5714536937ef.jpg?v=1794543296&width=800',
  },
  {
    id: 'aeres-oakwood',
    family: 'Aeres',
    model: 'Oakwood',
    colour: 'Aeres Brown White',
    price: 5299,
    style: 'stretch',
    url: 'https://www.wearcomet.com/products/aeres-oakwood',
    img: 'https://www.wearcomet.com/cdn/shop/files/NewLateral_3.jpg?v=1780055689&width=800',
  },
  {
    id: 'aeres-driftwood',
    family: 'Aeres',
    model: 'Driftwood',
    colour: 'Aeres Offwhite Brown',
    price: 5299,
    style: 'stretch',
    url: 'https://www.wearcomet.com/products/aeres-driftwood',
    img: aeresDriftwoodImg,
  },
  {
    id: 'aeres-ziro',
    family: 'Aeres',
    model: 'Ziro',
    colour: 'Patch Beige',
    price: 5499,
    style: 'stretch',
    url: 'https://www.wearcomet.com/products/aeres-ziro',
    img: aeresZiroImg,
  },
  {
    id: 'aeres-sohra',
    family: 'Aeres',
    model: 'Sohra',
    colour: 'Patch Orange',
    price: 5499,
    style: 'stretch',
    url: 'https://www.wearcomet.com/products/aeres-sohra',
    img: aeresSohraImg,
  },
  {
    id: 'aeres-nubra',
    family: 'Aeres',
    model: 'Nubra',
    colour: 'Patch Brown',
    price: 5499,
    style: 'stretch',
    url: 'https://www.wearcomet.com/products/aeres-nubra',
    img: aeresNubraImg,
  },
  {
    id: 'aeres-hukum',
    family: 'Aeres',
    model: 'Hukum Midnight',
    colour: 'Aeres Black Gold',
    price: 5899,
    style: 'stretch',
    url: 'https://www.wearcomet.com/products/aeres-hukum-midnight',
    img: aeresHukumImg,
  },
  {
    id: 'apex-stratos',
    family: 'Apex',
    model: 'Stratos',
    colour: 'Blue Grey',
    price: 6299,
    style: 'stretch',
    url: 'https://www.wearcomet.com/products/apex-stratos',
    img: 'https://www.wearcomet.com/cdn/shop/files/Lateral_1_1_1.jpg?v=1778484411&width=800',
  },
  {
    id: 'apex-mirage',
    family: 'Apex',
    model: 'Mirage',
    colour: 'Beige',
    price: 6299,
    style: 'stretch',
    url: 'https://www.wearcomet.com/products/apex-mirage',
    img: apexMirageImg,
  },
  {
    id: 'apex-hotrod',
    family: 'Apex',
    model: 'Hotrod',
    colour: 'Gradient Red',
    price: 6299,
    style: 'stretch',
    url: 'https://www.wearcomet.com/products/apex-hotrod',
    img: apexHotrodImg,
  },
  {
    id: 'apex-argo',
    family: 'Apex',
    model: 'Argo',
    colour: 'Multi Cream',
    price: 6299,
    style: 'stretch',
    url: 'https://www.wearcomet.com/products/apex-argo',
    img: apexArgoImg,
  },
];

export const PRODUCT_ALT_TEXT: Record<string, string> = {
  'xl-chestnut': 'Comet sneakers X Lows Chestnut, brown and black low-top sneaker',
  'xl-cortado': 'Comet sneakers X Lows Cortado, cream canvas low-top sneaker',
  'xl-snow': 'Comet sneakers X Lows Snow, blue grey low-top sneaker',
  'aeon-sourbomb': 'Comet sneakers Aeon V2 Sourbomb, neon green sneaker',
  'xl-frostbite': 'Comet sneakers X Lows Frostbite, white denim low-top sneaker',
  'aeres-oakwood': 'Comet sneakers Aeres Oakwood, brown and white sneaker',
  'aeres-driftwood': 'Comet sneakers Aeres Driftwood, offwhite and brown sneaker',
  'aeres-ziro': 'Comet sneakers Aeres Ziro, patch beige sneaker',
  'aeres-sohra': 'Comet sneakers Aeres Sohra, patch orange sneaker',
  'aeres-nubra': 'Comet sneakers Aeres Nubra, patch brown sneaker',
  'aeres-hukum': 'Comet sneakers Aeres Hukum Midnight, black and gold sneaker',
  'apex-stratos': 'Comet sneakers Apex Stratos, blue grey sneaker',
  'apex-mirage': 'Comet sneakers Apex Mirage, beige sneaker',
  'apex-hotrod': 'Comet sneakers Apex Hotrod, gradient red sneaker',
  'apex-argo': 'Comet sneakers Apex Argo, multi cream sneaker',
};

export interface SwatchStyle {
  bg: string;
  fg: string;
  sub: string;
}

export const PRODUCT_SWATCH_STYLES: Record<string, SwatchStyle> = {
  'xl-chestnut': { bg: '#3E2E26', fg: '#F6F3EE', sub: '#D7CBC2' },
  'xl-cortado': { bg: '#EAE3D5', fg: '#141414', sub: '#524E48' },
  'xl-snow': { bg: '#DCE2E6', fg: '#141414', sub: '#49525A' },
  'aeon-sourbomb': { bg: '#D6EC5C', fg: '#141414', sub: '#2F3809' },
  'xl-frostbite': { bg: '#ECEAE6', fg: '#141414', sub: '#524E48' },
  'aeres-oakwood': { bg: '#6B4F3B', fg: '#F6F3EE', sub: '#E7DCD4' },
  'aeres-driftwood': { bg: '#E6DFD3', fg: '#141414', sub: '#524E48' },
  'aeres-ziro': { bg: '#DFD5C3', fg: '#141414', sub: '#524E48' },
  'aeres-sohra': { bg: '#D96B38', fg: '#141414', sub: '#2B1308' },
  'aeres-nubra': { bg: '#5C4332', fg: '#F6F3EE', sub: '#E0D5CC' },
  'aeres-hukum': { bg: '#1D1C1A', fg: '#E6C66A', sub: '#D4CFC7' },
  'apex-stratos': { bg: '#CFD8DF', fg: '#141414', sub: '#424D57' },
  'apex-mirage': { bg: '#DDD3C2', fg: '#141414', sub: '#524E48' },
  'apex-hotrod': { bg: '#A62C2B', fg: '#FFFFFF', sub: '#F4D8D8' },
  'apex-argo': { bg: '#ECE6D8', fg: '#141414', sub: '#524E48' },
};

export type OccasionOption =
  | 'College lectures'
  | 'Cafe and weekend outings'
  | 'Long walking days and travel';

export type StyleOption = 'Neutral and clean' | 'Colour pop';

export function formatINR(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function getWhyItFits(family: Product['family'], occasion: OccasionOption): string {
  if (family === 'Aeon V2') {
    return 'Comet describes Aeon V2 as made for a snug fit and all-day wear.';
  }
  switch (occasion) {
    case 'College lectures':
      return 'Comet says SpaceWalk suits everything from the daily commute to house party nights.';
    case 'Cafe and weekend outings':
      return 'A neutral low-top with a roomy toe box for a day of walking and sitting.';
    case 'Long walking days and travel':
      return 'Roomy toe box and a cushioned SpaceWalk sole built for 9AM-to-9PM wear, says Comet.';
  }
}

export interface FaqItem {
  q: string;
  a: string;
  tag?: 'crawl';
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    q: 'What is Comet?',
    a: 'Comet is an Indian sneaker brand based in Bengaluru that sells online at wearcomet.com. Its collections are X Lows, Aeres, Apex and Aeon V2, plus Astra for women. This guide is about the sneaker brand, not the object in space.',
  },
  {
    q: 'What are the best sneakers for college guys?',
    a: "There is no single best pair, but for lectures and walking, pick a low-top you can wear all day. Comet's X Lows start at ₹4,299 and have a roomy toe box and a cushioned SpaceWalk sole. Use the picker above to filter by budget and style.",
  },
  {
    q: 'What kind of shoes do college students wear?',
    a: "Mostly low-top sneakers in neutral colours that go with jeans and joggers. Comet's X Lows Cortado, Snow and Chestnut are neutral colourways, each ₹4,299 on wearcomet.com.",
  },
  {
    q: 'What are the Indian sneaker brands?',
    a: 'Comet is a Bengaluru sneaker brand, run by Grails Marketing Private Limited in Koramangala, with pairs from ₹4,299. Several other Indian brands exist, so compare sole, fit, materials and return policy before you pick.',
  },
  {
    q: 'Which is the cheapest brand of sneakers?',
    a: 'Not Comet. Its lowest price on wearcomet.com is ₹4,299. If your cap is below that, another brand is the honest answer. If you can reach ₹4,299 to ₹4,499, X Lows and Aeon V2 are the two options under ₹5,000.',
  },
  {
    q: 'What shoes is Gen Z wearing?',
    a: 'Trends move fast, so choose by budget, comfort hours and how it goes with your outfits. For under ₹5,000, Comet offers X Lows (₹4,299) in neutral colourways and Aeon V2 Sourbomb (₹4,499) in a bolder colour.',
  },
  {
    q: 'Are sneakers under ₹5,000 good quality?',
    a: "It depends on the pair. Check the sole, upper material, toe room and return policy. Comet's X Lows list a natural rubber outsole and EVA insert. Read owner threads on r/SneakersIndia too, then use the free 7-day returns and exchanges to test the fit.",
  },
  {
    q: 'Do Comet sneakers fit true to size?',
    a: 'Sizes run UK 3 to 12 with a size chart on each page, and the toe box is roomy. Comet advises women to go one size smaller. If the size is off, returns and exchanges are free for 7 days.',
  },
  {
    q: 'Are Comet sneakers comfortable for all-day wear?',
    a: 'Comet designs X Lows with a roomy toe box and a 3-layer SpaceWalk sole (insole, cushioned EVA insert, natural rubber outsole) for 9AM-to-9PM wear. Comfort is personal, so check the size chart and use the free 7-day returns and exchanges if the fit is off.',
  },
  {
    q: 'Which sneakers stay comfortable after 8-10 hours?',
    a: "Look for a roomy toe box, a cushioned midsole and a grippy rubber outsole, then test the fit at home. Comet's X Lows (₹4,299) list all three, and returns and exchanges are free for 7 days if they do not suit your feet.",
  },
  {
    q: 'How do I clean Comet sneakers?',
    a: "Comet's care guide says to clean different materials separately, wipe instead of scrubbing, use a microfiber cloth or soft brush, avoid harsh cleaning liquids and air dry at room temperature. X Lows have suede parts, so keep them away from water.",
  },
  {
    q: 'Does Comet offer free shipping and returns?',
    a: 'Yes, on wearcomet.com: free shipping across India to serviceable PIN codes, usually dispatched within 24 hours and delivered in 3 to 5 days, plus free returns and exchanges up to 7 days from delivery. Check the live policy page before ordering.',
  },
  {
    q: 'What sizes does Comet make?',
    a: "X Lows come in UK 3 to 12. For example, UK 8 fits a 26.5 cm foot on Comet's size chart. Comet advises women to go one size smaller, for example UK 5 instead of UK 6.",
  },
  {
    q: 'Are Comet sneakers made in India?',
    a: 'Comet is a Bengaluru brand run by Grails Marketing Private Limited. The country of origin is listed per pair and not every listing shows the same country, so check the product page for the pair you want before you buy.',
  },
  {
    q: 'Does Comet have sneakers for women under ₹5,000?',
    a: "Comet's women's range on wearcomet.com includes X Lows, Aeres, Astra, Apex and Aeon V2. X Lows are listed from ₹4,299, so check the women's page for the colourway and price you want. Comet advises women to go one size smaller.",
  },
  {
    q: 'Is Comet worth it compared with a discounted Nike or Puma under ₹5,000?',
    a: "Not always. Global brands also sell under ₹5,000, and Comet starts at ₹4,299. Compare sole, fit, materials and return terms. Comet's case is a roomy toe box, a SpaceWalk sole and free 7-day returns, so decide with the size chart in hand.",
  },
  {
    tag: 'crawl',
    q: 'Which sneakers are comfy for walking all day?',
    a: "Comet's X Lows (₹4,299) have a roomy toe box and a 3-layer SpaceWalk sole that Comet designs for 9AM-to-9PM wear. If the fit is off, returns and exchanges are free for 7 days.",
  },
  {
    tag: 'crawl',
    q: 'High-tops or low-tops for a day out in the city?',
    a: "For a crawl with lots of walking and getting in and out of cafes, low-tops are the easier pick. Comet's X Lows are low-tops from ₹4,299, in neutral colourways like Cortado and Snow.",
  },
  {
    tag: 'crawl',
    q: 'What sneakers go with a casual weekend outfit?',
    a: 'Neutral low-tops are the safe choice with jeans, shorts or joggers. X Lows Cortado (cream canvas), Snow and Chestnut are ₹4,299 each, and Aeon V2 Sourbomb (₹4,499) adds a colour pop.',
  },
];

export const QUICK_ANSWER_TEXT =
  "For a Sunday café crawl in Mumbai, wear a light canvas low-top you can walk in for hours. Comet's X Lows Cortado (cream canvas, ₹4,299) has a roomy toe box and a cushioned SpaceWalk sole. Start with a croffle at The Croffle Guys in Santacruz, Girgaon Chowpatty, Matunga, Kurla or Lokhandwala, then keep going.";

export const CROFFLE_LOCATIONS = [
  'Santacruz',
  'Girgaon Chowpatty',
  'Kurla',
  'Lokhandwala',
  'Matunga',
];
