############################
# STEP 1 build executable binary
############################

FROM golang:alpine3.11 AS builder
RUN apk update && apk add --no-cache git
WORKDIR $GOPATH/src/bken-io/api/
COPY . .
RUN go get -d -v
RUN GOOS=linux GOARCH=amd64 go build -ldflags="-w -s" -o 
RUN go build -o /go/bin/main

############################
# STEP 2 build a small image
############################
FROM scratch
COPY --from=builder /go/bin/main /go/bin/main
ENTRYPOINT ["/go/bin/main"]