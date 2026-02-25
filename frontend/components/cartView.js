///Modul för hantering av varukorgs vyn/events
///{param} Cart objekt ifrån app.js
export const basketHandler = (cart) => {
  /// Kundvags knappen i header
  const checkoutbtn = document.querySelector(".checkout");

  /// Funktion för att skapa varukorg Modal.
  const createPopup = () => {
    // hämta cart innehåll, objekt med produkter
    let cartContent = cart.getBasket();

    // Skapa modal popup
    let popUp = document.createElement("div");
    popUp.classList.add("modal");
    popUp.innerHTML = `
      <div class="modal-content">
        <button class="close" aria-label="Stäng">&times;</button>
        <h2 class="korg-title">Varukorg</h2>
        <ul class="korg-list">
          ${cartContent ///
            .map(
              (product) => `
              <li class="korg-item">
                <img src="${product.image}" class="modal-image" />
                <h3>${product.name}</h3>
                <div class="product-info">
                  <p><span>${product.price}</span><span>kr</span></p>
                </div>
                <button class="remove">X</button>
              </li>
              `
            )
            .join("")}
        </ul>
        <h3 class="cart-cost"> Totalt Pris: ${cart.getTotPrice()}kr </h3>
      </div>
    `;
    //lägga till i body(visa upp)
    document.body.appendChild(popUp);
    popUp.style.display = "block";
    /// Event för stänga ner modalen (X)
    let x = popUp.querySelector(".close");
    x.addEventListener("click", (event) => {
      popUp.remove();
    });
  };
  /// Sätta upp event på checkout knapp i header.
  if (checkoutbtn) {
    checkoutbtn.addEventListener("click", () => {
      createPopup();
      removeButton(cart);
    });
  }
  /// Event för att ta bort vara ifrån varukorg (X)
  const removeButton = (cart) => {
    const removeButtons = document.querySelectorAll(".remove");
    for (let btn of removeButtons) {
      btn.addEventListener("click", (event) => {
        /// Här får vi hela li korg-item diven
        let selectedParentElement = event.target.parentElement;
        let selectedProductName = selectedParentElement.querySelector("h3");
        cart.removeItem(selectedProductName.textContent);
        selectedParentElement.remove();
        updateCartBadge(cart);
        updateCartCost(cart);
      });
    }
  };
};

/// updatera total kostnad i varukorgs modalen
export const updateCartCost = (cart) => {
  let modal = document.querySelector(".modal");
  let cost = document.querySelector(".cart-cost");
  if (cost) {
    cost.textContent = ` Totalt Pris: ${cart.getTotPrice()}kr`;
    // if (modal) {
    //   /// bara prank
    //   const originalBg = modal.style.backgroundImage;
    //   modal.style.backgroundImage = "url(./static/julklapp.jpg)";
    //   window.setTimeout(() => {
    //     modal.style.backgroundImage = originalBg || "";
    //   }, 8000);
    // }
  }
};

/// Uppdatera badge i header med antal produkter i kundvagn
export const updateCartBadge = (cart) => {
  let badge = document.querySelector(".cart-badge");
  if (badge) {
    badge.textContent = cart.getLength();
  }
};

// `
//     <div class="modal-content">
//     <span class="close">&times;</span>
//     <img src="${p.image}" class="modal-image" />
//       <div class="modal-text">
//         <a class="modal-name">${p.name}</a>
//         <div class="modal-price">Pris:${p.price}</div>
//         <p>${p.description}</p>
//         <button class="btnCart">Lägg till</button>
//       </div>
//       </div>
//     `;
