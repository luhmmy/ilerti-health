export interface MealPlan {
  id: string;
  name: string;
  macros: {
    protein: string;
    carbs: string;
    fats: string;
    fiber: string;
    calories: number;
  };
  tips: string;
  suitability: string[];
}

export const nutritionPlans: MealPlan[] = [
  {
    id: "meal_1",
    name: "Akara & Oat Porridge",
    macros: { protein: "15g", carbs: "45g", fats: "12g", fiber: "8g", calories: 350 },
    tips: "Use minimal oil when frying Akara, or air-fry for a healthier option. Use unsweetened oats.",
    suitability: ["Low-GI for blood sugar management", "General Wellness"]
  },
  {
    id: "meal_2",
    name: "Moi-Moi with Garden Salad",
    macros: { protein: "20g", carbs: "30g", fats: "10g", fiber: "10g", calories: 290 },
    tips: "Prepare Moi-Moi with mackerel or boiled egg inside. Serve with a fresh side salad with vinaigrette.",
    suitability: ["Weight Loss", "DASH diet for hypertension", "High Protein"]
  },
  {
    id: "meal_3",
    name: "Efo Riro with Grilled Mackerel",
    macros: { protein: "35g", carbs: "15g", fats: "22g", fiber: "7g", calories: 420 },
    tips: "Use locust beans (iru) for natural flavoring instead of stock cubes. Keep oil usage low. Serve without swallow for low-carb.",
    suitability: ["Keto/Low-carb", "DASH diet for hypertension", "Post-partum recovery"]
  },
  {
    id: "meal_4",
    name: "Unripe Plantain Pottage with Spinach",
    macros: { protein: "18g", carbs: "55g", fats: "8g", fiber: "12g", calories: 380 },
    tips: "Rich in iron. Add scent leaf (effirin) and spinach just before taking off heat to preserve nutrients.",
    suitability: ["Diabetic Friendly", "High Iron", "Digestive Health"]
  },
  {
    id: "meal_5",
    name: "Brown Rice with Chicken Breast & Steamed Veggies",
    macros: { protein: "40g", carbs: "50g", fats: "10g", fiber: "6g", calories: 450 },
    tips: "Portion control the rice to 1 cup. Load up on steamed carrots, green beans, and bell peppers.",
    suitability: ["Muscle Building", "General Wellness"]
  },
  {
    id: "meal_6",
    name: "Okra Soup with Lean Goat Meat",
    macros: { protein: "30g", carbs: "10g", fats: "15g", fiber: "5g", calories: 320 },
    tips: "Okra is great for blood sugar control. Use lean cuts of goat meat. Pair with a small portion of oat swallow or wheat.",
    suitability: ["Low-GI for blood sugar management", "Joint Health"]
  },
  {
    id: "meal_7",
    name: "Yam & Garden Egg Sauce",
    macros: { protein: "12g", carbs: "60g", fats: "18g", fiber: "14g", calories: 410 },
    tips: "Garden egg is high in fiber and antioxidants. Boil the yam instead of frying. Use smoked fish in the sauce.",
    suitability: ["High Fiber", "Heart Health"]
  }
];
