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
        // console.log(data);
        return data;
    };
    /// Skapa produkt objekt ifrån Json data och lägg till i store arrayen
    createProducts = (data) => {
        data.forEach((item) => {
            let p = new Product(
                item.name,
                item.price,
                item.stock,
                item.id_product,
                item.id_category,
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
    // Sök produkt
    searchProducts = async (query) => {
        const response = await fetch(
            `http://localhost:3000/products/search?q=${query}`,
        );
        const data = await response.json();
        return data;
    };
    ///filtrera
    filterProducts = (filter) => {
        // console.log(this.store);
        //hämta objektet
        console.log(filter);
        if (filter === "Alla") {
            return this.store;
        }
        if (filter === "Mobiltelefoner") {
            filter = 1;
        } else if (filter === "Laptops") {
            filter = 2;
        } else if (filter === "Tv") {
            filter = 3;
        } else if (filter === "Surfplattor") {
            filter = 4;
        } else if (filter === "Ljud") {
            filter = 5;
        } else if (filter === "Hem") {
            filter = 6;
        } else if (filter === "Kök") {
            filter = 7;
        } else if (filter === "Gaming") {
            filter = 8;
        }
        let products = this.store;

        /// bygg en array med produkter product.category som är lika med filter
        const resultArr = products.filter(
            (product) => product.id_category === filter,
        );
        return resultArr;
    };
}

export { Store };
