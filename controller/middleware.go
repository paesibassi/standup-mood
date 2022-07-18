package controller

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/pjebs/restgate"
)

func Authorizer(xkey string, debug bool) gin.HandlerFunc {
	// Initialize Restgate
	rgAuth := restgate.New(
		"X-Auth-Key",
		"X-Auth-Secret",
		restgate.Static,
		restgate.Config{
			Key:                []string{xkey},
			Secret:             []string{""},
			Debug:              debug,
			HTTPSProtectionOff: debug,
		},
	)

	return func(c *gin.Context) {
		nextCalled := false
		nextAdapter := func(http.ResponseWriter, *http.Request) {
			nextCalled = true
			c.Next()
		}
		rgAuth.ServeHTTP(c.Writer, c.Request, nextAdapter)
		if !nextCalled {
			c.AbortWithStatus(401)
		}
	}
}

// TODO saves team data locally in a cookie to avoid too many requests
func Cookier() gin.HandlerFunc {
	return func(c *gin.Context) {
		cookie, err := c.Cookie("token_cookie")
		if err != nil {
			tokenBytes := []byte("sheets-token")
			if err != nil {
				log.Printf("could not retrieve secret: %s\n", err.Error())
			}
			c.SetCookie("token_cookie", string(tokenBytes), 3600, "/", "localhost", true, true)
		}
		c.Set("token_cookie", cookie)
		// before request
		c.Next()
		// after request
		val, ok := c.Get("token_cookie")
		if ok {
			fmt.Printf("Cookie value after: %s\n", val)
		}
	}
}
