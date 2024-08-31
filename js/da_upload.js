let error_code = 0;
function calendar(date, course_code, course_name, token, time) {
  // console.log(date, course_code,course_name,token);
  var map = {
    Jan: "01",
    Feb: "02",
    Mar: "03",
    Apr: "04",
    May: "05",
    Jun: "06",
    Jul: "07",
    Aug: "08",
    Sep: "09",
    Sept: "09",
    Oct: "10",
    Nov: "11",
    Dec: "12",
  };
  var tmp = date.split("-");
  var dte = `${tmp[2]}-${map[tmp[1]]}-${tmp[0]}`;
  // return new Promise((resolve, reject) => {

  fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events?sendUpdates=all&sendNotifications=true&alt=json&key=AIzaSyCPBz-DTZdoTLQ_ZiqsVUO520XItcomTn0`,
    {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        Accept: "application/json",
      },
      body: JSON.stringify({
        end: {
          dateTime: dte + "T23:59:00.000+05:30",
        },
        start: {
          dateTime: dte + time,
        },
        eventType: "default",
        description: course_name,
        summary: "Digital Assignment- " + course_code,
      }),
    }
  )
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      // resolve();
      // console.l og(data);
      try {
        if (data.error.code == 401) {
          error_code = 401;
        } else if (data.error.code == 403) {
          calendar(date, course_code, course_name, token, time);
        }
      } catch {}
      return true;
      // return true;
    })
    .catch((err) => {
      // console.log(err);
      // reject("Error");
      // return false;
    });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let da_page = async () => {
  let due_sync = [];
  try {
    let reg_no, csrf;
    if (
      document.getElementsByClassName(
        "navbar-text text-light small fw-bold"
      )[0] != undefined
    ) {
      reg_no = document
        .getElementsByClassName("navbar-text text-light small fw-bold")[0]
        .innerText.replace("(STUDENT)", "")
        .trim();
    } else {
      reg_no = document
        .getElementsByClassName("VTopHeaderStyle")[0]
        .innerText.replace("(STUDENT)", "")
        .trim();
    }
    let table = document.getElementsByClassName("customTable")[0].children[0];
    let date = new Date().getTime();
    try {
      csrf = document.getElementsByName("_csrf")[3].defaultValue;
    } catch {}

    //Head Edit
    let table_head = document.getElementsByClassName("tableHeader");
    let new_cell = document.createElement("td");
    new_cell.style.width = "12%";
    new_cell.textContent = "Upcoming Dues";
    table_head[0].insertBefore(new_cell, table_head[0].children[5]);

    //body edit
    let rows = document.querySelectorAll(".tableContent");
    rows.forEach((row) => {
      let new_cell = document.createElement("td");
      new_cell.style.width = "12%";
      row.insertBefore(new_cell, row.children[6]);
    });

    for (let i = 1; i < table.children.length; i++) {
      var classid = table.children[i].children[1].textContent;
      if (table.children[i].children[3].children.length != 1) {
        await fetch(
          `${window.location.origin}/vtop/examinations/processDigitalAssignment`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/x-www-form-urlencoded; charset=UTF-8",
              "X-Requested-With": "XMLHttpRequest",
            },
            body: `authorizedID=${reg_no}&x=${new Date().toGMTString()}&classId=${classid}&_csrf=${csrf}`,
          }
        )
          .then((res) => res.text())
          .then(async (data) => {
            var parser = new DOMParser();
            var doc = parser.parseFromString(data, "text/html");
            var table_inner = doc.getElementsByClassName(
              "fixedContent tableContent"
            );
            let course_code = table_inner[0].children[1].textContent;
            let course_title = table_inner[0].children[2].textContent;

            var due_date = await new Promise((resolve) => {
              let due_dates = [];
              table_inner = Array.from(table_inner);
              table_inner.forEach((row) => {
                let date = row.childNodes[9].childNodes[1];
                let is_uploaded = true;
                try {
                  is_uploaded =
                    row.children[6].children[0].textContent.trim() === "";
                } catch {}
                try {
                  if (date.style.color == "green" && is_uploaded) {
                    try {
                      let download_link = row.childNodes[11].childNodes;
                      due_dates.push({
                        date_due: date.textContent,
                        download_link:
                          download_link.length > 0
                            ? download_link[0].cloneNode(true)
                            : document.createElement("div"),
                        course_code: course_code,
                        course_title: course_title,
                      });
                    } catch {}
                  }
                } catch {}
              });
              if (due_dates.length > 0) {
                due_dates.sort((a, b) => {
                  return new Date(a.date_due) - new Date(b.date_due);
                });
                resolve(due_dates[0]);
              } else {
                resolve({
                  date_due: "Nothing Left.",
                  download_link: document.createElement("div"),
                  course_code: course_code,
                  course_title: course_title,
                });
              }
              due_sync.push(due_dates);
            }).then((data) => data);

            var due = new Date(due_date.date_due.replace(/-/g, " ")).getTime();
            var color =
              (due - date) / (3600 * 24 * 1000) <= 3
                ? "rgb(238, 75, 43,0.6)"
                : "rgb(170, 255, 0,0.6)";
            let days_left = Math.ceil((due - date) / (3600 * 24 * 1000));
            table.children[i].children[4].style.background = color;
            let span = document.createElement("span");
            if (!isNaN(days_left)) {
              span.textContent = `${due_date.date_due} (${days_left} days left)`;
            } else {
              span.textContent = due_date.date_due;
            }
            table.children[i].children[4].appendChild(span);
            table.children[i].children[4].children[0].appendChild(
              due_date.download_link
            );
          })
          .catch((err) => console.log(err));
      }
    }
    // console.log(due_sync);
    sort();

    let sort_text_div = document.createElement("div");
    let sort_text = document.createElement("p");
    sort_text.style.color = "red";
    sort_text.textContent =
      "*Click on the Header (Sl. No,Course code..) of the table to sort";
    sort_text_div.appendChild(sort_text);
    document
      .getElementsByClassName("customTable")[0]
      .insertAdjacentElement("beforebegin", sort_text_div);

    chrome.storage.sync.get(["token"], (token) => {
      if (token.token != null) {
        // console.log(token.token);

        // Create the button element
        let btn = document.createElement("button");

        // Create the SVG element
        let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        svg.setAttribute("data-name", "Layer 1");
        svg.setAttribute("viewBox", "0 0 141.7 141.7");
        svg.setAttribute("width", "24");
        svg.setAttribute("height", "24");

        // Create the path elements
        let paths = [
          { fill: "#fff", d: "M95.8,45.9H45.9V95.8H95.8Z" },
          { fill: "#34a853", d: "M95.8,95.8H45.9v22.5H95.8Z" },
          {
            fill: "#4285f4",
            d: "M95.8,23.4H30.9a7.55462,7.55462,0,0,0-7.5,7.5V95.8H45.9V45.9H95.8Z",
          },
          {
            fill: "#188038",
            d: "M23.4,95.8v15a7.55462,7.55462,0,0,0,7.5,7.5h15V95.8Z",
          },
          { fill: "#fbbc04", d: "M118.3,45.9H95.8V95.8h22.5Z" },
          {
            fill: "#1967d2",
            d: "M118.3,45.9v-15a7.55462,7.55462,0,0,0-7.5-7.5h-15V45.9Z",
          },
          { fill: "#ea4335", d: "M95.8,118.3l22.5-22.5H95.8Z" },
          {
            fill: "#2a83f8",
            d: "M67.29834,70.55785A7.88946,7.88946,0,0,0,70.78,64.12535c0-4.49-4-8.12-8.94-8.12a8.77525,8.77525,0,0,0-8.74548,6.45379l3.96252,1.58258a4.41779,4.41779,0,0,1,4.473-3.51635,4.138,4.138,0,1,1,.06256,8.24426v.00513h-.0559l-.00666.00061-.00964-.00061H59.15v3.87677h2.70642L61.88,72.65a4.70514,4.70514,0,1,1,0,9.37,5.35782,5.35782,0,0,1-3.96588-1.69354,4.59717,4.59717,0,0,1-.80408-1.2442l-.69757-1.69946L52.23005,79c.62,4.33,4.69,7.68,9.61,7.68,5.36,0,9.7-3.96,9.7-8.83A8.63346,8.63346,0,0,0,67.29834,70.55785Z",
          },
        ];

        // Append the path elements to the SVG
        paths.forEach((pathData) => {
          let path = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "path"
          );
          path.setAttribute("fill", pathData.fill);
          path.setAttribute("d", pathData.d);
          svg.appendChild(path);
        });

        // Create the polygon element
        let polygon = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "polygon"
        );
        polygon.setAttribute("fill", "#2a83f8");
        polygon.setAttribute(
          "points",
          "77.916 66.381 75.53 63.003 84.021 56.868 87.243 56.868 87.243 85.747 82.626 85.747 82.626 62.772 77.916 66.381"
        );
        svg.appendChild(polygon);

        // Create the span element
        let span = document.createElement("span");
        span.textContent = "Sync assignments with Google Calendar";

        // Append the SVG and span to the button
        btn.appendChild(svg);
        btn.appendChild(span);

        // Set the button styles and ID
        btn.style = `display: flex;align-items: center;gap: 1rem;font-family: inherit;justify-content: space-around;color: #535353;font-size: 13px;font-weight: 500;margin: 8px auto;cursor: pointer;background-color: white;border-radius: 32px;transition: all 0.2s ease-in-out;padding: 6px 10px;border: 1px solid rgba(0, 0, 0, 0.25);`;
        btn.id = "sync_dates_btn";
        

        document
          .getElementsByClassName("box-header with-border")[0]
          .insertAdjacentElement("afterend", btn);
        let tot_sub;
        btn.addEventListener("click", async () => {
          let table =
            document.getElementsByClassName("customTable")[0].children[0]
              .children;

          btn.disabled = true;

          let sync_btn = document.getElementById("sync_dates_btn");
          let sync_wait = document.createElement("div");
          sync_wait.className = "col-md-12";
          let stmt = document.createElement("h4");
          stmt.textContent = `Please Wait while the dates get synced!!!`;
          stmt.style.textAlign = "center";
          stmt.style.color = "red";
          sync_wait.appendChild(stmt);
          sync_wait.id = "sync_wait_txt";
          sync_btn.insertAdjacentElement("afterend", sync_wait);

          for (let i = 0; i < table.length - 1; i++) {
            tot_sub = due_sync[i].length;

            if (error_code == 401) {
              alert(
                "Please Re-login with your Google account and refresh the page"
              );
              chrome.storage.sync.set({ token: null });
              error_code = 0;
              break;
            }
            for (let j = 0; j < tot_sub; j++) {
              // console.log(due_sync,course_code,course_name);
              calendar(
                due_sync[i][j].date_due,
                due_sync[i][j].course_code,
                due_sync[i][j].course_title,
                token.token,
                "T22:00:00.000+05:30"
              );
              calendar(
                due_sync[i][j].date_due,
                due_sync[i][j].course_code,
                due_sync[i][j].course_title,
                token.token,
                "T10:00:00.000+05:30"
              );
              // console.log(due_sync[i][j].date_due,due_sync[i][j].course_code,due_sync[i][j].course_title);
              if (error_code == 401) {
                break;
              }
              await sleep(550);
            }
            if (error_code != 401 && i == table.length - 2) {
              document.getElementById("sync_wait_txt").hidden = true;
              alert("Due Dates are sucessfully Synced to your calander");
              btn.disabled = false;
            }
          }
        });
      } else {
        let div = document.createElement("div");
        div.className = "col-md-12";
        let stmt = document.createElement("p");
        stmt.textContent =
          "**Sign in with google in extension to sync your due dates with Google Calander";
        stmt.style.color = "red";
        div.appendChild(stmt);
        document
          .getElementsByClassName("box-header with-border")[0]
          .insertAdjacentElement("afterend", div);
      }
    });
  } catch (err) {
    // console.log(err);
  }
};

