FROM golang:1.22.0-alpine as builder
WORKDIR /app
COPY . /app/
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o api .

FROM scratch
COPY --from=builder /app/api .
CMD ["./api"]
