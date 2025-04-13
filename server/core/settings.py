from pathlib import Path
from environ import Env
import dj_database_url

env = Env()
env.read_env()
# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = env('SECRET_KEY')

# SECURITY WARNING: don't run with debug turned on in production!

#for development
# DEBUG = True
# for production
DEBUG = env("DEBUG")

ALLOWED_HOSTS = ['*']


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites',
    'corsheaders',

    'rest_framework',
    'rest_framework.authtoken',  # Required for token authentication
    'allauth',
    'allauth.account',
    'allauth.socialaccount',  # Add this even if you're not using social auth
    'dj_rest_auth',
    'dj_rest_auth.registration',

    'api',
]

SITE_ID = 1

SOCIALACCOUNT_PROVIDERS = {}

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'allauth.account.middleware.AccountMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
]

ROOT_URLCONF = 'core.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]


WSGI_APPLICATION = 'core.wsgi.application'


# Database
# https://docs.djangoproject.com/en/5.2/ref/settings/#databases


#for development
# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.sqlite3',
#         'NAME': BASE_DIR / 'db.sqlite3',
#     }
# }

#for production
DATABASES = {}
DATABASES['default'] = dj_database_url.parse(env('DATABASE_URL'))

CORS_ALLOW_ALL_ORIGINS = False #just for developemnt

CORS_ALLOW_CREDENTIALS = True
CSRF_COOKIE_SAMESITE = 'Lax'  # Use 'None' for cross-site requests with credentials
CSRF_COOKIE_HTTPONLY = False  # False so JavaScript can read the cookie
CSRF_USE_SESSIONS = False  # Store CSRF token in cookie, not in session
CSRF_COOKIE_SECURE = True  # Set to True in production with HTTPS




# Password validation
# https://docs.djangoproject.com/en/5.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.2/howto/static-files/

STATIC_URL = 'static/'

# Default primary key field type
# https://docs.djangoproject.com/en/5.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


AUTHENTICATION_BACKENDS = [
    # Needed to login by username in Django admin
    'django.contrib.auth.backends.ModelBackend',
    
    # allauth specific authentication methods
    'allauth.account.auth_backends.AuthenticationBackend',
]

# Rest Framework settings
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],
}

# Django Allauth settings
# New way to configure authentication and signup fields
ACCOUNT_LOGIN_METHODS = {'email', 'username'}  # Replaces ACCOUNT_AUTHENTICATION_METHOD
ACCOUNT_SIGNUP_FIELDS = ['email*', 'username*', 'first_name*', 'last_name*', 'password1*', 'password2*']
ACCOUNT_UNIQUE_EMAIL = True  # This setting is still valid
ACCOUNT_EMAIL_VERIFICATION = 'optional'  # Change to 'mandatory' if you want to enforce email verification

# Allow REST API endpoints to use sessions/cookies
REST_SESSION_LOGIN = True


#change to smtp  
# EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'


# settings.py

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True  # Use TLS for secure connection
EMAIL_HOST_USER = env('EMAIL_ADDRESS')  # Your Gmail address
EMAIL_HOST_PASSWORD = env('EMAIL_HOST_PASSWORD')  # Your Gmail password
DEFAULT_FROM_EMAIL = f'SocrAI {env("EMAIL_ADDRESS")}'
ACCCOUNT_EMAIL_SUBJECT_PREFIX = ''


ACCOUNT_USERNAME_BLACKLIST = ['admin', 'accounts', 'onlyauthor']

REST_AUTH = {
    'REGISTER_SERIALIZER': 'api.serializers.CustomRegisterSerializer',
}