import './App.css';
import Navbar from './components/Navbar'; 
import { Route, Routes } from 'react-router-dom';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Home } from './pages/Home'; 
import { Login } from './pages/Login';
import { UserLogin } from './pages/Userlogin';
import { AdminLogin } from './pages/Admin login';
import { Sign } from './pages/Sign';
import UserPage from './pages/UserPage';
import AdminPage from './pages/AdminPage';
import { ToastContainer } from 'react-toastify';
import  WorkerLogin  from './pages/WorkerLogin';
import WorkerPage from './pages/WorkerPage';



const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login/user" element={<UserLogin />} />
        <Route path="/login/admin" element={<AdminLogin />} />
        <Route path="/login/signup" element={<Sign/>} />
        <Route path="/login/user/userpage" element={<UserPage/>} />
        <Route path="/login/admin/adminpage" element={<AdminPage />} />
        <Route path="/login/worker" element={<WorkerLogin />} />
        <Route path="/login/worker/workerpage" element={<WorkerPage />} /> 
      </Routes>
      <ToastContainer
        position='top-center'
        autoClose={1000}
        hideProgressBar={true}
        closeOnClick
        theme='colored'
      />
    </>
  );
};

export default App;
