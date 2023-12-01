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

//////////  💲 Make formatted price  (ex. $1,500) 💰  @#########
export const getTotalFormat = (price) => {
    return price?.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') || 0.00;
};