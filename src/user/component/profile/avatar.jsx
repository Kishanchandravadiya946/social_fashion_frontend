export default function Avatar({ src, name = "User", className }) {
    const getInitials = (name) => {
      return name ? name.charAt(0).toUpperCase() : "U";
    };
  
    return (
      <div className={`w-10 h-10 flex items-center justify-center rounded-full bg-black 300 text-white font-bold ${className}`}>
        {src ? (
          <img src={src} alt="User Avatar" className="w-full h-full rounded-full object-cover" />
        ) : (
          <span className="text-lg">{getInitials(name)}</span>
        )}
      </div>
    );
  }
  