const apiURL =
  "https://api.open-meteo.com/v1/forecast?latitude=57.7072&longitude=11.9668&current=temperature_2m,is_day,rain,cloud_cover";

let temp;
let isDay;
let isRaining = false;
let isCloudy = false;
let fetchSuccess = true;

let pizzaPicNic = true;

let message;

fetch(apiURL)
  .then((response) => response.json())
  .then((data) => {
    temp = data.current.temperature_2m;
    isDay = data.current.is_day;

    if (data.current.rain > 1) {
      isRaining = true;
    }

    if (data.current.cloud_cover > 10) {
      isCloudy = true;
    }

    makeSuggestion();
    printMessage();
  })
  .catch((error) => {
    fetchSuccess = false;
    console.error(error);
  });

function makeSuggestion() {
  message = `Det är ${temp} °C och `;

  if (isCloudy) {
    message += `molnigt ute.`;
    pizzaPicNic = false;
  } else {
    message += `soligt ute.`;
  }

  if (isRaining) {
    message += ` Dessutom regnar det.`;
  }

  if (isDay) {
    if (pizzaPicNic) {
      message += ` Om du frågar mig är detta det ultimata vädret för att äta en pizza ute i solen ;)`;
    } else {
      message += ` Taskigt väder om du frågar mig. Varför inte beställa hem en pizza? Fri utkörning för beställningar över 200 SEK.`;
    }
  } else {
    message += ` Men vad spelar det för roll när det är kväll? Bjud över polarna på en film- och pizzakväll vet ja. \nJust nu erbjuder vi 2 för 1 på alla våra menyer!`;
  }
}

function printMessage() {
  const weatherMessage = document.getElementById("weatherMessage");
  weatherMessage.innerText = message;
}
