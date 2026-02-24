///Modul för Basket Klassen
class Basket {
  constructor() {
    this.cart = [];
  }
  //Lägg till i array
  addToBasket = (product) => {
    this.cart.push(product);
  };
  //Metod för få total pris av produkter i cart arrayen.
  getTotPrice = () => {
    let tot = 0;
    for (let p of this.cart) {
      tot += p.price;
    }
    return tot;
  };
  /// Metod för att få (antal produkter i kundvagn)
  getLength = () => {
    return this.cart.length;
  };
  /// Metod för att hämta hela kundvagnen
  getBasket = () => {
    return this.cart;
  };
  ///Metod för att ta bort specifik vara ifrån kundvagn.
  removeItem = (item) => {
    for (let p of this.cart) {
      if (p.name === item) {
        let pIndex = this.cart.indexOf(p);
        this.cart.splice(pIndex, 1);
      }
    }
  };
}

export { Basket };
