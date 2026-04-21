import { useEffect, useState } from "react";
import {
  Routes,
  Route,
  Link,
  useParams,
  useNavigate,
} from "react-router-dom";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./db";
import "./App.css";

function Home() {
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContacts() {
      const snapshot = await getDocs(collection(db, "contacts"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      data.sort((a, b) => a.lastName.localeCompare(b.lastName));
      setContacts(data);
      setLoading(false);
    }

    fetchContacts();
  }, []);

  const filtered = contacts.filter((c) =>
    `${c.firstName} ${c.lastName}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div>
      <h2>All Contacts</h2>

      <input
        type="text"
        placeholder="Search by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <p>Loading...</p>
      ) : filtered.length === 0 ? (
        <p>No contacts found</p>
      ) : (
        <ul>
          {filtered.map((c) => (
            <li key={c.id}>
              <Link to={`/contact/${c.id}`}>
                {c.firstName} {c.lastName}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ContactDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contact, setContact] = useState(null);

  useEffect(() => {
    async function load() {
      const snap = await getDoc(doc(db, "contacts", id));
      if (snap.exists()) {
        setContact({ id: snap.id, ...snap.data() });
      }
    }
    load();
  }, [id]);

  async function handleDelete() {
    if (!window.confirm("Delete this contact?")) return;
    await deleteDoc(doc(db, "contacts", id));
    navigate("/");
  }

  if (!contact) return <p>Loading...</p>;

  return (
    <div>
      <Link to="/" className="back-link">← Back</Link>

      <h2>
        {contact.firstName} {contact.lastName}
      </h2>
      <p>{contact.email}</p>

      <div className="actions">
        <Link to={`/edit/${id}`}>
          <button className="btn btn-primary">Edit</button>
        </Link>

        <button className="btn btn-danger" onClick={handleDelete}>
          Delete
        </button>
      </div>
    </div>
  );
}

function NewContact() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  async function handleSubmit(e) {
    e.preventDefault();
    const docRef = await addDoc(collection(db, "contacts"), form);
    navigate(`/contact/${docRef.id}`);
  }

  return (
    <div>
      <h2>New Contact</h2>

      <form onSubmit={handleSubmit} className="form">
        <div className="row">
          <input
            placeholder="First Name"
            value={form.firstName}
            onChange={(e) =>
              setForm({ ...form, firstName: e.target.value })
            }
            required
          />

          <input
            placeholder="Last Name"
            value={form.lastName}
            onChange={(e) =>
              setForm({ ...form, lastName: e.target.value })
            }
            required
          />
        </div>

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
          required
        />

        <button className="btn btn-primary">Add Contact</button>
      </form>
    </div>
  );
}

function EditContact() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);

  useEffect(() => {
    async function load() {
      const snap = await getDoc(doc(db, "contacts", id));
      if (snap.exists()) setForm(snap.data());
    }
    load();
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();
    await updateDoc(doc(db, "contacts", id), form);
    navigate(`/contact/${id}`);
  }

  if (!form) return <p>Loading...</p>;

  return (
    <div>
      <Link to={`/contact/${id}`} className="back-link">← Cancel</Link>

      <h2>Edit Contact</h2>

      <form onSubmit={handleSubmit}>
        <input
          value={form.firstName}
          onChange={(e) =>
            setForm({ ...form, firstName: e.target.value })
          }
          required
        />

        <input
          value={form.lastName}
          onChange={(e) =>
            setForm({ ...form, lastName: e.target.value })
          }
          required
        />

        <input
          type="email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
          required
        />

        <button>Save</button>
      </form>
    </div>
  );
}

function App() {
  return (
    <div className="app">
      <header>
        <h1>Contact Book</h1>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/new">Add Contact</Link>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact/:id" element={<ContactDetails />} />
          <Route path="/new" element={<NewContact />} />
          <Route path="/edit/:id" element={<EditContact />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;