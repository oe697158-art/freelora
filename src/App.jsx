import { useState, useEffect } from 'react'
import './App.css'
import { FaHome, FaUsers, FaChartBar } from 'react-icons/fa'

const API = 'http://localhost:5000/clients'

function App() {
  const [clients, setClients] = useState([])
  const [name, setName] = useState('')
  const [income, setIncome] = useState('')
  const [loading, setLoading] = useState(true)
  const [active, setActive] = useState('dashboard')

  const load = () => {
    setLoading(true)
    fetch(API)
      .then(res => res.json())
      .then(data => {
        setClients(data)
        setLoading(false)
      })
  }

  useEffect(() => {
    load()
  }, [])

  const addClient = async () => {
    if (!name || !income) return

    await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, income, tasks: [] })
    })

    load()
    setName('')
    setIncome('')
  }

  const deleteClient = async (id) => {
    await fetch(`${API}/${id}`, { method: 'DELETE' })
    load()
  }

  const addTask = async (client, text) => {
    if (!text) return

    const updated = {
      ...client,
      tasks: [...client.tasks, { text, done: false }]
    }

    await fetch(`${API}/${client.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    })

    load()
  }

  const toggleTask = async (client, i) => {
    const updated = { ...client }
    updated.tasks[i].done = !updated.tasks[i].done

    await fetch(`${API}/${client.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    })

    load()
  }

  /* Stats */
  const totalIncome = clients.reduce((s, c) => s + Number(c.income), 0)
  const totalClients = clients.length
  const totalTasks = clients.reduce((s, c) => s + c.tasks.length, 0)

  return (
    <div className="layout">

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo-box">
          <div className="logo-icon">F</div>
          <span>Freelora</span>
        </div>

        <div className="menu">

          <div
            className={active === 'dashboard' ? 'menu-item active' : 'menu-item'}
            onClick={() => setActive('dashboard')}
          >
            <FaHome />
            <span>Dashboard</span>
          </div>

          <div
            className={active === 'clients' ? 'menu-item active' : 'menu-item'}
            onClick={() => setActive('clients')}
          >
            <FaUsers />
            <span>Clients</span>
          </div>

          <div
            className={active === 'analytics' ? 'menu-item active' : 'menu-item'}
            onClick={() => setActive('analytics')}
          >
            <FaChartBar />
            <span>Analytics</span>
          </div>

        </div>
      </aside>

      {/* Main */}
      <main className="main">

        <div className="top">
          <h1>{active}</h1>
        </div>

        {/* Dashboard */}
        {active === 'dashboard' && (
          <>
            <div className="stats">
              <div className="stat-card">
                <h4>Total Income</h4>
                <p>${totalIncome}</p>
              </div>

              <div className="stat-card">
                <h4>Clients</h4>
                <p>{totalClients}</p>
              </div>

              <div className="stat-card">
                <h4>Tasks</h4>
                <p>{totalTasks}</p>
              </div>
            </div>
          </>
        )}

        {/* Clients */}
        {active === 'clients' && (
          <>
            <div className="add-box">
              <input
                placeholder="Client Name"
                value={name}
                onChange={e => setName(e.target.value)}
              />

              <input
                placeholder="Income"
                value={income}
                onChange={e => setIncome(e.target.value)}
              />

              <button onClick={addClient}>Add Client</button>
            </div>

            {loading && <p className="loading">Loading...</p>}

            <div className="grid">
              {clients.map(client => (
                <div key={client.id} className="card">

                  <div className="card-top">
                    <h3>{client.name}</h3>
                    <button onClick={() => deleteClient(client.id)}>✕</button>
                  </div>

                  <p className="income">${client.income}</p>

                  <input
                    placeholder="Add Task"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        addTask(client, e.target.value)
                        e.target.value = ''
                      }
                    }}
                  />

                  {client.tasks.map((t, i) => (
                    <div
                      key={i}
                      onClick={() => toggleTask(client, i)}
                      className={t.done ? 'task done' : 'task'}
                    >
                      {t.text}
                    </div>
                  ))}

                </div>
              ))}
            </div>
          </>
        )}

        {/* Analytics */}
        {active === 'analytics' && (
          <p>Analytics coming soon 🚀</p>
        )}

      </main>

    </div>
  )
}

export default App