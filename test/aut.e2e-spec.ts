import { INestApplication } from "@nestjs/common"
import { Test } from "@nestjs/testing"
import { App } from "supertest/types"
import request from "supertest"
import { AppModule } from "../src/app.module"

describe("Authentication system E2E", () => {
    let app: INestApplication<App>

    beforeEach(async () => {
        const moduleFixture = Test.createTestingModule({
            imports: [AppModule]
        }).compile();

        app = (await moduleFixture).createNestApplication();
        await app.init();
    });

    it('handles a signup request', () => {
        const email = 'testuser@example.com';
        return request(app.getHttpServer())
        .post('/auth/signup')
        .send({email, password: 'giogio'})
        .expect(201)
        .then((res) => {
            const {id, email} = res.body;
            expect(id).toBeDefined();
            expect(email).toEqual(email)
        })
        
    })
})