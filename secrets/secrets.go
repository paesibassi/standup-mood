package secrets

import (
	"context"
	"fmt"
	"log"

	secretmanager "cloud.google.com/go/secretmanager/apiv1"
	secretmanagerpb "google.golang.org/genproto/googleapis/cloud/secretmanager/v1"
)

// Retrieves a secret from Google Secret Manager, given the key value as string
func SecretFromGCloud(secretName string) ([]byte, error) {
	secretId := fmt.Sprintf("projects/1091865534166/secrets/%s/versions/latest", secretName)
	ctx := context.Background()
	client, err := secretmanager.NewClient(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to create secretmanager client: %v", err)
	}
	defer client.Close()
	req := &secretmanagerpb.AccessSecretVersionRequest{
		Name: secretId,
	}
	result, err := client.AccessSecretVersion(ctx, req)
	if err != nil {
		return nil, fmt.Errorf("failed to access secret version: %v", err)
	}
	return result.Payload.Data, nil
}

// Saves a new version of a secret in Google Secret Manager
func AddSecretVersion(secretName string, payload []byte) error {
	secret := fmt.Sprintf("projects/1091865534166/secrets/%s", secretName)
	ctx := context.Background()
	client, err := secretmanager.NewClient(ctx)
	if err != nil {
		return fmt.Errorf("failed to create secretmanager client: %v", err)
	}
	defer client.Close()
	req := &secretmanagerpb.AddSecretVersionRequest{
		Parent: secret,
		Payload: &secretmanagerpb.SecretPayload{
			Data: payload,
		},
	}
	result, err := client.AddSecretVersion(ctx, req)
	if err != nil {
		return fmt.Errorf("failed to add secret version: %v", err)
	}
	log.Printf("Added secret version: %s\n", result.Name)
	return nil
}
