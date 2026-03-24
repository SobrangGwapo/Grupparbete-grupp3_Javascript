// Hämtar data från localStorage utifrån en nyckel
// Om det inte finns någon data returneras en tom array
const getFromStorage = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

// Lägger till ett nytt objekt i localStorage
// Hämtar först den befintliga listan, lägger till objektet och sparar igen
const addToStorage = (item, key) => {
  const items = getFromStorage(key);
  items.push(item);
  localStorage.setItem(key, JSON.stringify(items));
};

// Tar bort ett objekt från localStorage baserat på id
// Filtrerar bort det objekt som har samma id och sparar den uppdaterade listan
const removeFromStorage = (id, key) => {
  const items = getFromStorage(key);
  const updated = items.filter(item => item.id !== id);
  localStorage.setItem(key, JSON.stringify(updated));
};

// Uppdaterar ett objekt i localStorage
// Om id matchar ersätts det gamla objektet med det uppdaterade objektet
const updateInStorage = (updatedItem, key) => {
  const items = getFromStorage(key);
  const updated = items.map(item => item.id === updatedItem.id ? updatedItem : item);
  localStorage.setItem(key, JSON.stringify(updated));
};

// Tar bort all data som hör till den angivna nyckeln i localStorage
const clearStorage = (key) => {
  localStorage.removeItem(key);
};