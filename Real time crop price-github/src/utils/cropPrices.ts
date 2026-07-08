// Comprehensive crop prices for all Tamil Nadu districts (₹ per quintal)
// All 37 districts with complete coverage for all South Indian crops

const allDistricts = [
  "Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem",
  "Thanjavur", "Erode", "Tirunelveli", "Tiruppur", "Vellore",
  "Thoothukudi", "Dindigul", "Kanchipuram", "Kanniyakumari", "Cuddalore",
  "Nagapattinam", "Karur", "Pudukkottai", "Namakkal", "Sivaganga",
  "Virudhunagar", "Ramanathapuram", "Dharmapuri", "Krishnagiri", "Ariyalur",
  "Perambalur", "Nilgiris", "Theni", "Villupuram", "Tiruvannamalai",
  "Tiruvallur", "Ranipet", "Tirupattur", "Chengalpattu", "Kallakurichi",
  "Tenkasi", "Mayiladuthurai"
];

// Helper function to generate district prices with variation
const generateDistrictPrices = (baseMin: number, baseModal: number, baseMax: number) => {
  const prices: Record<string, { min: number; modal: number; max: number }> = {};
  allDistricts.forEach((district, index) => {
    const variance = (index % 10) * 10 - 25; // Creates variation between districts
    prices[district] = {
      min: Math.round(baseMin + variance),
      modal: Math.round(baseModal + variance),
      max: Math.round(baseMax + variance)
    };
  });
  return prices;
};

export const mockPrices: Record<string, Record<string, { min: number; modal: number; max: number }>> = {
  // Grains & Cereals
  "Rice": generateDistrictPrices(1800, 2000, 2200),
  "Paddy": generateDistrictPrices(1850, 2050, 2250),
  "Maize": generateDistrictPrices(1700, 1900, 2100),
  "Jowar": generateDistrictPrices(2200, 2500, 2800),
  "Bajra": generateDistrictPrices(2100, 2400, 2700),
  "Ragi": generateDistrictPrices(3200, 3600, 4000),
  "Millets": generateDistrictPrices(3000, 3400, 3800),
  
  // Pulses
  "Red Gram": generateDistrictPrices(6500, 7000, 7500),
  "Green Gram": generateDistrictPrices(7000, 7500, 8000),
  "Black Gram": generateDistrictPrices(6800, 7300, 7800),
  "Bengal Gram": generateDistrictPrices(5000, 5500, 6000),
  "Horse Gram": generateDistrictPrices(4500, 5000, 5500),
  
  // Oil Seeds & Cash Crops
  "Groundnut": generateDistrictPrices(5400, 5800, 6200),
  "Sunflower": generateDistrictPrices(5800, 6200, 6600),
  "Sesame": generateDistrictPrices(9500, 10500, 11500),
  "Coconut": generateDistrictPrices(2800, 3200, 3600),
  "Cotton": generateDistrictPrices(5800, 6200, 6600),
  "Sugarcane": generateDistrictPrices(2800, 3100, 3400),
  
  // Spices
  "Turmeric": generateDistrictPrices(7500, 8500, 9500),
  "Chilli": generateDistrictPrices(8500, 9500, 10500),
  "Coriander": generateDistrictPrices(6000, 6500, 7000),
  "Ginger": generateDistrictPrices(4500, 5000, 5500),
  "Garlic": generateDistrictPrices(3500, 4000, 4500),
  "Cardamom": generateDistrictPrices(120000, 140000, 160000),
  "Black Pepper": generateDistrictPrices(45000, 50000, 55000),
  
  // Vegetables
  "Tomato": generateDistrictPrices(800, 1200, 1600),
  "Potato": generateDistrictPrices(900, 1100, 1300),
  "Onion": generateDistrictPrices(1300, 1600, 1900),
  "Brinjal": generateDistrictPrices(1500, 1800, 2100),
  "Bhendi": generateDistrictPrices(2000, 2400, 2800),
  "Drumstick": generateDistrictPrices(3500, 4000, 4500),
  
  // Fruits
  "Banana": generateDistrictPrices(1200, 1500, 1800),
  "Mango": generateDistrictPrices(3000, 3500, 4000),
  "Papaya": generateDistrictPrices(1500, 1800, 2100),
  "Tamarind": generateDistrictPrices(6000, 6500, 7000)
};
