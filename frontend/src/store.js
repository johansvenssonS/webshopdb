import { Product } from "./product.js";
/// Modul för Store Klassen
class Store {
  constructor() {
    this.store = [];
  }
  ///Hämta produkter ifrån Json Fil
  getProducts = async () => {
    const response = await fetch("http://localhost:3000/products");
    const data = await response.json();
    return data;
  };
  /// Skapa produkt objekt ifrån Json data och lägg till i store arrayen
  createProducts = (data) => {
    data.forEach((item) => {
      let p = new Product(
        item.name,
        item.price,
        item.image,
        item.description,
        item.category,
      );
      this.addToStore(p);
    });
  };
  /// Lägg till produkt objekt i store arrayen
  addToStore = (product) => {
    this.store.push(product);
  };
  /// Hjälp metod för att hämta store arrayen
  getStore = () => {
    return this.store;
  };

  ///filtrera
  filterProducts = (filter) => {
    // console.log(this.store);
    //hämta objektet
    if (filter === "Alla") {
      return this.store;
    }
    let products = this.store;
    /// bygg en array med produkter product.category som är lika med filter
    const resultArr = products.filter((product) => product.category === filter);
    return resultArr;
  };
}

export { Store };
