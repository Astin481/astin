document.getElementById('uploadForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const files = document.getElementById('fileInput').files;
    for (let file of files) {
        uploadFile(file);
    }
});

function uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);

    fetch('/upload', {
        method: 'POST',
        body: formData
    }).then(response => response.json())
    .then(data => {
        displayMedia(data.url, file.type);
    })
    .catch(error => console.error('Ошибка загрузки файла:', error));
}

function displayMedia(url, type) {
    const mediaContainer = document.getElementById('mediaContainer');
    let mediaElement;
    if (type.startsWith('image/')) {
        mediaElement = document.createElement('img');
        mediaElement.src = url;
    } else if (type.startsWith('video/')) {
        mediaElement = document.createElement('video');
        mediaElement.src = url;
        mediaElement.controls = true;
    }
    if (mediaElement) {
        mediaContainer.appendChild(mediaElement);
    }
}