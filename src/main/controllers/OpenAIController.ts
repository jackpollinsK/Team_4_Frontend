import express from "express";
import { postAIResponse } from "../services/OpenAIService";
import { getQueryParams } from "../Utils/OpenAI";
import { jwtDecode } from "jwt-decode";

export const getPromptForm = async (req: express.Request, res: express.Response): Promise<void> => {
    res.render('pages/AIPrompt.html', {pageName: "AI Job finder", token: req.session.token});
}

export const postPromptForm = async (req: express.Request, res: express.Response): Promise<void> => {

    const queryParams = await getQueryParams(req.body);

    const jobRolesResponse = await postAIResponse(queryParams, req.session.token);

    res.render("pages/allJobRolesList.html", {jobRoles: jobRolesResponse, pageName: "Job Roles", token: req.session.token, userLevel: jwtDecode(req.session.token)});
}