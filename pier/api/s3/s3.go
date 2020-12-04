package s3

import (
	"fmt"
	"os"

	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

// Doco is the s3 client for digitalocean
func Doco() *minio.Client {
	accessKey := os.Getenv("DO_ACCESS_KEY_ID")
	secKey := os.Getenv("DO_SECRET_ACCESS_KEY")
	endpoint := os.Getenv("DO_ENDPOINT")

	client, err := minio.New(endpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(accessKey, secKey, ""),
		Secure: true,
	})

	if err != nil {
		fmt.Println(err)
	}

	return client
}

// Wasabi is the s3 client for wasabi
func Wasabi() *minio.Client {
	accessKey := os.Getenv("WASABI_ACCESS_KEY_ID")
	secKey := os.Getenv("WASABI_SECRET_ACCESS_KEY")
	endpoint := os.Getenv("WASABI_ENDPOINT")

	client, err := minio.New(endpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(accessKey, secKey, ""),
		Secure: true,
	})

	if err != nil {
		fmt.Println(err)
	}

	return client
}
