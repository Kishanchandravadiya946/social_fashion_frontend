import { useState, useEffect,useRef } from "react";
import { useLocation } from "react-router-dom";
import Avatar from "./avatar";
import { Card, CardContent } from "./card";
import  Button  from "./button";
import { FaEdit ,FaMapMarkerAlt, FaTrash,FaEllipsisV,FaCheck} from "react-icons/fa";
import EditProfileModal from "./profileEdit"; // Import the modal
import AddressCreate from "./addressCreate";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; 


export default function Profile() {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [defaultAddressId, setDefaultAddressId] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchProfileAndAddresses = async () => {
      try {
        const [profileRes, addressRes] = await Promise.all([
          fetch(`${API_BASE_URL}/user/profile`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
          fetch(`${API_BASE_URL}/user/addresslist`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }),
        ]);

        if (!profileRes.ok) throw new Error("Failed to fetch user profile");
        if (!addressRes.ok) throw new Error("Failed to fetch addresses");

        const profileData = await profileRes.json();
        const addressData = await addressRes.json();
        //  console.log(addressData)
        setUser({ ...profileData, addresses: addressData.address_list });
        setDefaultAddressId(addressData.is_default)
        
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchProfileAndAddresses();
  }, []);

   const handleAddressAdded = (newAddress) => {
    setUser((prevUser) => ({
      ...prevUser,
      addresses: [...(prevUser?.addresses || []), newAddress],
    }));
  };

  const handleUpdate = (updatedUser) => {
    setUser((prevUser) => ({
      ...prevUser,
      ...updatedUser, // Update state with new profile data
    }));
  };
  const handleDeleteAddress = async (addressId) => {
    try {
      console.log(addressId)
      const response = await fetch(`${API_BASE_URL}/user/delete-address/${addressId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!response.ok) throw new Error("Failed to delete address");

      setUser((prevUser) => ({
        ...prevUser,
        addresses: prevUser.addresses.filter((address) => address.id !== addressId),
      }));

      if (defaultAddressId === addressId) setDefaultAddressId(null);
    } catch (error) {
      console.error("Error deleting address:", error);
    }
  };

  const handleSetDefaultAddress = async (addressId) => {
    try {
      console.log(addressId)
      const response = await fetch(`${API_BASE_URL}/user/set-default-address/${addressId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to update default address");
      // console.log(addressId)
      setDefaultAddressId(addressId);
      
    } catch (error) {
      console.log(error);
      
      console.error("Error setting default address:", error);
    }
  };

    // console.log(user)
  if (!user) return <p className="text-center text-gray-600">Loading profile...</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6 flex items-center space-x-6">
          <Avatar name={user.username} src={user.profilePicture} className="w-20 h-20 rounded-full shadow-lg" />
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">{user.username}</h2> 
          </div>
          <Button onClick={() => setIsEditing(true)}  
          className="bg-blue-600 text-white px-4 py-2 flex items-center space-x-2 rounded-lg hover:bg-blue-700">
            <FaEdit /> <span>Edit Profile</span>
          </Button>
        </CardContent>
          <CardContent className="p-4">
          <p className="text-gray-600">{user.email_address}</p>
          </CardContent>
          <CardContent className="p-4">
          <p className="text-gray-500">{user.phone_number || "No phone number"}</p>
          </CardContent>
      </Card>


    {/* <Card> */}
      <CardContent className="p-6 min-h-[250px] flex flex-col">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FaMapMarkerAlt className="text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Address & Delivery</h3>
          </div>
          <div className="mt-2">
            <Button 
              onClick={() => setIsAddingAddress(true)} 
              className="bg-blue-600 text-white px-4 py-2 flex items-center space-x-2 rounded-lg hover:bg-blue-700"
            >
              Add Address
            </Button>
          </div>
        </div>
        
        <div className="mt-2 text-gray-600 space-y-4 flex-1">
          {user.addresses && user.addresses.length > 0 ? (
            user.addresses.map((address, index) => (
              <div key={index} className="border p-3 rounded-lg shadow-sm flex justify-between items-center">
  {/* Address Information (Left Side) */}
                  <div className="flex-1">
                    <div className="grid grid-cols-5 text-gray-900 font-medium">
                      <p>{address.unit_number}</p> <p>{address.street_number}</p>
                    </div>
                    <div className="grid grid-cols-5 text-gray-900 font-medium">
                      <p>{address.address_line1}</p>
                      {address.address_line2 && <p>{address.address_line2}</p>}
                    </div>
                    <div className="grid grid-cols-4 text-gray-900 font-medium">
                      <p>{address.city}, {address.region}, {address.postal_code}</p>
                      <p>{address.country_name}</p>
                    </div>
                  </div>

                  {/* Dropdown and Default Label (Right Side) */}
                  <div className="relative flex flex-col items-end space-y-2">
                    
                    {/* Three Dots Button */}
                    <button
                      onClick={() => setDropdownOpen(dropdownOpen === address.id ? null : address.id)}
                      className="p-2 rounded-full hover:bg-gray-200"
                    >
                      <FaEllipsisV />
                    </button>

                    {/* Dropdown Menu */}
                    {dropdownOpen === address.id && (
                      <div className="absolute top-1 right-7 mt-2 w-40 bg-white border rounded-lg shadow-lg z-10">
                        <button
                          className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100"
                          onClick={() => {
                            console.log(address.id);
                            handleSetDefaultAddress(address.id);
                            setDropdownOpen(null);
                          }}
                        >
                          <FaCheck className="mr-2 text-blue-600" />
                          Set as Default
                        </button>
                        <button
                          className="flex items-center w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100"
                          onClick={() => {
                            console.log(address.id);
                            handleDeleteAddress(address.id);
                            setDropdownOpen(null);
                          }}
                        >
                          <FaTrash className="mr-2" />
                          Delete
                        </button>
                      </div>
                    )}
                    {defaultAddressId === address.id && (
                      <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                </div>

            ))
          ) : (
            <p className="text-gray-500 mt-2">No address added</p>
          )}
        </div>
      </CardContent>
    {/* </Card> */}

      
       {/* Edit Profile Modal */}
       {isEditing && <EditProfileModal user={user} onClose={() => setIsEditing(false)} onUpdate={handleUpdate} />}
       {isAddingAddress && <AddressCreate onClose={() => setIsAddingAddress(false)} onAddressAdded={handleAddressAdded} />}
    </div>
  );
}
