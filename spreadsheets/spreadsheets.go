package spreadsheets

import (
	"context"
	"errors"
	"fmt"
	"log"
	"strconv"
	"strings"
	"time"

	"google.golang.org/api/option"
	"google.golang.org/api/sheets/v4"
)

var SS *sheets.Service

func NewService(creds []byte) (*sheets.Service, error) {
	return sheets.NewService(context.Background(), option.WithCredentialsJSON(creds))
}

type NullableFloat struct {
	val  float64
	null bool
}

func NewNullableFloat(val float64, null bool) NullableFloat {
	return NullableFloat{val, null}
}

func (nf NullableFloat) IsNull() bool {
	return nf.null
}

func (nf NullableFloat) Value() interface{} {
	if nf.IsNull() {
		return nil
	}
	return nf.val
}

func membersNamesFromRange(resp *sheets.ValueRange) (teamMembers []string) {
	for _, m := range resp.Values[0][1:] {
		memberName, ok := m.(string)
		if !ok {
			log.Println("Wrong data type read")
			continue
		}
		teamMembers = append(teamMembers, memberName)
	}
	return
}

func MembersFromSpreadsheet(spreadsheetId string, sheet string) (*[]string, error) {
	readRange := fmt.Sprintf("%s!A2:Z2", sheet)
	resp, err := SS.Spreadsheets.Values.Get(spreadsheetId, readRange).Do()
	if err != nil {
		return nil, fmt.Errorf("unable to retrieve data from sheet: %v", err)
	}
	if len(resp.Values) == 0 {
		return nil, errors.New("no data found")
	}
	// only 1 row, of which the first element will be empty (date column)
	teamMembers := membersNamesFromRange(resp)
	return &teamMembers, nil
}

func TeamsFromSpreadsheet(spreadsheetId string) (*[]string, error) {
	readRange := "Teams!A1:A"
	resp, err := SS.Spreadsheets.Values.Get(spreadsheetId, readRange).Do()
	if err != nil {
		return nil, fmt.Errorf("unable to retrieve data from sheet: %v", err)
	}
	if len(resp.Values) == 0 {
		return nil, errors.New("no data found")
	}
	teams := make([]string, len(resp.Values))
	for i, t := range resp.Values {
		// multiple rows, only 1 column per row with team name
		teamName, ok := t[0].(string)
		if !ok {
			log.Println("Wrong data type read")
			continue
		}
		teams[i] = teamName
	}
	return &teams, nil
}

func WriteMoodScoresToSpreadsheet(spreadsheetId string, sheet string, members []string, date time.Time, moods map[string]NullableFloat) error {
	writeRange := fmt.Sprintf("%s!A2:Z", sheet)
	moodScores := make([]interface{}, len(members)+1)
	moodScores[0] = date.String()[:11]
	for i, m := range members {
		if v, ok := moods[m]; !ok || v.IsNull() {
			moodScores[i+1] = ""
		} else {
			moodScores[i+1] = v.val
		}
	}
	valueRange := &sheets.ValueRange{
		MajorDimension: "ROWS",
		Values:         [][]interface{}{moodScores},
	}
	resp, err := SS.Spreadsheets.Values.Append(spreadsheetId, writeRange, valueRange).ValueInputOption("USER_ENTERED").Do()
	if err != nil {
		return fmt.Errorf("unable to update data on sheet: %v", err)
	}
	log.Printf("Updated %d cells of spreadsheet", resp.Updates.UpdatedCells)
	return nil
}

type Mood = struct {
	Date time.Time
	Mood NullableFloat
}

type MoodHistory = map[string][]Mood

func MoodScoresFromSpreadsheet(spreadsheetId string, sheet string) (*MoodHistory, error) {
	readRange := fmt.Sprintf("%s!A2:Z", sheet)
	resp, err := SS.Spreadsheets.Values.Get(spreadsheetId, readRange).Do()
	if err != nil {
		return nil, fmt.Errorf("unable to retrieve data from sheet: %v", err)
	}
	if len(resp.Values) == 0 {
		return nil, errors.New("no data found")
	}

	// the first row should contain the name of team memberNames
	memberNames := membersNamesFromRange(resp)
	moodScores := make(MoodHistory, len(memberNames))
	// subsequent rows should contain the mood scores as floats, or null values for missing scores
	for _, row := range resp.Values[1:] {
		// first column contains the date value
		strVal, ok := row[0].(string)
		if !ok {
			log.Println("Wrong data type read")
			continue
		}
		date, err := parseDates(strVal)
		if err != nil {
			log.Printf("unable to parse date %v", err)
			continue
		}

		// other columns contain either a mood score, or missing values
		for memberIdx, val := range row[1:] {
			strVal, ok := val.(string)
			if !ok {
				log.Println("Wrong data type read")
				continue
			}
			var mood NullableFloat
			if len(strVal) == 0 {
				mood = NewNullableFloat(0, true)
			} else {
				v, err := strconv.ParseFloat(strVal, 64)
				if err != nil {
					log.Printf("%v", err)
					continue
				}
				mood = NewNullableFloat(v, false)
			}
			moodScores[memberNames[memberIdx]] = append(moodScores[memberNames[memberIdx]], Mood{date, mood})
		}
	}
	return &moodScores, nil
}

func parseDates(date string) (time.Time, error) {
	// Go datetime formatting string reference: Mon Jan 2 15:04:05 MST 2006
	switch {
	case strings.Contains(date, "/"):
		return time.Parse("1/2/2006", date) // used by spreadsheets when cell is formatted as "date"
	case strings.Contains(date, "-"):
		return time.Parse("2006-1-2", date) // used by spreadsheets when cell is set with automatic formatting
	default:
		return time.Time{}, fmt.Errorf("could not find any known date format in %s", date)
	}
}
