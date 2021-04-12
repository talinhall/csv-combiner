const csv = require('csv-parser');
const fs = require('fs');
const path = require("path");

const results = [];
//Grab  all the CSV files that will be merged. 
const myArgs = process.argv.slice(2, process.argv.length-1);
const combinedFile = process.argv[process.argv.length-1];

const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
    path: combinedFile,
    header: [
        {id: 'email_hash', title: 'email_hash'},
        {id: 'category', title: 'category'},
        {id: 'filename', title: 'filename'}
    ]
});


let myArgsIndex = 0;

let combineCSV = (myArgsIndex) =>{
    fs.createReadStream(myArgs[myArgsIndex])
        .pipe(csv({}))
        .on('data',(data)=> {
            data.filename = path.basename(myArgs[myArgsIndex]);
            results.push(data);
            })
        .on('end', ()=> {
            if(myArgsIndex === myArgs.length -1 ){
                //all of the files have been read and now need to write the results on a new CSV file. 
                csvWriter.writeRecords(results)       
                .then(() => {
                    console.log('...Done');
                })
                .catch(err => console.log(err));
            }else{
                myArgsIndex++;
                combineCSV(myArgsIndex);
                }
    
        })
};

//Error check if there are no CSV files to be read.
if(myArgs.length > 0){
    combineCSV(myArgsIndex);
}

