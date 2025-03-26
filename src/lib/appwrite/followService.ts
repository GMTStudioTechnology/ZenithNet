import { ID, Query } from "appwrite";
import { databases, appwriteConfig } from "./config";

export async function followUser(followerId: string, followingId: string) {
  try {
    const newFollow = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.followsCollectionId,
      ID.unique(),
      {
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

export async function unfollowUser(followerId: string, followingId: string) {
  try {
    // First find the follow document
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