import request from "supertest"
import app from "../src/app"

describe("app", () => {

    it("should successfully GET method", async () => {
        const response = await request(app).get("/");
        expect(response.status).toBe(200);
        expect(response.text).toBe("Hello World!");
    });

})
