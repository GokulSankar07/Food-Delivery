import React from 'react'
import Home from "./pages/Home";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Cart from "./pages/Cart";
import OrderTracking from './pages/OrderTracking';
import Profile from './pages/Profile';
import About from './pages/About';
import Settings from './pages/Settings';
import { Route, Routes } from 'react-router-dom'
const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Signin />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path ="/cart" element={<Cart />}/>
        <Route path="/order-tracking" element={<OrderTracking />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/about" element={<About />} />
        <Route path="/settings" element={<Settings />} />
    </Routes>
    </div>
  )
}

export default App
