import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

// Open the database connection
async function openDb() {
  return open({
    filename: './mydb.sqlite',
    driver: sqlite3.Database,
  });
}

export default async function handler(req, res) {
  const db = await openDb();

  // Handle POST request (data creation or update if item already exists)
  if (req.method === 'POST') {
    const { name, quantity } = req.body;

    // Basic validation on the server-side
    if (!name || quantity <= 0) {
      return res.status(400).json({ error: 'Invalid item name or quantity.' });
    }

    try {
      // Check if the item already exists
      const existingItem = await db.get('SELECT * FROM items WHERE name = ?', [name]);

      if (existingItem) {
        // Update the quantity if the item exists
        const newQuantity = existingItem.quantity + quantity;
        await db.run('UPDATE items SET quantity = ? WHERE name = ?', [newQuantity, name]);
        res.status(200).json({ id: existingItem.id, name, quantity: newQuantity });
      } else {
        // Insert a new item if it doesn't exist
        const result = await db.run('INSERT INTO items (name, quantity) VALUES (?, ?)', [name, quantity]);
        res.status(201).json({ id: result.lastID, name, quantity });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to insert or update data' });
    }

  // Handle GET request (data retrieval)
  } else if (req.method === 'GET') {
    try {
      const items = await db.all('SELECT * FROM items');
      res.status(200).json(items);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve data' });
    }

  // Handle PUT request (data editing)
  } else if (req.method === 'PUT') {
    const { id, quantity } = req.body;

    if (quantity <= 0) {
      return res.status(400).json({ error: 'Invalid quantity.' });
    }

    try {
      await db.run('UPDATE items SET quantity = ? WHERE id = ?', [quantity, id]);
      res.status(200).json({ message: 'Item updated!' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update data' });
    }

  // Handle DELETE request (data deletion)
  } else if (req.method === 'DELETE') {
    const { id } = req.body;

    try {
      await db.run('DELETE FROM items WHERE id = ?', [id]);
      res.status(200).json({ message: 'Item deleted!' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete data' });
    }

  // Handle unsupported methods
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}