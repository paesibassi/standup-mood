package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
	r.StaticFile("/", "./build/index.html")
	r.StaticFS("/assets/", http.Dir("./build/assets"))
	r.StaticFile("favicon.ico", "./build/favicon.ico")

	api := r.Group("api")
	{
		api.GET("/members", handleMembers)
		api.GET("/moods", handleMoods)
		api.POST("/moods", handlePostMoods)
		api.OPTIONS("/moods", handleOptions)
	}
}
