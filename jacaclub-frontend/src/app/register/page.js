"use client"

import { useState } from 'react';
import axios from 'axios';
import styles from './register.module.css';

export default function Register() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/users', {
        email,
        username,
        password,
      });
      setMessage(response.data);
    } catch (error) {
      setMessage(error.response?.data || 'Erro ao criar conta.');
    }
  };

  return (
    <div className={styles.container}>
      <h1>Criar Conta</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Senha:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Criar Conta</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}