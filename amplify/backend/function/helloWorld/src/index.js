const {google} = require('googleapis');
const fs = require('fs');
const keyFilename = process.env.GOOGLE_APPLICATION_CREDENTIALS ?? ""

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);
    const cre = fs.readFileSync(process.env.GOOGLE_APPLICATION_CREDENTIALS, 'utf8')
    console.log('credentials.json', cre);

    const auth = new google.auth.GoogleAuth({
        projectId: process.env.GOOGLE_CLOUD_PROJECT,
        keyFilename,
        scopes: ['https://www.googleapis.com/auth/drive.metadata.readonly'],
    });
    console.log(JSON.stringify(auth));

    const drive = google.drive({version: 'v3', auth});

    const params = {pageSize: 3};
    const res = await drive.files.list(params);
    console.log(res.data);

    return {
        statusCode: 200,
    //  Uncomment below to enable CORS requests
    //  headers: {
    //      "Access-Control-Allow-Origin": "*",
    //      "Access-Control-Allow-Headers": "*"
    //  },
        body: JSON.stringify(`Hello from Lambda!: ${process.cwd()}`),
    };
};
