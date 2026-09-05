export type HealthConditionKey =
  | "general"
  | "diabetes"
  | "hypertension"
  | "weight_loss"
  | "pregnancy"
  | "ulcer"
  | "kidney"
  | "muscle";

export interface MealItem {
  id: string;
  name: string;
  category: "breakfast" | "snack_morning" | "lunch" | "snack_afternoon" | "dinner";
  time: string;
  calories: number;
  protein: string;
  carbs: string;
  fats: string;
  fiber: string;
  estimatedCostNgn: number;
  ingredients: string[];
  tips: string;
  healthTags: string[];
  conditions: HealthConditionKey[];
}

export interface DaySchedule {
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
  meals: MealItem[];
  totalCalories: number;
  totalCostNgn: number;
}

export interface ConditionDietProfile {
  key: HealthConditionKey;
  label: string;
  shortDesc: string;
  icon: string;
  clinicalGuideline: string;
  recommendedFoods: string[];
  foodsToLimit: string[];
  calorieTargetRange: string;
}

export const HEALTH_CONDITION_PROFILES: Record<HealthConditionKey, ConditionDietProfile> = {
  general: {
    key: "general",
    label: "General Healthy Living",
    shortDesc: "Balanced Nigerian diet for vitality, steady energy and disease prevention.",
    icon: "🥗",
    clinicalGuideline: "Focuses on whole grains, local leafy vegetables (Ugwu, Waterleaf, Spinach), lean fish, and minimal ultra-processed seasonings.",
    recommendedFoods: ["Oatmeal & Akara", "Unripe Plantain", "Efo Riro with Fish", "Garden Eggs", "Brown Beans", "Moi-Moi", "Grilled Titus"],
    foodsToLimit: ["Refined white bread", "Excess fried foods (puff-puff, deep-fried meat)", "Sugary sodas & malt drinks"],
    calorieTargetRange: "1,800 - 2,200 kcal/day"
  },
  diabetes: {
    key: "diabetes",
    label: "Diabetes & Blood Sugar Control",
    shortDesc: "Low-glycemic index (GI) meals designed to prevent insulin spikes and stabilize HbA1c.",
    icon: "🩸",
    clinicalGuideline: "Emphasizes slow-digesting carbs, high soluble fiber, and proteins with zero added sugars or refined starches.",
    recommendedFoods: ["Unripe Plantain Pottage", "Brown Beans with Vegetable Sauce", "Oat Swallow with Okra & Fish", "Moi-Moi with Boiled Egg", "Bitterleaf Soup"],
    foodsToLimit: ["Pounded yam", "White rice & stew with excess oil", "Soft drinks", "Garri / Eba in large portions", "Sweetened condensed milk"],
    calorieTargetRange: "1,500 - 1,800 kcal/day"
  },
  hypertension: {
    key: "hypertension",
    label: "Hypertension & Heart Health (DASH/Low Sodium)",
    shortDesc: "Potassium-rich, low-sodium meals to lower blood pressure and protect cardiac function.",
    icon: "❤️",
    clinicalGuideline: "Limits bouillon cubes/monosodium glutamate; utilizes locust beans (iru), garlic, and ginger for natural umami. High in Omega-3 fish and green leaves.",
    recommendedFoods: ["Efo Riro cooked with Iru (no extra salt)", "Grilled Mackerel / Salmon", "Boiled Sweet Potatoes with Spinach", "Avocado & Tomato Salad", "Zobo (unsweetened, with ginger & cloves)"],
    foodsToLimit: ["Commercial stock cubes in high amounts", "Salted dried fish", "Corned beef / sausages", "Instant noodles", "Excess palm oil"],
    calorieTargetRange: "1,600 - 2,000 kcal/day"
  },
  weight_loss: {
    key: "weight_loss",
    label: "Weight Loss & Healthy Metabolism",
    shortDesc: "Calorie-controlled, high-protein and high-fiber meals to promote fat loss while preserving lean muscle.",
    icon: "⚖️",
    clinicalGuideline: "Generous portions of nutrient-dense vegetables, steamed preparations, controlled carb portions (1/2 cup swallow max), and lean meats.",
    recommendedFoods: ["Steamed Moi-Moi with Garden Salad", "Vegetable Soup with Goat Meat (no swallow)", "Air-fried / Boiled Plantain with Egg White", "Chicken Breast Pepper Soup", "Cucumber & Roasted Groundnuts"],
    foodsToLimit: ["Large bowls of Semo / Fufu", "Fried dodo in deep palm oil", "Heavy mayonnaise dressings", "Pastries & meat pies"],
    calorieTargetRange: "1,400 - 1,700 kcal/day"
  },
  pregnancy: {
    key: "pregnancy",
    label: "Maternal & Pregnancy Nutrition",
    shortDesc: "Folate, iron, calcium, and DHA-packed meals for maternal health and fetal development.",
    icon: "🤰",
    clinicalGuideline: "High nutrient density to support maternal blood volume, placental growth, and baby's neural tube development without excessive refined sugar.",
    recommendedFoods: ["Ugwu (Fluted Pumpkin) Soup with Beef Liver", "Boiled Yam with Eggs and Garden Egg Sauce", "Mackerel Fish (DHA)", "Fortified Oat Porridge with Milk", "Fresh Oranges & Papaya"],
    foodsToLimit: ["Uncooked / raw seafood", "Unpasteurized dairy", "Excess caffeine (more than 1 cup/day)", "High-mercury shark / king mackerel"],
    calorieTargetRange: "2,200 - 2,500 kcal/day"
  },
  ulcer: {
    key: "ulcer",
    label: "Ulcer & Acid Reflux / Gastric Care",
    shortDesc: "Soothing, non-acidic, mildly seasoned meals that promote gastric mucosal healing.",
    icon: "🛡️",
    clinicalGuideline: "Avoids harsh peppers (atarodo/habanero), fried oils, and high acid; prioritizes boiled tubers, mild oatmeal, cabbage juice/soups, and lean proteins.",
    recommendedFoods: ["Boiled Sweet Potatoes & Steamed Fish", "Oat Porridge with Banana", "Mild Okra Soup with Boiled Chicken", "Pap (Akamu) with Soya Bean Milk", "Steamed Pumpkin Porridge"],
    foodsToLimit: ["Excess scotch bonnet pepper (ata rodo)", "Fried oily foods", "Tomatoes & citrus in empty stomach", "Carbonated drinks", "Alcohol & coffee"],
    calorieTargetRange: "1,700 - 2,100 kcal/day"
  },
  kidney: {
    key: "kidney",
    label: "Kidney Care & Renal Support",
    shortDesc: "Balanced potassium, phosphorus, and high-biological-value protein to ease renal workload.",
    icon: "🫘",
    clinicalGuideline: "Carefully controlled protein portions, low sodium, leached root vegetables when needed, and non-acidic hydration.",
    recommendedFoods: ["White Rice with Leached Cabbage & Steamed Egg", "Boiled Yam with Light Vegetable Sauce", "Apple & Cucumber Slices", "Clear Fish Broth with Ginger", "Light Oat Porridge"],
    foodsToLimit: ["High-sodium canned soups", "Dark sodas containing phosphoric acid", "Excess beef/red meat", "High-potassium banana/oranges in advanced CKD"],
    calorieTargetRange: "1,600 - 1,900 kcal/day"
  },
  muscle: {
    key: "muscle",
    label: "High Protein & Fitness / Muscle Gain",
    shortDesc: "High protein (130g+ daily), complex carbs, and healthy fats for workout recovery and muscle synthesis.",
    icon: "💪",
    clinicalGuideline: "Combines local high-protein staples (eggs, chicken breast, cow leg, tilapia, beans, soya milk) with clean complex carbohydrates.",
    recommendedFoods: ["4-Egg Omelette with Whole Wheat Toast", "Brown Rice & Grilled Chicken Breast (250g)", "Double Moi-Moi with Titus Fish", "Greek Yogurt or Soya Milk with Nuts", "Beans Pottage with Grilled Fish"],
    foodsToLimit: ["Empty calorie junk foods", "Sugary pastries", "Deep fried snacks"],
    calorieTargetRange: "2,400 - 3,000 kcal/day"
  }
};

