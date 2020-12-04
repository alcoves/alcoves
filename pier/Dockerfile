############################
# STEP 1 build executable binary
############################
FROM golang:alpine3.11 AS builder
RUN apk update && apk add --no-cache git
WORKDIR $GOPATH/github.com/bken-io/api/
COPY . .
RUN go mod download
RUN go mod verify 
RUN GOOS=linux GOARCH=amd64 go build -ldflags="-w -s" -o /go/bin/main

############################
# STEP 2 build a small image
############################
FROM scratch
COPY --from=builder /go/bin/main /go/bin/main
ENTRYPOINT ["/go/bin/main"]