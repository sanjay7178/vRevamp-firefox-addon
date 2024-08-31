let course = "";
let faculty_slot = "";
let file_name = {};
let time_last = new Date();
let det_file_name = "table_name";

const VTOP_URLS = [
  "*://vtop.vit.ac.in/*",
  "*://vtopcc.vit.ac.in/vtop/*",
  "*://vtop.vitap.ac.in/vtop/*",
  "*://vtop.vitap.ac.in/*",
];

const API_KEY = "AIzaSyAXTXcZx8zuDZl2qRdDqzkqi5nEpjDBwWg";

browser.runtime.onMessage.addListener((request) => {
  if (request.message === "table_name") {
    det_file_name = "table_name";
  }
  if (request.message === "fac_upload_name") {
    det_file_name = "fac_upload_name";
  }
});

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "fac_upload_name") {
    det_file_name = "fac_upload_name";
  }
});

let set_time_last = (time) => {
  time_last = time;
};

const returnMessage = (MessageToReturn) => {
  browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
    let tab = tabs.find((tab) => tab.url.includes("vtop"));
    if (tab) {
      browser.tabs.sendMessage(tab.id, {
        message: MessageToReturn,
      }).catch((error) => {
        console.error("Error sending message to tab:", error);
      });
    } else {
      console.error("No active tab found with URL containing 'vtop'");
    }
  }).catch((error) => {
    console.error("Error querying tabs:", error);
  });
};
const trigger_download = (request) => {
  course = request.message.course;
  faculty_slot = request.message.faculty_slot;
  request.message.link_data.forEach((link) => {
    file_name[link.url] = link.title;
    browser.downloads.download({
      url: link.url,
      conflictAction: "overwrite",
    });
  });
};

//Gives the file name
const get_file_name = (fname, url) => {
  let title = "";
  let file_extension = fname.replace(/([^_]*_){8}/, "").split(".");
  file_extension = "." + file_extension[file_extension.length - 1];
  // splits after the fifth occurence of '_'
  if (det_file_name === "table_name") {
    let file_prefix = file_name[url] || "";
    // file_prefix = file_prefix.replace(/(\r\n|\n|\r)/gm, " ");
    file_prefix = file_prefix.split("\n")[0];
    if (file_prefix.length < 4) {
      let index = file_name[url] || "";
      index = index.split("-")[0] + "-";
      let file_prefix = fname.split("_");
      // console.log(file_prefix);
      for (let i = 8; i < file_prefix.length; i++) {
        title += file_prefix[i];
        title += " ";
      }
      title =
        index + title.split(".")[0] + "-" + file_prefix[7] + file_extension;
    } else {
      title = file_prefix + file_extension;
    }
    // console.log(title);
    return title;
  } else if (det_file_name === "fac_upload_name") {
    let index = file_name[url] || "";
    index = index.split("-")[0] + "-";
    let file_prefix = fname.split("_");
    // console.log(file_prefix);
    for (let i = 8; i < file_prefix.length; i++) {
      title += file_prefix[i];
      title += " ";
    }
    title = index + title.split(".")[0] + "-" + file_prefix[7] + file_extension;
    return title;
  }
};

// Firefox doesn't support onDeterminingFilename, so we'll use onCreated instead
browser.downloads.onCreated.addListener((downloadItem) => {
  if (downloadItem.url.indexOf("vtop") !== -1) {
    const title = get_file_name(downloadItem.filename, downloadItem.url);
    let newFilename = "";
    if (course !== "" && faculty_slot !== "") {
      newFilename = `VIT Downloads/${course.replace(
        ":",
        ""
      )}/${faculty_slot}/${title}`;
    } else {
      newFilename = `VIT Downloads/Other Downloads/${title}`;
    }
    browser.downloads.cancel(downloadItem.id).then(() => {
      browser.downloads.download({
        url: downloadItem.url,
        filename: newFilename,
        conflictAction: "overwrite",
      });
    });
  }
});

