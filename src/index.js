import express from "express";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const windowSize = 10;
let storedNumbers = [];
let arrayData;

app.get("/numbers/:numberid", async (req, res) => {
    const numberId = req.params.numberid;
    try {
        let url;

        switch (numberId) {
            case "p":
                url = "http://20.244.56.144/test/primes";
                break;
            case "f":
                url = "http://20.244.56.144/test/fibo";
                break;
            case "e":
                url = "http://20.244.56.144/test/even";
                break;
            case "r":
                url = "http://20.244.56.144/test/rand";
                break;
            default:
                return res.status(400).json({ error: "Invalid number type" });
        }

        const response = await fetch(url, {
            method: "GET",
            withCredentials: true,
            credentials: 'include',
            headers: {
                'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzIzNzk0ODYwLCJpYXQiOjE3MjM3OTQ1NjAsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImM5NGU5NmEyLTg2MWItNDQ3My1iMjg2LTc4ODhiNmE4YTdhOCIsInN1YiI6ImJhbml5YUBnbWFpbC5jb20ifSwiY29tcGFueU5hbWUiOiJhZmZvcmRtZWQiLCJjbGllbnRJRCI6ImM5NGU5NmEyLTg2MWItNDQ3My1iMjg2LTc4ODhiNmE4YTdhOCIsImNsaWVudFNlY3JldCI6IlNSYWhSekNPVmlISHFGbk4iLCJvd25lck5hbWUiOiJSYWplZXYgQmFuaXlhIiwib3duZXJFbWFpbCI6ImJhbml5YUBnbWFpbC5jb20iLCJyb2xsTm8iOiIxIn0.LHMwOb6QPV5PMsN2w1uBx5FW0B3pSWT7Cq-UN9Pe2w4`
            }
        });

        const result = await response.json();
        arrayData = result.numbers;

        console.log(arrayData);

        arrayData?.forEach(num => {
            if (!storedNumbers.includes(num)) {
                storedNumbers.push(num);
            }
        });

        if (storedNumbers.length > windowSize) {
            storedNumbers = storedNumbers.slice(storedNumbers.length - windowSize);
        }

        const average = storedNumbers.reduce((acc, num) => acc + num, 0) / storedNumbers.length;

        res.status(200).json({
            storedNumbers,
            average
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Something went wrong" });
    }
});

app.get("/", (req, res) => {
    res.json({
        message: "Welcome to the API"
    });
});

app.listen(4000, () => {
    console.log("Server up and running");
});
