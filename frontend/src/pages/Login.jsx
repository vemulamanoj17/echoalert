import {useState} from 'react';
import axios from '../api/api';
import {useAuth} from '../context/AuthContext'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import style from '../styling/login.module.css';

const Login=()=>{
    const navigate=useNavigate();
    const {login}=useAuth();
    const [email,setEmail] =useState('');
    const [password,setPassword]=useState('');
    const handleLogin=async (e)=>{
        e.preventDefault();
        try{
            const res=await axios.post('/auth/login',{email,password});
            login(res.data.token,res.data.user);
            alert('Login Successful');
            navigate('/CitizenDashboard');
            
        }
        catch(err){
            const message=err.response?.data?.message||'Login failed';
            if(err.response?.data?.errors){
                const errorMessages=err.response.data.errors.map(e=>e.msg).join('\n');
                alert(errorMessages)
            }
            else if(message==="Invalid Credentials"){
                alert("Invalid Credentials");

            }else{
                alert(message);
            }
        }
    }
    return(
        <div className={style.registerContainer}>
            <form onSubmit={handleLogin} className={style.form}>
            <div className={style.inputGroup}>
                <FontAwesomeIcon icon={faEnvelope} className={style.inputIcon} />
                <input className={style.input} type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" required/>
            </div>
            <div className={style.inputGroup}>
                <FontAwesomeIcon icon={faLock} className={style.inputIcon} />
                <input className={style.input} type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder='password' required/>
            </div>
            <button type='submit' className={style.submitButton}>Login</button>
            <p className={style.loginPrompt} >Don't have an account? <Link to='/register' className={style.loginLink}> Register here</Link></p>
            <p className={style.loginPrompt} ><Link to='/admin' className={style.loginLink}>Admin Login</Link></p>
        </form>
        </div>
        
    )
}

export default Login;