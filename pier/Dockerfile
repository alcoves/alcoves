FROM golang:1.15.0-alpine as BUILDER

WORKDIR /go/src/github.com/bkenio/api/
COPY . .
RUN go mod download
RUN go mod verify 
RUN CGO_ENABLED=0  GOARCH=amd64 GOOS=linux go build -ldflags="-w -s" -a -installsuffix cgo -o main .

FROM alpine:latests
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=builder /go/src/github.com/bkenio/api/main .
CMD ["./main"]