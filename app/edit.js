import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function EditItem() {
  const router = useRouter();
  const { id } = router.query;  // Get the item ID from the URL
  const [name, setName] = useState('');  // State to hold the item name
  const [loading, setLoading] = useState(true);  // State to manage loading

  useEffect(() => {
    // Fetch the item details when the component is mounted
    if (id) {
      fetch(`/api/data?id=${id}`)
        .then((res) => res.json())
        .then((item) => {
          setName(item.name);  // Set the fetched item name in the input field
          setLoading(false);  // Disable loading once data is fetched
        });
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Send the updated item name to the API
    await fetch('/api/data', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, name }),  // Send the ID and updated name to the API
    });

    // Redirect back to the home page after the update
    router.push('/');
  };

  if (loading) {
    return <div>Loading...</div>;  // Display a loading message until the data is fetched
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl">Edit Item</h1>
      <form onSubmit={handleSubmit} className="mt-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Edit item name"
          className="border p-2 w-full mb-4"
        />
        <button type="submit" className="bg-green-500 text-white p-2 rounded">
          Update Item
        </button>
      </form>
    </div>
  );
}