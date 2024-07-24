import * as AuthController from "../../../main/controllers/AuthControllers";
import * as AuthService from "../../../main/services/AuthService";
import { expect } from 'chai';
import sinon from 'sinon';
import { Request, Response } from 'express'; // Ensure you have express types if you're using TypeScript

describe('AuthController', function () {
    afterEach(() => {
        sinon.restore();
    });

    describe('getLoginForm', function () {
        it('should render login form view', async () => {

        });
    });
});
