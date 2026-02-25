/// Modul för Product Klassen
class Product {
  constructor(name, price, stock, id_product, id_category) {
    this.name = name;
    this.price = price;
    this.stock = stock;
    this.id_product = id_product;
    this.id_category = id_category;
  }
  //Get hjälpmetoder, används inte
  getName = () => {
    return this.name;
  };
  getPrice = () => {
    return this.price;
  };
  getImage = () => {
    return this.image;
  };
  getDescription = () => {
    return this.description;
  };
}

export { Product };
