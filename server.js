const express = require('express');
const multer = require('multer');
const fetch = require('node-fetch');
const path = require('path');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.static(path.join(__dirname, 'public')));

app.post('/upload', upload.single('file'), async (req, res) => {
    const file = req.file;
    try {
        const response = await uploadToYandexDisk(file);
        fs.unlinkSync(file.path); // удаляем временный файл
        res.json({ url: response.href });
    } catch (error) {
        console.error('Ошибка загрузки на Яндекс.Диск:', error);
        res.status(500).send('Ошибка загрузки файла');
    }
});

async function uploadToYandexDisk(file) {
    const diskUrl = 'https://cloud-api.yandex.net/v1/disk/resources/upload';
    const accessToken = process.env.YANDEX_DISK_TOKEN;

    const response = await fetch(diskUrl + '?path=' + encodeURIComponent(file.originalname), {
        method: 'GET',
        headers: {
            'Authorization': 'OAuth ' + accessToken
        }
    });
    const data = await response.json();
    const uploadUrl = data.href;

    const fileStream = fs.createReadStream(file.path);
    await fetch(uploadUrl, {
        method: 'PUT',
        body: fileStream,
        headers: {
            'Content-Type': 'application/octet-stream'
        }
    });

    return data;
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});