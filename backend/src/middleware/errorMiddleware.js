exports.errorHandler = (err, req, res, next) => {
    console.error(`[ERROR] ${new Date().toISOString()} - ${req.method} ${req.url}:`, err);

    // Gestion des erreurs de parsing JSON (souvent Bad Request 400)
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({
            Status: "Error",
            Error: "JSON malformé. Vérifiez la syntaxe de votre requête."
        });
    }

    const statusCode = err.statusCode || 500;
    // En production, masquer les détails des erreurs 500
    const message = (statusCode === 500 && process.env.NODE_ENV === 'production')
        ? "Une erreur interne est survenue."
        : (err.message || "Erreur inconnue");

    res.status(statusCode).json({
        Status: "Error",
        Error: message, // Utiliser 'Error' pour la consistance avec le frontend
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};
