package routes

import (
	"log"

	"github.com/alcoves/alcoves/apps/api/database"
	"github.com/alcoves/alcoves/apps/api/tasks"
	"github.com/gofiber/fiber/v2"
	"github.com/hibiken/asynq"
)

// Some sample functions
// https://github.com/hibiken/asynqmon/blob/master/conversion_helpers.go#L114

func taskToMap(task *asynq.Task) map[string]interface{} {
	return map[string]interface{}{
		"payload": task.Payload(),
		"type":    task.Type,
	}
}

func getTasks(c *fiber.Ctx) error {
	qnames, err := database.AsynqInspector.Queues()
	if err != nil {
		log.Fatalf("could not get queues: %v", err)
	}
	log.Printf("queues: %v", qnames)

	var completedTasks []*asynq.Task

	for _, qname := range qnames {
		completedTasks, err := database.AsynqInspector.ListScheduledTasks(qname)
		if err != nil {
			log.Fatalf("could not get tasks in queue %s: %v", qname, err)
		}

		log.Printf("tasks in queue %s: %v", qname, completedTasks)
	}

	// Convert completedTasks to a serializable format
	serializableTasks := make([]map[string]interface{}, len(completedTasks))
	for i, task := range completedTasks {
		serializableTasks[i] = taskToMap(task)
	}

	return c.JSON(fiber.Map{
		"status":         "ok",
		"message":        "get tasks",
		"queues":         qnames,
		"completedTasks": serializableTasks,
	})
}

func add_test_job(c *fiber.Ctx) error {
	// ------------------------------------------------------
	// Example 1: Enqueue task to be processed immediately.
	//            Use (*Client).Enqueue method.
	// ------------------------------------------------------

	// For loop with 1000 iterations

	task, err := tasks.NewVideoProcessTask("https://rustyguts.net/Battlefield_4/2021-06-16_02-06-03.mp4")
	if err != nil {
		log.Fatalf("could not create task: %v", err)
	}
	info, err := database.AsynqClient.Enqueue(task)
	if err != nil {
		log.Fatalf("could not enqueue task: %v", err)
	}
	log.Printf("enqueued task: id=%s queue=%s", info.ID, info.Queue)

	// ------------------------------------------------------------
	// Example 2: Schedule task to be processed in the future.
	//            Use ProcessIn or ProcessAt option.
	// ------------------------------------------------------------

	// info, err = database.AsynqClient.Enqueue(task, asynq.ProcessIn(24*time.Hour))
	// if err != nil {
	// 	log.Fatalf("could not schedule task: %v", err)
	// }
	// log.Printf("enqueued task: id=%s queue=%s", info.ID, info.Queue)

	// ----------------------------------------------------------------------------
	// Example 3: Set other options to tune task processing behavior.
	//            Options include MaxRetry, Queue, Timeout, Deadline, Unique etc.
	// ----------------------------------------------------------------------------

	// task, err = tasks.NewImageResizeTask("https://example.com/myassets/image.jpg")
	// if err != nil {
	// 	log.Fatalf("could not create task: %v", err)
	// }
	// info, err = database.AsynqClient.Enqueue(task, asynq.MaxRetry(10), asynq.Timeout(3*time.Minute))
	// if err != nil {
	// 	log.Fatalf("could not enqueue task: %v", err)
	// }
	// log.Printf("enqueued task: id=%s queue=%s", info.ID, info.Queue)

	return c.JSON(fiber.Map{
		"status":  "ok",
		"message": "test job added to queue",
	})
}
