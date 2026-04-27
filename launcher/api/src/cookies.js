export const addChamberIdToCookie = (res, chamberId) => {
    res.cookie('chamberId', chamberId, {
        httpOnly: true,        // JS can't access
        secure: false,          // HTTPS only (set false for local dev)
        sameSite: 'lax',    // use 'strict' for actual CSRF protection
        maxAge: 60 * 60 * 1000 // 1 hour
    })
}

export const extractChamberId = async (req, res, next) => {
    // Retrieve the token from the cookie
    const chamberId = req.cookies.chamberId

    if(!chamberId) {
        return res.status(401).json({ error: 'User is not associated with a chamber' })
    }

    // Attach the user id to the request object
    req.chamberId = chamberId;
    next();
}
