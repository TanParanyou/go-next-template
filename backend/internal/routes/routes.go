package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/your-org/go-next-template/internal/handlers"
	"github.com/your-org/go-next-template/internal/middleware"
)

func SetupRoutes(app *fiber.App) {
	// API v1
	api := app.Group("/api/v1")

	// Initialize handlers
	authHandler := handlers.NewAuthHandler()

	// Public routes
	auth := api.Group("/auth")
	auth.Post("/register", authHandler.Register)
	auth.Post("/login", authHandler.Login)
	auth.Post("/refresh", authHandler.RefreshToken)

	// Protected routes (require authentication)
	auth.Get("/me", middleware.AuthRequired, authHandler.GetProfile)

	// Admin routes (require admin role)
	admin := api.Group("/admin", middleware.AuthRequired, middleware.AdminOnly)
	_ = admin // TODO: Add admin routes

	// TODO: Add more route groups:
	// - /api/v1/public/* - Public endpoints (no auth required)
	// - /api/v1/users/* - User management
	// - /api/v1/upload/* - File upload
	// - Domain-specific routes
}
