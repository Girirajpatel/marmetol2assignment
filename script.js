document.addEventListener('DOMContentLoaded', function() {
  // Cart data
  const cartData = {
      "original_total_price": 250000,
      "items": [
          {
              "id": 49839206859071,
              "quantity": 1,
              "title": "Asgaard sofa",
              "price": 25000000,
              "line_price": 25000000,
              "final_line_price": 25000000,
              "image": "https://cdn.shopify.com/s/files/1/0883/2188/4479/files/Asgaardsofa3.png?v=1728384481",
              "product_description": "The Asgaard sofa offers unparalleled comfort and style with its sleek design and high-quality materials."
          }
      ],
      "currency": "INR"
  };

  // Format price function
  function formatPrice(price) {
     
      // Dividing by 100 to convert to rupees
      const formattedPrice = (price / 100).toFixed(2);
      return `Rs. ${formattedPrice}`;
  }

  // Render cart items
  function renderCartItems() {
      const cartItemsContainer = document.getElementById('cart-items');
      const template = document.getElementById('cart-item-template');
      
      // Clear existing items
      cartItemsContainer.innerHTML = '';
      
      if (cartData.items.length === 0) {
          // Show empty cart message
          const emptyRow = document.createElement('tr');
          emptyRow.innerHTML = `
              <td colspan="4" class="empty-cart">
                  <div class="empty-cart-icon"><i class="fas fa-shopping-cart"></i></div>
                  <p class="empty-cart-message">Your cart is empty</p>
                  <a href="#home" class="continue-shopping">Continue Shopping</a>
              </td>
          `;
          cartItemsContainer.appendChild(emptyRow);
          updateCartTotals(0);
          return;
      }
      
      // Add items to cart
      cartData.items.forEach(item => {
          const clone = template.content.cloneNode(true);
          
          // Set product details
          const productImage = clone.querySelector('.product-image');
          productImage.src = item.image;
          productImage.alt = item.title;
          
          clone.querySelector('.product-name').textContent = item.title;
          clone.querySelector('.product-description').textContent = item.product_description;
          
          // Set price
          clone.querySelector('.price-cell').textContent = formatPrice(item.price);
          
         
const quantityInput = clone.querySelector('.quantity-input');
quantityInput.value = item.quantity;
quantityInput.dataset.id = item.id;
quantityInput.id = `quantity-${item.id}`;  
quantityInput.name = "quantity";  

          // Set subtotal
          clone.querySelector('.subtotal').textContent = formatPrice(item.final_line_price);
          
          // Add event listeners
          const minusBtn = clone.querySelector('.minus');
          const plusBtn = clone.querySelector('.plus');
          const removeBtn = clone.querySelector('.remove-btn');
          
          minusBtn.addEventListener('click', () => updateQuantity(item.id, -1));
          plusBtn.addEventListener('click', () => updateQuantity(item.id, 1));
          quantityInput.addEventListener('change', (e) => setQuantity(item.id, parseInt(e.target.value)));
          removeBtn.addEventListener('click', () => removeItem(item.id));
          
          cartItemsContainer.appendChild(clone);
      });
      
      // Update cart totals
      updateCartTotals();
  }
  
  // Update quantity
  function updateQuantity(itemId, change) {
      const item = cartData.items.find(item => item.id === itemId);
      if (item) {
          const newQuantity = item.quantity + change;
          if (newQuantity > 0) {
              setQuantity(itemId, newQuantity);
          }
      }
  }
  
  // Set quantity
  function setQuantity(itemId, quantity) {
      const item = cartData.items.find(item => item.id === itemId);
      if (item && quantity > 0) {
          item.quantity = quantity;
          item.line_price = item.price * quantity;
          item.final_line_price = item.line_price;
          
          // Update UI
          const quantityInput = document.querySelector(`.quantity-input[data-id="${itemId}"]`);
          const subtotalElement = quantityInput.closest('tr').querySelector('.subtotal');
          
          quantityInput.value = quantity;
          subtotalElement.textContent = formatPrice(item.final_line_price);
          
          // Update cart totals
          updateCartTotals();
      }
  }
  
  // Remove item
  function removeItem(itemId) {
      const itemIndex = cartData.items.findIndex(item => item.id === itemId);
      if (itemIndex !== -1) {
          const itemElement = document.querySelector(`.quantity-input[data-id="${itemId}"]`).closest('tr');
          
          // Animate removal
          itemElement.style.opacity = '0';
          itemElement.style.transform = 'translateX(20px)';
          
          setTimeout(() => {
              // Remove from data
              cartData.items.splice(itemIndex, 1);
              
              // Re-render cart
              renderCartItems();
          }, 300);
      }
  }
  
  // Update cart totals
  function updateCartTotals() {
      let subtotal = 0;
      
      cartData.items.forEach(item => {
          subtotal += item.final_line_price;
      });
      
      // Update UI
      document.querySelector('.subtotal-value').textContent = formatPrice(subtotal);
      document.querySelector('.total-value').textContent = formatPrice(subtotal);
  }
  
  // Initialize cart
  renderCartItems();
  
  
  document.querySelector('.checkout-btn').addEventListener('click', function() {
      if (cartData.items.length > 0) {
          alert('Proceeding to checkout!');
        
      } else {
          alert('Your cart is empty. Add some products before checking out.');
      }
  });
  

  const menuToggle = document.getElementById('menu-toggle');
  menuToggle.addEventListener('change', function() {
      document.body.style.overflow = this.checked ? 'hidden' : '';
  });
});