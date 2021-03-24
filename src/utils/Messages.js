module.exports = {
    Account: {
        SignUp: {
            EmailAlreadyExists: "This email has already been registered.",
            UsernameAlreadyExists: "This username is taken.",
        },
        DeleteAccount: {
            Success: "The account has been successfully deleted.",
            WrongPassword: "The password is incorrect.",
        },
        ChangePassword: {
            WrongPassword: "The old password is incorrect.",
            DoesntMatch:
                "The new password and the repeated password don't match.",
            SamePassword:
                "The new password can't be the same as the current password.",
        },
    },
    Auth: {
        NotAuth: "You are not logged in.",
        AlreadyHasAccount: "You already have an account.",
    },
    Follow: {
        StartedFollowing: "You started following this user.",
        CantFollowYourself: "You can't follow yourself.",
        Unfollowed: "You unfollowed this user.",
    },
    Post: {
        LikedPost: "You like this post.",
        RemovedLike: "You don't like the post anymore.",
        DeletedPost: "You deleted the post.",
        DoesntExist: "The post doesn't exist.",
        PostNotYours: "You can't delete posts that you didn't publish.",
    },
    User: {
        DoesntExist: "This user doesn't exist.",
    },
    Comment: {
        DoesntExist: "This comment doesn't exist.",
        EmptyComment: "The comment cannot be empty.",
        DeletedComment: "This comment has been deleted.",
    },
}
