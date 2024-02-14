//Fetch sheet data from API and return them.
async function getSheetData() {
    const response = await fetch('https://docs.google.com/spreadsheets/d/1ffg83MGqBGBjjrt6E7WHPGw2S1M5tDMUxwNWLY5sOAo/gviz/tq?sheet=engenharia_de_software&range=A3:H');
    const result = await response.text();
    const data = JSON.parse(result.substr(47).slice(0, -2));
    console.log(data)
    return data.table.rows;
}

async function main() {
    const rowsData = await getSheetData();
    const tbody = document.querySelector('.grid tbody');

    //Create component to show the data from each student from the google sheet in its designated place.
    rowsData.forEach(item => {
        const studentData = document.createElement('tr');
        const registrationId = document.createElement('td');
        const studentName = document.createElement('td');
        const absence = document.createElement('td');
        const p1 = document.createElement('td');
        const p2 = document.createElement('td');
        const p3 = document.createElement('td');
        const situation = document.createElement('td');
        const passingGrade = document.createElement('td');

        const absenceAmount = item.c[2].v;
        const p1Grade = item.c[3].v;
        const p2Grade = item.c[4].v;
        const p3Grade = item.c[5].v;

        //Putting the data in the designated place.
        registrationId.textContent = item.c[0].v;
        studentName.textContent = item.c[1].v;
        absence.textContent = absenceAmount;
        p1.textContent = p1Grade;
        p2.textContent = p2Grade;
        p3.textContent = p3Grade;
        situation.textContent = calculateSituation(p1Grade, p2Grade, p3Grade, absenceAmount);
        passingGrade.textContent = situation.textContent === 'Exame Final' ? Math.round((100 - ((p1Grade + p2Grade + p3Grade) / 3))) : 0;

        studentData.appendChild(registrationId);
        studentData.appendChild(studentName);
        studentData.appendChild(absence);
        studentData.appendChild(p1);
        studentData.appendChild(p2);
        studentData.appendChild(p3);
        studentData.appendChild(situation);
        studentData.appendChild(passingGrade);

        tbody.appendChild(studentData);
    });
}

//Function to calculate if the student passed or not.
function calculateSituation(p1, p2, p3, absences) {
    const averageGrade = (p1 + p2 + p3) / 3;
    const totalClasses = 60;
    
    if(absences > totalClasses * 0.25) {
        return 'Reprovado por Falta'
    } else if(averageGrade < 50){
        return 'Reprovado por Nota';
    } else if (averageGrade >= 50 && averageGrade < 70) {
        return 'Exame Final';
    } 
    return 'Aprovado';
}

console.log(calculateSituation(35, 63, 61))

main();
