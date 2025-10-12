function isAdmin(req, res, next) {
    if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
    if (Number(req.user.perfil_id) === 1) return next();
    return res.status(403).json({ message: 'Admin role required' });
}

function isContributorOrAdmin(req, res, next) {
    if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
    const pid = Number(req.user.perfil_id);
    if (pid === 1 || pid === 2) return next();
    return res.status(403).json({ message: 'Contributor or Admin role required' });
}

module.exports = { isAdmin, isContributorOrAdmin };
