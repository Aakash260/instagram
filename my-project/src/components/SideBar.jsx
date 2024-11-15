import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
 import { useSelector,useDispatch } from 'react-redux'
import { setAuthUser } from '@/redux/authSlice'
import { useState } from 'react'
import CreatePost from './createPost'
const SideBar = () => {

    const navigate = useNavigate()
    const {user}=useSelector(store=>store.auth)
    const dispatch=useDispatch()
  const [open,setOpen]=useState()

  const createPostHandler=()=>{
    setOpen(true)
  }

    const logoutHandler = async () => {
        try {
            const res = await axios.get('http://localhost:8000/api/v1/user/logout', { withCredentials: true });
            if (res.data.success) {
                
                navigate("/login");
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }
const sidebarHandler=(textType)=>{
    if (textType === 'Logout') {
        dispatch(setAuthUser(null))
        logoutHandler();
    }  else if(textType === 'Create'){
        createPostHandler();
    } else if(textType === 'Profile'){
        navigate(`/profile/${user?._id}`)
    } else if(textType === 'Home'){
navigate('/')
    }
    
    
}
const sidebarItems = [
    { icon: <Home />, text: "Home" },
    { icon: <Search />, text: "Search" },
    { icon: <TrendingUp />, text: "Explore" },
    { icon: <MessageCircle />, text: "Messages" },
    { icon: <Heart />, text: "Notifications" },
    { icon: <PlusSquare />, text: "Create" },
    {
        icon: (
            <Avatar className='w-8 h-8'>
                <AvatarImage src={user?.profilePicture||""} alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
        ),
        text: "Profile"
    },
    { icon: <LogOut />, text: "Logout" },
]
  return (
    <div className='fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-[10%] h-screen'>
        <div className='flex flex-col'>
        <h1 className='my-8 pl-3 font-bold text-xl'>LOGO</h1>
        </div>
       
            {sidebarItems.map((item, index) => (
                <div key={index} onClick={() => sidebarHandler(item.text)}  className="flex items-center gap-3 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3">
                    {item.icon}
                    <span>{item.text}</span>
                </div>
            ))}
       <CreatePost open={open} setOpen={setOpen}/>
        
    </div>
  )
}

export default SideBar