let sort_table = (n) => {
  let table = document.getElementsByTagName("tbody")[0];
  let i,
    x,
    y,
    count = 0;
  let switching = true;
  let direction = "ascending";

  while (switching) {
    switching = false;
    var rows = table.rows;

    //Loop to go through all rows
    for (i = 1; i < rows.length - 1; i++) {
      var Switch = false;

      // Fetch 2 elements that need to be compared
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      let x_due, y_due;
      if (n == 4) {
        x_due = parseInt(x.children[0].textContent.split("(")[1]);
        y_due = parseInt(y.children[0].textContent.split("(")[1]);
        if (isNaN(x_due)) {
          x_due = -1;
        }
        if (isNaN(y_due)) {
          y_due = -1;
        }
      }
      // Check the direction of order
      if (direction == "ascending") {
        // Check if 2 rows need to be switched
        if (
          x.textContent.toLowerCase() > y.textContent.toLowerCase() &&
          [1, 2, 3, 5, 6].includes(n)
        ) {
          // If yes, mark Switch as needed and break loop
          Switch = true;
          break;
        } else if (
          n == 0 &&
          parseInt(x.textContent.toLowerCase()) >
            parseInt(y.textContent.toLowerCase())
        ) {
          // If yes, mark Switch as needed and break loop
          Switch = true;
          break;
        } else if (n == 4 && x_due > y_due) {
          // If yes, mark Switch as needed and break loop
          Switch = true;
          break;
        }
      } else if (direction == "descending") {
        // Check direction
        if (
          x.textContent.toLowerCase() < y.textContent.toLowerCase() &&
          [1, 2, 3, 5, 6].includes(n)
        ) {
          // If yes, mark Switch as needed and break loop
          Switch = true;
          break;
        } else if (
          n == 0 &&
          parseInt(x.textContent.toLowerCase()) <
            parseInt(y.textContent.toLowerCase())
        ) {
          // If yes, mark Switch as needed and break loop
          Switch = true;
          break;
        } else if (n == 4 && x_due < y_due) {
          // If yes, mark Switch as needed and break loop
          Switch = true;
          break;
        }
      }
    }
    if (Switch) {
      // Function to switch rows and mark switch as completed
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;

      // Increase count for each switch
      count++;
    } else {
      // Run while loop again for descending order
      if (count == 0 && direction == "ascending") {
        direction = "descending";
        switching = true;
      }
    }
  }
};

let sort = () => {
  let head_change = Array.from(
    document.getElementsByClassName("tableHeader")[0].children
  );
  for (let i = 0; i < head_change.length - 1; i++) {
    // head_change[i].addEventListener("click", () => { sort_table
    head_change[i].addEventListener("click", () => {
      sort_table(i);
    });
  }
};

// chrome.runtime.onMessage.addListener((

chrome.runtime.onMessage.addListener((request) => {
  if (request.message === "da_upload") {
    try {
      da_page();
    } catch (error) {
      // console.log(error);
    }
  }
});
