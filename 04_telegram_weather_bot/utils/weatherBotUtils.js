import axios from "axios";
import dotenv from "dotenv";

dotenv.config();


const apiKey = process.env.API_KEY;

const cityCoords = {
    Kyiv: { lat: 50.45, lon: 30.542 }
};

const kelvinToCelsius = (kelvin) => {
    return Math.round(kelvin - 273.15);
};

const getWeatherByCity = (city, skipEven) => {
    const link = 'https://api.openweathermap.org/data/2.5/forecast';
    const params = {
        lat: cityCoords[city].lat,
        lon: cityCoords[city].lon,
        appid: apiKey,
    };
    return axios
        .get(link, { params })
        .then((res) => {
            let result = `<strong>Forecast for ${city}</strong>\n\n`;
            let weathers = {};
            res.data.list.forEach((w) => {
                const [date, time] = w.dt_txt.split(' ');
                const weatherObj = {
                    time: time.substr(0, 5),
                    temp: kelvinToCelsius(w.main.temp_min),
                    feelsLike: kelvinToCelsius(w.main.feels_like),
                    weather: w.weather[0].main.toLowerCase(),
                };
                if (weathers[date]) {
                    weathers[date].push(weatherObj);
                } else {
                    weathers[date] = [weatherObj];
                }
            });
            Object.keys(weathers).forEach((date) => {
                result += prettifyDate(date) + '\n';
                weathers[date].forEach((weatherData, index) => {
                    if (index % 2 === 0 || !skipEven) {
                        result += `${weatherData.time},\t${weatherData.temp} C°, ` +
                            `\tFeels like ${weatherData.feelsLike} C°, ${weatherData.weather}\n`;
                    }
                });
            });
            return result;
        });
}

const prettifyDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString('en-us', { weekday: 'long' }) + ', ' +
        date.toLocaleString('en-us', { month: 'long' }) + ' ' +
        date.getDate() + '.';
}

const weather = (bot, keyboard = null) => {
    const cities = Object.keys(cityCoords).map(city => [{ text: city }]);
    const cityKeyboard = cities.slice(0, 7);
    const cityRegx = new RegExp(`^${cityKeyboard.map(city => city[0].text).join('|')}$`);

    bot.onText(/(\/forecast|Get weather forecast)/, (msg) => {
        const cityOptions = {
            reply_markup: JSON.stringify({
                keyboard: cityKeyboard,
            }),
        };
        bot.sendMessage(msg.chat.id, 'Choose city', cityOptions);

        bot.onText(cityRegx, (cityMsg) => {
            const intervals = ['Every 3 hours', 'Every 6 hours'];
            const intervalKeyboard = intervals.map(interval => [{ text: interval }]);
            const intervalOptions = {
                reply_markup: JSON.stringify({
                    keyboard: intervalKeyboard,
                }),
            };
            bot.sendMessage(msg.chat.id, 'Choose interval', intervalOptions);

            const intervalRegx = /^Every (3|6) hours$/;
            bot.onText(intervalRegx, (intervalMsg) => {
                const skipEven = intervalMsg.text === 'Every 6 hours';
                getWeatherByCity(cityMsg.text, skipEven).then((res) => {
                    bot.sendMessage(msg.chat.id, res, {
                        reply_markup: JSON.stringify({
                            hide_keyboard: true,
                        }),
                        parse_mode: 'HTML',
                    });
                    bot.removeTextListener(intervalRegx);
                });
            });
            bot.removeTextListener(cityRegx);
        });
    });
};

export default weather;