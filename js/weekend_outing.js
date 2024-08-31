let weekend_outings = () => {
  var newButton = document.createElement("input");
  newButton.type = "button";
  newButton.className = "btn btn-primary";
  newButton.value = "Show Outing Form";

  newButton.onclick = function () {
    if (localStorage.getItem("savedLink") == null) {
      alert("No Outing Form saved");
      return;
    }

    if (document.querySelector("#outingForm")) {
      // Form already exists, no need to create it again
      return;
    }

    var savedLinkString = localStorage.getItem("savedLink");
    try {
      var parsedForm = JSON.parse(savedLinkString);
      var newElement = createElementFromJSON(parsedForm);

      var targetDiv = document.querySelector(
        "#main-section > section > div.row > div > div"
      );

      if (targetDiv) {
        targetDiv.appendChild(newElement);
        addTiming();
        var dateOutput = document.querySelector(
          "#outingForm > div:nth-child(10) > div.Table.col-sm-10.col-md-offset-1 > div:nth-child(9) > div:nth-child(1) > output"
        );
        if (dateOutput) {
          dateOutput.textContent += " Enter Format Date-Month-Year";
        }
      }
    } catch (error) {
      console.error("Error parsing saved form:", error);
    }
  };

  var existingButton = document.querySelector(
    "#main-section > section > div.row > div > div > div.box-header.with-border"
  );

  if (typeof submitOutingForm !== "function") {
    var scriptElement = document.createElement("script");
    scriptElement.src = "outing/store.js"; // Replace with the actual path to store.js
    document.body.appendChild(scriptElement);
  }

  if (existingButton) {
    existingButton.appendChild(newButton);
  }
  addTiming();
  var linkElement = document.getElementById("outingForm");
  if (linkElement) {
    var linkElementJSON = elementToJSON(linkElement);
    localStorage.setItem("savedLink", JSON.stringify(linkElementJSON));
  }
};

let addTiming = () => {
  let array = ["9:00 AM- 6:30PM", "9:00 AM- 8:30PM"];
  var outTime = document.querySelector("#outTime");
  if (outTime) {
    array.forEach((time) => {
      var timing = document.createElement("option");
      timing.value = time;
      timing.textContent = time;
      outTime.appendChild(timing);
    });
  }
};

function createElementFromJSON(json) {
  if (typeof json === "string") {
    return document.createTextNode(json);
  }

  const element = document.createElement(json.tagName);

  for (const [key, value] of Object.entries(json.attributes || {})) {
    element.setAttribute(key, value);
  }

  (json.children || []).forEach((child) => {
    element.appendChild(createElementFromJSON(child));
  });

  return element;
}

function elementToJSON(element) {
  if (element.nodeType === Node.TEXT_NODE) {
    return element.textContent;
  }

  const json = {
    tagName: element.tagName,
    attributes: {},
    children: [],
  };

  for (const attr of element.attributes) {
    json.attributes[attr.name] = attr.value;
  }

  for (const child of element.childNodes) {
    json.children.push(elementToJSON(child));
  }

  return json;
}

chrome.runtime.onMessage.addListener((request) => {
  if (request.message === "weekend_outings") {
    try {
      weekend_outings();
    } catch (error) {
      console.log(error);
    }
  }
});
