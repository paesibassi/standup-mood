package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"gitlab.com/wbaa-experiments/standup-mood/controller"
	"gitlab.com/wbaa-experiments/standup-mood/oauth"
	"gitlab.com/wbaa-experiments/standup-mood/secrets"
	"gitlab.com/wbaa-experiments/standup-mood/spreadsheets"
	"golang.org/x/oauth2"
)

var getNewTokenFlow *bool = flag.Bool("t", false, "Retrieve a new token from Google Sheets")

func main() {
	flag.Parse()

	err := setupSpreadsheetsService(*getNewTokenFlow)
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

func setupSpreadsheetsService(getNewTokenFlow bool) error {
	creds, err := secrets.SecretFromGCloud("app-credentials")
	if err != nil {
		return fmt.Errorf("unable to get app credentials: %v", err)
	}
	config, err := oauth.GetConfig(creds)
	if err != nil {
		return fmt.Errorf("unable to parse client secret to config: %v", err)
	}
	tokenBytes, err := secrets.SecretFromGCloud("sheets-token")
	if err != nil {
		return fmt.Errorf("unable to get token from secrets: %v", err)
	}

	var token *oauth2.Token
	if getNewTokenFlow || tokenBytes == nil {
		token, err = oauth.GetTokenFromWeb(config) // this would only work locally
		if err != nil {
			return fmt.Errorf("unable to get token from web oauth flow: %v", err)
		}
		tokenBytes, err = json.Marshal(token)
		if err != nil {
			return fmt.Errorf("unable to marshal token to bytes array: %v", err)
		}
		secrets.AddSecretVersion("sheets-token", tokenBytes)
	} else {
		token, err = oauth.TokenFromBytes(tokenBytes)
		if err != nil {
			return fmt.Errorf("unable to unmarshal token bytes: %v", err)
		}
	}
	client := oauth.GetClient(config, token)
	ss, err := spreadsheets.NewService(client)
	if err != nil {
		return fmt.Errorf("unable to retrieve Sheets client: %v", err)
	}
	spreadsheets.SS = ss
	return nil
}
