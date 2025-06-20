(async function () {
    const console = require('tracer').colorConsole();
    const express = require('express');
    const app = express();
    const cors = require("cors");
    const helmet = require('helmet');
    const compression = require('compression');
    const userAgent = require('express-useragent');
    const bodyParser = require("body-parser");
    const sanitizeHtml = require('sanitize-html');
    const router = express.Router();
    const { AttackBlokade, IPManager } = require("Shared/Helpers/secure_rest");
    const f = require("Shared/Helpers/f");
    const http = require('http').createServer(app);

    http.listen(process.env.PORT, function () {
        console.info('Listening port : '+process.env.PORT);
    });

    // Basic middleware
    app.use(compression());
    app.use(cors({ origin: '*' }));
    app.use(helmet());
    app.use(userAgent.express());

    app.use((req, res, next) => {
        try {
            const ip = f.ip(req);
            if (IPManager.isBlocked(ip)) {
                console.warn('Blocked:', ip);
                return res.status(403).json({
                    success: false,
                    message: 'IP_BLOCKED',
                    ip: ip
                });
            }
            next();
        } catch (error) {
            next(error);
        }
    });

    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    // Sanitize middleware
    app.use((req, res, next) => {
        const sanitizeAndTrimObject = (obj) => {
            for (let key in obj) {
                if (typeof obj[key] === 'string') {
                    obj[key] = sanitizeHtml(obj[key], {
                        allowedTags: [],
                        allowedAttributes: {}
                    }).trim();
                } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                    sanitizeAndTrimObject(obj[key]);
                }
            }
        };

        if (req.body) sanitizeAndTrimObject(req.body);
        if (req.query) sanitizeAndTrimObject(req.query);
        next();
    });

    // Git security
    app.use((req, res, next) => {
        if (req.url.startsWith('/.git')) {
            res.status(403).send('Access to .git directory and its contents is forbidden.');
        } else {
            next();
        }
    });

    app.use("/", router);

    // Error handler - artık IP kontrolü burada değil
    app.use((err, req, res, next) => {
        if (err.message.includes('ERR_HTTP_HEADERS_SENT')) {
            return next();
        } else if (err.type == 'entity.too.large') {
            return res.status(413).json({
                success: false,
                message: "Payload_size :" + (err.received / 1024) + " KB. , limit : " + (err.limit / 1024) + " KB., request_entity_too_large"
            });
        }
        return res.status(501).json({
            success: false,
            message: "no_valid_json_sent"
        });
    });

    // Routes
    const routes = [
        { path: '/finance', module: 'Finance' },
    ];

    routes.map(({ path, module }) => app.use(path, require(`../Routes/${module}`)));

    module.exports = {
        http: http,
        app: app,
    };
})();