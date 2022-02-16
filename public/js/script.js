////////////
// Loading
////////////
function loader() {
    document.querySelector('.loader-container').classList.add('fade-out');
}
function fadeOut() {
    setInterval(loader, 3000);
}
window.onload = fadeOut;
window.addEventListener('load', function (event) {
    var firstMenu = document.querySelector('.menu-list button');
    loadCategory(firstMenu.id);
    var queryString = window.location.search;
    var urlParams = new URLSearchParams(queryString);
    var id = urlParams.get('id');
    if (id) {
        document.querySelector('#reset-password-form').classList.toggle('active');
    }
});
function loadCategory(menu) {
    var myNodeList = [document.querySelectorAll('.box')];
    Array.from(myNodeList).forEach(function (menuList) {
        for (var i = 0; i < menuList.length; i++) {
            if (menuList[i].id == menu)
                menuList[i].classList.add('show');
            else
                menuList[i].classList.remove('show');
        }
    });
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////
// Menu buttons
/////////////////
var wrapper = document.getElementById('menu-options');
// declare variable to store cart items
var cartItems = [];
// Menu Event listeners
wrapper.addEventListener('click', function (event) {
    var isButton = event.target.nodeName === 'BUTTON';
    if (!isButton) {
        return;
    }
    var itemPrice = parseFloat(event.target.parentElement.querySelector(".price").innerHTML.substring(1));
    var itemName = event.target.parentElement.querySelector("#item-name").innerHTML;
    addCart(itemName, itemPrice);
});
/////////////////////////////////////////////
// Functions communicating with the server
/////////////////////////////////////////////
function insertItemToUserFavorites(itemName) {
    $.ajax({
        url: "".concat(window.location.origin, "/api/user/addFavorite"),
        method: "POST",
        data: { itemName: itemName },
        success: function (data) {
        },
        error: function (err) {
            console.log(err);
        }
    });
}
function removeItemFromUserFavorites(itemName) {
    $.ajax({
        url: "".concat(window.location.origin, "/api/user/removeFavorite"),
        method: "POST",
        data: { itemName: itemName },
        success: function (data) {
        },
        error: function (err) {
            console.log(err);
        }
    });
}
function addCartFromFavorites(event, itemName) {
    event.preventDefault();
    $.ajax({
        url: "".concat(window.location.origin, "/api/item/getPrice"),
        method: "POST",
        data: { itemName: itemName },
        success: function (data) {
            // add item to cart, item price is fetched from database
            addCart(itemName, data[0].price);
        },
        error: function (err) {
            console.log(err);
        }
    });
}
///////////////////////////
// Client side functions
///////////////////////////
// Favorites related functions
function removeFavorites(itemWrapper, itemName) {
    for (var i = 0; i < favoriteItems.length; i++) {
        var result = favoriteItems[i].includes(itemName);
        if (result) {
            // reduce count if there is more than or equal to one item qty
            //remove element if there is only one left
            itemWrapper.parentElement.remove();
            favoriteItems.splice(i, 1);
            removeItemFromUserFavorites(itemName);
            var favoritesStatus = document.querySelector("#favorites-status");
            if (favoriteItems.length === 0) {
                if (favoritesStatus) {
                    favoritesStatus.classList.remove("active");
                }
                else {
                    var favoritesStatus_1 = document.createElement('h3');
                    var favoritesStatusText = document.createTextNode("You don't have favorites yet.");
                    favoritesStatus_1.appendChild(favoritesStatusText);
                    favoritesStatus_1.setAttribute("id", "favorites-status");
                    var element = document.querySelector(".favorites");
                    element.appendChild(favoritesStatus_1);
                }
            }
            break;
        }
    }
}
function addFavorite() {
    var itemName = event.target.parentElement.parentElement.querySelector(".content #item-name").innerHTML;
    for (var i = 0; i < favoriteItems.length; i++) {
        var result = favoriteItems[i].includes(itemName);
        if (result) {
            return;
        }
    }
    if (favoriteItems.length === 0) {
        var favoritesStatus = document.querySelector("#favorites-status");
        if (favoritesStatus) {
            favoritesStatus.classList.add("active");
        }
    }
    favoriteItems.push([itemName]);
    insertItemToUserFavorites(itemName);
    if (!result) {
        var favoritesWrapper = document.createElement('div');
        var itemWrapper_1 = document.createElement('div');
        var itemNameTag = document.createElement('h3');
        var itemNameText = document.createTextNode(itemName);
        var addCartButtonTag = document.createElement('button');
        var addCartButtonText = document.createTextNode('Add to Cart');
        var removeButtonTag = document.createElement('button');
        var removeButtonText = document.createTextNode('Remove');
        itemNameTag.appendChild(itemNameText);
        addCartButtonTag.appendChild(addCartButtonText);
        removeButtonTag.appendChild(removeButtonText);
        addCartButtonTag.addEventListener('click', function (event) {
            addCartFromFavorites(event, itemName);
        });
        removeButtonTag.addEventListener('click', function (event) {
            removeFavorites(itemWrapper_1, itemName);
        });
        favoritesWrapper.setAttribute("class", "favorite-items");
        addCartButtonTag.setAttribute("class", "add-cart-btn");
        removeButtonTag.setAttribute("class", "remove-favorite-btn");
        itemWrapper_1.setAttribute("id", "item_" + (cartItems.length));
        itemWrapper_1.appendChild(itemNameTag);
        itemWrapper_1.appendChild(addCartButtonTag);
        itemWrapper_1.appendChild(removeButtonTag);
        favoritesWrapper.appendChild(itemWrapper_1);
        var element = document.querySelector(".favorites");
        element.appendChild(favoritesWrapper);
    }
}
// cart related functions
function addCart(itemName, itemPrice) {
    for (var i = 0; i < cartItems.length; i++) {
        var result = cartItems[i].includes(itemName);
        //if found item then add to the counter
        if (result) {
            // Increase counter on the corresponding item
            cartItems[i][2] = cartItems[i][2] + 1;
            // Find item from ID
            var itemWrapper_2 = document.querySelector("#item_" + i);
            var itemCount = itemWrapper_2.querySelector(".count");
            // increase counter by 1 on the HTML Element
            itemCount.innerHTML = (parseInt(itemCount.innerHTML) + 1).toString();
            // calculate subTotal
            changeSubTotal(true, itemPrice);
            // increase counter for the icon
            increaseItemCounter();
            // Exit function
            return;
        }
    }
    // Continue function if item was not found
    // Hide "Your cart is empty" message
    var cartStatus = document.querySelector("#cart-status");
    if (cartItems.length === 0) {
        cartStatus.classList.add("active");
    }
    // Create item on client side
    // HTML Elements to be created dynamically
    var itemWrapper = document.createElement('div');
    var itemCountTag = document.createElement('p');
    var itemNameTag = document.createElement('p');
    var itemPriceTag = document.createElement('p');
    var removeButtonTag = document.createElement('button');
    // Text nodes for the above created HTML Elements
    var itemCountText = document.createTextNode('1');
    var itemNameText = document.createTextNode(itemName);
    var itemPriceText = document.createTextNode("$" + itemPrice);
    var removeButtonText = document.createTextNode('Remove');
    // Append text nodes to HTML Elements
    itemCountTag.appendChild(itemCountText);
    itemNameTag.appendChild(itemNameText);
    itemPriceTag.appendChild(itemPriceText);
    removeButtonTag.appendChild(removeButtonText);
    // Set attributes
    removeButtonTag.setAttribute("class", "remove-btn");
    itemCountTag.setAttribute("class", "count");
    itemWrapper.setAttribute("id", "item_" + (cartItems.length));
    // Event listener
    removeButtonTag.addEventListener('click', function (event) {
        removeCart(itemWrapper, itemName, itemPrice, itemCountTag);
    });
    // Append HTML Elements to item wrapper
    itemWrapper.appendChild(itemCountTag);
    itemWrapper.appendChild(itemNameTag);
    itemWrapper.appendChild(itemPriceTag);
    itemWrapper.appendChild(removeButtonTag);
    // find cart element
    var element = document.querySelector(".cart-items");
    // add item to cart element
    element.appendChild(itemWrapper);
    // push item to variable
    cartItems.push([itemName, itemPrice, 1]);
    // calculate subTotal
    changeSubTotal(true, itemPrice);
    // increase counter for the icon
    increaseItemCounter();
}
function removeCart(itemWrapper, itemName, itemPrice, itemCountTag) {
    for (var i = 0; i < cartItems.length; i++) {
        var result = cartItems[i].includes(itemName);
        if (result) {
            // reduce count if there is more than or equal to one item qty
            if (cartItems[i][2] > 1) {
                cartItems[i][2] = cartItems[i][2] - 1;
                itemCountTag.innerHTML = parseInt(itemCountTag.innerHTML) - 1;
            }
            else {
                //remove element if there is only one left
                itemWrapper.parentElement.removeChild(itemWrapper);
                cartItems.splice(i, 1);
                var cartStatus = document.querySelector("#cart-status");
                if (cartItems.length === 0) {
                    cartStatus.classList.remove("active");
                }
            }
            // calculate subTotal
            changeSubTotal(false, itemPrice);
            // decrease counter for the icon
            decreaseItemCounter();
            break;
        }
    }
}
function changeSubTotal(sign, itemPrice) {
    var subTotal = document.querySelector(".sub-total #value");
    if (sign)
        subTotal.innerHTML = "$" + (parseFloat(subTotal.innerHTML.substring(1)) + itemPrice).toFixed(2);
    else
        subTotal.innerHTML = "$" + (parseFloat(subTotal.innerHTML.substring(1)) - itemPrice).toFixed(2);
}
function increaseItemCounter() {
    var iconItemCounter = document.querySelector(".order-counter");
    iconItemCounter.innerHTML = (parseInt(iconItemCounter.innerHTML) + 1).toString();
}
function decreaseItemCounter() {
    var iconItemCounter = document.querySelector(".order-counter");
    iconItemCounter.innerHTML = (parseInt(iconItemCounter.innerHTML) - 1).toString();
}
// Admin Panel Toggles
function toggleAdminPanel() {
    document.querySelector('#admin-form').classList.toggle('active');
}
function toggleAddItem() {
    document.querySelector('#add-item-form').classList.toggle('active');
}
function toggleEditItem() {
    document.querySelector('#edit-item-form').classList.toggle('active');
}
var menu = document.querySelector('#menu-bars');
var navbar = document.querySelector('.navbar');
menu.onclick = function () {
    menu.classList.toggle('fa-times');
    navbar.classList.toggle('active');
};
var section = document.querySelectorAll('section');
var navLinks = document.querySelectorAll('header .navbar a');
window.onscroll = function () {
    menu.classList.remove('fa-times');
    navbar.classList.remove('active');
    section.forEach(function (sec) {
        var top = window.scrollY;
        var height = sec.offsetHeight;
        var offset = sec.offsetTop - 150;
        var id = sec.getAttribute('id');
        if (top >= offset && top < offset + height) {
            navLinks.forEach(function (links) {
                links.classList.remove('active');
                document.querySelector('header .navbar a[href*=' + id + ']').classList.add('active');
            });
        }
        ;
    });
};
//////////////////////////
// Navbar Buttons
/////////////////////////
// Toggle Button for User Window
var loginIcon = document.querySelector('#login-icon');
if (loginIcon) {
    loginIcon.onclick = function () {
        document.querySelector('#login-form').classList.toggle('active');
    };
}
// Toggle Button for User Window
var userIcon = document.querySelector('#user-icon');
if (userIcon) {
    userIcon.onclick = function () {
        document.querySelector('#profile-form').classList.toggle('active');
    };
}
// Toggle Button for Cart Window
var toggleCartBtn = document.querySelector('#cart-icon');
toggleCartBtn.onclick = function () {
    document.querySelector('.favorites-wrapper').classList.remove('active');
    document.querySelector('.cart-wrapper').classList.toggle('active');
};
// Toggle Button for Favorites Window
var toggleFavoritesBtn = document.querySelector('#favorites-icon');
toggleFavoritesBtn.onclick = function (e) {
    e.preventDefault();
    document.querySelector('.cart-wrapper').classList.remove('active');
    document.querySelector('.favorites-wrapper').classList.toggle('active');
};
// Function to close favorites window when cart window is triggered to be opened
function openCart() {
    document.querySelector('.favorites-wrapper').classList.remove('active');
    document.querySelector('.cart-wrapper').classList.add('active');
}
var editAddress = document.querySelector('#edit-address');
if (editAddress) {
    editAddress.onclick = function () {
        document.querySelector('#address-form').classList.toggle('active');
    };
}
var editPhoneNumber = document.querySelector('#edit-phone-number');
if (editPhoneNumber) {
    editPhoneNumber.onclick = function () {
        document.querySelector('#phone-number-form').classList.toggle('active');
    };
}
// Close Button for Login Form
var closeLoginBtn = document.querySelector('#close-login');
closeLoginBtn.onclick = function () {
    document.querySelector('#login-form').classList.remove('active');
};
// Close Button for Forgot Password Form
var forgotPasswordCloseBtn = document.querySelector('#close-password-form');
forgotPasswordCloseBtn.onclick = function () {
    document.querySelector('#forgot-password-form').classList.remove('active');
};
// Close Button for Profile Form
var closeProfileBtn = document.querySelector('#close-profile');
closeProfileBtn.onclick = function () {
    document.querySelector('#profile-form').classList.remove('active');
};
// Close Button for Change Address Form
var closeAddressBtn = document.querySelector('#close-address');
closeAddressBtn.onclick = function () {
    document.querySelector('#address-form').classList.remove('active');
};
// Close Button for Change Phone Number Form
var closePhoneNumberBtn = document.querySelector('#close-phone-number');
closePhoneNumberBtn.onclick = function () {
    document.querySelector('#phone-number-form').classList.remove('active');
};
// Close Button for Error message window
var closeErrorBtn = document.querySelector('#close-error');
closeErrorBtn.onclick = function () {
    document.querySelector('#login-error').classList.remove('active');
};
var closeResetPasswordBtn = document.querySelector('#close-reset-password');
closeResetPasswordBtn.onclick = function () {
    document.querySelector('#reset-password-form').classList.remove('active');
};
////////////////////////////
// Swipper Functions
////////////////////////////
var swiper = new Swiper(".mySwiper", {
    spaceBetween: 30,
    centeredSlides: true,
    autoplay: {
        delay: 2500,
        disableOnInteraction: false
    },
    pagination: {
        el: ".swiper-pagination",
        clickable: true
    },
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev"
    }
});
var swiper = new Swiper(".review-slider", {
    spaceBetween: 20,
    centeredSlides: true,
    autoplay: {
        delay: 7500,
        disableOnInteraction: false
    },
    loop: true,
    breakpoints: {
        0: {
            slidesPerView: 1
        },
        640: {
            slidesPerView: 2
        },
        768: {
            slidesPerView: 2
        },
        1024: {
            slidesPerView: 3
        }
    }
});
