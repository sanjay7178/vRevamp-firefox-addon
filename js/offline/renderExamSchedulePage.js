getExamSchedulePage((htmlDataAsStr) => {
  const marksPageBody = document.getElementById('exam-schedule-body');
  if (htmlDataAsStr === null) {
    const noDataElement = document.createElement('p');
    noDataElement.className = 'no-data';
    noDataElement.textContent = 'No Data Available';
    marksPageBody.appendChild(noDataElement);
    return;
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlDataAsStr, 'text/html');
  while (marksPageBody.firstChild) {
    marksPageBody.removeChild(marksPageBody.firstChild);
  }
  Array.from(doc.body.childNodes).forEach((node) => {
    marksPageBody.appendChild(node);
  });
});