import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "MySkill User Articles API",
      version: "1.0.0",
      description: "Dokumentasi API untuk user, artikel, dan page view tracker",
    },
    tags: [
      { name: "Auth", description: "Authentication endpoints" },
      { name: "Users", description: "User management" },
      { name: "Articles", description: "Article management" },
      { name: "PageView", description: "Page View Tracker" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
    servers: [
      {
        url: `http://${process.env.HOST || "localhost"}:${
          process.env.PORT || 5000
        }`,
        description: "Local server",
      },
    ],
    schemes: ["http"],
  },
  apis: ["./routes/*.js", "./controllers/*.js"],
};

export default swaggerJSDoc(options);
