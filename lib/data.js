// dependencies
const fs = require("fs");
const path = require("path");

// module scaffolding
const lib = {};

// base directory of the data folder
lib.basedir = path.join(__dirname, "../.data/");

// write data to  file
lib.create = (dir, file, data, callback) => {
  fs.open(
    lib.basedir + dir + "/" + file + ".json",
    "wx",
    function (err1, fileDescriptor) {
      if (!err1 && fileDescriptor) {
        // convert data to string
        const stringData = JSON.stringify(data);

        // write data to file and close it
        fs.writeFile(fileDescriptor, stringData, (err2) => {
          if (!err2) {
            fs.close(fileDescriptor, (err3) => {
              if (!err3) {
                callback(false);
              } else {
                callback("Error to closing the file");
              }
            });
          } else {
            callback("Error writing new file");
          }
        });
      } else {
        callback("Could not create new file. Its may already exists!");
      }
    }
  );
};

// read data from file
lib.read = (dir, file, callback) => {
  fs.readFile(lib.basedir + dir + "/" + file + ".json", "utf8", (err, data) => {
    callback(err, data);
  });
};

// update existing file
lib.update = (dir, file, data, callback) => {
  fs.open(
    lib.basedir + dir + "/" + file + ".json",
    "r+",
    (err, fileDescriptor) => {
      if (!err && fileDescriptor) {
        // Convert the data to string
        const stringData = JSON.stringify(data);

        // truncate the file
        fs.ftruncate(fileDescriptor, (err1) => {
          if (!err1) {
            // write to the file
            fs.writeFile(fileDescriptor, stringData, (err2) => {
              if (!err2) {
                fs.close(fileDescriptor, (err3) => {
                  if (!err3) {
                    callback(false);
                  } else {
                    callback("Error closing the file");
                  }
                });
              } else {
                callback("Error to writing to file.");
              }
            });
          } else {
            callback("Error truncating file!");
          }
        });
      } else {
        callback(`Error file updating. File may not exists.`);
      }
    }
  );
};

// delete existing file
lib.delete = (dir, file, callback) => {
  // unlink file
  fs.unlink(lib.basedir + dir + "/" + file + ".json", (err) => {
    if (!err) {
      callback(false);
    } else {
      callback("Error deleting file");
    }
  });
};

// list all the item in a directory
lib.list = (dir, callback) => {
  fs.readdir(lib.basedir + dir + "/", (err1, fileNames) => {
    if (!err1 && fileNames && fileNames.length > 0) {
      let trimmedFileNames = [];
      fileNames.forEach((fileName) => {
        trimmedFileNames.push(fileName.replace(".json", ""));
      });
      callback(false, trimmedFileNames);
    } else {
      callback("Error reading directory!");
    }
  });
};

module.exports = lib;
