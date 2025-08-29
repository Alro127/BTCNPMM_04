const path = require('path');
const express = require('express');

const configViewEngine = (app) => {
    app.set('view', path.join('./src', 'views'));
    app.set('view egine', 'ejs');

    app.use(express.static(path.join('./src', 'public')));
}

module.exports = configViewEngine;