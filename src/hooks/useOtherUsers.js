import axios from "axios";
import { USER_API_END_POINT } from "../utils/constant";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getOtherUsers } from "../redux/userSlice";


const getCookie = (name) => {
    const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
    return match ? match[2] : null;
};

const useOtherUsers = (id) => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchOtherUsers = async () => {
            try {
                // Retrieve token from localStorage
                const token = getCookie("authToken");
                // const token = localStorage.getItem("authToken");

                // Check if the token is missing
                if (!token) {
                    console.log("Authentication token is missing!");
                    return; // Exit the function early
                }

                // Make the API request if the token exists
                const res = await axios.get(`${USER_API_END_POINT}/otheruser/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                });

                console.log("API Response:", res);
                dispatch(getOtherUsers(res.data.otherUsers));
            } catch (error) {
                console.error("Error fetching other users:", error.response?.data || error.message);
            }
        };

        fetchOtherUsers();
    }, [id, dispatch]);
};

export default useOtherUsers;
