///Modul för Basket Klassen
class Basket {
    constructor() {
        this.cart = [];
    }
    //Lägg till i array
    addToBasket = (product) => {
        if (product.quantity == 0) {
            this.cart.push(product);
        }
    };
    //Metod för få total pris av produkter i cart arrayen.
    getTotPrice() {
        return this.cart.reduce((sum, p) => sum + p.price * p.quantity, 0);
    }
    /// Metod för att få (antal produkter i kundvagn)
    getLength = () => {
        return this.cart.length;
    };
    /// Metod för att hämta hela kundvagnen
    getBasket = () => {
        return this.cart;
    };
    updateQuantity(name, qty) {
        const product = this.cart.find((p) => p.name === name);
        if (product) {
            product.quantity = qty;
        }
    }
    //Clear Basket
    clearBasket() {
        this.cart = [];
    }
    ///Metod för att ta bort specifik vara ifrån kundvagn.
    removeItem(name) {
        const product = this.cart.find((p) => p.name === name);
        if (!product) return;

        product.quantity = 0;
        this.cart = this.cart.filter((p) => p.name !== name);
        /* for (let p of this.cart) {
            if (p.name === item) {
                let pIndex = this.cart.indexOf(p);
                this.cart.splice(pIndex, 1);
            }
        } */
    }
}

export { Basket };
