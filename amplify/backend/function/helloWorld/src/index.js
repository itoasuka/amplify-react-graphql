const {GoogleAuth} = require('google-auth-library');

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);

    const auth = new GoogleAuth({
        scopes: ['https://www.googleapis.com/auth/drive.metadata.readonly'],
    });
    console.log('GOOGLE_APPLICATION_CREDENTIALS', process.env.GOOGLE_APPLICATION_CREDENTIALS);
    console.log('GOOGLE_CLOUD_PROJECT', process.env.GOOGLE_CLOUD_PROJECT);
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
