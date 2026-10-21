// Base de datos simulada de productos
const products = [
    {
        id: 1,
        title: "Faldas Globo",
        price: 18000,
        category: "mujer",
        size: "M",
        condition: "segunda",
        desc: "Hermosas faldas basicas, para que las puedas combinar con todo!",
        images: [
            "falda_globo1.jpeg",
            "falda_globo2.jpeg",
            "falda_globo3.jpeg",
            "falda_globo4.jpeg",
            "falda_globo5.jpeg"
        ]
    },
    {
        id: 2,
        title: "Conjunto, camisa + pantalon",
        price: 40000,
        category: "mujer",
        size: "L",
        condition: "nueva",
        desc: "Conjunto chic, para cualquier ocasion.",
        images: [
           "conjunto_chic.jpeg"
        ]
    },
    {
        id: 3,
        title: "Falda Tubo Larga",
        price: 20000,
        category: "hombre",
        size: "M",
        condition: "segunda",
        desc: "Falda tubo larga con abertura, para que no dejes de ser sexy pero a la vez elegante",
        images: [
           "falda_tubo.jpeg"
        ]
    },
    {
        id: 4,
        title: "Conjuntos falda + pantalon",
        price: 18000,
        category: "ninos",
        size: "S",
        condition: "nueva",
        desc: "Conjuntos de falda y pantalon, con colores pasteles hermosos.",
        images: [
            "conjunto1.jpeg",
            "conjunto2.jpeg"
        ]
    }
];

let cart = [];
let currentProduct = null;

// Elementos del DOM
const productContainer = document.getElementById('product-container');
const modal = document.getElementById('product-modal');
const closeModal = document.querySelector('.close-modal');

// Renderizar Productos
function renderProducts(productsToRender) {
    productContainer.innerHTML = '';
    productsToRender.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.onclick = () => openModal(product);
        
        card.innerHTML = `
            <img src="${product.images[0]}" alt="${product.title}">
            <h4 class="product-title">${product.title}</h4>
            <p class="product-price">$${product.price.toLocaleString('es-CO')} COP</p>
            <span class="badge">${product.condition}</span>
        `;
        productContainer.appendChild(card);
    });
}

// Filtros
const filterBtns = document.querySelectorAll('.filter-btn');
const sizeFilter = document.getElementById('size-filter');
const conditionFilter = document.getElementById('condition-filter');

function applyFilters() {
    let category = document.querySelector('.filter-btn.active').dataset.filter;
    let size = sizeFilter.value;
    let condition = conditionFilter.value;

    let filtered = products.filter(p => {
        let matchCat = category === 'all' || p.category === category;
        let matchSize = size === 'all' || p.size === size;
        let matchCond = condition === 'all' || p.condition === condition;
        return matchCat && matchSize && matchCond;
    });

    renderProducts(filtered);
}

filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        filterBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        applyFilters();
    });
});

sizeFilter.addEventListener('change', applyFilters);
conditionFilter.addEventListener('change', applyFilters);

// Lógica del Modal
function openModal(product) {
    currentProduct = product;
    document.getElementById('modal-title').textContent = product.title;
    document.getElementById('modal-price').textContent = `$${product.price.toLocaleString('es-CO')} COP`;
    document.getElementById('modal-condition').textContent = `Condición: ${product.condition.charAt(0).toUpperCase() + product.condition.slice(1)}`;
    document.getElementById('modal-desc').textContent = product.desc;
    document.getElementById('modal-size').textContent = product.size;
    
    const mainImg = document.getElementById('main-modal-img');
    mainImg.src = product.images[0];
    
    const thumbnails = document.getElementById('modal-thumbnails');
    thumbnails.innerHTML = '';
    product.images.forEach(imgSrc => {
        let thumb = document.createElement('img');
        thumb.src = imgSrc;
        thumb.onclick = () => mainImg.src = imgSrc;
        thumbnails.appendChild(thumb);
    });

    modal.style.display = 'block';
}

closeModal.onclick = () => modal.style.display = 'none';
window.onclick = (e) => {
    if (e.target == modal) modal.style.display = 'none';
}

// Lógica del Carrito
const cartIcon = document.getElementById('cart-icon');
const cartSidebar = document.getElementById('cart-sidebar');
const closeCart = document.getElementById('close-cart');
const cartOverlay = document.getElementById('cart-overlay');
const cartItemsContainer = document.getElementById('cart-items-container');
const cartCount = document.getElementById('cart-count');
const cartTotalPrice = document.getElementById('cart-total-price');
const modalAddToCartBtn = document.getElementById('modal-add-to-cart');

function toggleCart() {
    cartSidebar.classList.toggle('open');
    cartOverlay.style.display = cartSidebar.classList.contains('open') ? 'block' : 'none';
}

cartIcon.onclick = toggleCart;
closeCart.onclick = toggleCart;
cartOverlay.onclick = toggleCart;

modalAddToCartBtn.onclick = () => {
    cart.push(currentProduct);
    updateCart();
    modal.style.display = 'none';
    toggleCart();
};

function updateCart() {
    cartItemsContainer.innerHTML = '';
    let total = 0;
    
    cart.forEach((item, index) => {
        total += item.price;
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.images[0]}" alt="${item.title}">
            <div class="cart-item-details">
                <h4>${item.title}</h4>
                <p>$${item.price.toLocaleString('es-CO')} COP</p>
                <button class="remove-item" onclick="removeFromCart(${index})">Eliminar</button>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);
    });

    cartCount.textContent = cart.length;
    cartTotalPrice.textContent = `$${total.toLocaleString('es-CO')} COP`;
}

// Función global para eliminar desde el HTML inyectado
window.removeFromCart = function(index) {
    cart.splice(index, 1);
    updateCart();
}

// Inicializar
renderProducts(products);

// --- NUEVAS FUNCIONES PARA LOS BOTONES ---

// 1. Botón "Comprar Ahora" (Desliza hacia los productos)
const shopNowBtn = document.querySelector('.shop-now-btn');
if (shopNowBtn) {
    shopNowBtn.addEventListener('click', () => {
        // Desliza suavemente hasta la sección de filtros/productos
        document.querySelector('.filters-section').scrollIntoView({ behavior: 'smooth' });
    });
}

// 2. Lupa de Buscar (Filtra por nombre de la prenda)
const searchIcon = document.querySelector('.fa-search');
if (searchIcon) {
    searchIcon.addEventListener('click', () => {
        let busqueda = prompt("¿Qué prenda estás buscando? (Ej: blusa, chaqueta...)");
        
        if (busqueda !== null && busqueda.trim() !== "") {
            // Busca productos que incluyan la palabra escrita
            let filtrados = products.filter(p => p.title.toLowerCase().includes(busqueda.toLowerCase()));
            
            if (filtrados.length > 0) {
                renderProducts(filtrados); // Muestra los que encontró
            } else {
                alert("No encontramos prendas con ese nombre, ¡pero sigue explorando nuestras joyitas!");
                renderProducts(products); // Vuelve a mostrar todo si no encuentra nada
            }
        } else if (busqueda === "") {
            renderProducts(products); // Si deja en blanco, muestra todo
        }
    });
}

// 3. Corazón de Favoritos (Mensaje de próximamente)
const heartIcon = document.querySelector('.fa-heart');
if (heartIcon) {
    heartIcon.addEventListener('click', () => {
        alert("¡Muy pronto podrás guardar tus prendas shantasticas favoritas aquí! 💕");
    });
}