
from dj_rest_auth.registration.views import RegisterView
from django.contrib.auth import get_user_model
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.views.decorators.csrf import ensure_csrf_cookie


class CustomRegisterView(RegisterView):
    def perform_create(self, serializer):
        user = super().perform_create(serializer)
        user.first_name = self.request.data.get('first_name', '')
        user.last_name = self.request.data.get('last_name', '')
        user.save()
        return user
    

@ensure_csrf_cookie
def get_csrf_token(request):
    """
    Get the CSRF token needed for making POST requests
    """
    return JsonResponse({'csrfToken': get_token(request)})