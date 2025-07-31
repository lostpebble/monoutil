const products = [
  { id: 1, name: "Laptop", price: 1000, inStock: true },
  { id: 2, name: "Phone", price: 800, inStock: false },
  { id: 3, name: "Tablet", price: 500, inStock: true },
  { id: 4, name: "Headphones", price: 100, inStock: true },
];

const newProducts = products
  .filter((product) => product.inStock && product.price < 600)
  .map((product) => ({ name: product.name, price: product.price }));

console.log(newProducts);
