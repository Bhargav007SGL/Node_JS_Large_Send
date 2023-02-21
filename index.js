let fileSystem = require("fs");
let ndjson = require("ndjson");
let records = [
  { id: 1, name: "O Brother, Where Art Thou?" },
  { id: 2, name: "Home for the Holidays" },
  { id: 3, name: "The Firm" },
  { id: 4, name: "Broadcast News" },
  { id: 5, name: "Raising Arizona" },
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
  let finalOutput = `[`;
  let inputStream = fileSystem.createReadStream(__dirname + "/data.ndjson");
  // let transformStream = inputStream.pipe(ndjson.parse());
  inputStream
    .on("data", function handleRecord(data) {
      console.log("Record (event):", data);
      finalOutput += data;
    })
    .on("end", function handleEnd() {
      console.log("- - - - - - - - - - - - - - - - - - - - - - -");
      console.log("ndjson parsing complete!");
      finalOutput += `]`;
      console.log(finalOutput);
    });
});
