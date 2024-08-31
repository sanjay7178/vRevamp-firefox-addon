let modify_grade_page = () => {
    // check the entry of ajax link
    // alert ("Hello");
    
    let tables = document.querySelectorAll(".customTable-level1 > tbody"); // select all Tables
    let subject_header = Array.from(document.querySelectorAll("#studentGradeView > div > div > div.row > div > div > div > table > tbody > tr"));
    let varCount = Array.from(document.querySelectorAll("#studentGradeView > div > div > div.row > div > div > div > table > tbody > tr")).length;
    let i = 0;
    // varCount =  $('#studentGradeView > div > div > div.row > div > div > div > table > tbody > tr').length ;
    // alert (varCount);
    try {
        console.log(parseInt(varCount));
    } catch (error) {
        console.log(error);
    }
    // iterate through the table tr 
    sum = 0;
    gpa = 0;
    for (i = 0; i < varCount; i++) {
        // To get the subject code
        // skip header 
        if (i == 0) {
            continue;
        }
        // S - 10, A - 9, B - 8, C - 7, D - 6, E - 5, F – 
        let sub_header_row = subject_header[i].getElementsByTagName("td");
        let credits_col ;
        let grade_col ;
        try {
            credits_col = sub_header_row[4].textContent;
            grade_col  =  sub_header_row[9].textContent;
        } catch (error) {
            continue;
        }
        let credits = credits_col.replace(/[^0-9.]+/g, "");
        let grade = grade_col.replace(/[^A-Z.]+/g, "");
        if(grade == 'S'){
            grade = 10;
        }else if(grade == 'A'){
            grade = 9;
        }else if(grade == 'B'){
            grade = 8;
        }else if(grade == 'C'){
            grade = 7;
        }else if(grade == 'D'){
            grade = 6;
        }else if(grade == 'E'){
            grade = 5;
        }else if(grade == 'F'){
            grade = 0;
        } 
        gpa += parseFloat(grade) * parseFloat(credits);
        sum += parseFloat(credits) ;
    }
    // console.log(gpa);
    // console.log(sum);
    let newRow = document.createElement("tr");
    newRow.className = "tableContent-level1";
    newRow.style.background = "rgb(170, 255, 0,0.6)";
    
    let newCell = document.createElement("td");
    newCell.colSpan = "11";
    newCell.style.textAlign = "center";
    newCell.textContent = `Your Semester Wise GPA : ${parseFloat(gpa/sum).toFixed(2)}`;
    
    newRow.appendChild(newCell);
    document.querySelector("#studentGradeView > div > div > div.row > div > div > div > table > tbody").appendChild(newRow);
}

chrome.runtime.onMessage.addListener((request) => {
    if (request.message === "exam_grade") {
        try {
            modify_grade_page();
        } catch (error) {
            console.log(error);
        }
    }
});