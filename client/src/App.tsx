import React, { useEffect, useReducer, useState } from 'react';
import './App.css';

interface ItemI {
  name: string;
  description: string;
  _id?: string;
}

const reducer = (state: ItemI[], action: any) => {
  switch (action.type) {
    case 'SET_ITEMS':
      return action.payload;
    case 'ADD_ITEM':
      return [...state, action.payload];
    case 'DELETE_ITEM':
      return state.filter((item: ItemI) => item._id !== action.payload);
    case 'UPDATE_ITEM':
      return state.map((item: ItemI) =>
        item._id === action.payload._id ? action.payload : item
      );
    default:
      return state;
  }
};

function App() {
  const [items, dispatch] = useReducer(reducer, []);
  const [itemData, setItemData] = useState<ItemI>({
    name: '',
    description: '',
  });
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentItemId, setCurrentItemId] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:4040/items')
      .then(res => res.json())
      .then(data => {
        dispatch({ type: 'SET_ITEMS', payload: data.data });
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isEditing && currentItemId) {
      const res = await fetch(`http://localhost:4040/items/${currentItemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData),
      });
      const data = await res.json();
      if (res.status !== 200) {
        setError('Error updating item ' + data.error);
      } else {
        dispatch({ type: 'UPDATE_ITEM', payload: data.data });
        setIsEditing(false);
        setCurrentItemId(null);
        setItemData({ name: '', description: '' });
      }
    } else {
      const res = await fetch('http://localhost:4040/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData),
      });
      const data = await res.json();
      if (res.status !== 200) {
        setError('Error creating item ' + data.error);
      } else {
        dispatch({ type: 'ADD_ITEM', payload: data.data });
        setItemData({ name: '', description: '' });
      }
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`http://localhost:4040/items/${id}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (res.status !== 200) {
      setError('Error deleting item ' + data.error);
    } else {
      dispatch({ type: 'DELETE_ITEM', payload: id });
    }
  };

  const handleEdit = (id: string) => {
    const itemToEdit = items.find((item: ItemI) => item._id === id);
    if (itemToEdit) {
      setItemData(itemToEdit);
      setIsEditing(true);
      setCurrentItemId(id);
    }
  };

  return (
    <div className="App">
      <h1>Items</h1>
      <ul>
        {items.map((item: any) => (
          <li key={item._id}>
            <div className="content">
              <h2>{item.name}</h2>
              <p>{item.description}</p>
            </div>
            <div className="icons">
              <button onClick={() => handleEdit(item._id)}>Edit</button>
              <button onClick={() => handleDelete(item._id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <p style={{ color: 'red' }}>{error}</p>
        <label htmlFor="name">Name</label>
        <input
          value={itemData.name}
          id="name"
          type="text"
          name="name"
          onChange={e => setItemData({ ...itemData, name: e.target.value })}
        />
        <label htmlFor="description">Description</label>
        <textarea
          value={itemData.description}
          onChange={e =>
            setItemData({ ...itemData, description: e.target.value })
          }
          id="description"
          name="description"
          rows={4}
          maxLength={100}
        />
        <button type="submit">{isEditing ? 'Update' : 'Submit'}</button>
      </form>
    </div>
  );
}

export default App;
