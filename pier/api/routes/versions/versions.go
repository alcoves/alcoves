package versions

import (
	"bytes"
	"context"
	"fmt"
	"strings"

	"github.com/bken-io/api/api/s3"
	"github.com/gofiber/fiber/v2"
	"github.com/minio/minio-go/v7"
)

// this endpoint exists because versions are a heavy query to make
// the link the the master.m3u8 exists on the video record

type Version struct {
	Name             string `json:"name"`
	Status           string `json:"status"`
	PercentCompleted uint8  `json:"percentCompleted"`
}

func removeDuplicatesFromSlice(s []string) []string {
	m := make(map[string]bool)
	for _, item := range s {
		if _, ok := m[item]; ok {
		} else {
			m[item] = true
		}
	}
	var result []string
	for item := range m {
		result = append(result, item)
	}
	return result
}

func contains(s []string, e string) bool {
	for _, a := range s {
		if a == e {
			return true
		}
	}
	return false
}

// fetches the master playlist from wasabi and returns preset names
func getMasterPlaylistPresets(id string) []string {
	// get the master playlist
	presets := []string{}
	s3Path := fmt.Sprintf("v/%s/hls/master.m3u8", id)

	object, err := s3.Wasabi().GetObject(
		context.Background(),
		"cdn.bken.io",
		s3Path,
		minio.GetObjectOptions{})
	if err != nil {
		fmt.Println(err)
		return nil
	}

	buf := new(bytes.Buffer)
	buf.ReadFrom(object)
	myFileContentAsString := buf.String()
	temp := strings.Split(myFileContentAsString, "\n")

	for i := 0; i < len(temp); i++ {
		e := temp[i]
		if strings.Contains(e, "NAME=") {
			presetPart := strings.Split(e, "NAME=")[1]
			preset := strings.Split(presetPart, ",")[0]
			if preset != "" {
				presets = append(presets, preset)
			}
		}
	}

	return presets
}

// fetches versions from tidal
// usually null when there is no ongoing processing
func getTidalVersions(id string) []string {
	versions := []string{}

	opts := minio.ListObjectsOptions{
		Recursive: false,
		Prefix:    fmt.Sprintf("%s/versions/", id),
	}

	for object := range s3.Doco().ListObjects(context.Background(), "tidal", opts) {
		if object.Err != nil {
			fmt.Println(object.Err)
		}

		presetSplit := strings.Split(object.Key, "/")
		presetName := presetSplit[len(presetSplit)-2]

		if strings.Contains(presetName, "p") {
			versions = append(versions, presetName)
		}
	}

	return versions
}

// GetVersions returns tidal information from s3
func GetVersions(c *fiber.Ctx) error {
	id := c.Params("id")

	versionsFromCDN := getMasterPlaylistPresets(id)
	versionsFromTidal := getTidalVersions(id)

	allVersions := append(versionsFromCDN, versionsFromTidal...)
	uniqueVersions := removeDuplicatesFromSlice(allVersions)

	versions := []Version{}

	for i := 0; i < len(uniqueVersions); i++ {
		element := uniqueVersions[i]
		if contains(versionsFromCDN, element) {
			versions = append(versions, Version{
				PercentCompleted: 100,
				Name:             element,
				Status:           "completed",
			})
		} else if contains(versionsFromTidal, element) {
			versions = append(versions, Version{
				PercentCompleted: 50,
				Name:             element,
				Status:           "processing",
			})
		}
	}

	return c.JSON(versions)
}
