import { expect } from 'chai';
import sinon from 'sinon';
import express from "express";

describe('AuthController', function () {
    afterEach(() => {
      sinon.restore();
    });

    describe('getLoginForm', function () {
        it('should render login form view', async () => {
          const req = { session: {token: ''} };
          const res = { render: sinon.spy() };
    
          expect(res.render.calledOnce).to.be.true;
        });
    

    });

    describe('getLoginForm', function () {
        it('should render login form view', async () => {
          const req = { session: {token: ''} };
          const res = { render: sinon.spy() };
    
          expect(res.render.calledOnce).to.be.true;
        });
        
        //Case for Successful Upload

        //Case for Invalid format

        //Case for No file

        //Case for User already exists

        //Case for Aws error

        //Case for Server Error
    

    });

})