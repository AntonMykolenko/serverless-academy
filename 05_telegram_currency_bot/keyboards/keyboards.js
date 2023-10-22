const keyboardMain = {
    reply_markup: {
        keyboard: [["Currency exchange"]],
    },
};

const keyboardCurrency = {
    reply_markup: {
        keyboard: [["USD", "EUR"], ["Back"]],
    },
};

export const keyboards = {
    main: keyboardMain,
    currency: keyboardCurrency,
  };