package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
	r.StaticFile("/", "./build/index.html")
	r.StaticFS("/assets/", http.Dir("./build/assets"))
	r.StaticFile("favicon.ico", "./build/favicon.ico")
	r.GET("/team/*team", func(c *gin.Context) {
		c.File("./build/index.html")
	})

	api := r.Group("api")
	{
		api.GET("/members", handleMembers)
		api.GET("/moods", handleMoods)
		api.GET("/teams", handleTeams)
		api.OPTIONS("/moods", handleOptions)
		api.POST("/moods", handlePostMoods)
	}
}
