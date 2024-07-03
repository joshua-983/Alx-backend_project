document.addEventListener('DOMContentLoaded', function() {
    // Initial setup
    const mainContent = document.getElementById('main-content');
    const cartItems = document.getElementById('cart-items');
    let cart = [];

    // Function to show a specific page and hide others
    function showPage(pageId) {
        // Hide all sections
        const sections = mainContent.children;
        for (let section of sections) {
            section.style.display = 'none';
        }
        // Show the selected section
        document.getElementById(pageId).style.display = 'block';
    }

    // Expose showPage function to global scope
    window.showPage = showPage;

    // Function to add an item to the cart
    function addToCart(itemName, itemPrice) {
        // Add item to cart array
        cart.push({ name: itemName, price: itemPrice });
        renderCart(); // Update the cart display
    }

    // Expose addToCart function to global scope
    window.addToCart = addToCart;

    // Function to render the cart items on the page
    function renderCart() {
        // Clear existing items
        cartItems.innerHTML = '';
        // Add all items in the cart
        cart.forEach((item, index) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'cart-item';
            itemDiv.innerHTML = `
                <span>${item.name} - $${item.price.toFixed(2)}</span>
                <button onclick="removeFromCart(${index})">Remove</button>
            `;
            cartItems.appendChild(itemDiv);
        });
    }

    // Function to remove an item from the cart
    function removeFromCart(index) {
        // Remove item from cart array
        cart.splice(index, 1);
        renderCart(); // Update the cart display
    }

    // Expose removeFromCart function to global scope
    window.removeFromCart = removeFromCart;

    // Show home page by default
    showPage('home');

    // Fetch menu items from the server
    fetch('http://localhost:8000/menu')
        .then(response => response.json())
        .then(data => {
            const menuSection = document.getElementById('menu');
            data.forEach(item => {
                const menuItemDiv = document.createElement('div');
                menuItemDiv.className = 'menu-item';
                menuItemDiv.innerHTML = `
                    <h2>${item.name}</h2>
                    <p>$${item.price.toFixed(2)}</p>
                    <button onclick="addToCart('${item.name}', ${item.price})">Add to Cart</button>
                `;
                menuSection.appendChild(menuItemDiv);
            });
        });

    // Handle contact form submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const formData = new FormData(contactForm);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                message: formData.get('message')
            };
            fetch('http://localhost:8000/submit_contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(result => {
                alert(result.message);
                contactForm.reset();
            });
        });
    }

    // Handle sign up form submission
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const formData = new FormData(signupForm);
            const data = {
                username: formData.get('username'),
                email: formData.get('email'),
                password: formData.get('password')
            };
            fetch('http://localhost:8000/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(result => {
                alert(result.message);
                signupForm.reset();
            });
        });
    }

    // Handle login form submission
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const formData = new FormData(loginForm);
            const data = {
                email: formData.get('email'),
                password: formData.get('password')
            };
            fetch('http://localhost:8000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(result => {
                if (result.message) {
                    alert(result.message);
                    loginForm.reset();
                } else if (result.error) {
                    alert(result.error);
                }
            });
        });
    }

    // Example JavaScript to handle search functionality
    document.addEventListener('DOMContentLoaded', function() {
        // Fetch menu items initially when the page loads
        fetchMenuItems();
    });

    // Function to fetch menu items from the server
    async function fetchMenuItems() {
        try {
            const response = await fetch('http://localhost:8000/menu');  // Replace with your Flask server URL
            if (!response.ok) {
                throw new Error('Failed to fetch menu items');
            }
            const menuItems = await response.json();
            displayMenuItems(menuItems);
        } catch (error) {
            console.error('Error fetching menu items:', error);
        }
    }

    // Function to display menu items on the page
    function displayMenuItems(menuItems) {
        const menuItemsContainer = document.getElementById('menu-items');
        menuItemsContainer.innerHTML = '';  // Clear previous menu items

        menuItems.forEach(item => {
            const menuItemElement = document.createElement('div');
            menuItemElement.classList.add('menu-item');
            menuItemElement.innerHTML = `
                <h2>${item.name}</h2>
                <p>$${item.price.toFixed(2)}</p>
                <button onclick="addToCart('${item.name}', ${item.price})">Add to Cart</button>
            `;
            menuItemsContainer.appendChild(menuItemElement);
        });
    }

    // Function to handle search functionality
    async function searchMenu() {
        const searchInput = document.getElementById('search').value.trim().toLowerCase();
        if (searchInput === '') {
            // If search input is empty, fetch all menu items
            fetchMenuItems();
            return;
        }

        try {
            const response = await fetch(`http://localhost:8000/menu?search=${encodeURIComponent(searchInput)}`);
            if (!response.ok) {
                throw new Error('Failed to search menu items');
            }
            const searchResults = await response.json();
            displayMenuItems(searchResults);
        } catch (error) {
            console.error('Error searching menu items:', error);
        }
    }

});

