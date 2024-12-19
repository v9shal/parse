import { useState } from "react";

const Dashboard=()=>{
    const [title,setTitle]=useState("");
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
          <div className="p-6 bg-white shadow-lg rounded-lg space-y-4 w-96">
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              type="text"
              placeholder="Search By Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <button className="w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-300">
              Search
            </button>
          </div>
        </div>
      );
}
export default Dashboard