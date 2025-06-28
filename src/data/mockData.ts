import { Food, Exercise } from '../types';

export const FOOD_LIBRARY = [
  {
    category: 'Protein',
    foods: [
      { name: 'Chicken Breast', details: '165 cal/100g', protein: 31, carbs: 0, fat: 3.6, calories: 165 },
      { name: 'Turkey Breast', details: '135 cal/100g', protein: 30, carbs: 0, fat: 1, calories: 135 },
      { name: 'Lean Beef', details: '217 cal/100g', protein: 26, carbs: 0, fat: 11, calories: 217 },
      { name: 'Beef Mince (Regular)', details: '250 cal/100g', protein: 21, carbs: 0, fat: 18, calories: 250 },
      { name: 'Beef Mince (Lean)', details: '170 cal/100g', protein: 26, carbs: 0, fat: 7, calories: 170 },
      { name: 'Lamb Chop', details: '282 cal/100g', protein: 25, carbs: 0, fat: 20, calories: 282 },
      { name: 'Pork Loin', details: '195 cal/100g', protein: 27, carbs: 0, fat: 8, calories: 195 },
      { name: 'Pork Belly', details: '518 cal/100g', protein: 9.3, carbs: 0, fat: 53, calories: 518 },
      { name: 'Duck Breast', details: '195 cal/100g', protein: 27, carbs: 0, fat: 8, calories: 195 },
      { name: 'Eggs', details: '143 cal/100g', protein: 13, carbs: 1.1, fat: 10, calories: 143 },
      { name: 'Egg Whites', details: '52 cal/100g', protein: 11, carbs: 0.7, fat: 0.2, calories: 52 },
      { name: 'Egg Yolk', details: '322 cal/100g', protein: 16, carbs: 3.6, fat: 27, calories: 322 },
      { name: 'Salmon', details: '208 cal/100g', protein: 20, carbs: 0, fat: 13, calories: 208 },
      { name: 'Atlantic Salmon (raw)', details: '208 cal/100g', protein: 20, carbs: 0, fat: 13, calories: 208 },
      { name: 'Tuna (Fresh)', details: '132 cal/100g', protein: 28, carbs: 0, fat: 1, calories: 132 },
      { name: 'Tuna (Canned in Oil)', details: '198 cal/100g', protein: 25, carbs: 0, fat: 8.2, calories: 198 },
      { name: 'Barramundi', details: '110 cal/100g', protein: 21, carbs: 0, fat: 2, calories: 110 },
      { name: 'Sardines (Canned in Oil)', details: '208 cal/100g', protein: 25, carbs: 0, fat: 11, calories: 208 },
      { name: 'Hoki (Blue Grenadier)', details: '88 cal/100g', protein: 17.7, carbs: 0, fat: 1.2, calories: 88 },
      { name: 'Tofu (Firm)', details: '76 cal/100g', protein: 8, carbs: 1.9, fat: 4.8, calories: 76 },
      { name: 'Tempeh', details: '193 cal/100g', protein: 19, carbs: 9.4, fat: 11, calories: 193 },
      { name: 'Edamame', details: '122 cal/100g', protein: 11, carbs: 10, fat: 5, calories: 122 },
      { name: 'Seitan', details: '370 cal/100g', protein: 75, carbs: 14, fat: 1.9, calories: 370 },
      { name: 'Textured Vegetable Protein (TVP)', details: '332 cal/100g', protein: 52, carbs: 24, fat: 1.2, calories: 332 },
      { name: 'Cottage Cheese (Low-Fat)', details: '72 cal/100g', protein: 12, carbs: 3, fat: 1, calories: 72 },
      { name: 'Greek Yogurt', details: '59 cal/100g', protein: 10, carbs: 3.6, fat: 0.4, calories: 59 },
      { name: 'Skim Milk Powder', details: '357 cal/100g', protein: 36, carbs: 52, fat: 1, calories: 357 },
      { name: 'Whey Protein (Isolate)', details: '360 cal/100g', protein: 85, carbs: 4, fat: 1, calories: 360 },
      { name: 'Casein Protein', details: '350 cal/100g', protein: 80, carbs: 6, fat: 1, calories: 350 },
      { name: 'Lentils (Cooked)', details: '116 cal/100g', protein: 9, carbs: 20, fat: 0.4, calories: 116 },
      { name: 'Chickpeas (Cooked)', details: '164 cal/100g', protein: 9, carbs: 27, fat: 2.6, calories: 164 },
      { name: 'Kidney Beans (Cooked)', details: '127 cal/100g', protein: 8.7, carbs: 22.8, fat: 0.5, calories: 127 },
      { name: 'Black Beans (Cooked)', details: '132 cal/100g', protein: 8.9, carbs: 23.7, fat: 0.5, calories: 132 },
      { name: 'Prawns', details: '99 cal/100g', protein: 24, carbs: 0.2, fat: 0.3, calories: 99 },
      { name: 'Kangaroo', details: '98 cal/100g', protein: 22, carbs: 0, fat: 1, calories: 98 },
      { name: 'Emu', details: '120 cal/100g', protein: 22.3, carbs: 0, fat: 2.7, calories: 120 },
      { name: 'Duck Eggs', details: '185 cal/100g', protein: 13, carbs: 1.4, fat: 14, calories: 185 }
    ]
  },
  {
    category: 'Carbohydrates',
    foods: [
      { name: 'Brown Rice', details: '111 cal/100g', protein: 2.6, carbs: 23, fat: 0.9, calories: 111 },
      { name: 'White Rice', details: '130 cal/100g', protein: 2.7, carbs: 28, fat: 0.3, calories: 130 },
      { name: 'Basmati Rice', details: '121 cal/100g', protein: 3.5, carbs: 25, fat: 0.4, calories: 121 },
      { name: 'Jasmine Rice', details: '129 cal/100g', protein: 2.9, carbs: 28, fat: 0.3, calories: 129 },
      { name: 'Wild Rice', details: '101 cal/100g', protein: 4, carbs: 21, fat: 0.3, calories: 101 },
      { name: 'Quinoa', details: '120 cal/100g', protein: 4.1, carbs: 21, fat: 1.9, calories: 120 },
      { name: 'Millet', details: '119 cal/100g', protein: 3.5, carbs: 23.7, fat: 1, calories: 119 },
      { name: 'Buckwheat (Cooked)', details: '92 cal/100g', protein: 3.4, carbs: 19.9, fat: 0.6, calories: 92 },
      { name: 'Rolled Oats', details: '389 cal/100g', protein: 16.9, carbs: 66, fat: 6.9, calories: 389 },
      { name: 'Steel-Cut Oats', details: '375 cal/100g', protein: 12.5, carbs: 67, fat: 7, calories: 375 },
      { name: 'Muesli', details: '350 cal/100g', protein: 8, carbs: 70, fat: 7, calories: 350 },
      { name: 'Weet-Bix', details: '357 cal/100g', protein: 12, carbs: 70, fat: 1.3, calories: 357 },
      { name: 'Wholemeal Bread', details: '247 cal/100g', protein: 13, carbs: 41, fat: 4.2, calories: 247 },
      { name: 'White Bread', details: '265 cal/100g', protein: 9, carbs: 49, fat: 3.2, calories: 265 },
      { name: 'Rye Bread', details: '259 cal/100g', protein: 8.5, carbs: 48.3, fat: 3.3, calories: 259 },
      { name: 'Multigrain Bread', details: '254 cal/100g', protein: 10, carbs: 42, fat: 4.2, calories: 254 },
      { name: 'Sourdough Bread', details: '238 cal/100g', protein: 8.1, carbs: 47.3, fat: 0.6, calories: 238 },
      { name: 'Pasta (Cooked)', details: '131 cal/100g', protein: 5, carbs: 25, fat: 1.1, calories: 131 },
      { name: 'Brown Pasta (Cooked)', details: '124 cal/100g', protein: 5.1, carbs: 25.3, fat: 0.9, calories: 124 },
      { name: 'Rice Noodles', details: '108 cal/100g', protein: 1.6, carbs: 25, fat: 0.2, calories: 108 },
      { name: 'Udon Noodles', details: '127 cal/100g', protein: 2.8, carbs: 25.6, fat: 0.2, calories: 127 },
      { name: 'Sweet Potato', details: '86 cal/100g', protein: 1.6, carbs: 20, fat: 0.1, calories: 86 },
      { name: 'Potato', details: '77 cal/100g', protein: 2, carbs: 17, fat: 0.1, calories: 77 },
      { name: 'Purple Sweet Potato', details: '90 cal/100g', protein: 1.5, carbs: 21, fat: 0.1, calories: 90 },
      { name: 'Pumpkin', details: '26 cal/100g', protein: 1, carbs: 6.5, fat: 0.1, calories: 26 },
      { name: 'Corn (Cooked)', details: '96 cal/100g', protein: 3.4, carbs: 21, fat: 1.5, calories: 96 },
      { name: 'Polenta', details: '73 cal/100g', protein: 1.5, carbs: 16, fat: 0.2, calories: 73 },
      { name: 'Banana', details: '89 cal/100g', protein: 1.1, carbs: 23, fat: 0.3, calories: 89 },
      { name: 'Apple', details: '52 cal/100g', protein: 0.3, carbs: 14, fat: 0.2, calories: 52 },
      { name: 'Pear', details: '57 cal/100g', protein: 0.4, carbs: 15, fat: 0.1, calories: 57 },
      { name: 'Carrot', details: '41 cal/100g', protein: 0.9, carbs: 10, fat: 0.2, calories: 41 },
      { name: 'Beetroot', details: '43 cal/100g', protein: 1.6, carbs: 10, fat: 0.2, calories: 43 }
    ]
  },
  {
    category: 'Vegetables',
    foods: [
      { name: 'Broccoli', details: '34 cal/100g', protein: 2.8, carbs: 7, fat: 0.4, calories: 34 },
      { name: 'Cauliflower', details: '25 cal/100g', protein: 1.9, carbs: 5, fat: 0.3, calories: 25 },
      { name: 'Cabbage', details: '25 cal/100g', protein: 1.3, carbs: 6, fat: 0.1, calories: 25 },
      { name: 'Brussels Sprouts', details: '43 cal/100g', protein: 3.4, carbs: 9, fat: 0.3, calories: 43 },
      { name: 'Spinach', details: '23 cal/100g', protein: 2.9, carbs: 3.6, fat: 0.4, calories: 23 },
      { name: 'Silverbeet', details: '19 cal/100g', protein: 1.8, carbs: 3.7, fat: 0.2, calories: 19 },
      { name: 'Carrot', details: '41 cal/100g', protein: 0.9, carbs: 10, fat: 0.2, calories: 41 },
      { name: 'Parsnip', details: '75 cal/100g', protein: 1.2, carbs: 18, fat: 0.3, calories: 75 },
      { name: 'Pumpkin', details: '26 cal/100g', protein: 1, carbs: 6.5, fat: 0.1, calories: 26 },
      { name: 'Sweet Potato', details: '86 cal/100g', protein: 1.6, carbs: 20, fat: 0.1, calories: 86 },
      { name: 'Green Beans', details: '31 cal/100g', protein: 1.8, carbs: 7, fat: 0.1, calories: 31 },
      { name: 'Snow Peas', details: '42 cal/100g', protein: 2.8, carbs: 7.5, fat: 0.2, calories: 42 },
      { name: 'Peas', details: '81 cal/100g', protein: 5.4, carbs: 14, fat: 0.4, calories: 81 },
      { name: 'Cucumber', details: '16 cal/100g', protein: 0.7, carbs: 3.6, fat: 0.1, calories: 16 },
      { name: 'Zucchini', details: '17 cal/100g', protein: 1.2, carbs: 3.1, fat: 0.3, calories: 17 },
      { name: 'Tomato', details: '18 cal/100g', protein: 0.9, carbs: 3.9, fat: 0.2, calories: 18 },
      { name: 'Capsicum (Red)', details: '31 cal/100g', protein: 1, carbs: 6, fat: 0.3, calories: 31 },
      { name: 'Capsicum (Green)', details: '20 cal/100g', protein: 0.9, carbs: 4.6, fat: 0.2, calories: 20 },
      { name: 'Eggplant', details: '25 cal/100g', protein: 1, carbs: 6, fat: 0.2, calories: 25 },
      { name: 'Mushrooms', details: '22 cal/100g', protein: 3.1, carbs: 3.3, fat: 0.3, calories: 22 },
      { name: 'Asparagus', details: '20 cal/100g', protein: 2.2, carbs: 3.9, fat: 0.1, calories: 20 },
      { name: 'Onion', details: '40 cal/100g', protein: 1.1, carbs: 9.3, fat: 0.1, calories: 40 },
      { name: 'Leek', details: '61 cal/100g', protein: 1.5, carbs: 14, fat: 0.3, calories: 61 },
      { name: 'Garlic', details: '149 cal/100g', protein: 6.4, carbs: 33, fat: 0.5, calories: 149 }
    ]
  },
  {
    category: 'Fruits',
    foods: [
      { name: 'Banana', details: '89 cal/100g', protein: 1.1, carbs: 23, fat: 0.3, calories: 89 },
      { name: 'Apple', details: '52 cal/100g', protein: 0.3, carbs: 14, fat: 0.2, calories: 52 },
      { name: 'Orange', details: '47 cal/100g', protein: 0.9, carbs: 12, fat: 0.1, calories: 47 },
      { name: 'Mandarin', details: '53 cal/100g', protein: 0.8, carbs: 13, fat: 0.3, calories: 53 },
      { name: 'Blueberries', details: '57 cal/100g', protein: 0.7, carbs: 14, fat: 0.3, calories: 57 },
      { name: 'Raspberries', details: '52 cal/100g', protein: 1.2, carbs: 12, fat: 0.7, calories: 52 },
      { name: 'Strawberries', details: '32 cal/100g', protein: 0.7, carbs: 7.7, fat: 0.3, calories: 32 },
      { name: 'Grapes', details: '69 cal/100g', protein: 0.7, carbs: 18, fat: 0.2, calories: 69 },
      { name: 'Pineapple', details: '50 cal/100g', protein: 0.5, carbs: 13, fat: 0.1, calories: 50 },
      { name: 'Pear', details: '57 cal/100g', protein: 0.4, carbs: 15, fat: 0.1, calories: 57 },
      { name: 'Kiwi', details: '61 cal/100g', protein: 1.1, carbs: 15, fat: 0.5, calories: 61 },
      { name: 'Mango', details: '60 cal/100g', protein: 0.8, carbs: 15, fat: 0.4, calories: 60 },
      { name: 'Watermelon', details: '30 cal/100g', protein: 0.6, carbs: 8, fat: 0.2, calories: 30 },
      { name: 'Rockmelon (Cantaloupe)', details: '34 cal/100g', protein: 0.8, carbs: 8, fat: 0.2, calories: 34 },
      { name: 'Passionfruit', details: '97 cal/100g', protein: 2.2, carbs: 23, fat: 0.4, calories: 97 },
      { name: 'Lychee', details: '66 cal/100g', protein: 0.8, carbs: 17, fat: 0.4, calories: 66 },
      { name: 'Papaya', details: '43 cal/100g', protein: 0.5, carbs: 11, fat: 0.3, calories: 43 },
      { name: 'Avocado', details: '160 cal/100g', protein: 2, carbs: 9, fat: 15, calories: 160 },
      { name: 'Plum', details: '46 cal/100g', protein: 0.7, carbs: 11, fat: 0.3, calories: 46 },
      { name: 'Peach', details: '39 cal/100g', protein: 0.9, carbs: 10, fat: 0.3, calories: 39 }
    ]
  },
  {
    category: 'Dairy',
    foods: [
      { name: 'Greek Yogurt', details: '59 cal/100g', protein: 10, carbs: 3.6, fat: 0.4, calories: 59 },
      { name: 'Milk, Full Cream', details: '61 cal/100g', protein: 3.2, carbs: 4.7, fat: 3.3, calories: 61 },
      { name: 'Milk, Skim', details: '34 cal/100g', protein: 3.4, carbs: 5, fat: 0.1, calories: 34 },
      { name: 'Milk, Soy', details: '54 cal/100g', protein: 3.3, carbs: 6, fat: 1.8, calories: 54 },
      { name: 'Milk, Almond', details: '15 cal/100g', protein: 0.6, carbs: 0.3, fat: 1.2, calories: 15 },
      { name: 'Cottage Cheese', details: '98 cal/100g', protein: 11, carbs: 3.4, fat: 4.3, calories: 98 },
      { name: 'Ricotta', details: '174 cal/100g', protein: 11, carbs: 3, fat: 13, calories: 174 },
      { name: 'Cheddar Cheese', details: '402 cal/100g', protein: 25, carbs: 1.3, fat: 33, calories: 402 },
      { name: 'Mozzarella', details: '280 cal/100g', protein: 18, carbs: 2.2, fat: 21, calories: 280 },
      { name: 'Feta', details: '264 cal/100g', protein: 14, carbs: 4, fat: 21, calories: 264 },
      { name: 'Blue Cheese', details: '353 cal/100g', protein: 21, carbs: 2.3, fat: 29, calories: 353 },
      { name: 'Parmesan', details: '431 cal/100g', protein: 38, carbs: 4, fat: 29, calories: 431 },
      { name: 'Cream Cheese', details: '342 cal/100g', protein: 6, carbs: 4, fat: 34, calories: 342 },
      { name: 'Yogurt, Plain', details: '59 cal/100g', protein: 3.5, carbs: 4.7, fat: 2.5, calories: 59 },
      { name: 'Ice Cream', details: '207 cal/100g', protein: 3.5, carbs: 24, fat: 11, calories: 207 },
      { name: 'Butter', details: '717 cal/100g', protein: 0.9, carbs: 0.1, fat: 81, calories: 717 }
    ]
  },
  {
    category: 'Nuts & Seeds',
    foods: [
      { name: 'Almonds', details: '579 cal/100g', protein: 21, carbs: 22, fat: 50, calories: 579 },
      { name: 'Peanuts', details: '567 cal/100g', protein: 26, carbs: 16, fat: 49, calories: 567 },
      { name: 'Chia Seeds', details: '486 cal/100g', protein: 17, carbs: 42, fat: 31, calories: 486 },
      { name: 'Flax Seeds', details: '534 cal/100g', protein: 18, carbs: 29, fat: 42, calories: 534 },
      { name: 'Sunflower Seeds', details: '584 cal/100g', protein: 21, carbs: 20, fat: 52, calories: 584 },
      { name: 'Pumpkin Seeds', details: '559 cal/100g', protein: 19, carbs: 11, fat: 49, calories: 559 },
      { name: 'Walnuts', details: '654 cal/100g', protein: 15, carbs: 14, fat: 65, calories: 654 },
      { name: 'Cashews', details: '553 cal/100g', protein: 18, carbs: 30, fat: 44, calories: 553 },
      { name: 'Pistachios', details: '562 cal/100g', protein: 20, carbs: 28, fat: 45, calories: 562 },
      { name: 'Macadamia Nuts', details: '718 cal/100g', protein: 8, carbs: 14, fat: 76, calories: 718 },
      { name: 'Brazil Nuts', details: '659 cal/100g', protein: 14, carbs: 12, fat: 67, calories: 659 },
      { name: 'Hazelnuts', details: '628 cal/100g', protein: 15, carbs: 17, fat: 61, calories: 628 },
      { name: 'Pine Nuts', details: '673 cal/100g', protein: 14, carbs: 13, fat: 68, calories: 673 }
    ]
  },
  {
    category: 'Fats & Oils',
    foods: [
      { name: 'Olive Oil', details: '884 cal/100g', protein: 0, carbs: 0, fat: 100, calories: 884 },
      { name: 'Extra Virgin Olive Oil', details: '884 cal/100g', protein: 0, carbs: 0, fat: 100, calories: 884 },
      { name: 'Butter', details: '717 cal/100g', protein: 0.9, carbs: 0.1, fat: 81, calories: 717 },
      { name: 'Ghee', details: '900 cal/100g', protein: 0, carbs: 0, fat: 100, calories: 900 },
      { name: 'Coconut Oil', details: '892 cal/100g', protein: 0, carbs: 0, fat: 100, calories: 892 },
      { name: 'Canola Oil', details: '884 cal/100g', protein: 0, carbs: 0, fat: 100, calories: 884 },
      { name: 'Rice Bran Oil', details: '884 cal/100g', protein: 0, carbs: 0, fat: 100, calories: 884 },
      { name: 'Avocado', details: '160 cal/100g', protein: 2, carbs: 9, fat: 15, calories: 160 },
      { name: 'Sesame Oil', details: '884 cal/100g', protein: 0, carbs: 0, fat: 100, calories: 884 },
      { name: 'Peanut Oil', details: '884 cal/100g', protein: 0, carbs: 0, fat: 100, calories: 884 }
    ]
  },
  {
    category: 'Legumes & Pulses',
    foods: [
      { name: 'Lentils (Cooked)', details: '116 cal/100g', protein: 9, carbs: 20, fat: 0.4, calories: 116 },
      { name: 'Chickpeas (Cooked)', details: '164 cal/100g', protein: 9, carbs: 27, fat: 2.6, calories: 164 },
      { name: 'Black Beans (Cooked)', details: '132 cal/100g', protein: 8.9, carbs: 23.7, fat: 0.5, calories: 132 },
      { name: 'Kidney Beans (Cooked)', details: '127 cal/100g', protein: 8.7, carbs: 22.8, fat: 0.5, calories: 127 },
      { name: 'Navy Beans (Cooked)', details: '140 cal/100g', protein: 8.2, carbs: 26, fat: 0.5, calories: 140 },
      { name: 'Soybeans (Cooked)', details: '173 cal/100g', protein: 16.6, carbs: 9.9, fat: 9, calories: 173 },
      { name: 'Split Peas (Cooked)', details: '118 cal/100g', protein: 8.3, carbs: 21, fat: 0.4, calories: 118 },
      { name: 'Mung Beans (Cooked)', details: '105 cal/100g', protein: 7, carbs: 19, fat: 0.4, calories: 105 }
    ]
  }
];

