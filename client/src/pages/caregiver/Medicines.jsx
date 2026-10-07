import React, { useEffect, useState } from 'react';
import axios from '../../services/axios';

const Medicines = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    time: '',
    instructions: '',
  });

  const [editingId, setEditingId] = useState(null);

  // ==========================================
  // GET MEDICINES
  // ==========================================
  const fetchMedicines = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await axios.get('/caregiver/medicines');

      setMedicines(response.data);
    } catch (err) {
      console.error('Error fetching medicines:', err);

      setError(
        err.response?.data?.message ||
        'Failed to load medicines'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  // ==========================================
  // FORM INPUT
  // ==========================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // RESET FORM
  // ==========================================
  const resetForm = () => {
    setFormData({
      name: '',
      dosage: '',
      time: '',
      instructions: '',
    });

    setEditingId(null);
  };

  // ==========================================
  // ADD / UPDATE MEDICINE
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.dosage || !formData.time) {
      setError('Medicine name, dosage and time are required.');
      return;
    }

    try {
      setSaving(true);
      setError('');

      if (editingId) {
        await axios.put(
          `/caregiver/medicines/${editingId}`,
          formData
        );
      } else {
        await axios.post(
          '/caregiver/medicines',
          formData
        );
      }

      await fetchMedicines();

      resetForm();

    } catch (err) {
      console.error('Error saving medicine:', err);

      setError(
        err.response?.data?.message ||
        'Failed to save medicine'
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // EDIT MEDICINE
  // ==========================================
  const handleEdit = (medicine) => {
    setEditingId(medicine._id);

    setFormData({
      name: medicine.name || '',
      dosage: medicine.dosage || '',
      time: medicine.time || '',
      instructions: medicine.instructions || '',
    });

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // ==========================================
  // DELETE MEDICINE
  // ==========================================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this medicine?'
    );

    if (!confirmDelete) return;

    try {
      setError('');

      await axios.delete(
        `/caregiver/medicines/${id}`
      );

      setMedicines((prev) =>
        prev.filter((medicine) => medicine._id !== id)
      );

    } catch (err) {
      console.error('Error deleting medicine:', err);

      setError(
        err.response?.data?.message ||
        'Failed to delete medicine'
      );
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Medicines
        </h1>

        <p className="text-gray-500 mt-1">
          Manage medicines for your patient.
        </p>
      </div>

      {/* ERROR */}
      {error && (
        <div className="mb-5 p-3 rounded-lg bg-red-100 text-red-700">
          {error}
        </div>
      )}

      {/* ADD / EDIT FORM */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">

        <h2 className="text-lg font-semibold text-gray-800 mb-5">
          {editingId ? 'Edit Medicine' : 'Add Medicine'}
        </h2>

        <form onSubmit={handleSubmit}>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* MEDICINE NAME */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Medicine Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Paracetamol"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* DOSAGE */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dosage
              </label>

              <input
                type="text"
                name="dosage"
                value={formData.dosage}
                onChange={handleChange}
                placeholder="e.g. 500 mg"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* TIME */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time
              </label>

              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* INSTRUCTIONS */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Instructions
              </label>

              <input
                type="text"
                name="instructions"
                value={formData.instructions}
                onChange={handleChange}
                placeholder="e.g. After breakfast"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

          </div>

          {/* BUTTONS */}
          <div className="flex gap-3 mt-6">

            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {saving
                ? 'Saving...'
                : editingId
                  ? 'Update Medicine'
                  : 'Add Medicine'}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-5 py-2 rounded-lg border text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
            )}

          </div>

        </form>
      </div>

      {/* MEDICINE LIST */}
      <div className="bg-white rounded-xl shadow-sm border p-6">

        <h2 className="text-lg font-semibold text-gray-800 mb-5">
          Patient Medicines
        </h2>

        {loading ? (
          <p className="text-gray-500">
            Loading medicines...
          </p>
        ) : medicines.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <p className="text-lg">
              No medicines added yet.
            </p>

            <p className="text-sm mt-1">
              Add a medicine using the form above.
            </p>
          </div>
        ) : (
          <div className="space-y-4">

            {medicines.map((medicine) => (
              <div
                key={medicine._id}
                className="border rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >

                <div>

                  <h3 className="font-semibold text-gray-800 text-lg">
                    {medicine.name}
                  </h3>

                  <p className="text-gray-600">
                    Dosage: {medicine.dosage}
                  </p>

                  <p className="text-gray-600">
                    Time: {medicine.time}
                  </p>

                  {medicine.instructions && (
                    <p className="text-gray-500 text-sm mt-1">
                      {medicine.instructions}
                    </p>
                  )}

                  <span
                    className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${
                      medicine.status === 'done'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {medicine.status === 'done'
                      ? 'Taken'
                      : 'Pending'}
                  </span>

                </div>

                <div className="flex gap-2">

                  <button
                    type="button"
                    onClick={() => handleEdit(medicine)}
                    className="px-4 py-2 rounded-lg border text-blue-600 hover:bg-blue-50"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(medicine._id)
                    }
                    className="px-4 py-2 rounded-lg border text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  );
};

export default Medicines;