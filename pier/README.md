Bken API

[![Node.js Checks](https://github.com/bkenio/api/actions/workflows/checks.yml/badge.svg)](https://github.com/bkenio/api/actions/workflows/checks.yml)

### API Routes

**pods**

/pods GET : list pods
/pods POST : create pod

/pods/:id GET : get pod
/pods/:id PATCH : update pod
/pods/:id DELETE : delete pod

**pod Posts**

/pods/:id/videos GET : list pod videos
/pods/:id/videos POST : create a new post
/pods/:id/videos PATCH : update a post
/pods/:id/videos DELETE : delete a post

/pods/:id/videos/upload PUT : get signed links used for uploading

**Users**

/users/:id GET : get users profile

**Account**

/account GET : get the authenticated users account details
