from django.urls import path
from . import views

app_name = 'race'

urlpatterns = [
    path('api/races/', views.races),
    path('api/race/<int:race_id>/', views.race_detail),
    path('api/profiles/', views.profiles),
    path("api/profile/", views.profile_view),
    path('api/runnersignups/', views.runnersignups, name='runnersignups'),
    path('api/runnersignups/<int:runnersignup_id>/', views.runnersignup_detail, name='runnersignup_detail'),
    path('api/volunteersignups/', views.volunteersignups),
    path('api/volunteersignups/<int:volunteersignup_id>/', views.volunteersignup_detail),
    path('api/status/<int:race_id>/', views.check_signup_status),
    path("api/my-runnersignups/", views.my_runner_signups),
    path('api/my-runnersignups/<int:pk>/', views.delete_runner_signup),
    path("api/my-volunteersignups/", views.my_volunteer_signups),
    path('api/my-volunteersignups/<int:pk>/', views.delete_volunteer_signup),



    # ----------------------------
    # LOGIN e LOGOUT
    # ----------------------------
    path("api/signup/", views.signup),
    path("api/login/", views.login_view),
    path("api/logout/", views.logout_view),
    path("api/user/", views.user_view),
]