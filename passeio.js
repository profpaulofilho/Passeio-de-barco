import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const sql = neon(process.env.DATABASE_URL);

    try {
        if (req.method === 'GET') {
            const data = await sql`SELECT * FROM passeio_barco ORDER BY id ASC`;
            return res.status(200).json(data);
        }
        if (req.method === 'POST') {
            // Inscrições encerradas (20 vagas preenchidas)
            return res.status(403).json({ error: 'Inscrições encerradas' });
            const { name, companions } = req.body;
            const data = await sql`INSERT INTO passeio_barco (name, companions) VALUES (${name}, ${companions || 0}) RETURNING *`;
            return res.status(200).json(data[0]);
        }
        if (req.method === 'PUT') {
            const { id, companions } = req.body;
            const data = await sql`UPDATE passeio_barco SET companions = ${companions} WHERE id = ${id} RETURNING *`;
            return res.status(200).json(data[0]);
        }
        if (req.method === 'DELETE') {
            const { id } = req.body;
            await sql`DELETE FROM passeio_barco WHERE id = ${id}`;
            return res.status(200).json({ success: true });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
