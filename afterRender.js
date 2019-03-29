const afterRenderHelper = require("./afterRenderHelper");

function afterRender(req, res, done) {
  const fs = require("fs");
  const path = require("path");
  const mkdirp = require("mkdirp");
  let filePath = afterRenderHelper.getFilePath();
  console.log("filePath", filePath);
  mkdirp.sync(filePath);
  let filename = "TestReport_" + Date.now() + ".pdf";
  fs.writeFile(path.join(filePath, filename), res.content, (err) => {
    if (err) {
      console.log("Could not saved report " + data.reportName + " : " + err);
      done();
    } else {
      console.log(data.reportName + " saved successfully");
      done();
    }
  });
}