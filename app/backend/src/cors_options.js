const development = {
    origin: "http://localhost:5173",
    credentials: true
}

const production = {
    "origin": "*"
}

const test = {
    "origin": "*"
}

let options = development;

if (process.env.NODE_ENV === "production")
{
    options = production;
}

if (process.env.NODE_ENV === "test")
{
    options = test;
}

export default options;