package controller

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"gitlab.com/wbaa-experiments/standup-mood/spreadsheets"
)

func handleMembers(c *gin.Context) {
	c.Header("Access-Control-Allow-Origin", "*")
	spreadsheetId := os.Getenv("SPREADSHEET_ID")
	if spreadsheetId == "" {
		log.Fatalf("Could not retrieve spreadsheetsId from env variable.")
	}
	teamName := c.DefaultQuery("team", "OneClientCore")
	members, err := spreadsheets.MembersFromSpreadsheet(string(spreadsheetId), teamName)
	if err != nil {
		msg := fmt.Sprintf("could not fetch members data: %v", err)
		log.Println(msg)
		c.JSON(http.StatusInternalServerError, gin.H{"An error occurred": msg})
		return
	}
	c.JSON(http.StatusOK, *members)
}

// This handles a preflight call from the browser to check headers, required for CORS rules
func handleOptions(c *gin.Context) {
	c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
	c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
	c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
	c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET")
	c.AbortWithStatus(http.StatusNoContent)
}

type moodScores struct {
	Date  string             `json:"date"`
	Team  string             `json:"team"`
	Moods map[string]float64 `json:"moods"`
}

func handleMoods(c *gin.Context) {
	c.Header("Access-Control-Allow-Origin", "*")
	spreadsheetId := os.Getenv("SPREADSHEET_ID")
	if spreadsheetId == "" {
		log.Fatalf("Could not retrieve spreadsheetsId from env variable.")
	}
	teamName := c.DefaultQuery("team", "OneClientCore")
	nullableMoods, err := spreadsheets.MoodScoresFromSpreadsheet(spreadsheetId, teamName)
	if err != nil {
		msg := fmt.Sprintf("could not fetch moods data: %v", err)
		log.Println(msg)
		c.JSON(http.StatusInternalServerError, gin.H{"An error occurred": msg})
		return
	}
	// discard null values and convert other values back to floats
	moods := make(map[string][]float64)
	for k, vals := range *nullableMoods {
		var values []float64
		for _, v := range vals {
			if !v.IsNull() {
				values = append(values, v.Value().(float64))
			}
			continue
		}
		moods[k] = values
	}
	c.JSON(http.StatusOK, moods)
}

func handlePostMoods(c *gin.Context) {
	c.Header("Access-Control-Allow-Origin", "*")
	spreadsheetId := os.Getenv("SPREADSHEET_ID")
	if spreadsheetId == "" {
		log.Fatalf("Could not retrieve spreadsheetsId from env variable.")
	}
	var body moodScores
	err := c.BindJSON(&body)
	if err != nil {
		msg := fmt.Sprintf("could not parse mood data from request: %v", err)
		log.Println(msg)
		c.JSON(http.StatusBadRequest, gin.H{"An error occurred": msg})
		return
	}
	date, _ := time.Parse("2006-01-02T15:04:05.000Z", body.Date) // Layout "01/02 03:04:05PM '06 -0700"
	members, err := spreadsheets.MembersFromSpreadsheet(string(spreadsheetId), body.Team)
	if err != nil {
		msg := fmt.Sprintf("could not fetch member list from spreadsheet: %v", err)
		log.Println(msg)
		c.JSON(http.StatusInternalServerError, gin.H{"An error occurred": msg})
		return
	}
	todayMoods := make(map[string]spreadsheets.NullableFloat)
	for k, v := range body.Moods {
		todayMoods[k] = spreadsheets.NewNullableFloat(v, false)
	}
	spreadsheets.WriteMoodScoresToSpreadsheet(string(spreadsheetId), body.Team, *members, date, todayMoods)
	c.JSON(http.StatusOK, gin.H{"moods": len(todayMoods)})
}
