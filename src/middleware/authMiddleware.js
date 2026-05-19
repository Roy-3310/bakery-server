import passport from 'passport'
import { HTTP } from '../constants/httpStatus.js'
import { MSG } from '../constants/messages.js'
import { fail } from '../utils/responseUtils.js'

export function requireAuth(req, res, next) {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err) return next(err)
    if (!user) return fail(res, MSG.UNAUTHORIZED, HTTP.UNAUTHORIZED)
    req.user = user
    next()
  })(req, res, next)
}

export function requireAdmin(req, res, next) {
  requireAuth(req, res, () => {
    if (req.user?.role !== 'admin') {
      return fail(res, MSG.FORBIDDEN, HTTP.FORBIDDEN)
    }
    next()
  })
}
