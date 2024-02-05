const pizzas = [
    {name: "Marghareta", price: 105, picURL: "./media/pizzas/marghareta.jpg"},
    {name: "Kebab pizza", price: 145, picURL: "./media/pizzas/kebabpizza.jpg"},
    {name: "Hawaii pizza", price: 145, picURL: "./media/pizzas/hawaii.jpg"}
];

const plates = [
    {name: "Falafeltallrik", price: 115, picURL: "./media/plates/falagel.jpg"},
    {name: "Kebabtallrik", price: 145, picURL: "./media/plates/kebabplate.jpg"},
    {name: "Shawarmatallrik", price: 155, picURL: "./media/pizzas/shawarma.jpg"}
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