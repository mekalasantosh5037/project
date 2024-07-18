// console.log('====================================');
// console.log("Connected");
// console.log('====================================');



document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json';
    const productsContainer = document.getElementById('products-container');
    let currentActiveButton = document.querySelector('.category-button.active');

    // Fetch data from the API
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Find products for 'Men' category and display them
            const mensCategory = data.categories.find(category => category.category_name === 'Men');
            if (mensCategory) {
                displayCategoryProducts(mensCategory.category_products);
            }

            // Add click event listeners to category buttons
            const categoryButtons = document.querySelectorAll('.category-button');
            categoryButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const categoryName = button.textContent.trim();
                    const categoryData = data.categories.find(category => category.category_name === categoryName);
                    if (categoryData) {
                        // Show products for the clicked category
                        displayCategoryProducts(categoryData.category_products);
                        setActiveButton(button);
                    }
                });
            });
        })
        .catch(error => {
            console.error('Error fetching the data:', error);
        });

    // Function to display products
    function displayCategoryProducts(products) {
        productsContainer.innerHTML = '';
        products.forEach(product => {
            // Create a card for each product
            const productCard = createProductCard(product);
            productsContainer.appendChild(productCard);
        });
    }

    function createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';

        const imageContainer = document.createElement('div');
        imageContainer.className = 'image-container';

        // Display the product's image
        const productImage = document.createElement('img');
        productImage.src = product.image;
        imageContainer.appendChild(productImage);

        // Show a badge if there's one for the product
        if (product.badge_text) {
            const badge = document.createElement('span');
            badge.className = 'badge';
            badge.textContent = product.badge_text;
            imageContainer.appendChild(badge);
        }

        card.appendChild(imageContainer);

        const detailsContainer = document.createElement('div');
        detailsContainer.className = 'details-container';

        const titleAndVendorContainer = document.createElement('div');
        titleAndVendorContainer.className = 'title-and-vendor';

        const productTitle = document.createElement('h2');
        productTitle.textContent = truncateText(product.title, 10); // Truncate the title to 10 characters
        titleAndVendorContainer.appendChild(productTitle);

        const productVendor = document.createElement('li');
        productVendor.textContent = product.vendor;
        titleAndVendorContainer.appendChild(productVendor);

        detailsContainer.appendChild(titleAndVendorContainer);

        const priceContainer = document.createElement('div');
        priceContainer.className = 'price-container';

        const productPrice = document.createElement('p');
        productPrice.textContent = `Rs ${product.price}.00`;
        productPrice.className = 'price-p';
        priceContainer.appendChild(productPrice);

        if (product.compare_at_price) {
            const originalPrice = document.createElement('p');
            originalPrice.textContent = `Rs ${product.compare_at_price}`;
            originalPrice.className = 'price';
            originalPrice.style.textDecoration = 'line-through'; // Add line-through style

            priceContainer.appendChild(originalPrice);

            const discountPercent = document.createElement('p');
            const percent = Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100);
            discountPercent.textContent = `${percent}% Off`;
            discountPercent.style.color = 'red';
            discountPercent.className = 'discount';
            priceContainer.appendChild(discountPercent);
        }

        detailsContainer.appendChild(priceContainer);

        const addToCartButton = document.createElement('button');
        addToCartButton.textContent = 'Add to Cart';
        addToCartButton.className = 'add-to-cart';
        detailsContainer.appendChild(addToCartButton);

        card.appendChild(detailsContainer);

        return card;
    }

    function truncateText(text, maxLength) {
        if (text.length <= maxLength) {
            return text;
        }
        return text.substring(0, maxLength) + '...';
    }

    function setActiveButton(button) {
        if (currentActiveButton) {
            currentActiveButton.classList.remove('active');
        }
        button.classList.add('active');
        currentActiveButton = button;
    }
});
