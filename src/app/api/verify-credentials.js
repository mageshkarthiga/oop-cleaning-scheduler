export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { username, password, role } = req.body;

        // Call your verification function
        const user = await verifyUser(username, password, role);

        if (user) {
            return res.status(200).json({ valid: true });
        } else {
            return res.status(401).json({ valid: false });
        }
    } else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
