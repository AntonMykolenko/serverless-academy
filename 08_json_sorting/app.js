import axios from "axios";
import https from "https";
import links from "./links.js";

const agent = new https.Agent({
    rejectUnauthorized: false,
});

const main = async (links) => {
    let trueVal = 0;
    let falseVal = 0;
    const maxRetry = 3;

    Promise.all(
        links.map((link) =>
            (async () => {
                let retry = 0;
                while (retry < maxRetry) {
                    try {
                        const result = await axios.get(link, { httpsAgent: agent });
                        const dataConvert = JSON.stringify(result.data);
                        const find = /"isDone":(true|false)/;
                        const findValue = dataConvert.match(find)[0].split(":")[1];
                        console.log(link + ": isDone - " + findValue);
                        if (findValue === "true") {
                            trueVal++;
                        } else {
                            falseVal++;
                        }
                        break;
                    } catch (error) {
                        console.error(`Error while processing endpoint ${link}: ${error.message}`);
                        retry++;
                        if (retry === maxRetry) {
                            console.error(`Endpoint ${link} is not working after ${maxRetry} retries.`);
                            falseVal++;
                            break;
                        }
                    }
                }
            })()
        )
    )
        .then(() => {
            console.log("True values:  " + trueVal);
            console.log("False values:  " + falseVal);
        });
}

main(links);