getAttendancePage((htmlDataAsStr) => {
  const attdBody = document.getElementById('attendance-body');
  if (htmlDataAsStr === null) {
    const noDataElement = document.createElement('p');
    noDataElement.className = 'no-data';
    noDataElement.textContent = 'No Data Available';
    attdBody.appendChild(noDataElement);
    return;
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlDataAsStr, 'text/html');
  while (attdBody.firstChild) {
    attdBody.removeChild(attdBody.firstChild);
  }
  Array.from(doc.body.childNodes).forEach((node) => {
    attdBody.appendChild(node);
  });
});