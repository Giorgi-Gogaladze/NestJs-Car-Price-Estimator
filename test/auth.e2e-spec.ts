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
        const email = `test${Date.now()}@example.com`;
        return request(app.getHttpServer())
            .post('/auth/signup')
            .send({ email, password: 'giogio' })
            .expect(201)
            .then((res) => {
                const { id, email } = res.body;
                expect(id).toBeDefined();
                expect(email).toEqual(email);
            });
    });

    it('signs in as a new user and returns currently logged in user', async() => {
        const email = 'hello@xample.com'

        const res = await request(app.getHttpServer())
        .post('/auth/signup')
        .send({ email, password: 'giogio' })
        .expect(201);

        const cookie = res.get('Set-Cookie')
        
        const { body } = await request(app.getHttpServer())
        .get('/auth/whoami')
        .set('Cookie', cookie as string[])
        .expect(200);

        expect(body.email).toEqual(email);

    })
})