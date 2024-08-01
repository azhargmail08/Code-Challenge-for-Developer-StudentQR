document.getElementById('fileInput').addEventListener('change', function () {
    const fileInput = document.getElementById('fileInput');
    const fileNameSpan = document.getElementById('fileName');
    fileNameSpan.textContent = fileInput.files[0].name;
    document.getElementById('fileLabel').textContent = fileInput.files[0].name;
});

function uploadFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append('file', file);

    fetch('http://127.0.0.1:5000/upload', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
            } else {
                appendResult(data);
                document.getElementById('fileLabel').textContent = 'Choose file'; // Reset label text after upload
                document.getElementById('fileName').textContent = ''; // Reset file name span after upload
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function appendResult(data) {
    const resultDiv = document.getElementById('result');
    if (data.length > 0) {
        let table = document.querySelector('#result table');
        if (!table) {
            table = document.createElement('table');
            table.innerHTML = `
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Class</th>
                        <th>Level</th>
                        <th>Parent Contact</th>
                    </tr>
                </thead>
                <tbody></tbody>
            `;
            resultDiv.appendChild(table);
        }

        const tbody = table.querySelector('tbody');
        data.forEach(row => {
            const existingRows = Array.from(tbody.querySelectorAll('tr'));
            const duplicate = existingRows.some(existingRow => {
                const cells = existingRow.children;
                return cells[0].textContent === row.Name &&
                    cells[1].textContent === row.Class &&
                    cells[2].textContent === row.Level.toString() &&
                    cells[3].textContent === row["Parent Contact"];
            });

            if (!duplicate) {
                const newRow = document.createElement('tr');
                newRow.innerHTML = `
                    <td>${row.Name}</td>
                    <td>${row.Class}</td>
                    <td>${row.Level}</td>
                    <td>${row["Parent Contact"]}</td>
                `;
                tbody.appendChild(newRow);
            }
        });
    } else {
        alert('No new records added.'); // Display an alert instead of appending the message
    }
}

function resetForm() {
    document.getElementById('uploadForm').reset();
    document.getElementById('fileLabel').textContent = 'Choose file';
    document.getElementById('fileName').textContent = '';
}