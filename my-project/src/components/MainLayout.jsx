 
import { Outlet } from 'react-router-dom'
import SideBar from './SideBar'
const MainLayout = () => {
  return (
    <div>
      <SideBar/>
      <div>
        <Outlet/>
      </div>
    </div>
  )
}

export default MainLayout