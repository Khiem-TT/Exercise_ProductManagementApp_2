let http = require('http');
let fs = require('fs');
let qs = require('qs');

let server = http.createServer((req, res) => {
    let idProduct;
    let nameProduct;
    let priceProduct;
    let html = '';
    if (req.method === 'GET') {
        fs.readFile('./insertproduct.html', 'utf-8', (err, data) => {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            res.end();
        });
    } else {
        req.on('error', () => {
            console.log('error');
        });
        let data = '';
        req.on('data', chunk => {
            data += chunk;
        });
        req.on('end', () => {
            data = qs.parse(data);
            idProduct = data.id;
            nameProduct = data.name;
            priceProduct = data.price;
            fs.readFile('./productdata.json', 'utf-8', (err, dataJson) => {
                if (err) {
                    console.log(err.message);
                }
                dataJson = JSON.parse(dataJson);
                let product = {"id": +idProduct, "name": nameProduct, "price": +priceProduct};
                dataJson.push(product);
                fs.writeFile('./productdata.json', JSON.stringify(dataJson), err => {
                    if (err) {
                        console.log(err.message);
                    }
                    fs.readFile('./productdata.json', 'utf-8', (err, dataJson) => {
                        if (err) {
                            console.log(err.message);
                        }
                        let dataFile = JSON.parse(dataJson);
                        dataFile.forEach((value, index) => {
                            html += '<tr>';
                            html += `<td>${index + 1}</td>`;
                            html += `<td>${value.name}</td>`;
                            html += `<td>${value.price}</td>`;
                            html += `<td><button style="background-color: red">Delete</button></td>`;
                            html += `<td><button style="background-color: blue">Update</button></td>`;
                            html += '</tr>';
                        });
                        fs.readFile('./insertproduct.html', 'utf-8', (err, dataHtml) => {
                            res.writeHead(200, {'Content-Type': 'text/html'});
                            dataHtml = dataHtml.replace('{list-products}', html);
                            res.write(dataHtml);
                            res.end();
                        });
                    });
                });
            });
        });
    }
});

server.listen(8000, () => {
    console.log('http://localhost:8000');
});