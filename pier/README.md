Bken API

[![Node.js Checks](https://github.com/bkenio/api/actions/workflows/checks.yml/badge.svg)](https://github.com/bkenio/api/actions/workflows/checks.yml)

### API Routes

**Compartments**

/compartments GET : list compartments
/compartments POST : create compartment

/compartments/:id GET : get compartment
/compartments/:id PATCH : update compartment
/compartments/:id DELETE : delete compartment

**Compartment Posts**

/compartments/:id/videos GET : list compartment videos
/compartments/:id/videos POST : create a new post
/compartments/:id/videos PATCH : update a post
/compartments/:id/videos DELETE : delete a post

/compartments/:id/videos/upload PUT : get signed links used for uploading

**Users**

/users/:id GET : get users profile

**Account**

/account GET : get the authenticated users account details
