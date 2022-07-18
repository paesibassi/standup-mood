package controller

import (
	"fmt"
	"log"
	"math"
	"net/http"
	"os"
	"sort"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/montanaflynn/stats"
	"gitlab.com/wbaa-experiments/standup-mood/slack"
	"gitlab.com/wbaa-experiments/standup-mood/spreadsheets"
)

func handleMembers(c *gin.Context) {
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

func handleTeams(c *gin.Context) {
	spreadsheetId := os.Getenv("SPREADSHEET_ID")
	if spreadsheetId == "" {
		log.Fatalf("Could not retrieve spreadsheetsId from env variable.")
	}
	teams, err := spreadsheets.TeamsFromSpreadsheet(string(spreadsheetId))
	if err != nil {
		msg := fmt.Sprintf("could not fetch teams data: %v", err)
		log.Println(msg)
		c.JSON(http.StatusInternalServerError, gin.H{"An error occurred": msg})
		return
	}
	c.JSON(http.StatusOK, *teams)
}

// This handles a preflight call from the browser to check headers, required for CORS rules
func handleOptions(c *gin.Context) {
	c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
	c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-Auth-Key, Authorization, Cache-Control")
	c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET")
	c.AbortWithStatus(http.StatusNoContent)
}

func handleMoods(c *gin.Context) {
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
	moods := computeMoodMetrics(nullableMoods)
	c.JSON(http.StatusOK, moods)
}

type mood = struct {
	Date time.Time
	Mood float64
}

type moodSummary = struct {
	Min    float64 `json:"min"`
	Max    float64 `json:"max"`
	Q1     float64 `json:"q1"`
	Mean   float64 `json:"mean"`
	Q3     float64 `json:"q3"`
	Values []mood  `json:"values"`
}

type teamMooods = struct {
	Team    moodSummary            `json:"team"`
	Members map[string]moodSummary `json:"members"`
}

func computeMoodMetrics(nullableMoods *spreadsheets.MoodHistory) teamMooods {
	memberMoods := make(map[string]moodSummary)
	// discard null values and convert other values back to floats
	var allValues []float64
	teamMoods := make(map[time.Time][]float64)
	for memberName, scores := range *nullableMoods {
		var moods []mood
		var values []float64
		for _, v := range scores {
			if !v.Mood.IsNull() {
				floatValue := v.Mood.Value().(float64)
				moods = append(moods, mood{v.Date, floatValue})
				values = append(values, floatValue)
				teamMoods[v.Date] = append(teamMoods[v.Date], floatValue)
				allValues = append(allValues, floatValue)
			}
			continue
		}
		min, _ := stats.Min(values)
		max, _ := stats.Max(values)
		min = fillNaNValues(min, 3)
		max = fillNaNValues(max, 3)
		quartiles, _ := stats.Quartile(values)
		memberMoods[memberName] = moodSummary{
			min,
			max,
			fillNaNValues(quartiles.Q1, min),
			fillNaNValues(quartiles.Q2, 3),
			fillNaNValues(quartiles.Q3, max),
			moods,
		}
	}
	min, _ := stats.Min(allValues)
	max, _ := stats.Max(allValues)
	quartiles, _ := stats.Quartile(allValues)
	teamAvgMoods := moodAverageByDates(teamMoods)
	team := moodSummary{
		Min:    min,
		Max:    max,
		Q1:     quartiles.Q1,
		Mean:   quartiles.Q2,
		Q3:     quartiles.Q3,
		Values: teamAvgMoods,
	}
	return teamMooods{team, memberMoods}
}

func fillNaNValues(value, alternative float64) float64 {
	if math.IsNaN((value)) || value == 0 {
		return alternative
	}
	return value
}

func sortMapByDates(teamMoods map[time.Time][]float64) []time.Time {
	dates := make([]time.Time, 0, len(teamMoods))
	for date := range teamMoods {
		dates = append(dates, date)
	}
	sort.Slice(dates, func(i, j int) bool {
		return dates[i].Before(dates[j])
	})
	return dates
}

func moodAverageByDates(teamMoods map[time.Time][]float64) []mood {
	teamAvgMoods := make([]mood, 0, len(teamMoods))
	dates := sortMapByDates(teamMoods)
	for _, date := range dates {
		mean, _ := stats.Mean(teamMoods[date])
		teamAvgMoods = append(teamAvgMoods, mood{date, mean})
	}
	return teamAvgMoods
}

type Moods map[string]float64

type moodScores struct {
	Date  string `json:"date"`
	Team  string `json:"team"`
	Moods `json:"moods"`
}

// Computes the average value for an array of mood scores
func averageMood(moods map[string]spreadsheets.NullableFloat) (float64, error) {
	var sum float64
	for _, mood := range moods {
		if !mood.IsNull() {
			v, _ := mood.Value().(float64) // if type assertion fails, v = 0 which has no effect on the sum, so no need to check
			sum += v
		}
	}
	return sum / float64(len(moods)), nil
}

func handlePostMoods(c *gin.Context) {
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

	team := body.Team
	date, _ := time.Parse("2006-01-02T15:04:05.000Z", body.Date) // Layout "01/02 03:04:05PM '06 -0700"
	members, err := spreadsheets.MembersFromSpreadsheet(string(spreadsheetId), team)
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

	err = spreadsheets.WriteMoodScoresToSpreadsheet(string(spreadsheetId), team, *members, date, todayMoods)
	if err != nil {
		msg := fmt.Sprintf("could not save mood scores to spreadsheet: %v", err)
		log.Println(msg)
		c.JSON(http.StatusInternalServerError, gin.H{"An error occurred": msg})
		return
	}

	avg, err := averageMood(todayMoods)
	if err != nil {
		msg := fmt.Sprintf("could not compute mood average with today's moods: %v", err)
		log.Println(msg)
		c.JSON(http.StatusInternalServerError, gin.H{"An error occurred": msg})
	}

	channel, err := spreadsheets.SlackChannelFromSpreadsheet(spreadsheetId, team)
	if err != nil {
		msg := fmt.Sprintf("could not find slack channel: %v", err)
		log.Println(msg)
	} else {
		err = slack.SendMessageToChannel(
			*channel,
			fmt.Sprintf("%d people in the standup today in the %s team, average mood is %.2f", len(todayMoods), team, avg),
		)
		if err != nil {
			msg := fmt.Sprintf("could not send slack message: %v", err)
			log.Println(msg)
		}
	}

	c.JSON(http.StatusOK, gin.H{"moods": len(todayMoods)})
}
