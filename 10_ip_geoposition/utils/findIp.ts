import fs from 'fs';

const IP_CONSTS: number[] = [16777216, 65536, 256, 1];

const dotProduct = (arr1: number[], arr2: number[]): number => {
  const product = arr1.map((x, i) => arr1[i] * arr2[i]);
  return product.reduce((a, b) => a + b);
};

const convertToNumber = (ip: string): number => {
  if (ip === null || typeof ip !== "string") {
    throw new Error('Invalid IP address: ' + ip);
  }

  let values: string[] = ip.split(".");
  const numericValues: number[] = values.map((value) => parseInt(value, 10));
  return dotProduct(numericValues, IP_CONSTS);
};


const convertIPToLocation = async (ip: string): Promise<string | null> => {
  const csvFilePath: string = '../10_ip_geoposition/IP2LOCATION-LITE-DB1.CSV';

  return new Promise<string | null>((resolve, reject) => {
    fs.readFile(csvFilePath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading CSV file:', err);
        reject(err);
        return;
      }

      const rows: string[] = data.split('\n');

      for (let i = 0; i < rows.length; i++) {
        const row: string[] = rows[i].split(',');

        if (row.length >= 4) {
          const startIP: number = parseInt(row[0].replace(/"/g, ''), 10);
          const endIP: number = parseInt(row[1].replace(/"/g, ''), 10);
          const userIP: number = convertToNumber(ip);

          if (userIP >= startIP && userIP <= endIP) {
            const location = {
              ip: userIP,
              country: row[2].replace(/"/g, ''),
              countryFullName: row[3].replace(/"/g, '').replace(/\r/g, ''),
            };
            console.log('Location:', location);
            resolve(JSON.stringify(location, null, 3));
            return;
          }
        }
      }

      console.log('Location not found for the given IP address.');
      resolve(null);
    });
  });
}

export default convertIPToLocation;
