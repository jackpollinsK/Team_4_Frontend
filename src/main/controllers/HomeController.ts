import express from "express";

export const getHomePage = async (req: express.Request, res: express.Response): Promise<void> => {
    res.render('pages/home.html', {pageName: "Kainos Jobs Homepage"});
}