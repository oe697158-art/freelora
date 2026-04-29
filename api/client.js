let clients = []

export default function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json(clients)
  }

  if (req.method === 'POST') {
    const newClient = {
      id: Date.now().toString(),
      name: req.body.name,
      income: req.body.income,
      tasks: []
    }

    clients.push(newClient)
    return res.status(200).json(newClient)
  }

  if (req.method === 'DELETE') {
    const { id } = req.query
    clients = clients.filter(c => c.id !== id)
    return res.status(200).json({ success: true })
  }

  if (req.method === 'PUT') {
    const { id } = req.query
    const index = clients.findIndex(c => c.id === id)

    if (index !== -1) {
      clients[index] = req.body
    }

    return res.status(200).json(clients[index])
  }

  return res.status(405).json({ error: "Method not allowed" })
}