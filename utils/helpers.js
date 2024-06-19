export const ImageLoader = ({ src, width, quality }) => {
    return `${src}?w=${width}&q=${quality || 75}`
};

export const dateFormat = string => {
    const date = new Date(string);
    return date.toLocaleDateString("en-US", {year: 'numeric', month: 'short', day: 'numeric'})
};

export const handleClickOnDocument = () => {
    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    });
    document.dispatchEvent(clickEvent);
};

export function formatDateMUI(inputDate) {
    const dateObj = new Date(inputDate);
    const day = String(dateObj.getUTCDate()).padStart(2, '0');
    const month = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
    const year = dateObj.getUTCFullYear();
  
    const formattedDate = `${month}/${day}/${year}`;
  
    return formattedDate;
};


export const getQuarterPeriodDate = (input) => {
    const pairod = input?.name?.split('-')?.[0]?.trim();
    return ` ${pairod} Quarter of ${input?.year}`;
};


export const isValidRegex = (regexString) => {
    try {
        new RegExp(regexString);
        return true;
    } catch {
        return false;
    };
};

export const transformErrors = (data) => {
    return Object.keys(data).reduce((acc, key) => {
        acc[key] = typeof data[key] === "string" ? data[key] : data[key][0];
        return acc;
    }, {});
}

export const getCorrectCardNumberFormat = (value) => {
    let cardNumber = value;
    value = value.replace(/\D/g, '');

    if (/^3[47]\d{0,13}$/.test(value)) {
        cardNumber = value
            .replace(/(\d{4})/, '$1 ')
            .replace(/(\d{4}) (\d{6})/, '$1 $2 ');
    } else if (/^3(?:0[0-5]|[68]\d)\d{0,11}$/.test(value)) {
        // diner's club, 14 digits
        cardNumber = value
            .replace(/(\d{4})/, '$1 ')
            .replace(/(\d{4}) (\d{6})/, '$1 $2 ');
    } else if (/^\d{0,16}$/.test(value)) {
        // regular cc number, 16 digits
        cardNumber = value
            .replace(/(\d{4})/, '$1 ')
            .replace(/(\d{4}) (\d{4})/, '$1 $2 ')
            .replace(/(\d{4}) (\d{4}) (\d{4})/, '$1 $2 $3 ');
    };

    return cardNumber;
};

//////////  💲 Make formatted price  (ex. $1,500) 💰  @#########
export const getTotalFormat = (price) => {
    return price?.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') || 0.00;
};