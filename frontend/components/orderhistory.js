import { createProductView } from "./productView.js";

export const orderHistory = (sortiment) => {
  let all_Btn = document.querySelector(".menuButton");
  let main = document.querySelector("main");
  all_Btn.addEventListener("click", (event) => {
    event.preventDefault();
    main.innerHTML = "";
    let productGrid = document.createElement("div");
    productGrid.classList.add("productGrid");
    main.appendChild(productGrid);
    createProductView(sortiment);
  });

  let orderBtn = document.querySelector(".orderHistory");
  orderBtn.addEventListener("click", (event) => {
    createOrderSearch();
  });
};

export const createOrderSearch = () => {
  let main = document.querySelector("main");
  let orderSearch = document.createElement("div");
  let customerSearch = document.createElement("div");
  orderSearch.innerHTML = `
      <div>
        <div class="add-section">
      <h2 id="rubrik">Sök orderhistorik</h2>
      <form id="orderid">
        <input 
          type="text" 
          id="id_order" 
          placeholder="OrderID" 
          required
        >
        <button class="regBtn" type="submit">Sök</button>
        <button class="clear type="button">Rensa Lista</button
      </form>
      
    </div>
    <ul class="korg-list">
        </ul>
    `;
  customerSearch.innerHTML = `
      <div>
        <div class="add-section">
      <h2 id="rubrik">Kund-order-sök</h2>
      <form id="customerId">
        <input 
          type="text" 
          id="id_customer" 
          placeholder="KundID" 
          required
        >
        <button class="regBtn" type="submit">Sök</button>
        <button class="clear-c type="button">Rensa Lista</button
      </form>
      
    </div>
    <ul class="korg-list-c">
        </ul>
    `;
  main.innerHTML = "";
  main.appendChild(orderSearch);
  main.appendChild(customerSearch);
  clearList();

  const formOrder = document.getElementById("orderid");
  const formCustomer = document.getElementById("customerId");
  const orderID = document.getElementById("id_order");
  const customerId = document.getElementById("id_customer");

  formOrder.addEventListener("submit", (event) => {
    event.preventDefault();
    let order_id = orderID.value.trim();
    getOrders(order_id);
  });
  formCustomer.addEventListener("submit", (event) => {
    event.preventDefault();
    let customer_id = customerId.value.trim();
    getCustomerOrders(customer_id);
  });
};

export const getOrders = async (order_id) => {
  let list = document.querySelector(".korg-list");
  list.innerHTML = "";
  const response = await fetch(`http://localhost:3000/orders/${order_id}`);
  const data = await response.json();
  console.log(data[0]);
  for (const order of data) {
    let line = document.createElement("li");
    line.classList.add("korg-item");
    line.innerHTML = `
    id_customer: ${order.id_customer}<br>
    id_order: ${order.id_order}<br>
    id_product ${order.id_product}<br>
     order_date ${order.order_date}<br>
      order_qty: ${order.order_qty}<br>
       payment_method: ${order.payment_method}<br>
        payment_status: ${order.payment_status}<br>
         status :${order.status}<br>
          total_amount: ${order.total_amount}`;
    list.appendChild(line);
  }
};
export const getCustomerOrders = async (customer_id) => {
  let list = document.querySelector(".korg-list-c");
  list.innerHTML = "";
  const response = await fetch(`http://localhost:3000/customer/${customer_id}`);
  const data = await response.json();
  console.log(data[0]);
  for (const order of data) {
    let line = document.createElement("li");
    line.classList.add("korg-item");
    line.innerHTML = `
    customer_name: ${order.customer_name}<br>
    id_order: ${order.id_order}<br>
     order_date ${order.order_date}<br>
     product_name ${order.product_name}<br>
      order_qty: ${order.order_qty}<br>
         status :${order.status}<br>
          total_amount: ${order.total_amount}`;
    list.appendChild(line);
  }
};
export const clearList = () => {
  let clearBtn = document.querySelector(".clear");
  let clearBtn_c = document.querySelector(".clear-c");
  clearBtn.addEventListener("click", (event) => {
    event.preventDefault();
    let list = document.querySelector(".korg-list");
    list.innerHTML = "";
  });
  clearBtn_c.addEventListener("click", (event) => {
    event.preventDefault();
    let list = document.querySelector(".korg-list-c");
    list.innerHTML = "";
  });
};
