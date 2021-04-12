const csv = require('csv-parser');
const fs = require('fs');
var path = require("path");

const results = [];
const file1 = process.argv[2];
const file1BaseName = path.basename(file1);
const file2 = process.argv[3];
const file2BaseName = path.basename(file2);
const combinedFile = process.argv[4];

const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
    path: combinedFile,
    header: [
        {id: 'email_hash', title: 'email_hash'},
        {id: 'category', title: 'category'},
        {id: 'filename', title: 'filename'}
    ]
});




fs.createReadStream(file1)
    .pipe(csv({}))
    .on('data',(data)=> {
        data.filename = file1BaseName;
        results.push(data);
    })
    .on('end', () => {
        fs.createReadStream(file2)
            .pipe(csv({}))
            .on('data', (data)=> {
                data.filename = file2BaseName;
                results.push(data);
            })
            .on('end', ()=>{
                csvWriter.writeRecords(results)       
                    .then(() => {
                         console.log('...Done');
                    })
                    .catch(err => console.log(err));
            })
    })