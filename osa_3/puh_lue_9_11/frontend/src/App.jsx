import { useState, useEffect } from 'react';
import personService from './services/persons';
import Notification from './components/Notification';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('success');

  useEffect(() => {
    personService
      .getAll()
      .then(data => {
        setPersons(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error.message);
        setMessage('Cannot connect to the server.');
        setMessageType('error');
        setTimeout(() => setMessage(null), 4000);
      });
  }, []);

  const addPerson = (event) => {
    event.preventDefault();
    const personObject = { name: newName, number: newNumber };

    const existingPerson = persons.find(p => p.name === newName);

    if (existingPerson) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        personService
          .update(existingPerson.id, personObject)
          .then(returnedPerson => {
            setPersons(persons.map(p => p.id !== existingPerson.id ? p : returnedPerson));
            setMessage(`Updated ${newName}'s number`);
            setMessageType('success');
            setTimeout(() => setMessage(null), 4000);
          })
          .catch(error => {
            setMessage(`Information of ${newName} has already been removed from the server`);
            setMessageType('error');
            setTimeout(() => setMessage(null), 4000);
            setPersons(persons.filter(p => p.id !== existingPerson.id));
          });
      }
    } else {
      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson));
          setMessage(`Added ${newName}`);
          setMessageType('success');
          setTimeout(() => setMessage(null), 4000);
          setNewName('');
          setNewNumber('');
        })
        .catch(error => {
          setMessage('Failed to add person. Please try again.');
          setMessageType('error');
          setTimeout(() => setMessage(null), 4000);
        });
    }
  };

  const deletePerson = (id) => {
    const person = persons.find(p => p.id === id);
    if (window.confirm(`Delete ${person.name}?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id));
          setMessage(`Deleted ${person.name}`);
          setMessageType('success');
          setTimeout(() => setMessage(null), 4000);
        })
        .catch(error => {
          setMessage(`Information of ${person.name} has already been removed from server`);
          setMessageType('error');
          setTimeout(() => setMessage(null), 4000);
          setPersons(persons.filter(p => p.id !== id));
        });
    }
  };

  return (
    <div>

      <h2>Phonebook</h2>

      <Notification message={message} type={messageType} />

      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={(e) => setNewName(e.target.value)} />
        </div>
        <div>
          number: <input value={newNumber} onChange={(e) => setNewNumber(e.target.value)} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>

      <h2>Numbers</h2>
      <ul>
        {persons.map(person => (
          <li key={person.id}>
            {person.name} {person.number}
            <button onClick={() => deletePerson(person.id)}>delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;

