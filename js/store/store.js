const store = chrome.storage.local;


// type this function  
/** 
 * @param {string} key - The key to save data in Chrome storage
 * @param {Object} data - The data to be saved in Chrome storage
 * @returns {void}
*/
function saveData(key, data) {
  const d = {};
  d[key] = data;
  store.set(d, () => {
    if (chrome.runtime.lastError) {
      console.error("Error saving data: " + chrome.runtime.lastError.message);
    } else {
      console.log("Data saved successfully!");
    }
  });
}

/**
  * @param {string} key - The key to retrieve data from Chrome storage
  * @param {function} callback - The callback function to be called after the data is retrieved
  * @returns {void}
*/
function getData(key, callback) {
  // Retrieve data from Chrome storage
  store.get(key, function(result) {
    if (chrome.runtime.lastError) {
      console.error("Error retrieving data: " + chrome.runtime.lastError.message);
      callback(null); // Notify callback function with null if there's an error
    } else {
      // Extract data from result
      const localData = result[key];
      if (localData) {
        // If exists, pass it to the callback function
        callback(localData);
      } else {
        console.warn("Data not found.");
        callback(null); // Notify callback function if doesn't exist
      }
    }
  });
}
