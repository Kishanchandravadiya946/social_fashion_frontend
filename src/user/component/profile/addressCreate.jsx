import { useState,useEffect } from "react";
import  Input  from "./AddressUI/Input"; // Assuming these components exist
import  Button from "./AddressUI/button";
import  Modal  from "./AddressUI/Modal";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; 

export default function AddressCreate({ onClose, onAddressAdded }) {
  const [formData, setFormData] = useState({
    unit_number: "",
    street_number: "",
    address_line1: "",
    address_line2: "",
    city: "",
    region: "",
    postal_code: "",
    country_id: "",
  });

  const [countries, setCountries] = useState([]);


  useEffect(() => {
    async function fetchCountries() {
      try {
        const response = await fetch(`${API_BASE_URL}/user/get_countries`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (!response.ok) throw new Error("Failed to fetch countries");

        const data = await response.json();
        console.log(data)
        setCountries(data); // Assuming data is an array of { id, name }
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    }

    fetchCountries();
  }, []);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/user/new_address`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to add address");
      const data = await response.json();
      console.log(data);
      onAddressAdded(data.new_user);
      // console.log(formData)
       // Update the parent component with the new address
      onClose();
    } catch (error) {
      console.error("Error adding address:", error);
    }
  };

  return (
    <Modal onClose={onClose} title="Add New Address">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input name="unit_number" label="Unit Number" value={formData.unit_number} onChange={handleChange} />
        <Input name="street_number" label="Street Number" value={formData.street_number} onChange={handleChange} />
        <Input name="address_line1" label="Address Line 1" value={formData.address_line1} onChange={handleChange} required />
        <Input name="address_line2" label="Address Line 2" value={formData.address_line2} onChange={handleChange} />
        <Input name="city" label="City" value={formData.city} onChange={handleChange} required />
        <Input name="region" label="Region" value={formData.region} onChange={handleChange} required />
        <Input name="postal_code" label="Postal Code" value={formData.postal_code} onChange={handleChange} required />
        <div>
          <label className="text-gray-700 font-medium">Country</label>
          <select
            name="country_id"
            value={formData.country_id}
            onChange={handleChange}
            required
            className="border p-2 rounded-lg w-full"
          >
            <option value="">Select a country</option>
            {countries.map((country) => (
              <option key={country.id} value={country.id}>
                {country.country_name}
              </option>
            ))}
          </select>
        </div>
        <Button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Create Address</Button>
      </form>
    </Modal>
  );
}
