let fileSystem = require("fs");
let ndjson = require("ndjson");
let finalOutput = [];
let records = [
  { id: 1, name: "O Brother, Where Art Thou?" },
  { id: 2, name: "Home for the Holidays" },
  { id: 3, name: "The Firm" },
  { id: 4, name: "Broadcast News" },
  { id: 5, name: "Raising Arizona" },
  // .... hundreds of thousands of records ....
];
let transformStream = ndjson.stringify();
let outputStream = transformStream.pipe(
  fileSystem.createWriteStream(__dirname + "/data.ndjson")
);
records.forEach(function iterator(record) {
  transformStream.write(record);
});
transformStream.end();
outputStream.on("finish", function handleFinish() {
  console.log("ndjson serialization complete!");
  console.log("- - - - - - - - - - - - - - - - - - - - - - -");
});
outputStream.on("finish", function handleFinish() {
  let inputStream = fileSystem.createReadStream(__dirname + "/data.ndjson");
  let transformStream = inputStream.pipe(ndjson.parse());

  transformStream
    .on("data", function handleRecord(data) {
      console.log("Record (event):", data);
      finalOutput.push(data);
    })
    .on("end", function handleEnd() {
      console.log("- - - - - - - - - - - - - - - - - - - - - - -");
      console.log("ndjson parsing complete!");
      console.log(finalOutput);
    });
});
