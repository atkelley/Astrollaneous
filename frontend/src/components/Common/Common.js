
const getOrdinalNumber = (number) => {
  let selector = ((number > 3 && number < 21) || number % 10 > 3) ? 0 : number % 10;  
  return number + ['th', 'st', 'nd', 'rd'][selector];
};

export function getConvertedDateString(dateString) {
  let date = (dateString) ? new Date(dateString) : new Date();
  let day = getOrdinalNumber(date.getDate());
  let month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][date.getMonth()];
  let year = date.getFullYear();

  return `${month} ${day}, ${year}`;
}

export function getConvertedDateTime(dateString) {
  let date = new Date(dateString);
  return ((date.getHours() % 12) ? date.getHours() % 12 : 12) + ':' + ((date.getMinutes() < 10) ? '0' + date.getMinutes() : date.getMinutes()) + ' ' + ((date.getHours() >= 12) ? 'PM' : 'AM');
}

export function capitalizeEveryFirstLetter(string) {
  return (string.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' '));
}

export function reformatDateString(dateString) {
  let dateArray = dateString.split('-');
  return `${dateArray[1]}/${dateArray[2]}/${dateArray[0].substring(2, 4)}`;
}

export function getNewSlideIndex(value, slideIndex, collection) {
  let newSlideIndex = slideIndex + value;

  if (newSlideIndex > collection.length - 1) { 
    newSlideIndex = 0 
  } 
  
  if (newSlideIndex < 0) {
    newSlideIndex = collection.length -1 ;
  }
  
  return newSlideIndex;
}