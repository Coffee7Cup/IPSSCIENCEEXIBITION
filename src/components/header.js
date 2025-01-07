import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from './images/logo.png';
import mainLogo from './images/mainlogoips.png';
import { auth } from './firebase';
import { signOut } from 'firebase/auth';
import { toast } from 'react-toastify';
import { db } from './firebase';
import { getDoc, doc } from 'firebase/firestore';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setIsLoggedIn(true);
        setIsEmailVerified(user.emailVerified);
        await fetchUserName(user.uid);
      } else {
        setIsLoggedIn(false);
        setUserName('');
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserName = async (uid) => {
    try {
      const userRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserName(`${userData.salutation} ${userData.firstName} ${userData.lastName}`);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleLogout = useCallback(async () => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully!');
      setIsLoggedIn(false);
      setUserName('');
      setIsEmailVerified(false);
      navigate('/reactapp');
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error('Error logging out:', error.message);
      toast.error('Error logging out. Please try again.');
    }
  }, [navigate]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  return (
    <nav className="bg-primary text-white shadow-lg p-4">
      <div className="container mx-auto max-w-7xl flex items-center justify-between">
        {/* Logo Section */}
        <Link to="/reactapp" className="flex items-center space-x-2">
          <img
            src={mainLogo}
            alt="Main Logo"
            className="h-14 w-auto md:h-16"
          />
          <img
            src={logo}
            alt="Logo"
            className="h-14 w-auto md:h-16"
            onError={(e) => (e.target.src = 'path-to-default-logo.png')}
          />
          <span className="text-xl md:text-2xl font-bold">
            Science Exhibition 2K25
          </span>
        </Link>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-2xl"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>

        {/* Navigation Links */}
        <div
          className={`${
            isMobileMenuOpen
              ? 'fixed inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center z-50'
              : 'hidden md:flex md:items-center md:space-x-6'
          }`}
        >
          {isMobileMenuOpen && (
            <button
              className="absolute top-4 right-4 text-white text-3xl"
              onClick={toggleMobileMenu}
            >
              ✕
            </button>
          )}

          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
            {isLoggedIn ? (
              <>
                {isEmailVerified ? (
                  <>
                    <span className="text-white font-medium">
                      Welcome, <span className="text-secondary">{userName}</span>
                    </span>
                    <Link
                      to="/registration"
                      className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded transition duration-300"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Register Project
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded transition duration-300"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <span className="text-white font-medium">
                      Please verify your email to access the full features.
                    </span>
                    <Link
                      to="/login"
                      className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded transition duration-300"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Log In
                    </Link>
                  </>
                )}
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded transition duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded transition duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign up as Team Leader
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;