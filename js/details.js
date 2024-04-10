let cartItems = [];

function toggleCart() {
  const cartBasket = document.getElementById('cartBasket');
  cartBasket.classList.toggle('hidden');
}

function addToCart(event) {
  event.preventDefault();
  const productName = document.getElementById('productName').innerText;
  const productPrice = parseFloat(document.getElementById('productPrice').innerText.replace('$', ''));
  const count = parseInt(document.getElementById('productCount').value);

  // Verificar si el producto ya está en el carrito
  const existingItemIndex = cartItems.findIndex(item => item.name === productName);
  if (existingItemIndex !== -1) {
    // Si el producto ya está en el carrito, actualizar la cantidad
    cartItems[existingItemIndex].quantity += count;
  } else {
    // Si el producto no está en el carrito, agregarlo
    const newItem = {
      name: productName,
      price: productPrice,
      quantity: count
    };
    cartItems.push(newItem);
  }

  updateCart();
}

function updateCart() {
  const cartDetails = document.getElementById('cartDetails');
  cartDetails.innerHTML = '';
  let totalAmount = 0;

  cartItems.forEach(item => {
    const itemTotal = item.price * item.quantity;
    totalAmount += itemTotal;
    cartDetails.innerHTML += `
      <div>
        <p>${item.name} - $${item.price.toFixed(2)} MXN x ${item.quantity}</p>
        <button onclick="removeItem('${item.name}')">Remove</button>
      </div>
    `;
  });

  const totalAmountElement = document.getElementById('totalAmount');
  totalAmountElement.innerText = `Total: $${totalAmount.toFixed(2)} MXN`;
}

function removeItem(name) {
  cartItems = cartItems.filter(item => item.name !== name);
  updateCart();
}

function incrementCount() {
  const countInput = document.getElementById('productCount');
  countInput.value = parseInt(countInput.value) + 1;
}

function decrementCount() {
  const countInput = document.getElementById('productCount');
  const newValue = parseInt(countInput.value) - 1;
  countInput.value = newValue < 1 ? 1 : newValue;
}
