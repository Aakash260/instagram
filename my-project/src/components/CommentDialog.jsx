import { MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useState } from "react";

const CommentDialog = ({ open, setOpen }) => {
  const [text, setText] = useState("");

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };

  const sendMessage = async () => {
    console.log(text);
  };

  return (
    <Dialog open={open}>
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="max-w-5xl p-0 flex flex-col"
      >
        <div className="flex flex-1">
          <div className="w-1/2 h-[50vh]">
            <img
              src="https://m.media-amazon.com/images/I/71r517JA1LL._AC_SY550_.jpg"
              alt="post_img"
              className="w-full h-full object-cover rounded-l-lg"
            />
          </div>
          <div className="w-1/2 flex flex-col justify-between p-2">
            <div className="flex items-center justify-between">
              <div className="flex gap-3 items-center">
                <Link>
                  <Avatar>
                    <AvatarImage src="" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link className="font-semibold text-xs">usename</Link>
                  {/* <span className="text-gray-400 text-sm">Bio here...</span> */}
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChiild>
                  <MoreHorizontal className="cursor-pointer" />
                  <DialogContent className="flex flex-col items-center text-sm text-center">
                    <div className="cursor-pointer w-full text-[#ED4956] font-bold">
                      Unfollow
                    </div>
                    <div className="cursor-pointer w-full ">
                      Add to favourite
                    </div>
                  </DialogContent>
                </DialogTrigger>
              </Dialog>
            </div>
            <hr className="mt-2" />
            <div className="flex-1 overflow-y-auto max-h-96 p-4">Comments</div>
            <div className="p-4">
              <div className="flex items-center gap-2">
                <input
                  onChange={changeEventHandler}
                  value={text}
                  type="text"
                  placeholder="Add a comment..."
                  className="w-full outline-none border border-gray-300 p-2 rounded"
                />
                <Button
                  disabled={!text.trim()}
                  onClick={sendMessage}
                  variant="outline"
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;
