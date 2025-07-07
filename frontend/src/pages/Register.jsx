import {useState} from 'react';
import axios from '../api/api';
import { Link } from 'react-router-dom';
import style from '../styling/register.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';

import { useNavigate } from 'react-router-dom';

const Register=()=>{
    const navigate=useNavigate();
    const [name,setName]=useState('');
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const [confirmPassword,setConfirmPassword]=useState('');
   
      
    const handleRegister=async (e)=>{
        e.preventDefault();
        if (password !== confirmPassword) {
          alert("Passwords do not match");
         return;
    }
        try{
           await axios.post('/auth/register',{name,email,password,role:'citizen'});
           alert('Registration successful!');
           navigate('/');
        }
        catch(err){
            const message=err.response?.data?.message ||'Registration failed';
            if (err.response?.data?.errors) {
                const errorMessages = err.response.data.errors.map(e => e.msg).join('\n');
                alert(errorMessages);
            } 
            else if(message==='User already exists'){
                alert('User already exists');
            }
            else{
                alert(message);
            }
        }
    }
      
      
       return (
         <div className={style.registerContainer}>
            <form onSubmit={handleRegister} className={style.form}>
            <div className={style.inputGroup} >
                <FontAwesomeIcon icon={faUser} className={style.inputIcon} />
                <input className={style.input} name="name" value={name} onChange={(e)=>setName(e.target.value) } placeholder='Name' required/>
            </div>
            
            <div className={style.inputGroup}>
                <FontAwesomeIcon icon={faEnvelope} className={style.inputIcon} />
                <input className={style.input} name="email" value={email} onChange={(e)=>setEmail(e.target.value) } placeholder='Email' required/>
            </div>
           
            <div className={style.inputGroup}> 
                <FontAwesomeIcon icon={faLock} className={style.inputIcon} />
                <input className={style.input} name="password" value={password} onChange={(e)=>setPassword(e.target.value) } placeholder='Password' required/>
            </div>
            <div className={style.inputGroup}>
                <FontAwesomeIcon icon={faLock} className={style.inputIcon} />
                <input className={style.input} name="confirmPassword"value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value) } placeholder='Confirm Password' required/>
            </div>           
            <button type='submit' className={style.submitButton}>Register</button>
            <p className={style.loginPrompt}>Already have an account? <Link to='/' className={style.loginLink}> Login here</Link></p>
            
             
          </form>
         </div>
       )

}

export default Register;