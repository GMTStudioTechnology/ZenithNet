import { useState, useEffect } from "react";
import { 
  followUser, 
  unfollowUser, 
  isFollowing as checkIsFollowing 
} from "@/lib/appwrite/followService";
import { databases, appwriteConfig } from "@/lib/appwrite/config"; // adjust path

import { useToast } from "@/components/ui/use-toast"; // adjust path to your toast hook

interface FollowButtonProps {
  currentUserId: string;
  targetUserId: string;
  onFollowChange?: (isFollowing: boolean) => Promise<void> | void;
}

const FollowButton = ({
  currentUserId,
  targetUserId,
  onFollowChange
}: FollowButtonProps) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [tempStyle, setTempStyle] = useState(false);
  const [targetUserName, setTargetUserName] = useState<string>("");

  const { toast } = useToast();

  // 1) Fetch the target user’s name from the Users collection
  useEffect(() => {
    const fetchTargetUserName = async () => {
      try {
        // Replace "name" with whatever attribute holds the display name
        // Also ensure your "userCollectionId" is correct in your .env
        const userDoc = await databases.getDocument(
          appwriteConfig.databaseId,
          appwriteConfig.userCollectionId,
          targetUserId
        );
        setTargetUserName(userDoc.name || "Unknown");
      } catch (err) {
        console.error("Error fetching target user's name:", err);
      }
    };

    if (targetUserId) {
      fetchTargetUserName();
    }
  }, [targetUserId]);

  // 2) Check if already following
  useEffect(() => {
    const checkFollowStatus = async () => {
      setIsLoading(true);
      try {
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

  // 3) Handle the follow/unfollow logic
  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        await unfollowUser(currentUserId, targetUserId);
        setIsFollowing(false);
        if (onFollowChange) await onFollowChange(false);
      } else {
        await followUser(currentUserId, targetUserId);
        setIsFollowing(true);
        if (onFollowChange) await onFollowChange(true);
      }
    } catch (error) {
      console.error("Error toggling follow status:", error);

      // Temporarily show "Unfollow" style (white BG, black text)
      setTempStyle(true);
      setIsFollowing(true);

      // After 1 second, show toast and revert
      setTimeout(() => {
        toast({
          title: `Failed to follow ${targetUserName}`,
          description: `Why does that happen ? I don't actually know. Maybe ask the backend devs?`,
        });

        // Revert
        setTempStyle(false);
        setIsFollowing(false);
      }, 1000);
    }
  };

  if (isLoading) {
    return (
      <button className="h-12 bg-dark-4 px-5 text-light-1 flex-center gap-2 rounded-lg opacity-50">
        <p className="flex whitespace-nowrap small-medium">Loading...</p>
      </button>
    );
  }

  // 4) Render the button
  return (
    <button
      onClick={handleFollowToggle}
      className={`h-12 px-5 flex-center gap-2 rounded-lg transition-colors ${
        tempStyle
          ? "bg-white text-black"         // Temporary error style
          : isFollowing
          ? "bg-dark-4 text-light-1"      // Normal "Unfollow" style
          : "bg-primary-500 text-light-1" // Normal "Follow" style
      }`}
    >
      <p className="flex whitespace-nowrap small-medium">
        {tempStyle ? "Unfollow" : isFollowing ? "Unfollow" : "Follow"}
      </p>
    </button>
  );
};

export default FollowButton;
