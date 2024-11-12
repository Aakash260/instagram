 
import { Input } from "./ui/input";
import { useState } from "react";
import { Button } from "./ui/button";
import axios from "axios";
import { toast } from "sonner";
import { Link,useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
const SignUp = () => {
    const [input, setInput] = useState({
        username: "",
        email: "",
        password: ""
    });
    const navigate=useNavigate()

    const [loading,setLoading] = useState(false)
    const signupHandler = async (e) => {
        e.preventDefault();
        setLoading(true)
  try {
    const res=await axios.post('http://localhost:8000/api/v1/user/register',input,{
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true, 
    })
    
    if(res.data.success) {

      toast.success(res.data.msg);
      setInput({ username: "", email: "", password: "" });
      navigate('/login');
    }
    setLoading(false)
  } catch (error) {
    console.log(error)
    toast.error(error.response.data.msg);
  }finally{
    setLoading(false)
  }
       
    }
    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }
  return (
    <div className="flex items-center w-screen h-screen justify-center  ">
      <form className="shadow-lg flex flex-col gap-5 p-8" onSubmit={signupHandler}>
        <div className="my-4">
          <h1>Logo</h1>
          <p>SignUp to see photos & videos from your friends</p>
        </div>
        <div>
                    <span className='font-medium'>Username</span>
                    <Input
                        type="text"
                        name="username"
                        value={input.username}
                        onChange={changeEventHandler}
                        className="focus-visible:ring-transparent my-2"
                    />
                </div>
                <div>
                    <span className='font-medium'>Email</span>
                    <Input
                        type="email"
                        name="email"
                        value={input.email}
                        onChange={changeEventHandler}
                        className="focus-visible:ring-transparent my-2"
                    />
                </div>
                <div>
                    <span className='font-medium'>Password</span>
                    <Input
                        type="password"
                        name="password"
                        value={input.password}
                        onChange={changeEventHandler}
                        className="focus-visible:ring-transparent my-2"
                    />
                </div>
            
                {
                    loading ? (
                        <Button>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                            Please wait
                        </Button>
                    ) : (
                        
                        <Button type='submit'>Signup</Button>          
                    )
                }

 
                
                <span className='text-center'>Already have an account? <Link to="/login" className='text-blue-600'>Login</Link></span> 
      </form>
    </div>
  );
};

export default SignUp;
