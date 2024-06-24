// Function to format image URL for Next.js Image component.
export const ImageLoader = ({ src, width, quality }) => {
    return `${src}?w=${width}&q=${quality || 75}`
};

// Function to format date into a specific format.
export const dateFormat = string => {
    // Converting input string to date object.
    const date = new Date(string);

    // Formatting date in "Month day, year" format.
    return date.toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })
};

// Function to trigger a click event on the document.
export const handleClickOnDocument = () => {
    // Creating a click event
    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    });

    // Dispatching the click event on the document.
    document.dispatchEvent(clickEvent);
};

// Function to format date into MM/DD/YYYY format.
export function formatDateMUI(inputDate) {
    // Converting input date to date object.
    const dateObj = new Date(inputDate);

    // Getting day, month, year and padding with zero if needed.
    const day = String(dateObj.getUTCDate()).padStart(2, '0');
    const month = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
    const year = dateObj.getUTCFullYear();
  
    // Constructing formatted date.
    const formattedDate = `${month}/${day}/${year}`;
  
    // Returning formatted date.
    return formattedDate;
};

// Function to get quarter period date.
export const getQuarterPeriodDate = (input) => {
    // Extracting quarter period from input name.
    const pairod = input?.name?.split('-')?.[0]?.trim();

    // Constructing quarter period date string.
    return ` ${pairod} Quarter of ${input?.year}`;
};

// Function to check if a given regex string is valid.
export const isValidRegex = (regexString) => {
    try {
        new RegExp(regexString);
        return true;
    } catch {
        return false;
    };
};

// Function to transform errors object into a simplified format.
export const transformErrors = (data) => {
    return Object.keys(data).reduce((acc, key) => {
        acc[key] = typeof data[key] === "string" ? data[key] : data[key][0];
        return acc;
    }, {});
};

// Function to format credit card number based on card type.
export const getCorrectCardNumberFormat = (value) => {
    let cardNumber = value;
    // Removing non-digit characters from input value.
    value = value.replace(/\D/g, '');

    // Checking card type and formatting accordingly.
    if(/^3[47]\d{0,13}$/.test(value)) {
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

    // Returning formatted card number.
    return cardNumber;
};

// Function to get ISO string format of a date.
export const getDateISOString = (date) => {
    return new Date(date.getTime() - (date.getTimezoneOffset() * 60000 ))
        .toISOString()
        .split("T")[0];
};

//////////  💲 Make formatted price  (ex. $1,500) 💰  @#########
export const getTotalFormat = (price) => {
    return price?.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') || 0.00;
};