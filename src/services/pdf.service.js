const workerFarm = require('worker-farm');
const path = require('path');

const workers = workerFarm(require.resolve('../workers/pdf.worker'));

const generatePdf = (url) => {
  return new Promise((resolve, reject) => {
    workers(url, (err, pdf) => {
      if (err) {
        return reject(err);
      }
      resolve(pdf);
    });
  });
};

const getWorkers = () => {
  return workers;
}

module.exports = {
  generatePdf,
  getWorkers
};
