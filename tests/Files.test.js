const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../your-express-app"); // Replace with the actual path to your Express app
const File = require("../path-to-file-model"); // Replace with the actual path to your File model

describe("File API", () => {
  let userId;

  beforeAll(async () => {
    // Connect to the test database or use a test database connection
    // Initialize userId by creating a user to use in the tests
    await mongoose.connect("mongodb://localhost:27017/your-test-database", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const user = await createUser();
    userId = user._id;
  });

  afterAll(async () => {
    // Cleanup: Remove the created user and associated files after tests
    await User.deleteMany({});
    await File.deleteMany({});
    // Close the MongoDB connection
    await mongoose.connection.close();
  });

  it("should not allow a non-existent user to add a document", async () => {
    // Make sure the user is non-existent by deleting it
    await User.deleteMany({});

    // Send a request to add a document for the non-existent user
    const response = await request(app).post("/api/files").send({
      name: "Test Document",
      content: "Test content",
      owner: userId, // Use the previously created user's ID
    });

    // Expect the response status to be 404 (Not Found) or any other appropriate status
    expect(response.status).toBe(404); // You can adjust this based on your API design

    // Expect the response body to contain an error message or any other expected response
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("User not found"); // Adjust based on your actual error message
  });

  // Add more tests as needed for other scenarios

  // Helper function to create a user
  async function createUser() {
    return await User.create({
      username: "testuser",
      password: "testpassword",
      // Add any other required user properties
    });
  }
});
