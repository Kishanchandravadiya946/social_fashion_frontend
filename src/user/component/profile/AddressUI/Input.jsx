const Input=({ label, name, value, onChange, required }) =>{
    return (
      <div className="flex flex-col">
        <label className="text-gray-700 font-medium">{label}</label>
        <input
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    );
  }
  
export default Input  