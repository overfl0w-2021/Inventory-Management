'use client'; // This tells Next.js that this component will run on the client side

import { useEffect, useState } from 'react';

export default function Home() {
  const [data, setData] = useState<any[]>([]);  // State to hold the fetched data
  const [newItem, setNewItem] = useState<string>('');  // State to hold new item input
  const [quantity, setQuantity] = useState<string>('1');  // State to hold quantity input as a string
  const [errorMessage, setErrorMessage] = useState<string | null>(null);  // State to hold error messages
  const [successMessage, setSuccessMessage] = useState<string | null>(null);  // State to hold success messages

  // Fetch data from the API when the component mounts
  useEffect(() => {
    fetch('/api/data')
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch(() => setErrorMessage('Failed to fetch data'));
  }, []);

  // Handle the creation of a new item
  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();  // Prevent the form from refreshing the page

    const parsedQuantity = parseInt(quantity, 10);
    if (newItem.trim() === '' || isNaN(parsedQuantity) || parsedQuantity <= 0) {
      setErrorMessage('Please enter a valid item name and or a quantity greater than zero.');
      return;
    }

    await fetch('/api/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: newItem, quantity: parsedQuantity }),  // Send the new item and quantity to the API
    })
      .then(() => {
        fetch('/api/data')
          .then((res) => res.json())
          .then((data) => setData(data))
          .catch(() => setErrorMessage('Failed to fetch data'));
      })
      .then(() => setSuccessMessage('Item added successfully!'))
      .catch(() => setErrorMessage('Failed to create new item'));

    setNewItem('');  // Reset the input fields
    setQuantity('1');  // Reset quantity to default
    setErrorMessage(null);  // Clear any error messages
    setTimeout(() => setSuccessMessage(null), 2000);  // Clear success message after 2 seconds
  };

  // Handle the update of an item's quantity
  const handleUpdate = async (id: number, newQuantity: string) => {
    const parsedQuantity = parseInt(newQuantity, 10);

    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
      setErrorMessage('Please enter a valid quantity greater than zero.');
      return;
    }

    await fetch('/api/data', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, quantity: parsedQuantity }),  // Send the item ID and new quantity to the API
    })
      .then(() => {
        fetch('/api/data')
          .then((res) => res.json())
          .then((data) => setData(data))
          .catch(() => setErrorMessage('Failed to fetch data'));
      })
      .then(() => setSuccessMessage('Quantity updated successfully!'))
      .catch(() => setErrorMessage('Failed to update quantity'));

    setErrorMessage(null);  // Clear any error messages
    setTimeout(() => setSuccessMessage(null), 2000);  // Clear success message after 2 seconds
  };

  // Handle the deletion of an item
  const handleDelete = async (id: number) => {
    await fetch('/api/data', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),  // Send the item ID to be deleted
    })
      .then(() => {
        fetch('/api/data')
          .then((res) => res.json())
          .then((data) => setData(data))
          .catch(() => setErrorMessage('Failed to fetch data'));
      })
      .catch(() => setErrorMessage('Failed to delete item'));
  };

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold text-blue-500 mb-6 text-center">Inventory Management</h1>

      {/* Display error message */}
      {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}
      {/* Display success message */}
      {successMessage && <p className="text-green-500 text-center">{successMessage}</p>}

      {/* Form for adding new data */}
      <form onSubmit={handleCreate} className="flex justify-center mb-6">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Enter new item"
          className="border p-2 rounded-lg mr-4 w-1/2"
        />
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="Enter quantity"
          className="border p-2 rounded-lg w-32 mr-4 text-center"
          min="1"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg">
          Add Item
        </button>
      </form>

      {/* Display the data */}
      <ul className="max-w-2xl mx-auto">
        {data.length > 0 ? (
          data.map((item) => (
            <li key={item.id} className="flex items-center justify-between bg-gray-200 p-3 rounded-lg mb-3">
              <span>{item.name} - Quantity: {item.quantity}</span>
              <div className="flex items-center">
                <input
                  type="number"
                  defaultValue={item.quantity}
                  min="1"
                  className="border p-2 rounded-lg w-20 mr-2 text-center"
                  onChange={(e) => handleUpdate(item.id, e.target.value)}  // Update quantity when changed
                />
                <button
                  onClick={() => handleDelete(item.id)}  // Delete the item when clicked
                  className="ml-2 p-2 bg-red-500 text-white rounded-lg"
                >
                  Delete
                </button>
              </div>
            </li>
          ))
        ) : (
          <p className="text-gray-500 text-center">No items available. Add new items to display here.</p>
        )}
      </ul>
    </main>
  );
}