const pizzas = [
    {name: "Marghareta", price: 105, picURL: "./media/pizzas/marghareta.jpg", modalTag: "falafelPlateModal"},
    {name: "Kebab pizza", price: 145, picURL: "./media/pizzas/kebabpizza.jpg", modalTag: "falafelPlateModal"},
    {name: "Hawaii pizza", price: 145, picURL: "./media/pizzas/hawaii.jpg", modalTag: "falafelPlateModal"}
];

const plates = [
    {name: "Falafeltallrik", price: 115, picURL: "./media/plates/falafel.jpg", modalTag: "falafelPlateModal"},
    {name: "Kebabtallrik", price: 145, picURL: "./media/plates/kebabplate.jpg", modalTag: "falafelPlateModal"},
    {name: "Shawarmatallrik", price: 155, picURL: "./media/plates/shawarma.jpg", modalTag: "falafelPlateModal"},
    {name: "Marghareta", price: 105, picURL: "./media/pizzas/marghareta.jpg", modalTag: "falafelPlateModal"},
    {name: "Kebab pizza", price: 145, picURL: "./media/pizzas/kebabpizza.jpg", modalTag: "falafelPlateModal"},
    {name: "Hawaii pizza", price: 145, picURL: "./media/pizzas/hawaii.jpg", modalTag: "falafelPlateModal"}
];

const cart = [];
const selectedMenuItems = [];

function addToCart(){
    for(const item of selectedMenuItems){
        cart.push(item);
    }
}

function removeFromCart(index){
    cart.splice(index, 1);
}

const plateMenus = document.getElementById("plateMenus");


for(i = 0; i < plates.length; i++){

    createCard(plates[i]);

    //create modal
    
    createModal(plates[i]);

    

    
    
}



//functions

function createCard(menuItem){
    const menuCard = document.createElement("div");
    menuCard.classList.add("card");


    const menuCardImg = document.createElement("img");
    menuCardImg.classList.add("card-img-top");
    menuCardImg.src = menuItem.picURL;
    menuCardImg.alt = "food image";

    const menuCardBody = document.createElement("div");
    menuCardBody.classList.add("card-body");

    const foodTitle = document.createElement("h5");
    foodTitle.innerText = menuItem.name;
    menuCardBody.appendChild(foodTitle);

    const readMoreBtn = document.createElement("button");
    readMoreBtn.classList.add("btn");
    readMoreBtn.classList.add("btn-primary");
    readMoreBtn.setAttribute('data-bs-toggle', 'modal');
    readMoreBtn.setAttribute('data-bs-target', menuItem.modalTag);
    readMoreBtn.textContent = 'More info';
    menuCardBody.appendChild(readMoreBtn);

    const addToCartBtn = document.createElement("button");
    addToCartBtn.classList.add("btn");
    addToCartBtn.classList.add("btn-primary");
    addToCartBtn.textContent = 'Add to cart';
    menuCardBody.appendChild(addToCartBtn);

    menuCard.appendChild(menuCardImg);
    menuCard.appendChild(menuCardBody);

    plateMenus.appendChild(menuCard);
}

function createModal(menuItem){
    const modal = document.createElement("div");
    modal.id = menuItem.modalTag;
    modal.classList.add("modal.dialog", "modal-dialog-centered")

    

    document.body.appendChild(modal);
}