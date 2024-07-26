import * as HomeController from "../../../controllers/HomeController";
import { expect } from 'chai';
import sinon from 'sinon';
import express from "express";

describe('HomeController',function() {
    afterEach(() => {
        sinon.restore();
    });

    describe('getHomeForm', function () {
        it('should render home form view', async () => {
          const req = {};
          const res = { render: sinon.spy() };
    
          await HomeController.getHomePage(req as express.Request, res as unknown as express.Response);
    
          expect(res.render.calledOnce).to.be.true;
        });
      });
})