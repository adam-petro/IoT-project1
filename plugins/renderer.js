const express = require('express');
const app = express();


module.exports = function RenderHTML(req, res, next) {

    if (req.accepts()[0] === 'text/html' && res.body) {

        let responseData = res.body;

        //Determine the parent uri path
        let path = req.originalUrl;
        if (path.substring(path.length - 1, path.length) == '/') path = path.substring(0, path.length - 1);
        let parentPath = path.substring(0, path.lastIndexOf('/'));
        if (path.substring(path.length - 2, path.length) == "pi") parentPath = undefined;


        //Determine the children pages and rest of the properties that were not extracted
        let childPages = [];
        let properties = {};
        Object.keys(responseData).forEach((key) => {
            if (typeof responseData[key] === 'object' && key !== 'actions') {
                childPages.push(path + "/" + key);
            }
            else {
                if (key !== 'name' && key !== 'description' && key !== 'actions') properties[key] = responseData[key];
            }
        })


        //Collect all available data from json to render later
        let renderData = {
            "key": path.substring(path.lastIndexOf('/') + 1, path.length).charAt(0).toUpperCase() + path.substring(path.lastIndexOf('/') + 2, path.length),
            "parentPage": parentPath,
            "childPages": childPages,
            "name": responseData.name,
            "description": responseData.description,
            "properties": properties,
            "actions": responseData.actions,
        };


        res.render('../views/pages/apiTemplate.ejs', { renderData: renderData });
    }
    else {
        res.send(res.body);
        next();
    }
}