export const mockFoods: Food[] = [
  {
    id: '1',
    name: 'Chicken Breast',
    caloriesPer100g: 165,
    proteinPer100g: 31,
    carbsPer100g: 0,
    fatPer100g: 3.6,
    category: 'Protein'
  },
  {
    id: '2',
    name: 'Brown Rice',
    caloriesPer100g: 111,
    proteinPer100g: 2.6,
    carbsPer100g: 23,
    fatPer100g: 0.9,
    category: 'Grains'
  },
  {
    id: '3',
    name: 'Broccoli',
    caloriesPer100g: 34,
    proteinPer100g: 2.8,
    carbsPer100g: 7,
    fatPer100g: 0.4,
    category: 'Vegetables'
  },
  {
    id: '4',
    name: 'Banana',
    caloriesPer100g: 89,
    proteinPer100g: 1.1,
    carbsPer100g: 23,
    fatPer100g: 0.3,
    category: 'Fruits'
  },
  {
    id: '5',
    name: 'Greek Yogurt',
    caloriesPer100g: 59,
    proteinPer100g: 10,
    carbsPer100g: 3.6,
    fatPer100g: 0.4,
    category: 'Dairy'
  },
  {
    id: '6',
    name: 'Almonds',
    caloriesPer100g: 579,
    proteinPer100g: 21,
    carbsPer100g: 22,
    fatPer100g: 50,
    category: 'Nuts'
  }
];

