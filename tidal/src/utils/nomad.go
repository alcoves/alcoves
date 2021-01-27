package utils

import (
	"fmt"
	"os"
	"os/exec"
)

// DispatchNomadJob enqueues a batch job to Nomad
func DispatchNomadJob(jobName string, meta []string) {
	args := []string{}
	args = append(args, "job")
	args = append(args, "dispatch")
	args = append(args, "-detach")

	for i := 0; i < len(meta); i++ {
		m := meta[i]
		args = append(args, "-meta")
		args = append(args, fmt.Sprintf("\"%s\"", m))
	}

	args = append(args, jobName)

	cmd := exec.Command("nomad", args...)
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr

	if err := cmd.Run(); err != nil {
		fmt.Println("Error:", err)
		panic(err)
	}
}
