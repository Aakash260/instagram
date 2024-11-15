 import Post from "./Post"
 import { useSelector } from "react-redux"
const Posts = () => {
  const {posts}=useSelector(store=>store.post)
  console.log(posts)
  return (
    <div>
        {
           posts.map((post) =>{
             return <Post key={post._id} post={post} />
           })

        }
    </div>
  )
}

export default Posts