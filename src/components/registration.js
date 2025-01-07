// RegistrationPage.js
import React, { useState, useEffect } from 'react';
import { db, auth } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RegistrationPage = () => {
  const [projectTheme, setProjectTheme] = useState('');
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [teamLeader, setTeamLeader] = useState({
    salutation: '',
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    whatsapp: '',
    college: '',
    year: '',
    branch: '',
    bloodGroup: '',
    address: '',
    pincode: '',
    collegeAddress: '',
    collegePincode: '',
    isMadhyaPradeshResident: false
  });
  const [teamMembers, setTeamMembers] = useState([{
    salutation: '',
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    whatsapp: '',
    college: '',
    year: '',
    branch: '',
    bloodGroup: '',
    address: '',
    pincode: '',
    collegeAddress: '',
    collegePincode: '',
    isMadhyaPradeshResident: false
  }]);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = auth.onAuthStateChanged(async (user) => {

      if (user) {

        setIsAuthenticated(true);
        try {
          const userRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser(userData);

            // Set the team leader's details
            setTeamLeader({
              salutation: userData.salutation,
              firstName: userData.firstName,
              lastName: userData.lastName,
              email: userData.email,
              mobile: userData.mobile,
              whatsapp: userData.whatsapp,
              college: userData.college,
              year: userData.year,
              branch: userData.branch,
              bloodGroup: userData.bloodGroup,
              address: userData.address,
              pincode: userData.pincode,
              collegeAddress: userData.collegeAddress,
              collegePincode: userData.collegePincode,
              isMadhyaPradeshResident: userData.isMadhyaPradeshResident
            });
          } else {
            toast.error("User      data not found. Please ensure you have registered");
            navigate('/login');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          toast.error('Error fetching user data. Please try again');
          navigate('/login');

        }


      } else {
        setIsAuthenticated(false);
        setUser(null);
        toast.error("Please Login to continue");
        navigate('/login');

      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleTeamMemberChange = (index, field, value) => {
    const updatedTeamMembers = [...teamMembers];
    updatedTeamMembers[index][field] = value;
    setTeamMembers(updatedTeamMembers);
  };

  const addTeamMember = () => {
    if (teamMembers.length < 3) {
      setTeamMembers([...teamMembers, {
        salutation: '',
        firstName: '',
        lastName: '',
        email: '',
        mobile: '',
        whatsapp: '',
        college: '',
        year: '',
        branch: '',
        bloodGroup: '',
        address: '',
        pincode: '',
        collegeAddress: '',
        collegePincode: '',
        isMadhyaPradeshResident: true
      }]);
    } else {
      toast.error("You cannot add more than 3 team members");
    }

  };

  const removeTeamMember = (index) => {
    const updatedTeamMembers = teamMembers.filter((_, i) => i !== index);
    setTeamMembers(updatedTeamMembers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!projectName || !projectDescription || teamMembers.some(member => !member.firstName || !member.lastName || !member.email || !member.mobile || !member.whatsapp || !member.branch || !member.year || !member.bloodGroup || !member.address || !member.pincode || !member.collegeAddress || !member.collegePincode)) {
      toast.error('Please fill in all fields for team members');
      setIsSubmitting(false);
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@ +]+$/;
    if (teamMembers.some(member => !emailPattern.test(member.email))) {
      toast.error('Please enter valid email addresses for all team members');
      setIsSubmitting(false);
      return;
    }

    const mobilePattern = /^\d{10}$/;
    if (teamMembers.some(member => !mobilePattern.test(member.mobile))) {
      toast.error('Please enter valid mobile numbers for all team members');
      setIsSubmitting(false);
      return;
    }

    try {
      const projectData = {
        projectData,
        projectName,
        projectDescription,
        teamLeader,
        teamMembers,
      };

      await setDoc(doc(db, 'projects', Date.now().toString()), projectData);
      toast.success('Project registered successfully!');
      navigate('/reactapp');
    } catch (error) {
      console.error('Error registering project:', error);
      toast.error('Error registering project. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="p-5 max-w-2xl mx-auto">
      <h1 className="text-center text-2xl font-bold mb-5">Project Registration</h1>
      <form onSubmit={handleSubmit}>
      <div className="mb-2">
              <label>Project Theme:</label>
              <select value={projectTheme} onChange={(e) => setProjectTheme(e.target.value)} required className="w-full p-2 border border-gray-300 rounded">
                <option value="">Select Project Theme</option>
                <option value="Social Impact">Social Impact</option>
                <option value="Economic Impact">Economic Impact</option>
                <option value="Environmental Impact">Environmental Impact</option>
              </select>
            </div>
        <div className="mb-4">
          <label className="block mb-1">Project Title:</label>
          <input type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)} required className="w-full p-2 border border-gray-300 rounded" />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Project Description:</label>
          <textarea value={projectDescription} onChange={(e) => setProjectDescription(e.target.value)} required className="w-full p-2 border border-gray-300 rounded" />
        </div>

        <h2 className="font-semibold mb-2">Team Leader Information</h2>
        <div className="border border-gray-300 p-4 mb-4 rounded">
          <div className="mb-2">
            <label>First Name:</label>
            <input type="text" value={teamLeader.firstName} readOnly className="w-full p-2 border border-gray-300 rounded bg-gray-200" />
          </div>
          <div className="mb-2">
            <label>Last Name:</label>
            <input type="text" value={teamLeader.lastName} readOnly className="w-full p-2 border border-gray-300 rounded bg-gray-200" />
          </div>
          <div className="mb-2">
            <label>Email:</label>
            <input type="email" value={teamLeader.email} readOnly className="w-full p-2 border border-gray-300 rounded bg-gray-200" />
          </div>
          <div className="mb-2">
            <label>Mobile:</label>
            <input type="text" value={teamLeader.mobile} readOnly className="w-full p-2 border border-gray-300 rounded bg-gray-200" />
          </div>
          <div className="mb-2">
            <label>WhatsApp:</label>
            <input type="text" value={teamLeader.whatsapp} readOnly className="w-full p-2 border border-gray-300 rounded bg-gray-200" />
          </div>
          <div className="mb-2">
            <label>College:</label>
            <input type="text" value={teamLeader.college} readOnly className="w-full p-2 border border-gray-300 rounded bg-gray-200" />
          </div>
          <div className="mb-2">
            <label>Year:</label>
            <input type="text" value={teamLeader.year} readOnly className="w-full p-2 border border-gray-300 rounded bg-gray-200" />
          </div>
          <div className="mb-2">
            <label>Branch:</label>
            <input type="text" value={teamLeader.branch} readOnly className="w-full p-2 border border-gray-300 rounded bg-gray-200" />
          </div>
          <div className="mb-2">
            <label>Blood Group:</label>
            <select value={teamLeader.bloodGroup} readOnly className="w-full p-2 border border-gray-300 rounded bg-gray-200">
              <option value="">{teamLeader.bloodGroup}</option>
            </select>
          </div>
          <div className="mb-2">
            <label>Address:</label>
            <input type="text" value={teamLeader.address} readOnly className="w-full p-2 border border-gray-300 rounded bg-gray-200" />
          </div>
          <div className="mb-2">
            <label>Pincode:</label>
            <input type="text" value={teamLeader.pincode} readOnly className="w-full p-2 border border-gray-300 rounded bg-gray-200" />
          </div>
          <div className="mb-2">
            <label>College Address:</label>
            <input type="text" value={teamLeader.collegeAddress} readOnly className="w-full p-2 border border-gray-300 rounded bg-gray-200" />
          </div>
          <div className="mb-2">
            <label>College Pincode:</label>
            <input type="text" value={teamLeader.collegePincode} readOnly className="w-full p-2 border border-gray-300 rounded bg-gray-200" />
          </div>
          <div className="mb-2">
            <label>Residence of Madhya Pradesh:</label>
            <select value={teamLeader.isMadhyaPradeshResident} readOnly className="w-full p-2 border border-gray-300 rounded bg-gray-200">
              <option value={teamLeader.isMadhyaPradeshResident}>{teamLeader.isMadhyaPradeshResident ? 'Yes' : 'No'}</option>
            </select>
          </div>
        </div>

        <h2 className="font-semibold mb-2">Team Members Information</h2>
        {teamMembers.map((member, index) => (
          <div key={index} className="border border-gray-300 p-4 mb-4 rounded">
            <h3 className="font-semibold">Team Member {index + 1}</h3>
            <button type="button" onClick={() => removeTeamMember(index)} className="mb-2 bg-red-500 text-white rounded px-2 py-1">Remove</button>
            <div className="mb-2">
              <label>First Name:</label>
              <input type="text" value={member.firstName} onChange={(e) => handleTeamMemberChange(index, 'firstName', e.target.value)} required className="w-full p-2 border border-gray-300 rounded" />
            </div>
            <div className="mb-2">
              <label>Last Name:</label>
              <input type="text" value={member.lastName} onChange={(e) => handleTeamMemberChange(index, 'lastName', e.target.value)} required className="w-full p-2 border border-gray-300 rounded" />
            </div>
            <div className="mb-2">
              <label>Email:</label>
              <input type="email" value={member.email} onChange={(e) => handleTeamMemberChange(index, 'email', e.target.value)} required className="w-full p-2 border border-gray-300 rounded" />
            </div>
            <div className="mb-2">
              <label>Mobile:</label>
              <input type="text" value={member.mobile} onChange={(e) => handleTeamMemberChange(index, 'mobile', e.target.value)} required className="w-full p-2 border border-gray-300 rounded" />
            </div>
            <div className="mb-2">
              <label>WhatsApp:</label>
              <input type="text" value={member.whatsapp} onChange={(e) => handleTeamMemberChange(index, 'whatsapp', e.target.value)} required className="w-full p-2 border border-gray-300 rounded" />
            </div>
            <div className="mb-2">
              <label>College:</label>
              <input type="text" value={member.college} onChange={(e) => handleTeamMemberChange(index, 'college', e.target.value)} required className="w-full p-2 border border-gray-300 rounded" />
            </div>
            <div className="mb-2">
              <label>Year:</label>
              {/* <input type="text" value={member.year} onChange={(e) => handleTeamMemberChange(index, 'year', e.target.value)} required className="w-full p-2 border border-gray-300 rounded" /> */}
              <select value={member.year} onChange={(e) => handleTeamMemberChange(index, 'year', e.target.value)} required className="w-full p-2 border border-gray-300 rounded">
                <option value="">Select Year</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
                <option value="5th Year">5th Year</option>
              </select>
            </div>
            <div className="mb-2">
              <label>Branch:</label>
              <input type="text" value={member.branch} onChange={(e) => handleTeamMemberChange(index, 'branch', e.target.value)} required className="w-full p-2 border border-gray-300 rounded" />
            </div>
            <div className="mb-2">
              <label>Blood Group:</label>
              <select value={member.bloodGroup} onChange={(e) => handleTeamMemberChange(index, 'bloodGroup', e.target.value)} required className="w-full p-2 border border-gray-300 rounded">
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
            <div className="mb-2">
              <label>Address:</label>
              <input type="text" value={member.address} onChange={(e) => handleTeamMemberChange(index, 'address', e.target.value)} required className="w-full p-2 border border-gray-300 rounded" />
            </div>
            <div className="mb-2">
              <label>Pincode:</label>
              <input type="text" value={member.pincode} onChange={(e) => handleTeamMemberChange(index, 'pincode', e.target.value)} required className="w-full p-2 border border-gray-300 rounded" />
            </div>
            <div className="mb-2">
              <label>College Address:</label>
              <input type="text" value={member.collegeAddress} onChange={(e) => handleTeamMemberChange(index, 'collegeAddress', e.target.value)} required className="w-full p-2 border border-gray-300 rounded" />
            </div>
            <div className="mb-2">
              <label>College Pincode:</label>
              <input type="text" value={member.collegePincode} onChange={(e) => handleTeamMemberChange(index, 'collegePincode', e.target.value)} required className="w-full p-2 border border-gray-300 rounded" />
            </div>
            <div className="mb-2">
              <label>Residence of Madhya Pradesh:</label>
              <select value={member.isMadhyaPradeshResident} onChange={(e) => handleTeamMemberChange(index, 'isMadhyaPradeshResident', e.target.value === 'true')} required className="w-full p-2 border border-gray-300 rounded">
                <option value={false}>No</option>
                <option value={true}>Yes</option>
              </select>
            </div>
          </div>
        ))}
        <button type="button" onClick={addTeamMember} className="mb-4 bg-blue-500 text-white rounded px-4 py-2">Add Team Member</button>
        <button type="submit" className="w-full p-2 border border-none bg-green-500 text-white rounded text-lg cursor-pointer" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Register Project'}
        </button>
      </form>
    </div>
  );
};

export default RegistrationPage;