const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    console.log(`Получен запрос на ${req.url} с методом ${req.method}`);

    if (req.url === '/' && req.method === 'GET') {
        const filePath = path.join(__dirname, 'index.html');
        fs.readFile(filePath, (err, data) => {
            if (err) {
                console.error('Ошибка загрузки index.html:', err);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Ошибка: не удается загрузить index.html');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    } else if (req.url === '/submit' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const decodedData = decodeURIComponent(body.split('=')[1]);

            fs.appendFile('data.txt', decodedData + '\n', (err) => {
                if (err) {
                    console.error('Не удалось сохранить данные:', err);
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Ошибка сохранения файла');
                } else {
                    console.log('Данные успешно сохранены');
                    res.writeHead(302, { 'Location': '/' });
                    res.end();
                }
            });
        });
    } else if (req.url === '/show' && req.method === 'GET') {
        fs.readFile('data.txt', (err, data) => {
            if (err) {
                console.error('Ошибка чтения data.txt:', err);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Ошибка: Не удается загрузить data.txt');
            } else {
                const cleanedData = data.toString().replace(/\+/g, ' ').trim();
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end(cleanedData);
            }
        });
    } else {
        console.log(`404 Not Found for ${req.url}`);
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

const PORT = 1337;
server.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}/`);
});
