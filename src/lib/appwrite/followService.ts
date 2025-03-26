import { ID, Query } from "appwrite";
import { databases, appwriteConfig } from "./config";

// Create a follow relationship by storing relational links to Users
export async function followUser(followerId: string, followingId: string) {
  try {
    const newFollow = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.followsCollectionId,
      ID.unique(),
      {
        // Using relations to link to Users collection if configured
        followerId,
        followingId,
      }
    );
    return newFollow;
  } catch (error) {
    console.error("Error following user:", error);
    throw error;
  }
}

// Remove the follow relationship between two users
export async function unfollowUser(followerId: string, followingId: string) {
  try {
    // Find the document that represents the follow relationship
    const followRecords = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.followsCollectionId,
      [
        Query.equal("followerId", followerId),
        Query.equal("followingId", followingId),
      ]
    );
    if (followRecords.documents.length === 0) {
      throw new Error("Follow relationship not found");
    }
    // Delete the follow document
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.followsCollectionId,
      followRecords.documents[0].$id
    );
    return { success: true };
  } catch (error) {
    console.error("Error unfollowing user:", error);
    throw error;
  }
}

// Check if a follow relationship exists between two users
export async function isFollowing(followerId: string, followingId: string) {
  try {
    const followRecords = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.followsCollectionId,
      [
        Query.equal("followerId", followerId),
        Query.equal("followingId", followingId),
      ]
    );
    return followRecords.documents.length > 0;
  } catch (error) {
    console.error("Error checking follow status:", error);
    return false;
  }
}

// Get the total number of followers for a given user (users following this user)
export async function getFollowersCount(userId: string) {
  try {
    const followers = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.followsCollectionId,
      [Query.equal("followingId", userId)]
    );
    return followers.total;
  } catch (error) {
    console.error("Error getting followers count:", error);
    return 0;
  }
}

// Get the total number of users that a given user is following
export async function getFollowingCount(userId: string) {
  try {
    const following = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.followsCollectionId,
      [Query.equal("followerId", userId)]
    );
    return following.total;
  } catch (error) {
    console.error("Error getting following count:", error);
    return 0;
  }
}
