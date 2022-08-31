const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

module.exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, (err) => {
            if (err) {
                req.flash('error', err.message);
                return res.redirect('/register');
            }
            req.flash('success', `Welcome to the Park Review, ${registeredUser.username}!`);
            res.redirect('/parks');
        });
    } catch (err) {
        req.flash('error', err.message);
        res.redirect('/register');
    }
}
module.exports.renderLogin = async (req, res) => { res.render('users/login') }

module.exports.login = (req, res) => {
    req.flash('success', 'You are logged in');
    const redirectUrl = req.session.returnTo || '/parks';
    res.redirect(redirectUrl);
}
module.exports.logout = (req, res) => {
    req.logout(req, err => {
        if (err) {
            req.flash('error', err.message);
            return res.redirect('/parks');
        }
        req.flash('success', 'You are logged out');
        res.redirect('/parks');
    });
}