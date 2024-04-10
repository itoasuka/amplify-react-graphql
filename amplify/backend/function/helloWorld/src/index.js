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

    const sheet = google.sheets({version: 'v4', auth});

    await getSheet(sheet);

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

async function getSheet(sheets) {
    const params = { spreadsheetId: "1-J-gCUfP6yQ3Q8wE018c9wS44rA0nSy-C_qvYut5Ugw", range: "2024" };
    const response = await sheets.spreadsheets.values.get(params);

    console.log(JSON.stringify(response.data, null, 2));
}
