////////////
// Loading
////////////
function loader(){
  document.querySelector('.loader-container').classList.add('fade-out');
}

function fadeOut(){
  setInterval(loader, 3000);
}

window.onload = fadeOut;

window.addEventListener('load', (event) => {
  const firstMenu = document.querySelector('.menu-list button')
  loadCategory(firstMenu.id);

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const id = urlParams.get('id');
  if(id)
  {
    document.querySelector('#reset-password-form').classList.toggle('active');
  }
});

function loadCategory(menu: String)
{
  const myNodeList = [document.querySelectorAll('.box')];

  Array.from(myNodeList).forEach(function(menuList) 
  {
    for (let i = 0; i < menuList.length; i++) {
      if(menuList[i].id == menu)
        menuList[i].classList.add('show')
      else
        menuList[i].classList.remove('show')
    }
  });
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////







/////////////////
// Menu buttons
/////////////////
const wrapper = document.getElementById('menu-options') as HTMLElement;

// declare variable to store cart items
var cartItems = [];

// Menu Event listeners
wrapper.addEventListener('click', (event) => {
  const isButton = (<HTMLInputElement>event.target).nodeName === 'BUTTON';
  if (!isButton) 
  {
    return;
  }

  const itemPrice: number = parseFloat((<HTMLInputElement>event.target).parentElement.querySelector(".price").innerHTML.substring(1));
  const itemName: string = (<HTMLInputElement>event.target).parentElement.querySelector("#item-name").innerHTML;

  addCart(itemName, itemPrice);
})

/////////////////////////////////////////////
// Functions communicating with the server
/////////////////////////////////////////////

function insertItemToUserFavorites(itemName: string) 
{
  $.ajax
  ({
      url: `${window.location.origin}/api/user/addFavorite`,
      method: "POST",
      data: {itemName},
      success: function(data: any) 
      {
      },
      error: function(err: any) 
      {
          console.log(err);
      }
  })
}

function removeItemFromUserFavorites(itemName: string) 
{
  $.ajax
  ({
      url: `${window.location.origin}/api/user/removeFavorite`,
      method: "POST",
      data: {itemName},
      success: function(data: any) 
      {
      },
      error: function(err: any) 
      {
          console.log(err);
      }
  })
}

function addCartFromFavorites(event: MouseEvent, itemName: string)
{
    event.preventDefault();
    $.ajax
    ({
        url: `${window.location.origin}/api/item/getPrice`,
        method: "POST",
        data: {itemName},
        success: function(data: any) 
        {
            // add item to cart, item price is fetched from database
            addCart(itemName, data[0].price)
        },
        error: function(err: any) 
        {
            console.log(err);
        }
    })
}


///////////////////////////
// Client side functions
///////////////////////////


// Favorites related functions
function removeFavorites(itemWrapper: HTMLElement, itemName: string) {
  for (var i = 0; i < favoriteItems.length; i++) {
    var result = favoriteItems[i].includes(itemName);

    if(result)
    {
      // reduce count if there is more than or equal to one item qty
        //remove element if there is only one left
        itemWrapper.parentElement.remove();
        favoriteItems.splice(i, 1);
        removeItemFromUserFavorites(itemName);

        const favoritesStatus = document.querySelector("#favorites-status");

        if(favoriteItems.length === 0)
        {
          if(favoritesStatus)
          {
            favoritesStatus.classList.remove("active");
          }
          else
          {
            const favoritesStatus = document.createElement('h3');
            const favoritesStatusText = document.createTextNode("You don't have favorites yet.");
            favoritesStatus.appendChild(favoritesStatusText);
            favoritesStatus.setAttribute("id", "favorites-status");
            const element = document.querySelector(".favorites");
            element.appendChild(favoritesStatus);
            
          }
        }
      break;
    }
  }
}

function addFavorite()
{
  const itemName = (<HTMLInputElement>event.target).parentElement.parentElement.querySelector(".content #item-name").innerHTML;
  for (let i = 0; i < favoriteItems.length; i++) 
  {
    var result: boolean = favoriteItems[i].includes(itemName);

    if(result)
    {
      return;
    }
  }

  if(favoriteItems.length === 0)
  {
    const favoritesStatus = document.querySelector("#favorites-status");
    if(favoritesStatus)
    {
        favoritesStatus.classList.add("active");
    }
  }

  favoriteItems.push([itemName]);

  insertItemToUserFavorites(itemName);

  if(!result)
  {
    const favoritesWrapper = document.createElement('div')
    const itemWrapper = document.createElement('div');
    const itemNameTag = document.createElement('h3');
    const itemNameText = document.createTextNode(itemName);
    const addCartButtonTag = document.createElement('button');
    const addCartButtonText = document.createTextNode('Add to Cart');
    const removeButtonTag = document.createElement('button');
    const removeButtonText = document.createTextNode('Remove');

    itemNameTag.appendChild(itemNameText);
    addCartButtonTag.appendChild(addCartButtonText);
    removeButtonTag.appendChild(removeButtonText);

    addCartButtonTag.addEventListener('click', (event) => {
      addCartFromFavorites(event, itemName);
    });

    removeButtonTag.addEventListener('click', (event) => {
      removeFavorites(itemWrapper, itemName);
    });

    favoritesWrapper.setAttribute("class", "favorite-items");
    addCartButtonTag.setAttribute("class", "add-cart-btn");
    removeButtonTag.setAttribute("class", "remove-favorite-btn");
    

    itemWrapper.setAttribute("id", "item_" + (cartItems.length))

    itemWrapper.appendChild(itemNameTag);
    itemWrapper.appendChild(addCartButtonTag);
    itemWrapper.appendChild(removeButtonTag);

    favoritesWrapper.appendChild(itemWrapper);

    const element = document.querySelector(".favorites");

    element.appendChild(favoritesWrapper);
  }
}


// cart related functions
function addCart(itemName: string, itemPrice: number)
{
  for (let i = 0; i < cartItems.length; i++) {
    var result: boolean = cartItems[i].includes(itemName);

    //if found item then add to the counter
    if(result)
    {
      // Increase counter on the corresponding item
      cartItems[i][2] = cartItems[i][2] + 1;
      // Find item from ID
      const itemWrapper: HTMLElement = document.querySelector("#item_" + i);
      const itemCount: HTMLElement = itemWrapper.querySelector(".count");

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
  const cartStatus = document.querySelector("#cart-status");

  if(cartItems.length === 0)
  {
    cartStatus.classList.add("active");
  }

  // Create item on client side

  // HTML Elements to be created dynamically
  const itemWrapper: HTMLElement = document.createElement('div');
  const itemCountTag: HTMLElement = document.createElement('p');
  const itemNameTag: HTMLElement = document.createElement('p');
  const itemPriceTag: HTMLElement = document.createElement('p');
  const removeButtonTag: HTMLElement = document.createElement('button');
  
  // Text nodes for the above created HTML Elements
  const itemCountText = document.createTextNode('1');
  const itemNameText = document.createTextNode(itemName);
  const itemPriceText = document.createTextNode("$"+ itemPrice);
  const removeButtonText = document.createTextNode('Remove');

  // Append text nodes to HTML Elements
  itemCountTag.appendChild(itemCountText);
  itemNameTag.appendChild(itemNameText);
  itemPriceTag.appendChild(itemPriceText);  
  removeButtonTag.appendChild(removeButtonText);

  // Set attributes
  removeButtonTag.setAttribute("class", "remove-btn");
  itemCountTag.setAttribute("class", "count");
  itemWrapper.setAttribute("id", "item_" + (cartItems.length))

  // Event listener
  removeButtonTag.addEventListener('click', (event) => {
    removeCart(itemWrapper, itemName, itemPrice, itemCountTag);
  });


  // Append HTML Elements to item wrapper
  itemWrapper.appendChild(itemCountTag);
  itemWrapper.appendChild(itemNameTag);
  itemWrapper.appendChild(itemPriceTag);
  itemWrapper.appendChild(removeButtonTag);

  // find cart element
  const element = document.querySelector(".cart-items");

  // add item to cart element
  element.appendChild(itemWrapper);
  // push item to variable
  cartItems.push([itemName, itemPrice, 1]);

  // calculate subTotal

  changeSubTotal(true, itemPrice);

  // increase counter for the icon
  increaseItemCounter();
}

function removeCart(itemWrapper: any, itemName: string, itemPrice: number, itemCountTag: any) {
  for (var i = 0; i < cartItems.length; i++) {
    var result = cartItems[i].includes(itemName);

    if(result)
    {
      // reduce count if there is more than or equal to one item qty
      if(cartItems[i][2] > 1)
      {
        cartItems[i][2] = cartItems[i][2] - 1;
        itemCountTag.innerHTML = parseInt(itemCountTag.innerHTML) - 1;
      }
      else
      {
        //remove element if there is only one left
        itemWrapper.parentElement.removeChild(itemWrapper);
        cartItems.splice(i, 1);

        const cartStatus = document.querySelector("#cart-status");

        if(cartItems.length === 0)
        {
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

function changeSubTotal(sign: boolean, itemPrice: number)
{
  const subTotal = document.querySelector(".sub-total #value");

  if(sign)
    subTotal.innerHTML = "$" + (parseFloat(subTotal.innerHTML.substring(1)) + itemPrice).toFixed(2);
  else
    subTotal.innerHTML = "$" + (parseFloat(subTotal.innerHTML.substring(1)) - itemPrice).toFixed(2);

}

function increaseItemCounter()
{
    const iconItemCounter = document.querySelector(".order-counter");
    iconItemCounter.innerHTML = (parseInt(iconItemCounter.innerHTML) + 1).toString();
}

function decreaseItemCounter()
{
  const iconItemCounter = document.querySelector(".order-counter");
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

let menu = document.querySelector('#menu-bars') as HTMLElement;
let navbar = document.querySelector('.navbar') as HTMLElement;

menu.onclick = () =>{
  menu.classList.toggle('fa-times');
  navbar.classList.toggle('active');
}

let section = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header .navbar a');

window.onscroll = () =>{

  menu.classList.remove('fa-times');
  navbar.classList.remove('active');

  section.forEach(sec =>{

    let top = window.scrollY;
    let height = sec.offsetHeight;
    let offset = sec.offsetTop - 150;
    let id = sec.getAttribute('id');

    if(top >= offset && top < offset + height){
      navLinks.forEach(links =>{
        links.classList.remove('active');
        document.querySelector('header .navbar a[href*='+id+']').classList.add('active');
      });
    };

  });

}


//////////////////////////
// Navbar Buttons
/////////////////////////

// Toggle Button for User Window
const loginIcon: HTMLElement = document.querySelector('#login-icon')
if (loginIcon) {
  loginIcon.onclick = () =>{
    document.querySelector('#login-form').classList.toggle('active');
  }
}

// Toggle Button for User Window
const userIcon: HTMLElement = document.querySelector('#user-icon')
if (userIcon) {
  userIcon.onclick = () => {
    document.querySelector('#profile-form').classList.toggle('active');
  }
}

// Toggle Button for Cart Window
const toggleCartBtn: HTMLButtonElement = document.querySelector('#cart-icon');
toggleCartBtn.onclick = () =>{
  document.querySelector('.favorites-wrapper').classList.remove('active');
  document.querySelector('.cart-wrapper').classList.toggle('active');
}

// Toggle Button for Favorites Window
const toggleFavoritesBtn: HTMLButtonElement = document.querySelector('#favorites-icon');
toggleFavoritesBtn.onclick = (e) =>{
  e.preventDefault();
  document.querySelector('.cart-wrapper').classList.remove('active');
  document.querySelector('.favorites-wrapper').classList.toggle('active');
}

// Function to close favorites window when cart window is triggered to be opened
function openCart() {
  document.querySelector('.favorites-wrapper').classList.remove('active');
  document.querySelector('.cart-wrapper').classList.add('active');
}

const editAddress: HTMLElement = document.querySelector('#edit-address')

if(editAddress) {
  editAddress.onclick = () => {
    document.querySelector('#address-form').classList.toggle('active');
  }
}

const editPhoneNumber: HTMLElement = document.querySelector('#edit-phone-number')

if(editPhoneNumber) {
  editPhoneNumber.onclick = () => {
    document.querySelector('#phone-number-form').classList.toggle('active');
  }
}

// Close Button for Login Form
const closeLoginBtn: HTMLButtonElement = document.querySelector('#close-login');
closeLoginBtn.onclick = () =>{
  document.querySelector('#login-form').classList.remove('active');
}

// Close Button for Forgot Password Form
const forgotPasswordCloseBtn: HTMLButtonElement = document.querySelector('#close-password-form');
forgotPasswordCloseBtn.onclick = () =>{
  document.querySelector('#forgot-password-form').classList.remove('active');
}


// Close Button for Profile Form
const closeProfileBtn: HTMLButtonElement = document.querySelector('#close-profile');

closeProfileBtn.onclick = () =>{
  document.querySelector('#profile-form').classList.remove('active');
}

// Close Button for Change Address Form
const closeAddressBtn: HTMLButtonElement = document.querySelector('#close-address');

closeAddressBtn.onclick = () =>{
  document.querySelector('#address-form').classList.remove('active');
}

// Close Button for Change Phone Number Form
const closePhoneNumberBtn: HTMLButtonElement = document.querySelector('#close-phone-number');

closePhoneNumberBtn.onclick = () =>{
  document.querySelector('#phone-number-form').classList.remove('active');
}

// Close Button for Error message window
const closeErrorBtn: HTMLButtonElement = document.querySelector('#close-error');

closeErrorBtn.onclick = () =>
{
  document.querySelector('#login-error').classList.remove('active');
}

const closeResetPasswordBtn: HTMLButtonElement = document.querySelector('#close-reset-password')
closeResetPasswordBtn.onclick = () =>
{
  document.querySelector('#reset-password-form').classList.remove('active');
}


////////////////////////////
// Swipper Functions
////////////////////////////

var swiper = new Swiper(".mySwiper", {
  spaceBetween: 30,
  centeredSlides: true,
  autoplay: {
    delay: 2500,
    disableOnInteraction: false,
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});

var swiper = new Swiper(".review-slider", {
  spaceBetween: 20,
  centeredSlides: true,
  autoplay: {
    delay: 7500,
    disableOnInteraction: false,
  },
  loop:true,
  breakpoints: {
    0: {
        slidesPerView: 1,
    },
    640: {
      slidesPerView: 2,
    },
    768: {
      slidesPerView: 2,
    },
    1024: {
      slidesPerView: 3,
    },
  },
});