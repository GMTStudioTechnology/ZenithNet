import { useState, useEffect } from "react";
import { 
  followUser, 
  unfollowUser, 
  isFollowing as checkIsFollowing // Rename the imported function to avoid conflict
} from "@/lib/appwrite/followService";

interface FollowButtonProps {
  currentUserId: string;
  targetUserId: string;
  onFollowChange?: (isFollowing: boolean) => Promise<void> | void;
}

const FollowButton = ({ currentUserId, targetUserId, onFollowChange }: FollowButtonProps) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkFollowStatus = async () => {
      setIsLoading(true);
      try {
        // Use the renamed imported function here
        const followStatus = await checkIsFollowing(currentUserId, targetUserId);
        setIsFollowing(followStatus);
      } catch (error) {
        console.error("Error checking follow status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkFollowStatus();
  }, [currentUserId, targetUserId]);

  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        await unfollowUser(currentUserId, targetUserId);
        setIsFollowing(false);
        // Call the callback if provided
        if (onFollowChange) await onFollowChange(false);
      } else {
        await followUser(currentUserId, targetUserId);
        setIsFollowing(true);
        // Call the callback if provided
        if (onFollowChange) await onFollowChange(true);
      }
    } catch (error) {
      console.error("Error toggling follow status:", error);
    }
  };

  if (isLoading) {
    return (
      <button className="h-12 bg-dark-4 px-5 text-light-1 flex-center gap-2 rounded-lg opacity-50">
        <p className="flex whitespace-nowrap small-medium">Loading...</p>
      </button>
    );
  }

  return (
    <button
      onClick={handleFollowToggle}
      className={`h-12 px-5 text-light-1 flex-center gap-2 rounded-lg ${
        isFollowing ? "bg-dark-4" : "bg-primary-500"
      }`}
    >
      <p className="flex whitespace-nowrap small-medium">
        {isFollowing ? "Unfollow" : "Follow"}
      </p>
    </button>
  );
};

export default FollowButton;