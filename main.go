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
	xkey := os.Getenv("X_KEY")
	if xkey == "" {
		log.Fatalln("authorization key not specified")
	}

	// check if running locally (dev) or on GAE (prod)
	var debug bool
	if os.Getenv("GAE_APPLICATION") == "" {
		debug = true
	} else {
		debug = false
	}

	// setup spreadsheet service
	err := setupSpreadsheetsService()
	if err != nil {
		log.Fatalf("could not complete setup: %v\n", err)
	}

	// setup Gin engine
	r := gin.Default()
	r.SetTrustedProxies(nil)
	r.TrustedPlatform = gin.PlatformGoogleAppEngine
	r.Use(controller.Authorizer(xkey, debug))
	controller.SetupRoutes(r)

	port := "8282"
	if !debug {
		port = os.Getenv("PORT") // GAE runs on port == "8081"
	}

	// start the server
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
