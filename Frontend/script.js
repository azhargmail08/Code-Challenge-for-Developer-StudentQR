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
                displayResult(data);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function displayResult(data) {
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
        resultDiv.innerHTML = table;
    } else {
        resultDiv.innerHTML = '<p>No new records added.</p>';
    }
}

function resetForm() {
    document.getElementById('uploadForm').reset();
    document.getElementById('result').innerHTML = '';
}