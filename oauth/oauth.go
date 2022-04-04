package oauth

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

func GetConfig(c []byte) (*oauth2.Config, error) {
	config, err := google.ConfigFromJSON(c, "https://www.googleapis.com/auth/spreadsheets")
	if err != nil {
		return nil, err
	}
	return config, nil
}

// Request a token from web oAuth flow, then returns the retrieved token.
func GetTokenFromWeb(config *oauth2.Config) (*oauth2.Token, error) {
	authURL := config.AuthCodeURL("state-token", oauth2.AccessTypeOffline)
	log.Printf("Go to the following link in your browser then type the "+
		"authorization code: \n%v\n", authURL)
	var authCode string
	if _, err := fmt.Scan(&authCode); err != nil {
		return nil, fmt.Errorf("unable to read authorization code: %v", err)
	}
	tok, err := config.Exchange(context.Background(), authCode)
	if err != nil {
		return nil, fmt.Errorf("unable to retrieve token from web: %v", err)
	}
	return tok, nil
}

func TokenFromBytes(bytes []byte) (*oauth2.Token, error) {
	token := &oauth2.Token{}
	err := json.Unmarshal(bytes, token)
	return token, err
}

// Returns a *http.Client using a config and a token.
func GetClient(config *oauth2.Config, token *oauth2.Token) *http.Client {
	tokSrc := config.TokenSource(context.Background(), token)
	return oauth2.NewClient(context.Background(), tokSrc)
}
