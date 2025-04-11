import { useState, useEffect } from "react";
import { databases, appwriteConfig } from "@/lib/appwrite/config";
import { useToast } from "@/components/ui/use-toast";


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

  // Fetch the target user's name
  useEffect(() => {
    const fetchTargetUserName = async () => {
      try {
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

  // Simulate follow status check
  useEffect(() => {
    const simulateFollowStatus = () => {
      setIsLoading(true);
      // Simulate API call with a timeout
      setTimeout(() => {
        // Randomly determine if following or not
        setIsFollowing(Math.random() > 0.5);
        setIsLoading(false);
      }, 800);
    };

    if (currentUserId && targetUserId) {
      simulateFollowStatus();
    }
  }, [currentUserId, targetUserId]);

  // Handle follow/unfollow
  const handleFollowToggle = async () => {
    try {
      // Toggle the follow status locally
      const newFollowStatus = !isFollowing;
      setIsFollowing(newFollowStatus);
      
      // Simulate API call
      if (onFollowChange) await onFollowChange(newFollowStatus);

      toast({
        title: newFollowStatus ? `Following ${targetUserName}` : `Unfollowed ${targetUserName}`,
        description: newFollowStatus ? "You are now following this user." : "You are no longer following this user.",
      });
    } catch (error) {
      console.error("Error toggling follow status:", error);

      // Temporarily show "Unfollow" style (white BG, black text)
      setTempStyle(true);
      setIsFollowing(true);

      // After 1 second, show toast and revert
      setTimeout(() => {
        toast({
          title: `Failed to follow ${targetUserName}`,
          description: `Why does that happen? I don't actually know. Maybe ask the backend devs?`,
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

  return (
    <button
      onClick={handleFollowToggle}
      className={`h-12 px-5 flex-center gap-2 rounded-lg transition-colors ${
        tempStyle
          ? "bg-white text-black"
          : isFollowing
          ? "bg-dark-4 text-light-1"
          : "bg-primary-500 text-light-1"
      }`}
    >
      <p className="flex whitespace-nowrap small-medium">
        {tempStyle ? "Unfollow" : isFollowing ? "Unfollow" : "Follow"}
      </p>
    </button>
  );
};

export default FollowButton;