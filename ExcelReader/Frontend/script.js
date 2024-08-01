document.getElementById('fileInput').addEventListener('change', function () {
    const fileInput = document.getElementById('fileInput');
    const fileNameSpan = document.getElementById('fileName');
    fileNameSpan.textContent = fileInput.files[0].name;
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
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function appendResult(data) {
    const resultDiv = document.getElementById('result');
    if (data.length > 0) {
        let table = '<table><thead><tr><th>Name</th><th>Class</th><th>Level</th><th>Parent Contact</th></tr></thead><tbody>';
        data.forEach(row => {
            table += `<tr>
                <td>${row.Name}</td>
                <td>${row.Class}</td>
                <td>${row.Level}</td>
                <td>${row["Parent Contact"]}</td>
            </tr>`;
        });
        table += '</tbody></table>';
        resultDiv.innerHTML += table; // Append the new table to the existing content
    } else {
        alert('No new records added.'); // Display an alert instead of appending the message
    }
}

function resetForm() {
    document.getElementById('uploadForm').reset();
    document.getElementById('fileName').textContent = '';
}
