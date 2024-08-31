const nav_bar_change = () => {
    let items_list = Array.from(document.getElementsByTagName("a")).filter(
        (e) => e.dataset.url
    );
    let marks, attendance, course_page, da_upload, time_table, calendar, curriculum;
    for (let i = 0; i < items_list.length; i++) {
        let item = items_list[i].innerText.trim();
        if (item.includes("Class Attendance")) {
            attendance = i;
        } else if (item.includes("Course Page")) {
            course_page = i;
        } else if (item.includes("Digital Assignment Upload")) {
            da_upload = i;
        } else if (item.includes("Time Table")) {
            time_table = i;
        } else if (item.includes("Calendar")) {
            calendar = i;
        } else if (item.includes("Marks")) {
            marks = i;
        } else if (item.includes("My Curriculum")) {
            curriculum = i;
        }
    }

    let nav = document.getElementsByClassName("collapse navbar-collapse")[0];
    let span = document.createElement("div");
    span.id = "navbar";

    const createButton = (text, index) => {
        let button = document.createElement("button");
        button.className = "btn btn-primary border-primary shadow-none";
        button.type = "button";
        button.style.background = "rgba(13,110,253,0)";
        button.style.borderStyle = "none";
        button.id = "nav_short";
        button.textContent = text;
        button.onclick = () => {
            Array.from(document.getElementsByTagName('a')).filter((e) => e.dataset.url)[index].click();
        };
        return button;
    };

    span.appendChild(createButton("Curriculum", curriculum));
    span.appendChild(createButton("Marks View", marks));
    span.appendChild(createButton("Attendance", attendance));
    span.appendChild(createButton("Course Page", course_page));
    span.appendChild(createButton("DA Upload", da_upload));

    if (time_table !== undefined) {
        span.appendChild(createButton("Time Table", time_table));
    } else {
        span.appendChild(createButton("Calendar", calendar));
    }

    nav.insertBefore(span, nav.children[0]);

    let buttons = document.querySelectorAll("[id=nav_short]");
    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            buttons.forEach((but) => {
                but.disabled = true;
                setTimeout(() => {
                    buttons.forEach((btn) => {
                        btn.disabled = false;
                    });
                }, 1500);
            });
        });
    });
};

const clear_navbar = () => {
    document.getElementById("navbar").remove();
};

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
let flag = false;

chrome.runtime.onMessage.addListener((request) => {
    if (request.message === "nav_bar_change") {
        try {
            if (
                document.getElementsByClassName("btn-group dropend")[0].style
                    .backgroundColor === "red"
            ) {
                document.getElementsByClassName("btn-group dropend")[0].remove();
            }
            if (
                document.getElementsByClassName(
                    "btn btn-primary border-primary shadow-none"
                ).length == 0 &&
                flag
            ) {
                nav_bar_change();
            }
        } catch (error) {
            console.log(error);
        }
    }
});
if (
    document.getElementsByClassName("btn-group dropend")[0]?.style
        .backgroundColor === "red"
) {
    document.getElementsByClassName("btn-group dropend")[0].remove();
}
if (
    document.getElementsByClassName("btn btn-primary border-primary shadow-none")
        .length == 0
) {
    window.addEventListener("load", nav_bar_change, false);
    flag = true;
}

let input = document.createElement("input");