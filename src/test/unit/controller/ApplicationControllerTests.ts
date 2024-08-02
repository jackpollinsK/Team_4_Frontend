import { expect } from 'chai';
import sinon from 'sinon';
import express from "express";
import { getApplyJobRolesForm } from '../../../main/controllers/ApplicationController';
import jwt from 'jsonwebtoken';
import { allowRoles } from "../../../main/middleware/AuthMiddleware";
import { UserRole } from "../../../main/models/JwtToken";
import session from 'express-session';

describe('AuthController', function () {
  afterEach(() => {
    sinon.restore();
  });

  const secretKey = 'SUPER_SECRET';
  const validJwtToken = jwt.sign({ Role: UserRole.User }, secretKey, { expiresIn: '8h' });

  describe.only('getApplicationForm', function () {
    it('should render application form when user is logged in', async () => {
      //Case for Successful Upload

      const req = { session: {token: validJwtToken}, params: {id: 1}};
      const res = { render: sinon.spy() };

      await getApplyJobRolesForm(req as any, res as any);

      expect(res.render.calledOnce).to.be.true;
      //expect(res.render.calledWith('pages/applyForJobRole.html', { id: req.params.id, pageName: 'Apply for a Job', token: req.session.token })).to.be.true;
    });

    it('should render Not logged in page when user is not signed in', async () => {
      //Case for Successful Upload

      const req = { session: {token: ''} };
      const res = { render: sinon.spy() };

      await getApplyJobRolesForm(req as any, res as any);
      
      expect(res.render.calledOnce).to.be.true;
      expect(res.render.calledWith('pages/notloggedIn.html', {pageName: 'Not logged in'})).to.be.true;
    });

  });

  describe('postApplicationForm', function () {
    it('should render login form view', async () => {
      //Case for Successful Upload
    });

    it('should render login form view', async () => {
      //You must upload file
    });

    it('should render login form view', async () => {
      //auth reqected
    });

    it('should render login form view', async () => {
      //Case for Invalid format
    });

    it('should render login form view', async () => {
      //Case for No file
    });

    it('should render login form view', async () => {
      //Case for User already exists
    });

    it('should render login form view', async () => {
      //Case for Aws error
    });

    it('should render login form view', async () => {
      //Case for Server Error
    });

  });

});
