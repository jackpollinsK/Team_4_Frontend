import { expect } from 'chai';
import sinon from 'sinon';
import express from "express";

describe('AuthController', function () {
  afterEach(() => {
    sinon.restore();
  });

  describe('getApplicationForm', function () {
    it('should render login form view', async () => {
      //Case for Successful Upload
      
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
