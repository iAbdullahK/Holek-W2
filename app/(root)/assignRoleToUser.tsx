import { Clerk } from '@clerk/clerk-sdk-node';

// Function to assign a role to a user
async function assignRoleToUser(userId, role) {
  try {
    // Fetch the user
    const user = await Clerk.users.getUser(userId);

    // Assign the role
    user.publicMetadata = {
      ...user.publicMetadata,
      roles: [...(user.publicMetadata.roles || []), role]
    };

    // Update the user
    await Clerk.users.updateUser(userId, {
      publicMetadata: user.publicMetadata
    });

    console.log(`Role ${role} assigned to user ${userId}`);
  } catch (error) {
    console.error('Error assigning role to user:', error);
  }
}

// Example usage
assignRoleToUser('user_id_here', 'admin');
