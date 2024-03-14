const {google} = require('googleapis');

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);

    const auth = new google.auth.GoogleAuth({
        projectId: process.env.GOOGLE_CLOUD_PROJECT,
        scopes: ['https://www.googleapis.com/auth/drive.metadata.readonly'],
    });
    console.log(JSON.stringify(auth));

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
