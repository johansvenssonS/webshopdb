import { getCart } from "../../app.js";

export const createCheckoutView = (cart) => {
  console.log(cart);
  let cartContent = cart.getBasket();
  let popUp = document.createElement("div");
  popUp.classList.add("modal");
  popUp.innerHTML = `
      <div class="modal-content">
        <div class="add-section">
      <h2 id="rubrik">Användareuppgifter</h2>
      <form id="customerInfo">
        <input 
          type="text" 
          id="user_name" 
          placeholder="Namn" 
          required
        >
        <input 
          type="email"
          id="user_email" 
          placeholder="Email" 
          required
        ></input>
        <input
          type="tel"
          id="user_telephone" 
          placeholder="Telefonnummer" 
          required
        ></input>
        <button class="regBtn" type="submit">Registrera</button>
      </form>
    </div>
        <button class="close" aria-label="Stäng">&times;</button>
        <h3 class="korg-title">Dina Produkter</h3>
        <ul class="korg-list">
          ${cartContent ///
            .map(
              (product) => `
              <li class="korg-item">
                <img src="${product.image}" class="modal-image" />
                <h3>${product.name}</h3>
                <div class="product-info">
                  <p><span>${product.price}</span><span>kr</span></p>
                  <div class="qty-control">
                    <button class="qty-minus">−</button>
                    <span class="qty">${product.quantity}</span>
                    <button class="qty-plus">+</button>
                  </div>
                </div>
                <button class="remove">X</button>
              </li>
              `,
            )
            .join("")}
        </ul>
        <h3 class="cart-cost"> Totalt Pris: ${cart.getTotPrice()}kr </h3>
        <button class="checkout-btn">Slutför köp</button>
      </div>
    `;
  document.body.appendChild(popUp);
  popUp.style.display = "block";
  //Hantera kunduppgifter formulär inputs
  const form = document.getElementById("customerInfo");
  const user_name = document.getElementById("user_name");
  const user_email = document.getElementById("user_email");
  const user_telephone = document.getElementById("user_telephone");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let name_C = user_name.value.trim();
    let email_C = user_email.value.trim();
    let telephone_C = user_telephone.value.trim();
    createCustomer(name_C, email_C, telephone_C);
  });
  /// Event för stänga ner modalen (X)
  let x = popUp.querySelector(".close");
  x.addEventListener("click", (event) => {
    popUp.remove();
  });
};

//Funktion för att göra req till db för att skapa kund.
export const createCustomer = (
  customer_name,
  customer_email,
  customer_telephone,
) => {
  fetch("http://localhost:3000/customer", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      name: customer_name,
      email: customer_email,
      telephone: customer_telephone,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        alert(data.error, "något blev fel!");
      } else {
        //lyckad request
        //ta bort regbtn så inte dubbletter.
        let regBtn = document.querySelector(".regBtn");
        regBtn.remove();
        let form = document.getElementById("customerInfo");
        form.remove();
        let title = document.getElementById("rubrik");
        title.textContent = `Välkommen! ${customer_name}`;
        let id_customer = data.id_customer;
        createOrder(id_customer);
        alert("Kund skapad!");
      }
    });
};

//Skapa order ifrån de customer_id som skapats ovan
export const createOrder = (id) => {
  let checkoutBtn = document.querySelector(".checkout-btn");
  checkoutBtn.addEventListener("click", (event) => {
    //hämta cart och dens produkter
    const cart = getCart();
    const cartOfproducts = cart.getBasket();
    const total = cart.getTotPrice();
    const method = "swish"; //hårdkodat så länge, fixa method,adress form?
    const body = {
      //felsök
      id_customer: id,
      total_amount: total,
      payment_method: method,
      products: cartOfproducts,
    };
    console.log("Skickar:", JSON.stringify(body));
    fetch("http://localhost:3000/orders", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        id_customer: id,
        total_amount: total,
        payment_method: method,
        products: cartOfproducts,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          alert(data.error, "Fel,kunde inte skapa order!");
        } else {
          //lyckad ta bort knapp så inga fler görs!
          checkoutBtn.remove();
          alert("Order skapad!");
        }
      });
  });
};
//  27694kr
