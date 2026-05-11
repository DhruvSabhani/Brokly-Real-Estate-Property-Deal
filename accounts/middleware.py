from django.shortcuts import redirect


class RoleAuthMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):

        path = request.path

        if path.startswith("/broker"):
            if not request.session.get("broker_login"):
                return redirect("/broker/login/")

        elif path == "/":
            if not request.session.get("user_login"):
                return redirect("/login/")

        return self.get_response(request)
