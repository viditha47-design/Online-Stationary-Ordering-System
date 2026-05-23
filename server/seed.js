const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Item = require('./models/Item');

const items = [
  { name: 'A4 Paper (500 sheets)', description: 'Standard white A4 paper', price: 250, stock: 100, category: 'paper' },
  { name: 'Ballpoint Pen (Blue)', description: 'Reynolds 045 blue pen', price: 10, stock: 200, category: 'writing' },
  { name: 'Ballpoint Pen (Black)', description: 'Reynolds 045 black pen', price: 10, stock: 200, category: 'writing' },
  { name: 'Highlighter Set', description: '5 color highlighter set', price: 60, stock: 50, category: 'writing' },
  { name: 'Spiral Notebook (200 pages)', description: 'A4 ruled spiral notebook', price: 80, stock: 75, category: 'paper' },
  { name: 'Stapler', description: 'Mini stapler with staples', price: 120, stock: 30, category: 'binding' },
  { name: 'Staple Pins (Box)', description: '26/6 staple pins, 1000 pcs', price: 25, stock: 100, category: 'binding' },
  { name: 'Sticky Notes', description: '3x3 inch, 100 sheets', price: 40, stock: 80, category: 'general' },
  { name: 'Pencil (HB)', description: 'Natraj HB pencil', price: 5, stock: 300, category: 'writing' },
  { name: 'Eraser', description: 'Apsara eraser', price: 5, stock: 300, category: 'general' },
  { name: 'Scale (30cm)', description: 'Transparent plastic ruler', price: 15, stock: 100, category: 'general' },
  { name: 'Binding Clip (Large)', description: 'Pack of 12 binder clips', price: 30, stock: 60, category: 'binding' }
];

mongoose.connect(process.env.MONGO_URI).then(async () => {
  await Item.deleteMany({});
  await Item.insertMany(items);
  console.log('Seeded', items.length, 'items');
  process.exit(0);
}).catch(err => { console.error(err); process.exit(1); });
