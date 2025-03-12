let cart = {};

// Function to save order to backend
async function saveOrder(customerName, customerEmail, customerAddress, customerPhone, customerCity, customerZip, items, totalPrice) {
    const orderData = {
        customerName,
        customerEmail,
        customerAddress,
        customerPhone,
        customerCity,
        customerZip,
        items: Object.keys(cart).map(itemName => ({
            name: itemName,
            price: cart[itemName].price,
            quantity: cart[itemName].quantity
        })),
        totalPrice
    };

    try {
        const response = await fetch('http://localhost:5000/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });

        if (response.ok) {
            console.log('Order saved successfully!');
        } else {
            console.error('Failed to save order.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Add item to cart
function addToCart(itemName, itemPrice) {
    if (cart[itemName]) {
        cart[itemName].quantity += 1;
    } else {
        cart[itemName] = {
            price: itemPrice,
            quantity: 1
        };
    }
    updateCart();
}

// Remove item from cart
function removeFromCart(itemName) {
    if (cart[itemName]) {
        cart[itemName].quantity -= 1;
        if (cart[itemName].quantity <= 0) {
            delete cart[itemName];
        }
    }
    updateCart();
}

// Update the cart
function updateCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
    const discountMessageElement = document.getElementById('total-discount');

    let totalItems = 0;
    let totalPrice = 0;

    cartItemsContainer.innerHTML = '';

    for (const item in cart) {
        const itemTotal = cart[item].price * cart[item].quantity;
        totalPrice += itemTotal;
        totalItems += cart[item].quantity;

        const row = document.createElement('tr');
        row.innerHTML = 
            '<td>' + item + '</td>' +
            '<td>' + 
                '<button class="minus" data-item="' + item + '">-</button>' +
                '<span id="quantity-' + item + '">' + cart[item].quantity + '</span>' +
                '<button class="plus" data-item="' + item + '">+</button>' +
            '</td>' +
            '<td>' + cart[item].price.toFixed(2) + '€</td>' +
            '<td>' + itemTotal.toFixed(2) + '€</td>';   

        cartItemsContainer.appendChild(row);
    }

    if (totalItems >= 3) {
        const discounted_price = totalPrice * 0.90; 
        discountMessageElement.innerHTML = 'You saved 10%! New price: ' + discounted_price.toFixed(2) + '€';
        discountMessageElement.style.color = 'red';

        totalPriceElement.innerHTML = 'Original price: ' + totalPrice.toFixed(2) + '€';
    } else {
        discountMessageElement.innerHTML = '';
        totalPriceElement.innerHTML = totalPrice.toFixed(2) + '€';
    }

    document.getElementById('checkout-btn').disabled = totalItems === 0;

    document.querySelectorAll('.plus').forEach(button => {
        button.addEventListener('click', function () {
            const itemName = this.getAttribute('data-item');
            addToCart(itemName, cart[itemName].price);
        });
    });

    document.querySelectorAll('.minus').forEach(button => {
        button.addEventListener('click', function () {
            const itemName = this.getAttribute('data-item');
            removeFromCart(itemName);
        });
    });
}

// Attach event listeners to 'Add to Cart' buttons
const addToCartButtons = document.querySelectorAll('.add-to-cart');
addToCartButtons.forEach(button => {
    button.addEventListener('click', function() {
        const card = button.closest('.card');
        const itemName = card.getAttribute('data-name');
        const itemPrice = parseFloat(card.getAttribute('data-price'));

        addToCart(itemName, itemPrice);
    });
});

const form = document.getElementById("shipping-form");
const orderButton = document.getElementById("order_button");

// Function to validate the form
function validateForm() {
    const isValid = form.checkValidity();
    orderButton.disabled = !isValid; 
}

const inputs = form.querySelectorAll(".form-control");
inputs.forEach(input => {
    input.addEventListener("input", validateForm);
});

validateForm();

// Order confirmation 
document.getElementById('order_button').addEventListener('click', function () {
    const customerName = document.getElementById('customer-name').value;
    const customerEmail = document.getElementById('inputEmail').value;
    const customerAddress = document.getElementById('inputAddress').value;
    const customerPhone = document.getElementById('inputPhoneNumber').value;
    const customerCity = document.getElementById('inputCity').value;
    const customerZip = document.getElementById('inputZip').value;

    let totalPrice = 0;
    for (const item in cart) {
        totalPrice += cart[item].price * cart[item].quantity;
    }

    if (Object.keys(cart).length >= 3) {
        totalPrice *= 0.9; // Apply 10% discount
    }

    // Save order to backend
    saveOrder(customerName, customerEmail, customerAddress, customerPhone, customerCity, customerZip, cart, totalPrice);

    // Update the confirmation modal
    document.getElementById('confirmation-name').textContent = customerName;  
    document.getElementById('order-items').innerHTML = '';  

    for (const item in cart) {
        const listItem = document.createElement('li');
        listItem.textContent = listItem.textContent = item + ' (x' + cart[item].quantity + ') -> ' + cart[item].price.toFixed(2) + '€';
        document.getElementById('order-items').appendChild(listItem);
    }

    if (Object.keys(cart).length >= 3) {
        document.getElementById('final-price').innerHTML = 
            '<p>Original Price: ' + totalPrice.toFixed(2) + '€</p>' +
            '<p>Discount (10%): ' + (totalPrice * 0.1).toFixed(2) + '€</p>' +
            '<p style="color:red;">Final Price: ' + (totalPrice * 0.9).toFixed(2) + '€</p>';
    } else {
        document.getElementById('final-price').innerHTML = 
            '<p>Original Price: ' + totalPrice.toFixed(2) + '€</p>' +
            '<p>Discount (10%): None. You need at least 3 products in your cart.</p>' +
            '<p>Final Price: ' + totalPrice.toFixed(2) + '€</p>';
    }
});

// Reset everything
document.querySelectorAll('#close-button, #close_btn_order_confirmation').forEach(element => {
    element.addEventListener('click', function () { 
        cart = {};
        updateCart();

        document.getElementById('shipping-form').reset();
        document.getElementById('confirmation-name').textContent = '';
        document.getElementById('order-items').innerHTML = '';
        document.getElementById('final-price').innerHTML = '';
        document.getElementById('total-discount').innerHTML = '';
    });
});