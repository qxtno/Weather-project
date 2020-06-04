const button = document.querySelector('#butonek');
const input: HTMLInputElement = document.querySelector(
  '#location'
) as HTMLInputElement;

const baseUrl = 'https://api.openweathermap.org/data/2.5';
const appId = '&appid=81e564bdda8adddbc2d805694d19cdac';
const unitsType = '&units=metric';
input.value = 'lublin';

button?.addEventListener('click', async () => {
  const location = input.value;
  if (location == null || location == '') {
    alert('Pole nie może być puste');
  } else {
    const weatherData = await getWeatherData(location);
    if (weatherData.cod == '404') {
      alert(`Nie znaleziono prognozy dla ${location}`);
    }
    console.log('data', weatherData);
  }
});

async function getWeatherData(location: string) {
  const response = await fetch(
    `${baseUrl}/weather?q=${location}${unitsType}${appId}`
  );
  return response.json();
}
