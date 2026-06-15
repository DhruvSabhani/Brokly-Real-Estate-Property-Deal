from django.shortcuts import redirect
from django.utils import translation


class RoleAuthMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):

        path = request.path

        if path.startswith("portal/"):
            if not request.session.get("portal_login"):
                return redirect("/portal/login/")

        elif path == "/":
            if not request.session.get("user_login"):
                return redirect("/login/")

        return self.get_response(request)


class PanelLanguageMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.path.startswith("/portal"):
            language = request.session.get("portal_language", "en")
        else:
            language = request.session.get("user_language", "en")
        translation.activate(language)
        request.LANGUAGE_CODE = language
        response = self.get_response(request)
        response.set_cookie("django_language", language)
        translation.deactivate()
        return response
