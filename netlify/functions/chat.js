export const handler = async (event, context) => {
    return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Chat feature has been removed' }),
    };
};
