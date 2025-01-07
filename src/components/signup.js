import React, { useState, useEffect } from 'react';
import { db, auth } from './firebase';
import { doc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { sendEmailVerification } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signup = () => {
  const [salutation, setSalutation] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [college, setCollege] = useState('');
  const [year, setYear] = useState('');
  const [branch, setBranch] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [collegeAddress, setCollegeAddress] = useState('');
  const [collegePincode, setCollegePincode] = useState('');
  const [isMadhyaPradeshResident, setIsMadhyaPradeshResident] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [answer, setAnswer] = useState('');
  const [num1, setNum1] = useState(Math.floor(Math.random() * 10));
  const [num2, setNum2] = useState(Math.floor(Math.random() * 10));
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setCorrectAnswer(Math.max(num1, num2));
  }, [num1, num2]);

  const capitalizeFirstLetter = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };
  
  // Function to validate email syntax and domain
  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
    const validDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com']; // Add more as needed

    if (!emailRegex.test(email)) {
      return false;
    }

    const domain = email.split('@')[1];
    return validDomains.includes(domain);
  };

  const validateInputs = () => {
    if (!isValidEmail(email)) {
      toast.error('Invalid email format or domain. Please enter a valid email address.');
      return false;
    }
    if (!/^\d{10}$/.test(mobile)) {
      toast.error('Invalid mobile number. Must be 10 digits.');
      return false;
    }
    if (!/^\d{6}$/.test(pincode)) {
      toast.error('Invalid pincode. Must be 6 digits.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateInputs()) {
      return;
    }
  
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
  
    if (parseInt(answer) !== correctAnswer) {
      toast.error('Incorrect answer. Please try again.');
      return;
    }
  
    setIsLoading(true); // Show loader
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Send email verification
      await sendEmailVerification(user);
  
      // Save additional user data to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        salutation,
        firstName,
        lastName,
        email,
        mobile,
        whatsapp,
        college,
        year,
        branch,
        bloodGroup,
        address,
        pincode,
        collegeAddress,
        collegePincode,
        isMadhyaPradeshResident,
      });
  
      toast.success('Account created successfully! A verification email has been sent. Please verify your email.');
      navigate('/login');
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        toast.error('Email already in use. Please try again.');
      } else if (error.code === 'auth/weak-password') {
        toast.error('Password is too weak. Please try again.');
      } else {
        toast.error('Error creating account. Please try again.');
      }
    } finally {
      setIsLoading(false); // Hide loader
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white mt-8 p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-center mb-6 text-primary">Signup</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Salutation:</label>
            <select value={salutation} onChange={(e) => setSalutation(e.target.value)} required className="w-full p-2 border border-gray-300 rounded">
              <option value="">Select Salutation</option>
              <option value="Mr.">Mr.</option>
              <option value="Ms.">Ms.</option>
              <option value="Mrs.">Mrs.</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">First Name:</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(capitalizeFirstLetter(e.target.value))}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Last Name:</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(capitalizeFirstLetter(e.target.value))}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
  
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
            {!isValidEmail(email) && email.length > 0 && (
              <p className="text-red-500 text-sm">
                Invalid email format or unsupported domain. Try example@gmail.com.
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Mobile:</label>
            <input type="text" value={mobile} onChange={(e) => setMobile(e.target.value)} required className="w-full p-2 border border-gray-300 rounded" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">WhatsApp:</label>
            <input type="text" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} required className="w-full p-2 border border-gray-300 rounded" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">College:</label>
            <input type="text" value={college} onChange={(e) => setCollege(e.target.value)} required className="w-full p-2 border border-gray-300 rounded" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Year:</label>
            {/* <input type="text" value={year} onChange={(e) => setYear(e.target.value)} required className="w-full p-2 border border-gray-300 rounded" /> */}
            <select value={year} onChange={(e) => setYear(e.target.value)} required className="w-full p-2 border border-gray-300 rounded">
              <option value="">Select Year</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
              <option value="5">5th Year</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Branch:</label>
            <input type="text" value={branch} onChange={(e) => setBranch(e.target.value)} required className="w-full p-2 border border-gray-300 rounded" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Blood Group:</label>
            <select
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">Select Blood Group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Address:</label>
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required className="w-full p-2 border border-gray-300 rounded" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Pincode:</label>
            <input type="text" value={pincode} onChange={(e) => setPincode(e.target.value)} required className="w-full p-2 border border-gray-300 rounded" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">College Address:</label>
            <input type="text" value={collegeAddress} onChange={(e) => setCollegeAddress(e.target.value)} required className="w-full p-2 border border-gray-300 rounded" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">College Pincode:</label>
            <input type="text" value={collegePincode} onChange={(e) => setCollegePincode(e.target.value)} required className="w-full p-2 border border-gray-300 rounded" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 ">Are you a Madhya Pradesh resident?</label>
            <input type="checkbox" checked={isMadhyaPradeshResident} onChange={(e) => setIsMadhyaPradeshResident(e.target.checked)} className="mr-2" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Password:</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full p-2 border border-gray-300 rounded" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Confirm Password:</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full p-2 border border-gray-300 rounded" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Which number is greater?</label>
            <p>{num1} or {num2}?</p>
            <input type="number" value={answer} onChange={(e) => setAnswer(e.target.value)} required className="w-full p-2 border border-gray-300 rounded" />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-primary text-white p-2 rounded w-full mb-4"
          >
            {isLoading ? (
              <div className="spinner-border spinner-border-sm text-white" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            ) : (
              'Sign Up'
            )}
          </button>

        </form>
        <Link to="/login" className="block text-center mt-4 text-sm text-gray-600 hover:text-primary">
          Already have an account? Login here
        </Link>
      </div>
      
    </div>
  );
};

export default Signup;
