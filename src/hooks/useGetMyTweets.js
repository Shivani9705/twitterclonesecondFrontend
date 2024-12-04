import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { TWEET_API_END_POINT } from "../utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { getAllTweets } from "../redux/tweetSlice";

const useGetMyTweets = (id) => {
    const dispatch = useDispatch();
    const { refresh, isActive } = useSelector((store) => store.tweet);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch the authentication token and set it for axios requests
    const setAuthToken = () => {
        const authToken = localStorage.getItem("authToken");
        if (!authToken) {
            console.error("Authentication token is missing");
            return false;
        }
        axios.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;
        return true;
    };

    // Fetch the user's tweets
    const fetchMyTweets = useCallback(async () => {
        if (!id) {
            console.error("User ID is missing");
            return;
        }

        // Ensure authToken is set before making requests
        if (!setAuthToken()) return;

        setLoading(true);
        setError(null);
        try {
            const res = await axios.get(`${TWEET_API_END_POINT}/alltweets/${id}`, {
                withCredentials: true,
            });
            dispatch(getAllTweets(res.data.tweets));
        } catch (err) {
            setError(err.response ? err.response.data : err.message);
        } finally {
            setLoading(false);
        }
    }, [dispatch, id]);

    // Fetch tweets from users the current user follows
    const followingTweetHandler = useCallback(async () => {
        if (!setAuthToken()) return;

        try {
            axios.defaults.withCredentials = true;
            const res = await axios.get(`${TWEET_API_END_POINT}/followingtweets/${id}`);
            dispatch(getAllTweets(res.data.tweets));
        } catch (err) {
            setError(err.response ? err.response.data : err.message);
        }
    }, [dispatch, id]);

    // useEffect to decide which API request to call based on isActive
    useEffect(() => {
        if (isActive) {
            fetchMyTweets();
        } else {
            followingTweetHandler();
        }
    }, [isActive, fetchMyTweets, followingTweetHandler, refresh]);

    return { loading, error };
};

export default useGetMyTweets;
