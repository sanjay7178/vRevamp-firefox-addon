let modify_marks_page = () => {
    let tables = document.querySelectorAll(".customTable-level1 > tbody"); // select all Tables
    let subject_header = Array.from(document.querySelectorAll(".tableContent"));
    let i = 0;
    tables.forEach((table) => {
        // To get the subject code
        let sub_header_row = subject_header[i].getElementsByTagName("td");
        let sub_type = sub_header_row[4].textContent;
        let sub_type1 = sub_header_row[2].textContent;
        i += 2;
        let tot_max_marks = 0,
            tot_weightage_percent = 0,
            tot_scored = 0,
            tot_weightage_equi = 0,
            tot_class_avg = 0,
            tot_cat_fat = 0,
            max_marks_cat_fat = 0;

        let table_marks = table.querySelectorAll(".tableContent-level1"); // select rows excluding header
        table_marks = Array.from(table_marks);

        table_marks.forEach((row) => {
            let content = row.innerHTML.split("<td>");

            // Removing the tabs and other tags
            let cat_fat = content[2].replace('<output>', '').replace('</output></td>', '');
            let max_marks = content[3].replace(/[^0-9.]+/g, "");
            let weightage_percent = content[4].replace(/[^0-9.]+/g, "");
            let scored = content[6].replace(/[^0-9.]+/g, "");
            let weightage_equi = content[7].replace(/[^0-9.]+/g, "");
            let class_avg = content[8].replace(/[^0-9.]+/g, "");

            // cat + fat 
            if (cat_fat.match(/CAT/) == 'CAT') {
                tot_cat_fat += parseFloat(scored);
                max_marks_cat_fat += parseFloat(max_marks);
            } else if (cat_fat.match(/FAT/) == 'FAT') {
                tot_cat_fat += parseFloat(scored);
                max_marks_cat_fat += parseFloat(max_marks);
            } else if (cat_fat.match(/CAT1/) == 'CAT1') {
                tot_cat_fat += parseFloat(scored);
                max_marks_cat_fat += parseFloat(max_marks);
            } else if (cat_fat.match(/CAT2/) == 'CAT2') {
                tot_cat_fat += parseFloat(scored);
                max_marks_cat_fat += parseFloat(max_marks);
            }

            // converting string to float
            tot_max_marks += parseFloat(max_marks);
            tot_weightage_percent += parseFloat(weightage_percent);
            tot_scored += parseFloat(scored);
            tot_weightage_equi += parseFloat(weightage_equi);
            tot_class_avg += parseFloat(class_avg);
        });

        // Add the row to display totals
        let tr = document.createElement('tr');
        tr.className = 'tableContent-level1';
        tr.style.background = 'rgb(60,141,188,0.8)';

        let td1 = document.createElement('td');
        let td2 = document.createElement('td');
        td2.textContent = 'Total:';
        let td3 = document.createElement('td');
        td3.textContent = tot_max_marks.toFixed(2);
        let td4 = document.createElement('td');
        td4.textContent = tot_weightage_percent.toFixed(2);
        let td5 = document.createElement('td');
        let td6 = document.createElement('td');
        td6.textContent = tot_scored.toFixed(2);
        let td7 = document.createElement('td');
        td7.textContent = tot_weightage_equi.toFixed(2);
        let td8 = document.createElement('td');
        td8.textContent = tot_class_avg.toFixed(2);
        let td9 = document.createElement('td');
        td9.textContent = 'Lost Weightage Marks:';
        let td10 = document.createElement('td');
        td10.textContent = (tot_weightage_percent.toFixed(2) - tot_weightage_equi.toFixed(2)).toFixed(2);

        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        tr.appendChild(td5);
        tr.appendChild(td6);
        tr.appendChild(td7);
        tr.appendChild(td8);
        tr.appendChild(td9);
        tr.appendChild(td10);

        table.appendChild(tr);
    });
}

chrome.runtime.onMessage.addListener((request) => {
    if (request.message === "mark_view_page") {
        try {
            modify_marks_page();
            saveMarksPage(document.querySelector(".box-body").outerHTML);
        } catch (error) {
            console.error(error);
        }
    }
});