// Comprehensive Nigerian Meal Master Database
export const NIGERIAN_MEAL_DATABASE: MealItem[] = [
  // BREAKFASTS
  {
    id: "bf_1",
    name: "Akara (3 pcs) & Warm Oat Porridge",
    category: "breakfast",
    time: "7:30 AM",
    calories: 360,
    protein: "16g",
    carbs: "46g",
    fats: "12g",
    fiber: "8g",
    estimatedCostNgn: 850,
    ingredients: ["Brown beans (1/2 cup)", "Rolled oats (1/2 cup)", "Onions", "Groundnut oil (1 tbsp)", "Ginger"],
    tips: "Fry Akara in shallow heart-healthy oil. Sweeten oats with a dash of cinnamon or fresh milk rather than refined sugar.",
    healthTags: ["Low GI", "Heart Friendly", "Vegetarian"],
    conditions: ["general", "diabetes", "hypertension", "weight_loss", "ulcer"]
  },
  {
    id: "bf_2",
    name: "Boiled Yam (2 slices) with Garden Egg & Mackerel Sauce",
    category: "breakfast",
    time: "7:30 AM",
    calories: 420,
    protein: "22g",
    carbs: "58g",
    fats: "11g",
    fiber: "10g",
    estimatedCostNgn: 1200,
    ingredients: ["Pona yam (2 medium slices)", "Garden eggs (4 pcs)", "Smoked mackerel (1/2 fish)", "Red onions", "Olive oil (1 tbsp)"],
    tips: "Boil the yam till tender. Garden egg sauce is rich in bioflavonoids that protect vascular endothelium.",
    healthTags: ["High Fiber", "Potassium Rich", "Maternal Care"],
    conditions: ["general", "hypertension", "pregnancy", "muscle"]
  },
  {
    id: "bf_3",
    name: "Pap (Akamu / Ogi) with Moi-Moi & Boiled Egg",
    category: "breakfast",
    time: "7:30 AM",
    calories: 380,
    protein: "24g",
    carbs: "48g",
    fats: "9g",
    fiber: "7g",
    estimatedCostNgn: 1100,
    ingredients: ["Fermented yellow corn pap", "Steamed bean pudding (Moi-Moi)", "1 Hard-boiled egg", "Ginger spice"],
    tips: "Akamu is easy on the gastric lining. The boiled egg and Moi-Moi supply steady amino acids.",
    healthTags: ["Digestive Ease", "High Protein", "Ulcer Safe"],
    conditions: ["general", "ulcer", "pregnancy", "muscle", "kidney"]
  },
  {
    id: "bf_4",
    name: "3-Egg Veggie Scramble with Boiled Sweet Potato",
    category: "breakfast",
    time: "7:30 AM",
    calories: 390,
    protein: "26g",
    carbs: "42g",
    fats: "13g",
    fiber: "6g",
    estimatedCostNgn: 1050,
    ingredients: ["3 Eggs (2 whites, 1 whole)", "Orange-fleshed sweet potato (1 medium)", "Spinach / Ugwu", "Bell peppers", "Onions"],
    tips: "Orange sweet potatoes are packed with Beta-Carotene (Vitamin A) and have a lower glycemic impact than white potatoes.",
    healthTags: ["High Protein", "Low GI", "Eye Health"],
    conditions: ["general", "diabetes", "weight_loss", "muscle"]
  },
  {
    id: "bf_5",
    name: "Unsweetened Greek Yogurt / Soya Milk Bowl with Banana & Cashews",
    category: "breakfast",
    time: "7:30 AM",
    calories: 340,
    protein: "20g",
    carbs: "38g",
    fats: "12g",
    fiber: "5g",
    estimatedCostNgn: 1400,
    ingredients: ["Plain unsweetened yogurt or rich soya milk (250ml)", "1 Small banana", "Roasted cashew nuts (20g)", "Chia seeds"],
    tips: "Provides excellent probiotics for gut microbiome diversity and sustained morning alertness.",
    healthTags: ["Probiotic", "Quick Prep", "Brain Food"],
    conditions: ["general", "ulcer", "pregnancy", "muscle"]
  },

  // MID-MORNING SNACKS
  {
    id: "snk_1",
    name: "Fresh Garden Eggs (2 pcs) with Groundnut Dip",
    category: "snack_morning",
    time: "10:30 AM",
    calories: 120,
    protein: "5g",
    carbs: "12g",
    fats: "6g",
    fiber: "4g",
    estimatedCostNgn: 300,
    ingredients: ["Garden eggs (2 medium)", "Roasted groundnut paste (1 tsp)"],
    tips: "Zero sugar snack that curbs hunger and provides essential polyphenols.",
    healthTags: ["Diabetic Snack", "Zero Cholesterol"],
    conditions: ["general", "diabetes", "hypertension", "weight_loss"]
  },
  {
    id: "snk_2",
    name: "Sliced Cucumber & 1 Boiled Egg",
    category: "snack_morning",
    time: "10:30 AM",
    calories: 95,
    protein: "7g",
    carbs: "3g",
    fats: "5g",
    fiber: "2g",
    estimatedCostNgn: 350,
    ingredients: ["1 Cucumber", "1 Boiled egg", "Pinch of black pepper"],
    tips: "High hydration (96% water) combined with leucine from egg white for metabolic satiety.",
    healthTags: ["Weight Loss", "Ultra Low Carb"],
    conditions: ["general", "diabetes", "weight_loss", "hypertension"]
  },
  {
    id: "snk_3",
    name: "Fresh Pawpaw (Papaya) Slices with Lime Squeeze",
    category: "snack_morning",
    time: "10:30 AM",
    calories: 110,
    protein: "2g",
    carbs: "25g",
    fats: "0g",
    fiber: "4g",
    estimatedCostNgn: 400,
    ingredients: ["Fresh ripe pawpaw (1 bowl)", "Juice of 1/2 lime"],
    tips: "Rich in papain enzyme which assists enzymatic protein breakdown and soothes irritable bowel.",
    healthTags: ["Digestive Enzyme", "Vitamin C"],
    conditions: ["general", "ulcer", "pregnancy"]
  },

  // LUNCH
  {
    id: "ln_1",
    name: "Unripe Plantain Pottage with Ugwu Leaves & Smoked Titus",
    category: "lunch",
    time: "1:30 PM",
    calories: 450,
    protein: "28g",
    carbs: "54g",
    fats: "13g",
    fiber: "11g",
    estimatedCostNgn: 1500,
    ingredients: ["Unripe plantain (2 fingers)", "Ugwu leaves (1 bunch)", "Smoked Titus / Mackerel", "Iru (locust beans)", "Scent leaf"],
    tips: "Top-tier meal for blood sugar stabilization and blood building. Rich in non-heme iron and magnesium.",
    healthTags: ["Diabetic Superfood", "Iron Rich", "Low GI"],
    conditions: ["general", "diabetes", "hypertension", "pregnancy", "weight_loss"]
  },
  {
    id: "ln_2",
    name: "Steamed Moi-Moi Elegushi with Crunchy Cabbage-Carrot Salad",
    category: "lunch",
    time: "1:30 PM",
    calories: 380,
    protein: "25g",
    carbs: "34g",
    fats: "14g",
    fiber: "12g",
    estimatedCostNgn: 1300,
    ingredients: ["Brown beans puree", "Eggs (1)", "Shredded cabbage (1 cup)", "Grated carrot (1/2 cup)", "Vinaigrette (olive oil + lime)"],
    tips: "A very filling meal with low caloric density. Excellent for cardiovascular lipid management.",
    healthTags: ["High Fiber", "DASH Approved", "Weight Loss"],
    conditions: ["general", "diabetes", "hypertension", "weight_loss", "muscle"]
  },
  {
    id: "ln_3",
    name: "Ofada Brown Rice (1 cup) with Ayamase Stew (Low Oil) & Boiled Egg / Beef",
    category: "lunch",
    time: "1:30 PM",
    calories: 490,
    protein: "32g",
    carbs: "62g",
    fats: "12g",
    fiber: "7g",
    estimatedCostNgn: 1800,
    ingredients: ["Unpolished Ofada rice (1 cup cooked)", "Green bell peppers", "Lean beef (100g)", "Boiled egg", "Locust beans (iru)"],
    tips: "Ofada rice retains its germ and bran, supplying essential B-complex vitamins and minerals that polished rice lacks.",
    healthTags: ["Whole Grain", "High Energy", "Muscle Fuel"],
    conditions: ["general", "muscle", "pregnancy"]
  },
  {
    id: "ln_4",
    name: "Okra & Spinach Soup with Fresh Croaker Fish & Small Oat Swallow",
    category: "lunch",
    time: "1:30 PM",
    calories: 410,
    protein: "36g",
    carbs: "32g",
    fats: "12g",
    fiber: "9g",
    estimatedCostNgn: 1650,
    ingredients: ["Fresh chopped okra (1 cup)", "Spinach (1 cup)", "Croaker fish (1 large steak)", "Rolled oats blended for swallow (40g)", "Crayfish"],
    tips: "Okra mucilage binds bile acids and excess glucose in the intestine, reducing cholesterol absorption.",
    healthTags: ["Low Cholesterol", "Diabetic Safe", "Joint Health"],
    conditions: ["general", "diabetes", "hypertension", "ulcer", "kidney"]
  },
  {
    id: "ln_5",
    name: "Efo Riro (Vegetable Medley) with Grilled Chicken Breast (No Swallow)",
    category: "lunch",
    time: "1:30 PM",
    calories: 360,
    protein: "42g",
    carbs: "14g",
    fats: "14g",
    fiber: "8g",
    estimatedCostNgn: 1900,
    ingredients: ["Fresh shoko / spinach (2 bunches)", "Grilled chicken breast (200g)", "Crayfish", "Red bell peppers", "Locust beans"],
    tips: "Strict low-carb, high-protein powerhouse. Delivers massive micronutrients with minimal insulin load.",
    healthTags: ["Keto Friendly", "High Protein", "Lean Muscle"],
    conditions: ["general", "diabetes", "weight_loss", "muscle"]
  },

  // AFTERNOON SNACKS
  {
    id: "snk_4",
    name: "Roasted Cashew Nuts (30g) & Zobo Infusion",
    category: "snack_afternoon",
    time: "4:30 PM",
    calories: 170,
    protein: "6g",
    carbs: "10g",
    fats: "12g",
    fiber: "3g",
    estimatedCostNgn: 500,
    ingredients: ["Roasted cashews (30g)", "Hibiscus sabdariffa (Zobo) cold brew with ginger and cloves (no sugar)"],
    tips: "Zobo calyces have clinically demonstrated ACE-inhibitor properties that support optimal systolic blood pressure.",
    healthTags: ["Blood Pressure Friendly", "Antioxidant"],
    conditions: ["general", "hypertension", "diabetes", "muscle"]
  },
  {
    id: "snk_5",
    name: "Tiger Nut (Ofio) & Date Milk Smoothie",
    category: "snack_afternoon",
    time: "4:30 PM",
    calories: 190,
    protein: "4g",
    carbs: "28g",
    fats: "7g",
    fiber: "6g",
    estimatedCostNgn: 600,
    ingredients: ["Fresh tiger nuts (Ofio)", "2 Dried dates", "Coconuts (10g)", "Filtered water"],
    tips: "Rich in prebiotic resistant starch which nourishes beneficial Bifidobacteria and Lactobacillus in the gut.",
    healthTags: ["Prebiotic", "Natural Energy", "Dairy Free"],
    conditions: ["general", "ulcer", "pregnancy", "muscle"]
  },

  // DINNER
  {
    id: "dn_1",
    name: "Catfish / Tilapia Pepper Soup with Boiled Sweet Corn",
    category: "dinner",
    time: "7:00 PM",
    calories: 340,
    protein: "34g",
    carbs: "26g",
    fats: "9g",
    fiber: "5g",
    estimatedCostNgn: 1600,
    ingredients: ["Fresh catfish or tilapia steak (200g)", "Pepper soup spices (Ehuru, Uda, Uziza)", "Boiled sweet corn (1/2 cob)", "Scent leaf"],
    tips: "Uziza and Uda have potent anti-inflammatory properties. Light on the stomach for deep, restorative sleep.",
    healthTags: ["Anti-inflammatory", "Light Dinner", "Omega-3"],
    conditions: ["general", "hypertension", "weight_loss", "muscle"]
  },
  {
    id: "dn_2",
    name: "Edikang Ikong / Vegetable Pottage with Grilled Fish & Sliced Boiled Plantain",
    category: "dinner",
    time: "7:00 PM",
    calories: 390,
    protein: "30g",
    carbs: "38g",
    fats: "13g",
    fiber: "9g",
    estimatedCostNgn: 1750,
    ingredients: ["Waterleaf & Ugwu leaves", "Grilled Mackerel (150g)", "Boiled half-ripe plantain (1 medium)", "Crayfish"],
    tips: "Rich in magnesium and potassium which relax vascular smooth muscle and prepare the body for nocturnal repair.",
    healthTags: ["Rich Minerals", "Cardio Shield", "Maternal Care"],
    conditions: ["general", "hypertension", "pregnancy", "diabetes"]
  },
  {
    id: "dn_3",
    name: "Mild Goat Meat Pepper Soup with Boiled Irish Potatoes",
    category: "dinner",
    time: "7:00 PM",
    calories: 370,
    protein: "31g",
    carbs: "35g",
    fats: "11g",
    fiber: "4g",
    estimatedCostNgn: 1800,
    ingredients: ["Lean goat meat (150g)", "Irish potatoes (2 small, boiled)", "Nutmeg, ginger, garlic", "Effirin (scent leaf)"],
    tips: "Goat meat contains less saturated fat and cholesterol than beef or chicken with skin, providing pure bioavailable iron.",
    healthTags: ["Lean Meat", "Ulcer Friendly (mild)", "Iron Dense"],
    conditions: ["general", "ulcer", "muscle", "pregnancy"]
  },
  {
    id: "dn_4",
    name: "Brown Beans & Sweet Corn Pottage with Steamed Greens",
    category: "dinner",
    time: "7:00 PM",
    calories: 420,
    protein: "22g",
    carbs: "62g",
    fats: "8g",
    fiber: "14g",
    estimatedCostNgn: 1100,
    ingredients: ["Nigerian brown beans (Oloyin)", "Sweet corn kernels", "Palm oil (1 tsp only)", "Ugwu / Spinach side", "Onions"],
    tips: "High in prebiotic oligosaccharides. The high fiber slows gastric emptying, preventing midnight hunger pangs.",
    healthTags: ["High Fiber", "Plant Protein", "Satiety"],
    conditions: ["general", "diabetes", "weight_loss", "hypertension"]
  }
];

