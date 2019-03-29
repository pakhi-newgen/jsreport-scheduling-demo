const fs = require("fs");
const path = require("path");
const jsreport = require("jsreport-core")({
  "allowLocalFilesAccess": true
});

let templateContent = fs.readFileSync(path.resolve(__dirname, "template.html"), "utf8", (err, html) => {
  if (err) {
    return null;
  }
  return html;
});
let afterRender = fs.readFileSync(path.resolve(__dirname, "afterRender.js"), "utf8", (err, content) => {
  return content;
});
let scripts = [{
  content: afterRender
}];

let templateData = {
  name: "TestTemplate",
  content: templateContent,
  engine: "handlebars",
  recipe: "phantom-pdf",
  scripts: scripts
}

jsreport.init().then(() => {
  return jsreport.documentStore.collection("templates").insert(templateData)
    .then((template) => {
      return jsreport.documentStore.collection("schedules").insert({
        name: "TestReport",
        cron: "*/1 * * * *",
        enabled: false,
        templateShortid: template.shortid
      });
    })
    .then((scheduleObj) => {
      console.log("Schedule created in disabled mode.");
      console.log("You will receive a prompt to enable the schedule after 3 minutes.");
    })
    .catch((e) => {
      console.log("Could not create schedule");
    });
})

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})

setTimeout(function() {
  readline.question(`Enable Schedule?`, (response) => {
    jsreport.documentStore.collection("schedules").find({
      name: "TestReport"
    }).then((scheduleList) => {
      jsreport.documentStore.collection("schedules").update(
        { _id: scheduleList[0]._id },
        {
          $set: {
            enabled: true
          }
        }).then(()=> {
          console.log("Enabled the schedule");
        })
    });
    readline.close()
  })
}, 3*60*1000);
