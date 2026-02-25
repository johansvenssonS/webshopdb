import { getCart } from "../../app.js";
import { updateCartBadge } from "./cartView.js";
///Skapa ProduktVyn alltså manipulera productGrid
/// Byggs av listan av produkter inte Store klassen
export const createProductView = (store) => {
    ///Om productGrid finns så töm den
    /// När sidan startar så laddas allt in,
    // så den finns vid klick på kategori
    let productGrid = document.querySelector(".productGrid");

    if (productGrid) {
        productGrid.innerHTML = "";
    } else {
        /// Annars skapa den och lägg in den under main
        productGrid.classList.add("productGrid");
        const main = document.querySelector("main");
        main.appendChild(productGrid);
    }
    ///Skapa korten

    for (let p of store) {
        console.log(p);
        let div = document.createElement("div");
        div.classList.add("product");

        div.innerHTML = `
    <img src="${p.image}"/>
      <div class="product-text">
        <h4 class="product-name">${p.name}</h4>
        <div class="product-price">Pris:${p.price}</div>
        <h4> I lager:${p.stock}</h4>
      </div>
        <button class="modal-product">Läs mer</button>
    `;

        productGrid.appendChild(div);
        let btn = div.querySelector(".modal-product");
        productModalEvents(btn, p);
        /// kalla på modalevent här och skicka med btn element och p (produktobjektet)
    }
};
/// Event för kategori eventsen
export const filterEvents = (store) => {
    let buttons = document.querySelectorAll(".menuButton");

    for (let btn of buttons) {
        btn.addEventListener("click", (event) => {
            /// Skicka vad knappen innehåller till filtrering
            let filtredStore = store.filterProducts(btn.textContent);
            /// Kasta upp det filtrerade upp till createProductView
            let filtredView = createProductView(filtredStore);
            // console.log(filtredStore);
        });
    }
};

export const productModalEvents = async (btn, p) => {
    // Metod för att skapa produkt Modal.

    btn.addEventListener("click", async (event) => {
        let data = await getDetailedInfo(p.id_product);
        let pData = data[0];
        console.log(data);
        let popUp = document.createElement("div");
        popUp.classList.add("modal");
        popUp.innerHTML = `
    <div class="modal-content">
    <span class="close">&times;</span>
    <img src="${p.image}" class="modal-image" />
      <div class="modal-text">
        <a class="modal-name">${p.name}</a>
        <div class="modal-price">Pris:${p.price}</div>
        <a class="modal-name">${pData.desc}</a>
        <a class="modal-name">${pData.specs}</a>
        <button class="btnCart">Lägg till</button>
      </div>
      </div>
    `;
        //lägga till i body(visa upp)
        document.body.appendChild(popUp);
        popUp.style.display = "block";

        // Eventhantering för köpknapp i popUp
        let buyBtn = popUp.querySelector(".btnCart");
        buyBtn.addEventListener("click", (event) => {
            let cart = getCart();
            cart.addToBasket(p);
            updateCartBadge(cart);
            p.addQuantity();
        });

        // X knapp i modal, stänger ner/tar bort popup.
        let x = popUp.querySelector(".close");
        x.addEventListener("click", (event) => {
            popUp.remove();
        });
    });
};

export const getDetailedInfo = async (id_product) => {
    try {
        let detailedInfo = await fetch(
            `http://localhost:3000/products/${id_product}`,
        );
        const data = await detailedInfo.json();
        return data;
    } catch (error) {
        console.error("Fel vid hämtning av detaljer:", error);
        return {
            desc: "Kunde inte hitta desc",
            specs: "Kunde inte hitta specifikationer",
        };
    }
};
