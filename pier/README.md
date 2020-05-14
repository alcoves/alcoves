### Routes

No Auth

POST /login
POST /register

GET /videos/:videoId (gets video by id, if public, return some data, if authed user is owner return all)

Authed Endpoints

GET /uploads/url return a signed url for uploading a part
POST /uploads () completes multipart upload

GET /videos (returns all the videos for authenticated user)
POST /videos (starts multipart upload, creates video record)
PATCH /videos/:videoId (edits video record)
DELETE /videos/:videoId (delete video from s3 and then database)

GET /me (returns user record)

### Notes

Populate can be used to do joins based on refs we add

### Rust

cd examples/juniper
cargo run (or `cargo watch -x run`)

http://127.0.0.1:8080/graphiql

### Deployment

rustup target add x86_64-unknown-linux-musl
cargo build --release --target x86_64-unknown-linux-musl
cp ./target/x86_64-unknown-linux-musl/release/api ./stack/modules/api/lambda/bootstrap
