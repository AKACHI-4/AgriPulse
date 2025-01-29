import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { Search, MessageCircle, Bell, User } from "lucide-react";

const Navbar = async () => {
  const user = await currentUser();
  return (
    <div className="flex items-center justify-between p-4">
      {/* SEARCH BAR */}
      <div className="hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
        <Search className="w-4 h-4 text-gray-500" />
        <input
          type="text"
          placeholder="Search..."
          className="w-[200px] p-2 bg-transparent outline-none"
        />
      </div>
      {/* ICONS AND USER */}
      <div className="flex items-center gap-6 justify-end w-full">
        {/* Message Icon */}
        <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer">
          <MessageCircle className="w-5 h-5 text-gray-600" />
        </div>
        {/* Notification Icon with Badge */}
        <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative">
          <Bell className="w-5 h-5 text-gray-600" />
          <div className="absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-purple-500 text-white rounded-full text-xs">
            1
          </div>
        </div>
        {/* User Info */}
        <div className="flex flex-col">
          <span className="text-xs leading-3 font-medium">
            Laxman Singh Bisht
          </span>
          <span className="text-[10px] text-gray-500 text-right">
            {user?.publicMetadata.role as string}
          </span>
        </div>
        {/* User Avatar */}
        <div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center">
          {/* <User className="w-6 h-6 text-red-400 fill-amber-200" />
           */}

          <UserButton />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
