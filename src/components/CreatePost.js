import React, { useState } from 'react';
import Avatar from "react-avatar";
import { CiImageOn } from "react-icons/ci";
import axios from "axios";
import { TWEET_API_END_POINT } from "../utils/constant";
import toast from "react-hot-toast"
import { useSelector, useDispatch } from "react-redux";
import { getIsActive, getRefresh } from '../redux/tweetSlice';



const CreatePost = () => {
    const [description, setDescription] = useState("");
    const { user } = useSelector(store => store.user);
    const {isActive} = useSelector(store=>store.tweet);
    const dispatch = useDispatch();

    // const submitHandler = async () => {
    //     // const token = localStorage.getItem('token'); // or however you store your token

    //     try {
    //         const res = await axios.post(`${TWEET_API_END_POINT}/create`, { description, id: user?._id }, {
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 //  'Authorization': `Bearer ${token}`
    //             },
    //             withCredentials: true
    //         });
    //         dispatch(getRefresh());
    //         if (res.data.success) {
    //             toast.success(res.data.message);
    //         }
    //     } catch (error) {
    //         toast.error(error.response.data.message);
    //         console.log(error);
    //     }
    //     setDescription("");
    // }
    const submitHandler = async () => {
        try {
            // Retrieve the token
            const token = localStorage.getItem('authToken'); 
            console.log("Token retrieved:", token); 
    
            // Handle missing token
            if (!token) {
                toast.error("Authentication token is missing! Please log in again.");
                console.error("Authentication token is missing!");
                return;
            }
    
            // Make the API request
            const res = await axios.post(
                `${TWEET_API_END_POINT}/create`,
                { description, id: user?._id },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    withCredentials: true
                }
            );
    
            dispatch(getRefresh());
            if (res.data.success) {
                toast.success(res.data.message);
            }
        } catch (error) {
            console.error("Error:", error.response?.data || error.message);
            toast.error(error.response?.data?.message || "Something went wrong!");
        }
    
        // Reset the description field
        setDescription("");
    };
    

    const forYouHandler = () => {
         dispatch(getIsActive(true));
    }
    const followingHandler = () => {
        
        dispatch(getIsActive(false));
    }

    return (
        <div className='w-[100%]'>
            <div>
                <div className='flex items-center justify-evenly border-b border-gray-200'>
                    <div onClick={forYouHandler} className={`${isActive ? "border-b-4 border-blue-600" : "border-b-4 border-transparent"} cursor-pointer hover:bg-gray-200 w-full text-center px-4 py-3`}>
                        <h1 className='font-semibold text-gray-600 text-lg'>For you</h1>
                    </div>
                    <div onClick={followingHandler} className={`${!isActive ? "border-b-4 border-blue-600" : "border-b-4 border-transparent"} cursor-pointer hover:bg-gray-200 w-full text-center px-4 py-3`}>
                        <h1 className='font-semibold text-gray-600 text-lg'>Following</h1>
                    </div>
                </div>
                <div >
                    <div className='flex items-center p-4'>
                        <div>
                            <Avatar src="https://pbs.twimg.com/profile_images/1703261403237502976/W0SFbJVS_400x400.jpg" size="40" round={true} />
                        </div>
                        <input value={description} onChange={(e) => setDescription(e.target.value)} className='w-full outline-none border-none text-xl ml-2' type="text" placeholder='What is happening?!' />
                    </div>
                    <div className='flex items-center justify-between p-4 border-b border-gray-300'>
                        <div>
                            <CiImageOn size="24px" />
                        </div>
                        <button onClick={submitHandler} className='bg-[#1D9BF0] px-4 py-1 text-lg text-white text-right border-none rounded-full '>Post</button>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default CreatePost