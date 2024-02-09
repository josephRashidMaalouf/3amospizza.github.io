

const plates = [
    {name: "Falafeltallrik", price: 115, picURL: "./media/plates/falafel.jpg", modalTag: "falafelPlateModal", description: "Krispig falafel med krispiga pommes, färsk sallad och vår hemlagade tarator."},
    {name: "Kebabtallrik", price: 145, picURL: "./media/plates/kebabplate.jpg", modalTag: "kebabPlateModal", description: "Mört nötkött, krispiga pommes, fräsch sallad och valfri sås. En smakresa till traditionella smaker!"},
    {name: "Shawarmatallrik", price: 155, picURL: "./media/plates/shawarma.jpg", modalTag: "ShawarmaPlateModal", description: "Traditionell shawarma med pommes, fräsch sallad och våra hemliga kryddor. En smakupplevelse utöver det vanliga!"},
    {name: "Marghareta", price: 105, picURL: "./media/pizzas/marghareta.jpg", modalTag: "margharetaPizzaModal", description: " En klassisk Margherita pizza med mozzarella, tomater och basilika. En enkel men älskad favorit!"},
    {name: "Kebab pizza", price: 145, picURL: "./media/pizzas/kebabpizza.jpg", modalTag: "KebabPizzaModal", description: "Mör kebab, smältande ost och krispiga grönsaker. En perfekt fusion av smaker på en pizza!"},
    {name: "Hawaii pizza", price: 145, picURL: "./media/pizzas/hawaii.jpg", modalTag: "hawaiiPizzaModal", description: " En tropisk smakresa med ananas, skinka och ost. Sött och salt, perfekt balanserad!"}
];

const cart = [];

const plateMenus = document.getElementById("plateMenus");

let itemsInBasket = document.getElementById("itemsInBasket");
itemsInBasket.innerText = 0;


for(i = 0; i < plates.length; i++){

    createCard(plates[i]);

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
    readMoreBtn.setAttribute('data-bs-target', '#'+ menuItem.modalTag);
    readMoreBtn.textContent = 'Mer info';
    menuCardBody.appendChild(readMoreBtn);

    const addToCartBtn = document.createElement("button");
    addToCartBtn.classList.add("btn");
    addToCartBtn.classList.add("btn-primary");
    addToCartBtn.textContent = 'Beställ';

    addToCartBtn.onclick = function(){
        addToCart(menuItem);
    }

    menuCardBody.appendChild(addToCartBtn);

    menuCard.appendChild(menuCardImg);
    menuCard.appendChild(menuCardBody);

    plateMenus.appendChild(menuCard);
}

function createModal(menuItem){
    const modal = document.createElement("div");
    modal.id = menuItem.modalTag;
    modal.classList.add("modal", "fade");

    const modalDialog = document.createElement("div");
    modalDialog.classList.add("modal-dialog", "modal-centered");

    const modalContent = document.createElement("div");
    modalContent.classList.add("modal-content");

    //header
    const modalHeader = document.createElement("div");
    modalHeader.classList.add("modal-header");

    const modalTitle = document.createElement('h5');
    modalTitle.classList.add('modal-title');
    modalTitle.textContent = `${menuItem.name} - ${menuItem.price} kr`;

    const closeButton = document.createElement('button');
    closeButton.setAttribute('type', 'button');
    closeButton.classList.add('btn-close');
    closeButton.setAttribute('data-bs-dismiss', 'modal');
    closeButton.setAttribute('aria-label', 'Close');

    modalHeader.appendChild(modalTitle);
    modalHeader.appendChild(closeButton);

    //body

    const modalBody = document.createElement("div");
    modalBody.classList.add("modal-body");

    const grid = document.createElement("div");
    grid.classList.add("modal-grid");
    modalBody.appendChild(grid);

    const img = document.createElement("img");
    img.src = menuItem.picURL;

    grid.appendChild(img);

    const description = document.createElement("p");
    description.innerText = menuItem.description;

    grid.appendChild(description);




    //footer
    const modalFooter = document.createElement('div');
    modalFooter.classList.add('modal-footer');


    const goBackButton = document.createElement('button');
    goBackButton.setAttribute('type', 'button');
    goBackButton.classList.add('btn', 'btn-danger');
    goBackButton.setAttribute('data-bs-dismiss', 'modal');
    goBackButton.textContent = 'Tillbaka';


    const addToCartBtn = document.createElement('button');
    addToCartBtn.setAttribute('type', 'button');
    addToCartBtn.classList.add('btn', 'btn-success');
    addToCartBtn.textContent = 'Beställ';
    addToCartBtn.setAttribute('data-bs-dismiss', 'modal');

    addToCartBtn.onclick = function(){
        addToCart(menuItem);

    }


    modalFooter.appendChild(goBackButton);
    modalFooter.appendChild(addToCartBtn);


    //glue

    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);
    modalContent.appendChild(modalFooter);

    modalDialog.appendChild(modalContent);

    modal.appendChild(modalDialog);

    document.body.appendChild(modal);
}

function addToCart(menuItem){
    cart.push(menuItem)
    itemsInBasket.innerText = cart.length;
    
}

function removeFromCart(index){
    cart.splice(index, 1);
}