function emailIsValid(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function passwordIsValid(password) {
    if (password.length >= 6) {
        return true;
    }
    return false;
}

function nameIsValid(name) {
    return name?.length >= 1
}

function personalIdIsValid(id) {
    return personnummer.validate(id);
}