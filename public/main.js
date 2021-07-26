
function drawLineCharts(course, grades) {
    const header = document.createElement('h2');
    header.innerText = course.shortname;
    document.body.appendChild(header);

    const canvas = document.createElement('canvas');
    document.body.appendChild(canvas);

    const chart = new Chart(canvas.getContext('2d'), {
        type: 'line',
        data: {
            labels: grades.map((_, i) => i),
            datasets: [{ 
                data: grades.map(g => g && g.grade),
                label: 'Grade',
                borderColor: '#3cba9f',
                backgroundColor: '#3cba9f',
                fill: false,
              }, { 
                data: grades.map(g => g && g.max),
                label: 'Max',
                borderColor: '#3e95cd',
                backgroundColor: '#3e95cd',
                fill: false,
              }, { 
                data: grades.map(g => g && 100 * g.grade / g.max),
                label: '%',
                borderColor: '#fc6290',
                backgroundColor: '#fc6290',
                fill: false,
              }]
        }});

    console.log(course.shortname, chart);
}

const parseGrades = (grades) =>
    grades.tabledata.map(g => {
        if (g.grade !== undefined && !isNaN(g.grade.content)) {
            const grade = parseFloat(g.grade.content);
            const max = parseFloat(g.range.content.split(/;/g)[1]);
            return { grade, max };
        }
        return null;
    });

document.addEventListener('DOMContentLoaded', () => {
    axios.get('/api/info')
    .then(res => res.data)
    .then(info =>
        axios.get(`/api/user/${info.userid}/courses/`)
            .then(res => res.data)
            .then(courses => {
                fullname.innerText = info.fullname;

                for (const course of courses) {
                    axios.get(`/api/user/${info.userid}/grades/${course.id}`)
                    .then(res => res.data)
                    .then(grades => 
                        drawLineCharts(course, parseGrades(grades)));
                }

                loading.remove();
            })
    );
});
