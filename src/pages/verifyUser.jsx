import { useState ,useRef,useEffect} from "react";
import { useNavigate,useSearchParams } from "react-router-dom";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { useNotification } from "../shared/NotificationContext";


const OTPInput = ({ length = 6, onChange }) => {
  const [otp, setOtp] = useState(new Array(length).fill(""));
  const inputRefs = useRef([]);

  const handleChange = (index, e) => {
    const value = e.target.value.replace(/[^0-9]/g, ""); // Only allow numbers
    if (!value) return;

    const newOtp = [...otp];
    newOtp[index] = value.charAt(0); // Only take the first digit
    setOtp(newOtp);
    onChange(newOtp.join(""));

    // Move focus to the next input
    if (index < length - 1 && value) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      onChange(newOtp.join(""));

      // Move focus to the previous input
      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  return (
    <div className="flex justify-center gap-2">
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          value={digit}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          maxLength={1}
          className="w-12 h-12 text-center text-xl border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      ))}
    </div>
  );
};

const VerifyUser = () => {
  const [searchParams] = useSearchParams();
  const emailFromUrl = searchParams.get("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { addNotification } = useNotification();

  useEffect(() => {
    if (emailFromUrl) {
      setEmail(emailFromUrl);
    }
  }, [emailFromUrl]);
  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/user/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (response.ok) {
        addNotification("verify successful!", "success");
        setTimeout(() => navigate("/login"), 1000);
      } else {
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-black bg-opacity-70 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-white mb-6">
          Verify Your Account
        </h2>
        <form onSubmit={handleVerify}>
          <div className="mb-4">
            <label className="block text-white text-sm mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              readOnly
              className="w-full px-4 py-2 border rounded-lg ring ring-blue-400"
            />
          </div>

          <div className="mb-4">
            <label className="block text-white text-sm mb-2">
              Verification Code
            </label>
            {/* <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring ring-green-400"
            /> */}
            <OTPInput length={6} onChange={setCode} />
          </div>

          <button
            type="submit"
            className={`w-full px-4 py-2 text-white bg-green-400 font-bold rounded-lg ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-green-400"
            }`}
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyUser;


