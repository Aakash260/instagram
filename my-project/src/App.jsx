 
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import Home from './components/Home';
import Profile from './components/Profile';
import Login from './components/Login';
import SignUp from './components/SignUp';
import EditProfile from './components/EditProfile';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />  {/* Home is the default route */}
          <Route path="profile/:id" element={<Profile />} />
          <Route path="account/edit" element={<EditProfile />} />
        </Route>
        <Route path="/" >
          <Route path="login" element={<Login />} />  {/* Home is the default route */}
          <Route path="signUp" element={<SignUp />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