// Generates a complete 7-day Nigerian meal timetable tailored by health condition and budget
export function generateWeeklyTimetable(
  condition: HealthConditionKey = "general",
  budgetTier: "economy" | "standard" | "premium" = "standard",
  period: "weekly" | "monthly" = "weekly"
): DaySchedule[] {
  const days: DaySchedule["day"][] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const filtered = NIGERIAN_MEAL_DATABASE.filter((m) => m.conditions.includes(condition));
  const pool = filtered.length >= 6 ? filtered : NIGERIAN_MEAL_DATABASE;

  const breakfasts = pool.filter((m) => m.category === "breakfast");
  const morningSnacks = pool.filter((m) => m.category === "snack_morning");
  const lunches = pool.filter((m) => m.category === "lunch");
  const afternoonSnacks = pool.filter((m) => m.category === "snack_afternoon");
  const dinners = pool.filter((m) => m.category === "dinner");

  // Budget multiplier (economy prioritizes beans, eggs, local greens; premium includes salmon, tiger nuts, avocados)
  const budgetMultiplier = budgetTier === "economy" ? 0.8 : budgetTier === "premium" ? 1.35 : 1.0;

  return days.map((day, dayIndex) => {
    const bf = breakfasts[dayIndex % breakfasts.length] || breakfasts[0];
    const snk1 = morningSnacks[dayIndex % morningSnacks.length] || morningSnacks[0];
    const ln = lunches[dayIndex % lunches.length] || lunches[0];
    const snk2 = afternoonSnacks[dayIndex % afternoonSnacks.length] || afternoonSnacks[0];
    const dn = dinners[dayIndex % dinners.length] || dinners[0];

    const meals: MealItem[] = [
      { ...bf, estimatedCostNgn: Math.round(bf.estimatedCostNgn * budgetMultiplier) },
      { ...snk1, estimatedCostNgn: Math.round(snk1.estimatedCostNgn * budgetMultiplier) },
      { ...ln, estimatedCostNgn: Math.round(ln.estimatedCostNgn * budgetMultiplier) },
      { ...snk2, estimatedCostNgn: Math.round(snk2.estimatedCostNgn * budgetMultiplier) },
      { ...dn, estimatedCostNgn: Math.round(dn.estimatedCostNgn * budgetMultiplier) },
    ];

    const totalCalories = meals.reduce((sum, m) => sum + m.calories, 0);
    const totalCostNgn = meals.reduce((sum, m) => sum + m.estimatedCostNgn, 0);

    return {
      day,
      meals,
      totalCalories,
      totalCostNgn,
    };
  });
}

