/// Modul för Product Klassen
class Product {
  constructor(name, price, image, description, category) {
    this.name = name;
    this.price = price;
    this.image = image;
    this.description = description;
    this.category = category;
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
