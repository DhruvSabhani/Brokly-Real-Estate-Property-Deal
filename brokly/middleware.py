class ultiSessionMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        host = request.get_host()

        if host.startswith("user."):
            request.session_cookie_name = "user_session"
        elif host.startswith("broker."):
            request.session_cookie_name = "broker_session"
        elif host.startswith("admin."):
            request.session_cookie_name = "admin_session"
        else:
            request.session_cookie_name = "default_session"

        response = self.get_response(request)

        if request.session.session_key:
            response.set_cookie(
                request.session_cookie_name,
                request.session.session_key,
                httponly=True,
                samesite="Lax",
            )

        return response
