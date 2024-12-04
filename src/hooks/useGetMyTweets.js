import axios from "axios";
import { TWEET_API_END_POINT } from "../utils/constant";
import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllTweets } from "../redux/tweetSlice";

const useGetMyTweets = (id) => {
    const dispatch = useDispatch();
    const { refresh, isActive } = useSelector((store) => store.tweet);

    // Memoize fetchMyTweets to avoid recreating on each render
    const fetchMyTweets = useCallback(async () => {
        const userId = getUserIdFromState(); // Get user ID from state, props, or a method
        if (!userId) {
            console.error("User ID is missing");
            return;
        }

        const authToken = localStorage.getItem("authToken");
        if (!authToken) {
            console.error("Authentication token is missing");
            return;
        }

        try {
            const res = await axios.get(`${TWEET_API_END_POINT}/alltweets/${id}`, {
                withCredentials: true,
            });
            console.log(res);
            dispatch(getAllTweets(res.data.tweets));
        } catch (error) {
            console.error(error);
        }
    }, [dispatch, id]); // Include dependencies that change the behavior of this function

    // Memoize followingTweetHandler to avoid recreating on each render
    const followingTweetHandler = useCallback(async () => {
        try {
            axios.defaults.withCredentials = true;
            const res = await axios.get(`${TWEET_API_END_POINT}/followingtweets/${id}`);
            console.log(res);
            dispatch(getAllTweets(res.data.tweets));
        } catch (error) {
            console.error(error);
        }
    }, [dispatch, id]);

    // useEffect with stable dependencies
    useEffect(() => {
        if (isActive) {
            fetchMyTweets();
        } else {
            followingTweetHandler();
        }
    }, [isActive, fetchMyTweets, followingTweetHandler, refresh]); // Dependencies ensure useEffect runs correctly
};

export default useGetMyTweets;
