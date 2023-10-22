import axios from "axios";
import fs from "fs";

const DBNAME = "./utils/database.json";
const MONO_API_URL = "https://api.monobank.ua/bank/currency";
const PRIVAT_API_URL =
  "https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5";

const getData = (filename) => {
  return JSON.parse(fs.readFileSync(filename, "utf8"));
}

const loadData = (filename, content) => {
  fs.writeFileSync(filename, JSON.stringify(content), "utf8");
}

const getMono = async() => {
  const { data: currenciesInfo } = await axios.get(MONO_API_URL);
  const currencyRates = {};
  currenciesInfo.forEach((currencyInfo) => {
    if (
      currencyInfo.currencyCodeA === 840 &&
      currencyInfo.currencyCodeB === 980
    ) {
      currencyRates.monoUsdSell = Number(currencyInfo.rateSell);
      currencyRates.monoUsdBuy = Number(currencyInfo.rateBuy);
    }
    if (
      currencyInfo.currencyCodeA === 978 &&
      currencyInfo.currencyCodeB === 980
    ) {
      currencyRates.monoEurSell = Number(currencyInfo.rateSell);
      currencyRates.monoEurBuy = Number(currencyInfo.rateBuy);
    }
  });
  return currencyRates;
}

const getPrivat = async () => {
  const { data: currenciesInfo } = await axios.get(PRIVAT_API_URL);
  const currencyRates = {};
  currenciesInfo.forEach((currencyInfo) => {
    if (currencyInfo.ccy === "USD") {
      currencyRates.privatUsdSell = Number(currencyInfo.sale);
      currencyRates.privatUsdBuy = Number(currencyInfo.buy);
    }
    if (currencyInfo.ccy === "EUR") {
      currencyRates.privatEurSell = Number(currencyInfo.sale);
      currencyRates.privatEurBuy = Number(currencyInfo.buy);
    }
  });
  return currencyRates;
}

const getExchange = async () => {
  try {
    const privatRates = await getPrivat();
    const monoRates = await getMono();
    const exchangeRates = Object.assign(privatRates, monoRates);
    loadData(DBNAME, exchangeRates);
    return exchangeRates;
  } catch (err) {
    return getData(DBNAME);
  }
}

export const getUsdMessage = async () => {
  const { monoUsdSell, monoUsdBuy, privatUsdSell, privatUsdBuy } =
    await getExchange();
  const messageString = `MonoBank : USD/UAH Sell: ${monoUsdSell}, Buy: ${monoUsdBuy}\nPrivatBank: USD/UAH Sell: ${privatUsdSell}, Buy: ${privatUsdBuy}`;
  return messageString;
}

export const getEurMessage = async () =>  {
  const { monoEurSell, monoEurBuy, privatEurSell, privatEurBuy } =
    await getExchange();
  const messageString = `MonoBank : EUR/UAH Sell: ${monoEurSell}, Buy: ${monoEurBuy}\nPrivatBank: EUR/UAH Sell: ${privatEurSell}, Buy: ${privatEurBuy}`;
  return messageString;
}