// Convert FOOD_LIBRARY to mockFoods format and merge
const libraryFoods: Food[] = FOOD_LIBRARY.flatMap((category, categoryIndex) =>
  category.foods.map((food, foodIndex) => ({
    id: `lib-${categoryIndex}-${foodIndex}`,
    name: food.name,
    caloriesPer100g: food.calories,
    proteinPer100g: food.protein,
    carbsPer100g: food.carbs,
    fatPer100g: food.fat,
    category: category.category
  }))
);

// Merge library foods with existing mockFoods, avoiding duplicates
export const allMockFoods: Food[] = [
  ...mockFoods,
  ...libraryFoods.filter(libFood => 
    !mockFoods.some(mockFood => 
      mockFood.name.toLowerCase() === libFood.name.toLowerCase()
    )
  )
];

export const mockExercises: Exercise[] = [
  // Chest Exercises
  {
    id: '1',
    name: 'Push-ups',
    category: 'Bodyweight',
    muscleGroups: ['Chest', 'Triceps', 'Shoulders']
  },
  {
    id: '2',
    name: 'Squats',
    category: 'Bodyweight',
    muscleGroups: ['Quadriceps', 'Glutes', 'Hamstrings']
  },
  {
    id: '3',
    name: 'Bench Press',
    category: 'Strength',
    muscleGroups: ['Chest', 'Triceps', 'Shoulders'],
    equipment: 'Barbell'
  },
  {
    id: '4',
    name: 'Deadlift',
    category: 'Strength',
    muscleGroups: ['Back', 'Glutes', 'Hamstrings'],
    equipment: 'Barbell'
  },
  {
    id: '11',
    name: 'Bent-over Row',
    category: 'Strength',
    muscleGroups: ['Back', 'Biceps'],
    equipment: 'Barbell'
  },
  {
    id: '12',
    name: 'Lat Pulldown',
    category: 'Strength',
    muscleGroups: ['Back', 'Biceps'],
    equipment: 'Cable Machine'
  },
  {
    id: '13',
    name: 'T-Bar Row',
    category: 'Strength',
    muscleGroups: ['Back', 'Biceps'],
    equipment: 'T-Bar'
  },
  {
    id: '14',
    name: 'Seated Cable Row',
    category: 'Strength',
    muscleGroups: ['Back', 'Biceps'],
    equipment: 'Cable Machine'
  },
  {
    id: '15',
    name: 'Face Pulls',
    category: 'Strength',
    muscleGroups: ['Back', 'Shoulders'],
    equipment: 'Cable Machine'
  },

  // Leg Exercises
  {
    id: '2',
    name: 'Squats',
    category: 'Bodyweight',
    muscleGroups: ['Quadriceps', 'Glutes', 'Hamstrings']
  },
  {
    id: '16',
    name: 'Back Squat',
    category: 'Strength',
    muscleGroups: ['Quadriceps', 'Glutes', 'Hamstrings'],
    equipment: 'Barbell'
  },
  {
    id: '17',
    name: 'Front Squat',
    category: 'Strength',
    muscleGroups: ['Quadriceps', 'Core'],
    equipment: 'Barbell'
  },
  {
    id: '18',
    name: 'Bulgarian Split Squats',
    category: 'Bodyweight',
    muscleGroups: ['Quadriceps', 'Glutes']
  },
  {
    id: '19',
    name: 'Lunges',
    category: 'Bodyweight',
    muscleGroups: ['Quadriceps', 'Glutes', 'Hamstrings']
  },
  {
    id: '20',
    name: 'Romanian Deadlift',
    category: 'Strength',
    muscleGroups: ['Hamstrings', 'Glutes'],
    equipment: 'Barbell'
  },
  {
    id: '21',
    name: 'Leg Press',
    category: 'Strength',
    muscleGroups: ['Quadriceps', 'Glutes'],
    equipment: 'Machine'
  },
  {
    id: '22',
    name: 'Leg Curls',
    category: 'Strength',
    muscleGroups: ['Hamstrings'],
    equipment: 'Machine'
  },
  {
    id: '23',
    name: 'Leg Extensions',
    category: 'Strength',
    muscleGroups: ['Quadriceps'],
    equipment: 'Machine'
  },
  {
    id: '24',
    name: 'Calf Raises',
    category: 'Strength',
    muscleGroups: ['Calves'],
    equipment: 'Dumbbells'
  },
  {
    id: '25',
    name: 'Hip Thrusts',
    category: 'Strength',
    muscleGroups: ['Glutes', 'Hamstrings'],
    equipment: 'Barbell'
  },

  // Shoulder Exercises
  {
    id: '26',
    name: 'Overhead Press',
    category: 'Strength',
    muscleGroups: ['Shoulders', 'Triceps'],
    equipment: 'Barbell'
  },
  {
    id: '27',
    name: 'Dumbbell Shoulder Press',
    category: 'Strength',
    muscleGroups: ['Shoulders', 'Triceps'],
    equipment: 'Dumbbells'
  },
  {
    id: '28',
    name: 'Lateral Raises',
    category: 'Strength',
    muscleGroups: ['Shoulders'],
    equipment: 'Dumbbells'
  },
  {
    id: '29',
    name: 'Front Raises',
    category: 'Strength',
    muscleGroups: ['Shoulders'],
    equipment: 'Dumbbells'
  },
  {
    id: '30',
    name: 'Rear Delt Flyes',
    category: 'Strength',
    muscleGroups: ['Shoulders'],
    equipment: 'Dumbbells'
  },
  {
    id: '31',
    name: 'Arnold Press',
    category: 'Strength',
    muscleGroups: ['Shoulders', 'Triceps'],
    equipment: 'Dumbbells'
  },
  {
    id: '32',
    name: 'Pike Push-ups',
    category: 'Bodyweight',
    muscleGroups: ['Shoulders', 'Triceps']
  },

  // Arm Exercises
  {
    id: '33',
    name: 'Bicep Curls',
    category: 'Strength',
    muscleGroups: ['Biceps'],
    equipment: 'Dumbbells'
  },
  {
    id: '34',
    name: 'Hammer Curls',
    category: 'Strength',
    muscleGroups: ['Biceps', 'Forearms'],
    equipment: 'Dumbbells'
  },
  {
    id: '35',
    name: 'Tricep Dips',
    category: 'Bodyweight',
    muscleGroups: ['Triceps']
  },
  {
    id: '36',
    name: 'Tricep Extensions',
    category: 'Strength',
    muscleGroups: ['Triceps'],
    equipment: 'Dumbbells'
  },
  {
    id: '37',
    name: 'Close-Grip Bench Press',
    category: 'Strength',
    muscleGroups: ['Triceps', 'Chest'],
    equipment: 'Barbell'
  },
  {
    id: '38',
    name: 'Preacher Curls',
    category: 'Strength',
    muscleGroups: ['Biceps'],
    equipment: 'Barbell'
  },
  {
    id: '39',
    name: 'Cable Tricep Pushdowns',
    category: 'Strength',
    muscleGroups: ['Triceps'],
    equipment: 'Cable Machine'
  },

  // Core Exercises
  {
    id: '40',
    name: 'Plank',
    category: 'Bodyweight',
    muscleGroups: ['Core']
  },
  {
    id: '41',
    name: 'Crunches',
    category: 'Bodyweight',
    muscleGroups: ['Core']
  },
  {
    id: '42',
    name: 'Russian Twists',
    category: 'Bodyweight',
    muscleGroups: ['Core']
  },
  {
    id: '43',
    name: 'Mountain Climbers',
    category: 'Bodyweight',
    muscleGroups: ['Core', 'Legs']
  },
  {
    id: '44',
    name: 'Dead Bug',
    category: 'Bodyweight',
    muscleGroups: ['Core']
  },
  {
    id: '45',
    name: 'Bicycle Crunches',
    category: 'Bodyweight',
    muscleGroups: ['Core']
  },
  {
    id: '46',
    name: 'Leg Raises',
    category: 'Bodyweight',
    muscleGroups: ['Core']
  },
  {
    id: '47',
    name: 'Side Plank',
    category: 'Bodyweight',
    muscleGroups: ['Core']
  },
  {
    id: '48',
    name: 'Hanging Knee Raises',
    category: 'Bodyweight',
    muscleGroups: ['Core']
  },

  // Cardio Exercises
  {
    id: '5',
    name: 'Running',
    category: 'Cardio',
    muscleGroups: ['Legs', 'Core']
  },
  {
    id: '49',
    name: 'Cycling',
    category: 'Cardio',
    muscleGroups: ['Legs']
  },
  {
    id: '50',
    name: 'Swimming',
    category: 'Cardio',
    muscleGroups: ['Full Body']
  },
  {
    id: '51',
    name: 'Rowing',
    category: 'Cardio',
    muscleGroups: ['Back', 'Legs', 'Core'],
    equipment: 'Rowing Machine'
  },
  {
    id: '52',
    name: 'Burpees',
    category: 'Cardio',
    muscleGroups: ['Full Body']
  },
  {
    id: '53',
    name: 'Jumping Jacks',
    category: 'Cardio',
    muscleGroups: ['Full Body']
  },
  {
    id: '54',
    name: 'High Knees',
    category: 'Cardio',
    muscleGroups: ['Legs', 'Core']
  },
  {
    id: '55',
    name: 'Jump Rope',
    category: 'Cardio',
    muscleGroups: ['Legs', 'Core'],
    equipment: 'Jump Rope'
  },

  // Functional/Olympic Exercises
  {
    id: '56',
    name: 'Clean and Press',
    category: 'Olympic',
    muscleGroups: ['Full Body'],
    equipment: 'Barbell'
  },
  {
    id: '57',
    name: 'Snatch',
    category: 'Olympic',
    muscleGroups: ['Full Body'],
    equipment: 'Barbell'
  },
  {
    id: '58',
    name: 'Thrusters',
    category: 'Functional',
    muscleGroups: ['Legs', 'Shoulders'],
    equipment: 'Dumbbells'
  },
  {
    id: '59',
    name: 'Kettlebell Swings',
    category: 'Functional',
    muscleGroups: ['Glutes', 'Core', 'Shoulders'],
    equipment: 'Kettlebell'
  },
  {
    id: '60',
    name: 'Turkish Get-ups',
    category: 'Functional',
    muscleGroups: ['Full Body'],
    equipment: 'Kettlebell'
  },
  {
    id: '61',
    name: 'Farmer\'s Walk',
    category: 'Functional',
    muscleGroups: ['Forearms', 'Core', 'Legs'],
    equipment: 'Dumbbells'
  },
  {
    id: '62',
    name: 'Box Jumps',
    category: 'Plyometric',
    muscleGroups: ['Legs'],
    equipment: 'Box'
  },
  {
    id: '63',
    name: 'Medicine Ball Slams',
    category: 'Functional',
    muscleGroups: ['Core', 'Shoulders'],
    equipment: 'Medicine Ball'
  },

  // Stretching/Mobility
  {
    id: '64',
    name: 'Cat-Cow Stretch',
    category: 'Stretching',
    muscleGroups: ['Back', 'Core']
  },
  {
    id: '65',
    name: 'Downward Dog',
    category: 'Stretching',
    muscleGroups: ['Back', 'Hamstrings', 'Calves']
  },
  {
    id: '66',
    name: 'Pigeon Pose',
    category: 'Stretching',
    muscleGroups: ['Hips', 'Glutes']
  },
  {
    id: '67',
    name: 'Hip Flexor Stretch',
    category: 'Stretching',
    muscleGroups: ['Hips']
  },
  {
    id: '68',
    name: 'Shoulder Rolls',
    category: 'Mobility',
    muscleGroups: ['Shoulders']
  },
  {
    id: '69',
    name: 'Foam Rolling',
    category: 'Recovery',
    muscleGroups: ['Full Body'],
    equipment: 'Foam Roller'
  },
  {
    id: '70',
    name: 'Child\'s Pose',
    category: 'Stretching',
    muscleGroups: ['Back', 'Hips']
  },
  {
    id: '7',
    name: 'Incline Bench Press',
    category: 'Strength',
    muscleGroups: ['Chest', 'Triceps', 'Shoulders'],
    equipment: 'Barbell'
  },
  {
    id: '8',
    name: 'Dumbbell Flyes',
    category: 'Strength',
    muscleGroups: ['Chest'],
    equipment: 'Dumbbells'
  },
  {
    id: '9',
    name: 'Chest Dips',
    category: 'Bodyweight',
    muscleGroups: ['Chest', 'Triceps', 'Shoulders']
  },
  {
    id: '10',
    name: 'Cable Crossover',
    category: 'Strength',
    muscleGroups: ['Chest'],
    equipment: 'Cable Machine'
  },

  // Back Exercises
  {
    id: '6',
    name: 'Pull-ups',
    category: 'Bodyweight',
    muscleGroups: ['Back', 'Biceps']
  }
];

export const dietaryPreferences = [
  'None',
  'Vegetarian',
  'Vegan',
  'Pescatarian',
  'Keto',
  'Paleo',
  'Mediterranean',
  'Low Carb',
  'High Protein',
  'Gluten Free',
  'Dairy Free'
];

export const workoutStyles = [
  'Strength Training',
  'Cardio',
  'HIIT',
  'Yoga',
  'Pilates',
  'Bodyweight',
  'CrossFit',
  'Running',
  'Swimming',
  'Cycling',
  'Dance',
  'Martial Arts'
];