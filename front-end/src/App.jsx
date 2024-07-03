import Home from './pages/Home'
import Profile from './pages/Profile'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import AddItem from './pages/AddItem'
import HomePage from './pages/HomePage'
import BookPage from './components/BookPages/BookPage'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Admin from './pages/Admin'
import Contact from './pages/Contact'
import EditBook from './components/EditBook/EditBook'

function App() {

  return (
    <>
    <div className='app-header'><Header></Header>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/home" element={<Home />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/addbook" element={<AddItem />} />
      <Route path="/carte/:id" element={<BookPage />} />
      <Route path="/admin/*" element={<Admin />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/editBook" element={<EditBook />} />
    </Routes>
    
    </div>
    </>
  )
}

export default App
