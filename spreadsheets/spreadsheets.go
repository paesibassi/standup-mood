package spreadsheets

import (
	"context"
	"errors"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"time"

	"google.golang.org/api/option"
	"google.golang.org/api/sheets/v4"
)

var SS *sheets.Service

func NewService(client *http.Client) (*sheets.Service, error) {
	return sheets.NewService(context.Background(), option.WithHTTPClient(client))
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

// func sumAndLen(a []NullableFloat) (s float64, l float64) {
// 	for _, v := range a {
// 		if !v.isNull() {
// 			s += v.val
// 			l += 1
// 		}
// 	}
// 	return
// }

// func average(a []NullableFloat) float64 {
// 	s, l := sumAndLen(a)
// 	return s / l
// }

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

type MoodScores = map[string][]NullableFloat

func MoodScoresFromSpreadsheet(spreadsheetId string, sheet string) (*MoodScores, error) {
	readRange := fmt.Sprintf("%s!A2:Z", sheet)
	resp, err := SS.Spreadsheets.Values.Get(spreadsheetId, readRange).Do()
	if err != nil {
		return nil, fmt.Errorf("unable to retrieve data from sheet: %v", err)
	}
	moodScores := make(MoodScores)
	if len(resp.Values) == 0 {
		return nil, errors.New("no data found")
	}
	// the first row should contain the name of team memberNames
	memberNames := membersNamesFromRange(resp)
	// subsequent rows should contain the mood scores as floats, or null values for missing scores
	for _, row := range resp.Values[1:] {
		// skip the first value (date column)
		for i, val := range row[1:] {
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
			moodScores[memberNames[i]] = append(moodScores[memberNames[i]], mood)
		}
	}
	return &moodScores, nil
}