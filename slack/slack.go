package slack

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

// Sends a message to a Slack channel using webhooks
func SendMessageToChannel(channel, message string) error {
	value := map[string]string{"text": message}
	data, err := json.Marshal(value)
	if err != nil {
		return err
	}
	body := bytes.NewBuffer(data)
	resp, err := http.Post(channel, "application/json", body)
	if err != nil {
		return err
	}
	if resp.StatusCode == 200 {
		return nil
	}
	respBody, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return err
	}
	return fmt.Errorf("slack API returned an error status: %v: %v", resp.Status, string(respBody))
}
