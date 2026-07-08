import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Sprout, MapPin, TrendingUp } from "lucide-react";
import { translations, cropTranslations, districtTranslations, type Language } from "@/utils/translations";

const crops = [
  "Tomato", "Onion", "Potato", "Coconut", "Banana", "Paddy", 
  "Groundnut", "Cotton", "Sugarcane", "Turmeric", "Chillies",
  "Brinjal", "Cabbage", "Cauliflower", "Beans", "Carrot",
  "Ladies Finger", "Drumstick", "Beetroot", "Radish", "Ginger",
  "Garlic", "Coriander", "Curry Leaves", "Green Peas", "Capsicum",
  "Bitter Gourd", "Bottle Gourd", "Ridge Gourd", "Snake Gourd", "Pumpkin",
  "Ash Gourd", "Cucumber", "Cluster Beans", "French Beans", "Tapioca", "Yam"
];

const tamilNaduDistricts = [
  "Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem",
  "Tirunelveli", "Tiruppur", "Erode", "Vellore", "Thoothukudi",
  "Thanjavur", "Dindigul", "Kanchipuram", "Kanniyakumari", "Cuddalore",
  "Nagapattinam", "Karur", "Pudukkottai", "Namakkal", "Sivaganga",
  "Virudhunagar", "Ramanathapuram", "Dharmapuri", "Krishnagiri", "Ariyalur",
  "Perambalur", "Nilgiris", "Theni", "Villupuram", "Tiruvannamalai",
  "Tiruvallur", "Ranipet", "Tirupattur", "Chengalpattu", "Kallakurichi",
  "Tenkasi", "Mayiladuthurai"
];

const Index = () => {
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("en");
  const [selectedCrop, setSelectedCrop] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");

  const t = translations[selectedLanguage];
  const getCropName = (crop: string) => cropTranslations[selectedLanguage][crop] || crop;
  const getDistrictName = (district: string) => districtTranslations[selectedLanguage][district] || district;

  const handleAnalyze = () => {
    if (selectedCrop && selectedDistrict) {
      navigate(`/analysis?crop=${encodeURIComponent(selectedCrop)}&district=${encodeURIComponent(selectedDistrict)}&lang=${selectedLanguage}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sprout className="h-8 w-8 text-primary" />
              <h1 className="text-xl md:text-2xl font-bold text-foreground">
                {t.appTitle}
              </h1>
            </div>
            
            {/* Language Selector */}
            <Select value={selectedLanguage} onValueChange={(value) => setSelectedLanguage(value as Language)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ta">தமிழ்</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi">हिंदी</SelectItem>
                <SelectItem value="ml">മലയാളം</SelectItem>
                <SelectItem value="te">తెలుగు</SelectItem>
                <SelectItem value="kn">ಕನ್ನಡ</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-2xl">
        <Card className="p-8 shadow-lg">
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-foreground">{t.selectCropDistrict}</h2>
              <p className="text-muted-foreground">{t.realTimePricesDesc}</p>
            </div>

            {/* Crop Selection */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Sprout className="h-4 w-4 text-primary" />
                {t.selectCrop}
              </label>
              <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder={t.chooseCrop} />
                </SelectTrigger>
                <SelectContent>
                  {crops.map((crop) => (
                    <SelectItem key={crop} value={crop}>
                      {getCropName(crop)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* District Selection */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                {t.selectDistrict}
              </label>
              <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder={t.chooseDistrict} />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {tamilNaduDistricts.map((district) => (
                    <SelectItem key={district} value={district}>
                      {getDistrictName(district)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Analyze Button */}
            <Button 
              onClick={handleAnalyze}
              disabled={!selectedCrop || !selectedDistrict}
              className="w-full h-12 text-base"
            >
              <TrendingUp className="mr-2 h-5 w-5" />
              {t.viewPriceAnalysis}
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Index;
