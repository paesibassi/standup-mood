package main

import (
	"flag"
	"fmt"
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"gitlab.com/wbaa-experiments/standup-mood/controller"
	"gitlab.com/wbaa-experiments/standup-mood/secrets"
	"gitlab.com/wbaa-experiments/standup-mood/spreadsheets"
)

func main() {
	flag.Parse()

	err := setupSpreadsheetsService()
	if err != nil {
		log.Fatalf("could not complete setup: %v\n", err)
	}
	r := gin.Default()
	r.SetTrustedProxies(nil)
	r.TrustedPlatform = gin.PlatformGoogleAppEngine
	// r.Use(controller.Cookier()) // TODO saves team data locally in a cookie to avoid too many requests
	controller.SetupRoutes(r)
	port := os.Getenv("PORT") // GAE runs on port == "8081"
	if port == "" {
		port = "8282"
	}
	r.Run(":" + port)
}

func setupSpreadsheetsService() error {
	creds, err := secrets.SecretFromGCloud("sheets-service-account")
	if err != nil {
		return fmt.Errorf("unable to get app credentials: %v", err)
	}
	ss, err := spreadsheets.NewService(creds)
	if err != nil {
		return fmt.Errorf("unable to retrieve Sheets client: %v", err)
	}
	spreadsheets.SS = ss
	return nil
}
