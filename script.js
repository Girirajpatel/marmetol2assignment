console.log('====================================');
console.log("Connected");
console.log('====================================');



// Fetch cart data from the API
const fetchCartData = async () => {
  try {
    const response = await fetch(
      "https://cdn.shopify.com/s/files/1/0883/2188/4479/files/apiCartData.json?v=1728384889"
    );
    const data = await response.json();
    renderCartItems(data.items);
    updateTotals(data);
  } catch (error) {
    console.error("Error fetching cart data:", error);
  }
};

const renderCartItems = (items) => {
  const cartItemsTable = document.querySelector(".cart-items tbody");
  cartItemsTable.innerHTML = ""; 

  items.forEach((item) => {
    const row = document.createElement("tr");
    row.setAttribute("data-id", item.id);
    row.innerHTML = `
      <td class="product">
        <img src="${item.image}" alt="${item.title}">
        <span>${item.title}</span>
      </td>
      <td>₹${(item.price / 100).toLocaleString()}</td>
      <td>
        <input type="number" value="${item.quantity}" min="1">
      </td>
      <td>₹${(item.price / 100).toLocaleString()}</td>  <!-- Price stays the same -->
      <td><button class="remove-btn">🗑️</button></td>
    `;

    
    const quantityInput = row.querySelector("input[type='number']");
    const removeBtn = row.querySelector(".remove-btn");

    quantityInput.addEventListener("change", (e) =>
      handleQuantityChange(e, item)
    );
    removeBtn.addEventListener("click", () => removeCartItem(item.id));

    cartItemsTable.appendChild(row);
  });
};


const handleQuantityChange = (event, item) => {
  const newQuantity = parseInt(event.target.value);
  if (newQuantity < 1) return;

  // Update price dynamically 
  const row = document.querySelector(`[data-id="${item.id}"]`);
  row.querySelector("td:nth-child(4)").textContent = `₹${(item.price * newQuantity / 100).toLocaleString()}`;

  
  updateCartTotals();
};

// Remove cart item
const removeCartItem = (itemId) => {
  const row = document.querySelector(`[data-id="${itemId}"]`);
  row.remove(); 
  updateCartTotals(); 
};

// Update cart totals
const updateCartTotals = () => {
  const cartItems = document.querySelectorAll(".cart-items tbody tr");
  let subtotal = 0;

  cartItems.forEach((row) => {
    const linePriceText = row.querySelector("td:nth-child(4)").textContent;
    const linePrice = parseInt(linePriceText.replace(/₹|,/g, ""));
    subtotal += linePrice;
  });

  // Update the subtotal and total dynamically
  document.querySelector(".cart-totals p:nth-child(2) span").textContent = `₹${subtotal.toLocaleString()}`;
  document.querySelector(".cart-totals p:nth-child(3) span.total").textContent = `₹${subtotal.toLocaleString()}`; // Total matches subtotal
};

// Update totals from the initial API data
const updateTotals = (data) => {
  const subtotal = data.items_subtotal_price / 100;
  const total = data.original_total_price / 100;

  document.querySelector(".cart-totals p:nth-child(2) span").textContent = `₹${subtotal.toLocaleString()}`;
  document.querySelector(".cart-totals p:nth-child(3) span.total").textContent = `₹${subtotal.toLocaleString()}`; // Set total same as subtotal
};

// Initialize the cart page
fetchCartData();