/* Fires after the completion of a request */
browser.webRequest.onCompleted.addListener(
  async (details) => {
    install_notice();
    let link = details.url;
    time_last = new Date();
    set_time_last(time_last);
    returnMessage("showOfflineIcon");
    if (link.indexOf("doStudentMarkView") !== -1) {
      // console.log("mark_view");
      returnMessage("mark_view_page");
    } else if (link.indexOf("StudentTimeTable") !== -1) {
      returnMessage("timetable_view_page");
    } else if (
      link.indexOf("processViewStudentAttendance") !== -1 ||
      link.indexOf("processBackAttendanceDetails") !== -1
    ) {
      returnMessage("view_attendance");
    } else if (link.indexOf("StudentAttendance") !== -1) {
      returnMessage("view_attendance_page");
    } else if (link.indexOf("processViewStudentCourseDetail") !== -1) {
      returnMessage("course_page_change");
    } else if (link.indexOf("doDigitalAssignment") !== -1) {
      returnMessage("da_upload");
    } else if (link.indexOf("vtopcc.vit.ac.in/vtop/vtopLogin") !== -1) {
      returnMessage("vtopcc_captcha");
    } else if (link.indexOf("vtop.vitap.ac.in/vtop/vtopLogin") !== -1) {
      returnMessage("vtop2_captcha");
    } else if (link.indexOf("hrms/employeeSearchForStudent") !== -1) {
      returnMessage("employee_search");
    } else if (link.indexOf("hostel/StudentWeekendOuting") !== -1) {
      returnMessage("weekend_outings");
    } else if (
      link.indexOf("vtop/doLogin") !== -1 ||
      link.indexOf("assets/img/favicon.png") !== -1 ||
      link.indexOf("goHomePage") !== -1
    ) {
      // returnMessage("vtopcc_nav_bar");
      returnMessage("vtop2_nav_bar");
    } else if (link.indexOf("doSearchExamScheduleForStudent") !== -1) {
      returnMessage("exam_schedule");
    } else if (link.indexOf("examGradeView/doStudentGradeView") != -1) {
      // console.log("Exam Grade");
      returnMessage("exam_grade");
    } else if (link.indexOf("menu.js") !== -1 || link.indexOf("home") !== -1) {
      if (link.indexOf("menu.js") !== -1) await sleep(3500);
      console.log("nav_bar_change");
      returnMessage("nav_bar_change");
    } else if (link.indexOf("examGradeView/getGradeViewDetail") != -1) {
      // console.log("Exam Grade");
      returnMessage("exam_grade");
    }
  },
  {
    urls: VTOP_URLS,
  }
);

//Fires the msg from script

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  try {
    if (request.message.course !== "") trigger_download(request);
  } catch {
    if (request.message == "login") {
      // Firefox doesn't support chrome.identity, so we'll need an alternative auth method
      console.log(
        "Login functionality needs to be implemented differently for Firefox"
      );
      sendResponse(false);
    } else if (request.message === "logout") {
      // Firefox doesn't support chrome.identity, so we'll need an alternative logout method
      console.log(
        "Logout functionality needs to be implemented differently for Firefox"
      );
    }
  }
});

//Removes the inactivity of service worker
// Keep the service worker alive
browser.alarms.create({ periodInMinutes: 0.5 });
browser.alarms.onAlarm.addListener(() => {
  let time_nw = new Date();
});

/*
 * Checks if the user is online or offline
 * and renders an offline view for the page
 */

browser.webRequest.onBeforeRequest.addListener(
  (details) => {
    const isOnline = navigator.onLine;
    if (!isOnline) {
      viewOfflinePage();
    }
  },
  { urls: VTOP_URLS }
);

function viewOfflinePage() {
  browser.tabs.create({ url: browser.runtime.getURL("html/offline.html") });
}

browser.runtime.onMessage.addListener((request) => {
  if (request.message === "showOfflinePage") {
    viewOfflinePage();
  }
});

// Helper function to promisify chrome.storage.local.get
function getChromeStorage(key) {
  return browser.storage.local.get(key).then((result) => result[key]);
}

function setChromeStorage(obj) {
  return browser.storage.local.set(obj);
}

async function install_notice() {
  try {
    const installTime = await getChromeStorage("install_time");
    if (installTime) return;

    browser.tabs.query({}).then((tabs) => {
      const privacyPolicyTab = tabs.find((tab) =>
        tab.url.includes("privacy-policy.html")
      );
      if (!privacyPolicyTab) {
        browser.tabs.create({ url: "../html/privacy-policy.html" });
      }
    });
  } catch (error) {
    console.error(error);
  }
}

browser.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    browser.runtime.setUninstallURL("https://vrevamp.nullvitap.tech");
  }
});
