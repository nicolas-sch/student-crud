import './styles/main.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import AddEditUser from './pages/AddEditUser';
import Home from './pages/Home';
import NavBar from './components/NavBar';
function App() {
  return (
    <BrowserRouter>
    <div className="App">
      <NavBar />
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/add' element={<AddEditUser />}/>
        <Route path='/update/:id' element={<AddEditUser />}/>
      </Routes>
    </div>
    </BrowserRouter>
    
  );
}

export default App;
