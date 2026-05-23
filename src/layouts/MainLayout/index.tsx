import { Aside } from '../../components/Aside'
import { Outlet } from 'react-router-dom'

const MainLayout = () => {
  return (
    <>
      <div className="flex h-screen overflow-hidden">
      <Aside />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Outlet />
      </div>
    </div>
    </>
  )
}

export default MainLayout