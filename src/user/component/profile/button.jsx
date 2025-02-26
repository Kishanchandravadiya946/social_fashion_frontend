const Button = ({ children, onClick, className, variant = "default" }) => {
    const baseStyles = "px-4 py-2 rounded-md transition";
    const variants = {
      default: "bg-blue-500 text-white hover:bg-blue-600",
      ghost: "bg-transparent hover:bg-gray-100 text-gray-700",
    };
  
    return (
      <button onClick={onClick} className={`${baseStyles} ${variants[variant]} ${className}`}>
        {children}
      </button>
    );
  };
  
  export default Button;
  