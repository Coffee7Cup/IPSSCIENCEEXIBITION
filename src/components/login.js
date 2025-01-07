import React, { useState } from 'react';
import { auth } from './firebase';
import { signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail } from 'firebase/auth';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [answer, setAnswer] = useState('');
  const [num1] = useState(Math.floor(Math.random() * 10));
  const [num2] = useState(Math.floor(Math.random() * 10));
  const [correctAnswer] = useState(num1 > num2 ? num1 : num2);
  const [showResend, setShowResend] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false); // State for showing forgot password form
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const navigate = useNavigate();

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

    if (isNaN(answer) || parseInt(answer, 10) !== correctAnswer) {
      toast.error('Incorrect answer. Please try again.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading

    if (!validateInputs()) {
      setIsLoading(false); // Stop loading if validation fails
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        toast.error('Please verify your email before logging in.');
        setShowResend(true); // Show resend button
        setIsLoading(false); // Stop loading after this action
        return;
      }

      // Proceed with login if the email is verified
      toast.success('Login successful!');
      navigate('/reactapp'); // Redirect to home after successful login
    } catch (error) {
      console.error(error); // Log error for debugging
      if (error.code === 'auth/user-not-found') {
        toast.error('User not found. Please check your credentials.');
      } else if (error.code === 'auth/wrong-password') {
        toast.error('Incorrect password. Please try again.');
      } else {
        toast.error(error.message || 'Error logging in. Please try again.');
      }
      setIsLoading(false); // Stop loading if error occurs
    }
  };

  const resendVerificationEmail = async () => {
    try {
      const user = auth.currentUser; // Make sure user is authenticated
      if (!user) {
        toast.error('No user is currently logged in.');
        return;
      }
      await sendEmailVerification(user);
      toast.success('Verification email sent. Please check your inbox.');
      setShowResend(false); // Hide resend button after sending
    } catch (error) {
      toast.error('Error sending verification email. Please try again.');
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error('Please enter an email address.');
      return;
    }

    if (!isValidEmail(email)) {
      toast.error('Please enter a valid email address to reset the password.');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent. Please check your inbox.');
    } catch (error) {
      toast.error('Error sending password reset email. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white mt-8 p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-center mb-6 text-primary">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <label className="block text-sm font-medium text-gray-700">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Which number is greater?</label>
            <p>{num1} or {num2}?</p>
            <input
              type="number"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-white font-bold py-2 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
          >
            {isLoading ? (
              <div className="flex justify-center items-center space-x-2">
                {/* Spinner using Tailwind */}
                <div className="w-6 h-6 border-4 border-t-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
                <span>Loading...</span>
              </div>
            ) : (
              'Login'
            )}
          </button>
        </form>
        {showResend && (
          <div className="mt-4">
            <p className="text-sm text-gray-600 text-center">Didn't receive the email?</p>
            <button
              onClick={resendVerificationEmail}
              className="block mx-auto mt-2 bg-secondary text-white py-2 px-4 rounded-md hover:bg-secondary-dark focus:outline-none"
            >
              Resend Verification Email
            </button>
          </div>
        )}
        <div className="mt-4 text-center">
          <button
            onClick={handleForgotPassword}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Forgot Password?
          </button>
        </div>
        <Link to="/signup" className="block text-center mt-4 text-sm text-gray-600 hover:text-primary">
          Don't have an account? Sign up here
        </Link>
      </div>
    </div>
  );
};

export default Login;
