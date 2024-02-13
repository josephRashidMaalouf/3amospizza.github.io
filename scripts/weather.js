const apiURL =
  "https://api.open-meteo.com/v1/forecast?latitude=57.7072&longitude=11.9668&current=temperature_2m,is_day,rain,cloud_cover";

let temp;
let isDay;
let rain;
let clouds;
let fetchSuccess = true;

let pizzaPicNic = true;

let message;

fetch(apiURL)
  .then((response) => response.json())
  .then((data) => {
    temp = data.current.temperature_2m;
    isDay = data.current.is_day;
    rain = data.current.rain;
    clouds = data.current.cloud_cover;

    makeSuggestion();
    printMessage();
  })
  .catch((error) => {
    fetchSuccess = false;
    console.error(error);
  });

function makeSuggestion() {
  if (isDay) {
    if (temp > 20 && rain < 1 && cloud < 10) {
      message = `Det är ${temp} °C och sol! Vad sägs om att köpa med en pizza och äta den ute i solen?`;
    } else {
      message = `Taskigt väder... Vad sägs om att beställa hem pizza?`;
    }
  } else {
    message = `Vad sägs om en härlig film- och pizzakväll?`;
  }
}

function printMessage() {
  const weatherMessage = document.getElementById("weatherMessage");
  weatherMessage.innerText = message;
}
