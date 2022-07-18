package controller

import (
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine, debug bool) {
	xkey := os.Getenv("X_KEY")
	if xkey == "" {
		log.Fatalln("authorization key not specified")
	}
	auth := authorizer(xkey, debug)
	allowOriginHeader := originWhiteLister()

	r.StaticFile("/", "./build/index.html")
	r.StaticFS("/assets/", http.Dir("./build/assets"))
	r.StaticFile("favicon.ico", "./build/favicon.ico")
	r.GET("/team/*team", func(c *gin.Context) {
		c.File("./build/index.html")
	})

	api := r.Group("api", allowOriginHeader)
	{
		r.Use()
		api.OPTIONS("/*any", handleOptions)
		api.GET("/members", auth, handleMembers)
		api.GET("/teams", handleTeams)
		api.GET("/moods", auth, handleMoods)
		// api.OPTIONS("/moods", handleOptions)
		api.POST("/moods", auth, handlePostMoods)
	}
}
