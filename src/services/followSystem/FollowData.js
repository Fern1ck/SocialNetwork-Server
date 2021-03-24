const Messages = require("../../utils/Messages")

module.exports = (UserService) => {
    if (!UserService) throw new Error("Parameters required.")

    return {
        GetFollowing: async (username) => {
            let following = []
            let user = await UserService.GetUserByUsername(username)
            user.followingIDs.map((followingID) => {
                let followingUser = UserService.SimpleFetchByID(followingID)
                following.push(followingUser)
            })
            return Promise.all(following)
        },

        GetFollowers: async (username) => {
            let followers = []
            let user = await UserService.GetUserByUsername(username)
            user.followersIDs.map((followerID) => {
                let followerUser = UserService.SimpleFetchByID(followerID)
                followers.push(followerUser)
            })
            return Promise.all(followers)
        },

        ToggleFollow: async (userA, UsernameTo) => {
            let userB = await UserService.GetUserByUsername(UsernameTo)
        
            if (userA.id === userB.id) {
                throw new Error(Messages.Follow.CantFollowYourself)
            }
        
           let isFollowing = userB.followersIDs.includes(userA.id)
        
            if (!isFollowing) {
                userA.followingIDs.push(userB._id)
                userB.followersIDs.push(userA._id)
        
                await userA.save()
                await userB.save()
            
                return Messages.Follow.StartedFollowing
            
            }
            else{
                userB.followersIDs = userB.followersIDs.filter(followerID => followerID.toString() !== userA.id)
                userA.followingIDs = userA.followingIDs.filter(followingID => followingID.toString() !== userB.id)
        
                await userA.save()
                await userB.save()
                
                return Messages.Follow.Unfollowed
            }
            
        },
    }
}
