export default async function handler(req, res) {
    // Feature removed
    return res.status(404).json({ error: 'Chat feature has been removed' });
}