// Generate Nigerian Market Grocery Shopping List based on generated timetable
export interface GroceryItem {
  category: "Proteins & Dairy" | "Grains & Tubers" | "Vegetables & Greens" | "Healthy Oils & Spices" | "Snacks & Fruits";
  name: string;
  quantity: string;
  estimatedPriceNgn: number;
}

export function generateGroceryList(weeklyTimetable: DaySchedule[], period: "weekly" | "monthly" = "weekly"): GroceryItem[] {
  const multiplier = period === "monthly" ? 4 : 1;

  return [
    { category: "Proteins & Dairy", name: "Fresh / Smoked Titus (Mackerel)", quantity: `${2 * multiplier} kg`, estimatedPriceNgn: 4500 * multiplier },
    { category: "Proteins & Dairy", name: "Crate of Fresh Eggs", quantity: `${1 * multiplier} Crate`, estimatedPriceNgn: 4800 * multiplier },
    { category: "Proteins & Dairy", name: "Lean Chicken Breast or Goat Meat", quantity: `${1.5 * multiplier} kg`, estimatedPriceNgn: 5500 * multiplier },
    { category: "Proteins & Dairy", name: "Nigerian Brown Beans (Oloyin)", quantity: `${2 * multiplier} mudu`, estimatedPriceNgn: 3200 * multiplier },
    
    { category: "Grains & Tubers", name: "Rolled Oats (Unsweetened)", quantity: `${1 * multiplier} Tin (500g)`, estimatedPriceNgn: 2200 * multiplier },
    { category: "Grains & Tubers", name: "Unripe Plantain", quantity: `${1 * multiplier} bunch (8 fingers)`, estimatedPriceNgn: 2800 * multiplier },
    { category: "Grains & Tubers", name: "Pona Yam Tubers", quantity: `${2 * multiplier} medium tubers`, estimatedPriceNgn: 3600 * multiplier },
    { category: "Grains & Tubers", name: "Orange Sweet Potatoes", quantity: `${1 * multiplier} basket`, estimatedPriceNgn: 2000 * multiplier },
    { category: "Grains & Tubers", name: "Ofada Brown Rice", quantity: `${2 * multiplier} derica`, estimatedPriceNgn: 3000 * multiplier },

    { category: "Vegetables & Greens", name: "Fresh Ugwu (Fluted Pumpkin) Leaves", quantity: `${4 * multiplier} bunches`, estimatedPriceNgn: 1200 * multiplier },
    { category: "Vegetables & Greens", name: "Fresh Okra", quantity: `${1 * multiplier} medium bowl`, estimatedPriceNgn: 1000 * multiplier },
    { category: "Vegetables & Greens", name: "Waterleaf & Spinach", quantity: `${3 * multiplier} bunches`, estimatedPriceNgn: 900 * multiplier },
    { category: "Vegetables & Greens", name: "Garden Eggs (White/Green)", quantity: `${1 * multiplier} bowl`, estimatedPriceNgn: 800 * multiplier },
    { category: "Vegetables & Greens", name: "Fresh Tomatoes, Tatashe & Onions", quantity: `${1 * multiplier} basket`, estimatedPriceNgn: 3500 * multiplier },

    { category: "Healthy Oils & Spices", name: "Locust Beans (Iru Woro)", quantity: `${2 * multiplier} wraps`, estimatedPriceNgn: 500 * multiplier },
    { category: "Healthy Oils & Spices", name: "Pure Canola / Groundnut Oil", quantity: `${1 * multiplier} Litre`, estimatedPriceNgn: 3200 * multiplier },
    { category: "Healthy Oils & Spices", name: "Crayfish & Pepper Soup Spices (Ehuru, Uda)", quantity: `${1 * multiplier} pack`, estimatedPriceNgn: 1500 * multiplier },

    { category: "Snacks & Fruits", name: "Raw / Roasted Cashew Nuts & Groundnuts", quantity: `${250 * multiplier} g`, estimatedPriceNgn: 2000 * multiplier },
    { category: "Snacks & Fruits", name: "Fresh Papaya (Pawpaw) & Cucumbers", quantity: `${2 * multiplier} units`, estimatedPriceNgn: 1500 * multiplier },
    { category: "Snacks & Fruits", name: "Dry Zobo Leaves & Ginger", quantity: `${1 * multiplier} cup`, estimatedPriceNgn: 600 * multiplier },
  ];
}

