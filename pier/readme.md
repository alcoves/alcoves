### Routes

#### Unauthenticated routes

- /
  - GET - used as a health check for the api, should return db/api latency
- /login
  - POST - used to log the user in. accepts userName and password, returns JWT access token
- /register
  - POST - used to create an account. accepts userName (email), password, and displayName. fails if exists, should return 200 and ask that they user verifies the email provided
- /posts
  - GET - returns data from posts
- /bkens
  - GET - returns the public profile for a bken
- /comments
  - GET - returns comments for a specific post
- /users
  - GET - returns the public profile of the specified user.

#### Authenticated routes

- /account
  - GET - returns the users account
  - PUT - updates the user profile
  - POST - creates a user profile
  - DELETE - deletes the user account and all related resources (could call DELETE /bken recursively)
- /posts
  - POST - creates a new post
  - PUT - edits an existing post
  - DELETE - deletes a post and it's comments
- /bkens
  - POST - creates a new bken
  - PUT - edits an existing bken
  - DELETE - deletes a bken, it's posts, and its comments. Should require email authenticaton
- /comments
  - POST - creates a new comment
  - PUT - edits an existing comment
  - DELETE - deletes a specific comment

### Notes

Populate can be used to do joins based on refs we add
