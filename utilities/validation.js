function emailIsValid(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function passwordIsValid(password) {
    if (password.length >= 6) {
        return true;
    }
    return false;
}

function confirmPasswordIsValid(password, confirmPassword) {
    if (password === confirmPassword) {
        return true;
    }
    return false;
}

function nameIsValid(name) {
    if (name.length >= 2) { return true; }
    return false;

}

function personalIdIsValid(id) {
    return personnummer.validate(id);
}

export { emailIsValid, passwordIsValid, confirmPasswordIsValid, nameIsValid, personalIdIsValid }