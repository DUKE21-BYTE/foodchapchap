// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', () => {
  // Nav Toggle
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      const isVisible = navLinks.style.display === 'flex';

      if (isVisible) {
        navLinks.style.display = 'none';
      } else {
        navLinks.style.display = 'flex';
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '100%';
        navLinks.style.left = '0';
        navLinks.style.right = '0';
        navLinks.style.background = 'white';
        navLinks.style.padding = '1rem';
        navLinks.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
      }
    });
  }

  // ================= CART LOGIC =================

  let cart = JSON.parse(localStorage.getItem('foodChapChapCart')) || [];
  const phoneNumber = "254758596269";

  // Setup UI elements
  const body = document.body;

  // Add Cart FAB and Modal to body
  const cartHTML = `
      <div class="cart-fab" id="cartFab">
        <i class="fas fa-shopping-cart" style="font-size: 1.5rem;"></i>
        <div class="cart-count" id="cartCount">0</div>
      </div>

      <div class="cart-modal" id="cartModal">
        <div class="cart-content">
          <div class="cart-header">
            <h3>Your Order 🛒</h3>
            <span class="close-cart" id="closeCart">&times;</span>
          </div>
          <div id="cartItems">
            <!-- Items go here -->
            <p style="text-align: center; color: #666; padding: 2rem;">Your cart is empty.</p>
          </div>
          <div class="cart-total" id="cartTotalSection" style="display: none;">
             <span>Total:</span>
             <span id="cartTotalValue">KSh 0</span>
          </div>
          <button id="checkoutBtn" class="btn whatsapp-btn" style="width: 100%; margin-top: 1.5rem; display: none;">
            <i class="fab fa-whatsapp"></i> Order on WhatsApp
          </button>
        </div>
      </div>

      <div class="notification" id="notification">Item added to cart!</div>
    `;

  // Only add if not already present (in case of page reloads interfering)
  if (!document.getElementById('cartFab')) {
    const div = document.createElement('div');
    div.innerHTML = cartHTML;
    body.appendChild(div);
  }

  const cartFab = document.getElementById('cartFab');
  const cartModal = document.getElementById('cartModal');
  const closeCart = document.getElementById('closeCart');
  const cartItemsContainer = document.getElementById('cartItems');
  const cartCount = document.getElementById('cartCount');
  const cartTotalValue = document.getElementById('cartTotalValue');
  const cartTotalSection = document.getElementById('cartTotalSection');
  const checkoutBtn = document.getElementById('checkoutBtn');
  const notification = document.getElementById('notification');

  // Open/Close Cart
  cartFab.addEventListener('click', () => {
    renderCart();
    cartModal.classList.add('active');
  });

  closeCart.addEventListener('click', () => {
    cartModal.classList.remove('active');
  });

  cartModal.addEventListener('click', (e) => {
    if (e.target === cartModal) {
      cartModal.classList.remove('active');
    }
  });

  // Function to add item (Global so HTML onclicks can reach it)
  window.addToCart = function (name, price) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ name, price, quantity: 1 });
    }
    saveCart();
    updateCartCount();
    showNotification(`${name} added!`);
  };

  // Helper: Save Cart
  function saveCart() {
    localStorage.setItem('foodChapChapCart', JSON.stringify(cart));
  }

  // Helper: Update Count Badge
  function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    if (totalItems > 0) {
      cartFab.style.transform = 'scale(1.1)';
      setTimeout(() => cartFab.style.transform = 'scale(1)', 200);
    }
  }

  // Helper: Notification
  function showNotification(msg) {
    notification.textContent = msg;
    notification.classList.add('show');
    setTimeout(() => {
      notification.classList.remove('show');
    }, 2000);
  }

  // Helper: Render Cart
  window.renderCart = function () {
    cartItemsContainer.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">Your cart is empty.</p>';
      cartTotalSection.style.display = 'none';
      checkoutBtn.style.display = 'none';
      return;
    }

    cart.forEach((item, index) => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;

      const div = document.createElement('div');
      div.className = 'cart-item';
      div.innerHTML = `
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p style="color: var(--primary); font-weight: 600;">KSh ${item.price} x ${item.quantity}</p>
                </div>
                <div class="cart-item-controls">
                    <button class="btn-small" onclick="changeQty(${index}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="btn-small" onclick="changeQty(${index}, 1)">+</button>
                </div>
            `;
      cartItemsContainer.appendChild(div);
    });

    cartTotalValue.textContent = `KSh ${total.toLocaleString()}`;
    cartTotalSection.style.display = 'flex';
    checkoutBtn.style.display = 'flex';
  };

  // Helper: Change Quantity
  window.changeQty = function (index, change) {
    if (cart[index].quantity === 1 && change === -1) {
      if (confirm('Remove this item?')) {
        cart.splice(index, 1);
      }
    } else {
      cart[index].quantity += change;
    }
    saveCart();
    updateCartCount();
    renderCart();
  };

  // Checkout
  checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) return;

    let message = `Hi FoodChapChap 👋\nI'd like to place an order:\n\n`;
    let total = 0;

    cart.forEach(item => {
      message += `▪️ ${item.quantity}x ${item.name} @ KSh ${item.price}\n`;
      total += item.price * item.quantity;
    });

    message += `\n*Total: KSh ${total.toLocaleString()}*\n\nMy Delivery Location: ______\nMy Name: ______`;

    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  });

  // Initialize
  updateCartCount();

  // ================= AI CHAT BOT LOGIC =================

  // DeepSeek API Config
  const API_KEY = "sk-f1392fdeb8e54fb79e5b776a35343a53"; // WARNING: Client-side Key Exposure
  const API_URL = "https://api.deepseek.com/chat/completions";

  const systemPrompt = `
      You are the friendly AI waiter for FoodChapChap. 
      We sell:
      - Burgers: ChapChap Crunch (450), Cheesy Beef (500), Big Boss (750).
      - Chicken: 2pc+Chips (490), 3pc Meal (690), 9pc Bucket (1850).
      - Fries: Masala Chips (300), Spicy Wings (450), Onion Rings (350).
      - Combos: Couple's Pack (1500), Party Box (2000).
      - Drinks: Soda (100), Milkshake (350).

      Your goal is to help customers decide what to eat. 
      Keep answers short (under 50 words), appetizing, and fun.
      If they want to order, tell them to click the "Add to Cart" button or use the "Order on WhatsApp" button.
      Don't take orders directly yourself, just guide them.
    `;

  // Messages history
  let messages = [
    { role: "system", content: systemPrompt },
    { role: "assistant", content: "Hi! hungry? I can help you choose the best meal! 🍔🍟" }
  ];

  // Add Chat UI
  const chatHTML = `
      <div class="chat-fab" id="chatFab">
        <i class="fas fa-robot" style="font-size: 1.5rem;"></i>
      </div>

      <div class="chat-window" id="chatWindow">
        <div class="chat-header">
          <h3>FoodChap AI 🤖</h3>
          <span class="close-cart" id="closeChat" style="color: white;">&times;</span>
        </div>
        <div class="chat-messages" id="chatMessages">
           <!-- Messages go here -->
        </div>
        <div class="chat-input-area">
          <input type="text" id="chatInput" placeholder="Ask about our burgers..." />
          <button class="chat-send" id="chatSend"><i class="fas fa-paper-plane"></i></button>
        </div>
      </div>
    `;

  if (!document.getElementById('chatFab')) {
    const div = document.createElement('div');
    div.innerHTML = chatHTML;
    body.appendChild(div);
  }

  const chatFab = document.getElementById('chatFab');
  const chatWindow = document.getElementById('chatWindow');
  const closeChat = document.getElementById('closeChat');
  const chatMessages = document.getElementById('chatMessages');
  const chatInput = document.getElementById('chatInput');
  const chatSend = document.getElementById('chatSend');

  // Toggle Chat
  chatFab.addEventListener('click', () => {
    chatWindow.classList.toggle('active');
    if (chatWindow.classList.contains('active') && messages.length === 2) {
      renderMessages(); // Render initial greeting
    }
  });

  closeChat.addEventListener('click', () => {
    chatWindow.classList.remove('active');
  });

  // Send Message
  async function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    // 1. Add User Message
    messages.push({ role: "user", content: text });
    chatInput.value = '';
    renderMessages();

    // 2. Show Typing
    showTyping();

    // 3. Call API
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: messages,
          stream: false
        })
      });

      const data = await response.json();

      if (data.choices && data.choices.length > 0) {
        const aiResponse = data.choices[0].message.content;
        messages.push({ role: "assistant", content: aiResponse });
      } else {
        messages.push({ role: "assistant", content: "Oops, I'm having trouble thinking right now. Try again!" });
      }

    } catch (error) {
      console.error("AI Error:", error);
      // alert("AI Error Details: " + error.message); // Uncomment for debugging
      messages.push({ role: "assistant", content: "Sorry, my brain froze! 🥶 (Error: " + error.message + ")" });
    }

    // 4. Remove typing and render
    renderMessages();
  }

  chatSend.addEventListener('click', sendMessage);
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });

  function renderMessages() {
    chatMessages.innerHTML = '';

    // Filter out system message
    const visibleMessages = messages.filter(m => m.role !== 'system');

    visibleMessages.forEach(msg => {
      const div = document.createElement('div');
      div.className = `message ${msg.role === 'assistant' ? 'bot' : 'user'}`;
      div.textContent = msg.content;
      chatMessages.appendChild(div);
    });

    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function showTyping() {
    const div = document.createElement('div');
    div.className = 'typing';
    div.innerHTML = '<div class="dot"></div><div class="dot"></div><div class="dot"></div>';
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

});
