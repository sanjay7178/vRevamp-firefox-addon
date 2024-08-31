// To Do: Add a caution how the calculator works
let view_attendance_page = () => {
  // Working of the calculator
  let table_line = document.querySelectorAll(".table-responsive")[0];
  let span = table_line.getElementsByTagName("span")[0];
  let cautionNote = document.createElement("p");
  cautionNote.style.color = "red";
  cautionNote.textContent = "*Note: This calculator doesn't calculate the attendance till the end of the sem, It only calculates the attendance to 80%";
  span.parentNode.insertBefore(document.createElement("br"), span.nextSibling);
  span.parentNode.insertBefore(document.createElement("br"), span.nextSibling);
  span.parentNode.insertBefore(cautionNote, span.nextSibling);

  // Footer edited_head
  let color_detail = document.createElement("div");
  let createColoredParagraph = (color, text, marginTop = "0px") => {
    let p = document.createElement("p");
    p.style.color = color;
    p.style.marginTop = marginTop;
    p.textContent = text;
    return p;
  };
  color_detail.appendChild(createColoredParagraph("RGB(34 144 62)", "*Attendance Greater than 75%"));
  color_detail.appendChild(createColoredParagraph("rgb(255, 171, 16)", "*Be cautious your Attendance is in between 74.01% to 74.99%", "-10px"));
  color_detail.appendChild(createColoredParagraph("rgb(238, 75, 43)", "*Attendance Less than 75%", "-10px"));
  table_line.insertAdjacentElement("afterend", color_detail);

  // Head edit
  var table_head = document.getElementsByTagName("thead")[0];
  var new_th = document.createElement("th");
  new_th.style.cssText = "vertical-align: middle; text-align: center; border-right: 1px solid #b2b2b2; padding: 5px;";
  new_th.textContent = "80% Attendance Alert";
  table_head.rows[0].insertBefore(new_th, table_head.rows[0].cells[19]);

  // Body Edit
  var body = document.getElementsByTagName("tbody")[0];
  var body_rows = body.querySelectorAll("tr");
  body_rows.forEach((row) => {
    if (row.cells.length > 3) {
      let attended_classes = parseFloat(row.cells[23].textContent.trim());
      let tot_classes = parseFloat(row.cells[24].textContent.trim());
      let course_type = row.cells[8].textContent.trim();
      let new_cell = document.createElement("td");
      new_cell.style.cssText = "vertical-align: middle; border: 1px solid #b2b2b2; padding: 5px;";
      
      if (attended_classes / tot_classes < 0.80) {
        let req_classes = Math.ceil(((0.80 * tot_classes) - attended_classes) / 0.2599);
        if (course_type.includes("Lab")) {
          req_classes = Math.ceil(req_classes / 2);
          new_cell.style.background = "rgba(238, 75, 43, 0.7)";
          new_cell.textContent = `${req_classes} lab(s) should be attended`;
        } else {
          new_cell.style.background = "rgba(238, 75, 43, 0.7)";
          new_cell.textContent = `${req_classes} class(es) should be attended`;
        }
      } else {
        let bunk_classes = Math.floor((attended_classes - (0.80 * tot_classes)) / 0.80);
        let color = (0.7401 <= (attended_classes / tot_classes) && (attended_classes / tot_classes) <= 0.80) ? "rgb(255, 171, 16)" : "rgba(170, 255, 0, 0.7)";
        if (course_type.includes("Lab")) {
          bunk_classes = Math.max(0, Math.floor(bunk_classes / 2));
          new_cell.style.background = color;
          new_cell.textContent = `Only ${bunk_classes} lab(s) can be Skipped\nbe Cautious`;
        } else {
          bunk_classes = Math.max(0, bunk_classes);
          new_cell.style.background = color;
          new_cell.textContent = `Only ${bunk_classes} class(es) can be Skipped\nbe Cautious`;
        }
      }
      row.insertBefore(new_cell, row.cells[29]);
    }
  });
};

chrome.runtime.onMessage.addListener((request) => {
  if (request.message === "view_attendance_page") {
    try {
      chooseCurrentSemester();
    } catch (error) {
      console.error(error);
    } finally {
      saveAttendancePage(document.querySelector(".box-body").outerHTML);
    }
  }
});

chrome.runtime.onMessage.addListener((request) => {
  if (request.message === "view_attendance") {
    try {
      view_attendance_page();
    } catch (error) {
      console.error(error);
    } finally {
      saveAttendancePage(document.querySelector(".box-body").outerHTML);
    }
  }
});