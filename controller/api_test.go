package controller

import (
	"math"
	"testing"
	"time"

	"github.com/google/go-cmp/cmp"
	"github.com/google/go-cmp/cmp/cmpopts"
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
		name string
		args args
		want teamMooods
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
			}},
			teamMooods{
				moodSummary{3.2, 4.1, 3.2, 3.65, 4.1, []mood{{yesterday, 3.2}, {today, 4.1}}},
				map[string]moodSummary{
					"Billy": {3.2, 4.1, 3.2, 3.65, 4.1, []mood{{yesterday, 3.2}, {today, 4.1}}},
					"Tom":   {math.NaN(), math.NaN(), 0, 0, 0, []mood{}},
				}},
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := computeMoodMetrics(tt.args.nullableMoods); !cmp.Equal(got, tt.want, cmpopts.EquateNaNs(), cmpopts.EquateEmpty()) {
				t.Errorf("computeMoodMetrics() = %v, want %v", got, tt.want)
			}
		})
	}
}
