package controller

import (
	"testing"
	"time"

	"github.com/google/go-cmp/cmp"
	"github.com/google/go-cmp/cmp/cmpopts"
	"github.com/r3labs/diff"
	"gitlab.com/wbaa-experiments/standup-mood/spreadsheets"
)

func TestComputeMoodMetrics(t *testing.T) {
	twoDaysAgo := time.Now().Add(-time.Hour * 24 * 3)
	yesterday := time.Now().Add(-time.Hour * 24 * 2)
	today := time.Now().Add(-time.Hour * 24)
	type args struct {
		nullableMoods *spreadsheets.MoodHistory
	}
	tests := []struct {
		name     string
		args     args
		expected teamMooods
	}{
		{
			"Basic",
			args{nullableMoods: &map[string][]spreadsheets.Mood{
				"Tom": {
					{twoDaysAgo, spreadsheets.NewNullableFloat(4.0, false)},
					{yesterday, spreadsheets.NewNullableFloat(2.0, false)},
					{today, spreadsheets.NewNullableFloat(3.0, false)},
				},
				"Billy": {
					{twoDaysAgo, spreadsheets.NewNullableFloat(3.5, false)},
					{yesterday, spreadsheets.NewNullableFloat(3.2, false)},
					{today, spreadsheets.NewNullableFloat(4.1, false)},
				},
			}},
			teamMooods{
				moodSummary{2, 4.1, 3, 3.35, 4, []mood{{twoDaysAgo, 3.75}, {yesterday, 2.6}, {today, 3.55}}},
				map[string]moodSummary{
					"Billy": {3.2, 4.1, 3.2, 3.5, 4.1, []mood{{twoDaysAgo, 3.5}, {yesterday, 3.2}, {today, 4.1}}},
					"Tom":   {2, 4, 2, 3, 4, []mood{{twoDaysAgo, 4}, {yesterday, 2}, {today, 3}}},
				}},
		},
		{
			"Missing Scores",
			args{nullableMoods: &map[string][]spreadsheets.Mood{
				"Tom": {},
				"Billy": {
					{yesterday, spreadsheets.NewNullableFloat(3.2, false)},
					{today, spreadsheets.NewNullableFloat(4.1, false)},
				},
				"Sally": {
					{yesterday, spreadsheets.NewNullableFloat(1.7, false)},
				},
			}},
			teamMooods{
				moodSummary{1.7, 4.1, 1.7, 3.2, 4.1, []mood{{yesterday, 2.45}, {today, 4.1}}},
				map[string]moodSummary{
					"Billy": {3.2, 4.1, 3.2, 3.65, 4.1, []mood{{yesterday, 3.2}, {today, 4.1}}},
					"Tom":   {3, 3, 3, 3, 3, []mood{}},
					"Sally": {1.7, 1.7, 1.7, 1.7, 1.7, []mood{{yesterday, 1.7}}},
				}},
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := computeMoodMetrics(tt.args.nullableMoods); !cmp.Equal(got, tt.expected, cmpopts.EquateNaNs(), cmpopts.EquateEmpty()) {
				change, err := diff.Diff(tt.expected, got)
				if err != nil {
					t.Errorf("computeMoodMetrics() = %v, want %v", tt.expected, got)
					return
				}
				t.Errorf("computeMoodMetrics() diff expected (From) vs Actual (To) :\n%+v", change)
			}
		})
	}
}
