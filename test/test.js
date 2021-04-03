let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require('../app');

chai.should();

chai.use(chaiHttp);

describe('Login API', () => {

    /**
     * Test the POST route
     */
    describe("POST /user", () => {

        it("It should NOT create a user as password missing", (done) => {
            const user = {
                email: "task@gmail.com"
            };
            chai.request(server)                
                .post("/user")
                .send(user)
                .end((err, response) => {
                    response.should.have.status(406);
                    response.body.should.be.a('object');
                    response.body.should.have.property('status').eq("error");
                    response.body.should.have.property('error').eq("Password missing");
                done();
                });
        });

        it("It should NOT create a user as email or both are missing missing", (done) => {
            const user = {
                password: "task@password"
            };
            chai.request(server)                
                .post("/user")
                .send(user)
                .end((err, response) => {
                    response.should.have.status(406);
                    response.body.should.be.a('object');
                    response.body.should.have.property('status').eq("error");
                    response.body.should.have.property('error').eq("Email missing");
                done();
                });
        });

//always give a new email id as it may exist in the database

        it("It should create a new user if not present", (done) => {
            const user = {
                email: "abhishek@gmail.com",
                password: 'hey'
            };
            chai.request(server)                
                .post("/user")
                .send(user)
                .end((err, response) => {
                    response.should.have.status(201);
                    response.body.should.be.a('object');
                    response.text.should.be.eq("user-created");
                done();
                });
        });

        it("It should validate the user if present and password is correct", (done) => {
            const user = {
                email: "task@gmail.com",
                password: 'hey'
            };
            chai.request(server)                
                .post("/user")
                .send(user)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.text.should.be.eq("user authenticated");
                done();
                });
        });

        it("It should NOT validate the user if present and password is NOT correct", (done) => {
            const user = {
                email: "task@gmail.com",
                password: 'password'
            };
            chai.request(server)                
                .post("/user")
                .send(user)
                .end((err, response) => {
                    response.should.have.status(401);
                    response.body.should.be.a('object');
                    response.text.should.be.eq("user not authenticated");
                done();
                });
        });

    });


});