const {google} = require('googleapis');

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);

    const auth = new google.auth.GoogleAuth({
        scopes: ['https://www.googleapis.com/auth/drive'],
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
