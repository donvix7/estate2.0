"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAllEstates, getResidentData } from '@/lib/service';
import { toast } from 'react-toastify';
import { sendJoinRequest } from '@/lib/action';

// Simple join request form – can be hooked up to an API later
const JoinRequestPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [estates, setEstates] = useState([]);

  const loadData = async () => {
    const data = await getResidentData();
    setFormData(data);
    const estates = await getAllEstates();
    setEstates(estates.docs);
  }
  useEffect(() => {
    loadData();
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try{
        const res = await sendJoinRequest(formData);
        toast.success(res.message);
    }
    catch(error){
        toast.error(error);
    }
    // Placeholder – replace with real API call
    alert(`Join request submitted: ${formData.firstName} ${formData.lastName} ${formData.email} ${formData.phone}`);
    // After a successful request, navigate to a confirmation or login page
    
    router.push('/');
  };

  return (
    <section
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1241a1, #0f0c29)',
        color: '#fff',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)',
          padding: '2rem',
          borderRadius: '1rem',
          width: '100%',
          maxWidth: '400px',
          boxShadow: '0 4px 30px rgba(0,0,0,0.5)',
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Request to Join Estate</h2>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="firstName" style={{ display: 'block', marginBottom: '0.3rem' }}>
            First Name
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            disabled
            value={formData.firstName}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '0.5rem',
              borderRadius: '0.4rem',
              border: 'none',
            }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="lastName" style={{ display: 'block', marginBottom: '0.3rem' }}>
            Last Name
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            disabled
            value={formData.lastName}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '0.5rem',
              borderRadius: '0.4rem',
              border: 'none',
            }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '0.3rem' }}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            disabled
            value={formData.email}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '0.5rem',
              borderRadius: '0.4rem',
              border: 'none',
            }}
          />
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="phone" style={{ display: 'block', marginBottom: '0.3rem' }}>
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            disabled
            value={formData.phone}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '0.5rem',
              borderRadius: '0.4rem',
              border: 'none',
            }}
          />
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="estate">Estate</label>
          <select
            className='w-full rounded-lg px-2 mb-4'
            value={formData.estate}
            onChange={handleChange}
          >
            <option value="">Select House Address</option>
            {estates.map((estate) => (
              <option key={estate._id} value={estate._id}>
                {estate.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '0.75rem',
            background: '#1241a1',
            color: '#fff',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            cursor: 'pointer',
            transition: 'background 0.3s',
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = '#0f3790')}
          onMouseOut={(e) => (e.currentTarget.style.background = '#1241a1')}
        >
          Submit Request
        </button>
      </form>
    </section>
  );
};

export default JoinRequestPage;