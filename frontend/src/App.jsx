import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import CitizenDashboard from './pages/Dashboard/CitizenDashboard'
import AdminDashboard from './pages/Dashboard/AdminDashboard'
import SubmitReport from './pages/SubmitReport'
import ProtectedRoute from './components/ProtectedRoute'
import AdminLogin from './pages/AdminLogin'


function App(){
 
  return(
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Login/>} />
      <Route path='/register' element={<Register/>} />
      <Route path='/admin' element={<AdminLogin/>}/>

      <Route path='/CitizenDashboard' element={
        <ProtectedRoute role='citizen'>
        <CitizenDashboard/>
        </ProtectedRoute>
        
        }/>

      <Route path='/submit' element={
        <ProtectedRoute role='citizen'>
          <SubmitReport/>
        </ProtectedRoute>
        }/>

      <Route path='/AdminDashboard' element={
        <ProtectedRoute role="admin">
          <AdminDashboard/>
        </ProtectedRoute>
        }/>
    </Routes>
    </BrowserRouter>
  )

  
}

export default App;