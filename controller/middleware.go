package controller

import (
	"fmt"
	"log"

	"github.com/gin-gonic/gin"
)

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
